#!/usr/bin/env node
/**
 * Studio renders of the pack shapes: `npm run renders`.
 *
 * Serves scripts/render/index.html with Vite (so it can import the site's own Three.js pack
 * builders, studio lights and hero scene), drives it with Playwright in an installed Chrome,
 * and writes WebP files to public/images/renders/:
 *   <shape>.webp (1200×1500) and <shape>-600.webp (600×750)   one per pack shape
 *   <shape>--<category>.webp (+ -600)                          the same pack in another category's
 *                                                            colours, where a product needs it
 *   category-<slug>.webp                                     a small group per category (bento tiles)
 *   range-hero.webp (1600×1000)                              the home hero still and LCP image
 *
 * These are honest illustrations of pack formats, not product photographs; alt text says so.
 * Each file is kept under ~150 KB by stepping the WebP quality down if needed.
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
const MAX_BYTES = 150 * 1024;
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

async function save(name, png, width, height) {
  let quality = 82;
  let buf;
  for (;;) {
    buf = await sharp(png).resize(width, height).webp({ quality, effort: 6, smartSubsample: true }).toBuffer();
    if (buf.length <= MAX_BYTES || quality <= 50) break;
    quality -= 6;
  }
  await writeFile(path.join(outDir, `${name}.webp`), buf);
  console.log(`  ${name}.webp  ${width}×${height}  ${(buf.length / 1024).toFixed(0)} KB  q${quality}`);
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

  console.log('Pack shapes');
  for (const shape of SHAPES) {
    if (!want(shape)) continue;
    await page.evaluate((s) => window.renderShape(s, 1200, 1500), shape);
    const shot = png(await grab());
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
    await page.evaluate(([s, c]) => window.renderShape(s, 1200, 1500, c), [shape, category]);
    const shot = png(await grab());
    await save(v, shot, 1200, 1500);
    await save(`${v}-600`, shot, 600, 750);
  }

  console.log('Category groups');
  for (const [slug, tint, w, h, items, fill] of GROUPS) {
    const name = `category-${slug}`;
    if (!want(name)) continue;
    await page.evaluate(([i, t, ww, hh, f]) => window.renderGroup(i, t, ww, hh, f), [items, tint, w, h, fill]);
    await save(name, png(await grab()), w, h);
  }

  if (want('range-hero')) {
    console.log('Hero still');
    await page.evaluate(() => window.renderHero());
    await save('range-hero', png(await grab()), 1600, 1000);
  }
} finally {
  await browser.close();
  await server.close();
}
