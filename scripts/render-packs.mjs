#!/usr/bin/env node
/**
 * Studio renders of the pack shapes: `npm run renders`.
 *
 * Serves scripts/render/index.html with Vite (so it can import the site's own Three.js pack
 * builders, studio lights and range still), drives it with Playwright in an installed Chrome,
 * and writes transparent WebP cut-outs (alpha) to public/images/renders/:
 *   <shape>.webp (1200×1500) and <shape>-600.webp (600×750)   one per pack shape
 *   <shape>--<category>.webp (+ -600)                          the same pack in another category's
 *                                                            colours, where a product needs it
 *   category-<slug>.webp                                     a small group per category (bento tiles)
 *   range-cutout.webp (1600×1280) + range-cutout-800.webp      the range group (Products, Export Process bands)
 * and the neem-leaf cut-out public/images/found/neem-leaves.webp (from the public-domain plate).
 *
 * Glossy studio quality: PET bottles with transmission and thickness, clearcoat 1 on caps,
 * clearcoated labels, strip softboxes for long specular highlights, rim lights, a soft contact
 * shadow and a faint floor reflection. Each still is rendered twice, in colour on the forest
 * field and as a white-on-black coverage matte; dividing out the field gives a clean alpha
 * channel, including the half-transparent shadow and reflection. The page supplies the field,
 * glow, vignette and grain in CSS.
 *
 * These are honest illustrations of pack formats, not product photographs; alt text says so.
 * Each file is kept under ~180 KB by stepping the WebP quality down if needed.
 *
 * Needs Google Chrome (or set CHROME_PATH to a Chromium-based browser).
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public/images/renders');
const MAX_BYTES = 180 * 1024;
/** The forest field the colour pass is rendered on (studio.ts FIELD, --forest-950). */
const FIELD = [0x0b, 0x21, 0x1a];
const only = process.argv.slice(2); // optional filter: names to render, e.g. `npm run renders -- jug range-hero`

const SHAPES = [
  'squeeze', 'jug', 'spray', 'pump', 'angled', 'bar', 'bar-clear', 'bar-duo',
  'bar-long', 'tub', 'pouch', 'carboy', 'drum', 'sack',
];

/** Category groups for the home bento: [slug, tint, w, h, items]. */
const GROUPS = [
  ['bath-personal-soaps', 'soaps', 1440, 1200, [
    { shape: 'pump', x: -0.9, z: -0.7, yaw: 0.3, shadow: 1.6 },
    { shape: 'bar-clear', x: 0.75, z: 0.2, yaw: -0.45, shadow: 2.2, lift: 0.08 },
    { shape: 'bar', x: -1.35, z: 1.25, yaw: 0.55, shadow: 2.2, lift: 0.06 },
    { shape: 'bar-duo', x: 1.1, z: 1.6, yaw: -0.35, shadow: 2.2, lift: 0.06 },
  ], 0.8],
  ['industrial-raw-materials', 'raw', 760, 1200, [
    { shape: 'drum', x: 0.1, z: -1.2, yaw: 0.15, shadow: 2.0 },
    { shape: 'sack', x: -0.35, z: 0.75, yaw: 0.25, shadow: 2.0, lift: 0.02 },
    { shape: 'carboy', x: 0.85, z: 1.4, yaw: -0.4, shadow: 1.9, lift: 0.02 },
  ], 0.78],
  ['laundry-care', 'laundry', 1000, 800, [
    { shape: 'jug', x: -0.7, z: -0.4, yaw: 0.4, shadow: 2.0 },
    { shape: 'pouch', x: 0.95, z: -0.2, yaw: -0.35, shadow: 1.7, lift: 0.02 },
    { shape: 'bar-long', x: 0.1, z: 1.3, yaw: 0.25, shadow: 2.6, lift: 0.04 },
  ], 0.62],
  ['kitchen-care', 'kitchen', 1000, 800, [
    { shape: 'squeeze', x: -0.55, z: -0.35, yaw: -0.25, shadow: 1.5 },
    { shape: 'spray', x: 0.75, z: -0.75, yaw: -0.5, shadow: 1.5 },
    { shape: 'tub', x: 0.45, z: 0.95, yaw: 0.2, shadow: 2.1, lift: 0.04 },
  ], 0.62],
  ['surface-home-cleaners', 'surface', 1000, 800, [
    { shape: 'jug', x: -0.85, z: -0.5, yaw: 0.45, shadow: 2.0 },
    { shape: 'spray', x: 0.55, z: -0.6, yaw: -0.45, shadow: 1.5 },
    { shape: 'angled', x: 0.2, z: 0.85, yaw: 0.1, shadow: 1.5 },
  ], 0.64],
];

const want = (name) => only.length === 0 || only.includes(name);

/**
 * Cut-out from the two passes: alpha = matte coverage; colour = (pixel − field·(1 − α)) / α,
 * which removes the field from every edge, shadow and reflection pixel. Returns raw RGBA.
 */
async function cutout(colorPng, mattePng) {
  const c = await sharp(colorPng).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const m = await sharp(mattePng).removeAlpha().raw().toBuffer();
  const { width, height } = c.info;
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0, j = 0; i < width * height; i++, j += 3) {
    const a = m[j] / 255;
    const o = i * 4;
    if (a < 1 / 255) continue;
    for (let k = 0; k < 3; k++) {
      const v = (c.data[j + k] - FIELD[k] * (1 - a)) / a;
      out[o + k] = v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
    }
    out[o + 3] = m[j];
  }
  return { raw: out, width, height };
}

