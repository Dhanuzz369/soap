// Renders the site icons from the leaf mark in public/favicon.svg:
//   public/logo-512.png            the square logo (Organization structured data, social profiles)
//   public/apple-touch-icon.png    180 × 180, full-bleed (iOS rounds the corners itself)
//   public/icon-192.png, icon-512.png       web app manifest icons
//   public/icon-maskable-512.png   the same with the safe-zone padding Android masks need
//   public/favicon.ico             16, 32 and 48 px in one file, for browsers and crawlers that ask for /favicon.ico
// Run: npm run icons   (uses sharp, already a dev dependency)
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pub = (f) => fileURLToPath(new URL(`../public/${f}`, import.meta.url));
const FOREST = '#1d5a42';
const MINT = '#cdefd8';

/** The mark on a square field. `pad` shrinks the leaf (0 = as in favicon.svg). `radius` rounds the field. */
const mark = (size, { pad = 0, radius = 0 } = {}) => {
  const s = (32 - pad * 2) / 32;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="${radius}" fill="${FOREST}"/>
  <g transform="translate(${pad} ${pad}) scale(${s})">
    <path fill="${MINT}" d="M16 5c7.5 4 9.2 15.3 0 23.5C6.8 20.3 8.5 9 16 5Z"/>
    <path fill="${FOREST}" d="M15 11h2v14h-2z"/>
  </g>
</svg>`);
};

const png = (svg, size) => sharp(svg, { density: Math.max(72, (size / 32) * 72) }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

const files = {
  'logo-512.png': await png(mark(512, { pad: 2 }), 512),
  'apple-touch-icon.png': await png(mark(180, { pad: 3 }), 180),
  'icon-192.png': await png(mark(192, { pad: 2, radius: 7 }), 192),
  'icon-512.png': await png(mark(512, { pad: 2, radius: 7 }), 512),
  'icon-maskable-512.png': await png(mark(512, { pad: 7 }), 512),
};
for (const [name, buf] of Object.entries(files)) writeFileSync(pub(name), buf);

// favicon.ico: an ICONDIR header, one ICONDIRENTRY per size, then the PNG images (PNG-in-ICO is
// supported by every current browser).
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(mark(s, { radius: 7 }), s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt8(0, e + 2);
  header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
writeFileSync(pub('favicon.ico'), Buffer.concat([header, ...images]));

console.log(`wrote ${[...Object.keys(files), 'favicon.ico'].map((f) => `public/${f}`).join(', ')}`);
