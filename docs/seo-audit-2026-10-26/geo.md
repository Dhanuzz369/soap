# GEO / AI Search Readiness audit: GoodBiz Hygiene

- Audited: https://soap-gules.vercel.app/ (preview) and source at commit `ec62149`, 2026-10-26
- Canonical / launch host: https://www.goodbizhygiene.com
- Method: raw fetch of robots.txt, llms files and 5 pages (`render_page.py --mode auto`; all came back `is_spa: false`, served from the raw HTML with no rendering), JSON-LD inspection, source review of `src/lib/robots.ts`, `src/lib/llms.ts`, `src/config/site.ts`, `src/layouts/BaseLayout.astro`, `astro.config.mjs`, content in `src/content/`.
- Pre-launch state is deliberate and **not** scored as a defect: live robots.txt is `User-agent: * / Disallow: /`, every page has `<meta name="robots" content="noindex, nofollow">`, and no sitemap is built (`/sitemap-index.xml` returns 404). All three are driven by `site.launchReady = false`.

## AI Search Readiness score (launch mode): 69 / 100

| Dimension | Weight | Score | Weighted | Basis |
|---|---|---|---|---|
| Citability | 25% | 78 | 19.5 | Every product, category and guide page opens with a definition, has question-style H2/H3 headings, an FAQ, and specs in tables. But HSN is given only at 6 digits, figures are all "typical", and nothing cites an outside source |
| Structural readability | 20% | 85 | 17.0 | Server-rendered HTML, logical H1-H3, `<th scope="row">` spec tables, FAQPage/Product/BreadcrumbList JSON-LD. Small problems: "HSN 3402 508-digit" runs together in extracted text, the FAQ H2 is generic, spec tables have no `<thead>` |
| Multi-modal | 15% | 55 | 8.25 | Product images with descriptive alt text, per-page OG images. No video, diagrams or downloadable spec sheets |
| Authority and brand | 20% | 30 | 6.0 | New brand. `sameAs` is empty, contact details are placeholders, blog author is the organisation itself, guides cite no outside sources, and there are no third-party mentions |
| Technical accessibility | 20% | 90 | 18.0 | Launch robots policy is sound, llms.txt / llms-full.txt / 11 per-language llms.txt are present, SSR static, IndexNow is ready. Minor gaps: `*.vercel.app` exposure after launch, Applebot-Extended mislabelled in a comment |
| **Total** | | | **68.75 ≈ 69** | |

Effective score today (pre-launch, everything blocked): ~0 for AI visibility, by design.

### Platform-specific outlook (launch mode, first 3 months)

| Platform | Score | Why |
|---|---|---|
| Google AI Overviews | 55 | Needs Googlebot indexing plus E-E-A-T signals. Indexing depends on Googlebot only, not Google-Extended. Authority gap is the limiter |
| ChatGPT Search | 55 | Gated by OAI-SearchBot (allowed) and Bing's index (Bingbot allowed, IndexNow ready). Brand-mention gap hurts |
| Perplexity | 65 | Rewards specific, fresh, well-structured spec and FAQ pages. Best near-term chance for long-tail trade queries |
| Bing Copilot | 60 | Bingbot plus IndexNow at launch. Needs Bing Webmaster verification (`site.verification.bing` is empty) |

## AI crawler access policy (launch mode, `src/lib/robots.ts`)

Before launch, `buildRobots(url, false)` returns `User-agent: *\nDisallow: /`. That is correct for the preview, and `tests/unit/robots.test.ts` covers it.

At launch, `User-agent: *` gets `Allow: /` plus an explicit `Allow: /` group for each bot below, and `Sitemap: <base>/sitemap-index.xml`, which matches the @astrojs/sitemap output gated on the same flag.

