/**
 * Structured data on the built site (run `npm run build` first): parses every JSON-LD block on every
 * page and checks the required fields per schema.org type, the property vocabulary, the @id links
 * between blocks, the page's language and URLs, and the honesty rules (no offers, prices, ratings or
 * reviews; no Manufacturer type; no placeholder contact details).
 *
 * The property lists below are the schema.org properties this site uses, checked against
 * https://schema.org/<Type> (an unknown property is a typo or an invented field). The builders in
 * src/lib/seo.ts are also typed with schema-dts, so `npx astro check` rejects unknown properties.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import site from '../../src/config/site';
import { splitLocale, localeInfo } from '../../src/i18n/locales';

const DIST = resolve(process.cwd(), 'dist');
const BASE = site.url.replace(/\/$/, '');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const full = join(dir, f);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

type Node = Record<string, any>;
const pages = walk(DIST)
  .filter((f) => f.endsWith('/index.html'))
  .map((f) => {
    const path = f.slice(DIST.length).replace(/index\.html$/, '');
    const html = readFileSync(f, 'utf8');
    const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]) as Node);
    return { path, html, blocks, lang: splitLocale(path).lang };
  });

const COMMON = ['@context', '@type', '@id'];
/** schema.org properties allowed per type (the ones this site may emit). */
const VOCAB: Record<string, string[]> = {
  Organization: ['name', 'alternateName', 'url', 'logo', 'image', 'description', 'slogan', 'areaServed', 'knowsAbout', 'parentOrganization', 'foundingDate', 'identifier', 'email', 'telephone', 'address', 'contactPoint', 'sameAs'],
  WebSite: ['name', 'alternateName', 'url', 'description', 'inLanguage', 'publisher'],
  WebPage: ['url', 'name', 'description', 'inLanguage', 'isPartOf', 'publisher', 'about', 'primaryImageOfPage', 'breadcrumb', 'mainEntity', 'dateModified'],
  BreadcrumbList: ['itemListElement'],
  FAQPage: ['url', 'inLanguage', 'mainEntity'],
  ItemList: ['name', 'numberOfItems', 'itemListOrder', 'itemListElement'],
  HowTo: ['name', 'description', 'inLanguage', 'image', 'step'],
  Product: ['name', 'description', 'url', 'sku', 'brand', 'countryOfOrigin', 'category', 'image', 'additionalProperty'],
  BlogPosting: ['headline', 'description', 'datePublished', 'dateModified', 'inLanguage', 'mainEntityOfPage', 'url', 'author', 'publisher', 'keywords', 'image'],
};
for (const t of ['CollectionPage', 'ItemPage', 'AboutPage', 'ContactPage']) VOCAB[t] = VOCAB.WebPage;
const PAGE_TYPES = ['WebPage', 'CollectionPage', 'ItemPage', 'AboutPage', 'ContactPage'];
const FORBIDDEN_KEYS = ['offers', 'aggregateRating', 'review', 'reviews', 'price', 'priceCurrency', 'ratingValue'];
const FORBIDDEN_TYPES = ['Offer', 'AggregateOffer', 'AggregateRating', 'Review', 'Rating', 'Manufacturer'];

/** Every object in a JSON tree. */
function* objects(o: unknown): Generator<Node> {
  if (Array.isArray(o)) for (const x of o) yield* objects(x);
  else if (o && typeof o === 'object') {
    yield o as Node;
    for (const v of Object.values(o)) yield* objects(v);
  }
}
const abs = (u: unknown) => typeof u === 'string' && u.startsWith(BASE + '/');
const distHas = (url: string) => existsSync(join(DIST, url.slice(BASE.length), 'index.html'));

