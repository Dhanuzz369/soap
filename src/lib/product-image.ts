import fs from 'node:fs';
import path from 'node:path';

/**
 * Public URL of a product photo (`public/images/products/<slug>.webp`) when that file exists
 * at build time, otherwise undefined. Used by ProductVisual, og:image and Product JSON-LD.
 */
export function productImagePath(slug: string, root: string = process.cwd()): string | undefined {
  const url = `/images/products/${slug}.webp`;
  return fs.existsSync(path.join(root, 'public', url)) ? url : undefined;
}