| Bot | What it governs | Launch policy | Verdict |
|---|---|---|---|
| OAI-SearchBot | ChatGPT Search index and citations | Allowed | Correct, required for ChatGPT citations |
| ChatGPT-User | User-initiated fetches in ChatGPT | Allowed | Correct |
| GPTBot | OpenAI **training** only; not ChatGPT Search | Allowed | Deliberate training opt-in. Fine for a brand that wants to be known to models. It does not affect ChatGPT Search citability either way |
| PerplexityBot / Perplexity-User | Perplexity index / user fetches | Allowed | Correct |
| Claude-SearchBot / Claude-User | Claude search citations / user fetches | Allowed | Correct |
| ClaudeBot | Anthropic **training** only | Allowed | Deliberate training opt-in. Fine |
| Google-Extended | Gemini/Vertex training and grounding. Not Google Search or AI Overviews inclusion (that follows Googlebot) | Allowed | Fine. Allowing it helps Gemini app/API grounding. AIO depends on Googlebot, which is also allowed |
| Applebot-Extended | Apple Intelligence **training** only. Siri/Spotlight/Safari use Applebot | Allowed (Applebot also allowed) | Fine, see G-9 for a comment inaccuracy |
| CCBot | Common Crawl, feeds many model training sets | Allowed | Deliberate and documented. Reasonable for a new brand chasing model awareness |
| Bingbot | Bing index, which feeds Copilot and ChatGPT Search | Allowed | Correct, critical |
| DuckAssistBot | DuckDuckGo AI answers | Allowed | Correct |

Bots that are not named (Meta-ExternalAgent, Amazonbot, MistralAI-User, cohere-ai, Bytespider) fall under `User-agent: * Allow: /`. That is consistent with the open-by-design policy.

**Grade: A-.** The policy matches the stated goal of maximum AI visibility, separates intent clearly, and has the sitemap line. Deductions: see G-8 (preview hostname) and G-9 (comment accuracy).

## llms.txt status

| File | Status | Notes |
|---|---|---|
| `/llms.txt` | Present, 200, text/plain, 14.5 KB, 105 lines | Valid llmstxt.org shape: H1, blockquote entity summary, key facts, H2 sections of links with one-line descriptions, every product with its HSN code and first-sentence definition, guides, company pages, HoReCa, link to the full file, and the language list |
| `/llms-full.txt` | Present, 200, 175 KB, ~2,000 lines | Strong. Each product has an answer paragraph, HSN, variants, packs, MOQ, private label, container loading, a Markdown spec table and FAQs, followed by export process, private label, HoReCa, company FAQ, guides and About. No PLACEHOLDER strings leak (contact lines are gated by `contactIsPlaceholder`) |
| `/<lang>/llms.txt` (ar, de, es, fr, id, pt, ru, sw, tr, vi, zh) | Present, 200, 103 lines each | Translated headings and descriptions with localized links. One untranslated line, see G-7 |

All absolute URLs point to `https://www.goodbizhygiene.com`, which is correct for launch. They will 404 until DNS is live, which is expected.

---

## Findings

Severity scale: Critical / High / Medium / Low / Info.

### G-1 [High] No off-site entity footprint: `sameAs` is empty, contact is placeholder, and no third-party mentions exist

