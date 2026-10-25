#!/usr/bin/env node
/**
 * The home hero fan's image copies: `npm run hero:images`.
 *
 * For each photo in the fan (src/lib/hero-fan.ts FAN_RANGES), from public/images/products/<photo>.webp:
 *  - public/images/hero/<photo>-480.webp and -640.webp: smaller copies for the srcset, so a phone
 *    gets a sharp front photo (the LCP image) in ~40% fewer bytes than the 800px copy.
 *  - public/images/hero/glow-<photo>.webp: a tiny, pre-blurred, slightly saturated 64px copy (a few
 *    hundred bytes). The page inlines it as a data URI behind the fan (the ambient glow) and as each
 *    back card's placeholder, so the colour costs no request and no runtime blur filter.
 *
 * For every product photo (public/images/products/<slug>.webp, variants with `--` excepted):
 *  - public/images/shelf/<slug>-480.webp: the /products/ hero shelf's small copy (src/lib/shelf.ts),
 *    so a phone's ~210px card (and a 300px card on a 1x screen) loads ~half the bytes of the 800px copy.
 *
 * For every product (src/content/products/*.md):
 *  - public/images/thumbs/<slug>-96.webp: a 96px square thumbnail of its photo, or of its studio
 *    render when it has no photo yet, for the small product lists in the HoReCa hero's cards.
 * Run it again after replacing or adding a photo.
 */
import { mkdir, readdir, stat, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { FAN_RANGES } from '../src/lib/hero-fan.ts';
import { shapeFor } from '../src/lib/pack-shapes.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public/images/hero');
await mkdir(outDir, { recursive: true });
const report = async (file) => console.log(`${path.relative(root, file)}  ${(await stat(file)).size} B`);

for (const r of FAN_RANGES) {
  const src = path.join(root, 'public/images/products', `${r.photo}.webp`);
  for (const w of [480, 640]) {
    const out = path.join(outDir, `${r.photo}-${w}.webp`);
    await sharp(src).resize({ width: w }).webp({ quality: 72, effort: 6 }).toFile(out);
    await report(out);
  }
  const glow = path.join(outDir, `glow-${r.photo}.webp`);
  await sharp(src)
    .resize({ width: 64 })
    .modulate({ saturation: 1.25 })
    .blur(5)
    .webp({ quality: 55, effort: 6 })
    .toFile(glow);
  await report(glow);
}

const shelfDir = path.join(root, 'public/images/shelf');
await mkdir(shelfDir, { recursive: true });
const photos = (await readdir(path.join(root, 'public/images/products'))).filter((f) => /^[a-z0-9-]+\.webp$/.test(f) && !/-\d+\.webp$/.test(f) && !f.includes('--'));
for (const f of photos) {
  const out = path.join(shelfDir, f.replace(/\.webp$/, '-480.webp'));
  await sharp(path.join(root, 'public/images/products', f)).resize({ width: 480 }).webp({ quality: 72, effort: 6 }).toFile(out);
  await report(out);
}

const thumbDir = path.join(root, 'public/images/thumbs');
await mkdir(thumbDir, { recursive: true });
const productFiles = (await readdir(path.join(root, 'src/content/products'))).filter((f) => f.endsWith('.md'));
for (const f of productFiles) {
  const slug = f.replace(/\.md$/, '');
  const category = (await readFile(path.join(root, 'src/content/products', f), 'utf8')).match(/^category:\s*(\S+)/m)[1];
  const photo = path.join(root, 'public/images/products', `${slug}.webp`);
  const shape = shapeFor(slug, category);
  const variant = path.join(root, 'public/images/renders', `${shape}--${category}.webp`);
  const src = existsSync(photo) ? photo : existsSync(variant) ? variant : path.join(root, 'public/images/renders', `${shape}.webp`);
  if (!existsSync(src)) continue;
  const out = path.join(thumbDir, `${slug}-96.webp`);
  const fit = src === photo ? 'cover' : 'contain';
  await sharp(src)
    .resize({ width: 96, height: 96, fit, background: { r: 11, g: 33, b: 26, alpha: 1 } })
    .flatten({ background: { r: 11, g: 33, b: 26 } })
    .webp({ quality: 70, effort: 6 })
    .toFile(out);
  await report(out);
}
