// Share cards (og:image, twitter:image), 1200 × 630, into public/og/:
//
//   og/<lang>/<page>.png   a text card per language for the home, products, private-label,
//                          export-process, about, faq, contact and blog pages: the page's headline
//                          in its own language and script, drawn by Chrome with the site's fonts
//                          (Geist, Newsreader italic, IBM Plex Sans Arabic; Chinese uses the
//                          system's PingFang SC / Noto Sans SC, as the site does).
//   og/products/<slug>.jpg the product's photo (or its studio render) on a 1200 × 630 field, with
//   og/categories/<slug>.jpg  no text, so one card serves every language. Blog posts use the card
//                          of the first product they are about.
//   og/horeca.jpg          the HoReCa page: a collage of four HoReCa product photos (guest soap,
//                          dish wash, hand wash, fabric softener) as tall rounded tiles on the forest
//                          field, no text, for every language.
//
// Run: npm run og:cards   (needs Google Chrome, like `npm run renders`; CHROME_PATH=… to use another)
//      npm run og:cards -- --only horeca   makes just the HoReCa collage (no Chrome needed)
// Re-run after changing a page headline in src/i18n/ui/*.ts or adding a product photo.
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { mkdirSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const pub = (p) => join(root, 'public', p);
const { LOCALES } = await import(pathToFileURL(join(root, 'src/i18n/locales.ts')).href);
const { getUi, fmt } = await import(pathToFileURL(join(root, 'src/i18n/ui/index.ts')).href);
const site = (await import(pathToFileURL(join(root, 'src/config/site.ts')).href)).default;

const FIELD = '#0f2c22';
const DEEP = '#0b211a';
const MINT = '#cdefd8';
const W = 1200;
const H = 630;

// ---- 1. Photo cards (language-neutral) ----------------------------------------------------------
const photoCard = async (src, out, { cutout = false } = {}) => {
  const img = sharp(src);
  if (cutout) {
    // A transparent studio render: contain it on the forest field with a soft light behind.
    const fg = await img.resize({ width: 560, height: 560, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    const glow = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="g" cx="50%" cy="55%" r="45%"><stop offset="0" stop-color="#2f6b51"/><stop offset="1" stop-color="${DEEP}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`,
    );
    await sharp(glow).composite([{ input: fg, top: Math.round((H - 560) / 2), left: Math.round((W - 560) / 2) }]).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
    return;
  }
  // A photo: the whole photo, centred at full height, over a blurred, darkened fill of itself.
  const meta = await img.metadata();
  const h = H;
  const w = Math.min(W, Math.round((meta.width / meta.height) * h));
  const fg = await sharp(src).resize({ width: w, height: h, fit: 'cover' }).toBuffer();
  const bg = await sharp(src).resize({ width: W, height: H, fit: 'cover' }).blur(28).modulate({ brightness: 0.7 }).toBuffer();
  await sharp(bg).composite([{ input: fg, left: Math.round((W - w) / 2), top: 0 }]).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
};

// ---- 0. The HoReCa collage (language-neutral) -----------------------------------------------------
/** The four photos and where each product sits across its photo (0 = left edge, 1 = right edge). */
const HORECA_PHOTOS = [
  ['hotel-guest-soap', 0.36],
  ['dish-wash-liquid', 0.5],
  ['liquid-hand-wash', 0.7],
  ['fabric-softener', 0.5],
];
const horecaCard = async (out) => {
  const pad = 32;
  const gap = 16;
  const tw = Math.floor((W - 2 * pad - 3 * gap) / HORECA_PHOTOS.length);
  const th = H - 2 * pad;
  const r = 28;
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tw}" height="${th}"><rect width="${tw}" height="${th}" rx="${r}" ry="${r}"/></svg>`);
  const tiles = await Promise.all(
    HORECA_PHOTOS.map(async ([slug, fx]) => {
      const src = pub(`images/products/${slug}.webp`);
      const m = await sharp(src).metadata();
      const w = Math.round((m.width / m.height) * th);
      const left = Math.max(0, Math.min(w - tw, Math.round(fx * w - tw / 2)));
      const full = await sharp(src).resize({ height: th }).toBuffer();
      return sharp(full)
        .extract({ left, top: 0, width: tw, height: th })
        .composite([{ input: mask, blend: 'dest-in' }])
        .png()
        .toBuffer();
    }),
  );
  const field = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="g" cx="80%" cy="0%" r="110%"><stop offset="0" stop-color="#24563f"/><stop offset=".5" stop-color="${FIELD}"/><stop offset="1" stop-color="${DEEP}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`,
  );
  const left0 = Math.round((W - (tw * HORECA_PHOTOS.length + gap * (HORECA_PHOTOS.length - 1))) / 2);
  await sharp(field)
    .composite(tiles.map((input, i) => ({ input, left: left0 + i * (tw + gap), top: pad })))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
};
mkdirSync(pub('og'), { recursive: true });
await horecaCard(pub('og/horeca.jpg'));
console.log('horeca collage: og/horeca.jpg');
if (process.argv.includes('--only') && process.argv[process.argv.indexOf('--only') + 1] === 'horeca') process.exit(0);