describe('structured data on every page', () => {
  it('finds JSON-LD on every page', () => {
    expect(pages.length).toBeGreaterThan(500);
    expect(pages.filter((p) => p.blocks.length === 0).map((p) => p.path)).toEqual([]);
  });

  it('uses only known schema.org properties, and no offers, ratings, reviews or Manufacturer', () => {
    const problems: string[] = [];
    for (const p of pages) {
      for (const b of p.blocks) {
        if (b['@context'] !== 'https://schema.org') problems.push(`${p.path}: ${b['@type']} @context ${b['@context']}`);
        const allowed = VOCAB[b['@type']];
        if (!allowed) {
          problems.push(`${p.path}: unexpected type ${b['@type']}`);
          continue;
        }
        for (const k of Object.keys(b)) if (!COMMON.includes(k) && !allowed.includes(k)) problems.push(`${p.path}: ${b['@type']}.${k} is not a schema.org property here`);
        for (const o of objects(b)) {
          for (const k of FORBIDDEN_KEYS) if (k in o) problems.push(`${p.path}: ${o['@type'] ?? '?'} has ${k}`);
          if (FORBIDDEN_TYPES.includes(o['@type'])) problems.push(`${p.path}: type ${o['@type']}`);
        }
      }
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });

  it('never publishes placeholder contact details in structured data', () => {
    const all = pages.flatMap((p) => p.blocks.map((b) => JSON.stringify(b))).join('\n');
    expect(all).not.toContain('PLACEHOLDER');
    if (site.contactIsPlaceholder) expect(all).not.toContain('"contactPoint"');
  });

  it('every @id reference points to a node on the same page (or the Organization)', () => {
    const problems: string[] = [];
    for (const p of pages) {
      const defined = new Set(p.blocks.map((b) => b['@id']).filter(Boolean));
      for (const b of p.blocks)
        for (const o of objects(b)) {
          if (o === b || !o['@id'] || Object.keys(o).length > 1) continue; // only pure { "@id": … } references
          if (!defined.has(o['@id'])) problems.push(`${p.path}: ${b['@type']} → ${o['@id']}`);
        }
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });
});

describe.each([...new Set(pages.map((p) => p.lang))])('required fields per type, %s pages', (lang) => {
  const list = pages.filter((p) => p.lang === lang);
  const tag = localeInfo(lang).hreflang;

  it('Organization and WebSite on every page; WebPage, matching the canonical URL', () => {
    const problems: string[] = [];
    for (const p of list) {
      const org = p.blocks.find((b) => b['@type'] === 'Organization');
      const web = p.blocks.find((b) => b['@type'] === 'WebSite');
      const page = p.blocks.find((b) => PAGE_TYPES.includes(b['@type']));
      if (!org?.name || !abs(org.url) || !abs(org.logo?.url) || !org.description || org['@id'] !== `${BASE}/#organization`) problems.push(`${p.path}: Organization`);
      if (org && !(org.knowsAbout?.length > 0) ) problems.push(`${p.path}: Organization.knowsAbout`);
      if (!web?.name || !abs(web.url) || web.inLanguage !== tag || web.publisher?.['@id'] !== `${BASE}/#organization`) problems.push(`${p.path}: WebSite`);
      if (!page || page.url !== BASE + p.path || page.inLanguage !== tag || !page.name || !page.description || !page.isPartOf?.['@id'])
        problems.push(`${p.path}: WebPage ${page?.url} ${page?.inLanguage}`);
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });

  it('BreadcrumbList on every inner page: positions 1…n, absolute URLs in this language, ending at the page', () => {
    const problems: string[] = [];
    for (const p of list) {
      const isHome = p.path === '/' || /^\/[a-z]{2}\/$/.test(p.path);
      const bc = p.blocks.find((b) => b['@type'] === 'BreadcrumbList');
      if (isHome) continue;
      if (!bc) {
        problems.push(`${p.path}: no BreadcrumbList`);
        continue;
      }
      const items = bc.itemListElement as Node[];
      items.forEach((it, i) => {
        if (it['@type'] !== 'ListItem' || it.position !== i + 1 || !it.name || !abs(it.item)) problems.push(`${p.path}: crumb ${i + 1}`);
        else if (splitLocale(it.item.slice(BASE.length)).lang !== lang) problems.push(`${p.path}: crumb ${it.item} in another language`);
      });
      if (items[items.length - 1]?.item !== BASE + p.path) problems.push(`${p.path}: last crumb is not the page`);
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });

  it('Product on product pages: name, description, image, brand, category, sku, HSN; no offers', () => {
    const problems: string[] = [];
    for (const p of list.filter((x) => /\/products\/[^/]+\/$/.test(x.path))) {
      const slug = p.path.split('/').at(-2)!;
      const pr = p.blocks.find((b) => b['@type'] === 'Product');
      if (!pr) {
        problems.push(`${p.path}: no Product`);
        continue;
      }
      if (!pr.name || !pr.description || !pr.category || pr.brand?.name !== site.name || pr.sku !== slug || pr.url !== BASE + p.path) problems.push(`${p.path}: Product fields`);
      const hsn = (pr.additionalProperty as Node[]).find((a) => a.propertyID === 'HSN');
      if (!/^\d{4} \d{2}$/.test(hsn?.value ?? '')) problems.push(`${p.path}: HSN ${hsn?.value}`);
      const photo = `/images/products/${slug}.webp`;
      if (existsSync(resolve(process.cwd(), 'public' + photo)) && pr.image !== BASE + photo) problems.push(`${p.path}: image ${pr.image}`);
      const page = p.blocks.find((b) => b['@type'] === 'ItemPage');
      if (page?.mainEntity?.['@id'] !== pr['@id']) problems.push(`${p.path}: ItemPage.mainEntity`);
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });

  it('ItemList on the products page, category pages and the blog: positions and existing URLs', () => {
    const problems: string[] = [];
    for (const p of list.filter((x) => /\/(products|blog)\/$|\/categories\/[^/]+\/$/.test(x.path))) {
      const l = p.blocks.find((b) => b['@type'] === 'ItemList');
      if (!l) {
        problems.push(`${p.path}: no ItemList`);
        continue;
      }
      const items = l.itemListElement as Node[];
      if (!items.length || l.numberOfItems !== items.length) problems.push(`${p.path}: ItemList count`);
      items.forEach((it, i) => {
        if (it.position !== i + 1 || !it.name || !abs(it.url) || !distHas(it.url)) problems.push(`${p.path}: item ${i + 1} ${it.url}`);
        else if (splitLocale(it.url.slice(BASE.length)).lang !== lang) problems.push(`${p.path}: item ${it.url} in another language`);
      });
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });

  it('FAQPage wherever FAQs appear: questions with answers, in this language', () => {
    const problems: string[] = [];
    for (const p of list) {
      const faq = p.blocks.find((b) => b['@type'] === 'FAQPage');
      const shown = /class="(answer-q|faq-q)|<details class="faq/.test(p.html) || /id="faq"|id="post-faq"/.test(p.html);
      if (!faq) {
        if (shown) problems.push(`${p.path}: FAQs shown but no FAQPage`);
        continue;
      }
      if (faq.inLanguage !== tag) problems.push(`${p.path}: FAQPage inLanguage ${faq.inLanguage}`);
      if (faq.url !== BASE + p.path) problems.push(`${p.path}: FAQPage url ${faq.url}`);
      const qs = faq.mainEntity as Node[];
      if (!qs.length || qs.some((q) => q['@type'] !== 'Question' || !q.name || q.acceptedAnswer?.['@type'] !== 'Answer' || !q.acceptedAnswer.text))
        problems.push(`${p.path}: FAQPage questions`);
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });

  it('BlogPosting on posts: headline, dates, author Organization, publisher logo, image', () => {
    const problems: string[] = [];
    for (const p of list.filter((x) => /\/blog\/[^/]+\/$/.test(x.path))) {
      const a = p.blocks.find((b) => b['@type'] === 'BlogPosting');
      if (!a) {
        problems.push(`${p.path}: no BlogPosting`);
        continue;
      }
      if (!a.headline || a.headline.length > 110) problems.push(`${p.path}: headline`);
      if (!/^\d{4}-\d{2}-\d{2}T/.test(a.datePublished) || !/^\d{4}-\d{2}-\d{2}T/.test(a.dateModified)) problems.push(`${p.path}: dates`);
      if (a.author?.['@type'] !== 'Organization' || a.author.name !== site.name) problems.push(`${p.path}: author`);
      if (!abs(a.publisher?.logo?.url)) problems.push(`${p.path}: publisher logo`);
      if (!(Array.isArray(a.image) ? a.image.every(abs) : abs(a.image))) problems.push(`${p.path}: image`);
      if (a.inLanguage !== tag) problems.push(`${p.path}: inLanguage`);
      if (a.url !== BASE + p.path) problems.push(`${p.path}: url`);
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });

  it('HowTo on the export process page: ordered steps with names and text', () => {
    const p = list.find((x) => /\/export-process\/$/.test(x.path))!;
    const h = p.blocks.find((b) => b['@type'] === 'HowTo')!;
    expect(h.inLanguage).toBe(tag);
    expect(h.step.length).toBeGreaterThanOrEqual(3);
    h.step.forEach((s: Node, i: number) => expect(s).toMatchObject({ '@type': 'HowToStep', position: i + 1 }));
    expect(h.step.every((s: Node) => s.name && s.text && abs(s.url))).toBe(true);
  });
});
