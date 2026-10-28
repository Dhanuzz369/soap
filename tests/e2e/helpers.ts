import { chromium, type Browser, type BrowserContextOptions, type Page, type Route } from 'playwright-core';

export const BASE = 'http://localhost:4329';
export const ENDPOINT = 'https://script.google.com/macros/s/TEST/exec';

export async function launch(): Promise<Browser> {
  const executablePath = process.env.CHROME_PATH;
  return executablePath ? chromium.launch({ executablePath }) : chromium.launch({ channel: 'chrome' });
}

export type Body = { leadId: string; stage: string; lang: string; page: string; ts: string; fields: Record<string, string> };

export type Mock = 'ok' | 500 | 'hang' | 'none';

/**
 * A page with the enquiry endpoint pointed at ENDPOINT (none at all for mock 'none') and every request
 * to it recorded. `opts.timeout` shortens the final send's timeout.
 */
export async function open(
  browser: Browser,
  path = '/contact/',
  o: { mock?: Mock; timeout?: number; context?: BrowserContextOptions } = {},
): Promise<{ page: Page; bodies: Body[]; errors: string[] }> {
  const mock = o.mock ?? 'ok';
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ...o.context });
  const page = await context.newPage();
  const bodies: Body[] = [];
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  // Tests never reach the real Google Sheet in site.ts: every Apps Script request is blocked, and
  // the page's endpoint is always set here ('' = no endpoint for mock 'none').
  await context.route('https://script.google.com/**', (route: Route) => route.abort());
  await page.addInitScript(
    ([endpoint, timeout]) => {
      (window as unknown as Record<string, unknown>).__ENQ_ENDPOINT__ = endpoint;
      if (timeout) (window as unknown as Record<string, unknown>).__ENQ_TIMEOUT__ = timeout;
    },
    [mock === 'none' ? '' : ENDPOINT, o.timeout ?? 0] as const,
  );
  if (mock !== 'none') {
    await page.route(ENDPOINT, async (route: Route) => {
      const raw = route.request().postData() ?? '{}';
      bodies.push(JSON.parse(raw));
      const headers = { 'access-control-allow-origin': '*' };
      if (mock === 'hang') return; // never answers
      if (mock === 500) return route.fulfill({ status: 500, headers, body: 'error' });
      return route.fulfill({ status: 200, headers, contentType: 'application/json', body: '{"ok":true}' });
    });
  }
  await page.goto(BASE + path);
  await page.waitForSelector('form.is-enhanced', { timeout: 5000 });
  return { page, bodies, errors };
}

export const active = (page: Page) => page.$eval('section[data-step][data-active]', (s) => (s as HTMLElement).dataset.step);
export const label = (page: Page) => page.$eval('[data-step-label]', (s) => s.textContent?.trim());
export const waitStep = (page: Page, step: string) => page.waitForSelector(`section[data-step="${step}"][data-active]`);
export const stages = (bodies: Body[]) => bodies.map((b) => b.stage);

export async function fillContact(page: Page, name = 'Ali Hassan', phone = '+971 50 123 4567', then = 'group') {
  await page.fill('#enq-name', name);
  await page.fill('#enq-phone', phone);
  await page.click('[data-next]');
  await waitStep(page, then);
}

export const pick = (page: Page, inputId: string) => page.click(`label:has(> #${inputId})`);
