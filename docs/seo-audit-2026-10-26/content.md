# Content quality and E-E-A-T audit: GoodBiz Hygiene (soap-gules.vercel.app)

Date: 2026-10-26. Graded as it would be at launch: placeholder contacts are assumed to be filled in and noindex removed.
Method: live fetch (render_page.py, raw mode) of en `/`, `/about/`, `/contact/`, `/faq/`, `/export-process/`, `/private-label/`, `/horeca/`, `/products/floor-cleaner/`, `/products/sles/`, `/categories/surface-home-cleaners/`, `/blog/hsn-code-3401-vs-3402-soaps-detergents/`; fr `/fr/`, `/fr/products/floor-cleaner/`, `/fr/blog/hsn-code-3401-vs-3402-soaps-detergents/`; ar `/ar/products/floor-cleaner/`, `/ar/about/`. Source read from `src/content`, `src/i18n/ui/en.ts` and `src/config/site.ts`. Title and description pairs for all 540 built pages (45 per language) came from `dist/`, which was built 2026-10-25.

## Scores

| Measure | Score |
|---|---|
| **Content quality (overall)** | **70 / 100** |
| E-E-A-T (weighted) | 53 / 100 |
| - Experience (20%) | 8 / 20 |
| - Expertise (25%) | 17 / 25 |
| - Authoritativeness (25%) | 9 / 25 |
| - Trustworthiness (30%) | 19 / 30 |
| AI citation readiness | 80 / 100 |
| Thin or duplicate content risk | Low for products, posts and translations. Medium for About and category pages |
| Templated metadata (metadata_template.py) | en / fr / ar: `site_risk: low`, `templated_ratio: 0.0`, `shared_cta_phrases: {}`. The only flag is a secondary `brand_suffix_in_description` on 2 to 3 pages per language |

*The E-E-A-T weights are this audit's internal model. Google publishes no numeric weights.*

### Strengths to keep

- The honesty framing is consistent everywhere: "merchant exporter, does not manufacture" appears on the home page, About, FAQ, Organization schema and llms.txt. The site has no invented reviews, statistics or "better than brands" claims. A scan for "99.9", "kills", "leading", "trusted by" and "guarantee" found nothing in product copy. Disinfectant claims are handled carefully (herbal-phenol post FAQ: "We do not supply claims").
- Product copy is unique. Across the 23 product bodies, 6-word-shingle Jaccard averages **0.057** and peaks at **0.106** (LABSA and SLES). Only two sentences repeat on all 23 pages: the incoterms line and the 8-digit HSN line. That is acceptable boilerplate.
- Product bodies run 960 to 1,255 words of source, and the rendered en product pages have about 1,050 to 1,300 extracted words. Each opens with a definitional `answer`, then a specs table with "typical" qualifiers, then FAQs. Spot-checked technical facts are accurate: 3401 30 for retail liquid skin cleansers; IS grade TFM of 76% min for Grade 1; the 3808 94 and 3809 91 alternative codes for phenol and softener; the SLES EO moles and active ranges.
- The 8 buyer guides run about 1,400 to 1,750 words each, are practical and carry honest caveats ("not customs advice").
- The translations are complete. All 396 i18n files exist, and the fr and ar floor-cleaner pages are fully localised with no English leakage in the body (fr 1,545 words, ar 1,159 words, en 1,311 words).
- Readability fits B2B buyers. The floor-cleaner product scores about FRE 55 / FK grade 9.8, SLES about FRE 60 / FK 8.7, and the HSN guide about FRE 60 / FK 8.9. Average sentences run 15 to 17 words.

---

## Findings

### C1. No people, place or verifiable identity behind the business. Severity: High

- **Evidence:** `/about/` has 290 extracted words, about 98 of them in prose. It names no founder, director or sourcing lead, and gives no city, street address, founding year or company legal form (Pvt Ltd, LLP or proprietorship). The footer and `src/config/site.ts` hold `address: 'PLACEHOLDER, India'`. The registration strip says "registration details are available to buyers on request". It shows no IEC, RCMC or Udyam number, although an IEC can be checked on the DGFT site and an Udyam number on the Udyam portal. The Organization schema has no `address`, `foundingDate`, `founder`, `legalName` or `identifier`. Blog posts are bylined "GoodBiz Hygiene" (`author: Organization`). For a first-time overseas importer about to wire a T/T deposit, this is the main trust gap. The QRG treats "who is responsible for this site" as the first trust question for YMYL-adjacent money transactions.
- **Fix:** At launch, put the legal entity name, registered address (city at minimum), founding year and one or two named people on `/about/`, each with a role and a one-line background (for example "sourcing and quality, X years in FMCG exports"). Publish the IEC number, and the RCMC and Udyam numbers if the owner is comfortable doing so. Publishing them is standard practice and easy to check, so it is not an "invented certification" risk. If a number must stay private, say why and how a buyer can verify it, for example "IEC is printed on every proforma invoice". Add `legalName`, `address`, `foundingDate`, `founder`/`employee` and `identifier` (IEC) to the Organization JSON-LD. Add a named reviewer line to each guide, such as "Reviewed by <name>, <role>".
- **How we'd know it failed:** `/about/` extracted text still has fewer than 150 prose words, or contains no person's name and no city. `grep -c PLACEHOLDER dist/**/*.html` is above 0 on the production build. The Organization JSON-LD has no `address`. Blog JSON-LD `author` is still only an Organization.

