/**
 * The legal pages' sources (spec 2026-10-28 §1, §3; Google Analytics with consent, spec 2026-11-01
 * §5): src/content/legal/{privacy,cookies}.md and their translations. The cookie page's table must
 * list exactly the browser storage the code uses, plus the two Google Analytics cookies.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { COLLECTIONS, FIXED_FIELDS as LIB_FIXED } from '../../scripts/i18n-lib.mjs';
import { FIXED_FIELDS } from '../../src/i18n/merge';

const ROOT = process.cwd();
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const full = join(dir, f);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
const read = (p: string) => matter(readFileSync(join(ROOT, p), 'utf8'));

/** The cookies Google Analytics sets on our domain after Accept (site.analytics.ga4 without "G-"). */
const GA_COOKIES = ['_ga', '_ga_FWEG9Y5FVS'];
const KEY = /`((?:gb|goodbiz)-[a-z-]+|_ga(?:_[A-Z0-9]+)?)`/g;

/** Storage keys in the code: string literals in files that use Web Storage. */
function storageKeysInCode(): Set<string> {
  const keys = new Set<string>();
  for (const f of walk(join(ROOT, 'src')).filter((x) => /\.(ts|astro)$/.test(x))) {
    const src = readFileSync(f, 'utf8');
    if (!/localStorage|sessionStorage|\bStorage\b/.test(src)) continue;
    for (const m of src.matchAll(/['"]((?:gb|goodbiz)-[a-z-]+)['"]/g)) keys.add(m[1]);
  }
  return keys;
}

describe('legal content', () => {
  for (const slug of ['privacy', 'cookies']) {
    it(`${slug}.md has a title, a 120-160 character description and the 1 November 2026 date`, () => {
      const { data } = read(`src/content/legal/${slug}.md`);
      expect(data.title).toBe(slug === 'privacy' ? 'Privacy Policy' : 'Cookie Policy');
      expect(data.description.length).toBeGreaterThanOrEqual(120);
      expect(data.description.length).toBeLessThanOrEqual(160);
      expect(new Date(data.updated).toISOString().slice(0, 10)).toBe('2026-11-01');
    });
  }

  it('the legal pages are translated and stamped like the other content', () => {
    expect(COLLECTIONS).toContain('legal');
    expect(LIB_FIXED.legal).toEqual(['updated']);
    expect(FIXED_FIELDS.legal).toEqual(['updated']);
  });

  it('the site sets no cookies itself: its only cookie code deletes the Google Analytics cookies on withdrawal', () => {
    const files = walk(join(ROOT, 'src')).filter((x) => /\.(ts|astro|mjs|js)$/.test(x) && /document\.cookie/.test(readFileSync(x, 'utf8')));
    expect(files.map((f) => f.slice(ROOT.length + 1))).toEqual(['src/scripts/analytics.ts']);
    const lines = readFileSync(join(ROOT, 'src/scripts/analytics.ts'), 'utf8').split('\n').filter((l) => /document\.cookie/.test(l));
    expect(lines.map((l) => l.trim())).toEqual(['for (const line of expireCookies(gaCookieNames(document.cookie), location.hostname)) document.cookie = line;']);
  });

  it('the cookie table lists exactly the browser storage keys the code uses', () => {
    const code = storageKeysInCode();
    expect([...code].sort()).toEqual(['gb-consent', 'gb-horeca', 'gb-lang', 'goodbiz-enquiry-contact', 'goodbiz-enquiry-lead', 'goodbiz-enquiry-products']);
    const want = [...code, ...GA_COOKIES].sort();
    const files = ['src/content/legal/cookies.md', ...readdirSync(join(ROOT, 'src/content/i18n')).map((l) => `src/content/i18n/${l}/legal/cookies.md`).filter((p) => existsSync(join(ROOT, p)))];
    for (const f of files) {
      const body = read(f).content;
      const rows = body.split('\n').filter((l) => /^\|/.test(l.trim()));
      expect(rows.length, f).toBe(2 + want.length); // header, separator, one row per key or cookie
      const listed = new Set([...body.matchAll(KEY)].map((m) => m[1]));
      expect([...listed].sort(), f).toEqual(want);
      // one key per row, each in its own row
      for (const k of want) expect(rows.filter((r) => r.includes(`\`${k}\``)).length, `${f}: ${k}`).toBe(1);
    }
  });
});

describe('legal translations', () => {
  const LANGS = ['ar', 'fr', 'es', 'pt', 'ru', 'zh', 'de', 'tr', 'id', 'sw', 'vi'];
  const shape = (body: string) => ({
    headings: body.split('\n').filter((l) => /^## /.test(l)).length,
    bullets: body.split('\n').filter((l) => /^- /.test(l)).length,
    subBullets: body.split('\n').filter((l) => /^ {2}- /.test(l)).length,
    tableRows: body.split('\n').filter((l) => /^\|/.test(l)).length,
    links: [...body.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]),
  });
  for (const slug of ['privacy', 'cookies']) {
    const en = read(`src/content/legal/${slug}.md`);
    for (const lang of LANGS) {
      it(`${lang}/legal/${slug}.md mirrors the English structure and keeps the fixed facts`, () => {
        const path = `src/content/i18n/${lang}/legal/${slug}.md`;
        expect(existsSync(join(ROOT, path)), path).toBe(true);
        const tr = read(path);
        expect(tr.data.title, 'title').toBeTruthy();
        expect(tr.data.title).not.toBe(en.data.title);
        const n = [...String(tr.data.description)].length;
        if (lang === 'zh') expect(n >= 70 && n <= 100, `description ${n}`).toBe(true);
        else expect(n >= 120 && n <= 160, `description ${n}`).toBe(true);
        expect(shape(tr.content)).toEqual(shape(en.content));
        expect(tr.content).toContain('hygiene@goodbizglobal.com');
        expect(tr.content).toContain('Google Analytics');
        if (slug === 'cookies') for (const s of ['`gb-consent`', '`_ga`', '`_ga_FWEG9Y5FVS`', '(/privacy/)', '12']) expect(tr.content, s).toContain(s);
        if (slug === 'privacy') {
          for (const s of ['+91 88847 99369', 'Digital Personal Data Protection Act, 2023', '7(a)', '6(1)(a)', '6(1)(b)', '6(1)(f)', '6(1)(c)', 'Privacy request', 'Google Workspace', 'Vercel Inc.', 'HTTPS', 'Google LLC', 'Google Ireland Limited', 'Data Privacy Framework'])
            expect(tr.content, s).toContain(s);
          for (const num of ['24', '30', '90', '18', '14']) expect(tr.content, num).toMatch(new RegExp(`(^|\\D)${num}(\\D|$)`));
          expect(tr.content).not.toMatch(/\bDPDP\b(?! Act)/); // the Act is cited by its full name
        }
      });
    }
  }
});

describe('legal pages tell the new truth (spec 2026-11-01 §5)', () => {
  const en = (slug: string) => read(`src/content/legal/${slug}.md`);
  const all = (slug: string) => [`src/content/legal/${slug}.md`, ...readdirSync(join(ROOT, 'src/content/i18n')).map((l) => `src/content/i18n/${l}/legal/${slug}.md`)];
  it('English says nothing left over from "no cookies, no analytics"', () => {
    for (const slug of ['privacy', 'cookies']) {
      const { content, data } = en(slug);
      const text = `${data.description}\n${content}`;
      for (const re of [/uses no cookies/i, /no cookies,/i, /not use cookies/i, /no analytics/i, /not use analytics/i, /no cookie banner/i, /do not need to ask for consent/i, /if we ever add analytics/i, /no tracking/i])
        expect(text, `${slug}: ${re}`).not.toMatch(re);
    }
  });
  it('the cookie page: analytics only after Accept, how to change your mind, nothing else changes, still no ad trackers or embeds', () => {
    const c = en('cookies').content;
    for (const s of [
      'This website uses cookies only for Google Analytics, and only if you accept them in the cookie banner.',
      'Until you accept, the Google Analytics code is not loaded at all and no cookies are set.',
      'We use no advertising or social media trackers, and no embedded content from other websites, such as videos or maps.',
      'Accept and Reject are equal choices, and rejecting changes nothing else on the website',
      'You can change your mind at any time with Cookie settings at the foot of every page.',
      'If you withdraw your consent, Google Analytics stops at once and we delete its cookies on our domain.',
      'We ask again after 12 months.',
      'Up to 2 years',
    ])
      expect(c, s).toContain(s);
  });
  it('the privacy page: Google Analytics as a processor, what it collects, consent, retention and the US transfer', () => {
    const c = en('privacy').content;
    for (const s of [
      '*Google Analytics* (Google LLC; for visitors in the EU and UK, Google Ireland Limited)',
      'Google Analytics does not log or store IP addresses.',
      'It never receives your name, company, email address, phone number or notes.',
      'your consent (section 6 of the Digital Personal Data Protection Act, 2023; Article 6(1)(a) GDPR)',
      '14 months',
      'EU–US Data Privacy Framework',
      'We use cookies only for Google Analytics, and only if you accept them.',
    ])
      expect(c, s).toContain(s);
  });
  it('every translation is updated to the 1 November 2026 version', () => {
    for (const slug of ['privacy', 'cookies']) for (const f of all(slug)) expect(new Date(read(f).data.updated).toISOString().slice(0, 10), f).toBe('2026-11-01');
  });
});
