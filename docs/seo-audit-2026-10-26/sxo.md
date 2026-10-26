# Search Experience (SXO) audit, 2026-10-26

Target: https://soap-gules.vercel.app/ (pre-launch, `launchReady: false`; canonical host www.goodbizhygiene.com does not resolve yet).
Method: pages rendered with `render_page.py --mode auto` (static HTML, no SPA shell, so raw = rendered DOM). 17 pages fetched in EN, FR, ES, AR and ZH. SERPs checked with the WebSearch tool for 10 queries.

**SXO Gap Score: 63/100.** This is separate from the technical score in `technical.md`. The page build is strong: depth, schema, hreflang and enquiry UX. Points are lost on page-type fit with the SERPs, on trust and authority signals, and on media that would prove a real supply chain.

| Dimension | Score | Evidence |
|---|---|---|
| Page type | 8/15 | Every "<product> exporter/supplier India" SERP we checked is close to 100% B2B marketplace listings. The site has single-supplier product pages (see SXO-1). |
| Content depth | 13/15 | Product pages run 1,160–1,560 words, with specs, packs, container loading and FAQs. /private-label/ is thin at 522 words. |
| UX signals | 10/15 | The key-facts box sits above the fold, with "Add to enquiry" and a HoReCa tick-list. Placeholder contacts and the language auto-redirect pull this down. |
| Schema | 12/15 | Product (no offers, by design), FAQPage, BreadcrumbList, BlogPosting, Service and ItemList. See `schema.md`. |
| Media | 7/15 | Product photos, but no video, no real packs or shipments, and stock-style scene images (`/images/found/kochi-port-night.webp`). |
| Authority | 5/15 | No named people, years in business, references or `sameAs` profiles. Guide author is the Organization. Contacts are placeholders. |
| Freshness | 8/10 | Guides are dated 2026-10-01 and 2026-10-08. Product pages carry dates from Aug to Oct 2026. |

---

## 1. SERP analysis (proxy)

**Limitation, stated plainly:** WebSearch is not Google. It is a US-only engine with its own index. It returns about 9–10 links per query and shows no SERP features: no PAA, AI Overview, ads or featured snippets. It gives no positions or volumes. The page-type mix below is a proxy for what Google rewards, not a Google top-10.

| # | Query | Results classified | Dominant page type (taxonomy) | Consensus |
|---|---|---|---|---|
| Q1 | dish wash liquid exporter India | 7 GlobalLinker product/seller listings, 2 TradeIndia listings | Product page on a B2B marketplace (multi-vendor) | 9/9 = 100% |
| Q2 | liquid detergent supplier India | 5 GlobalLinker, 3 TradeIndia, 2 IndiaMART city pages ("Detergent in Hapur") | Marketplace listing / local category page | 10/10 = 100% |
| Q3 | private label soap manufacturer India | 6 GlobalLinker PL listings, 2 IndiaMART manufacturer profiles (Cosmico, Firgen), 1 b2brazil | Marketplace listing of manufacturers | 9/9 = 100% |
| Q4 | hotel amenities supplier | 2 regional directories (hospitalityhub AU, architectureanddesign AU), 2 Alibaba, 2 ensun, 1 brand listicle (theloveco), 1 encyclopedia, 1 trade magazine | Directory/aggregator, geo-local (AU/US/CN) | 6/9 = 67% |
| Q4b | hotel amenities supplier India guest soap bulk export | 7 IndiaMART amenity-maker profiles, 1 TradeIndia, 1 indianbusinessportal, 1 YourStory | Marketplace supplier profile | 9/10 = 90% |
| Q5 | HSN code 3402 | Flexport HS lookup ×2, eximpe, busy.in, cogoport, taxadda, 2 spam pages | Tool / lookup page (8-digit code + duty) | 7/9 = 78% |
| Q5b | HSN code 3402 GST rate detergent | eximpe, busy.in ×3, credlix ×5 (one page per 8-digit code) | Tool / lookup page with GST rate | 9/9 = 100% |
| Q6 (FR) | fournisseur liquide vaisselle Inde exportateur | 6 GlobalLinker (English pages), ximpex and seair trade-data pages, fibre2fashion | Marketplace listing (English, not French) | 9/9 |
| Q7 (ES) | proveedor detergente líquido India exportador | 7 GlobalLinker (English), prime-expo exhibitor page, dcmsme PDF | Marketplace listing (English, not Spanish) | 8/9 |
| Q8 (AR) | مورد سائل غسيل الصحون من الهند | okcredit listicle, hackmd spam, finline project report, 2 GlobalLinker, prime-expo, happi, hunarsetu | Mixed: directory 4/9, editorial 3/9 | Low (44%) |
| Q9 (FR) | fabricant savon marque blanche Inde | accio (CN suppliers), made-in-china, a pseau PDF, Marius Fabre retail, an ES listicle on body creams | No Indian supplier page ranks; SERP is incoherent | Low |

