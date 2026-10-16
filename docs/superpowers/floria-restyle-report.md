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

## Left for the inner pages (done in part 2, below)
- Product page hero → dark forest band with the render/photo (currently the old light chapter band; the visual is already the 4:5 render). Photos are square; in the 4:5 card they crop to the centre.
- Category pages → dark band + bento-ish grid; products index grid is 4-up with the new cards and needs the staggered/tall treatment and section rhythm.
- Inner H1s use the new Geist display size and wrap to 4 lines on phones (e.g. /products/) — set a page-title size.
- Blog reading column in Geist; About / Export process / Private label / FAQ / Contact bands still use the old chapter-field components (`.field`, `.band`, `.terms`), now in Geist with the new tokens.
- `scripts/make-og.mjs` still names Newsreader/Albert Sans for the OG image text.
- `data-reveal` on inner pages works with the new stagger; they can switch to `--i`.


---

# Part 2: inner pages (2026-10-16)

Every inner page now uses the Floria language. Screens are in `docs/superpowers/screens/floria/`, at 1440 and 390, first screen and full page, for `product-dish-wash-liquid-*`, `product-labsa-*`, `category-kitchen-care-*`, `post-import-dish-wash-liquid-*` and `contact-*`.

## Shared pieces
- **`PageHero.astro`**: a dark forest title band. The breadcrumb sits at the top, so `BaseLayout` skips its own crumbs when `dark`; the BreadcrumbList JSON-LD is unchanged. It holds one h1 with up to three spans:
  - `l1`, set in Geist;
  - an optional small `sub`;
  - the italic Newsreader `l2`.

  The h1 text is unchanged. For example, it still reads "LABSA (Linear Alkyl Benzene Sulphonic Acid) Exporter & Supplier from India". The band also takes a lead and actions. Media comes in three modes:
  - `bleed`: a studio render on the forest field, running off the right edge, with a mask fade into the field;
  - `card`: a product photo, used when one exists;
  - `plate`: the neem plate, inverted and faint.

  The band fades into the ground. On phones the picture goes on top, with the copy below.
- **`splitName` / `splitPostTitle`** (`src/lib/heading.ts`, tested) control how long titles are set:
  - a trailing parenthetical becomes the small descriptor;
  - long names step the type down;
  - post titles split at the colon.
- **`QuoteCard`**, **`AnswerWall`**, **`ProcessSteps`** and **`GuideRows`** are now components. The home page uses them too. `QuoteCard` takes an optional `product`, which is sent as `?product=` along with `?message=`.
- **`CardGrid`** + **`cardGrid()`** (tested) lays out the tall rounded staggered cards in 3 or 4 columns. When one gap would be left, a forest "Mix it in one container." note tile fills it. No range ends on a lonely card.
- **`Faq.astro`** renders Floria accordion rows (tone steps, forest +/- circle). An optional split layout puts the heading on the left.
- **CSS** lives in `src/styles/floria.css`, imported by BaseLayout:
  - spec table in tone steps (no hairlines), with stacked rows on phones;
  - pill chips and fact tiles;
  - a 68ch reading column, with prose tables that scroll inside the column;
  - the category strip.

  Form inputs are pills, with a 3:1 outline and a 2px focus ring. Option labels are 16px. Footer credits and terms are 16px.
- **Retired:** `CtaBand.astro` and `HsnChip.astro`, plus their CSS and the old chapter/band/page-hero CSS.

## Pages
- **Product (27):**
  - Band: render bleeding right (photo card when present); breadcrumb; h1 with the italic "Exporter & Supplier from India" line; answer lead; HSN pill with note; "Request a Quote" plus "Read the FAQ →".
  - Light ground: key-fact tiles; varieties and pack sizes as pill chips, plus packaging; the spec table in a split, with the h2 shortened to "What are the typical specifications?" and the product named in the note; body in a reading column; container loading tiles.
  - Then: Straight answers (dark cards, `#faq`); "Buyer guides for this product" rows; related tall cards; quote card that ticks the product.
- **Category (5):** dark band with the category group render, HSN pill and product count. Then the staggered cards (4 columns for 4 products; 3 columns plus a note tile for 5; 4 columns plus a note tile for 7), Straight answers and the quote card.
- **/products/:** "All products." / italic "Soaps, detergents & cleaners." The range still bleeds off the right edge. A category strip anchors five chapters of staggered cards. The HSN overview table is restyled (forest header, tone rows, stacked on phones).
- **Blog index:** "Buyer guides." band on a faint neem plate, then large journal rows with the newest post on forest.
- **Post:** tall dark band with the first related product's render and the title split at the colon. Then a Geist reading column, Floria FAQ rows, related cards and the quote card.
- **Contact:**
  - Band: the Kochi port photo bleeding right, with "Start the enquiry" and WhatsApp actions.
  - Pill-input form, with tone-tile contact details and a forest export-terms tile.
  - "Often quoted together" cards, whose chips tick products on the same form.
  - `?product=` and `?message=` prefill still work.
