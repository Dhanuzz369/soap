import fs from 'node:fs';
import path from 'node:path';

const exists = (root: string, url: string) => fs.existsSync(path.join(root, 'public', url));

/**
 * Public URL of a product photo (`public/images/products/<slug>.webp`) when that file exists
 * at build time, otherwise undefined. Used by ProductVisual, og:image and Product JSON-LD.
 */
export function productImagePath(slug: string, root: string = process.cwd()): string | undefined {
  const url = `/images/products/${slug}.webp`;
  return exists(root, url) ? url : undefined;
}

/** A picture for a product: its own photo, or else the studio render of its pack shape. */
export type ProductPicture =
  | { kind: 'photo'; src: string; width: number; height: number }
  | { kind: 'render'; src: string; srcset: string; width: number; height: number };

/**
 * The product's own photo when present; otherwise the studio render of its pack shape
 * (`public/images/renders/<shape>.webp`, made by `npm run renders`); undefined when neither exists,
 * so the caller can fall back to the flat SVG drawing.
 */
export function productPicture(slug: string, shape: string, root: string = process.cwd()): ProductPicture | undefined {
  const photo = productImagePath(slug, root);
  if (photo) return { kind: 'photo', src: photo, width: 1200, height: 1200 };
  const big = `/images/renders/${shape}.webp`;
  const small = `/images/renders/${shape}-600.webp`;
  if (!exists(root, big)) return undefined;
  return {
    kind: 'render',
    src: big,
    srcset: exists(root, small) ? `${small} 600w, ${big} 1200w` : `${big} 1200w`,
    width: 1200,
    height: 1500,
  };
}