**Patterns**
- English commercial queries (Q1–Q3, Q4b) belong to multi-vendor marketplaces: GlobalLinker, TradeIndia and IndiaMART. Their snippets show the trust data buyers compare: MOQ, "GST Verified", years established, response rate, export markets and a FIEO membership flag.
- Generic "hotel amenities supplier" (Q4) is a geo-local, full-kit intent. It wants shampoo, conditioner, dental kits, slippers and in-room equipment from local distributors and brands.
- "HSN code 3402" (Q5) is a tool/lookup intent. The searcher wants the 8-digit line and the GST/IGST rate, one code per page.
- French, Spanish and Arabic queries return English marketplace pages or off-topic results. **No native-language page from an Indian supplier ranks.** For GoodBiz this is the clearest opening, because its FR, ES and AR pages are full translations (1,190–1,560 words).

---

## 2. Page-type comparison

| Query | SERP dominant type | Matching site page | Site page type | Mismatch |
|---|---|---|---|---|
| Q1 dish wash liquid exporter India | Marketplace listing | /products/dish-wash-liquid/ | Product page (single supplier) | **HIGH**: right type, wrong format; it cannot become a directory |
| Q2 liquid detergent supplier India | Marketplace / city category | /products/liquid-detergent/ | Product page | **HIGH** (same reason) |
| Q3 private label soap manufacturer India | Manufacturer listings | /private-label/ | Service/landing page; merchant exporter, not manufacturer | **HIGH**: entity type ("manufacturer") and format both differ |
| Q4 hotel amenities supplier | Geo-local directories, full-kit suppliers | /horeca/ | Landing page (solution hub) | **HIGH**: range and geography differ |
| Q4b hotel amenities supplier India | IndiaMART amenity makers | /horeca/, /products/hotel-guest-soap/ | Landing + product page | MEDIUM |
| Q5 HSN code 3402 | Lookup tool (8-digit + GST) | /blog/hsn-code-3401-vs-3402-soaps-detergents/ | Blog post (comparison, 6-digit level) | **MEDIUM**: format differs; the guide fits "3401 vs 3402" better than "HSN 3402" |
| Q6–Q8 FR/ES/AR | English marketplace pages | /fr/products/dish-wash-liquid/, /es/products/liquid-detergent/, /ar/products/dish-wash-liquid/ | Native-language product page | **ALIGNED/opportunity**: no native competitor |

---

## 3. Findings

### SXO-1. B2B marketplaces own the commercial head terms; the product pages are the right type in the wrong arena (HIGH, primary finding)
**Evidence.** Q1, Q2, Q3 and Q4b are 90–100% GlobalLinker, TradeIndia and IndiaMART listings (section 1). The site's matching pages (/products/dish-wash-liquid/, /products/liquid-detergent/) are well-built single-supplier product pages. On a new domain with no backlinks, they will not displace marketplace pages that aggregate dozens of suppliers per query. `site.profiles` is empty, so the Organization `sameAs` links to no marketplace presence.

**Implication.** The SERP is telling GoodBiz where buyers start: on directories. Ranking on-site for "<product> exporter India" is a long-term goal. The realistic short-term path is to be one of the listings and to use the site as the place the buyer confirms trust.

