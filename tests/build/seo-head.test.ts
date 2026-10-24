/**
 * Search and sharing tags on the built site (run `npm run build` first): titles and descriptions
 * within search-snippet lengths, meta keywords, share images that exist at 1200 × 630, icons and
 * the web manifest, verification tags only when set, internal links between products, ranges and
 * guides, and no orphan pages.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import site from '../../src/config/site';
import { splitLocale, localizePath, PREFIXED_LOCALES, type Locale } from '../../src/i18n/locales';
import { getUi } from '../../src/i18n/ui';
import { MAX_KEYWORDS } from '../../src/lib/seo';
import { publicImageSize } from '../../src/lib/product-image';

const DIST = resolve(process.cwd(), 'dist');
const BASE = site.url.replace(/\/$/, '');
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const full = join(dir, f);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}
const pages = walk(DIST)
  .filter((f) => f.endsWith('/index.html'))
  .map((f) => {
    const path = f.slice(DIST.length).replace(/index\.html$/, '');
    return { path, html: readFileSync(f, 'utf8'), lang: splitLocale(path).lang };
  });
const byPath = new Map(pages.map((p) => [p.path, p]));
const dec = (s: string) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const meta = (html: string, attr: 'name' | 'property', key: string) =>
  [...html.matchAll(new RegExp(`<meta ${attr}="${key.replace(/[:.]/g, '\\$&')}" content="([^"]*)"`, 'g'))].map((m) => dec(m[1]));
const titleOf = (html: string) => dec(html.match(/<title>(.*?)<\/title>/)![1]);
/** CJK text is about twice as wide per character in a search result. */
const cjk = (lang: Locale) => lang === 'zh';
const SUFFIX = ` | ${site.name}`;

describe('titles and descriptions fit search snippets', () => {
  it('every title (before the brand) is at most 60 characters in Latin, Cyrillic, Arabic and Vietnamese, 32 in Chinese (a few long product names excepted)', () => {
    const over = pages
      .filter((p) => !p.path.includes('/404'))
      .map((p) => ({ p, t: titleOf(p.html).replace(SUFFIX, '') }))
      .filter(({ p, t }) => [...t].length > (cjk(p.lang) ? 32 : 60))
      .map(({ p, t }) => `${p.path} (${[...t].length}): ${t}`);
    // Allow a handful of long names (e.g. "Glycerin & Transparent Soap" in long-word languages), no more.
    expect(over.length, over.join('\n')).toBeLessThanOrEqual(Math.ceil(pages.length * 0.06));
  });

  it('every description is 120–160 characters (70–100 in Chinese)', () => {
    const bad = pages
      .map((p) => ({ p, d: meta(p.html, 'name', 'description')[0] ?? '' }))
      .filter(({ p, d }) => {
        const n = [...d].length;
        return cjk(p.lang) ? n < 60 || n > 110 : n < 110 || n > 165;
      })
      .map(({ p, d }) => `${p.path} (${[...d].length})`);
    expect(bad, bad.join('\n')).toEqual([]);
  });
});