- **Private label:** band with the soaps group render; what can be customised (split plus tone rows); the dark numbered process (5 steps, port photo); split FAQ; quote card.
- **Export process:** band "The export process." / "From enquiry to bill of lading."; export terms as tiles; the dark numbered process (6 steps, port photo); documents as chips; split FAQ; quote card.
- **About, FAQ, 404:**
  - About: band on a faint neem plate; split prose; the category strip; quote card.
  - FAQ: band "Buyer questions." / "Straight answers."; three split accordion groups; quote card.
  - 404: spray render, noindex, no canonical.

## Gate
- `npm run build && npm test && npm run test:build && npm run check:placeholders`: 49 pages built. Unit tests: 191 passed (new: heading 6, cardGrid 3). Build tests: 58 passed. Placeholders: warning only (launchReady is false). `astro check`: 0 errors, 0 hints. No assertions were changed.
- Lint on `src/pages src/components src/styles src/layouts`: 0 FAIL, 0 WARN.
- Inspector, run with `--allow eyebrow,numbering,gradient,glass,pill-nav,mixed-font-headline,shadow`:
  | Page | FAIL | WARN | Warnings |
  |---|---|---|---|
  | `/products/dish-wash-liquid/` | 0 | 3 | card-rows, size-count, no-footage |
  | `/categories/kitchen-care/` | 0 | 2 | no-footage, size-count |
  | `/blog/import-dish-wash-liquid-from-india/` | 0 | 2 | size-count, no-footage |
  | `/contact/` | 0 | 3–4 | card-rows, size-count, no-footage |
  | home (re-checked after the refactor) | 0 | 2 | card-rows, no-footage |

  FAILs fixed along the way:
  - category `empty-screens`: a lonely fourth card → CardGrid;
  - post `focal-point`: the band picture was too small → a taller band;
  - contact `body-size`: 14px option labels and footer → 16px.
- Every built page at 360px: 0 horizontal scroll, 0 console errors (49 pages).
- **Lighthouse, mobile** (SEO 69 is only the intended `noindex`):
  | Page | Performance | Accessibility | Best practices | SEO |
  |---|---|---|---|---|
  | `/products/dish-wash-liquid/` | 100 | 100 | 100 | 69 |
  | `/products/labsa/` | 100 | 100 | 100 | 69 |

  On both pages: LCP 1.7s, TBT 0, CLS 0.

## Phone headlines
No inner h1 wraps to 4 lines now. At 360px most are 1–2 lines. Three cases still take 3 lines:
- the six long blog titles: before-colon text on 2 lines, plus the italic line;
- four product names: LABSA, SLES and Hotel & Guest Soap (name, small descriptor, italic line), and "Bulk & Institutional Cleaning Chemicals".

The inspected pages pass `headline-lines`.

## Deviations (part 2)
- The product spec h2 is now "What are the typical specifications?"; the product name moved into the note under it, so the heading fits two lines on phones. The h1 and title already carry the product name.
- Visible h1 wording on some title-only pages changed for the two-line band; titles and meta descriptions are unchanged:
  - `/products/`: "All products. Soaps, detergents & cleaners." (the title still reads "Soap, Detergent & Cleaning Products Exporter & Supplier from India");
  - FAQ: "Buyer questions. Straight answers.";
  - About: "GoodBiz Hygiene. A GoodBiz Global company.";
  - Export process: "The export process. From enquiry to bill of lading.";
  - 404: "This page is not on the shelf."
- Category FAQs and product FAQs use the dark Straight-answers cards. FAQ, private-label, export-process and post FAQs use the light accordion, because they follow dark sections or long reading.
- The contact page has no quote card: the form is the destination.

## Inner-page critique (one round)
Design 7.5 · Usability 8.5 · Creativity 7 · Content 7.5 → 7.7 overall. As on the home page, the visible Floria devices would cap it at 6.5 under the house rules.

What still falls short:
- The prose column on product pages is centred, while the other blocks are left-aligned, which adds a third left edge.
- The Straight-answers wall repeats identical cards (`card-rows`).
- Several categories share similar render compositions.
