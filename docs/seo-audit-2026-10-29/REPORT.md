# SEO audit: www.goodbizhygiene.com, 29 October 2026

Day 1 after launch. Nine specialist audits ran in parallel against the live site: technical, content, structured data, sitemap, performance, AI search, agent readiness, search experience and backlinks. Every finding below was checked against the live site or the source before it was accepted. Three were rejected as false positives (listed at the end). No Google Search Console, GA4 or Moz data was available, and the site is too new for field data or rankings.

## SEO Health Score: 83 / 100 (before the fixes below)

| Category | Weight | Score | Notes |
| --- | --- | --- | --- |
| Technical SEO | 22% | 92 | All 564 URLs return 200; canonicals, hreflang (0 non-reciprocal pairs), redirects, robots all clean |
| Content quality | 23% | 74 | Deep product pages (1,150–1,400 words); weak on experience and verifiable identity |
| On-page SEO | 20% | 81 | Titles too long for results on 205 pages (fixed); some hub h1s lack their keyword |
| Structured data | 10% | 84 | Accurate and honest; no `sameAs` yet; Product has no offers (no prices exist), so no product rich results |
| Performance | 10% | 98 | Lab: LCP 1.5–1.9 s mobile, CLS ≤ 0.011, TBT ≤ 35 ms on every page tested |
| AI search readiness | 10% | 67 | Crawlers allowed, llms.txt strong, citable passages; entity not yet known anywhere else |
| Images | 5% | 90 | Every product page has a descriptive alt in all 12 languages |

The biggest finding is not on the site. For "detergent powder exporter India", "soap noodles supplier India" and similar searches, nine in ten top results are **marketplace listings** (IndiaMART, TradeIndia, GlobalLinker), not supplier websites. A two-day-old domain cannot outrank those pages; it can appear on them. Marketplace listings that link to the product pages are the fastest route to buyers.

## Fixed on 29 October (live and verified)

| Finding | Fix | Commits |
| --- | --- | --- |
| Sitemap `<lastmod>` was the same for 563 of 564 pages: Vercel builds from a shallow clone, where one commit appears to touch every file | The build fetches the full history (from `origin`, else the GitHub repository Vercel names) and leaves `<lastmod>` out if it cannot; content pages are dated by their own text and template, not the shared interface strings. Live: dates now vary by page | `812fc93`, `cd4e29c` |
| 205 titles wider than a search result; About named the brand twice | The brand is added only when it fits (65 characters, Chinese counted double) and is never repeated. Google shows the site name above the title anyway. Live: 0 titles too wide | `812fc93` |
| LABSA page called LABSA IMDG dangerous goods but offered flexitanks, which carry only non-hazardous liquids | Flexitanks removed from LABSA (and from one buyer guide) in all 12 languages; drums and IBCs must be UN-approved; ISO tank on request is the bulk option | `812fc93` |
| Product structured data had no image for the 5 products without a photo | They use the pack illustration shown on the page; a build test requires an image for every product | `812fc93` |
| `/sitemap.xml` and `/categories/` returned 404 | 308 redirects to `/sitemap-index.xml` and `/products/` (every language) | `812fc93` |
| French, Spanish, Portuguese and Russian spec headings read as stitched ("Quelles sont les spécifications types : lessive en poudre ?") | Natural questions led by the product name | `812fc93` |
| Backlinks kit asked for a link from goodbizglobal.com that already exists | Kit updated: those links are live; what remains there is its structured data (below) | `812fc93` |

## Action plan, in order

Each item says how you will know it worked.

### Owner actions (only you can do these)

1. **Verify the site in Google Search Console and Bing Webmaster Tools, and submit `sitemap-index.xml`.** Nothing else on this list can be measured until this is done. *Worked when:* Search Console shows "Sitemap: Success, 564 discovered" and Page indexing starts counting indexed pages.
2. **List on IndiaMART, TradeIndia, ExportersIndia and GlobalLinker** as a merchant exporter, each product linking to its own page (`docs/backlinks-kit.md`). This is how you reach the searches marketplaces dominate. *Worked when:* those listings appear for "detergent powder exporter India" and similar, and enquiries arrive from them.
3. **Fix goodbizglobal.com's structured data.** It lists goodbizhygiene.com (and the other units) under `sameAs`, which tells Google they are the same organisation. Replace it with `subOrganization` (exact code in the kit). *Worked when:* the Rich Results Test on goodbizglobal.com shows `subOrganization` and no unit URL in `sameAs`.
4. **Create a LinkedIn company page and a Google Business Profile** (service-area, if there is no walk-in office), then send the addresses so they go into `profiles` (`sameAs`). *Worked when:* asking ChatGPT or Perplexity "Who is GoodBiz Hygiene?" returns the Bengaluru merchant exporter.
5. **Add proof buyers and search engines can check**, only where true: GoodBiz Global's legal form and founding year, one named export contact, how to verify the IEC (for example "printed on every proforma invoice; verifiable on the DGFT portal"), a redacted sample COA or SDS per raw material, and real carton weights and the ports actually used. Trust was the lowest score for every buyer persona.

### Site work (ready to do on request)

6. **Product overviews repeat the sourcing sentence** on 16 of 23 products ("…sources floor cleaners from vetted manufacturers. We do not run production lines ourselves. Instead we source floor cleaner from vetted Indian manufacturers…"). Replace with one sentence plus one product-specific fact, in all 12 languages.
7. **Hub h1s without their keyword:** /private-label/, /horeca/, /export-process/, /faq/. Put the keyword in the first line ("Private label soaps and cleaners from India") and keep the brand line second.
8. **A private-label dish wash section** (bottle and can formats, label MOQ, artwork lead time, sample terms) on /private-label/, linked from the dish wash product page. Only figures you can stand behind.
9. **Five buyer guides**, one a month: verifying an Indian exporter before paying a deposit; how many cartons fit a 20 ft container; soap noodles 80:20 vs 70:30; importing detergents into Kenya (KEBS, PVoC); hotel guest soap sizes and quantities per room.

## Checked and left as is

- **FAQPage markup:** Google retired FAQ rich results on 7 May 2026. It does no harm and the visible questions still help readers.
- **HowTo markup on /export-process/:** valid schema, no longer shown as a rich result; harmless.
- **No `offers` on Product:** prices are quoted per order. Inventing them would be wrong, so product rich results are not available.
- **Decorative images with empty alt, no `title` attributes:** correct as they are (see the image check of 29 October).
- **`*.vercel.app` does not redirect but sends `noindex`:** harmless.

## Rejected findings (false positives)

- "51 inputs on /contact/ without labels": every text field has a `<label for>`, and the radio groups are `role="radiogroup"` with `aria-labelledby`.
- "Legal pages carry one extra hreflang": they carry 13, like every page.
- "Logo width and height should be numbers": schema.org types them as Distance (text), so `"512"` is correct; the type checker confirms it.
