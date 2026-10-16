import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { groupByCategory, pickRelated } from '../../src/lib/product-utils';

const EXPECTED_SLUGS = [
  'toilet-bath-soap', 'herbal-ayurvedic-soap', 'glycerin-transparent-soap', 'antibacterial-soap',
  'hotel-guest-soap', 'liquid-hand-wash', 'body-wash-shower-gel',
  'laundry-soap-bar', 'detergent-powder', 'liquid-detergent', 'fabric-softener', 'fabric-whitener-stain-remover',
  'dish-wash-liquid', 'dish-wash-bar', 'dish-wash-powder', 'kitchen-degreaser',
  'floor-cleaner', 'herbal-phenol', 'glass-cleaner', 'toilet-bowl-cleaner', 'bathroom-tile-cleaner',
  'multi-surface-cleaner', 'car-wash-shampoo',
  'soap-noodles', 'labsa', 'sles', 'bulk-institutional-cleaners',
];
const CATEGORY_SLUGS = ['bath-personal-soaps', 'laundry-care', 'kitchen-care', 'surface-home-cleaners', 'industrial-raw-materials'];

const dir = (p: string) => join(process.cwd(), 'src/content', p);
const load = (p: string) =>
  readdirSync(dir(p)).filter((f) => f.endsWith('.md')).map((f) => {
    const { data, content } = matter(readFileSync(join(dir(p), f), 'utf8'));
    return { file: f, ...(data as any), body: content } as any;
  });

const products = load('products');
const categories = load('categories');
const bySlug: Record<string, any> = Object.fromEntries(products.map((p) => [p.slug, p]));
const slugs = new Set(EXPECTED_SLUGS);

describe('products content', () => {
  it('has all 27 products with unique slugs', () => {
    expect(products).toHaveLength(27);
    expect(new Set(products.map((p) => p.slug)).size).toBe(27);
    expect([...products.map((p) => p.slug)].sort()).toEqual([...EXPECTED_SLUGS].sort());
  });

  it('has 5 categories', () => {
    expect(categories.map((c) => c.slug).sort()).toEqual([...CATEGORY_SLUGS].sort());
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
        expect(CATEGORY_SLUGS).toContain(p.category);
        expect(slugs.has(p.slug)).toBe(true);
      });
      it('has valid structured data', () => {
        expect(p.hsn).toMatch(/^\d{4} \d{2}$/);
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
