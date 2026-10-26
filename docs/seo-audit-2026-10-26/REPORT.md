# SEO audit: soap-gules.vercel.app (GoodBiz Hygiene)

Date: 2026-10-26. Business type: B2B exporter (product catalogue and lead generation, no e-commerce). 541 pages in 12 languages.
Detailed findings are in the seven files beside this one: technical.md, content.md, schema.md, performance.md, geo.md, agentic.md and sxo.md.

## Two scores

| | Score |
|---|---|
| **Today, as deployed** | **Not indexable, by design.** robots.txt is `Disallow: /`, every page is `noindex`, and canonical URLs point to `www.goodbizhygiene.com`, which doesn't exist yet. Google and the AI engines can't see the site. |
| **SEO Health once launched (code as it stands)** | **74 / 100** |

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 78 |
| Content quality (E-E-A-T) | 23% | 70 |
| On-page / search experience | 20% | 63 |
| Schema / structured data | 10% | 82 |
| Performance (Core Web Vitals) | 10% | 93 |
| AI search readiness (GEO) | 10% | 69 |
| Images | 5% | 80 (estimated from the performance and content findings; no dedicated image audit) |

The site is technically strong: it's fast, the hreflang setup is correct, structured data is valid on every sampled page, and every page is unique and fully translated. The main shortfall is trust and off-site presence: who is behind the site, proof of the supply chain, and mentions on other sites. Search results for the main head terms are also dominated by B2B marketplaces.

## The domain decision
Recommendation: **keep the site hidden (as it is now) until the domain is bought and connected.**
- Indexing `*.vercel.app` now would build early signals on an address you plan to replace, and a second copy of the site under a different host is a known source of duplicate-content problems.
- A domain costs roughly the price of a meal. It's the cheapest item on the list and it unblocks everything else.
- Meanwhile, do the off-site work (section D) and the code fixes (section B). Both pay off on day one.

How we'd know this was wrong: if the domain is still not bought after 4 weeks, reconsider launching on the Vercel address with a planned 301 redirect.

## A. Launch blockers (owner input needed)
1. **Real contacts:** email, phone, WhatsApp and address in `src/config/site.ts`. Every page and the enquiry form still use placeholders. (SXO, agentic, content)
2. **Domain:** buy it, add it in Vercel, then set `site.url` and `launchReady: true`.
3. **Trust facts:** a named contact person, city, legal entity and year founded. The content audit flags "no verifiable people" as its top E-E-A-T gap.

## B. Code fixes the team can make now (no owner input needed)
| # | Priority | Fix | Source |
|---|---|---|---|
| 1 | High | `vercel.json`: 308-redirect `*.vercel.app` to the real domain once it exists, and add `X-Robots-Tag: noindex` for preview and non-production hosts (gate launch on `VERCEL_ENV=production`). | technical, geo |
| 2 | High | Settle trailing slashes (`trailingSlash: true` in vercel.json). `/products` and `/products/` both return 200. | technical |
| 3 | High | Fix the FAQ answer that says minimums "are listed on each product page". Products say "No fixed minimum". | content |
| 4 | High | Reposition /horeca/ as "hotel soap, guest amenities and housekeeping chemicals". Searches for "hotel amenities" expect full kits (shampoo, conditioner, dental). Either broaden the products or narrow the wording. | sxo |
| 5 | Medium | Add a "How we vet manufacturers and check orders" section (only the steps you really do) and link it site-wide. | content |
| 6 | Medium | Expand /private-label/: link the products, show the packs, and explain the merchant-exporter advantage to people searching for "manufacturer". | sxo |
| 7 | Medium | Cite primary sources in the guides (WCO HS 2022, DGFT ITC-HS, CBIC, BIS IS 2888 and others). Add the HS 2022 note (3402 20 became 3402 50). Add 8-digit ITC-HS lines once the team has checked them. | geo, content |
| 8 | Medium | Add the missing security headers (X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors) and immutable caching for /fonts and /images. | technical, performance |
| 9 | Medium | Link the Service and ItemLists on /horeca/ into the structured data. Add `address` (country and city) and `memberOf` @ids to Organization. | schema |
| 10 | Medium | Fix the translated H1s that read as stitched strings (e.g. French "… / gel vaisselle Exportateur et fournisseur…"). | sxo |
| 11 | Low | Smaller image variants and correct `sizes` (home, HoReCa, export: about 120–260 KB saved). Lighter hero script on /zh/. Load Arabic font weights on demand. | performance |
| 12 | Low | Add body links from products to related guides and categories. Write longer category intros. Add a "last reviewed" date on product pages. | content |
| 13 | Low | Announce the enquiry-ready panel with `aria-live` and show the email and phone as plain text, so AI agents can complete the hand-off. | agentic |
| 14 | Low | Small text fixes: the HSN label running into its note ("3402 508-digit"), the untranslated "Registered with" line in non-English llms.txt files, and the robots.ts comment about Google-Extended. | geo |