### C2. "Vetted manufacturers" is said dozens of times and never explained. Severity: High

- **Evidence:** "vetted" appears in the hero, the FAQ, the Organization description, llms.txt, all 23 product pages and the private-label page. The home page goes further: "Each product comes from an Indian manufacturer we have checked for quality, consistency and export experience" and "checked against your sample before loading". No page says what the check is: factory visit, BIS licence, ISO or GMP certificate review, lab test of samples, or a pre-shipment inspection and who does it. A process claim repeated without evidence reads as marketing filler, which the QRG marks down, and it is the passage an AI answer engine would quote back to a buyer.
- **Fix:** Add a "How we vet manufacturers and check orders" section to `/about/` or `/export-process/` (and link it from the trust band). List the real criteria in 4 to 6 bullets, for example "valid BIS/drug licence where required, export history, retained batch samples, COA per batch, photo and video of packed goods before loading, third-party inspection (SGS, Intertek, Bureau Veritas) available at buyer's cost". Include only steps that actually happen; if a step does not happen yet, leave it out. Change the home page wording to point to that section.
- **How we'd know it failed:** A buyer, or an LLM asked "how does GoodBiz Hygiene vet manufacturers?", cannot find any concrete criterion on the site. In the build, the word "vetted" appears on more than 20 pages and no page holds a heading containing "vet" or "inspection".

### C3. Minimum order quantity contradicts itself. Severity: Medium

- **Evidence:** Every product page, Quick facts and llms.txt say "No fixed minimum. Trial orders, part loads and mixed containers are all quoted". The home and FAQ answer to "Can I order products under my own brand?" (`src/i18n/ui/en.ts:499`) says "Minimum quantities depend on the product and pack, and **are listed as typical on each product page**". No product page lists a typical MOQ. A buyer, or an AI summary, will notice the conflict, and it erodes trust in the other facts.
- **Fix:** Rewrite line 499 (and its 11 translations), for example: "...Private-label designs can carry their own minimum, which depends on the product and pack and is stated on the quotation." Alternatively, add a real "typical private-label minimum" to each product, if the manufacturers have one.
- **How we'd know it failed:** `grep -rn "listed as typical" src/i18n` still returns hits, or the FAQ page and a product page give different MOQ statements.

### C4. Guides cite no primary sources. Severity: Medium

