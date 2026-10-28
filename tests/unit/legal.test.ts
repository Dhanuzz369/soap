/**
 * The legal pages' sources (spec 2026-10-28 §1, §3): src/content/legal/{privacy,cookies}.md and
 * their translations. The cookie page's table must list exactly the browser storage the code uses.
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
    it(`${slug}.md has a title, a 120-160 character description and the 28 October 2026 date`, () => {
      const { data } = read(`src/content/legal/${slug}.md`);
      expect(data.title).toBe(slug === 'privacy' ? 'Privacy Policy' : 'Cookie Policy');
      expect(data.description.length).toBeGreaterThanOrEqual(120);
      expect(data.description.length).toBeLessThanOrEqual(160);
      expect(new Date(data.updated).toISOString().slice(0, 10)).toBe('2026-10-28');
    });
  }

  it('the legal pages are translated and stamped like the other content', () => {
    expect(COLLECTIONS).toContain('legal');
    expect(LIB_FIXED.legal).toEqual(['updated']);
    expect(FIXED_FIELDS.legal).toEqual(['updated']);
  });

  it('there are no cookies in the code', () => {
    for (const f of walk(join(ROOT, 'src')).filter((x) => /\.(ts|astro|mjs|js)$/.test(x))) expect(readFileSync(f, 'utf8'), f).not.toMatch(/document\.cookie/);
  });

  it('the cookie table lists exactly the browser storage keys the code uses', () => {
    const code = storageKeysInCode();
    expect([...code].sort()).toEqual(['gb-horeca', 'gb-lang', 'goodbiz-enquiry-contact', 'goodbiz-enquiry-lead', 'goodbiz-enquiry-products']);
    const files = ['src/content/legal/cookies.md', ...readdirSync(join(ROOT, 'src/content/i18n')).map((l) => `src/content/i18n/${l}/legal/cookies.md`).filter((p) => existsSync(join(ROOT, p)))];
    for (const f of files) {
      const body = read(f).content;
      const rows = body.split('\n').filter((l) => /^\|/.test(l.trim()));
      expect(rows.length, f).toBe(2 + code.size); // header, separator, one row per key
      const listed = new Set([...body.matchAll(/`((?:gb|goodbiz)-[a-z-]+)`/g)].map((m) => m[1]));
      expect([...listed].sort(), f).toEqual([...code].sort());
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
        if (slug === 'privacy') {
          for (const s of ['+91 88847 99369', 'Digital Personal Data Protection Act, 2023', '7(a)', '6(1)(b)', '6(1)(f)', '6(1)(c)', 'Privacy request', 'Google Workspace', 'Vercel Inc.', 'HTTPS'])
            expect(tr.content, s).toContain(s);
          for (const num of ['24', '30', '90', '18']) expect(tr.content, num).toMatch(new RegExp(`(^|\\D)${num}(\\D|$)`));
          expect(tr.content).not.toMatch(/\bDPDP\b(?! Act)/); // the Act is cited by its full name
        }
      });
    }
  }
});
