import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import site from '../../src/config/site';
import { LOCALE_CODES, PREFIXED_LOCALES } from '../../src/i18n/locales';
import { DICTS, en, getUi, mergeDict, missingKeys, placeholderProblems, fmt } from '../../src/i18n/ui';
import { getFaqGroups, getHomeFaqs, homeFaqs } from '../../src/lib/faqs';
import { QUANTITY_VALUES } from '../../src/lib/enquiry';

/** Keys a language file has that English does not (typos, renamed keys). */
function extraKeys(base: unknown, dict: unknown, prefix = ''): string[] {
  if (!dict || typeof dict !== 'object' || Array.isArray(dict) || typeof base !== 'object' || base === null || Array.isArray(base)) return [];
  return Object.keys(dict).flatMap((k) =>
    k in (base as object) ? extraKeys((base as never)[k], (dict as never)[k], prefix ? `${prefix}.${k}` : k) : [prefix ? `${prefix}.${k}` : k],
  );
}

describe('UI dictionaries', () => {
  it('has a file per language, registered in src/i18n/ui/index.ts', () => {
    for (const code of LOCALE_CODES) {
      expect(existsSync(join(process.cwd(), 'src/i18n/ui', `${code}.ts`)), code).toBe(true);
      expect(DICTS[code], code).toBeDefined();
    }
  });
  it('keeps the export terms identical to src/config/site.ts in English', () => {
    expect(en.terms).toEqual(site.exportTerms);
    expect(en.meta.tagline).toBe(site.tagline);
  });
  it('language files use only keys that exist in English', () => {
    for (const code of PREFIXED_LOCALES) expect(extraKeys(en, DICTS[code]), code).toEqual([]);
  });
  it('every language keeps the English placeholders it translates', () => {
    for (const code of PREFIXED_LOCALES) expect(placeholderProblems(en, DICTS[code]), code).toEqual([]);
  });
  it('French is complete', () => {
    expect(missingKeys(en, DICTS.fr)).toEqual([]);
  });
  it('the enquiry quantity labels line up with the English values sent to GoodBiz', () => {
    expect(en.form.quantities).toEqual([...QUANTITY_VALUES]);
    for (const code of LOCALE_CODES) expect(getUi(code).form.quantities, code).toHaveLength(QUANTITY_VALUES.length);
  });
});

describe('mergeDict / missingKeys / fmt', () => {
  const base = { a: 'A', b: { c: 'C', d: 'D' }, list: ['x', 'y'] };
  it('falls back to English key by key', () => {
    expect(mergeDict(base, { b: { c: 'c-fr' } })).toEqual({ a: 'A', b: { c: 'c-fr', d: 'D' }, list: ['x', 'y'] });
    expect(mergeDict(base, { a: '' })).toEqual(base);
  });
  it('replaces arrays only when they have the same length', () => {
    expect(mergeDict(base, { list: ['1', '2'] }).list).toEqual(['1', '2']);
    expect(mergeDict(base, { list: ['1'] }).list).toEqual(['x', 'y']);
  });
  it('lists missing keys with dotted paths', () => {
    expect(missingKeys(base, { a: 'x', b: { c: 'y' }, list: ['1'] })).toEqual(['b.d', 'list (needs 2 items, has 1)']);
    expect(missingKeys(base, {})).toEqual(['a', 'b.c', 'b.d', 'list[0]', 'list[1]']);
  });
  it('reports lost placeholders, treating {name} and {nameLower} as interchangeable', () => {
    expect(placeholderProblems({ s: 'View all {n} products' }, { s: 'Voir tout' })).toEqual(['s: missing {n}']);
    expect(placeholderProblems({ s: 'All {nameLower}' }, { s: 'Alle {name}' })).toEqual([]);
  });
  it('fills placeholders and leaves unknown ones visible', () => {
    expect(fmt('{n} products · HSN {hsn}', { n: 4, hsn: '3402' })).toBe('4 products · HSN 3402');
    expect(fmt('{x} left', {})).toBe('{x} left');
  });
});

describe('company FAQs', () => {
  it('English output is unchanged by the move to dictionaries', () => {
    expect(homeFaqs.map((f) => f.q)).toEqual([
      'Does GoodBiz Hygiene manufacture the products it exports?',
      'Can I order products under my own brand?',
      'Can I combine different products in one container?',
      'Which incoterms and payment terms do you offer?',
      'How long does an order take to ship?',
      'Which HSN codes apply to soaps and cleaning products?',
    ]);
    expect(homeFaqs[3].a).toBe(`${site.exportTerms.incoterms}.`);
    expect(homeFaqs[4].a).toBe(`${site.exportTerms.leadTime}. ${site.exportTerms.port}.`);
  });
  it('French FAQs are translated and filled with the French terms', () => {
    const fr = getHomeFaqs('fr');
    expect(fr[0].q).toMatch(/fabrique-t-elle/);
    expect(fr[3].a).toContain('FOB, CIF et CFR');
    expect(getFaqGroups('fr').flatMap((g) => g.faqs).every((f) => !/\{\w+\}/.test(f.a + f.q))).toBe(true);
  });
});

describe('src/i18n/ui/fr.ts typography', () => {
  it('uses non-breaking spaces before French high punctuation', () => {
    const src = readFileSync(join(process.cwd(), 'src/i18n/ui/fr.ts'), 'utf8');
    const strings = [...src.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1]);
    const bad = strings.filter((s) => / [:;?!]/.test(s));
    expect(bad).toEqual([]);
  });
});