async function save(name, img, width, height, dir = outDir) {
  let quality = 84;
  let buf;
  for (;;) {
    buf = await sharp(img.raw, { raw: { width: img.width, height: img.height, channels: 4 } })
      .resize(width, height)
      .webp({ quality, alphaQuality: 90, effort: 6, smartSubsample: true })
      .toBuffer();
    if (buf.length <= MAX_BYTES || quality <= 50) break;
    quality -= 6;
  }
  await writeFile(path.join(dir, `${name}.webp`), buf);
  console.log(`  ${name}.webp  ${width}×${height}  ${(buf.length / 1024).toFixed(0)} KB  q${quality}`);
}

/**
 * The neem-leaf cut-out: the public-domain plate (1873) already in the repo, with the paper
 * removed. Ink density becomes alpha; the line work is set in mint for the dark fields.
 */
async function neemLeaves() {
  const src = path.join(root, 'public/images/found/neem-plate.webp');
  const { data, info } = await sharp(src).greyscale().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  const mint = [0xbf, 0xe3, 0xcf];
  for (let i = 0; i < info.width * info.height; i++) {
    const l = data[i * info.channels];
    // paper (≥ 215) → clear, ink (≤ 70) → solid, smooth in between
    const t = Math.min(1, Math.max(0, (215 - l) / 145));
    const a = t * t * (3 - 2 * t);
    out.set(mint, i * 4);
    out[i * 4 + 3] = Math.round(a * 255);
  }
  await save('neem-leaves', { raw: out, width: info.width, height: info.height }, 1100, 682, path.join(root, 'public/images/found'));
}

const server = await createServer({
  root,
  configFile: false,
  logLevel: 'error',
  server: { port: 0, host: '127.0.0.1' },
  optimizeDeps: { entries: ['scripts/render/index.html'] },
});
await server.listen();
const url = `${server.resolvedUrls.local[0]}scripts/render/index.html`;

const browser = await chromium.launch({
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' }),
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

try {
  await mkdir(outDir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1600 } });
  page.on('pageerror', (e) => console.error('page error:', e.message));
  await page.goto(url);
  await page.waitForFunction(() => window.studioReady === true, null, { timeout: 120_000 });
  const grab = () => page.evaluate(() => document.getElementById('c').toDataURL('image/png'));
  const png = (dataUrl) => Buffer.from(dataUrl.split(',')[1], 'base64');
  /** Renders both passes with `fn(pass)` and returns the cut-out. */
  const twoPass = async (fn, arg) => {
    await page.evaluate(fn, [...arg, 'color']);
    const color = png(await grab());
    await page.evaluate(fn, [...arg, 'matte']);
    const matte = png(await grab());
    return cutout(color, matte);
  };

  console.log('Pack shapes');
  for (const shape of SHAPES) {
    if (!want(shape)) continue;
    const shot = await twoPass(([s, p]) => window.renderShape(s, 1200, 1500, undefined, p), [shape]);
    await save(shape, shot, 1200, 1500);
    await save(`${shape}-600`, shot, 600, 750);
  }

  // Tint variants: a shape used by a product in a category other than the shape's default tint.
  const { bySlug, shapeFor } = await server.ssrLoadModule('/src/lib/pack-shapes.ts');
  const { SHAPE_TINT, CATEGORY_TINT } = await server.ssrLoadModule('/src/scripts/three/packs.ts');
  const productDir = path.join(root, 'src/content/products');
  const variants = new Set();
  for (const f of await readdir(productDir)) {
    if (!f.endsWith('.md')) continue;
    const { data } = matter(await readFile(path.join(productDir, f), 'utf8'));
    const shape = shapeFor(data.slug, data.category);
    if (CATEGORY_TINT[data.category] && CATEGORY_TINT[data.category] !== SHAPE_TINT[shape]) variants.add(`${shape}--${data.category}`);
  }
  void bySlug;
  console.log('Tint variants');
  for (const v of [...variants].sort()) {
    if (!want(v)) continue;
    const [shape, category] = v.split('--');
    const shot = await twoPass(([s, c, p]) => window.renderShape(s, 1200, 1500, c, p), [shape, category]);
    await save(v, shot, 1200, 1500);
    await save(`${v}-600`, shot, 600, 750);
  }

  console.log('Category groups');
  for (const [slug, tint, w, h, items, fill] of GROUPS) {
    const name = `category-${slug}`;
    if (!want(name)) continue;
    const shot = await twoPass(([i, t, ww, hh, f, p]) => window.renderGroup(i, t, ww, hh, f, p), [items, tint, w, h, fill]);
    await save(name, shot, w, h);
  }

  if (want('range-cutout')) {
    console.log('Range cut-out');
    const shot = await twoPass(([p]) => window.renderHero(p), []);
    await save('range-cutout', shot, 1600, 1280);
    await save('range-cutout-800', shot, 800, 640);
  }

  if (want('neem-leaves')) {
    console.log('Neem leaves');
    await neemLeaves();
  }
} finally {
  await browser.close();
  await server.close();
}