- **Evidence:** `site.profiles = []`, so the Organization JSON-LD has no `sameAs`. `contactIsPlaceholder: true`, so there is no email, phone or address on the site or in llms files. Organization has no `legalName`, `address`, `foundingDate` or `contactPoint`. `site.facts` is `{}`. The registrations strip (FIEO, MSME, CHEMEXCIL, DGFT) and `memberOf` assert memberships, but no listing anyone can verify is linked. No Wikipedia, Wikidata, Reddit, YouTube or LinkedIn presence was found for "GoodBiz Hygiene", which is expected for a brand this new.
- **Why it matters:** AI answer engines resolve and trust a supplier by corroboration across independent sources. Brand mentions correlate with AI citation much more strongly than backlinks do (YouTube ~0.74 vs Domain Rating ~0.27). A sourcing answer such as "detergent powder exporters in India" lists names that appear on IndiaMART, TradeIndia, Alibaba and directories, not names that appear only on their own site.
- **Fix (in order of impact per effort):**
  1. **LinkedIn Company Page** for GoodBiz Hygiene, with the identical one-line entity description and the website URL (about 1 hour).
  2. **IndiaMART, TradeIndia, ExportersIndia and Alibaba.com (Gold Supplier)** listings that use the same product names and HSN codes as the site and link back. LLMs cite these marketplaces heavily for "supplier/exporter from India" queries (about 1 to 2 days).
  3. **FIEO and CHEMEXCIL member directories.** Confirm the listing is public and correct, then link to it from the registrations strip instead of the council's homepage. This makes `memberOf` verifiable without publishing registration numbers, which keeps the existing site rule (about 2 hours).
  4. **Google Business Profile** (once the real address exists) and **Bing Places**.
  5. **Trade directories:** Kompass, Europages, go4WorldBusiness, TradeKey, Global Sources (pick 2 or 3; avoid paid spam lists).
  6. **YouTube channel** with 3 to 5 short videos (see G-6) and **Reddit**: answer real questions in r/importexport, r/smallbusiness and r/sourcing with substance and a disclosed affiliation, never link-dropping.
  7. **Wikidata:** not eligible yet. Items need "serious and publicly available references", and a self-sourced item for a new company is likely to be deleted. Create it once at least 2 independent references exist (for example a public FIEO/CHEMEXCIL directory entry plus a trade-press mention or the MCA company record). Then add P856 official website, P31 business, P17 India, P749 parent organization (GoodBiz Global), P452 industry. Wikipedia is not realistic in year 1.
  8. Put every owned profile URL into `site.profiles`, and fill `site.contact`, `site.facts.city`, `site.facts.founded` and `site.facts.parentUrl`.
- **How we'd know it failed:** 60 days after launch, Organization JSON-LD on `/` still has no `sameAs` array (check with `curl -s https://www.goodbizhygiene.com/ | grep -c sameAs` = 0). Or asking ChatGPT, Perplexity and Gemini "What is GoodBiz Hygiene?" returns "I couldn't find information" or confuses it with another GoodBiz. Or searching `"GoodBiz Hygiene" -site:goodbizhygiene.com` shows fewer than 5 results.

### G-2 [High] "HSN code for X" answers stop at 6 digits, so the site loses the exact queries it is best placed to win

- **Evidence:** Every product page shows `HSN 3402 50` with "8-digit ITC-HS code confirmed per order". `/llms.txt` and `llms-full.txt` do the same. The HSN guide (`/blog/hsn-code-3401-vs-3402-soaps-detergents/`) never mentions the HS 2022 renumbering. It has no "3402 20" or "2022" in its text, and it lists no candidate 8-digit lines.
- **Why it matters:** Queries like "HSN code for dish wash liquid" or "HSN code for detergent powder" are answered in AI Overviews and ChatGPT with a specific 8-digit code (and often the Indian GST rate) taken from tax and compliance sites. Many of those sources still quote pre-2022 codes under 3402 20. A short, dated, correct passage that names the current line, says it replaced 3402 20 in HS 2022, and splits retail packs from bulk packs is distinctive information an engine would cite. "Confirmed per order" is right commercially but gives an answer engine nothing to quote.
- **Fix:** Keep the commercial caveat and add a citable block to each product page and to the HSN guide, about 60 to 120 words:
  - "Typical ITC-HS (India, 8-digit) line(s): …". Take these from the current DGFT ITC(HS) export schedule and have the team verify them; do not guess. List retail pack vs bulk/institutional pack separately (for example 3402 50 vs 3402 90 for dish wash in 200 L drums).
  - One sentence: "Since HS 2022, retail washing and cleaning preparations sit in 3402 50; older lists show 3402 20."
  - Add a "Last checked against ITC(HS) on <date>" line with a link to the DGFT schedule.
  - Add a 3-column table to the HSN guide: Product | HS 6-digit | Typical ITC-HS 8-digit (retail / bulk).