- **Evidence:** The 8 posts contain **0 external links** (`grep -o '](https?://' src/content/blog/*.md` returns nothing). They name WCO, ITC-HS, the BIS toilet-soap specification and GHS SDS but link to none of them, and they name no standard number (IS 2888 for toilet soap; IS 285 or IS 13498 for laundry soap). For classification and regulatory content, a link to the source is the main authority signal for both raters and AI citation engines.
- **Fix:** In each post, add 2 to 4 links to primary sources: the WCO HS nomenclature (chapter 34), DGFT ITC-HS schedule, BIS standard pages, UN GHS, and the ICC Incoterms 2020 page. Give the standard number next to each figure, for example "IS 2888 Grade 1: TFM 76% min". Add a "Sources" list at the end of each post and an `updated` date when sources are re-checked.
- **How we'd know it failed:** `grep -c '](https' src/content/blog/*.md` gives 0 for any post. The TFM table still has no standard number.

### C5. Category pages are thin hubs. Severity: Medium

- **Evidence:** The category markdown runs 74 to 81 words, with a one-sentence `intro` and `summary`. `/categories/surface-home-cleaners/` extracts to 367 words, and nearly all of them are product-card variant strings and FAQs taken from the product pages. The page has no unique overview text. Category URLs are the best match for broad queries ("surface cleaner exporter India", "laundry products supplier India"), yet they hold the least original text on the site.
- **Fix:** Give each category 250 to 400 words of original copy, covering:
  - how to choose within the range, for example acid vs neutral cleaners
  - which products share a container well (weight vs volume)
  - classification notes for the range
  - which buyer guide to read first

  Link to 1 or 2 guides from the copy.
- **How we'd know it failed:** Unique prose (the intro plus the body, excluding cards and FAQs) on any category page is under 200 words, or more than 50% of the page's 6-word shingles also appear on its product pages.

### C6. Seven products have no buyer guide, and product bodies have no inline links. Severity: Medium

- **Evidence:** No post lists bathroom-tile-cleaner, glass-cleaner, hotel-guest-soap, laundry-soap-bar, glycerin-transparent-soap, sles or body-wash-shower-gel in `relatedProducts`, so those pages show no "Buyer guides" block. All 23 product bodies contain **0** inline internal links; linking relies on the `related` cards. Floor cleaner does get three guides, but the first is "How to import dish wash liquid", which only loosely matches.
- **Fix:** Add the missing products to relevant posts' `relatedProducts`:
  - sles and laundry-soap-bar to the HSN guide
  - hotel-guest-soap, glycerin-transparent-soap and body-wash-shower-gel to the TFM / private-label guides
  - glass-cleaner and bathroom-tile-cleaner to the herbal-phenol guide

  Also add 1 or 2 contextual links in each product's "Why source" or "Grades" paragraph, for example from the SLES page to the HSN guide and from the toilet-bath-soap page to the TFM guide. Consider a HoReCa guide for the guest-soap and amenity products.
- **How we'd know it failed:** A build-time check shows any product with 0 guides. `grep -c '](/' src/content/products/*.md` is 0 for more than 5 products.

### C7. No first-hand experience evidence. Severity: Medium (limited by the honesty rules)

- **Evidence:** The site has no case notes, no photos of packed or loaded goods, no sample COA, and no "what we learned shipping X to Y" content. Product photos exist (README: "real product photos"), but nothing shows GoodBiz's own operations. The found pictures are openly credited as stock (`src/data/found-pictures.ts`). This is correct, but it is not evidence. For the Experience factor this is the weakest point, and it is the hardest to fake without breaking the honesty rules. That is exactly why genuine items count.
- **Fix:** Without inventing clients, publish anonymised, real artefacts once they exist:
  - a redacted sample COA and SDS (PDF) per main product
  - a photo of a real packed pallet or container door
  - a worked loading-plan example
  - first-person sourcing notes in the guides, for example "when we compare dish wash samples we check viscosity at ...". Use these only if true.

  Until then, add a short "Sample documents" section to `/export-process/` showing blank templates.
- **How we'd know it failed:** Six months after launch there are still no downloadable sample documents and no first-hand passages ("we", with a specific observation) in the guides.

### C8. Product schema claims "GoodBiz Hygiene" as the brand. Severity: Low to Medium

- **Evidence:** The floor-cleaner `Product` JSON-LD has `"brand":{"@type":"Brand","name":"GoodBiz Hygiene"}`. The goods are made by third-party manufacturers and are usually sold under the buyer's private label, so the markup implies a branded GoodBiz product line. That conflicts with the site's own "does not manufacture" positioning.
- **Fix:** Remove `brand`, or replace it with `"offers": {"seller": {"@id": "#organization"}}`. Alternatively, keep `brand` only on products that really ship under a GoodBiz label.
- **How we'd know it failed:** The Rich Results Test or a JSON-LD grep still shows `Brand: GoodBiz Hygiene` on private-label-only products.

### C9. Vague operational facts weaken citation value. Severity: Low

- **Evidence:** "Shipped from major Indian ports" is repeated on the home page, About, export process, llms.txt and every product. It names no port, and no state or city is given for sourcing. Buyers searching "<product> exporter India" compare ports and transit times. A specific line ("Nhava Sheva (JNPT) and Mundra; Chennai for ...") is more useful and more quotable.
- **Fix:** Name the 2 or 3 ports actually used, and the sourcing regions (states) for the main categories. Add typical transit-time bands for the regions in the export-process region selector, labelled "indicative".
- **How we'd know it failed:** The Quick facts "Ports" value still contains "major Indian ports" and no port name.

### C10. Wording defects in generated headings and the French H1. Severity: Low

- **Evidence:** The spec heading template lowercases the product name: "What are the typical specifications of **labsa** (linear alkyl benzene sulphonic acid)?", "...of **sles** (sodium lauryl ether sulphate)?", and the same pattern on all 23 pages. In French, the H1 runs the product name and the label together: "Nettoyant sols Exportateur et fournisseur depuis l'Inde". The spec heading "Quelles sont les spécifications types : nettoyant sols ?" reads as machine-assembled. Arabic gives "لـمنظف" (attached; acceptable). Text extraction also merges adjacent pills: "HSN 3402 398-digit ITC-HS code", "HSN 34026 products". AI parsers can misread these as numbers.
- **Fix:** Keep the original casing (or use `keyword` only for lowercase languages), and handle acronyms. In fr, build the H1 as "Exportateur de nettoyant pour sols depuis l'Inde" and the spec heading as "Spécifications types du nettoyant pour sols". Add a visually hidden separator (" · " or `<span class="sr-only">. </span>`) between the HSN pill and the following text.
- **How we'd know it failed:** `grep -o 'specifications of [a-z]\{4\} (' dist/products/*/index.html` returns hits, or the render_page `extracted_text` for `/products/sles/` still contains "3402 398-digit".

### C11. No review or update dates on products and static pages. Severity: Low

- **Evidence:** Blog posts have `datePublished` and `dateModified` (all equal, 2026-08-20 to 2026-10-14), but no post sets `updated`. Product, category and About pages carry no date. Specs, lead times and MOQ policy are the kind of facts that go stale.
- **Fix:** Add a `reviewed` date to the product frontmatter, show it as "Specifications reviewed <month year>", and emit it as `dateModified` on the ItemPage. Re-check quarterly.
- **How we'd know it failed:** No product page shows a reviewed date at launch, or the dates are more than 12 months old.

---

## Search-intent fit for "<product> exporter India"

Product pages match the intent well. The H1 is "<Product> Exporter & Supplier from India", followed by a definitional answer, HSN, MOQ, pack sizes, container loads, private-label options and incoterms. These are the facts importers compare. What competing exporter pages usually have and these lack is buyer-verifiable identity: the location, the IEC number and named people (C1), plus proof of process (C2, C7). Titles run long: 70 to 85 characters with the "| GoodBiz Hygiene" suffix (e.g. "Private Label Fabric Softener Exporter & Supplier from India | GoodBiz Hygiene"). They will truncate in search results; the on-page audit should handle this.

CTAs are good. Each product ends with a prefilled "Request a quote for this product" form, and the home, About and guide pages have a one-line enquiry form. Once contacts are live, the CTA should show the real email and WhatsApp number next to the form, because B2B importers often prefer direct contact to a form.

## AI citation readiness (80/100)

- Positives:
  - every product opens with a self-contained 2-to-3-sentence definition (`answer`)
  - specs come as tables with units and "typical" qualifiers
  - FAQPage, Product, BlogPosting and Breadcrumb JSON-LD are present
  - `llms.txt` and `llms-full.txt` exist with key facts and one-line product definitions
  - guides end with "Key takeaways" lists
- Gaps:
  - no external sources (C4)
  - vague port and vetting facts (C2, C9)
  - an MOQ contradiction an LLM could repeat (C3)
  - merged-text artefacts (C10)
  - no named author entity (C1)

## Structured findings (for audit-data.json, category "Content Quality")

```json
[
  {"id":"C1","severity":"high","title":"No verifiable identity: no people, address, registration numbers or named authors","pages":["/about/","/blog/*","footer"]},
  {"id":"C2","severity":"high","title":"'Vetted manufacturers' claim repeated site-wide with no stated criteria","pages":["/","/about/","/products/*","/private-label/"]},
  {"id":"C3","severity":"medium","title":"MOQ contradiction: FAQ says typical MOQ listed on product pages; products say no fixed minimum","pages":["/","/faq/"],"source":"src/i18n/ui/en.ts:499"},
  {"id":"C4","severity":"medium","title":"Buyer guides have zero external citations to WCO/DGFT/BIS/GHS","pages":["/blog/*"]},
  {"id":"C5","severity":"medium","title":"Category pages have ~80 words of unique copy","pages":["/categories/*"]},
  {"id":"C6","severity":"medium","title":"7 products have no buyer guide; product bodies have no inline links","pages":["/products/*"]},
  {"id":"C7","severity":"medium","title":"No first-hand experience evidence (sample COA/SDS, packing photos)","pages":["sitewide"]},
  {"id":"C8","severity":"low","title":"Product schema brand=GoodBiz Hygiene conflicts with merchant/private-label model","pages":["/products/*"]},
  {"id":"C9","severity":"low","title":"'Major Indian ports' with no port named","pages":["sitewide"]},
  {"id":"C10","severity":"low","title":"Lowercased acronyms in spec headings; awkward fr H1; merged pill text","pages":["/products/*","/fr/products/*"]},
  {"id":"C11","severity":"low","title":"No reviewed/updated dates on product and static pages","pages":["/products/*","/about/"]}
]
```
