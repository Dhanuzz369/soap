import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
// The original eight guides. Posts added later are welcome; these must stay.
const POST_SLUGS = [
  'bath-soap-grades-tfm-explained', 'detergent-powder-vs-liquid-detergent', 'export-documents-cleaning-products',
  'fabric-softener-buying-guide-importers', 'herbal-phenol-vs-chemical-disinfectants', 'hsn-code-3401-vs-3402-soaps-detergents',
  'import-dish-wash-liquid-from-india', 'private-label-cleaning-products-guide',
];
// Product slugs are read from the product files on disk, so new products resolve automatically.
const productDir = join(root, 'src/content/products');
const PRODUCT_SLUGS = new Set(
  readdirSync(productDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => (matter(readFileSync(join(productDir, f), 'utf8')).data as any).slug as string),
);

const blogDir = join(root, 'src/content/blog');
const posts = readdirSync(blogDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const { data, content } = matter(readFileSync(join(blogDir, f), 'utf8'));
    return { slug: f.replace(/\.md$/, ''), data: data as any, body: content };
  });

const words = (md: string) =>
  md.replace(/\]\([^)]*\)/g, ']').replace(/[#*|>`_-]+/g, ' ').split(/\s+/).filter(Boolean).length;

describe('blog set', () => {
  it('still includes the original 8 posts (adding more is fine)', () => {
    expect(posts.length).toBeGreaterThanOrEqual(POST_SLUGS.length);
    const have = new Set(posts.map((p) => p.slug));
    expect(POST_SLUGS.filter((s) => !have.has(s))).toEqual([]);
  });
});

describe.each(posts)('blog post $slug', (post) => {
  const d = post.data;
  it('has at least 600 words', () => {
    expect(words(post.body)).toBeGreaterThanOrEqual(600);
  });
  it('has a 120-160 character description, unique across posts', () => {
    expect(d.description.length).toBeGreaterThanOrEqual(120);
    expect(d.description.length).toBeLessThanOrEqual(160);
    expect(posts.filter((p) => p.data.description === d.description)).toHaveLength(1);
  });
  it('has a title and a date', () => {
    expect(typeof d.title).toBe('string');
    expect(Number.isNaN(new Date(d.date).getTime())).toBe(false);
  });
  it('has at least 2 related products, all resolving', () => {
    expect(d.relatedProducts.length).toBeGreaterThanOrEqual(2);
    for (const s of d.relatedProducts) expect(PRODUCT_SLUGS.has(s), s).toBe(true);
  });
  it('does not claim to manufacture', () => {
    const all = (post.body + JSON.stringify(d)).toLowerCase();
    expect(all).not.toContain('we manufacture');
    expect(all).not.toContain('our factory');
  });
  it('links to at least 2 product pages that exist', () => {
    const links = [...post.body.matchAll(/\]\((\/products\/([a-z0-9-]+)\/)\)/g)];
    expect(links.length).toBeGreaterThanOrEqual(2);
    for (const l of links) expect(PRODUCT_SLUGS.has(l[2]), l[1]).toBe(true);
  });
});
