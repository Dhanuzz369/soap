/**
 * The minimum order is stated the same way everywhere (audit B3): every product says "No fixed
 * minimum", so no FAQ may say that minimums are "listed on each product page".
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { getUi } from '../../src/i18n/ui';
import { LOCALE_CODES } from '../../src/i18n/locales';

const dir = 'src/content/products';
const products = readdirSync(dir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => matter(readFileSync(join(dir, f), 'utf8')).data as { slug: string; moq: string });

/** The old wording, per language: "minimums … listed (as typical) on each product page". */
const STALE: Record<string, RegExp> = {
  en: /minimum[^.]*(listed|shown|given)[^.]*product page|product page[^.]*lists?[^.]*minimum/i,
  fr: /valeurs types figurent sur chaque fiche/,
  es: /se indican como valores típicos en cada página/,
  pt: /constam, como valores típicos, na página/,
  de: /auf jeder Produktseite als typische Werte/,
  ru: /указаны как типовые на странице/,
  zh: /各产品页面列有典型数值/,
  ar: /مذكورة كقيم نموذجية في صفحة كل منتج/,
  tr: /her ürün sayfasında tipik olarak belirtilir/,
  id: /dicantumkan sebagai nilai tipikal di setiap halaman produk/,
  sw: /huorodheshwa kama cha kawaida kwenye ukurasa wa kila bidhaa/,
  vi: /được nêu ở mức điển hình trên trang của từng sản phẩm/,
};

describe('minimum order consistency', () => {
  it('every product says there is no fixed minimum', () => {
    expect(products.length).toBeGreaterThan(0);
    for (const p of products) expect(p.moq, p.slug).toMatch(/^No fixed minimum/);
  });

  for (const lang of LOCALE_CODES) {
    it(`${lang}: no FAQ claims minimums are listed on product pages`, () => {
      const ui = getUi(lang);
      const answers = [...ui.faqs.flatMap((g) => g.faqs), ...ui.privateLabel.faqs, ...ui.horeca.faqs, ...ui.exportProcess.faqs].map((f) => f.a);
      for (const a of answers) {
        expect(a).not.toMatch(STALE.en);
        expect(a).not.toMatch(STALE[lang]);
      }
    });
  }

  it('the English private-label answer says there is no fixed minimum', () => {
    const a = getUi('en').faqs[1].faqs[0].a;
    expect(a).toContain('no fixed minimum');
    expect(a).toContain('stated on the quotation');
  });
});
