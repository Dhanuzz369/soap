import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const slugList = (p: string) => readFileSync(join(root, p), 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
const POST_SLUGS = slugList('.superpowers/sdd/2026-10-16-goodbiz-hygiene-website/blog-slugs.txt');
const PRODUCT_SLUGS = new Set(slugList('.superpowers/sdd/2026-10-16-goodbiz-hygiene-website/slugs.txt'));

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
  it('has the 8 planned posts', () => {
    expect(POST_SLUGS).toHaveLength(8);
    expect(posts.map((p) => p.slug).sort()).toEqual([...POST_SLUGS].sort());
  });
});

describe.each(posts)('blog post $slug', (post) => {
  const d = post.data;
  it('is a planned slug', () => expect(POST_SLUGS).toContain(post.slug));
  it('has 1,000 to 1,800 words', () => {
    const n = words(post.body);
    expect(n).toBeGreaterThanOrEqual(1000);
    expect(n).toBeLessThanOrEqual(1800);
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
