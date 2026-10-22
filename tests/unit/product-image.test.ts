import { describe, it, expect, afterAll } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { productImagePath, productPicture, categoryPicture, webpSize } from '../../src/lib/product-image';

const root = mkdtempSync(join(tmpdir(), 'gb-img-'));
mkdirSync(join(root, 'public/images/products'), { recursive: true });
mkdirSync(join(root, 'public/images/renders'), { recursive: true });
writeFileSync(join(root, 'public/images/products/floor-cleaner.webp'), '');
writeFileSync(join(root, 'public/images/renders/jug.webp'), '');
writeFileSync(join(root, 'public/images/renders/jug-600.webp'), '');
writeFileSync(join(root, 'public/images/renders/spray.webp'), '');
writeFileSync(join(root, 'public/images/renders/jug--surface-home-cleaners.webp'), '');
const realPhoto = (w: number, h: number, alpha = false) =>
  sharp({ create: { width: w, height: h, channels: alpha ? 4 : 3, background: alpha ? { r: 1, g: 2, b: 3, alpha: 0.5 } : '#335544' } }).webp({ lossless: alpha }).toBuffer();
writeFileSync(join(root, 'public/images/products/toilet-bath-soap.webp'), await realPhoto(1448, 1086));
writeFileSync(join(root, 'public/images/products/toilet-bath-soap-800.webp'), await realPhoto(800, 600));
mkdirSync(join(root, 'public/images/categories'), { recursive: true });
writeFileSync(join(root, 'public/images/categories/bath-personal-soaps.webp'), await realPhoto(1448, 1086));
writeFileSync(join(root, 'public/images/renders/category-kitchen-care.webp'), '');
afterAll(() => rmSync(root, { recursive: true, force: true }));

describe('webpSize', () => {
  it('reads lossy, lossless and extended webp headers', async () => {
    expect(webpSize(await realPhoto(1448, 1086))).toEqual({ width: 1448, height: 1086 });
    expect(webpSize(await realPhoto(37, 21, true))).toEqual({ width: 37, height: 21 });
    const ext = await sharp({ create: { width: 640, height: 480, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0.4 } } }).webp({ quality: 70 }).toBuffer();
    expect(webpSize(ext)).toEqual({ width: 640, height: 480 });
  });
  it('returns undefined for anything that is not a webp', () => {
    expect(webpSize(Buffer.from(''))).toBeUndefined();
    expect(webpSize(Buffer.from('not an image at all, just text'))).toBeUndefined();
  });
});

describe('productImagePath', () => {
  it('returns the public URL when the photo exists', () => {
    expect(productImagePath('floor-cleaner', root)).toBe('/images/products/floor-cleaner.webp');
  });
  it('returns undefined when there is no photo', () => {
    expect(productImagePath('glass-cleaner', root)).toBeUndefined();
  });
});

describe('productPicture', () => {
  it("uses the photo's real size and its 800px copy when present", () => {
    expect(productPicture('toilet-bath-soap', 'bar', 'bath-personal-soaps', root)).toEqual({
      kind: 'photo',
      src: '/images/products/toilet-bath-soap.webp',
      srcset: '/images/products/toilet-bath-soap-800.webp 800w, /images/products/toilet-bath-soap.webp 1448w',
      width: 1448,
      height: 1086,
    });
  });
  it("prefers the product's own photo over the render", () => {
    expect(productPicture('floor-cleaner', 'jug', undefined, root)).toEqual({
      kind: 'photo',
      src: '/images/products/floor-cleaner.webp',
      srcset: '/images/products/floor-cleaner.webp 1200w',
      width: 1200,
      height: 1200,
    });
  });
  it('falls back to the studio render of the pack shape, with both sizes', () => {
    expect(productPicture('fabric-softener', 'jug', 'laundry-care', root)).toEqual({
      kind: 'render',
      src: '/images/renders/jug.webp',
      srcset: '/images/renders/jug-600.webp 600w, /images/renders/jug.webp 1200w',
      width: 1200,
      height: 1500,
    });
  });
  it("uses the render in the product's category colours when that variant exists", () => {
    expect(productPicture('floor-cleaner-x', 'jug', 'surface-home-cleaners', root)).toMatchObject({
      kind: 'render',
      src: '/images/renders/jug--surface-home-cleaners.webp',
      srcset: '/images/renders/jug--surface-home-cleaners.webp 1200w',
    });
  });
  it('lists only the sizes that exist', () => {
    expect(productPicture('glass-cleaner', 'spray', 'surface-home-cleaners', root)).toMatchObject({ kind: 'render', srcset: '/images/renders/spray.webp 1200w' });
  });
  it('returns undefined when neither a photo nor a render exists', () => {
    expect(productPicture('soap-noodles', 'sack', 'industrial-raw-materials', root)).toBeUndefined();
  });
});

describe('categoryPicture', () => {
  it("uses the category's own photo when it exists", () => {
    expect(categoryPicture('bath-personal-soaps', root)).toEqual({
      kind: 'photo',
      src: '/images/categories/bath-personal-soaps.webp',
      srcset: '/images/categories/bath-personal-soaps.webp 1448w',
      width: 1448,
      height: 1086,
    });
  });
  it('falls back to the category render', () => {
    expect(categoryPicture('kitchen-care', root)).toMatchObject({ kind: 'render', src: '/images/renders/category-kitchen-care.webp' });
  });
});
