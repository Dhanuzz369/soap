/**
 * Checks every translated content file in src/content/i18n/<lang>/ against its English source.
 * Missing translations are fine here (they fall back to English; `npm run i18n:check` lists
 * them). A translation that EXISTS must be well formed, honest and consistent.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { PREFIXED_LOCALES, type Locale } from '../../src/i18n/locales';
import { claimPatterns, FORBIDDEN_CLAIMS } from '../../src/i18n/honesty';
import { getUi } from '../../src/i18n/ui';
import { FIXED_FIELDS, mergeEntryData } from '../../src/i18n/merge';

const root = process.cwd();
const COLLS = ['products', 'categories', 'blog'] as const;
const slugsOf = (coll: string) =>
  new Set(readdirSync(join(root, 'src/content', coll)).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')));
const SLUGS = Object.fromEntries(COLLS.map((c) => [c, slugsOf(c)])) as Record<(typeof COLLS)[number], Set<string>>;

type Tr = { lang: Locale; coll: (typeof COLLS)[number]; slug: string; file: string; data: any; body: string; en: { data: any; body: string } };
const translations: Tr[] = [];
for (const lang of PREFIXED_LOCALES) {
  for (const coll of COLLS) {
    const dir = join(root, 'src/content/i18n', lang, coll);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
      const slug = f.replace(/\.md$/, '');
      const { data, content } = matter(readFileSync(join(dir, f), 'utf8'));
      const enPath = join(root, 'src/content', coll, f);
      const en = existsSync(enPath) ? matter(readFileSync(enPath, 'utf8')) : { data: {}, content: '' };
      translations.push({ lang, coll, slug, file: `src/content/i18n/${lang}/${coll}/${f}`, data, body: content, en: { data: en.data, body: en.content } });
    }
  }
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[  ]/g, ' ')
    .replace(/[‐‑‒–—−]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\.$/, '');

describe('translation files', () => {
  it('French is fully translated (the reference language)', () => {
    for (const coll of COLLS) {
      const have = new Set(translations.filter((t) => t.lang === 'fr' && t.coll === coll).map((t) => t.slug));
      expect([...SLUGS[coll]].filter((s) => !have.has(s)), coll).toEqual([]);
    }
  });

  it('honesty patterns exist for every language (add yours to src/i18n/honesty.ts)', () => {
    for (const lang of PREFIXED_LOCALES) expect(Array.isArray(FORBIDDEN_CLAIMS[lang]), lang).toBe(true);
    expect(FORBIDDEN_CLAIMS.fr.length).toBeGreaterThan(0);
  });

  for (const t of translations) {
    describe(t.file, () => {
      it('has an English source, a sourceHash stamp and unchanged fixed fields', () => {
        expect(SLUGS[t.coll].has(t.slug), 'no English file with this name').toBe(true);
        expect(typeof t.data.sourceHash, 'run npm run i18n:stamp on this file').toBe('string');
        for (const k of FIXED_FIELDS[t.coll]) {
          if (t.data[k] === undefined) continue;
          const a = t.data[k] instanceof Date ? t.data[k].toISOString() : t.data[k];
          const b = t.en.data[k] instanceof Date ? t.en.data[k].toISOString() : t.en.data[k];
          expect(a, `"${k}" must stay as in English`).toEqual(b);
        }
      });

      it('keeps the number of specs and FAQs, and the HS codes in notes', () => {
        for (const k of ['specs', 'faqs']) {
          if (Array.isArray(t.data[k]) && Array.isArray(t.en.data[k])) expect(t.data[k].length, k).toBe(t.en.data[k].length);
        }
        const codes = (s?: string) => (s ?? '').match(/\d{4} \d{2}/g) ?? [];
        expect(codes(t.data.hsnNote).sort()).toEqual(codes(t.en.data.hsnNote).sort());
      });

      it('has search snippets of a sensible length', () => {
        const desc = t.data.metaDescription ?? t.data.description;
        if (desc) {
          expect(desc.length, 'aim for 120-160 characters').toBeGreaterThanOrEqual(70);
          expect(desc.length, 'aim for 120-160 characters').toBeLessThanOrEqual(170);
        }
      });

      it('never claims to manufacture', () => {
        const text = JSON.stringify(t.data) + '\n' + t.body;
        for (const re of claimPatterns(t.lang)) expect(text, String(re)).not.toMatch(re);
      });

      it('links only to pages that exist (English paths; they are localized automatically)', () => {
        for (const m of t.body.matchAll(/\]\((\/[^)\s]*)\)/g)) {
          const href = m[1];
          const p = href.match(/^\/(products|categories|blog)\/([a-z0-9-]+)\/(?:#.*)?$/);
          if (p) expect(SLUGS[p[1] as (typeof COLLS)[number]].has(p[2]), href).toBe(true);
          expect(href, 'write the English path, without a language prefix').not.toMatch(/^\/[a-z]{2}\//);
        }
      });

      it("repeats the export terms in this language's current wording", () => {
        const terms = getUi(t.lang).terms;
        const text = norm(JSON.stringify(t.data) + ' ' + t.body);
        if (text.includes('fob, cif')) expect(text, `use: "${terms.incoterms}"`).toContain(norm(terms.incoterms));
        // The lead-time figure: from the first digit to the first comma, e.g. "3 à 5 semaines après confirmation de la commande".
        const figure = norm(terms.leadTime.split(',')[0]).replace(/^\D+/, '');
        const pattern = new RegExp(figure.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\d+/g, '\\d+'));
        if (pattern.test(text)) expect(text, `use: "${figure}"`).toContain(figure);
      });
    });
  }
});

describe('mergeEntryData', () => {
  const en = {
    title: 'Dish Wash Liquid',
    slug: 'dish-wash-liquid',
    hsn: '3402 50',
    related: ['a'],
    privateLabel: { available: true, options: ['Own brand'] },
    gallery: [{ src: '/images/x.webp', alt: 'A', caption: 'C' }],
    faqs: [{ q: 'Q', a: 'A' }],
  };
  it('takes translated fields, keeps fixed ones and falls back field by field', () => {
    const out = mergeEntryData('products', en, {
      title: 'Liquide vaisselle',
      slug: 'liquide-vaisselle',
      hsn: '9999 99',
      related: ['b'],
      sourceHash: 'abc',
      privateLabel: { available: false, options: ['Votre marque'] },
      gallery: [{ src: '/images/other.webp', alt: 'A-fr', caption: 'C-fr' }],
      typo: 'ignored',
    });
    expect(out).toEqual({
      title: 'Liquide vaisselle',
      slug: 'dish-wash-liquid',
      hsn: '3402 50',
      related: ['a'],
      privateLabel: { available: true, options: ['Votre marque'] },
      gallery: [{ src: '/images/x.webp', alt: 'A-fr', caption: 'C-fr' }],
      faqs: [{ q: 'Q', a: 'A' }],
    });
  });
  it('keeps blog dates and related products from English', () => {
    const d = new Date('2026-01-01');
    const out = mergeEntryData('blog', { title: 'T', date: d, relatedProducts: ['x'] }, { title: 'T-fr', date: new Date('2020-01-01'), relatedProducts: [] });
    expect(out).toEqual({ title: 'T-fr', date: d, relatedProducts: ['x'] });
  });
});
