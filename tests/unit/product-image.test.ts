import { describe, it, expect, afterAll } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { productImagePath, productPicture } from '../../src/lib/product-image';

const root = mkdtempSync(join(tmpdir(), 'gb-img-'));
mkdirSync(join(root, 'public/images/products'), { recursive: true });
mkdirSync(join(root, 'public/images/renders'), { recursive: true });
writeFileSync(join(root, 'public/images/products/floor-cleaner.webp'), '');
writeFileSync(join(root, 'public/images/renders/jug.webp'), '');
writeFileSync(join(root, 'public/images/renders/jug-600.webp'), '');
writeFileSync(join(root, 'public/images/renders/spray.webp'), '');
afterAll(() => rmSync(root, { recursive: true, force: true }));

describe('productImagePath', () => {
  it('returns the public URL when the photo exists', () => {
    expect(productImagePath('floor-cleaner', root)).toBe('/images/products/floor-cleaner.webp');
  });
  it('returns undefined when there is no photo', () => {
    expect(productImagePath('glass-cleaner', root)).toBeUndefined();
  });
});

describe('productPicture', () => {
  it("prefers the product's own photo over the render", () => {
    expect(productPicture('floor-cleaner', 'jug', root)).toEqual({
      kind: 'photo',
      src: '/images/products/floor-cleaner.webp',
      width: 1200,
      height: 1200,
    });
  });
  it('falls back to the studio render of the pack shape, with both sizes', () => {
    expect(productPicture('fabric-softener', 'jug', root)).toEqual({
      kind: 'render',
      src: '/images/renders/jug.webp',
      srcset: '/images/renders/jug-600.webp 600w, /images/renders/jug.webp 1200w',
      width: 1200,
      height: 1500,
    });
  });
  it('lists only the sizes that exist', () => {
    expect(productPicture('glass-cleaner', 'spray', root)).toMatchObject({ kind: 'render', srcset: '/images/renders/spray.webp 1200w' });
  });
  it('returns undefined when neither a photo nor a render exists', () => {
    expect(productPicture('soap-noodles', 'sack', root)).toBeUndefined();
  });
});
