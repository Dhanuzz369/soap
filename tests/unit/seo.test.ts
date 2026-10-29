import { describe, it, expect } from 'vitest';
import {
  organizationJsonLd, websiteJsonLd, breadcrumbJsonLd, faqJsonLd,
  productJsonLd, articleJsonLd, pageTitle, absoluteUrl,
  buildKeywords, MAX_KEYWORDS, itemListJsonLd, howToJsonLd,
} from '../../src/lib/seo';
import type { ProductData } from '../../src/lib/types';
import site from '../../src/config/site';

const BASE = site.url.replace(/\/$/, '');

const sampleProduct: ProductData = {
  title: 'Dish Wash Liquid', slug: 'dish-wash-liquid', category: 'Kitchen Care', order: 1,
  hsn: '3402 50', metaTitle: 'Dish Wash Liquid Exporter & Supplier from India',
  metaDescription: 'Dish wash liquid sourced from vetted Indian manufacturers.',
  answer: 'Dish wash liquid exported from India.', variants: ['Lemon', 'Lime'], packSizes: ['500 ml', '5 L'],
  packaging: ['Bottle'], specs: [{ label: 'pH', value: 'typical 7' }], moq: '1 x 20ft',
  privateLabel: { available: true, options: ['Custom label'] }, uses: ['Kitchen'],
  markets: ['UAE'], faqs: [], related: [],
};

describe('seo', () => {
  it('organization is an Organization with parent, no sameAs by default', () => {
    const o: any = organizationJsonLd();
    expect(o['@type']).toBe('Organization');
    expect(JSON.stringify(o)).not.toMatch(/Manufacturer/);
    expect(o.parentOrganization).toMatchObject({ '@type': 'Organization', name: 'GoodBiz Global' });
    expect('sameAs' in o).toBe(false);
  });
  it('website', () => {
    expect(websiteJsonLd()['@type']).toBe('WebSite');
  });
  it('organization has a square logo and knowsAbout, and hides placeholder contacts', () => {
    const o: any = organizationJsonLd();
    expect(o.logo).toMatchObject({ '@type': 'ImageObject', url: `${BASE}/logo-512.png` });
    expect(o.knowsAbout.length).toBeGreaterThan(3);
    expect(o.areaServed).toBe('Worldwide');
    if (site.contactIsPlaceholder) {
      expect(o).not.toHaveProperty('contactPoint');
      expect(JSON.stringify(o)).not.toContain('PLACEHOLDER');
    } else expect(o.contactPoint).toMatchObject({ '@type': 'ContactPoint' });
  });
  it('keywords: filled, de-duplicated, unfilled templates dropped, capped at 12', () => {
    const k = buildKeywords(['{kw} exporter India', 'Bulk {kw}', 'bulk {kw}', '{x} y', 'HSN {hsn}'], { kw: 'LABSA', hsn: '3402 31' });
    expect(k).toEqual(['LABSA exporter India', 'Bulk LABSA', 'HSN 3402 31']);
    expect(buildKeywords(Array.from({ length: 20 }, (_, i) => `k${i}`))).toHaveLength(MAX_KEYWORDS);
  });
  it('item list and how-to carry positions and absolute URLs', () => {
    const l: any = itemListJsonLd('/products/', 'All', [{ name: 'A', url: '/products/a/' }, { name: 'B', url: '/products/b/' }]);
    expect(l.itemListElement[1]).toMatchObject({ '@type': 'ListItem', position: 2, url: `${BASE}/products/b/` });
    const h: any = howToJsonLd({ url: '/export-process/', name: 'N', description: 'D', inLanguage: 'en', steps: [{ name: 'S', text: 'T' }] });
    expect(h.step[0]).toMatchObject({ '@type': 'HowToStep', position: 1, url: `${BASE}/export-process/#steps` });
    expect(h.inLanguage).toBe('en');
  });
  it('product has no offers/aggregateRating and carries HSN', () => {
    const p: any = productJsonLd(sampleProduct, `${BASE}/products/dish-wash-liquid/`);
    expect(p['@type']).toBe('Product');
    expect(p).not.toHaveProperty('offers');
    expect(p).not.toHaveProperty('aggregateRating');
    expect(p).not.toHaveProperty('review');
    expect(p.brand).toMatchObject({ name: 'GoodBiz Hygiene' });
    expect(p.additionalProperty).toContainEqual({ '@type': 'PropertyValue', name: 'HSN Code', propertyID: 'HSN', value: '3402 50' });
    expect(p.sku).toBe('dish-wash-liquid');
    expect(p['@id']).toBe(`${BASE}/products/dish-wash-liquid/#product`);
    expect(p.countryOfOrigin).toMatchObject({ '@type': 'Country', name: 'India' });
  });
  it('product carries category title, variants and pack sizes', () => {
    const p: any = productJsonLd(sampleProduct, `${BASE}/products/dish-wash-liquid/`);
    expect(p.category).toBe('Kitchen Care');
    expect(p.additionalProperty).toContainEqual({ '@type': 'PropertyValue', name: 'Variants', value: 'Lemon, Lime' });
    expect(p.additionalProperty).toContainEqual({ '@type': 'PropertyValue', name: 'Pack sizes', value: '500 ml, 5 L' });
  });
  it('faq', () => {
    const f: any = faqJsonLd([{ q: 'Q?', a: 'A.' }]);
    expect(f.mainEntity[0]).toMatchObject({ '@type': 'Question', name: 'Q?', acceptedAnswer: { '@type': 'Answer', text: 'A.' } });
  });
  it('breadcrumb positions and absolute urls', () => {
    const b: any = breadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'X', url: '/x/' }]);
    expect(b.itemListElement[1].position).toBe(2);
    expect(b.itemListElement[1].item).toBe(`${BASE}/x/`);
  });
  it('article', () => {
    const a: any = articleJsonLd({ title: 'T', description: 'D', date: new Date('2026-01-02T00:00:00Z'), url: '/blog/t/' });
    expect(a['@type']).toBe('Article');
    expect(a.datePublished).toBe('2026-01-02T00:00:00.000Z');
    expect(a).not.toHaveProperty('image');
  });
  it('pageTitle', () => {
    expect(pageTitle('Floor Cleaner Exporter & Supplier from India')).toBe('Floor Cleaner Exporter & Supplier from India | GoodBiz Hygiene');
    expect(pageTitle('Contact | GoodBiz Hygiene')).toBe('Contact | GoodBiz Hygiene');
    // The brand is not repeated, and is left off when it would only be cut off in search results
    // (Google shows the site name above the title anyway).
    expect(pageTitle('About GoodBiz Hygiene: Soap & Detergent Exporter, India')).toBe('About GoodBiz Hygiene: Soap & Detergent Exporter, India');
    const long = 'Hotel & Guest Soap (Mini Bars): Exporter & Supplier, India';
    expect(pageTitle(long)).toBe(long);
    // Chinese characters are about twice as wide in a result.
    expect(pageTitle('洗碗液出口商和供应商（印度）')).toBe('洗碗液出口商和供应商（印度） | GoodBiz Hygiene');
    expect(pageTitle('浴皂和香皂出口商和供应商：来自印度的商人出口商和贸易公司')).toBe('浴皂和香皂出口商和供应商：来自印度的商人出口商和贸易公司');
  });
  it('absoluteUrl', () => {
    expect(absoluteUrl('/products/')).toBe(`${BASE}/products/`);
    expect(absoluteUrl('https://x.com/a')).toBe('https://x.com/a');
  });
});
