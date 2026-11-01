/**
 * The cookie banner and the footer's "Cookie settings" on the built site (spec 2026-11-01 §3).
 * Run `npm run build` first. The browser behaviour is tested in tests/e2e/consent.test.ts.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { LOCALES, localizePath, type Locale } from '../../src/i18n/locales';
import { getUi } from '../../src/i18n/ui';
import site from '../../src/config/site';

const DIST = resolve(process.cwd(), 'dist');
const LANGS = LOCALES.map((l) => l.code as Locale);
const page = (path: string, lang: Locale = 'en') => readFileSync(join(DIST, localizePath(path, lang), 'index.html'), 'utf8');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const full = join(dir, f);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
const banner = (html: string) => {
  const start = html.indexOf('data-consent ');
  const open = html.lastIndexOf('<', start);
  const actionsEnd = html.indexOf('</div>', html.indexOf('data-consent-choice="denied"', start));
  return html.slice(open, html.indexOf('</div>', actionsEnd + 6) + 6); // the actions, then the banner itself
};

describe('cookie banner markup', () => {
  it.each(LANGS)('%s: on every kind of page, hidden until the script shows it, right after the skip links', (l) => {
    for (const path of ['/', '/contact/', '/products/', '/products/labsa/', '/blog/', '/cookies/', '/privacy/']) {
      const html = page(path, l);
      expect(html.match(/data-consent /g)?.length, `${l}${path}`).toBe(1);
      const b = banner(html);
      expect(b, `${l}${path}`).toMatch(/^<div [^>]*\bhidden\b/);
      expect(b).toContain('role="region"');
      expect(b).toContain(`aria-label="${esc(getUi(l).consent.aria)}"`);
      expect(b).toContain(`data-ga="${site.analytics.ga4}"`);
      const at = html.indexOf('data-consent ');
      expect(at, 'after the skip link').toBeGreaterThan(html.lastIndexOf('class="skip"', at));
      expect(at, 'before the header').toBeLessThan(html.indexOf('<header'));
    }
  });

  it.each(LANGS)('%s: the translated text, a link to its Cookie Policy and two real buttons', (l) => {
    const ui = getUi(l).consent;
    const b = banner(page('/', l));
    expect(b).toContain(esc(ui.text));
    expect(b).toContain(`<a href="${localizePath('/cookies/', l)}">${esc(ui.policy)}</a>`);
    expect(b).toMatch(new RegExp(`<button type="button"[^>]*data-consent-choice="granted"[^>]*>\\s*${ui.accept}\\s*</button>`));
    expect(b).toMatch(new RegExp(`<button type="button"[^>]*data-consent-choice="denied"[^>]*>\\s*${ui.reject}\\s*</button>`));
    // Equal choice: the two buttons share exactly the same classes.
    const cls = [...b.matchAll(/<button type="button" class="([^"]+)"/g)].map((m) => m[1]);
    expect(cls).toHaveLength(2);
    expect(cls[0]).toBe(cls[1]);
  });

  it('the 404 page has no banner and no Cookie settings button', () => {
    const html = readFileSync(join(DIST, '404.html'), 'utf8');
    expect(html).not.toContain('data-consent');
  });

  it('no page loads Google’s tag in its HTML (gtag.js comes only from the script, after Accept)', () => {
    const pages = walk(DIST).filter((f) => f.endsWith('.html'));
    expect(pages.length).toBeGreaterThan(500);
    for (const f of pages) {
      const html = readFileSync(f, 'utf8');
      expect(html, f).not.toMatch(/googletagmanager|google-analytics\.com|gtag\(/);
    }
  });
});

describe('the shipped Google tag set-up', () => {
  it('configures gtag with a cleaned page_location (only product and campaign tags, never ?message=)', () => {
    const js = walk(join(DIST, '_astro')).filter((f) => f.endsWith('.js') && readFileSync(f, 'utf8').includes('googletagmanager'));
    expect(js).toHaveLength(1);
    const src = readFileSync(js[0], 'utf8');
    expect(src).toMatch(/[`"']config[`"']/);
    expect(src).toContain('page_location');
    expect(src).toContain('page_referrer');
    for (const k of ['product', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid']) expect(src, k).toContain(k);
    expect(src).not.toMatch(/[`"']message[`"']/);
    expect(src).not.toMatch(/location\.search/);
  });
});

describe('footer: Cookie settings', () => {
  it.each(LANGS)('%s: a button beside the Cookies link, hidden until the script runs', (l) => {
    const ui = getUi(l);
    for (const path of ['/', '/contact/', '/cookies/']) {
      const html = page(path, l);
      const legal = html.slice(html.indexOf('class="footer-legal-links"'), html.indexOf('</ul>', html.indexOf('class="footer-legal-links"')));
      const cookies = legal.indexOf(`<a href="${localizePath('/cookies/', l)}">${ui.footer.cookies}</a>`);
      expect(cookies, `${l}${path}`).toBeGreaterThan(0);
      const li = legal.slice(legal.indexOf('<li', cookies));
      expect(li, `${l}${path}`).toMatch(new RegExp(`^<li hidden data-consent-settings><button type="button" class="footer-linkbtn" data-consent-open>${esc(ui.consent.settings)}</button></li>`));
    }
  });
});

describe('consent strings', () => {
  it('English is the spec wording', () => {
    const en = getUi('en').consent;
    expect(en.text).toBe('We’d like to use Google Analytics cookies to see which pages and products buyers look at, so we can improve the site. No advertising, and nothing about you is sold.');
    expect([en.policy, en.accept, en.reject, en.settings]).toEqual(['Cookie Policy', 'Accept', 'Reject', 'Cookie settings']);
  });
  it('every language has its own wording (no English fallback), naming Google Analytics', () => {
    const en = getUi('en').consent;
    for (const l of LANGS.filter((x) => x !== 'en')) {
      const c = getUi(l).consent;
      for (const k of Object.keys(en) as (keyof typeof en)[]) expect(c[k], `${l}.${k}`).not.toBe(en[k]);
      expect(c.text, l).toContain('Google Analytics');
      // the link text is the title of that language's Cookie Policy page
      const title = readFileSync(join(process.cwd(), 'src/content/i18n', l, 'legal/cookies.md'), 'utf8').match(/^title: "(.+)"$/m)![1];
      expect(c.policy, l).toBe(title);
    }
  });
});
