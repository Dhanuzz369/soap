import { describe, it, expect, vi } from 'vitest';
import { createSender, isConfiguredEndpoint, leadIdStore, LEAD_KEY } from '../../src/lib/enquiry-send';
import type { Payload } from '../../src/lib/enquiry-steps';
// @ts-ignore plain ESM module shared with scripts/check-placeholders.mjs
import { isConfiguredEnquiryEndpoint } from '../../scripts/placeholder-rules.mjs';

const URL_OK = 'https://script.google.com/macros/s/AKfycbx_abc-123/exec';
const payload = (stage: Payload['stage'] = 'contact'): Payload => ({ leadId: 'L1', stage, lang: 'en', page: '/contact/', ts: '2026-10-27T00:00:00.000Z', fields: { name: 'Ali' } });
const json = (body: unknown, status = 200) => new Response(typeof body === 'string' ? body : JSON.stringify(body), { status });

function setup(fetchImpl: (...a: unknown[]) => Promise<Response>, o: Partial<Parameters<typeof createSender>[0]> = {}) {
  const fetch = vi.fn(fetchImpl);
  const sleep = vi.fn(async (_ms: number) => {});
  const sender = createSender({ endpoint: URL_OK, fetch: fetch as unknown as typeof globalThis.fetch, loadedAt: 0, now: () => 10_000, sleep, ...o });
  return { fetch, sleep, sender };
}

describe('isConfiguredEndpoint', () => {
  it('accepts only an Apps Script /exec URL', () => {
    expect(isConfiguredEndpoint(URL_OK)).toBe(true);
    expect(isConfiguredEndpoint('PLACEHOLDER_ENQUIRY_ENDPOINT')).toBe(false);
    expect(isConfiguredEndpoint('')).toBe(false);
    expect(isConfiguredEndpoint('https://evil.example/macros/s/x/exec')).toBe(false);
    expect(isConfiguredEndpoint('http://script.google.com/macros/s/x/exec')).toBe(false);
  });
  it('agrees with the placeholder check', () => {
    for (const u of [URL_OK, 'PLACEHOLDER_ENQUIRY_ENDPOINT', '', 'https://script.google.com/macros/s/x/dev']) {
      expect(isConfiguredEnquiryEndpoint(u)).toBe(isConfiguredEndpoint(u));
    }
  });
});

describe('sender.step', () => {
  it('posts the payload as text/plain with keepalive', async () => {
    const { fetch, sender } = setup(async () => json({ ok: true }));
    sender.step(payload());
    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(URL_OK);
    expect(init).toMatchObject({ method: 'POST', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload()) });
  });
  it('swallows a rejection and reports it', async () => {
    const { sender } = setup(async () => {
      throw new Error('offline');
    });
    await expect(sender.step(payload())).resolves.toBe('failed');
  });
  it('makes no request without a configured endpoint', async () => {
    const { fetch, sender } = setup(async () => json({ ok: true }), { endpoint: 'PLACEHOLDER_ENQUIRY_ENDPOINT' });
    await expect(sender.step(payload())).resolves.toBe('failed');
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe('sender.submit', () => {
  it('sends once when called twice at the same time', async () => {
    const { fetch, sender } = setup(async () => json({ ok: true }));
    const [a, b] = await Promise.all([sender.submit(payload('submitted')), sender.submit(payload('submitted'))]);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(a).toBe('ok');
    expect(b).toBe('ok');
  });
  it('waits until 3 s after page load', async () => {
    const { fetch, sleep, sender } = setup(async () => json({ ok: true }), { loadedAt: 0, now: () => 1000 });
    await sender.submit(payload('submitted'));
    expect(sleep).toHaveBeenCalledWith(2000);
    expect(sleep.mock.invocationCallOrder[0]).toBeLessThan(fetch.mock.invocationCallOrder[0]);
  });
  it('does not wait after 3 s', async () => {
    const { sleep, sender } = setup(async () => json({ ok: true }), { loadedAt: 0, now: () => 5000 });
    await sender.submit(payload('submitted'));
    expect(sleep).not.toHaveBeenCalled();
  });
  it('is ok on {ok:true}', async () => {
    const { sender } = setup(async () => json({ ok: true }));
    expect(await sender.submit(payload('submitted'))).toBe('ok');
  });
  it('non-ok response is failure', async () => {
    for (const r of [() => json({ ok: true }, 500), () => json('<html>'), () => json({ ok: false }), () => json('')]) {
      const { sender } = setup(async () => r());
      expect(await sender.submit(payload('submitted'))).toBe('failed');
    }
  });
  it('fails after the timeout when the request never answers, and aborts it', async () => {
    let signal: AbortSignal | undefined;
    const { sender } = setup((_u, init) => {
      signal = (init as RequestInit).signal ?? undefined;
      return new Promise(() => {});
    }, { timeoutMs: 20 });
    expect(await sender.submit(payload('submitted'))).toBe('failed');
    expect(signal?.aborted).toBe(true);
  });
  it('fails at once without a configured endpoint', async () => {
    const { fetch, sender } = setup(async () => json({ ok: true }), { endpoint: 'PLACEHOLDER_ENQUIRY_ENDPOINT' });
    expect(await sender.submit(payload('submitted'))).toBe('failed');
    expect(fetch).not.toHaveBeenCalled();
  });
  it('uses a 15 s timeout and a 3 s minimum by default', async () => {
    vi.useFakeTimers();
    try {
      const { sender } = setup(() => new Promise(() => {}), { sleep: undefined, now: () => 10_000 });
      let result: string | undefined;
      void sender.submit(payload('submitted')).then((r) => (result = r));
      await vi.advanceTimersByTimeAsync(14_900);
      expect(result).toBeUndefined();
      await vi.advanceTimersByTimeAsync(200);
      expect(result).toBe('failed');
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('leadIdStore', () => {
  const memoryStorage = () => {
    const m = new Map<string, string>();
    return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), m };
  };
  it('keeps one id and stores it under goodbiz-enquiry-lead', () => {
    let n = 0;
    const s = memoryStorage();
    const store = leadIdStore(s, () => `id-${++n}`);
    expect(store.get()).toBe('id-1');
    expect(store.get()).toBe('id-1');
    expect(LEAD_KEY).toBe('goodbiz-enquiry-lead');
    expect(s.m.get('goodbiz-enquiry-lead')).toBe('id-1');
  });
  it('continues the stored id after a reload', () => {
    const s = memoryStorage();
    s.setItem('goodbiz-enquiry-lead', 'old');
    expect(leadIdStore(s, () => 'new').get()).toBe('old');
  });
  it('reset starts a new id', () => {
    let n = 0;
    const s = memoryStorage();
    const store = leadIdStore(s, () => `id-${++n}`);
    store.get();
    store.reset();
    expect(store.get()).toBe('id-2');
    expect(s.m.get('goodbiz-enquiry-lead')).toBe('id-2');
  });
  it('works in memory without storage, or when storage throws', () => {
    let n = 0;
    const store = leadIdStore(null, () => `m-${++n}`);
    expect(store.get()).toBe('m-1');
    expect(store.get()).toBe('m-1');
    const throwing = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); }, removeItem: () => {} };
    const t = leadIdStore(throwing, () => 'x');
    expect(t.get()).toBe('x');
  });
});