mkdirSync(pub('og/products'), { recursive: true });
mkdirSync(pub('og/categories'), { recursive: true });
const shapeOf = (await import(pathToFileURL(join(root, 'src/lib/pack-shapes.ts')).href)).shapeFor;
const products = readdirSync(join(root, 'src/content/products')).filter((f) => f.endsWith('.md'));
for (const f of products) {
  const slug = f.replace(/\.md$/, '');
  const category = readFileSync(join(root, 'src/content/products', f), 'utf8').match(/^category:\s*(\S+)/m)[1];
  const photo = pub(`images/products/${slug}.webp`);
  if (existsSync(photo)) await photoCard(photo, pub(`og/products/${slug}.jpg`));
  else {
    const shape = shapeOf(slug, category);
    const variant = pub(`images/renders/${shape}--${category}.webp`);
    const render = existsSync(variant) ? variant : pub(`images/renders/${shape}.webp`);
    if (existsSync(render)) await photoCard(render, pub(`og/products/${slug}.jpg`), { cutout: true });
  }
}
const categories = readdirSync(join(root, 'src/content/categories')).filter((f) => f.endsWith('.md'));
for (const f of categories) {
  const slug = f.replace(/\.md$/, '');
  const photo = pub(`images/categories/${slug}.webp`);
  if (existsSync(photo)) await photoCard(photo, pub(`og/categories/${slug}.jpg`));
  else await photoCard(pub(`images/renders/category-${slug}.webp`), pub(`og/categories/${slug}.jpg`), { cutout: true });
}
console.log(`photo cards: ${products.length} products, ${categories.length} categories`);

