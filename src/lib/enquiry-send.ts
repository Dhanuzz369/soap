/**
 * Sends the step form's answers to the Google Sheet (Apps Script web app, docs/enquiry-sheet-setup.md).
 * - step(): after each Next, fire-and-forget with keepalive, so it never blocks the form and still
 *   leaves if the buyer closes the tab. It resolves (never rejects) with the result.
 * - submit(): the final send. Awaited, sent once however often it is called while in flight, held
 *   until `minMs` after page load (a spam check that delays, never drops) and abandoned after
 *   `timeoutMs`, so the WhatsApp / email fallback can take over.
 * The body is JSON sent as text/plain, which is a "simple" request: no CORS preflight.
 */
import type { Payload } from './enquiry-steps';

/** Keep in step with isConfiguredEnquiryEndpoint in scripts/placeholder-rules.mjs (a test checks). */
const ENDPOINT = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;
export function isConfiguredEndpoint(url: string): boolean {
  return ENDPOINT.test(url ?? '');
}

export type SendResult = 'ok' | 'failed';
export type Sender = {
  step(p: Payload): Promise<SendResult>;
  submit(p: Payload): Promise<SendResult>;
};

const HEADERS = { 'Content-Type': 'text/plain;charset=utf-8' };

async function readOk(res: Response): Promise<SendResult> {
  if (!res.ok) return 'failed';
  try {
    const body = JSON.parse(await res.text());
    return body && body.ok === true ? 'ok' : 'failed';
  } catch {
    return 'failed';
  }
}

export function createSender(o: {
  endpoint: string;
  fetch: typeof fetch;
  loadedAt: number;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
  timeoutMs?: number;
  minMs?: number;
}): Sender {
  const configured = isConfiguredEndpoint(o.endpoint);
  const now = o.now ?? (() => Date.now());
  const sleep = o.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  const timeoutMs = o.timeoutMs ?? 15_000;
  const minMs = o.minMs ?? 3_000;
  let inFlight: Promise<SendResult> | null = null;

  const step = async (p: Payload): Promise<SendResult> => {
    if (!configured) return 'failed';
    try {
      return await readOk(await o.fetch(o.endpoint, { method: 'POST', keepalive: true, headers: HEADERS, body: JSON.stringify(p) }));
    } catch {
      return 'failed';
    }
  };

  const send = async (p: Payload): Promise<SendResult> => {
    if (!configured) return 'failed';
    const wait = o.loadedAt + minMs - now();
    if (wait > 0) await sleep(wait);
    const ctrl = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<SendResult>((resolve) => {
      timer = setTimeout(() => {
        ctrl.abort();
        resolve('failed');
      }, timeoutMs);
    });
    const request = (async (): Promise<SendResult> => {
      try {
        return await readOk(await o.fetch(o.endpoint, { method: 'POST', headers: HEADERS, body: JSON.stringify(p), signal: ctrl.signal }));
      } catch {
        return 'failed';
      }
    })();
    try {
      return await Promise.race([request, timeout]);
    } finally {
      clearTimeout(timer);
    }
  };

  const submit = (p: Payload): Promise<SendResult> => {
    if (!inFlight) inFlight = send(p).finally(() => (inFlight = null));
    return inFlight;
  };

  return { step, submit };
}

export const LEAD_KEY = 'goodbiz-enquiry-lead';

/**
 * One lead id per visit, kept in sessionStorage so a reload continues the same sheet row.
 * Without storage (private mode, blocked) it lives in memory only.
 */
export function leadIdStore(storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null, uuid: () => string) {
  let id: string | null = null;
  const save = (v: string) => {
    try {
      storage?.setItem(LEAD_KEY, v);
    } catch {
      /* memory only */
    }
  };
  return {
    get(): string {
      if (id) return id;
      try {
        id = storage?.getItem(LEAD_KEY) ?? null;
      } catch {
        id = null;
      }
      if (!id) {
        id = uuid();
        save(id);
      }
      return id;
    },
    reset(): void {
      id = uuid();
      save(id);
    },
  };
}
