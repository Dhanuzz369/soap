import { describe, it, expect } from 'vitest';
import {
  organizationJsonLd, websiteJsonLd, breadcrumbJsonLd, faqJsonLd,
  productJsonLd, articleJsonLd, pageTitle, absoluteUrl,
} from '../../src/lib/seo';
import type { ProductData } from '../../src/lib/types';

const sampleProduct: ProductData = {
  title: 'Dish Wash Liquid', slug: 'dish-wash-liquid', category: 'home-care', order: 1,
  hsn: '3402 50', metaTitle: 'Dish Wash Liquid Exporter & Supplier from India',
  metaDescription: 'Dish wash liquid sourced from vetted Indian manufacturers.',
  answer: 'Dish wash liquid exported from India.', variants: ['Lemon'], packSizes: ['500 ml'],
  packaging: ['Bottle'], specs: [{ label: 'pH', value: 'typical 7' }], moq: '1 x 20ft',
  privateLabel: { available: true, options: ['Custom label'] }, uses: ['Kitchen'],
  markets: ['UAE'], faqs: [], related: [],
};

describe('seo', () => {
  it('organization is an Organization with parent, no sameAs by default', () => {
    const o = organizationJsonLd();
    expect(o['@type']).toBe('Organization');
    expect(JSON.stringify(o)).not.toMatch(/Manufacturer/);
    expect(o.parentOrganization).toMatchObject({ '@type': 'Organization', name: 'GoodBiz Global' });
    expect('sameAs' in o).toBe(false);
  });
  it('website', () => {
    expect(websiteJsonLd()['@type']).toBe('WebSite');
  });
  it('product has no offers/aggregateRating and carries HSN', () => {
    const p: any = productJsonLd(sampleProduct, 'https://www.goodbizhygiene.com/products/dish-wash-liquid/');
    expect(p['@type']).toBe('Product');
    expect(p).not.toHaveProperty('offers');
    expect(p).not.toHaveProperty('aggregateRating');
    expect(p).not.toHaveProperty('review');
    expect(p.brand).toMatchObject({ name: 'GoodBiz Hygiene' });
    expect(p.additionalProperty).toContainEqual({ '@type': 'PropertyValue', name: 'HSN Code', value: '3402 50' });
  });
  it('faq', () => {
    const f: any = faqJsonLd([{ q: 'Q?', a: 'A.' }]);
    expect(f.mainEntity[0]).toMatchObject({ '@type': 'Question', name: 'Q?', acceptedAnswer: { '@type': 'Answer', text: 'A.' } });
  });
  it('breadcrumb positions and absolute urls', () => {
    const b: any = breadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'X', url: '/x/' }]);
    expect(b.itemListElement[1].position).toBe(2);
    expect(b.itemListElement[1].item).toBe('https://www.goodbizhygiene.com/x/');
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
  });
  it('absoluteUrl', () => {
    expect(absoluteUrl('/products/')).toBe('https://www.goodbizhygiene.com/products/');
    expect(absoluteUrl('https://x.com/a')).toBe('https://x.com/a');
  });
});
