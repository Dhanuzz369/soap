import fs from 'node:fs';
import path from 'node:path';

const exists = (root: string, url: string) => fs.existsSync(path.join(root, 'public', url));

/** Pixel size from a WebP header (lossy VP8, lossless VP8L or extended VP8X), or undefined. */
export function webpSize(buf: Buffer): { width: number; height: number } | undefined {
  if (buf.length < 30 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return undefined;
  const chunk = buf.toString('ascii', 12, 16);
  if (chunk === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  if (chunk === 'VP8L') {
    const b = buf.readUInt32LE(21);
    return { width: (b & 0x3fff) + 1, height: ((b >>> 14) & 0x3fff) + 1 };
  }
  if (chunk === 'VP8X') return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
  return undefined;
}

const sizeOf = (root: string, url: string, fallback: { width: number; height: number }) => {
  try {
    return webpSize(fs.readFileSync(path.join(root, 'public', url))) ?? fallback;
  } catch {
    return fallback;
  }
};

/** A photo at its real size, with its 800px copy (`<name>-800.webp`) in the srcset when present. */
function photo(root: string, url: string): ProductPicture {
  const { width, height } = sizeOf(root, url, { width: 1200, height: 1200 });
  const small = url.replace(/\.webp$/, '-800.webp');
  const srcset = exists(root, small) ? `${small} 800w, ${url} ${width}w` : `${url} ${width}w`;
  return { kind: 'photo', src: url, srcset, width, height };
}

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
  | { kind: 'photo'; src: string; srcset: string; width: number; height: number }
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
  const own = productImagePath(slug, root);
  if (own) return photo(root, own);
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

/**
 * The picture for a category: its own photo (`public/images/categories/<slug>.webp`) when present,
 * otherwise its group render (`public/images/renders/category-<slug>.webp`).
 */
export function categoryPicture(slug: string, root: string = process.cwd()): ProductPicture {
  const own = `/images/categories/${slug}.webp`;
  if (exists(root, own)) return photo(root, own);
  const src = `/images/renders/category-${slug}.webp`;
  const { width, height } = sizeOf(root, src, { width: 1000, height: 800 });
  return { kind: 'render', src, srcset: `${src} ${width}w`, width, height };
}

/** Pixel size from a PNG (IHDR) or JPEG (first SOF marker) header, or undefined. */
export function rasterSize(buf: Buffer): { width: number; height: number } | undefined {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) return undefined;
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc)
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      i += 2 + len;
    }
  }
  return webpSize(buf);
}

/** Size of an image in public/ (WebP, PNG or JPEG), or undefined when it is missing or unreadable. */
export function publicImageSize(url: string, root: string = process.cwd()): { width: number; height: number } | undefined {
  try {
    return rasterSize(fs.readFileSync(path.join(root, 'public', url)));
  } catch {
    return undefined;
  }
}

/** The 1200 × 630 share card of a page (npm run og), when it exists. */
export function ogCard(file: string, root: string = process.cwd()): string | undefined {
  const url = `/og/${file}`;
  return exists(root, url) ? url : undefined;
}
