/**
 * Built-site checks for every language (run `npm run build` first).
 * English is served unprefixed; every other locale at /<code>/ with the same page set.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import site from '../../src/config/site';
import { LOCALES, PREFIXED_LOCALES, localizePath, splitLocale, localeInfo, type Locale } from '../../src/i18n/locales';
import { claimPatterns } from '../../src/i18n/honesty';
import { getUi } from '../../src/i18n/ui';

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
    return { path, file: f, html: readFileSync(f, "utf8"), lang: splitLocale(path).lang };
  });
const byPath = new Map(pages.map((p) => [p.path, p]));
const englishPaths = pages.filter((p) => p.lang === 'en').map((p) => p.path);

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const alternatesOf = (html: string) =>
  [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({ hreflang: m[1], href: m[2] }));
const canonicalOf = (html: string) => html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
/** Visible text: no scripts, styles, tags or the language menu (which lists every language by name). */
const visibleText = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<details class="lang"[\s\S]*?<\/details>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');

describe('every language has every page', () => {
  it('the English site has the full page set', () => {
    expect(englishPaths.length).toBeGreaterThanOrEqual(44);
  });
  for (const lang of PREFIXED_LOCALES) {
    it(`/${lang}/ has the same ${englishPaths.length} pages as English`, () => {
      const missing = englishPaths.filter((p) => !byPath.has(localizePath(p, lang)));
      expect(missing).toEqual([]);
      expect(pages.filter((p) => p.lang === lang)).toHaveLength(englishPaths.length);
    });
  }
});

