# SEO, AEO and GEO launch audit

Date: 2026-10-24. Branch `feat/seo-launch`. Scope: every built page in 12 languages (44 page types × 12 = 528 pages), plus robots.txt, the sitemap, llms.txt files, icons and share images.

"Before" is the state at commit `f407f64` (the start of this branch). "After" is the state at the end of the branch, checked by the build tests named in the last column, which run on every `npm run test:build`.

## 1. Results

| # | Check | Before | After | What was fixed | Guarded by |
| --- | --- | --- | --- | --- | --- |
| 1 | Title length (≤ 60 characters before " \| GoodBiz Hygiene"; ≤ 32 for Chinese) | Fail: 14 of 44 English pages over (all 8 guides, About, FAQ, Contact, Export process, Private label, Products); 21–37 per translated language | Pass: 0 English; 6 of 484 translated pages over by 1–4 characters (long product or range names in French, Portuguese, Swahili and Turkish), within the test's allowance; Google may shorten these on narrow screens | New `metaTitle` for every product, a short `metaTitle` for guides (the heading keeps the full title), shorter page titles in all 12 dictionaries, a shorter "exporter from India" phrase in translated titles when the long one does not fit | `tests/build/seo-head.test.ts` |
| 2 | Meta description length (120–160; 72–100 for Chinese) | Fail: 8 English pages out of range (5 range pages 79–113, Home 166, FAQ 162, Private label 173); 2–8 per translated language | Pass: every page in every language | New `metaDescription` for ranges (the short `summary` stays the hero line); rewritten product and page descriptions with the product facts plus "private label · mixed containers · FOB/CIF" | `seo-head.test.ts`, `tests/unit/products.test.ts`, `tests/unit/i18n-content.test.ts` |
| 3 | Unique titles and descriptions per language | Pass | Pass | (kept) | `tests/build/site.test.ts` |
| 4 | One `<h1>` per page | Pass | Pass | (kept) | `site.test.ts`, `i18n.test.ts` |
| 5 | Primary keyword in H1, opening answer, one H2 and image alt (products) | Partial: H1 and answer yes; H2s generic ("What are the typical specifications?"); photo alt "Dish Wash Liquid / Gel from GoodBiz" | Pass | Spec H2 is now a question naming the product in all 12 languages; photo alt says what the product is and that GoodBiz Hygiene exports it from India | `seo-head.test.ts` (answer), manual review |
| 6 | Meta keywords | Missing | Pass: 3–12 per page, no duplicates, no unfilled templates; product pages include the product keyword and HSN code | Per-language templates in `ui.seo.keywords`, product `keyword` field, `buildKeywords()` | `seo-head.test.ts`, `tests/unit/seo.test.ts` |
| 7 | Canonical (absolute, self-referencing) | Pass | Pass | (kept) | `i18n.test.ts` |
| 8 | hreflang: 12 languages + x-default, reciprocal | Pass | Pass | (kept) | `i18n.test.ts` |
| 9 | Open Graph and Twitter tags | Partial: og:image was the same default card on every non-product page; no image size, type or alt; guides were `og:type website` | Pass | Share card per page and language (`public/og/<lang>/<page>.png`, Arabic and Chinese in their own fonts), photo cards for every product and range (`public/og/products`, `public/og/categories`), og:image width/height/type/alt, twitter:image:alt, `og:type article` with published/modified time and tags on guides | `seo-head.test.ts` |
| 10 | og:locale and alternates | Pass | Pass | (kept) | `i18n.test.ts` |
| 11 | Structured data validity | Partial: Organization without logo, knowsAbout or @id, and the parent/sister sites wrongly in `sameAs`; no WebPage; no ItemList; Product without sku; BlogPosting without image; FAQPage without url | Pass: every block on 528 pages parses, uses only schema.org properties for its type, has the required fields, and every @id reference resolves | See section 2 | `tests/build/structured-data.test.ts`, `npm run check:types` (schema-dts) |
| 12 | No fake ratings, reviews, offers or prices | Pass | Pass | (kept; now asserted on every block and every nested object) | `structured-data.test.ts` |
| 13 | Image alt text | Pass (all images had alt; decorative plates empty) | Pass | Product photo alt improved (row 5) | Lighthouse accessibility 100 |
| 14 | Internal links | Partial: Hotel & Guest Soap had no guide link although a guide links to it | Pass: every product links to its range, ≥ 2 related products and its guides; every range, product and guide is reachable from the products/blog pages; no orphan pages; no broken links | Product pages now list every guide that links to them | `seo-head.test.ts`, `site.test.ts` |
| 15 | Sitemap (launch) | Partial: hreflang alternates but no `<lastmod>`, no x-default | Pass: 528 URLs, each with 12 alternates + x-default and a `<lastmod>`; 404 excluded | `serialize` adds lastmod (last git commit touching the page's sources, `src/lib/lastmod.ts`) and x-default | Verified in launch mode (section 4) |
| 16 | robots.txt | Partial: allowed 5 AI crawlers | Pass: before launch `Disallow: /`; at launch allows all and names 6 search crawlers and 12 AI crawlers, lists the sitemap and points to llms.txt | `src/lib/robots.ts` | `tests/unit/robots.test.ts`, `site.test.ts` |
| 17 | llms.txt | Partial: English only, product links only | Pass: English and 11 language versions with the entity sentence, quick facts, ranges, products, guides and company pages; English `llms-full.txt` with every product, spec table, term and FAQ | `src/lib/llms.ts` | `seo-head.test.ts`, `site.test.ts` |
| 18 | Core Web Vitals (lab) | Not measured in launch mode | Pass: Lighthouse mobile LCP 1.4–2.7 s, TBT 0–140 ms, CLS 0–0.023 | No change needed; share cards and icons are not loaded by pages | Section 4 |
| 19 | Favicons and manifest | Partial: SVG favicon only | Pass: favicon.ico (16/32/48), favicon.svg, apple-touch-icon (180), 192/512 and maskable icons, `site.webmanifest`, square 512 px logo | `npm run icons` | `seo-head.test.ts` |
| 20 | 404 page | Pass (noindex, no canonical) | Pass | Also excluded from the sitemap | `site.test.ts` |
| 21 | Mobile | Pass | Pass: viewport meta, Lighthouse mobile emulation | (kept) | Lighthouse |
| 22 | `lang` and `dir` | Pass | Pass (`ar` is `dir="rtl"`, Chinese `zh-Hans`) | (kept) | `i18n.test.ts` |
| 23 | Search-engine verification | Missing | Ready: `site.verification.google / bing / yandex` render their meta tags only when filled | `src/config/site.ts` | `seo-head.test.ts` |
| 24 | AEO: direct answer + FAQ on every product | Pass (40–60 word `answer`, 4–6 FAQs with question H3s, FAQPage) | Pass | (kept; now tested) | `seo-head.test.ts`, `structured-data.test.ts` |
| 25 | AEO: quick facts box | Missing | Pass: a `<dl>` of six facts (what we export, HSN codes, incoterms and payment, ports, minimum order, lead time) on home and about, in 12 languages | `src/components/QuickFacts.astro` | `seo-head.test.ts` |
| 26 | GEO: consistent entity naming | Partial (wording varied) | Pass: one sentence per language (`ui.seo.entity`) used in Organization data, llms.txt and llms-full.txt | | `seo-head.test.ts` |
| 27 | IndexNow | Missing | Ready: key file, `npm run indexnow` (sends nothing until launch and a live domain) | `scripts/indexnow.mjs` | `tests/unit/indexnow.test.ts` |
| 28 | Honesty | Pass | Pass: no manufacturing claims in any language (meta keywords such as "manufacturers India" are search phrases, not claims; visible copy says "sourced from vetted Indian manufacturers") | | `site.test.ts`, `i18n.test.ts`, `products.test.ts` |

## 2. Structured data, per page type

Every page: `Organization` (`@id` `<site>/#organization`, name, alternateName, url, square logo, description in the page language, slogan, `areaServed: Worldwide`, knowsAbout, parentOrganization; `email`, `telephone`, `address` and `contactPoint` only when `contactIsPlaceholder` is false; `sameAs` only from `site.profiles`), `WebSite` (per language, `inLanguage`, publisher), and a `WebPage` (`inLanguage`, isPartOf, breadcrumb, mainEntity, primaryImageOfPage). Inner pages add a `BreadcrumbList`.

| Page | Page type | Main entity / extra blocks |
| --- | --- | --- |
| Product | ItemPage | `Product` (name, description = the answer, url, sku = slug, brand, countryOfOrigin India, category, image = real photo, additionalProperty: HSN with `propertyID`, varieties, pack sizes, typical specs; never offers, prices, ratings or reviews), `FAQPage` |
| Products, range | CollectionPage | `ItemList` of products with positions, localized URLs and photos; range pages also `FAQPage` |
| Guide | WebPage | `BlogPosting` (headline, description, datePublished, dateModified, author and publisher Organization with logo, images, keywords, inLanguage), `FAQPage` where the guide has FAQs |
| Blog index | CollectionPage | `ItemList` of guides |
| Export process | WebPage | `HowTo` (six `HowToStep`s), `FAQPage` |
| Home, private label, FAQ | WebPage | `FAQPage` |
| About / Contact | AboutPage / ContactPage | about → the Organization |

`inLanguage` is on every CreativeWork (WebSite, WebPage, FAQPage, BlogPosting, HowTo). schema.org does not define `inLanguage` for Organization, Product, BreadcrumbList or ItemList (they are not CreativeWorks), so adding it would be flagged as an unknown property; they are tied to their language through the WebPage that references them and through their localized URLs.

Google shows Product rich results only with offers, reviews or ratings. We publish none, by design (spec §4), so Product markup helps entity understanding and AI answers but will not produce price/star snippets. FAQ and HowTo rich results are now limited by Google to a few site types; the markup still feeds Bing and answer engines.

### How it was validated

1. `tests/build/structured-data.test.ts` (runs with `npm run test:build`): parses all JSON-LD on all 528 pages; checks `@context`, an allow-list of schema.org properties per type (taken from the type pages on schema.org), the required fields per type, positions and URLs of list items, page language and URL agreement, `@id` references, and the honesty rules (no `offers`, `aggregateRating`, `review`, prices; no `Manufacturer`; no placeholder contacts).
2. `npm run check:types` (`astro check`): every builder in `src/lib/seo.ts` is typed with **schema-dts 1.1.5** (`WithContext<Product>`, `<Organization>`, `<BlogPosting>`, …). An unknown property is a type error; for example adding `rating: 5` to the Product fails with "'rating' does not exist in type 'ProductLeaf'". The project type-checks with 0 errors.
3. Sample review by hand of `/products/labsa/`, `/ar/blog/hsn-code-3401-vs-3402-soaps-detergents/` and `/zh/export-process/`.

After launch, also paste a product page and a guide into <https://validator.schema.org> and Google's Rich Results Test; both need the public URL.

## 3. Crawlers (robots.txt at launch)

All crawlers are allowed (`User-agent: * / Allow: /`). These are also named explicitly, each with `Allow: /`, so a later stricter `*` rule cannot shut them out by accident:

- Search: Googlebot, Bingbot, Applebot, YandexBot, Baiduspider, DuckDuckBot.
- AI search and answers: OAI-SearchBot and ChatGPT-User (ChatGPT search), PerplexityBot and Perplexity-User, Claude-SearchBot and Claude-User, DuckAssistBot.
- AI training: GPTBot, ClaudeBot, Google-Extended (Gemini), Applebot-Extended, and **CCBot (Common Crawl): allowed on purpose.** Common Crawl's public dataset feeds many AI models and research tools; being in it helps GoodBiz Hygiene be known to assistants that never crawl the site themselves. The site has nothing to protect from training (no prices, no private data). To opt out later, change its line to `Disallow: /` in `src/lib/robots.ts`.

## 4. Launch-mode verification

A copy of the branch (`git archive`, outside the repository) was built with `launchReady: true`, `contactIsPlaceholder: false` and sample contact details (not committed). In that copy:

- `npm test` (2,674 tests), `npm run test:build` (964), `npm run check:placeholders` ("No PLACEHOLDER values found.") and `npm run i18n:check -- --strict` all pass.
- `robots.txt` allows all, names the crawlers above and lists `sitemap-index.xml`; no page carries `noindex` except `404.html`.
- `sitemap-0.xml` has 528 URLs, each with 13 `xhtml:link` alternates (12 languages + x-default) and a `<lastmod>`; the 404 page is not listed.
- `npm run indexnow -- --dry-run` refuses to send because the domain does not serve the key yet.

Lighthouse 12.8.2, default mobile profile (Moto G Power emulation, slow 4G throttling), headless Chrome, served by `astro preview`:

| Page | en P / A / BP / SEO | ar P / A / BP / SEO | zh P / A / BP / SEO |
| --- | --- | --- | --- |
| Home | 97 / 100 / 100 / 100 | 97 / 100 / 100 / 100 | 96 / 100 / 100 / 100 |
| Product (dish wash liquid) | 99 / 100 / 100 / 100 | 98 / 100 / 100 / 100 | 99 / 100 / 100 / 100 |
| Range (kitchen care) | 98 / 100 / 100 / 100 | 96 / 100 / 100 / 100 | 97 / 100 / 100 / 100 |
| Guide (import dish wash liquid) | 100 / 100 / 100 / 100 | 99 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| Contact | 98 / 100 / 100 / 100 | 96 / 100 / 100 / 100 | 99 / 100 / 100 / 100 |

The one unscored (informative) accessibility audit, "label-content-name-mismatch", flags the language menu button: its accessible name ("Choose a language. Current language: English") contains the visible text but does not start with it. It does not affect the score; a translator-wide wording change can fix it later.

## 5. Not done, and why

- **Per-guide share cards.** Guides use the photo card of the product they are about, which is language-neutral; per-guide text cards would add about 100 more images for little gain.
- **Real-world Core Web Vitals.** Lab numbers only; field data (CrUX) appears in Search Console after launch, once there is traffic.
- **Google Business Profile, backlinks, verification codes, profile URLs.** Need the owner's accounts and facts; see the README go-live checklist.
