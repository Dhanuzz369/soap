/**
 * The cookie banner and Google Analytics consent in a real browser (spec 2026-11-01 §3, §7).
 * Run `npm run build` first. Every request to Google's tag and collection servers is blocked and
 * recorded: none may happen before consent, and none after Accept either, because the test host
 * (localhost) is not the site's domain, so the host check keeps analytics off.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Browser, BrowserContextOptions, Page } from 'playwright-core';
import { launch, open, blockAnalytics, waitStep, BASE } from './helpers';

let browser: Browser;
beforeAll(async () => {
  browser = await launch();
});
afterAll(async () => {
  await browser?.close();
});

const BANNER = '[data-consent]';
const ACCEPT = '[data-consent-choice="granted"]';
const REJECT = '[data-consent-choice="denied"]';
const SETTINGS = '[data-consent-open]';

async function visit(path = '/', context: BrowserContextOptions = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, ...context });
  const ga = await blockAnalytics(ctx);
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(BASE + path);
  await page.waitForLoadState('load');
  return { page, ga, errors };
}
const stored = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('gb-consent') ?? 'null'));
const shown = (page: Page) => page.isVisible(BANNER);
const box = (page: Page, sel: string) => page.$eval(sel, (e) => e.getBoundingClientRect().toJSON() as DOMRect);
const overlap = (a: DOMRect, b: DOMRect) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
/** Nothing of Google's tag ran: no dataLayer, no gtag, no _ga cookies. */
const noTag = (page: Page) => page.evaluate(() => ({ dataLayer: 'dataLayer' in window, gtag: 'gtag' in window, cookies: document.cookie }));
const settle = (page: Page) => page.waitForTimeout(400);

