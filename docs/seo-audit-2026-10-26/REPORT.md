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

## What to measure (no re-audit needed)
- Search Console: pages indexed out of about 541 in week 2, and impressions by country and language.
- Enquiries per week from `/contact/?product=` links.
- Referral visits from the marketplace listings.
- Mentions in ChatGPT and Perplexity answers for "HSN code for dish wash liquid" and "import detergent powder from India".

No one can guarantee first place. These are the levers that move it.
