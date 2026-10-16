import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import site from '../../src/config/site';

const NOINDEX = '<meta name="robots" content="noindex, nofollow">';

const DIST = resolve(process.cwd(), 'dist');
const read = (p: string) => readFileSync(join(DIST, p), 'utf8');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const full = join(dir, f);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const allFiles = walk(DIST);
const allHtmlFiles = allFiles.filter((f) => f.endsWith('.html'));
const pageFiles = allHtmlFiles.filter((f) => f.endsWith('index.html'));
const pages = pageFiles.map((f) => ({ file: f.slice(DIST.length), html: readFileSync(f, 'utf8') }));

const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;
const jsonLdBlocks = (s: string) =>
  [...s.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const titleOf = (s: string) => s.match(/<title>(.+?)<\/title>/)![1];
const descOf = (s: string) => s.match(/<meta name="description" content="([^"]*)"/)![1];

describe('built pages', () => {
  it('finds the expected set of pages', () => {
    expect(pages.length).toBeGreaterThanOrEqual(30);
    expect(pages.filter((p) => /^\/products\/[^/]+\/index\.html$/.test(p.file))).toHaveLength(27);
    expect(pages.filter((p) => /^\/categories\/[^/]+\/index\.html$/.test(p.file))).toHaveLength(5);
  });

  for (const { file, html } of pages) {
    it(`${file}: head, h1, JSON-LD`, () => {
      expect(count(html, /<h1[\s>]/g)).toBe(1);
      expect(html.match(/<title>(.+?)<\/title>/)).toBeTruthy();
      expect(html).toMatch(/<meta name="description" content=".{50,}"/);
      expect(html).toMatch(/<link rel="canonical" href="https:\/\/www\.goodbizhygiene\.com\//);
      expect(html).toMatch(/<html lang="en"/);
      if (site.launchReady) expect(html).not.toContain(NOINDEX);
      else expect(html).toContain(NOINDEX);
      for (const block of jsonLdBlocks(html)) expect(() => JSON.parse(block)).not.toThrow();
    });
  }

  it('has a 404 page with the expected robots meta', () => {
    const has = read('404.html').includes(NOINDEX);
    expect(has).toBe(!site.launchReady);
  });

  it('has unique titles and descriptions', () => {
    const titles = pages.map((p) => titleOf(p.html));
    const descs = pages.map((p) => descOf(p.html));
    const dup = (a: string[]) => a.filter((x, i) => a.indexOf(x) !== i);
    expect(dup(titles)).toEqual([]);
    expect(dup(descs)).toEqual([]);
  });

  it('never claims to manufacture', () => {
    const allHtml = allHtmlFiles.map((f) => readFileSync(f, 'utf8')).join('\n');
    expect(allHtml).not.toMatch(/we manufacture|our factory/i);
  });
});

describe('robots.txt and llms.txt', () => {
  it('robots.txt matches launchReady', () => {
    const robots = read('robots.txt');
    expect(robots).toContain('User-agent: *');
    if (site.launchReady) {
      expect(robots).not.toContain('Disallow: /');
      expect(robots).toContain('Sitemap: https://www.goodbizhygiene.com/sitemap-index.xml');
      expect(existsSync(join(DIST, 'sitemap-index.xml'))).toBe(true);
    } else {
      expect(robots).toContain('Disallow: /');
      expect(robots).not.toContain('Sitemap:');
    }
  });

  it('llms.txt lists products, guides and company pages with absolute URLs', () => {
    const llms = read('llms.txt');
    expect(llms.startsWith('# GoodBiz Hygiene')).toBe(true);
    expect(llms).toContain('## Products');
    expect(llms).toContain('## Guides');
    expect(llms).toContain('## Company');
    expect(llms).toContain('https://www.goodbizhygiene.com/products/dish-wash-liquid/');
    expect(llms).toMatch(/HSN 3402 50: /);
    expect(count(llms, /\]\(https:\/\/www\.goodbizhygiene\.com\/products\/[^/)]+\/\)/g)).toBe(27);
    expect(count(llms, /\]\(https:\/\/www\.goodbizhygiene\.com\/blog\/[^/)]+\/\)/g)).toBe(8);
  });
});

describe('internal links', () => {
  it('every internal href resolves to a file in dist', () => {
    const broken: string[] = [];
    for (const f of allHtmlFiles) {
      const html = readFileSync(f, 'utf8');
      for (const m of html.matchAll(/\shref="([^"]*)"/g)) {
        let href = m[1];
        if (!href || href.startsWith('#')) continue;
        if (/^(https?:)?\/\//.test(href) || /^(mailto|tel|sms|javascript|data):/i.test(href)) continue;
        href = href.split('#')[0].split('?')[0];
        if (!href) continue;
        if (!href.startsWith('/')) {
          broken.push(`${f.slice(DIST.length)} -> relative href ${href}`);
          continue;
        }
        const target = join(DIST, decodeURIComponent(href));
        const ok = href.endsWith('/')
          ? existsSync(join(target, 'index.html'))
          : existsSync(target) && statSync(target).isFile();
        if (!ok) broken.push(`${f.slice(DIST.length)} -> ${m[1]}`);
      }
    }
    expect(broken).toEqual([]);
  });
});