**Fix.**
1. Create owned profiles on IndiaMART (export/"IndiaMART Export"), TradeIndia, GlobalLinker and Alibaba.com (India suppliers). Each listing gets a product description consistent with the site, a link to the matching `/products/<slug>/` page, and the same company name, city and IEC. Add the profile URLs to `site.profiles` so they go into `sameAs`.
2. On product pages, beat the listing on what listings lack: real pack photos per variety, an indicative FOB band or "price per 1,000 L at 20 ft FCL, on request within 24 h", and a downloadable sample COA/SDS. Also add a "What you get that a directory listing doesn't" block (single point of contact, mixed container, documents).
3. Point on-site keyword effort at long-tail intents where a single supplier's page fits: "<product> supplier for Kenya/UAE/Nigeria", "import dish wash liquid from India", "<product> HSN 3402 50" and native-language queries (SXO-6).

**How we'd know it failed.** 90 days after launch, the GSC Performance report for /products/* shows impressions for "dish wash liquid exporter india" and "liquid detergent supplier india" stuck past position 30, and the long-tail and market queries also earn under 1% CTR. Or the marketplace profiles exist but send no referral sessions to /products/* in analytics. Or `curl -s https://www.goodbizhygiene.com/ | grep -c sameAs` returns 0.

### SXO-2. Placeholder contact details on every page zero out Trust and Action for every persona (CRITICAL launch gate)
**Evidence.** All 17 rendered pages contain `https://wa.me/910000000000`, `mailto:PLACEHOLDER@goodbizhygiene.com` and `tel:+91`, and show the address "PLACEHOLDER, India". The source is `src/config/site.ts` (`contactIsPlaceholder: true`). This is known (see `agentic.md` finding 2). It is repeated here because marketplace snippets lead with verified contact data and response rates. A buyer comparing this site with them sees no reachable person.

**Fix.** Fill `site.contact` with a real email on the domain, a WhatsApp Business number, a landline or mobile and a city-level address before setting `launchReady: true`. Add a build guard that fails when `launchReady && contactIsPlaceholder`.

**How we'd know it failed.** `grep -rlE "PLACEHOLDER|910000000000" dist/` returns any file in a launch build. Or a test enquiry sent via WhatsApp and email from /contact/ is not received within 1 business day.

### SXO-3. "Hotel amenities supplier" promises a range the HoReCa page does not carry (HIGH)
**Evidence.** The title is "Hotel Amenities & HoReCa Cleaning Supplies from India" and the H1 is "Every space in your hotel, one supplier.", which does not contain the keyword. The range for guest rooms is guest soap, shower gel, hand wash and bath soap. There is no shampoo, conditioner, lotion, dental/vanity kit, slippers or shower caps. The Q4 SERP is full-kit amenity suppliers and brands (Swisstrade, The Love Co, RoomService Amenities, Alibaba kit makers), and it is geo-local (AU/US/CN). Q4b is IndiaMART amenity makers selling complete toiletry sets. The page is strong on the other half of HoReCa (kitchen, laundry, floors, washrooms), but the title leads with the half it only partly serves.

**Fix.** Either (a) add shampoo, conditioner and body lotion (HSN 3305/3304) and an amenity-kit product if they can be sourced honestly, or (b) re-position. In that case the title becomes "Hotel Soap, Guest Amenities & Housekeeping Chemicals from India", the H1 becomes "Hotel guest soap and housekeeping supplies, one supplier from India", and the "Guest rooms" block gets a visible line: "We supply soaps, shower gel and hand wash; we do not supply dental kits or slippers." Target "hotel soap supplier India", "housekeeping chemicals supplier", "hotel cleaning supplies exporter" and Gulf/East-Africa market variants. Apply the same change in the AR version (`مورد مستلزمات الفنادق` is in its meta keywords).

**How we'd know it failed.** After launch, /horeca/ gets GSC impressions for "hotel amenities" queries with CTR under 1%. Or sample requests from the tick-list ask in their free-text message for shampoo, kits or slippers. Track `message` text on /contact/ submissions that carry the HoReCa prefill.

