import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { safeCell } from '../../src/lib/enquiry-steps';

const SOURCE = readFileSync(new URL('../../scripts/apps-script/enquiry.gs', import.meta.url), 'utf8');

type Ctx = {
  doPost: (e: unknown) => { kind: string; content: string };
  safeCell: (v: string) => string;
};

/** A fake Google Sheets / Mail / Lock runtime, enough for enquiry.gs. */
function runtime() {
  const rows: unknown[][] = [];
  const mails: { to: string; subject: string; body: string }[] = [];
  const lock = { held: false, released: 0 };
  let clock = Date.parse('2026-10-27T10:00:00Z');
  const sheet = {
    getLastRow: () => rows.length,
    getDataRange: () => ({ getValues: () => rows.map((r) => [...r]) }),
    appendRow: (r: unknown[]) => void rows.push([...r]),
    getRange: (row: number, col: number, nr = 1, nc = 1) => ({
      setValues: (v: unknown[][]) => {
        for (let i = 0; i < nr; i++) for (let j = 0; j < nc; j++) {
          rows[row - 1 + i] ??= [];
          rows[row - 1 + i][col - 1 + j] = v[i][j];
        }
      },
    }),
    setFrozenRows: () => {},
  };
  const props: Record<string, string> = { ALERT_EMAIL: 'sales@example.com' };
  const ctx = vm.createContext({
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: () => sheet, insertSheet: () => sheet }) },
    LockService: {
      getScriptLock: () => ({
        waitLock: () => (lock.held = true),
        releaseLock: () => {
          lock.held = false;
          lock.released++;
        },
      }),
    },
    MailApp: { sendEmail: (to: string, subject: string, body: string) => void mails.push({ to, subject, body }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k: string) => props[k] ?? null }) },
    ContentService: {
      MimeType: { JSON: 'json' },
      createTextOutput: (content: string) => ({ kind: 'text', content, setMimeType() { return this; } }),
    },
    HtmlService: { createHtmlOutput: (content: string) => ({ kind: 'html', content }) },
    Utilities: { getUuid: () => 'uuid-from-script-0001' },
    Date: class extends Date {
      constructor(...a: unknown[]) {
        // @ts-expect-error spread into Date
        super(...(a.length ? a : [clock]));
      }
    },
  });
  vm.runInContext(SOURCE, ctx);
  return { ctx: ctx as unknown as Ctx, rows, mails, lock, tick: (ms: number) => (clock += ms) };
}

const post = (body: object) => ({ postData: { type: 'text/plain', contents: JSON.stringify(body) }, parameter: {} });
const lead = (stage: string, fields: Record<string, string>, leadId = '0b9f1c2e-1234-4abc-9def-001122334455') => ({ leadId, stage, lang: 'en', page: '/contact/', ts: '2026-10-27T10:00:00.000Z', fields });

let rt: ReturnType<typeof runtime>;
const col = (name: string) => (rt.rows[0] as string[]).indexOf(name);
beforeEach(() => {
  rt = runtime();
});