## C. Owner decisions
- **Brand wording:** Product schema and image alt text say "GoodBiz" brand, and your packaging photos show GoodBiz branding. That's consistent if GoodBiz is your own export brand made by vetted manufacturers. Confirm this so the copy can say so plainly.
- **Language redirect:** English pages redirect first-time visitors to their browser language. That's good for visitors and harmless for Googlebot. Keep it unless you prefer to only suggest the language.

## D. Off-site work (biggest ranking lever, owner action)
For "<product> exporter India" searches, the results are 90–100% marketplaces (IndiaMART, TradeIndia, GlobalLinker). You win by appearing *on* them, each listing linking back to your product pages:
1. **Directory listings:** IndiaMART, TradeIndia, Alibaba, go4WorldBusiness, ExportersIndia, and the FIEO and CHEMEXCIL member directories.
2. **Profiles:** a LinkedIn company page and a Google Business Profile (if you have a public address). Then add their URLs to `site.profiles` so the site lists them as your official profiles (`sameAs`).
3. **Group links:** links from the GoodBiz Global and GoodBiz Agro sites.
4. **Later:** a Wikidata entry, once two independent sources mention you.
5. **After launch:** Google Search Console and Bing Webmaster (submit `sitemap-index.xml`), then `npm run indexnow`.

Where the site *can* rank early: long-tail and per-market searches, and above all French, Spanish and Arabic searches, where no Indian supplier currently writes in the buyer's language. That's your clearest opening.

## Fixes applied (2026-10-26)

All of section B is done on branch `fix/seo-audit`. Contacts, `site.url` and `launchReady` are unchanged (owner input, section A). Every new or changed visible string is in all 12 languages and `npm run i18n:check -- --strict` passes.