- **How we'd know it failed:** After launch and indexing, the query set in "Query map" below (HSN rows) gets no goodbizhygiene.com citation in Perplexity or ChatGPT Search over 4 consecutive weekly checks. Or the text "3402 20" still does not appear on the HSN guide (`curl -s …/blog/hsn-code-3401-vs-3402-soaps-detergents/ | grep -c "3402 20"` = 0).

### G-3 [High] Guides and product pages cite no primary sources and have no named expert

- **Evidence:** Outbound links in the HSN guide body are only the registration bodies' homepages, WhatsApp and Google Translate. A grep of `src/content/blog/*.md` and `src/content/products/*.md` finds zero `http` links and zero BIS standard numbers (only one bare "BIS"). `BlogPosting.author` is the Organization, and `datePublished` equals `dateModified` (2026-10-01).
- **Why it matters:** AI engines prefer passages with verifiable attribution. Claims such as "TFM grade 1 ≥ 76%", "active matter 15-25%" and "COA, SDS, certificate of origin" are more citable, and more trustworthy for Google's quality systems, when tied to a source. A named person with trade credentials is a strong E-E-A-T signal for a merchant exporter that does not manufacture.
- **Fix:**
  - Link primary sources inline: WCO HS Nomenclature (heading 3401/3402 notes), DGFT ITC(HS) schedule, CBIC customs tariff, and the BIS standards the specs reflect (IS 2888 toilet soap, IS 285 laundry soap, IS 4955 household laundry detergent powder, and IS 8540 for dish wash). Verify each standard number before publishing.
  - Add a `Person` author, the founder or export manager, with a short bio (years in trade, ranges handled) and a LinkedIn `sameAs`. Use it as `author` on BlogPosting and keep the Organization as publisher.
  - Show a visible "Updated <date>" on product pages and emit `dateModified` from git `lastmod` (`src/lib/lastmod.ts` already exists for the sitemap).
- **How we'd know it failed:** `grep -c "https://" src/content/blog/*.md` is still 0 at launch. Or Rich Results Test on a guide shows `author.@type = Organization`. Or product pages have no `dateModified`.

### G-4 [Medium] Entity description is inconsistent between the About page, the schema and the images

- **Evidence:**
  - Entity string (`ui.seo.entity`, llms.txt, Organization description): "GoodBiz Hygiene, a GoodBiz Global company, **is a merchant exporter**…"
  - About lead (`src/i18n/ui/en.ts:442`): "GoodBiz Hygiene is the home-care and hygiene **export division** of GoodBiz Global, **a merchant exporter from India**". Here the appositive attaches "merchant exporter" to GoodBiz Global, and "division" vs "company" leaves it unclear whether Hygiene is a separate legal entity.
  - `parentOrganization` is `{name: "GoodBiz Global"}` with no `url`/`@id`, so it cannot be linked to GoodBiz Agro or the parent site.
  - `Product.brand = GoodBiz Hygiene` and image alts such as "Yellow rectangular GoodBiz bath soap bar…" (`src/content/products/toilet-bath-soap.md:82`, `hotel-guest-soap.md:80`, and 9 translations) present an own-brand consumer product. The site's core claim is that it is a merchant exporter that does not manufacture and offers private label. Alts also use the truncated name "GoodBiz".
- **Why it matters:** LLMs merge entity facts across passages. Mixed descriptors produce answers like "GoodBiz Global, a manufacturer of soaps…", which is exactly what `src/i18n/honesty.ts` exists to prevent.
- **Fix:** Pick one legal framing and use it everywhere. For example, if Hygiene is a trading name of GoodBiz Global: "GoodBiz Hygiene is the soaps and home-care export brand of GoodBiz Global, a merchant exporter from India." Add `legalName` and `parentOrganization.url`/`@id` once the parent site exists, and link GoodBiz Agro via `subOrganization` on the parent or `sameAs`. In alts, say "sample private-label bath soap bar (GoodBiz demo pack)", or drop the brand. Consider removing `Product.brand`, or using `Product.manufacturer` = omitted and `offers.seller` = Organization instead.
- **How we'd know it failed:** `grep -rn "export division\|division of" src/i18n/ui` still matches. Or asking an AI engine "Does GoodBiz Hygiene manufacture soap?" (after indexing) answers yes.