describe('enquiry.gs', () => {
  it('creates the header row and upserts one row per leadId', () => {
    rt.ctx.doPost(post(lead('contact', { name: 'Ali', email: 'ali@example.ae' })));
    const first = rt.rows[1][col('firstSeen')];
    rt.tick(60_000);
    rt.ctx.doPost(post(lead('quantity', { quantity: '1 container' })));
    expect(rt.rows).toHaveLength(2);
    expect(rt.rows[0].slice(0, 4)).toEqual(['leadId', 'firstSeen', 'updated', 'stage']);
    expect(rt.rows[1][col('firstSeen')]).toBe(first);
    expect(rt.rows[1][col('updated')]).not.toBe(first);
    expect(rt.rows[1][col('stage')]).toBe('quantity');
    expect(rt.rows[1][col('quantity')]).toBe('1 container');
  });
  it('never overwrites a filled cell with an empty value', () => {
    rt.ctx.doPost(post(lead('contact', { name: 'Ali', email: 'ali@example.ae' })));
    rt.ctx.doPost(post(lead('group', { name: 'Ali', email: '' })));
    expect(rt.rows[1][col('email')]).toBe('ali@example.ae');
  });
  it('keeps "submitted" when a late step arrives after it', () => {
    rt.ctx.doPost(post(lead('submitted', { name: 'Ali' })));
    rt.ctx.doPost(post(lead('terms', { terms: 'FOB' })));
    expect(rt.rows[1][col('stage')]).toBe('submitted');
  });
  it('quotes values a spreadsheet would run as formulas', () => {
    rt.ctx.doPost(post(lead('contact', { name: '=HYPERLINK("x")', phone: '+971501234567' })));
    expect(rt.rows[1][col('name')]).toBe('\'=HYPERLINK("x")');
    expect(rt.rows[1][col('phone')]).toBe("'+971501234567");
  });
  it('has the same safeCell as the site', () => {
    for (const v of ['=1', '+1', '-1', '@a', '\tx', '\rx', 'Lemon', '', "'quoted", ' =x']) expect(rt.ctx.safeCell(v)).toBe(safeCell(v));
  });
  it('emails an alert on contact and submitted only', () => {
    rt.ctx.doPost(post(lead('contact', { name: 'Ali', phone: '971501234567' })));
    rt.ctx.doPost(post(lead('group', { group: 'Kitchen care' })));
    rt.ctx.doPost(post(lead('submitted', { notes: 'Lemon' })));
    expect(rt.mails.map((m) => m.to)).toEqual(['sales@example.com', 'sales@example.com']);
    expect(rt.mails[0].body).toContain('Name: Ali');
    expect(rt.mails[1].body).toContain('Group: Kitchen care');
  });
  it('stores a no-JS form post and answers with a thank-you page linking to the site', () => {
    const out = rt.ctx.doPost({ parameter: { name: 'Ana', email: 'ana@example.pt', stage: 'submitted', language: 'Português', leadId: '' }, postData: { type: 'application/x-www-form-urlencoded', contents: 'name=Ana' } });
    expect(rt.rows).toHaveLength(2);
    expect(rt.rows[1][col('name')]).toBe('Ana');
    expect(rt.rows[1][col('leadId')]).toBe('uuid-from-script-0001');
    expect(out.kind).toBe('html');
    expect(out.content).toMatch(/href="https:\/\/www\.goodbizhygiene\.com\/"/);
  });
  it('answers a JSON post with {"ok":true}', () => {
    const out = rt.ctx.doPost(post(lead('contact', { name: 'Ali' })));
    expect(JSON.parse(out.content)).toEqual({ ok: true });
  });
  it('refuses a JSON post with a missing or malformed leadId and writes nothing', () => {
    for (const id of ['', 'x', '<script>alert(1)</script>']) {
      const out = rt.ctx.doPost(post(lead('contact', { name: 'Ali' }, id)));
      expect(JSON.parse(out.content)).toEqual({ ok: false });
    }
    expect(JSON.parse(rt.ctx.doPost({ postData: { type: 'text/plain', contents: '{bad json' }, parameter: {} }).content)).toEqual({ ok: false });
    expect(rt.rows.length).toBeLessThanOrEqual(1);
  });
  it('ignores a ticked honeypot', () => {
    rt.ctx.doPost({ parameter: { name: 'Bot', website_confirm: 'on' }, postData: { type: 'application/x-www-form-urlencoded', contents: '' } });
    expect(rt.rows.length).toBeLessThanOrEqual(1);
  });
  it('always releases the lock', () => {
    rt.ctx.doPost(post(lead('contact', { name: 'Ali' })));
    rt.ctx.doPost(post(lead('contact', { name: 'Ali' }, 'bad')));
    expect(rt.lock.released).toBe(2);
    expect(rt.lock.held).toBe(false);
  });
});
