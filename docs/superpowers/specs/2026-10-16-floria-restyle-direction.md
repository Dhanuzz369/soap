# GoodBiz Hygiene — Floria-style restyle (art direction)

Date: 2026-10-16. User request: "I need my site to look like https://floria-landing-page.vercel.app but according to my theme and products. Use the emilkowal.ski skill and the taste skill."

## Precedence
User request > taste-skill house rules > defaults. Floria devices the user explicitly wants are ALLOWED even where taste-skill bans them:
floating pill nav (glass on scroll), pill eyebrow in hero, italic second headline line, 01/02/03 step numbers in circles, the hero's bottom fade into the light ground, rounded (24–32px) image cards.
Everything else follows taste-skill craft (imagery floor, fullness, two typefaces max, contrast, no icon cards, no emoji, no fake dashboards, inspector gate with `--allow` for the rules above) and Emil Kowalski's motion rules.
Honesty rules from the main spec still bind: no testimonials, clients, ratings, stats, certifications; no manufacturing claims. Floria's testimonial section is replaced by buyer Q&A cards.

## Reference anatomy (measured at 1440px)
- Font: Geist (sans) everywhere. h1 96px/0.9, weight 700, tracking -0.05em; h2 48px/1, 700, -0.025em; h3 20px/28px 500; body 16–18px, lh 1.6. Buttons 14px/500, full pill.
- Colours: ground #FAFAF9, ink #1C1917, muted #78716C, dark sections #09090B → black.
- Header: fixed; transparent over hero; on scroll becomes a centred floating pill (max ~1100px, translucent, blur, soft border) with wordmark left, 4 links centre, dark "Order Custom" pill right.
- Sections in order:
  1. Hero 100dvh, full-bleed dark photo (bouquet right), pill eyebrow "STUDIO & ARCHIVE", H1 "Botanic" / italic lighter "Architecture.", 3-line paragraph, white pill primary + plain text secondary; bottom fades to light.
  2. Light: "Curated Assemblages." H2 + short paragraph left, "VIEW COMPLETE ARCHIVE ↗" right; 3 tall rounded image cards (approx 4:5) with staggered vertical offsets, name left + price right under each; hover "Quick Add" chip.
  3. Dark: sticky left "The Architecture / of Nature." + paragraph; right column 3 steps, each a small circle with 01/02/03, H3, paragraph; steps offset in a gentle diagonal.
  4. Light: "The Archives." + subline; bento of 5 rounded image tiles (one large spanning 2 cols, one tall, 3 small) with label overlaid bottom-left over a dark scrim.
  5. Dark: centred italic serif heading "Clarity."; masonry of 5 dark rounded cards, slightly rotated/offset.
  6. Statement band: dark→light, faint photo behind, small leaf icon, huge centred heading "Never a generic arrangement.", centred paragraph.
  7. CTA: rounded 32px card with full photo background and scrim, centred "Join the Studio Archive.", text, inline pill input + white pill button.
  8. Footer dark: giant ghost wordmark across the background at ~5% opacity, big wordmark "Floria." + italic serif tagline, paragraph, 3 link columns with small dot bullets, bottom bar © + socials.

## Our mapping ("according to my theme and products")
Palette (keep brand greens; dark = forest, not black):
- --forest-950 #0B211A (hero/dark fields), --forest-900 #0F2A22, --forest-800 #163A2F (dark cards), ink on light #12352A, ground #F5F8F2, sage/mint tints from existing tokens.css for light surfaces, text on dark #EEF4EF / muted #A9C2B5. Primary on dark: off-white pill with forest text; primary on light: forest pill with off-white text. Accent mint #BFE3CF used sparingly.
Type: Geist (self-host, OFL) for everything + Newsreader italic (already self-hosted) ONLY for the italic second line of hero/section headings and the footer tagline. Drop Albert Sans.

