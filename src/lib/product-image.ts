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
 * The product's own photo when present; otherwise the studio render of its pack shape, in its
 * category's colours when that variant exists (`public/images/renders/<shape>--<category>.webp`),
 * else the shape's default render (`<shape>.webp`), all made by `npm run renders`.
 * Undefined when there is no picture at all, so the caller can fall back to the flat SVG drawing.
 */
export function productPicture(
  slug: string,
  shape: string,
  category?: string,
  root: string = process.cwd(),
): ProductPicture | undefined {
  const photo = productImagePath(slug, root);
  if (photo) return { kind: 'photo', src: photo, width: 1200, height: 1200 };
  const variant = category ? `${shape}--${category}` : '';
  const name = variant && exists(root, `/images/renders/${variant}.webp`) ? variant : shape;
  const big = `/images/renders/${name}.webp`;
  const small = `/images/renders/${name}-600.webp`;
  if (!exists(root, big)) return undefined;
  return {
    kind: 'render',
    src: big,
    srcset: exists(root, small) ? `${small} 600w, ${big} 1200w` : `${big} 1200w`,
    width: 1200,
    height: 1500,
  };
}