### G-5 [Medium] HSN pill and its caveat run together in extracted text ("HSN 3402 508-digit")

- **Evidence:** Product hero markup: `<span class="pill"><abbr>HSN</abbr>&nbsp;3402 50</span><span>8-digit ITC-HS code confirmed per order</span>`, with no whitespace between the spans. Trafilatura and similar text extractors produce `HSN 3402 508-digit ITC-HS code confirmed per order`, which reads as "3402 508". This is the most important fact on every product page.
- **Fix:** Put a space or separator inside the markup (for example `</span> <span>` or a visually hidden ": "), or move the caveat into its own `<p>`. Apply the same check to other adjacent inline spans in the hero.
- **How we'd know it failed:** The `extracted_text` from `render_page.py` (or `curl | python -m trafilatura`) for `/products/dish-wash-liquid/` still contains the substring `3402 508`.

### G-6 [Medium] No video or visual explainers (multi-modal gap)

- **Evidence:** No `<video>`, YouTube embed or `VideoObject` on any sampled page. Images are product photos only. There are no flow diagrams for the export process or HSN split, and no downloadable spec PDFs.
- **Why it matters:** YouTube mentions are the strongest observed correlate of AI citation, and Google AIO often shows video for "how to import…" queries.
- **Fix:** Make 3 to 5 short videos (60 to 120 s): "How to import detergent powder from India in 6 steps", "HSN 3401 vs 3402 in 90 seconds", "What documents come with a soap shipment", "Private label: from artwork to container". Get supplier consent before filming partner plants and label them as sourcing/QC footage, never as "our factory". Embed each on the matching guide with `VideoObject` (name, description, uploadDate, thumbnailUrl, transcript). Add an SVG flow diagram to `/export-process/`.
- **How we'd know it failed:** 90 days after launch, the YouTube channel has fewer than 3 videos, or there is no `VideoObject` in any page's JSON-LD.

### G-7 [Low] "Registered with:" line is not translated in the 11 language llms.txt files

- **Evidence:** `/de/llms.txt` line 13 is `Registered with: FIEO (member), MSME Udyam, CHEMEXCIL (RCMC holder), DGFT (IEC)`. `registrationsLlmsLine()` in `src/lib/registrations.ts:74-78` hard-codes English and takes no `lang`.
- **Fix:** Pass `lang` and use the existing translated registration UI strings.
- **How we'd know it failed:** `curl -s https://www.goodbizhygiene.com/de/llms.txt | grep -c "Registered with"` returns 1.

### G-8 [Medium] Launch flag will also open the `*.vercel.app` hostname to crawlers

- **Evidence:** `buildRobots` and the meta robots tag depend only on `site.launchReady`, not on the request host. There is no `vercel.json` and no host-based `X-Robots-Tag`. After launch, `soap-gules.vercel.app` and every preview URL will serve `Allow: /` and `index, follow`. Canonicals point to www, which mitigates the duplication but does not stop crawling or AI engines citing the vercel.app URL.
- **Fix:** Add a `vercel.json` header rule (or Edge Middleware) that sends `X-Robots-Tag: noindex` and a disallow-all robots.txt when `host` does not match `www.goodbizhygiene.com`. Alternatively, set Vercel's "Deployment Protection" for preview deployments and redirect the production `*.vercel.app` alias to the custom domain.
- **How we'd know it failed:** After launch, `curl -sI https://soap-gules.vercel.app/ | grep -i x-robots-tag` returns nothing **and** `curl -s https://soap-gules.vercel.app/robots.txt` shows `Allow: /`. Or `site:soap-gules.vercel.app` returns results in Google or Bing.

### G-9 [Low] robots.ts comment overstates what Applebot-Extended and Google-Extended do

