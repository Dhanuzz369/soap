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
 * Run it again after replacing one of those photos.
 */
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { FAN_RANGES } from '../src/lib/hero-fan.ts';

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