### SXO-4. The private-label page is too thin, and it does not answer the "manufacturer" intent (HIGH)
**Evidence.** /private-label/ is 522 words (FR 611, ES 600). The H1 is "Your brand, sourced and shipped from India." with no keyword. The main content has **no links to any of the 23 product pages**; only the category links in nav and footer. It gives no MOQ figure ("a private-label design may carry its own minimum"), shows no example packs or mock-ups, and says nothing about destination labelling rules. Q3's SERP is manufacturer listings with explicit MOQ (e.g. "Minimum order: 1000 unit"). The site truthfully says it is a merchant exporter (the policy in `docs/seo-keywords.md`), which is right. But the page never explains why a merchant exporter is the better route for a brand owner, so "manufacturer" searchers who land there have no reason to stay.

**Fix.**
1. Change the H1 to "Private label soaps, detergents and cleaners from India".
2. Add a grid of eligible products linking to `/products/<slug>/#private-label`, with the typical printed-label or carton minimum per pack type (e.g. "shrink sleeve: from N bottles").
3. Add 3–4 white-label mock-up photos.
4. Add a short "Factory direct vs merchant exporter" section: one contact for 23 products, mixed containers, documents handled, manufacturer vetted.
5. Add a labelling-compliance block for the main markets (GCC/SASO, Kenya KEBS, Nigeria NAFDAC/SON, EU CLP for detergents), framed as "we check artwork against".
6. In FR, add "marque blanche" (the query wording; it appears once across the French pages) next to "MDD". In ES, "marca blanca" already appears.

**How we'd know it failed.** In a rebuilt page, the `<main>` still has 0 `href="/products/` links or under 900 words. Or 3 months after launch, GSC shows /private-label/ at average position above 20 for "private label soap india" with under 1% CTR, and form submissions with the private-label prefill stay at 0.

### SXO-5. The HSN guide does not satisfy "HSN code 3402" lookup intent (MEDIUM)
**Evidence.** The Q5 and Q5b SERPs are lookup pages that each give an 8-digit line (34023900, 34029019…) and a GST/IGST rate. Sources even disagree on the rate (busy.in says 18%, credlix says 28%), which leaves room for an authoritative answer. The guide works only at the 6-digit level (3402 31, 39, 50, 90). It has one GST mention ("GST according to the code on the import declaration"), no 8-digit ITC-HS table, no GST/IGST rate with a dated source, and no RoDTEP or drawback note. Its author is `Organization`, with no named reviewer.

**Fix.** Add a table of the 8-digit ITC-HS lines that cover the range: each line with its description, the products it fits and the GST rate as of a stated date, citing the CBIC notification. Re-verify every number against the CBIC tariff before publishing. Add an "Export incentives (RoDTEP/drawback)" note and a named reviewer with a role. Optionally split out `/blog/hsn-code-3402-detergents/` as a lookup-style page and keep the 3401-vs-3402 guide for the comparison intent. Run `/seo content` for the E-E-A-T pass.

**How we'd know it failed.** `grep -cE "3402[ .]?[0-9]{2}[ .]?[0-9]{2}"` on the rendered guide returns 0 8-digit codes, or the page has no "GST" rate with a date. After launch, GSC position for "hsn code 3402" stays above 20.

### SXO-6. FR/ES/AR are the winnable SERPs, but translated product H1s read as stitched strings (MEDIUM)
**Evidence.** In Q6–Q8, no native-language Indian supplier page ranks; results are English GlobalLinker pages or off-topic results. That is the opening. But the localized product H1s are concatenated:
- FR: "Liquide vaisselle / gel vaisselle Exportateur et fournisseur depuis l'Inde"
- ES: "Detergente líquido Exportador y proveedor desde la India"
- AR: "سائل غسل الأطباق / جل غسل الأطباق مصدّر ومورّد من الهند"

Each has a capitalised noun mid-sentence (FR, ES) or no separator or connector (AR). The titles are fine ("Liquide et gel vaisselle : exportateur en Inde").

**Fix.** Give each language its own H1 template with a natural connector: FR "Liquide vaisselle : exportateur et fournisseur depuis l'Inde" (or "Exportateur de liquide vaisselle depuis l'Inde"), ES "Detergente líquido: exportador y proveedor desde la India", AR "سائل غسل الأطباق: مصدّر ومورّد من الهند". Check PT, DE, TR, ID, SW and VI the same way. Prioritise FR, ES and AR product pages in internal links from the localized home pages and llms files.