- **Evidence:** The header comment groups the bots "so the site can be cited by ChatGPT, Perplexity, Claude, Gemini, Apple Intelligence and Copilot" and places Google-Extended and Applebot-Extended among the AI search crawlers. Applebot-Extended controls only Apple's training use. Siri, Spotlight and Safari follow Applebot. Google-Extended governs Gemini/Vertex training and grounding, not AI Overviews (Googlebot). The policy itself is correct; only the documentation is wrong, and it could mislead a future editor into thinking blocking Google-Extended removes the site from AI Overviews (or the reverse).
- **Fix:** Reword into three groups: search/answer citation (Googlebot, Bingbot, Applebot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User, DuckAssistBot), training and grounding (Google-Extended), and training only (GPTBot, ClaudeBot, Applebot-Extended, CCBot). Add a `robots.test.ts` case asserting that Googlebot, Bingbot, OAI-SearchBot, PerplexityBot and Claude-SearchBot are each followed by `Allow: /`.
- **How we'd know it failed:** A later edit disallows a search crawler (for example OAI-SearchBot or Claude-SearchBot) while trying to opt out of training, and no test catches it.

### G-10 [Low] Small structural refinements for extraction

- **Evidence:** The product FAQ H2 is "Straight answers." (no topic noun). Spec tables use `<caption>` and `<th scope="row">` but no `<thead>`, so Markdown extractors turn the caption into the header row (`| Typical specifications… |  |`). The FAQ page H1 is "Buyer questions. Straight answers."
- **Fix:** Make the H2 "Dish wash liquid: buyer FAQs" (built from the product title) and add `<thead><tr><th>Specification</th><th>Typical value</th></tr></thead>`, keeping the caption.
- **How we'd know it failed:** The Markdown extraction of a product page still begins the spec table with an empty second header cell.

### G-11 [Info] What is already strong (keep it)

- Definitional first sentence on every product, for example "Dish wash liquid is a concentrated detergent for cleaning plates, pans and cutlery by hand…", is a self-contained answer of the kind engines lift directly. It is repeated in Product `description` and llms.txt.
- Question-form H2/H3 headings ("What are the typical specifications of dish wash liquid / gel?"), FAQPage JSON-LD that matches the visible FAQ, BreadcrumbList, ItemPage → Product `mainEntity`, and `additionalProperty` carrying HSN and specs.
- Container-loading figures, pack sizes and MOQ stance are concrete numbers that few competitors publish.
- 12-language parity with hreflang, plus per-language llms.txt, opens non-English AI answers (ar, fr, sw, id, vi). Competitors rarely cover these.
- `max-snippet:-1, max-image-preview:large` at launch and IndexNow planning are already done.

---

## Query map: what the site can realistically be cited for

Feasibility assumes launch plus G-1 to G-3 done. "Page" is the best existing target.

| Query (and language variants) | Engine most likely to cite | Page | Feasibility | Gap to close |
|---|---|---|---|---|
| HSN code for dish wash liquid / detergent powder / soap noodles / LABSA / SLES | Perplexity, ChatGPT; AIO is harder (tax portals dominate) | product pages + HSN guide | Medium | G-2: 8-digit lines, HS 2022 note, dated check |
| HSN 3401 vs 3402 difference | Perplexity, AIO | HSN guide | High | Add source links (G-3) |
| How to import dish wash liquid from India | All three | `/blog/import-dish-wash-liquid-from-india/` | High | Add video and HowTo-style numbered steps (already partly present) |
| How to import detergent powder from India | All three | none dedicated (only "detergent powder vs liquid" and product page) | Medium | **Write a dedicated guide** that mirrors the dish wash one |
| Export documents for soap / detergent shipment (COA, MSDS, CoO) | Perplexity, ChatGPT | export-documents guide | High | Link to DGFT/EPC sources |
| Soap TFM grade 1 vs grade 2 | AIO, Perplexity | bath-soap-grades guide | High | Cite IS 2888 explicitly |
| Soap noodles specification / 80:20 vs 70:30 | Perplexity | `/products/soap-noodles/` | Medium | Check the spec table covers both blends and TFM |
| Container load of detergent powder / soap in 20 ft container | Perplexity, ChatGPT | product pages (container loading) | Medium-High | Already rare data; make it a table |
| Private label detergent manufacturer / supplier India | ChatGPT, Perplexity (list-style answers) | private-label page | Low until G-1 | Marketplace listings and directories drive these lists |
| Hotel amenity soap supplier India / HoReCa cleaning supplies bulk | Perplexity | `/horeca/`, hotel-guest-soap | Low-Medium | Brand mentions (G-1) |
| Herbal phenyl vs phenol disinfectant | AIO, Perplexity | herbal-phenol guide | Medium | Cite the 3808 94 classification and the regulator |
| Arabic/French/Swahili equivalents, e.g. "استيراد منظفات من الهند", "importer savon d'Inde", "kuagiza sabuni kutoka India" | Perplexity, Gemini | localized guides | Medium-High (low competition) | Make sure guides are translated (12 languages) and per-language llms.txt is complete (G-7) |