describe.each(LOCALES.map((l) => l.code as Locale))('pages in %s', (lang) => {
  const info = localeInfo(lang);
  const list = pages.filter((p) => p.lang === lang);

  it('<html lang dir> matches the language', () => {
    const wrong = list.filter((p) => !p.html.includes(`<html lang="${info.hreflang}" dir="${info.dir}"`)).map((p) => p.path);
    expect(wrong).toEqual([]);
  });

  it('canonical is the page itself', () => {
    const wrong = list.filter((p) => canonicalOf(p.html) !== BASE + p.path).map((p) => `${p.path} → ${canonicalOf(p.html)}`);
    expect(wrong).toEqual([]);
  });

  it('hreflang lists all 12 languages plus x-default, and every alternate links back', () => {
    const problems: string[] = [];
    for (const p of list) {
      const alts = alternatesOf(p.html);
      const tags = alts.map((a) => a.hreflang).sort();
      const want = [...LOCALES.map((l) => l.hreflang), 'x-default'].sort();
      if (JSON.stringify(tags) !== JSON.stringify(want)) problems.push(`${p.path}: hreflang set ${tags.join(',')}`);
      const self = alts.find((a) => a.hreflang === info.hreflang);
      if (self?.href !== BASE + p.path) problems.push(`${p.path}: self alternate ${self?.href}`);
      const xd = alts.find((a) => a.hreflang === 'x-default');
      if (xd?.href !== BASE + p.path.replace(/^\/[a-z]{2}\//, lang === 'en' ? p.path : '/')) {
        if (xd?.href !== BASE + localizePath(p.path, 'en')) problems.push(`${p.path}: x-default ${xd?.href}`);
      }
      for (const a of alts) {
        const target = byPath.get(a.href.slice(BASE.length));
        if (!target) {
          problems.push(`${p.path}: alternate ${a.href} does not exist`);
          continue;
        }
        if (!alternatesOf(target.html).some((b) => b.href === BASE + p.path && b.hreflang === info.hreflang))
          problems.push(`${p.path}: ${a.href} does not link back`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('exactly one h1, a title, a description and parseable JSON-LD in this language', () => {
    const problems: string[] = [];
    for (const p of list) {
      const h1s = (p.html.match(/<h1[\s>]/g) ?? []).length;
      if (h1s !== 1) problems.push(`${p.path}: ${h1s} h1`);
      if (!/<title>.+<\/title>/.test(p.html)) problems.push(`${p.path}: no title`);
      if (!/<meta name="description" content=".{50,}"/.test(p.html)) problems.push(`${p.path}: short description`);
      for (const m of p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        let o: Record<string, unknown>;
        try {
          o = JSON.parse(m[1]);
        } catch {
          problems.push(`${p.path}: JSON-LD does not parse`);
          continue;
        }
        if (['WebSite', 'FAQPage', 'BlogPosting', 'Article'].includes(o['@type'] as string) && o.inLanguage !== info.hreflang)
          problems.push(`${p.path}: ${o['@type']} inLanguage ${o.inLanguage}`);
        if (o['@type'] === 'BreadcrumbList') {
          const items = o.itemListElement as { item: string }[];
          if (items.some((i) => splitLocale(i.item.slice(BASE.length)).lang !== lang)) problems.push(`${p.path}: breadcrumb URL in another language`);
        }
        if (o['@type'] === 'Product' && o.url !== BASE + p.path) problems.push(`${p.path}: Product url ${o.url}`);
      }
      if (!p.html.includes(`<meta property="og:locale" content="${info.og}">`)) problems.push(`${p.path}: og:locale`);
      if ((p.html.match(/<meta property="og:locale:alternate"/g) ?? []).length !== LOCALES.length - 1) problems.push(`${p.path}: og:locale:alternate count`);
    }
    expect(problems).toEqual([]);
  });

  it('internal links stay in this language (the language menu excepted)', () => {
    const problems: string[] = [];
    for (const p of list) {
      for (const m of p.html.matchAll(/<(a|form)\s[^>]*>/g)) {
        const tag = m[0];
        if (/\sdata-lang-link=/.test(tag)) continue;
        const href = attr(tag, m[1] === 'a' ? 'href' : 'action');
        if (!href || !href.startsWith('/') || href.startsWith('//')) continue;
        const clean = href.split(/[?#]/)[0];
        if (localizePath(clean, 'fr') === clean) continue; // a static file (/images/…, /llms.txt)
        if (splitLocale(clean).lang !== lang) problems.push(`${p.path} → ${href}`);
      }
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });

  it('the language menu links every language to the same page', () => {
    const problems: string[] = [];
    for (const p of list) {
      const menu = p.html.match(/<details class="lang"[\s\S]*?<\/details>/)?.[0] ?? '';
      for (const l of LOCALES) {
        if (!menu.includes(`href="${localizePath(p.path, l.code)}"`)) problems.push(`${p.path}: no ${l.code} link`);
      }
      if (!/href="https:\/\/translate\.google\.com\/translate\?sl=en&amp;tl=auto&amp;u=/.test(menu)) problems.push(`${p.path}: no Google Translate link`);
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });

  it('never claims to manufacture, in this language either', () => {
    const problems: string[] = [];
    for (const p of list) {
      const text = visibleText(p.html);
      for (const re of claimPatterns(lang)) if (re.test(text)) problems.push(`${p.path}: ${re}`);
    }
    expect(problems).toEqual([]);
  });
});

describe('auto-detect script', () => {
  it('is on English pages only, and never on the 404', () => {
    for (const p of pages) {
      const has = p.html.includes("localStorage.getItem('gb-lang')");
      expect(has, p.path).toBe(p.lang === 'en');
    }
    expect(readFileSync(join(DIST, '404.html'), 'utf8')).not.toContain("localStorage.getItem('gb-lang')");
  });
});

describe('fonts load where they are needed', () => {
  it('preloads the Arabic font on Arabic pages only, and no web font for Chinese italics', () => {
    for (const p of pages) {
      const ar = p.html.includes('ibm-plex-sans-arabic-arabic-400-normal.woff2');
      expect(ar, p.path).toBe(p.lang === 'ar');
      if (p.lang === 'zh') expect(p.html).not.toContain('newsreader-latin-wght-italic.woff2');
    }
  });
});

describe('French pages are in French', () => {
  const fr = pages.filter((p) => p.lang === 'fr');
  const en = getUi('en');
  // Known English UI strings that must not appear on French pages.
  const LEAKS = [
    en.common.requestQuote,
    en.common.skip,
    en.common.straightAnswers,
    'Exporter & Supplier from India',
    en.product.factsH,
    en.product.guidesH,
    en.cards.addToEnquiry,
    en.footer.backToTop,
    en.home.rangeH,
    en.form.submit,
    en.contact.oftenH,
    en.quote.submit,
  ];
  it('no English UI strings leak onto French pages', () => {
    const problems: string[] = [];
    for (const p of fr) {
      const text = visibleText(p.html);
      for (const s of LEAKS) if (text.includes(s)) problems.push(`${p.path}: "${s}"`);
    }
    expect(problems).toEqual([]);
  });
  it('French content is used (not the English fallback) for products, categories and posts', () => {
    const checks: [string, string][] = [
      ['/fr/products/dish-wash-liquid/', 'Liquide vaisselle'],
      ['/fr/categories/kitchen-care/', 'Vaisselle et cuisine'],
      ['/fr/blog/hsn-code-3401-vs-3402-soaps-detergents/', 'Code HSN 3401 ou 3402'],
    ];
    for (const [path, needle] of checks) expect(visibleText(byPath.get(path)!.html), path).toContain(needle);
  });
  it('links inside translated Markdown point to French pages', () => {
    const html = byPath.get('/fr/blog/import-dish-wash-liquid-from-india/')!.html;
    const body = html.match(/<article class="prose post-body">([\s\S]*?)<\/article>/)![1];
    const links = [...body.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]);
    expect(links.length).toBeGreaterThan(0);
    expect(links.filter((l) => !l.startsWith('/fr/'))).toEqual([]);
  });
});

describe('product and range h1s read as one phrase in every language (audit B10)', () => {
  const h1 = (html: string) =>
    (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '')
      .replace(/<span class="visually-hidden">[\s\S]*?<\/span>/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#39;|&#x27;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/[ \t\r\n]+/g, ' ')
      .trim();
  const titled = pages.filter((p) => /\/(products|categories)\/[^/]+\/$/.test(p.path));

  it('French floor cleaner: "Nettoyant sols : exportateur et fournisseur depuis l’Inde"', () => {
    const p = pages.find((x) => x.path === '/fr/products/floor-cleaner/')!;
    expect(h1(p.html)).toBe('Nettoyant sols : exportateur et fournisseur depuis l’Inde');
  });

  it('no Romance-language h1 runs a lower-case word into a capitalised "Exportateur/Exportador"', () => {
    const bad = titled
      .filter((p) => ['fr', 'es', 'pt'].includes(p.lang))
      .map((p) => `${p.path}: ${h1(p.html)}`)
      .filter((s) => /[a-zà-ÿ)] (Exportateur|Exportador)/.test(s));
    expect(bad).toEqual([]);
  });

  it('every product and range h1 is built from its language template', () => {
    const problems: string[] = [];
    for (const p of titled) {
      const tpl = getUi(p.lang).common.titleH1;
      const line2 = tpl.slice(tpl.indexOf('|') + 1);
      if (!h1(p.html).endsWith(line2)) problems.push(`${p.path}: ${h1(p.html)}`);
    }
    expect(problems.slice(0, 10)).toEqual([]);
    expect(titled.length).toBe(12 * 28);
  });
});
