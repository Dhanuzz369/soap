// Renders public/og-default.png (1200 × 630): the brand name, the tagline and a mosaic of
// chapter-colour tiles holding the same pack drawings the site uses.
// Run: node scripts/make-og.mjs   (Node 23.6+ for the .ts imports; uses sharp, an Astro dependency)
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import site from '../src/config/site.ts';
import { shapes } from '../src/lib/pack-shapes.ts';

const out = fileURLToPath(new URL('../public/og-default.png', import.meta.url));

// Chapter fields and tints, as in src/styles/tokens.css.
const chapters = {
  soaps: { field: '#dcefe2', body: '#a9d9bd', dark: '#3f7d5e', light: '#f2faf5' },
  laundry: { field: '#d4e8e7', body: '#9ccbca', dark: '#39716f', light: '#f0f8f8' },
  kitchen: { field: '#e2e9cf', body: '#bfd396', dark: '#5b7339', light: '#f6f9ee' },
  surface: { field: '#cfe3d9', body: '#8fc0aa', dark: '#3a6f5a', light: '#eef7f2' },
  raw: { field: '#e0e5da', body: '#b6c0ad', dark: '#56634f', light: '#f4f6f1' },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// 3 × 2 mosaic on the right, gutterless.
const tiles = [
  ['kitchen', 'squeeze'], ['laundry', 'jug'], ['soaps', 'bar'],
  ['surface', 'spray'], ['soaps', 'pump'], ['raw', 'drum'],
];
const tw = 200, th = 315, x0 = 600;
const mosaic = tiles
  .map(([c, shape], i) => {
    const x = x0 + (i % 3) * tw;
    const y = Math.floor(i / 3) * th;
    const s = 0.8;
    return `<rect x="${x}" y="${y}" width="${tw}" height="${th}" fill="${chapters[c].field}"/>
      <g class="c-${c}" transform="translate(${x + tw / 2 - 120 * s} ${y + th / 2 - 116 * s}) scale(${s})">${shapes[shape]}</g>`;
  })
  .join('\n');

const tintCss = Object.entries(chapters)
  .map(([c, t]) => `.c-${c} .pv-b{fill:${t.body}} .c-${c} .pv-d{fill:${t.dark}} .c-${c} .pv-l{fill:${t.light}} .c-${c} .pv-g{fill:${t.dark};opacity:.16} .c-${c} .pv-hl{opacity:.55}`)
  .join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <style>${tintCss}</style>
  <rect width="1200" height="630" fill="#f5f8f2"/>
  ${mosaic}
  <g transform="translate(64 96) scale(2.2)">
    <path d="M12 2.5c6 3 7.4 12.2 0 19-7.4-6.8-6-16 0-19Z" fill="#1d5a42"/>
    <path d="M11.2 7h1.6v12h-1.6z" fill="#f5f8f2"/>
  </g>
  <text x="64" y="280" font-family="Newsreader, Georgia, 'Times New Roman', serif" font-size="84" letter-spacing="-2.5" fill="#12352a">GoodBiz</text>
  <text x="64" y="364" font-family="Newsreader, Georgia, 'Times New Roman', serif" font-size="84" letter-spacing="-2.5" fill="#1d5a42">Hygiene</text>
  <text font-family="'Albert Sans', 'Helvetica Neue', Arial, sans-serif" font-size="30" fill="#12352a">
    <tspan x="64" y="440">${esc(site.tagline.split(', ')[0])},</tspan>
    <tspan x="64" y="480">${esc(site.tagline.split(', ').slice(1).join(', '))}</tspan>
  </text>
  <text x="64" y="566" font-family="'Albert Sans', 'Helvetica Neue', Arial, sans-serif" font-size="22" fill="#3f5e50">A ${esc(site.parentName)} company, merchant exporter</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(out);
const meta = await sharp(out).metadata();
console.log(`wrote ${out} (${meta.width}×${meta.height})`);