// ---- 2. Text cards, one per page and language --------------------------------------------------
const fontUrl = (f) => pathToFileURL(pub(`fonts/${f}`)).href;
const css = `
@font-face { font-family: Geist; font-weight: 100 900; src: url('${fontUrl('geist-latin-wght-normal.woff2')}'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: Geist; font-weight: 100 900; src: url('${fontUrl('geist-latin-ext-wght-normal.woff2')}'); unicode-range: U+0100-024F, U+1E00-1EFF; }
@font-face { font-family: Geist; font-weight: 100 900; src: url('${fontUrl('geist-cyrillic-wght-normal.woff2')}'); unicode-range: U+0400-04FF; }
@font-face { font-family: Geist; font-weight: 100 900; src: url('${fontUrl('geist-vietnamese-wght-normal.woff2')}'); unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB; }
@font-face { font-family: Newsreader; font-style: italic; font-weight: 200 800; src: url('${fontUrl('newsreader-latin-wght-italic.woff2')}'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: Newsreader; font-style: italic; font-weight: 200 800; src: url('${fontUrl('newsreader-latin-ext-wght-italic.woff2')}'); unicode-range: U+0100-024F, U+1E00-1EFF; }
@font-face { font-family: Newsreader; font-style: italic; font-weight: 200 800; src: url('${fontUrl('newsreader-vietnamese-wght-italic.woff2')}'); unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB; }
@font-face { font-family: 'IBM Plex Sans Arabic'; font-weight: 400; src: url('${fontUrl('ibm-plex-sans-arabic-arabic-400-normal.woff2')}'); }
@font-face { font-family: 'IBM Plex Sans Arabic'; font-weight: 600; src: url('${fontUrl('ibm-plex-sans-arabic-arabic-600-normal.woff2')}'); }
* { margin: 0; box-sizing: border-box; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
body { background: radial-gradient(120% 140% at 85% 0%, #24563f 0%, ${FIELD} 45%, ${DEEP} 100%); color: #f5f8f2;
  font-family: Geist, 'IBM Plex Sans Arabic', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  padding: 64px 72px; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
.brand { display: flex; align-items: center; gap: 16px; font-size: 30px; font-weight: 600; letter-spacing: -0.01em; }
.brand svg { width: 52px; height: 52px; }
h1 { font-size: 76px; line-height: 1.04; font-weight: 600; letter-spacing: -0.035em; max-width: 960px; }
h1 em { display: block; font-family: Newsreader, Geist, serif; font-style: italic; font-weight: 400; color: ${MINT}; letter-spacing: -0.02em; }
.foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; font-size: 26px; color: #b9d8c6; }
.foot b { font-weight: 500; color: #f5f8f2; white-space: nowrap; }
.leaf { position: absolute; right: -60px; bottom: -90px; width: 460px; height: 460px; opacity: .09; }
html[lang=ar] body, html[lang=ar] h1 em { font-family: 'IBM Plex Sans Arabic', Geist, sans-serif; }
html[lang=ar] h1 { letter-spacing: 0; line-height: 1.3; font-size: 70px; }
html[lang=ar] .leaf { right: auto; left: -60px; }
html[lang=zh-Hans] h1, html[lang=zh-Hans] h1 em { font-family: 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', sans-serif; font-style: normal; letter-spacing: 0; }
html[lang=zh-Hans] h1 em { font-weight: 400; }
html.long h1 { font-size: 62px; }
/* Cyrillic: the subset of Geist renders with uneven spacing in headless Chrome, so Russian uses a system sans. */
html[lang=ru] body, html[lang=ru] h1 { font-family: 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; letter-spacing: -0.01em; }
`;
const leaf = (fill) =>
  `<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="${fill}" d="M16 5c7.5 4 9.2 15.3 0 23.5C6.8 20.3 8.5 9 16 5Z"/><path fill="${FIELD}" d="M15 11h2v14h-2z"/></svg>`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const pages = (ui) => ({
  home: [ui.home.h1a, ui.home.h1b],
  products: [ui.productsIndex.h1a, ui.productsIndex.h1b],
  'private-label': [ui.privateLabel.hero.h1a, ui.privateLabel.hero.h1b],
  'export-process': [ui.exportProcess.route.h1a, ui.exportProcess.route.h1b],
  about: [ui.about.l1, fmt(ui.about.l2, { parent: site.parentName })],
  faq: [ui.faqPage.l1, ui.faqPage.l2],
  contact: [ui.contact.l1, ui.contact.l2],
  blog: [ui.blogIndex.l1, ui.blogIndex.l2],
});

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
let n = 0;
for (const l of LOCALES) {
  const ui = getUi(l.code);
  mkdirSync(pub(`og/${l.code}`), { recursive: true });
  for (const [key, [a, b]] of Object.entries(pages(ui))) {
    const long = `${a} ${b}`.length > 46 ? 'long' : '';
    const html = `<!doctype html><html lang="${l.hreflang}" dir="${l.dir}" class="${long}"><head><meta charset="utf-8"><style>${css}</style></head><body>
      <div class="leaf">${leaf(MINT)}</div>
      <div class="brand">${leaf(MINT)}<span>GoodBiz Hygiene</span></div>
      <h1>${esc(a)} <em>${esc(b)}</em></h1>
      <div class="foot"><span>${esc(ui.meta.tagline)}</span><b dir="ltr">HSN 3401 · 3402</b></div>
    </body></html>`;
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const shot = await page.screenshot({ type: 'png' });
    await sharp(shot).png({ palette: true, quality: 90, compressionLevel: 9, effort: 10 }).toFile(pub(`og/${l.code}/${key}.png`));
    n++;
  }
}
await browser.close();
console.log(`text cards: ${n} (public/og/<lang>/<page>.png)`);
