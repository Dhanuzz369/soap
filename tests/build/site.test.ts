import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import site from '../../src/config/site';
import { splitLocale, localeInfo } from '../../src/i18n/locales';

const NOINDEX = '<meta name="robots" content="noindex, nofollow">';
const BASE = site.url.replace(/\/$/, '');
const BASE_RE = BASE.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const contentCount = (dir: string) =>
  readdirSync(resolve(process.cwd(), 'src/content', dir)).filter((f) => f.endsWith('.md')).length;
const PRODUCT_COUNT = contentCount('products');
const CATEGORY_COUNT = contentCount('categories');
const POST_COUNT = contentCount('blog');

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
    expect(pages.filter((p) => /^\/products\/[^/]+\/index\.html$/.test(p.file))).toHaveLength(PRODUCT_COUNT);
    expect(pages.filter((p) => /^\/categories\/[^/]+\/index\.html$/.test(p.file))).toHaveLength(CATEGORY_COUNT);
    expect(pages.filter((p) => /^\/blog\/[^/]+\/index\.html$/.test(p.file))).toHaveLength(POST_COUNT);
  });

  for (const { file, html } of pages) {
    it(`${file}: head, h1, JSON-LD`, () => {
      expect(count(html, /<h1[\s>]/g)).toBe(1);
      expect(html.match(/<title>(.+?)<\/title>/)).toBeTruthy();
      expect(html).toMatch(/<meta name="description" content=".{50,}"/);
      expect(html).toContain(`<link rel="canonical" href="${BASE}/`);
      // English pages are unprefixed; /<code>/ pages carry their own language (tests/build/i18n.test.ts).
      const info = localeInfo(splitLocale(file).lang);
      expect(html).toContain(`<html lang="${info.hreflang}" dir="${info.dir}"`);
      if (site.launchReady) expect(html).not.toContain(NOINDEX);
      else expect(html).toContain(NOINDEX);
      for (const block of jsonLdBlocks(html)) expect(() => JSON.parse(block)).not.toThrow();
    });
  }

  it('links product pages to their buyer guides', () => {
    const productPages = pages.filter((p) => /^\/products\/[^/]+\/index\.html$/.test(p.file));
    const withGuides = productPages.filter((p) => /href="\/blog\/[^"/]+\/"/.test(p.html));
    expect(withGuides.length).toBeGreaterThanOrEqual(1);
    for (const p of withGuides) expect(p.html).toContain('Buyer guides for this product');
  });

  it('product JSON-LD names the category', () => {
    const html = pages.find((p) => /^\/products\/[^/]+\/index\.html$/.test(p.file))!.html;
    const product = jsonLdBlocks(html).map((b) => JSON.parse(b)).find((o) => o['@type'] === 'Product');
    expect(typeof product.category).toBe('string');
    expect(product.category.length).toBeGreaterThan(0);
  });

  it('uses a product photo for og:image and JSON-LD when one exists', () => {
    for (const p of pages.filter((x) => /^\/products\/[^/]+\/index\.html$/.test(x.file))) {
      const slug = p.file.split('/')[2];
      const photo = `/images/products/${slug}.webp`;
      const og = p.html.match(/<meta property="og:image" content="([^"]*)"/)![1];
      const product = jsonLdBlocks(p.html).map((b) => JSON.parse(b)).find((o) => o['@type'] === 'Product');
      if (existsSync(resolve(process.cwd(), 'public' + photo))) {
        expect(og, slug).toBe(BASE + photo);
        expect(product.image, slug).toBe(BASE + photo);
      } else {
        expect(og, slug).toBe(`${BASE}/og-default.png`);
      }
    }
  });

  it('has a 404 page that is always noindex and has no canonical', () => {
    const html = read('404.html');
    expect(html).toContain(NOINDEX);
    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toContain('hreflang=');
  });

  it('has unique titles and descriptions (within each language)', () => {
    const dup = (a: string[]) => a.filter((x, i) => a.indexOf(x) !== i);
    const byLang = new Map<string, typeof pages>();
    for (const p of pages) {
      const lang = splitLocale(p.file).lang;
      byLang.set(lang, [...(byLang.get(lang) ?? []), p]);
    }
    for (const [lang, list] of byLang) {
      expect(dup(list.map((p) => titleOf(p.html))), lang).toEqual([]);
      expect(dup(list.map((p) => descOf(p.html))), lang).toEqual([]);
    }
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
      expect(robots).toContain(`Sitemap: ${BASE}/sitemap-index.xml`);
      expect(existsSync(join(DIST, 'sitemap-index.xml'))).toBe(true);
    } else {
      expect(robots).toContain('Disallow: /');
      expect(robots).not.toContain('Sitemap:');
    }
  });

  it('llms.txt lists products, guides and company pages with absolute URLs', () => {
    const llms = read('llms.txt');
    expect(llms.startsWith(`# ${site.name}`)).toBe(true);
    expect(llms).toContain('## Products');
    expect(llms).toContain('## Guides');
    expect(llms).toContain('## Company');
    expect(llms).toMatch(/HSN \d{4} \d{2}: /);
    expect(count(llms, new RegExp(`\\]\\(${BASE_RE}/products/[^/)]+/\\)`, 'g'))).toBe(PRODUCT_COUNT);
    expect(count(llms, new RegExp(`\\]\\(${BASE_RE}/blog/[^/)]+/\\)`, 'g'))).toBe(POST_COUNT);
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

describe('home hero: the photo fan', () => {
  const home = read('index.html');
  const ar = read('ar/index.html');
  const fan = (s: string) => s.slice(s.indexOf('data-fan'), s.indexOf('</section>', s.indexOf('data-fan')));
  it('shows four range photos, the front one preloaded with the same srcset and sizes, at high priority', () => {
    const cards = [...fan(home).matchAll(/<a class="fan-card" href="([^"]+)"/g)].map((m) => m[1]);
    expect(cards).toEqual(['/categories/bath-personal-soaps/', '/categories/laundry-care/', '/categories/kitchen-care/', '/categories/surface-home-cleaners/']);
    const pre = home.match(/<link rel="preload" href="([^"]+)" as="image"[^>]*imagesrcset="([^"]+)" imagesizes="([^"]+)"/);
    expect(pre?.[1]).toBe('/images/products/herbal-ayurvedic-soap.webp');
    const front = fan(home).match(/<img src="([^"]+)" srcset="([^"]+)" sizes="([^"]+)"[^>]*fetchpriority="high"/);
    expect(front?.[1]).toBe(pre?.[1]);
    expect(front?.[2]).toBe(pre?.[2]);
    expect(front?.[3]).toBe(pre?.[3]);
    expect(count(fan(home), /fetchpriority="high"/g)).toBe(1);
  });
  it('works without JS: every card and range button is a plain link, the first caption is shown', () => {
    expect(count(fan(home), /class="fan-tab" href="\/categories\//g)).toBe(4);
    expect(count(fan(home), /class="fan-caption" data-active/g)).toBe(1);
    expect(fan(home)).toContain('role="region" aria-labelledby="fan-name-0"');
  });
  it('is localized, glows from inlined pre-blurred photos, and no longer ships the 3D scene', () => {
    expect(fan(ar)).toContain('href="/ar/categories/laundry-care/"');
    expect(count(fan(home), /class="fan-glow-img" src="data:image\/webp;base64,/g)).toBe(4);
    expect(home).not.toMatch(/hero-canvas|range-cutout|three\.module/);
    expect(allFiles.some((f) => /hero-scene/.test(f))).toBe(false);
  });
});