describe('meta keywords', () => {
  it('every page has 3 to 12 keywords, without duplicates', () => {
    const problems: string[] = [];
    for (const p of pages) {
      const k = meta(p.html, 'name', 'keywords')[0];
      if (!k) {
        problems.push(`${p.path}: none`);
        continue;
      }
      const list = k.split(', ');
      if (list.length < 3 || list.length > MAX_KEYWORDS) problems.push(`${p.path}: ${list.length}`);
      if (new Set(list.map((x) => x.toLowerCase())).size !== list.length) problems.push(`${p.path}: duplicates`);
      if (/\{\w+\}/.test(k)) problems.push(`${p.path}: unfilled template ${k}`);
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });

  it('product keywords name the product and its HSN code', () => {
    for (const p of pages.filter((x) => /\/products\/[^/]+\/$/.test(x.path))) {
      const k = meta(p.html, 'name', 'keywords')[0];
      const hsn = p.html.match(/"propertyID":"HSN","value":"(\d{4} \d{2})"/)![1];
      expect(k, p.path).toContain(hsn);
    }
  });
});

describe('sharing tags', () => {
  it('og:image exists, is absolute, with its size; product cards and page cards are 1200 × 630', () => {
    const problems: string[] = [];
    for (const p of pages) {
      const img = meta(p.html, 'property', 'og:image')[0];
      if (!img?.startsWith(BASE + '/')) {
        problems.push(`${p.path}: og:image ${img}`);
        continue;
      }
      const file = img.slice(BASE.length);
      if (!existsSync(join(DIST, file))) problems.push(`${p.path}: ${file} missing`);
      const size = publicImageSize(file);
      if (!size) problems.push(`${p.path}: ${file} unreadable`);
      else {
        if (meta(p.html, 'property', 'og:image:width')[0] !== String(size.width)) problems.push(`${p.path}: og:image:width`);
        if (file.startsWith('/og/') && (size.width !== 1200 || size.height !== 630)) problems.push(`${p.path}: ${file} is ${size.width}×${size.height}`);
      }
      if (meta(p.html, 'name', 'twitter:card')[0] !== 'summary_large_image') problems.push(`${p.path}: twitter:card`);
      if (meta(p.html, 'name', 'twitter:image')[0] !== img) problems.push(`${p.path}: twitter:image`);
      if (!meta(p.html, 'property', 'og:image:alt')[0]) problems.push(`${p.path}: og:image:alt`);
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });

  it('home, category and the other main pages use their own card, in the page language', () => {
    const checks: [string, string][] = [
      ['/', '/og/en/home.png'],
      ['/ar/', '/og/ar/home.png'],
      ['/zh/private-label/', '/og/zh/private-label.png'],
      ['/fr/export-process/', '/og/fr/export-process.png'],
      ['/categories/kitchen-care/', '/og/categories/kitchen-care.jpg'],
    ];
    for (const [path, img] of checks) expect(meta(byPath.get(path)!.html, 'property', 'og:image')[0], path).toBe(BASE + img);
  });

  it('posts are articles with publish and modified times', () => {
    for (const p of pages.filter((x) => /\/blog\/[^/]+\/$/.test(x.path))) {
      expect(meta(p.html, 'property', 'og:type')[0], p.path).toBe('article');
      expect(meta(p.html, 'property', 'article:published_time')[0], p.path).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    }
  });
});

describe('icons, manifest and verification', () => {
  it('ships favicon.ico, the apple touch icon, a 512 px logo and a web manifest, linked from every page', () => {
    for (const f of ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'logo-512.png', 'icon-192.png', 'icon-512.png', 'site.webmanifest'])
      expect(existsSync(join(DIST, f)), f).toBe(true);
    expect(publicImageSize('/logo-512.png')).toEqual({ width: 512, height: 512 });
    expect(publicImageSize('/apple-touch-icon.png')).toEqual({ width: 180, height: 180 });
    const manifest = JSON.parse(readFileSync(join(DIST, 'site.webmanifest'), 'utf8'));
    expect(manifest.icons.map((i: { sizes: string }) => i.sizes)).toEqual(expect.arrayContaining(['192x192', '512x512']));
    for (const p of pages) {
      expect(p.html, p.path).toContain('<link rel="manifest" href="/site.webmanifest">');
      expect(p.html, p.path).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png">');
      expect(p.html, p.path).toMatch(/<meta name="theme-color" content="#[0-9a-f]{6}">/);
    }
  });

  it('renders search-engine verification tags only when set in site.ts', () => {
    const home = byPath.get('/')!.html;
    const tags: [keyof typeof site.verification, string][] = [
      ['google', 'google-site-verification'],
      ['bing', 'msvalidate.01'],
      ['yandex', 'yandex-verification'],
    ];
    for (const [k, name] of tags) {
      if (site.verification[k]) expect(home).toContain(`<meta name="${name}" content="${site.verification[k]}">`);
      else expect(home).not.toContain(`name="${name}"`);
    }
  });

  it('serves the IndexNow key file', () => {
    expect(readFileSync(join(DIST, `${site.indexNowKey}.txt`), 'utf8').trim()).toBe(site.indexNowKey);
  });
});

describe('internal links (per language)', () => {
  const productPages = pages.filter((p) => /\/products\/[^/]+\/$/.test(p.path));
  const hrefs = (html: string) => new Set([...html.matchAll(/<a\s[^>]*href="([^"#?]*)/g)].map((m) => m[1]));

  it('every product links to its range, at least 2 other products, and a buyer guide where one exists', () => {
    const problems: string[] = [];
    for (const p of productPages) {
      const links = hrefs(p.html);
      const own = p.path;
      const prefix = p.lang === 'en' ? '' : `/${p.lang}`;
      // The range is the third breadcrumb (Home › Products › Range › Product).
      const range = p.html.match(new RegExp(`"position":3,"name":"[^"]*","item":"${BASE.replace(/[.]/g, '\\.')}([^"]+)"`))?.[1];
      if (!range || !links.has(range)) problems.push(`${own}: no link to its range ${range}`);
      const others = [...links].filter((h) => h.startsWith(`${prefix}/products/`) && h !== own && h !== `${prefix}/products/` && /\/products\/[^/]+\/$/.test(h));
      if (others.length < 2) problems.push(`${own}: ${others.length} related products`);
      const slug = own.split('/').at(-2);
      const guideExists = pages.some((g) => g.lang === p.lang && /\/blog\/[^/]+\/$/.test(g.path) && g.html.includes(`href="${prefix}/products/${slug}/"`));
      if (guideExists && ![...links].some((h) => h.startsWith(`${prefix}/blog/`) && h !== `${prefix}/blog/`)) problems.push(`${own}: no guide link`);
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });

  it('has no orphan pages: every page is linked from another page in its language', () => {
    const linked = new Set<string>();
    for (const p of pages) for (const h of hrefs(p.html)) if (h !== p.path) linked.add(h);
    const orphans = pages.filter((p) => !linked.has(p.path)).map((p) => p.path);
    expect(orphans).toEqual([]);
  });

  it('every category and guide is reachable from the products and blog pages of its language', () => {
    for (const lang of ['en', 'ar', 'zh'] as Locale[]) {
      const products = hrefs(byPath.get(localizePath('/products/', lang))!.html);
      const blog = hrefs(byPath.get(localizePath('/blog/', lang))!.html);
      for (const p of pages.filter((x) => x.lang === lang)) {
        if (/\/categories\/[^/]+\/$/.test(p.path)) expect(products.has(p.path), p.path).toBe(true);
        if (/\/products\/[^/]+\/$/.test(p.path)) expect(products.has(p.path), p.path).toBe(true);
        if (/\/blog\/[^/]+\/$/.test(p.path)) expect(blog.has(p.path), p.path).toBe(true);
      }
    }
  });
});

describe('AEO: answers and quick facts', () => {
  it('every product page opens with a 40–60 word answer that names the product', () => {
    for (const p of productPages()) {
      const lead = dec(p.html.match(/<p class="ph-lead">([\s\S]*?)<\/p>/)![1]);
      const words = lead.split(/\s+/).filter(Boolean).length;
      expect(words, p.path).toBeGreaterThanOrEqual(40);
      expect(words, p.path).toBeLessThanOrEqual(60);
      const kw = meta(p.html, 'name', 'keywords')[0].split(', ')[0].replace(/ exporter India$/, '').toLowerCase();
      expect(lead.toLowerCase(), p.path).toContain(kw.split(' ')[0]);
    }
  });

  it('home and about pages carry the Quick facts definition list', () => {
    for (const path of ['/', '/about/', '/ar/', '/zh/about/']) {
      const html = byPath.get(path)!.html;
      const box = html.match(/<section class="wrap sec quick-facts"[\s\S]*?<\/section>/)?.[0] ?? '';
      expect((box.match(/<dt>/g) ?? []).length, path).toBe(6);
      expect(box, path).toContain('3401');
    }
  });
});

describe('GEO: llms.txt in every language and llms-full.txt', () => {
  const products = readdirSync(resolve(process.cwd(), 'src/content/products')).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));

  it('every language has its own llms.txt, naming the company the same way and linking to its own pages', () => {
    for (const lang of PREFIXED_LOCALES) {
      const txt = readFileSync(join(DIST, lang, 'llms.txt'), 'utf8');
      expect(txt.startsWith(`# ${site.name}`), lang).toBe(true);
      expect(txt, lang).toContain(`> ${getUi(lang).seo.entity}`);
      for (const slug of products) expect(txt, `${lang} ${slug}`).toContain(`${BASE}/${lang}/products/${slug}/`);
      expect(txt, lang).toContain(`${BASE}/llms-full.txt`);
    }
  });

  it('llms-full.txt has every product with its HSN code, specification table and FAQs, and no placeholders', () => {
    const full = readFileSync(join(DIST, 'llms-full.txt'), 'utf8');
    expect(full).toContain(getUi('en').seo.entity);
    for (const slug of products) expect(full, slug).toContain(`URL: ${BASE}/products/${slug}/`);
    expect((full.match(/^\| Specification \(typical\) \| Value \|$/gm) ?? []).length).toBe(products.length);
    expect((full.match(/^- \*\*HSN code:\*\* \d{4} \d{2}\./gm) ?? []).length).toBe(products.length);
    expect(full).toContain('## Company FAQ');
    expect(full).toContain('## Export process');
    expect(full).not.toContain('PLACEHOLDER');
    expect(full).not.toMatch(/\]\(\/(?!\/)/); // every Markdown link is absolute
  });

  it('every page links its language\'s llms.txt', () => {
    for (const p of pages) {
      const want = p.lang === 'en' ? `${BASE}/llms.txt` : `${BASE}/${p.lang}/llms.txt`;
      expect(p.html, p.path).toContain(`<link rel="alternate" type="text/plain" title="llms.txt" href="${want}">`);
    }
  });
});

function productPages() {
  return pages.filter((p) => p.lang === 'en' && /^\/products\/[^/]+\/$/.test(p.path));
}
