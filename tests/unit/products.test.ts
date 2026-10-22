import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { groupByCategory, pickRelated } from '../../src/lib/product-utils';

const EXPECTED_SLUGS = [
  'toilet-bath-soap', 'herbal-ayurvedic-soap', 'glycerin-transparent-soap', 'antibacterial-soap',
  'hotel-guest-soap', 'liquid-hand-wash', 'body-wash-shower-gel',
  'laundry-soap-bar', 'detergent-powder', 'liquid-detergent', 'fabric-softener',
  'dish-wash-liquid', 'dish-wash-bar',
  'floor-cleaner', 'herbal-phenol', 'glass-cleaner', 'toilet-bowl-cleaner', 'bathroom-tile-cleaner',
  'multi-surface-cleaner',
  'soap-noodles', 'labsa', 'sles', 'bulk-institutional-cleaners',
];
const EXPECTED_HSN: Record<string, string> = {
  'toilet-bath-soap': '3401 11', 'herbal-ayurvedic-soap': '3401 11', 'glycerin-transparent-soap': '3401 11',
  'antibacterial-soap': '3401 11', 'hotel-guest-soap': '3401 11', 'liquid-hand-wash': '3401 30', 'body-wash-shower-gel': '3401 30',
  'laundry-soap-bar': '3401 19', 'detergent-powder': '3402 50', 'liquid-detergent': '3402 50', 'fabric-softener': '3402 50',
  'dish-wash-liquid': '3402 50', 'dish-wash-bar': '3401 19',
  'floor-cleaner': '3402 50', 'herbal-phenol': '3402 50',
  'glass-cleaner': '3402 50', 'toilet-bowl-cleaner': '3402 50', 'bathroom-tile-cleaner': '3402 50',
  'multi-surface-cleaner': '3402 50', 'soap-noodles': '3401 20', 'labsa': '3402 31',
  'sles': '3402 39', 'bulk-institutional-cleaners': '3402 90',
};
const CATEGORY_SLUGS = ['bath-personal-soaps', 'laundry-care', 'kitchen-care', 'surface-home-cleaners', 'industrial-raw-materials'];

const dir = (p: string) => join(process.cwd(), 'src/content', p);
const load = (p: string) =>
  readdirSync(dir(p)).filter((f) => f.endsWith('.md')).map((f) => {
    const { data, content } = matter(readFileSync(join(dir(p), f), 'utf8'));
    return { file: f, ...(data as any), body: content } as any;
  });

// Everything below is checked against the files actually on disk, so adding a product
// (or a category) is safe. EXPECTED_SLUGS / EXPECTED_HSN only pin the original range.
const products = load('products');
const categories = load('categories');
const bySlug: Record<string, any> = Object.fromEntries(products.map((p) => [p.slug, p]));
const slugs = new Set<string>(products.map((p) => p.slug));
const categorySlugs = categories.map((c) => c.slug);

describe('products content', () => {
  it('has unique slugs and still includes the original 23 products', () => {
    expect(slugs.size).toBe(products.length);
    expect(products.length).toBeGreaterThanOrEqual(EXPECTED_SLUGS.length);
    const missing = EXPECTED_SLUGS.filter((s) => !slugs.has(s));
    expect(missing).toEqual([]);
  });

  it('has the 5 original categories, each with at least one product', () => {
    for (const c of CATEGORY_SLUGS) expect(categorySlugs).toContain(c);
    for (const c of categorySlugs) expect(products.filter((p) => p.category === c).length, c).toBeGreaterThanOrEqual(1);
    for (const c of categories) {
      expect(c.summary.length).toBeLessThanOrEqual(160);
      expect(c.hsnRange).toBeTruthy();
      expect(c.intro.length).toBeGreaterThan(50);
    }
  });

  for (const p of products) {
    describe(p.slug, () => {
      it('file name matches slug and category is valid', () => {
        expect(p.file).toBe(`${p.slug}.md`);
        expect(categorySlugs).toContain(p.category);
      });
      it('has valid structured data', () => {
        expect(p.hsn).toMatch(/^\d{4} \d{2}$/);
        if (p.slug in EXPECTED_HSN) expect(p.hsn).toBe(EXPECTED_HSN[p.slug]);
        expect(p.metaTitle).toContain('Exporter & Supplier from India');
        expect(p.metaDescription.length).toBeGreaterThanOrEqual(120);
        expect(p.metaDescription.length).toBeLessThanOrEqual(160);
        expect(p.faqs.length).toBeGreaterThanOrEqual(4);
        expect(p.faqs.length).toBeLessThanOrEqual(6);
        expect(p.variants.length).toBeGreaterThanOrEqual(3);
        expect(p.packSizes.length).toBeGreaterThanOrEqual(3);
        expect(p.specs.length).toBeGreaterThanOrEqual(4);
        expect(p.related.every((r: string) => slugs.has(r) && r !== p.slug)).toBe(true);
      });
      it('copy is compliant and long enough', () => {
        expect(`${p.answer} ${p.body}`).not.toMatch(/\bwe manufacture\b|\bour factory\b|\bour plant\b/i);
        expect(p.body.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(350);
      });
    });
  }

  it('has unique meta descriptions and answers', () => {
    expect(new Set(products.map((p) => p.metaDescription)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.answer)).size).toBe(products.length);
  });

  it('does not repeat templated sentences across more than 3 products', () => {
    const ALLOWED = ['FOB, CIF and CFR', 'ITC-HS code'];
    const seen = new Map<string, Set<string>>();
    for (const p of products) {
      const sentences = p.body.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/);
      for (const raw of sentences) {
        const s = raw.trim();
        if (s.split(' ').length < 12 || ALLOWED.some((a) => s.includes(a))) continue;
        if (!seen.has(s)) seen.set(s, new Set());
        seen.get(s)!.add(p.slug);
      }
    }
    const repeated = [...seen].filter(([, f]) => f.size > 3).map(([s, f]) => `${f.size}x: ${s}`);
    expect(repeated).toEqual([]);
  });

  it('notes alternative classifications', () => {
    expect(bySlug['fabric-softener']?.hsnNote).toMatch(/3809 91/);
    expect(bySlug['herbal-phenol']?.hsnNote).toMatch(/3808 94/);
  });
});

describe('product helpers', () => {
  const cats = [{ slug: 'b', order: 2 }, { slug: 'a', order: 1 }];
  const prods = [
    { slug: 'p1', category: 'a', order: 2, related: ['p3'] },
    { slug: 'p2', category: 'a', order: 1, related: [] },
    { slug: 'p3', category: 'b', order: 1, related: [] },
    { slug: 'p4', category: 'a', order: 3, related: [] },
  ];
  it('groups by category sorted by order', () => {
    const g = groupByCategory(cats, prods);
    expect(g.map((x) => x.category.slug)).toEqual(['a', 'b']);
    expect(g[0].products.map((p) => p.slug)).toEqual(['p2', 'p1', 'p4']);
  });
  it('picks explicit related first then same category', () => {
    expect(pickRelated(prods[0], prods, 3).map((p) => p.slug)).toEqual(['p3', 'p2', 'p4']);
    expect(pickRelated(prods[0], prods, 1).map((p) => p.slug)).toEqual(['p3']);
  });
});