Home sections:
1. Hero (dark forest, 100dvh): the existing Three.js range re-lit as moody studio product photography on the dark field, occupying the right ~60% and bleeding off-edge (Floria's bouquet). Static fallback = a pre-rendered still of the same scene (webp), not SVG. Eyebrow pill "Soaps · Detergents · Home care". H1 line 1 "Soap & Home Care" / line 2 italic Newsreader "Exported from India." Paragraph: one sentence (merchant exporter, vetted Indian manufacturers, private label, mixed containers). Off-white pill "View Products" + text link "Request a Quote →". Bottom fade into ground.
2. "The Range." light: 3 tall staggered cards — Dish Wash Liquid, Fabric Softener, Floor Cleaner — studio renders; under each: name left, "HSN 3402 50" right; hover chip "Add to enquiry" → /contact/?product=slug. Right link "View all 27 products ↗".
3. Dark process "How export / orders work." (italic 2nd line): 01 Specification & samples, 02 Sourcing & private label, 03 Documents & shipping — real copy from export-process page; a found photograph of an Indian container port behind/beside the sticky heading if a good licensed one exists.
4. "The Categories." light bento: the 5 categories as image tiles (bath soaps large, raw materials tall, laundry/kitchen/surface small) with renders composed per category; label + product count.
5. Dark "Straight answers." (italic): masonry of 5 dark cards — buyer questions set like quotes with short answers (from src/lib/faqs.ts), signed "Buyer FAQ" — no names, no stars.
6. Statement band: faint found botanical plate (neem / lemon / eucalyptus — subject's herbal world) behind; leaf icon; "Never a generic supplier." ; paragraph on sourcing honesty.
7. Buyer guides (light, compact): latest 3 posts as text rows (keeps internal links).
8. CTA rounded card with found botanical/port picture + forest scrim: "Request a quote." ; inline pill input "What do you need? e.g. 1×20ft dish wash, lemon, 500 ml" + off-white pill "Start enquiry →" → GET /contact/?message=... (contact page prefills message). This is the live thing.
9. Footer forest-950: giant ghost "GOODBIZ" wordmark, "GoodBiz Hygiene." + italic tagline "Clean, from India", paragraph, columns Products / Company / Contact (placeholders from site.ts), credits line for found pictures, © line.

Inner pages: same header/footer; product page hero becomes a dark forest band with the product's studio render (or real photo when present) and the H1 in Geist; product cards everywhere use the tall rounded card with render; category pages lead with a dark band + bento-ish grid; blog keeps a light reading column in Geist.

## Imagery
1. Studio renders (honest pack-format illustrations, not claimed product photos): a Playwright script renders each pack shape from the Three.js builders on the forest backdrop with consistent key/rim light → public/images/renders/<shape>.webp (4:5, 1200×1500 and 600×750). Product cards use the product's photo if present, else its shape render. Alt text says "Illustration of …".
2. Found pictures via taste-skill assets.mjs (commercial-use licences only, credited in footer, listed in report): Indian container port / container ship; botanical plates of neem, lemon, eucalyptus, lavender; optionally an archival soap-making engraving. Never presented as GoodBiz's own.
Inspector floor of ≥4 real pictures on home: renders (raster) + found pictures.

## Motion (Emil Kowalski)
- Tokens: --ease-out cubic-bezier(0.23,1,0.32,1); --ease-in-out cubic-bezier(0.77,0,0.175,1).
- Header: transparent → floating pill on scroll past 40px: transform/opacity + background, 300ms ease-out; never animate width/height.
- Entrances: per section heading → text → media, stagger 70ms, translateY(24px)+opacity, 700ms ease-out, once, IntersectionObserver margin -10%; content visible without JS.
- Hero: H1 lines rise with clip reveal (overflow hidden line masks), 80ms stagger, on load; 3D scene fades in over its still.
- Cards: hover (only @media (hover:hover) and (pointer:fine)) image scale 1.04 over 600ms ease-out, chip slides up 8px + fades 200ms; :active scale(0.98).
- Buttons: :active scale(0.97) 160ms ease-out; specific transition properties, never `all`.
- Process steps: circles fill mint as each step enters.
- prefers-reduced-motion: keep opacity fades ≤200ms, drop all travel and the 3D motion.
