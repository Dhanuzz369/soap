#!/usr/bin/env node
/**
 * The home hero's ambient glow: `npm run hero:glow`.
 *
 * For each photo in the hero fan (src/lib/hero-fan.ts FAN_RANGES), writes a tiny, pre-blurred,
 * slightly saturated 64px-wide copy to public/images/hero/glow-<photo>.webp (a few hundred bytes).
 * The page inlines them as data URIs and scales them up behind the fan, so the colour field costs
 * no request, no runtime blur filter and never competes with the front photo for LCP.
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

for (const r of FAN_RANGES) {
  const src = path.join(root, 'public/images/products', `${r.photo}-800.webp`);
  const out = path.join(outDir, `glow-${r.photo}.webp`);
  await sharp(src)
    .resize({ width: 64 })
    .modulate({ saturation: 1.25 })
    .blur(5)
    .webp({ quality: 55, effort: 6 })
    .toFile(out);
  const { size } = await stat(out);
  console.log(`${path.relative(root, out)}  ${size} B`);
}
