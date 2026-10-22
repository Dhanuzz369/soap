# GoodBiz Hygiene — Export Website Design

Date: 2026-10-16
Status: Approved (2026-10-16), user chose defaults for open items

## 1. Intent and why

GoodBiz Global already runs **GoodBiz Agro** for agro exports. **GoodBiz Hygiene** is the new sister brand for soaps and home-cleaning products: everything under **HSN 3401** (soaps) and **HSN 3402** (detergents, washing and cleaning preparations), plus closely related items such as herbal phenol.

GoodBiz is a **merchant exporter**. It sources from manufacturers and ships to overseas buyers. It does not own a factory, so the site must never claim in-house manufacturing.

The website exists to be **found by overseas buyers from any country** (importers, distributors, wholesalers, supermarket chains and private-label brands) when they search Google, or ask ChatGPT, Perplexity or Google's AI answers, for suppliers of these products. Then it must convince them to send an enquiry.

Success means:
- Every product has its own page that ranks for "<product> exporter / supplier / manufacturer India" and similar searches.
- AI answer engines can read, quote and recommend GoodBiz Hygiene.
- A buyer on any device, on a slow connection, in any country, sees the range clearly and can enquire in under a minute.

## 2. Goals

1. **Full product catalogue** covering HSN 3401 and 3402, with one page per product and drafted typical export varieties (see section 6).
2. **Home page** with a hero showing the whole range at a glance, then categories.
3. **SEO / AEO / GEO-rich content** on every page (see section 7).
4. **Blog** with an initial set of ranking-focused articles and an easy way to add more.
5. **Light, soothing green visual identity**: clean, calm, hygienic and premium, built with the taste skill's art direction.
6. **Very fast** with excellent Core Web Vitals; works on mobile first.

## 3. Non-goals

- No e-commerce, cart, prices or payments. This is a B2B enquiry site.
- No login, buyer portal or CMS backend.
- No multi-language versions in v1. English only, written in plain international English. (Structure should allow adding languages later.)
- Real contact details are not final; placeholders are used.

## 4. Anti-goals (failure even if it "works")

- Looks like a generic template or "AI-made" site.
- Thin, duplicated product pages (same paragraph with the product name swapped). Each page needs genuinely specific content.
- Claims GoodBiz manufactures, or invents certifications, awards, client names, years in business or statistics.
- Heavy images or scripts that make it slow for buyers on weak connections.
- Keyword-stuffed text that reads badly to humans.

## 5. Constraints and decisions made