describe('cookie banner', () => {
  it('shows on a first visit, as a labelled region with two equal buttons, and nothing is loaded', async () => {
    const { page, ga, errors } = await visit('/');
    await page.waitForSelector(`${BANNER}:not([hidden])`);
    expect(await shown(page)).toBe(true);
    expect(await page.getAttribute(BANNER, 'role')).toBe('region');
    expect(await page.getAttribute(BANNER, 'aria-label')).toBe('Cookie choice');
    const text = (await page.textContent(BANNER))!.replace(/\s+/g, ' ');
    expect(text).toContain("We’d like to use Google Analytics cookies to see which pages and products buyers look at, so we can improve the site. No advertising, and nothing about you is sold.");
    expect(await page.getAttribute(`${BANNER} a`, 'href')).toBe('/cookies/');
    expect(await page.$eval(ACCEPT, (b) => b.tagName)).toBe('BUTTON');
    expect(await page.$eval(REJECT, (b) => b.tagName)).toBe('BUTTON');
    expect((await page.textContent(ACCEPT))!.trim()).toBe('Accept');
    expect((await page.textContent(REJECT))!.trim()).toBe('Reject');
    // Equal choice: same size, same look.
    const [a, r] = [await box(page, ACCEPT), await box(page, REJECT)];
    expect(Math.abs(a.width - r.width)).toBeLessThan(1);
    expect(Math.abs(a.height - r.height)).toBeLessThan(1);
    const look = (sel: string) => page.$eval(sel, (b) => { const s = getComputedStyle(b); return [s.backgroundColor, s.color, s.fontWeight, s.fontSize, s.borderTopWidth, s.borderTopColor].join('|'); });
    expect(await look(ACCEPT)).toBe(await look(REJECT));
    // Not a wall: the page underneath still scrolls and takes clicks.
    const bannerBox = await box(page, BANNER);
    expect(bannerBox.height).toBeLessThan(844 / 2);
    expect(await stored(page)).toBeNull();
    expect(await noTag(page)).toEqual({ dataLayer: false, gtag: false, cookies: '' });
    expect(ga).toEqual([]);
    expect(errors).toEqual([]);
    await page.context().close();
  });

  it('Accept is stored and kept across a reload; on the test host nothing is sent (host check)', async () => {
    const { page, ga, errors } = await visit('/');
    await page.click(ACCEPT);
    await settle(page);
    expect(await shown(page)).toBe(false);
    const rec = await stored(page);
    expect(rec).toMatchObject({ v: 1, analytics: 'granted' });
    expect(new Date(rec.at).toISOString()).toBe(rec.at);
    await page.reload();
    await settle(page);
    expect(await shown(page)).toBe(false);
    // Things that would be events on the live site: still nothing loads or sends here.
    await page.fill('#quote-msg', '1×20ft dish wash');
    await Promise.all([page.waitForURL(/\/contact\//), page.press('#quote-msg', 'Enter')]);
    await page.waitForSelector('form.is-enhanced');
    await settle(page);
    expect(await shown(page)).toBe(false);
    expect(await noTag(page)).toEqual({ dataLayer: false, gtag: false, cookies: '' });
    expect(ga).toEqual([]);
    expect(errors).toEqual([]);
    await page.context().close();
  });

  it('Reject is stored and kept across a reload', async () => {
    const { page, ga } = await visit('/products/');
    await page.click(REJECT);
    await settle(page);
    expect(await shown(page)).toBe(false);
    expect(await stored(page)).toMatchObject({ v: 1, analytics: 'denied' });
    await page.reload();
    await settle(page);
    expect(await shown(page)).toBe(false);
    expect(await noTag(page)).toEqual({ dataLayer: false, gtag: false, cookies: '' });
    expect(ga).toEqual([]);
    await page.context().close();
  });

  it('asks again when the stored choice is older than 12 months', async () => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const ga = await blockAnalytics(ctx);
    const page = await ctx.newPage();
    const old = new Date(Date.now() - 400 * 24 * 3600 * 1000).toISOString();
    await page.addInitScript((at) => localStorage.setItem('gb-consent', JSON.stringify({ v: 1, analytics: 'granted', at })), old);
    await page.goto(BASE + '/');
    await page.waitForSelector(`${BANNER}:not([hidden])`);
    expect(ga).toEqual([]);
    await ctx.close();
  });

  it('"Cookie settings" in the footer reopens it with the current choice; changing it moves focus back', async () => {
    const { page, ga } = await visit('/about/');
    await page.click(ACCEPT);
    await settle(page);
    await page.reload();
    const settings = page.locator(`footer ${SETTINGS}`);
    expect(await settings.isVisible()).toBe(true);
    expect((await settings.textContent())!.trim()).toBe('Cookie settings');
    await settings.click();
    await page.waitForSelector(`${BANNER}:not([hidden])`);
    expect(await page.getAttribute(ACCEPT, 'aria-pressed')).toBe('true');
    expect(await page.getAttribute(REJECT, 'aria-pressed')).toBe('false');
    expect((await page.textContent('[data-consent-current]'))!.trim()).toBe('Your current choice: accepted.');
    expect(await page.evaluate(() => document.activeElement?.closest('[data-consent]') !== null)).toBe(true);
    await page.click(REJECT);
    await settle(page);
    expect(await shown(page)).toBe(false);
    expect(await stored(page)).toMatchObject({ analytics: 'denied' });
    expect(await page.evaluate(() => document.activeElement?.hasAttribute('data-consent-open'))).toBe(true);
    await settings.click();
    await page.waitForSelector(`${BANNER}:not([hidden])`);
    expect(await page.getAttribute(REJECT, 'aria-pressed')).toBe('true');
    expect((await page.textContent('[data-consent-current]'))!.trim()).toBe('Your current choice: rejected.');
    expect(ga).toEqual([]);
    await page.context().close();
  });

  it('withdrawing consent deletes the _ga cookies on the site domain', async () => {
    const { page } = await visit('/');
    await page.click(ACCEPT);
    await settle(page);
    // Stand-ins for the cookies Google Analytics would have set after Accept on the live site.
    await page.evaluate(() => {
      document.cookie = '_ga=GA1.1.1.1; path=/';
      document.cookie = '_ga_FWEG9Y5FVS=GS1.1.1; path=/';
      document.cookie = 'keep=1; path=/';
    });
    await page.click(`footer ${SETTINGS}`);
    await page.click(REJECT);
    await settle(page);
    expect(await page.evaluate(() => document.cookie)).toBe('keep=1');
    await page.context().close();
  });

  it('keyboard only: right after the skip link, Tab reaches the buttons with a visible focus ring; Escape does not dismiss; Enter chooses', async () => {
    const { page, ga } = await visit('/', { viewport: { width: 1440, height: 900 } });
    await page.waitForSelector(`${BANNER}:not([hidden])`);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.getAttribute('href'))).toBe('#main');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.getAttribute('href'))).toBe('/cookies/');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => (document.activeElement as HTMLElement).dataset.consentChoice)).toBe('granted');
    const ring = await page.evaluate(() => { const s = getComputedStyle(document.activeElement!); return { style: s.outlineStyle, width: parseFloat(s.outlineWidth) }; });
    expect(ring.style).toBe('solid');
    expect(ring.width).toBeGreaterThanOrEqual(2);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => (document.activeElement as HTMLElement).dataset.consentChoice)).toBe('denied');
    await page.keyboard.press('Escape');
    await settle(page);
    expect(await shown(page)).toBe(true);
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Enter');
    await settle(page);
    expect(await shown(page)).toBe(false);
    expect(await stored(page)).toMatchObject({ analytics: 'granted' });
    // No focus trap: the next Tab goes on into the page.
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement !== document.body && !document.activeElement?.closest('[data-consent]'))).toBe(true);
    expect(ga).toEqual([]);
    await page.context().close();
  });

  it('Arabic: translated and mirrored', async () => {
    const { page, errors } = await visit('/ar/');
    await page.waitForSelector(`${BANNER}:not([hidden])`);
    expect(await page.$eval(BANNER, (e) => getComputedStyle(e).direction)).toBe('rtl');
    expect((await page.textContent(ACCEPT))!.trim()).not.toBe('Accept');
    expect(await page.getAttribute(BANNER, 'aria-label')).not.toBe('Cookie choice');
    expect(await page.getAttribute(`${BANNER} a`, 'href')).toBe('/ar/cookies/');
    // Accept comes first in reading order: on the right in Arabic.
    const [a, r] = [await box(page, ACCEPT), await box(page, REJECT)];
    expect(a.left).toBeGreaterThan(r.left);
    expect(await page.$eval(`${BANNER} p`, (p) => getComputedStyle(p).textAlign)).toMatch(/right|start/);
    expect(errors).toEqual([]);
    await page.context().close();
  });

  it('no JavaScript: no banner, no Cookie settings button', async () => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const ga = await blockAnalytics(ctx);
    const page = await ctx.newPage();
    await page.goto(BASE + '/');
    expect(await page.isVisible(BANNER)).toBe(false);
    expect(await page.isVisible(SETTINGS)).toBe(false);
    expect(ga).toEqual([]);
    await ctx.close();
  });

  it('the 404 page has no banner', async () => {
    const { page } = await visit('/no-such-page/');
    await settle(page);
    expect(await page.$(BANNER)).toBeNull();
    await page.context().close();
  });
});