**How we'd know it failed.** A build test matching `/[a-zà-ÿ] (Exportateur|Exportador|Exportador)/` on fr/es/pt `<h1>` still finds hits. Or after launch, GSC filtered to /fr/ and /es/ shows 0 impressions for product-name + "Inde"/"India" queries after 60 days.

### SXO-7. The first-visit language auto-redirect moves English-reading importers off the result they clicked (MEDIUM)
**Evidence.** Every EN page has an inline script that runs `location.replace('/'+l+location.pathname…)` when `navigator.languages` matches one of the 11 other locales and `gb-lang` is unset. Crawlers are excluded by a UA regex, so indexing is unaffected. FR pages do not carry the script. Google's guidance is not to redirect users by language automatically. An importer in Dubai or Abidjan with an Arabic or French browser who clicked an English SERP result lands on /ar/ or /fr/ instead.

**Fix.** Replace the redirect with a dismissible banner ("Cette page existe en français →") that sets `gb-lang` either way. Keep the hreflang annotations to do the routing in search.

**How we'd know it failed.** In Playwright with `locale: 'ar-AE'` and clean storage, opening `/products/dish-wash-liquid/` ends on a URL starting `/ar/`.

### SXO-8. Authority signals lag what marketplace snippets show buyers (MEDIUM)
**Evidence.** Marketplace snippets show "GST Verified", "Established 2014", response rates and export markets. The site has registrations as badges (FIEO, MSME, CHEMEXCIL, DGFT; numbers withheld by policy in `site.ts`). It has no named people, no founding year (`facts.founded` is empty), no city (`facts.city` is empty), no references or case studies, and no photos of real shipments or packs; scene images come from `/images/found/`. Guides are authored by the Organization.

**Fix.** Fill `facts.city` and `facts.founded`. Add a named export manager with photo and LinkedIn to About and as guide reviewer. Add 2–3 anonymised shipment summaries ("Mixed 20 ft container to Mombasa: dish wash 5 L, floor cleaner 1 L, hotel soap 15 g"). Add real sample and pack photos. Reconsider the no-numbers policy for the IEC only: it is public on DGFT and is what buyers check (Q1 SERP summary: "check each company's IEC code"). That is an owner decision. Run `/seo content`.

**How we'd know it failed.** After launch, the About page has no `Person` or name, `facts.founded` is still empty, or the GSC CTR for branded plus "review"/"genuine" queries is under 20%.

### SXO-9. hreflang sanity check: PASS (INFO)
**Evidence.** We checked 10 page families against all 12 locales (/, /products/, /products/dish-wash-liquid/, /products/hotel-guest-soap/, /categories/kitchen-care/, /horeca/, /private-label/, /faq/, both guides): 120 alternate URLs, each fetched on the vercel host. All return 200. Every alternate lists the identical 13-entry set, so return links are fully reciprocal. Each has a self-referencing canonical, and `x-default` points to the EN URL. `<html lang>` matches the hreflang on every page; `ar` has `dir="rtl"`. `zh-Hans` is a valid BCP 47 script subtag that Google accepts, served at /zh/ with `og:locale` zh_CN. The only caveat is that every href is on www.goodbizhygiene.com, which does not resolve yet; that is covered by `technical.md` F1.

**Fix.** None. Keep `tests/build/i18n.test.ts` running in CI.

**How we'd know it failed.** After launch, a Screaming Frog hreflang crawl of www reports non-zero "Missing return links", "Non-200 hreflang URLs" or "Inconsistent language" on any of these 10 families. Or `curl -s https://www.goodbizhygiene.com/zh/ | grep -c 'hreflang="zh-Hans"'` returns 0.

---

## 4. User stories (from SERP signals)

