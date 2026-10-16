import { describe, it, expect, afterAll } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { productImagePath } from '../../src/lib/product-image';

const root = mkdtempSync(join(tmpdir(), 'gb-img-'));
mkdirSync(join(root, 'public/images/products'), { recursive: true });
writeFileSync(join(root, 'public/images/products/floor-cleaner.webp'), '');
afterAll(() => rmSync(root, { recursive: true, force: true }));

describe('productImagePath', () => {
  it('returns the public URL when the photo exists', () => {
    expect(productImagePath('floor-cleaner', root)).toBe('/images/products/floor-cleaner.webp');
  });
  it('returns undefined when there is no photo', () => {
    expect(productImagePath('glass-cleaner', root)).toBeUndefined();
  });
});