describe('cookie banner on a phone', () => {
  it('does not cover the WhatsApp button', async () => {
    for (const path of ['/', '/ar/', '/products/labsa/']) {
      const { page } = await visit(path);
      await page.waitForSelector(`${BANNER}:not([hidden])`);
      await settle(page);
      const fab = await box(page, '.wa-fab');
      expect(overlap(fab, await box(page, BANNER)), path).toBe(false);
      expect(fab.bottom, path).toBeLessThanOrEqual(844);
      // the button is really clickable where it is drawn
      expect(await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('.wa-fab'), [fab.left + fab.width / 2, fab.top + fab.height / 2])).toBe(true);
      await page.context().close();
    }
  });

  it('the page can scroll its last content clear of the banner', async () => {
    const { page } = await visit('/about/');
    await page.waitForSelector(`${BANNER}:not([hidden])`);
    await settle(page);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await settle(page);
    const top = (await box(page, '[data-consent]')).top;
    const backToTop = await page.$eval('.footer-legal-links a[href="#top"]', (e) => e.getBoundingClientRect().bottom);
    expect(backToTop).toBeLessThanOrEqual(top);
    await page.context().close();
  });

  it('does not cover the enquiry form’s Send button', async () => {
    const { page, ga } = await open(browser, '/contact/?product=sles');
    await page.waitForSelector(`${BANNER}:not([hidden])`);
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.click('[data-next]');
    for (let i = 0; i < 3; i++) await page.click('[data-skip]');
    await waitStep(page, 'send');
    await page.$eval('[data-send]', (e) => e.scrollIntoView({ block: 'nearest' }));
    await settle(page);
    const send = await box(page, '[data-send]');
    expect(overlap(send, await box(page, BANNER))).toBe(false);
    expect(await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('[data-send]'), [send.left + send.width / 2, send.top + send.height / 2])).toBe(true);
    expect(await shown(page)).toBe(true);
    expect(ga).toEqual([]);
    await page.context().close();
  });
});