1. **Awareness.** "As a distributor in Kenya, I want to see which Indian suppliers sell dish wash liquid with MOQ and export markets listed, so I can shortlist 3 to contact." Signal: Q1 snippets list MOQ, export markets and FIEO status.
2. **Consideration.** "As an importer, I want proof the supplier is real (GST/IEC, years, response rate) before I share my brief." Signal: Q1/Q2 summaries say "check each company's IEC code, GST registration" and show "GST Verified" and "14 yrs".
3. **Consideration.** "As a brand owner, I want a PL supplier's minimum order per pack and sample examples, so I can budget a first run." Signal: Q3 listings show "Minimum order: 1000 unit" and handmade PL variants.
4. **Decision.** "As a hotel purchasing manager, I want one supplier for amenities and housekeeping, with samples first." Signal: Q4/Q4b show amenity kits, custom logo printing and "company packs of 432 pieces".
5. **Awareness.** "As a customs broker or importer, I want the exact 8-digit code and GST rate for liquid detergent." Signal: Q5/Q5b show per-code lookup pages and conflicting 18% vs 28% rates.

## 5. Persona scores (weakest first)

| Persona (page) | Relevance | Clarity | Trust | Action | Total | Top fix |
|---|---|---|---|---|---|---|
| Private-label brand owner (/private-label/) | 16 | 15 | 8 | 18 | **57** | Product grid with PL minimums and mock-ups; "factory vs merchant" section (SXO-4) |
| Compliance/customs researcher (HSN guide) | 15 | 18 | 13 | 12 | **58** | 8-digit table, GST rate with dated CBIC source, named reviewer (SXO-5) |
| Francophone/Arabic distributor (/fr/, /ar/ product pages) | 20 | 16 | 9 | 15 | **60** | Fix H1 templates; real contacts; remove auto-redirect (SXO-6, -2, -7) |
| Importer/distributor (/products/dish-wash-liquid/) | 22 | 20 | 9 | 15 | **66** | Real contacts, pack photos, sample COA/SDS, indicative FOB band (SXO-2, -1, -8) |
| Hotel purchasing manager (/horeca/) | 17 | 20 | 11 | 21 | **69** | Align title and range with "amenities"; hotel references and certifications (SXO-3) |

Notes. Importer Clarity is high because the key-facts box (HSN 3402 50, "No fixed minimum", private label) is the first thing below the H1. HoReCa Action is high because the tick-list sends straight to a prefilled samples request. Every Trust score is capped by SXO-2.

## 6. Limitations
- SERPs come from WebSearch, not Google. They are US-only and come without SERP features, positions, volumes, ads, PAA or AI Overviews. Non-English queries ran through the same US engine, not google.fr, google.es or google.ae.
- The site is noindex and robots-blocked, and the production domain does not resolve, so no live rankings, GSC data or backlinks can be checked.
- Whether product photos are real or stock was not verified. CWV and accessibility were not measured here (see `technical.md`).
- 8-digit HSN codes and GST rates named in SXO-5 come from third-party snippets and must be verified against CBIC before use.
- No wireframes were requested.

## 7. Structured findings (for audit-data.json, category "Search Experience")
```json
{"category":"Search Experience","score":63,"findings":[
{"id":"SXO-1","severity":"high","title":"B2B marketplaces own commercial head terms; product pages are single-supplier","pages":["/products/dish-wash-liquid/","/products/liquid-detergent/"]},
{"id":"SXO-2","severity":"critical","title":"Placeholder contact details on all pages","pages":["*"]},
{"id":"SXO-3","severity":"high","title":"HoReCa page targets 'hotel amenities' without a full amenity range","pages":["/horeca/","/ar/horeca/"]},
{"id":"SXO-4","severity":"high","title":"Private-label page thin, no product links, no MOQ, no examples","pages":["/private-label/"]},
{"id":"SXO-5","severity":"medium","title":"HSN guide misses 8-digit/GST lookup intent","pages":["/blog/hsn-code-3401-vs-3402-soaps-detergents/"]},
{"id":"SXO-6","severity":"medium","title":"Translated product H1s concatenated; FR/ES/AR SERPs are the opening","pages":["/fr/products/*","/es/products/*","/ar/products/*"]},
{"id":"SXO-7","severity":"medium","title":"First-visit language auto-redirect on EN pages","pages":["/*"]},
{"id":"SXO-8","severity":"medium","title":"Authority signals below marketplace snippet level","pages":["/about/","/blog/*"]},
{"id":"SXO-9","severity":"info","title":"hreflang reciprocal, x-default and zh-Hans correct","pages":["10 families x 12 locales"]}]}
```

Generate a PDF report? Use `/seo google report`.