Monitoring: after launch, run the HSN, import and documents queries above weekly in ChatGPT Search, Perplexity and Google (AIO), and record whether goodbizhygiene.com is cited. DataForSEO `ai_optimization_chat_gpt_scraper` / `ai_opt_llm_ment_search` can automate this if available. They were not used in this audit.

## Top 5 changes by impact

| # | Change | Finding | Effort |
|---|---|---|---|
| 1 | Create LinkedIn, IndiaMART/TradeIndia/Alibaba and FIEO/CHEMEXCIL directory profiles; fill `site.profiles`, real contact and `site.facts` | G-1 | 2-3 days (mostly off-site) |
| 2 | Add verified 8-digit ITC-HS lines (retail vs bulk), the HS 2022 note and a "checked on" date to product pages and the HSN guide | G-2 | 1 day plus verification |
| 3 | Add primary-source links (WCO, DGFT, CBIC, BIS), a named Person author and `dateModified` | G-3 | 1-2 days |
| 4 | Make the entity framing consistent (About lead, `parentOrganization` url, `Product.brand`, image alts) | G-4 | 2-3 hours |
| 5 | Noindex `*.vercel.app` hosts at launch and fix the "3402 508" text join | G-8, G-5 | 1 hour each |

## JSON-compatible summary (for audit-data.json, category "AI Search Readiness")

```json
{
  "category": "AI Search Readiness",
  "score": 69,
  "score_basis": "launch mode; pre-launch effective visibility 0 by design",
  "dimensions": {"citability": 78, "structural_readability": 85, "multimodal": 55, "authority_brand": 30, "technical_accessibility": 90},
  "platforms": {"google_aio": 55, "chatgpt_search": 55, "perplexity": 65, "bing_copilot": 60},
  "robots_launch_grade": "A-",
  "llms_txt": {"root": "present", "full": "present", "per_language": "present (11), one untranslated line"},
  "findings": [
    {"id": "G-1", "severity": "high", "title": "No off-site entity footprint; sameAs empty; placeholder contact"},
    {"id": "G-2", "severity": "high", "title": "HSN only at 6 digits; no HS 2022 note; loses 'HSN code for X' queries"},
    {"id": "G-3", "severity": "high", "title": "No primary-source citations; author is Organization; no dateModified on products"},
    {"id": "G-4", "severity": "medium", "title": "Entity framing inconsistent (division vs company, Product.brand, GoodBiz alts)"},
    {"id": "G-5", "severity": "medium", "title": "HSN pill and caveat concatenate to '3402 508-digit' in extracted text"},
    {"id": "G-6", "severity": "medium", "title": "No video / VideoObject / diagrams"},
    {"id": "G-7", "severity": "low", "title": "'Registered with:' untranslated in per-language llms.txt"},
    {"id": "G-8", "severity": "medium", "title": "launchReady also opens *.vercel.app hosts to crawlers"},
    {"id": "G-9", "severity": "low", "title": "robots.ts comment mislabels Google-Extended / Applebot-Extended scope; no per-bot test"},
    {"id": "G-10", "severity": "low", "title": "Generic FAQ H2; spec tables lack thead"}
  ]
}
```