| Area | Decision | Whose call |
|---|---|---|
| Brand name | **GoodBiz Hygiene**, a GoodBiz Global company | User |
| Colours | Light, soothing greens (sage, mint, eucalyptus) on off-white; one deeper green for text and buttons | User (shade picks are builder's) |
| Varieties | Draft typical export varieties per product; user corrects later | User |
| Contact details | Placeholders (email, phone, WhatsApp, address) in one config file | User |
| Logo and photos | User has them but hasn't shared yet. Build with tasteful placeholders that are easy to swap (one image folder, consistent names) | Claude's call |
| Framework | **Astro** static site: plain fast HTML, Markdown content collections for products and blog, zero client JS by default | Claude's call |
| Styling | Plain CSS with design tokens (CSS custom properties). No Tailwind | Claude's call |
| Hosting | Static output deployable to Netlify, Vercel or Cloudflare Pages; no hosting chosen yet | Claude's call |
| Enquiry form | Static form that opens a pre-filled email/WhatsApp message (no backend). Easy to switch later to Netlify Forms or Formspree | Claude's call |
| Domain | Unknown. Use `https://www.goodbizhygiene.com` as placeholder `site` URL in one config value | Claude's call |

## 6. Site map and product catalogue

### Pages
- `/` Home
- `/products/` all products, grouped by category
- `/categories/<category>/` category pages (5 categories below; separate path so slugs never collide with products)
- `/products/<product-slug>/` one page per product (27)
- `/private-label/` private-label and OEM sourcing
- `/export-process/` how ordering, documentation and shipping work (incoterms, payment terms, documents)
- `/about/`
- `/contact/` with the enquiry form
- `/blog/` index plus `/blog/<slug>/` posts
- `/faq/` global FAQ
- Plus `sitemap.xml`, `robots.txt`, `llms.txt`, and a 404 page

### Categories and products

**A. Bath and Personal Soaps (HSN 3401)**
1. Toilet / Bath Soap: 3401 11
2. Herbal & Ayurvedic Soap: 3401 11
3. Glycerin / Transparent Soap: 3401 11
4. Antibacterial / Medicated Soap: 3401 11
5. Hotel & Guest Soap (mini bars): 3401 11
6. Liquid Hand Wash: 3401 30
7. Body Wash / Shower Gel: 3401 30

**B. Laundry Care (HSN 3401 / 3402)**
8. Laundry Soap / Detergent Bar: 3401 19
9. Detergent Powder: 3402 50
10. Liquid Detergent: 3402 50
11. Fabric Softener / Conditioner: 3402 50 (often also classified 3809 91; note on page)
12. ~~Fabric Whitener / Stain Remover: 3402 50~~ (removed 2026-10-22 at the user's request)

**C. Kitchen Care (HSN 3402)**
13. Dish Wash Liquid / Gel: 3402 50
14. Dish Wash Bar: 3401 19
15. ~~Dish Wash Powder: 3402 50~~ (removed 2026-10-22 at the user's request)
16. ~~Kitchen Degreaser: 3402 50~~ (removed 2026-10-22 at the user's request)

**D. Surface and Home Cleaners (HSN 3402)**
17. Floor Cleaner: 3402 50
18. Herbal Phenol / Phenyl: 3402 50 (often classified 3808 94 as disinfectant; note on page)
19. Glass Cleaner: 3402 50
20. Toilet Bowl Cleaner: 3402 50
21. Bathroom & Tile Cleaner: 3402 50
22. Multi-Surface Cleaner: 3402 50
23. ~~Car Wash Shampoo: 3402 50~~ (removed 2026-10-22 at the user's request)

**E. Industrial & Raw Materials (HSN 3401 / 3402)**
24. Soap Noodles: 3401 20
25. LABSA (Linear Alkyl Benzene Sulphonic Acid): 3402 31
26. SLES (Sodium Lauryl Ether Sulphate): 3402 39
27. Bulk / Institutional Cleaning Chemicals: 3402 90

HSN codes are shown at 6-digit level (internationally valid HS). Each product page also notes that the exact 8-digit Indian ITC-HS code is confirmed per order. Where classification is commonly debated (fabric softener, phenol), say so honestly.

### Per-product variety data (drafted, to be corrected by user)
Each product carries structured data, stored in its Markdown front-matter:
- **Variants / fragrances or types** (e.g. dish wash: lemon, lime, orange, green apple, unscented)
- **Pack sizes** (e.g. 250 ml, 500 ml, 1 L, 5 L can, 20/50 L carboy, 200 L drum)
- **Packaging** (PET bottle with flip cap, pouch, can, carton counts)
- **Key specs** (form, pH range, active matter %, colour, shelf life), all labelled "typical"
- **MOQ** (typical, e.g. "1 × 20 ft container; mixed loads possible")
- **Private label**: yes/no and what's customisable
- **Container loading**: approximate cartons per 20 ft / 40 ft (marked approximate)
- **Uses** and **target markets** (generic, e.g. "Middle East, Africa, SE Asia"); no invented customers
- **FAQs** (4–6 per product, specific to that product)

## 7. Search: SEO, AEO and GEO

**SEO (classic search)**
- Unique `<title>` and meta description per page, written for buyer intent (e.g. "Dish Wash Liquid Exporter from India | Bulk & Private Label | GoodBiz Hygiene").
- Clean URLs, one H1 per page, logical H2/H3, breadcrumbs.
- Canonical tags, Open Graph and Twitter cards, `hreflang="en"` (x-default).
- `sitemap.xml` (auto-generated) and `robots.txt`.
- Internal linking: product ↔ category ↔ related products ↔ related blog posts.
- Images: modern formats, explicit width and height, descriptive alt text, lazy-loaded below the fold.
- Target: Lighthouse 95+ on Performance, SEO, Accessibility and Best Practices.

**Structured data (JSON-LD)**
- `Organization` (with `parentOrganization` GoodBiz Global) and `WebSite` site-wide
- `Product` on every product page (name, description, category, brand, additionalProperty for HSN, variants, pack sizes). No price/offer or reviews, since none exist; do not fabricate.
- `FAQPage` wherever FAQs appear
- `BreadcrumbList` on all inner pages
- `Article` / `BlogPosting` on blog posts

**AEO (answer boxes, "People also ask")**
- Every product page opens with a 2–3 sentence direct definition answer ("What is X?") and has a Q&A FAQ block.
- Specs in real HTML tables, not images.
- Question-style H2s where natural ("What pack sizes are available for export?").

**GEO (AI search engines)**
- `llms.txt` at the site root summarising the company, categories, and links to every product page.
- Factual, self-contained paragraphs that an AI can quote without surrounding context; entity names stated in full (GoodBiz Hygiene, a GoodBiz Global company, merchant exporter from India).
- Consistent NAP (name/address/phone) once real details arrive.
- `robots.txt` allows major AI crawlers (GPTBot, PerplexityBot, Google-Extended, ClaudeBot).

## 8. Blog

Markdown posts in a content collection, so adding a post means adding one file. Initial set of **8 posts**, each 1,000–1,800 words, original, practical and buyer-focused:
1. HSN Code 3401 vs 3402: A Buyer's Guide to Classifying Soaps and Detergents
2. How to Import Dish Wash Liquid from India: Costs, MOQ, Documents and Shipping
3. Private Label Cleaning Products: A Step-by-Step Guide for Distributors
4. Fabric Softener Buying Guide for Importers: Types, Fragrances and Pack Sizes
5. Herbal Phenol vs Chemical Disinfectants: What Retail Buyers Should Know
6. Bath Soap Grades Explained: TFM, Grade 1 vs Grade 2, and Why It Matters
7. Detergent Powder vs Liquid Detergent: Which Sells Better in Your Market?
8. Export Documents for Cleaning Products: COA, MSDS, Certificate of Origin and More

Each post links to relevant product pages and ends with an enquiry call to action.

## 9. Visual direction

- **Feel:** calm, clean, fresh. A premium hygiene brand, not a chemical catalogue.
- **Palette:** off-white base (#F7FAF6-ish), sage and mint tints for surfaces, a deep eucalyptus/forest green for text and primary buttons, and at most one soft accent. Must pass WCAG AA contrast.
- **Type:** one refined display face for headings and a highly legible sans for body, loaded from Google Fonts with `font-display: swap`, or self-hosted.
- **Hero:** brand line plus a composed "range shelf" visual showing bottles, bars and cans together (placeholder illustration/photo slot until real photos arrive), with primary CTA "Request a Quote" and secondary "View Products".
- **Product cards:** image, name, HSN chip, 2–3 variety chips, "View details".
- **Motion:** subtle only (fade/rise on scroll, hover lift); respects `prefers-reduced-motion`.
- Final art direction is decided by the builder using the **taste skill**, inside these constraints.

## 10. Conversion

- Sticky header CTA "Request a Quote".
- Floating WhatsApp button (placeholder number).
- Enquiry form fields: name, company, country, email, WhatsApp/phone, products of interest (multi-select), quantity/container, private label yes/no, message.
- Every product page has an enquiry block pre-filled with that product.

## 11. Left to the builder

- Exact shades, fonts, spacing and component styling (via the taste skill).
- Placeholder imagery approach (illustration vs abstract vs stock-like CSS compositions), as long as it is lightweight and swappable.
- Exact drafted varieties, specs and FAQ wording per product, within "typical, realistic, labelled as typical".
- Folder structure and component breakdown inside Astro.

## 12. What the user supplies later

- Real email, phone, WhatsApp, address (one config file: `src/config/site.ts`).
- Logo (SVG preferred) and product photos (drop into `public/images/products/<slug>.webp`).
- Final domain.
- Corrections to drafted varieties, MOQs and specs.
- Any real certifications (only add once confirmed).

## 13. Calls made after builder review (Claude's call, user can override)

- **Launch safety:** a single `launchReady` flag in `src/config/site.ts`. While `false`, every page carries `noindex`, `robots.txt` disallows all, and `llms.txt`/sitemap are not linked from robots. A build-time check lists any remaining placeholders. Flip to `true` only once real contact details and corrected specs are in. This stops Google and AI engines from indexing fake phone numbers.
- **"Manufacturer" searches:** titles and H1s use "Exporter & Supplier from India". Body copy honestly says GoodBiz Hygiene sources from vetted Indian manufacturers, which still matches "manufacturer India" queries without claiming to manufacture. Organization schema type is `Organization` (not `Manufacturer`), described as a merchant exporter.
- **Product count:** all 27 listed products are built.
- **Export terms (default, user to confirm later):** publish only "FOB, CIF and CFR available; payment terms agreed per order (T/T or LC)"; "shipped from major Indian ports"; lead time "typically 3–5 weeks after order confirmation, depending on private-label requirements". All held in `src/config/site.ts` so they can be edited in one place.
- **Company facts (default):** About page states only what is known: GoodBiz Hygiene is the home-care and hygiene export division of GoodBiz Global, a merchant exporter from India, and a sister brand of GoodBiz Agro. `parentOrganization` and `sameAs` URLs, city, IEC and founding year are empty config fields that render nothing until filled.

## 14. Three.js hero (user decision, 2026-10-16)

The home page hero uses **Three.js** for a 3D "range shelf": stylised bottles (dish wash, softener, floor/glass cleaner), soap bars and a can, floating gently in soft green light, with a subtle pointer parallax.
- Built from Three.js primitives/lathe geometry and the palette's colours, so it needs no heavy model files. Real product photos/models can replace it later.
- Loaded only on the home page, after first paint (dynamic import on idle/visible), with a static SVG/CSS range composition rendered first as the LCP element and fallback.
- Skipped (static fallback stays) when `prefers-reduced-motion`, no WebGL, or `navigator.connection.saveData`.
- Pauses when off-screen or the tab is hidden; device pixel ratio capped at 2.
- This is the one deliberate exception to "zero client JS"; Home must still score ≥90 Lighthouse performance on mobile.
