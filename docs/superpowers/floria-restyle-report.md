# Floria restyle: global chrome, imagery pipeline and home (report)

Date: 2026-10-16 · Branch `feat/floria-restyle` · Direction: `docs/superpowers/specs/2026-10-16-floria-restyle-direction.md`

Screens: `docs/superpowers/screens/floria/` (home at 1440 and 390, first screen and full page).

## What was built

**Tokens and fonts** (`src/styles/tokens.css`, `fonts.css`)
- Geist (variable, self-hosted from `@fontsource-variable/geist` 5.3.0, OFL in `public/fonts/OFL-Geist.txt`) sets everything. Newsreader is now loaded **italic only** (`newsreader-latin-wght-italic.woff2`) for the italic second lines and the footer tagline. Albert Sans removed. Both fonts preloaded; a metric-matched Arial fallback keeps CLS at 0.
- Forest dark fields (`--forest-950/900/800`), on-dark text (`--on-dark`, `--on-dark-soft`, `--on-dark-2`), mint accent, rounded card radii (24–40px), the reference's type scale (h1 80px, h2 56px, statement 72px, body 16–18px), and Emil Kowalski's easing/duration tokens.

**Chrome**
- `Header.astro`: transparent at the top (light text on the home's dark hero), a centred translucent pill once scrolled past 40px. Only the pill layer's opacity/transform animate (300ms ease-out). No JS → it stays a pill. Four links (Products, Private Label, Export Process, Buyer Guides) + "Request a Quote" pill. Phones: a no-JS `<details>` menu (adds About and FAQ; closes on Escape or link tap).
- `Footer.astro`: forest-950 field, ghost "GOODBIZ" wordmark (SVG, decorative), "GoodBiz Hygiene." + Newsreader italic "Clean, from India", lede, export terms, Products / Company / Contact columns with mint dot bullets, found-picture credits, © line.
- Buttons: full pills (forest on light, off-white on dark), `:active` scale(0.97) 160ms, specific transition properties. `CtaBand` (inner pages) is now a rounded forest card.
- `ProductCard`: tall rounded card, picture → name left / HSN right; "Add to enquiry" chip (→ `/contact/?product=slug`) slides up on hover for fine pointers, always shown on touch. `ProductVisual`: product photo if present, else the studio render (alt "Illustration of … in a typical export pack"), else the SVG drawing.
- `BaseLayout`: `dark` prop (home runs under the header; theme-color forest) and `preloadImage` (the hero still, `fetchpriority=high`).

**Imagery pipeline**
- Pack builders moved to `src/scripts/three/packs.ts` and extended from 6 to all **14** shapes (angled, clear bar, hotel duo, laundry bar, tub, pouch, jerrycan, sack added); shared dark-field studio lighting in `src/scripts/three/studio.ts` (soft warm key spot, mint rim lights, dim room environment, backdrop glow).
- `npm run renders` → `scripts/render-packs.mjs` serves `scripts/render/index.html` with Vite, drives it with Playwright (`playwright-core` + installed Chrome) and writes to `public/images/renders/`: each shape at 1200×1500 and 600×750, five tint variants where a product sits in another category (`<shape>--<category>.webp`), five category group renders for the bento, and `range-hero.webp` (1600×1000). All files 6–25 KB (540 KB total).
- `src/lib/product-image.ts` → `productPicture(slug, shape, category)` (photo → category-tinted render → shape render → undefined), unit-tested.

**Home** (`src/pages/index.astro`, `src/styles/home.css`)
1. Hero, 100dvh forest: the range still (LCP) right of the copy, bleeding off-edge; the live Three.js scene (same scene at t=0, same `object-fit: cover` crop via `camera.setViewOffset`) fades in over it. Pill eyebrow, one h1 with two spans "Soap & Home Care" / italic "Exported from India.", one-sentence paragraph, "View Products" pill + "Request a Quote →". Bottom fade into the ground. Phone: picture on top (58svh), copy below.
2. The Range: three staggered tall cards (Dish Wash Liquid, Fabric Softener, Floor Cleaner), "View all 27 products ↗".
3. How export orders work (dark): sticky heading with italic second line, the Kochi port photograph, three steps in 01/02/03 circles that fill mint as they reach mid-screen.
4. The Categories: bento (bath soaps large, raw materials tall, three small) with category renders, label + product count + HSN.
5. Straight answers (dark): the six home FAQs as dark cards signed "Buyer FAQ".
6. Statement: dark→light band, faint neem plate (1873), leaf icon, "Never a generic supplier.", honest sourcing paragraph.
7. Buyer guides: latest three posts as rows.
8. Quote card (the live thing): Köhler lemon plate under a forest scrim, "Request a quote.", inline pill input + "Start enquiry →" → `GET /contact/?message=…`. `parseEnquiryParams` (`src/lib/enquiry.ts`, unit-tested) reads `product` and `message`; the enquiry form prefills its message box. Verified end to end in a browser.

**Motion** (Emil Kowalski): h1 lines rise through masks 80ms apart on load, eyebrow/text/actions follow; each section's parts rise 24px + fade once, 70ms stagger (`--i`), 700ms custom ease-out, IntersectionObserver −10%, content visible without JS; card hover image scale 1.04/600ms and chip 8px/200ms only under `(hover: hover) and (pointer: fine)`; press scales 0.97–0.98; step circles fill mint; the port photo drifts with a scroll-view timeline; header pill 300ms. Reduced motion: fades ≤200ms, no travel, no 3D.

## Commits
`acd071a` fonts/tokens · `85dd66f` renders pipeline + cards · `8005a89` header/footer + credits · `24b2a0f` home sections + `?message=` · `8f78a53` motion, tint variants, gate fixes · `3e4c9d1` perf (3D on first interaction) · this report + screens.

## Deviations from the direction doc
- **Taste-skill draw step skipped** (direction fixed by the user's reference); `--keep`-style mapping of the brand palette and the Floria composition used instead.
- **Straight answers shows six cards, not five**: the home FAQPage JSON-LD lists six questions, and structured data must match visible content.
- **The live 3D scene starts on the visitor's first interaction** (pointer, touch, scroll, key) after load, not on idle. Starting on idle cost ~2.9s of TBT in Lighthouse's software-rendered WebGL (performance 70); now TBT is 0 and performance 99. The still is the hero until then. Spec §14 says "dynamic import on idle/visible"; it is still lazy and gated as before.
- Hero h1 is 80px, not 96px: at 96px "Soap & Home Care" would run into the range.
- Bottle materials dropped the transmission pass (cost) — they read as opaque glossy plastic.
- Header nav has four links; About and FAQ moved to the phone menu and footer.
- Card name/price row shows HSN on the right (as the direction maps it); varieties line kept on inner pages only.
- No archival soap-making engraving was used: the searches returned nothing relevant (only unrelated "making" engravings).

## Taste critique (references/critique.md)
| Round | Design | Usability | Creativity | Content | Overall | Top fixes made |
|---|---|---|---|---|---|---|
| 1 | 7.0 | 7.5 | 7.0 | 7.0 | 7.15 | hero text over the range; two identical jug renders in The Range; tile labels over light packs |
| 2 | 7.5 | 8.0 | 7.0 | 7.5 | 7.55 | tint variants; groups lifted + stronger scrim; dark-to-light gap tightened; type scale 12 → 8 sizes |
| 3 | 7.5 | 8.5 | 7.0 | 7.5 | 7.70 | 3D gated on interaction (perf), menu and 360px checks |

House-rule caps would hold the overall at 6.5 (eyebrow, 01/02/03, gradients, floating pill nav are visible) — these are exactly the Floria devices the user asked for, so per the precedence rule they are kept. Creativity stays at 7: a faithful execution of the reference's composition, with the live quote card and the live range as the subject-specific moves. Still short: the 3D packs read as clean illustrations, not photography; the answers wall is a row of similar cards (inspector `card-rows`).

## Inspector and lint
- `lint.mjs src/pages/index.astro src/components src/styles src/layouts`: **0 FAIL, 0 WARN** (allowed devices carry `taste-skill-ignore` comments naming the direction).
- `inspect.mjs http://127.0.0.1:4321/ --allow eyebrow,numbering,gradient,glass,pill-nav,mixed-font-headline,shadow`: **0 FAIL, 2 WARN**.
  - `card-rows` (answers wall and range cards): the reference's masonry and card row, kept by the direction.
  - `no-footage`: no honest clip; the moving picture is the live range and the drifting port photo.
  - Measured: h1 2 lines at 1440/768/390 (80/54/40px), Geist 99%, 8 sizes, body 16px contrast 8.4:1, 12 images, hero media 92%.
- No horizontal scroll at 360 and 390; phone menu verified open.

## Lighthouse (home, `astro preview`, Lighthouse 12)
| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Mobile | **99** | **100** | 100 | 69 |
| Desktop | 100 | 100 | 100 | 69 |

Mobile: FCP 0.9s, LCP 2.0s, TBT 0ms, CLS 0. SEO 69 is only `is-crawlable` (the intended `noindex` while `launchReady: false`). Three.js chunk (564 KB) stays a lazy dynamic import.

## Tests
`npm run build && npm test && npm run test:build && npm run check:placeholders`: build OK (49 pages), unit 182 passed (+8 new: `productPicture`, `parseEnquiryParams`), build 58 passed, placeholders warn only (launchReady false). `astro check`: 0 errors. No assertion was changed; `product-image.test.ts` gained cases for the new helper.

## Found pictures (credited in the footer on every page; data in `src/data/found-pictures.ts`)
- `public/images/found/kochi-port-night.webp` (+ `-600`): "International Container Transshipment Terminal, Kochi" by BgbwikiV4, CC BY 4.0, via Wikimedia Commons — https://commons.wikimedia.org/wiki/File:International_Container_Transshipment_Terminal,_Kochi.jpg (cropped). Home, export process section.
- `public/images/found/neem-plate.webp`: "Melia azadirachta Govindoo" (1873) by Govindoo, public domain, via Wikimedia Commons — https://commons.wikimedia.org/wiki/File:Melia_azadirachta_Govindoo.jpg (cropped, greyscale). Home, statement band.
- `public/images/found/lemon-plate.webp`: "Citrus limonum (Köhler)" (1887) by Hermann Adolf Köhler, public domain, via Wikimedia Commons — https://commons.wikimedia.org/wiki/File:Citrus_limonum_(K%C3%B6hler).jpg (cropped). Home, quote card.
Originals and `credits.json` are in `.taste-skill/found/` (gitignored). None is presented as GoodBiz's own.

## Left for the inner pages
- Product page hero → dark forest band with the render/photo (currently the old light chapter band; the visual is already the 4:5 render). Photos are square; in the 4:5 card they crop to the centre.
- Category pages → dark band + bento-ish grid; products index grid is 4-up with the new cards and needs the staggered/tall treatment and section rhythm.
- Inner H1s use the new Geist display size and wrap to 4 lines on phones (e.g. /products/) — set a page-title size.
- Blog reading column in Geist; About / Export process / Private label / FAQ / Contact bands still use the old chapter-field components (`.field`, `.band`, `.terms`), now in Geist with the new tokens.
- `scripts/make-og.mjs` still names Newsreader/Albert Sans for the OG image text.
- `data-reveal` on inner pages works with the new stagger; they can switch to `--i`.
