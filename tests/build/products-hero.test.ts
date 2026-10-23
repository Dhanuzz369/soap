/**
 * "The shelf", the /products/ hero (src/components/ProductsHero.astro), in every language
 * (run `npm run build` first).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { LOCALES, localizePath, type Locale } from '../../src/i18n/locales';
import { SHELF_EAGER } from '../../src/lib/shelf';

const ROOT = process.cwd();
const DIST = resolve(ROOT, 'dist');
const PRODUCTS = readdirSync(resolve(ROOT, 'src/content/products'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));
/** Products with their own photo (public/images/products/<slug>.webp): the only ones on the shelf. */
const WITH_PHOTO = PRODUCTS.filter((s) => existsSync(join(ROOT, 'public/images/products', `${s}.webp`)));

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const between = (s: string, start: string, end: string) => {
  const a = s.indexOf(start);
  if (a < 0) return '';
  const b = s.indexOf(end, a);
  return s.slice(a, b < 0 ? undefined : b);
};
/** Each <ul class="shelf-set"…> … </ul> in order, with its opening tag. */
const setsOf = (shelf: string) => [...shelf.matchAll(/(<ul class="shelf-set"[^>]*>)([\s\S]*?)<\/ul>/g)].map((m) => ({ open: m[1], body: m[2] }));
const cardsOf = (body: string) => [...body.matchAll(/<a class="shelf-card"[^>]*>[\s\S]*?<img[^>]*>/g)].map((m) => m[0]);

describe.each(LOCALES.map((l) => l.code as Locale))('/products/ hero in %s', (lang) => {
  const path = localizePath('/products/', lang);
  const html = readFileSync(join(DIST, path, 'index.html'), 'utf8');
  const hero = between(html, '<section class="ph ph--shelf"', '</section>');
  const shelf = between(hero, '<div class="shelf"', '<div class="wrap shelf-foot"');
  const sets = setsOf(shelf);

  it('has the shelf hero with exactly one h1 on the page', () => {
    expect(hero.length).toBeGreaterThan(0);
    expect((html.match(/<h1[\s>]/g) ?? []).length).toBe(1);
    expect(hero).toMatch(/<h1 id="page-h"/);
    expect(attr(shelf.match(/<div class="shelf"[^>]*>/)![0], 'role')).toBe('region');
    expect(attr(shelf.match(/<div class="shelf"[^>]*>/)![0], 'aria-label')).toBeTruthy();
  });

  it('counts the products in the lead from the data', () => {
    const lead = hero.match(/<p class="ph-lead shelf-lead">([^<]*)<\/p>/)![1];
    expect(lead).toContain(String(PRODUCTS.length));
  });

  it('two rows, each a real set and an aria-hidden copy whose links are out of the tab order', () => {
    expect((shelf.match(/<div class="shelf-row"/g) ?? []).length).toBe(2);
    expect(sets).toHaveLength(4);
    for (let r = 0; r < 2; r++) {
      const [real, copy] = [sets[r * 2], sets[r * 2 + 1]];
      expect(attr(real.open, 'aria-hidden')).toBeUndefined();
      expect(attr(copy.open, 'aria-hidden')).toBe('true');
      expect(cardsOf(copy.body).map((c) => attr(c, 'href'))).toEqual(cardsOf(real.body).map((c) => attr(c, 'href')));
      for (const c of cardsOf(real.body)) expect(attr(c, 'tabindex')).toBeUndefined();
      for (const c of cardsOf(copy.body)) expect(attr(c, 'tabindex')).toBe('-1');
    }
  });

  it('shows only products with a real photo, each once, linking to its page in this language', () => {
    const real = [sets[0], sets[2]].flatMap((s) => cardsOf(s.body));
    const slugs = real.map((c) => attr(c, 'href')!.match(/\/products\/([^/]+)\/$/)![1]);
    expect([...slugs].sort()).toEqual([...WITH_PHOTO].sort());
    for (const c of real) {
      const href = attr(c, 'href')!;
      const slug = href.match(/\/products\/([^/]+)\/$/)![1];
      expect(href).toBe(localizePath(`/products/${slug}/`, lang));
      expect(attr(c, 'src')).toBe(`/images/products/${slug}.webp`);
      expect(attr(c, 'width')).toBeTruthy();
      expect(attr(c, 'height')).toBeTruthy();
      expect(attr(c, 'srcset')).toContain(`/images/products/${slug}-800.webp 800w`);
    }
  });

  it('loads the first cards of row 1 eagerly, with one high-priority image', () => {
    const row1 = cardsOf(sets[0].body);
    row1.forEach((c, i) => expect(attr(c, 'loading')).toBe(i < SHELF_EAGER ? 'eager' : 'lazy'));
    expect((shelf.match(/fetchpriority="high"/g) ?? []).length).toBe(1);
    expect(attr(row1[0], 'fetchpriority')).toBe('high');
  });

  it('range pills jump to sections that exist on the page', () => {
    const pills = [...hero.matchAll(/<a class="shelf-pill" href="([^"]+)"/g)].map((m) => m[1]);
    expect(pills.length).toBe(readdirSync(resolve(ROOT, 'src/content/categories')).filter((f) => f.endsWith('.md')).length);
    for (const href of pills) {
      expect(href).toMatch(/^#c-[a-z0-9-]+$/);
      expect(html).toContain(`id="${href.slice(1)}"`);
    }
  });

  it('keeps the HSN overview reachable', () => {
    expect(hero).toContain('href="#hsn"');
    expect(html).toContain('id="hsn"');
  });
});