| # | What was done | Commit |
|---|---|---|
| 1 | `vercel.json` (written by `npm run vercel:config` from `site.ts`, checked by a unit test): `X-Robots-Tag: noindex, nofollow` on every `*.vercel.app` host, and a 308 from `*.vercel.app` to `site.url` once `launchReady` is true with a real domain. The launch decision is now `launchReady && VERCEL_ENV === 'production'` (no `VERCEL_ENV` = local build = production), so every preview is noindex with `Disallow: /`. README section 7 explains it. | `b55b00f` |
| 2 | `trailingSlash: true` in `vercel.json` (`/products` → 308 → `/products/`). | `b55b00f` |
| 3 | The private-label FAQ answer now says there is no fixed minimum, and that a private-label design can carry its own label or carton minimum stated on the quotation. Test keeps FAQs and products consistent in every language. | `aa2b400` |
| 4 | /horeca/ narrowed to "hotel soaps, guest amenities (soap, body wash, hand wash) and housekeeping, kitchen and laundry chemicals": title, description, a scope line under the h1, a guest-rooms note saying shampoo, conditioner, dental kits and slippers are not supplied, Service name and type, llms text, and keywords without "hotel amenities supplier" as a head term. | `38660da` |
| 5 | "How we vet manufacturers and check orders" on /about/#how-we-vet (six steps, only practices the site already states), linked from the footer and the home page, in llms-full.txt. README asks the owner to confirm and extend it. | `4fa66c8` |
| 6 | /private-label/: grid of the 19 private-label products by range with their pack photos and links, the products supplied without private label named, and "Why source private label through a merchant exporter" (one contact, mixed containers, documents, no fixed minimum). | `e6b1444` |
| 7 | All 8 guides cite primary sources by stable URL (WCO HS 2022, DGFT ITC(HS), CBIC, BIS IS 2888, ICC Incoterms). The HSN guide explains that HS 2022 moved retail washing and cleaning preparations from 3402 20 to 3402 50 and says "8-digit ITC-HS codes are confirmed per order against the current DGFT schedule". No 8-digit codes are published. Guides show "Last reviewed 26 Oct 2026". | `96ab06d` |
| 8 | Security headers (X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options, CSP `frame-ancestors 'none'`), one-year immutable caching for /fonts, one week for /images and /og. | `b55b00f` |
| 9 | /horeca/ WebPage `mainEntity` → Service; Service `mainEntityOfPage` and a price-free `hasOfferCatalog` listing the six space ItemLists. Organization `address` (country now; city and street when real) and `@id`s on the FIEO and CHEMEXCIL `memberOf` nodes. | `f64dfbb` |
| 10 | Product and range h1s are composed per language from `common.titleH1` (e.g. "Nettoyant sols : exportateur et fournisseur depuis l’Inde"); the two-line layout is unchanged. | `c596b4b` |
| 11 | Kochi photo 400w/800w and neem cut-out 600w/900w with correct `sizes`; Arabic pages load two font files instead of three; hero fan setup moved to idle time. `build.inlineStylesheets: 'always'` was measured and not adopted (it lowered / and /horeca/ to 97 on the uncompressed local preview). | `62da489` |
| 12 | Every product body links its range and a related guide (23 products × 12 languages); each range page has a 155–165 word overview with guide links; products show "Last reviewed" and emit `dateModified`; the seven products without a guide are now listed on one. | `f75c0b2` |
| 13 | The enquiry-ready panel is announced through a polite `role="status"` region (focus still moves to it), and the email and phone are shown as plain text beside the send buttons. | `9f55206` |
| 14 | Hidden separator between the HSN pill and its note ("3402 50. 8-digit…"); the llms.txt "Registered with" line is translated; the robots.ts comment now separates search, grounding and training bots, with a test. | `e6f5bf9` |

Local Lighthouse 13.5.0, mobile, `npm run preview`, median of 3 interleaved runs against a build of the audit commit (`5b25154`):

| Page | Performance before → after | Accessibility | CLS | LCP before → after | Weight before → after |
|---|---|---|---|---|---|
| / | 98 → 98 | 100 | 0 | 2.48 s → 2.48 s | 400 → 355 KB |
| /horeca/ | 99 → 99 | 100 | 0 | 1.96 s → 1.96 s | 414 → 415 KB |
| /export-process/ | 99 → 99 | 100 | 0 | 2.11 s → 2.11 s | 325 → 256 KB |
| /ar/ | 97 → 98 | 100 | 0 | 2.57 s → 2.41 s | 469 → 379 KB |
| /zh/ | 97 → 97 (worst run 91 → 96) | 100 | 0 | 2.56 s → 2.56 s | 400 → 355 KB |

## What to measure (no re-audit needed)
- Search Console: pages indexed out of about 541 in week 2, and impressions by country and language.
- Enquiries per week from `/contact/?product=` links.
- Referral visits from the marketplace listings.
- Mentions in ChatGPT and Perplexity answers for "HSN code for dish wash liquid" and "import detergent powder from India".

No one can guarantee first place. These are the levers that move it.
