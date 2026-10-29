/**
 * The machine-readable files beside llms.txt (src/lib/feeds.ts) and the decorative-image marking
 * (src/lib/decorative-images.ts), as built. Run `npm run build` first.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import site from '../../src/config/site';
import { LOCALES, DEFAULT_LOCALE } from '../../src/i18n/locales';

const DIST = resolve(process.cwd(), 'dist');
const read = (p: string) => readFileSync(join(DIST, p), 'utf8');
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const BASE = site.url.replace(/\/$/, '');

describe('RSS feeds', () => {
  it('one per language, every guide linked, and each page links the feed of its language', () => {
    for (const { code } of LOCALES) {
      const prefix = code === DEFAULT_LOCALE ? '' : `/${code}`;
      const xml = read(`${prefix}/rss.xml`.slice(1));
      const guides = readdirSync(join(DIST, prefix.slice(1), 'blog')).filter((f) => statSync(join(DIST, prefix.slice(1), 'blog', f)).isDirectory());
      expect(guides.length, code).toBeGreaterThan(0);
      for (const g of guides) expect(xml, `${code} ${g}`).toContain(`<link>${BASE}${prefix}/blog/${g}/</link>`);
      expect(read(`${prefix}/index.html`.slice(1))).toContain(`type="application/rss+xml"`);
      expect(read(`${prefix}/index.html`.slice(1))).toContain(`href="${BASE}${prefix}/rss.xml"`);
    }
  });
});

describe('AI discovery files', () => {
  it('/.well-known/ai.txt and /ai/summary.json exist and agree with the site', () => {
    expect(existsSync(join(DIST, '.well-known/ai.txt'))).toBe(true);
    const s = JSON.parse(read('ai/summary.json'));
    expect(s.name).toBe(site.name);
    expect(s.contact.email).toBe(site.contact.email);
  });
});

describe('decorative images', () => {
  it('every image with an empty alt is marked role="presentation"', () => {
    const bad: string[] = [];
    for (const f of walk(DIST).filter((x) => x.endsWith('.html'))) {
      for (const m of readFileSync(f, 'utf8').matchAll(/<img\b[^>]*>/g)) {
        if (/\salt(?:=""|(?=[\s/>]))/.test(m[0]) && !/\srole="(presentation|none)"/.test(m[0])) bad.push(`${f.slice(DIST.length)}: ${m[0].slice(0, 80)}`);
      }
    }
    expect(bad.slice(0, 10)).toEqual([]);
  });
});
