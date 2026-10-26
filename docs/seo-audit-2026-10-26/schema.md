# Schema.org audit, soap-gules.vercel.app (2026-10-26)

Method: raw HTML fetch of 14 URLs (/, /products/, dish-wash-liquid, labsa, laundry-care, /horeca/, /export-process/, /about/, /faq/, /blog/, two blog posts, /fr/products/floor-cleaner/, /ar/) plus src/lib/seo.ts. All JSON-LD is server-rendered (no SPA dependency). Source not modified.

**Schema score: 82/100.**
Syntax, @id graph and type hygiene are very good. Points are lost for pre-launch hosts, the deprecated HowTo, thin Organization data, and the Service and ItemList nodes not tied into the WebPage.

## Detection summary
- Format: JSON-LD only, @context https://schema.org, absolute URLs, ISO 8601 dates. No Microdata or RDFa.
- Syntax: every block parsed (0 errors). Block counts: 4 to 12 per page.
- @id graph: 0 unresolved `{"@id": ...}` references on all 14 pages. Organization is `/#organization` and shared across all languages. WebSite is per language (`/ar/#website`, `/fr/#website`). WebPage, BreadcrumbList and main entity use `<url>#webpage`, `#breadcrumb`, `#product` and so on.
- Types seen: Organization, WebSite, WebPage/AboutPage/CollectionPage/ItemPage, BreadcrumbList, ItemList, Product, Service, BlogPosting, FAQPage, HowTo.
- Per page: Home = Org + WebSite + WebPage + FAQPage. Product = Org, WebSite, ItemPage, Breadcrumb, Product (no offers), FAQPage. /horeca/ = 12 blocks (Service + 6 ItemLists + FAQPage).

## Findings

### S1. Every @id and url is on a host that does not resolve yet (pre-launch)
Severity: Medium (expected, launch blocker).
Evidence: all schema, canonical and hreflang use `https://www.goodbizhygiene.com`. `curl https://www.goodbizhygiene.com/` returns no HTTP response (000). The pages are served from soap-gules.vercel.app, so Google would see entities that point at an unreachable URL.
Fix: nothing to change in the schema logic, because `site.url` drives everything. At cutover, set `site.url` and rebuild. Do not hand-edit blocks. Keep Org/WebSite @ids on the live host from day one, because changing an @id later orphans the entity.
How we'd know it failed: after launch, grep the built HTML for `vercel.app` or any host other than the canonical one (expect 0 in JSON-LD). Rich Results Test on 3 URLs should show the same host as the browser URL.

### S2. HowTo on /export-process/ is a deprecated type, and its steps share one URL
Severity: Low (Info). Google removed HowTo rich results in Sept 2023, so there is no SERP benefit. Do not extend or add to other pages.
Evidence: `HowTo #howto` has 6 HowToStep entries and every `step.url` is `.../export-process/#steps`. The same anchor on all steps is not a valid deep link.
Fix: either leave it as harmless semantics, or drop the builder (`howToJsonLd`) and keep the visible ordered list. If kept, point each step at its own anchor or remove `step.url`. The WebPage has no `mainEntity` pointing at the HowTo, so the node is not linked into the graph.
How we'd know it failed: in the built HTML, the 6 step URLs are not all distinct anchors, or an anchor does not exist in the DOM.

### S3. Product without offers: eligibility, B2B fit and the honest alternative
Severity: Info (strategy).
Evidence: Product blocks (dish-wash-liquid, labsa, fr floor-cleaner) carry name, description, url, sku, brand, countryOfOrigin, category, image (labsa has none) and additionalProperty (HSN, variants, pack sizes, specs). No offers, aggregateRating or review.
Answers:
- Rich result eligibility: none. Google Product snippets need at least one of offers, review or aggregateRating. Merchant listings need `offers` with a price (and ideally availability, shipping and returns). Valid Product without those is parsed as entity markup only.
- Merchant listing for B2B quote-only: not appropriate. A fake or "0" price, or a made-up `priceSpecification`, would violate Google's structured-data policy (markup must match visible content). Keep the owner's no-offers rule.
- Honest alternative: keep Product as semantic markup (no SERP feature, helps entity understanding and AI parsing). Put the B2B value in `additionalProperty` (HSN, grades, packing, MOQ if published), the visible RFQ CTA, and the Organization/Service nodes. Do not use ProductGroup (it exists for purchasable variants in merchant listings; variants here are not purchasable SKUs). OfferCatalog is acceptable only as a non-priced catalogue on Organization (see R2).
Fix: none required. Add the missing image on LABSA (S6).
How we'd know it failed: Rich Results Test reports Product as "valid items detected" with only a "no offers/review/aggregateRating" warning, which is the expected state. A failure would be any `offers`, `price` or `aggregateRating` key appearing in a built page (the existing test in tests/build/structured-data.test.ts should assert this).

### S4. Organization is honest but thin
Severity: Medium.
Evidence (/ and /ar/ and /fr/): has @id, name, alternateName, url, logo (ImageObject 512x512), image (duplicate of logo), description (localised), slogan, areaServed "Worldwide", knowsAbout (9), parentOrganization (name only), memberOf (FIEO, CHEMEXCIL). Missing: contactPoint, email, telephone, address (all gated on `contactIsPlaceholder`, correct), sameAs, identifier (the site shows "IEC registered" and "Udyam registered" on /about/ but `f.iec` is empty so no identifier is emitted), foundingDate, legalName.
Problems:
- With contact details pending there is no `address` at all. Country and city are public facts and can go out now without a street address.
- memberOf Organizations have no sameAs or @id, so they are plain name and url strings.
- `alternateName` "GoodBiz Hygiene, a GoodBiz Global company" is a description, not a name variant.
- `slogan` and `alternateName` stay English on /ar/ and /fr/ while `description` is localised (minor).
- `image` duplicates `logo` (harmless).
Fix: see snippet R1. Only emit values that are real and visible on the site. Add `identifier` for IEC only after the number is published on the page.
How we'd know it failed: Rich Results Test (Organization) with no errors, and Search Console "Logos" report valid after launch. Any placeholder text ("TBD", "[...]") in Org JSON-LD means the gate failed.

### S5. contactPoint: pending state is handled correctly, but there is a cheap honest version
Severity: Low.
Evidence: no `contactPoint` anywhere. A real /contact/ page exists (HTTP 200) but has no ContactPage markup.
Fix: you may emit `contactPoint` with `contactType: "sales"`, `url` of /contact/ and `availableLanguage` before the email or phone is public. Google requires at least one contact channel and a URL qualifies. Only list languages the team actually answers in (the 12 site languages are not automatically support languages). Mark /contact/ as `ContactPage` (the builder already supports it).
How we'd know it failed: the page lists a language the team cannot answer, or `url` returns non-200.

### S6. Product details: image gap, `sku` is the slug, brand claim
Severity: Low to Medium.
Evidence: LABSA Product has no `image` (dish-wash-liquid and floor-cleaner do). `sku` is the URL slug ("labsa"), not a real SKU. `brand` is "GoodBiz Hygiene" on a raw material such as LABSA that is sourced from third-party manufacturers.
Fix: add an image for every Product (recommended property, and needed if offers ever appear). Either remove `sku` or use a real internal code, because a slug can collide with future merchant data. Confirm with the owner that the products are sold under GoodBiz Hygiene's brand. If LABSA and noodles are sold as generic commodities, drop `brand` for those rather than imply a manufacturer. Do not add `manufacturer` (the site is not a manufacturer).
How we'd know it failed: a Product block with no `image`, or `sku` equal to the slug, in the built HTML.

### S7. Service on /horeca/ is valid but not linked into the page graph
Severity: Medium.
Evidence: `Service #service` has name, serviceType, description, url, provider (@id), areaServed, audience (BusinessAudience). The /horeca/ WebPage has no `mainEntity`, so the Service is a floating node. The 6 `ItemList #space-*` nodes (rooms, kitchen, washrooms, floors, laundry, back-of-house) are also not referenced from anywhere (they resolve, nothing points at them). `back-of-house` has 1 item.
Fix: set the WebPage `mainEntity` to `{"@id": ".../horeca/#service"}`. Add `hasOfferCatalog` on the Service pointing to the space lists (no prices, so use OfferCatalog with Product references only). See R3.
How we'd know it failed: a script that lists every @id and every referenced @id finds `#service` or `#space-*` with zero inbound references.

### S8. ItemList (products, category, blog, HoReCa spaces)
Severity: Info.
Evidence: /products/ numberOfItems=23 with 23 elements, positions sequential, urls absolute and on-host, images present. Category and blog ItemLists are consistent (numberOfItems equals length).
Notes: no Google rich result applies to a Product or blog ItemList (carousels are limited to a few types), so this is semantic only. Valid and harmless. ListItem uses `url` and `name`, which is fine.
How we'd know it failed: numberOfItems differs from the element count, or an item URL 404s (the build test should check this).

### S9. BreadcrumbList
Severity: Pass.
Evidence: all non-home pages have one. Positions sequential, every item has an absolute `item` URL, localised names (fr: Accueil > Produits > Nettoyants surfaces et maison > Nettoyant sols), the last item equals the page URL, and the @id equals `<url>#breadcrumb`, which the WebPage references. The home page has none (correct).
How we'd know it failed: Search Console Breadcrumbs report shows errors, or an item URL is not the localised URL.

### S10. BlogPosting
Severity: Low.
Evidence (two posts): headline, description, datePublished, dateModified, inLanguage, mainEntityOfPage (to #webpage), url, author, publisher with logo, keywords, image (array). All ISO 8601. Headlines under 110 characters. The post WebPage links to `#article` via mainEntity.
Gaps:
- `author` is the Organization. Google prefers a named Person for Article rich results. For a B2B brand blog an Organization author is acceptable, and a named expert (with `Person.url`, `jobTitle`, `worksFor`) would be stronger for E-E-A-T.
- Dates are midnight UTC (`T00:00:00.000Z`), with no real time or zone, and `dateModified` equals `datePublished` on both posts.
- Article is not a rich-result feature for most queries now, so the benefit is context and freshness signals.
How we'd know it failed: `dateModified` earlier than `datePublished`, or the visible byline date differs from the markup.

### S11. FAQPage (kept, per owner)
Severity: Info.
Evidence: FAQPage on /, /ar/, /faq/ (12 Q&As), category, product and HoReCa and export-process pages. Each has @id, url, inLanguage and Question/Answer pairs.
Notes: Google retired FAQ rich results for all sites on May 7, 2026, so there is no SERP effect. Any AI/GEO benefit is unconfirmed. Keeping it is harmless provided the markup matches visible content. It is not a policy issue. The same site-wide FAQ is repeated on several pages (the home page FAQ duplicates the same 6 Q&As in the same language), which dilutes nothing but adds nothing either. There is no recommendation to remove.
How we'd know it failed: a marked-up question that is not on the visible page, or a placeholder answer.

### S12. inLanguage usage
Severity: Pass with note.
Evidence: set on WebSite, WebPage (all subtypes), FAQPage, BlogPosting, HowTo, with correct BCP 47 (`en`, `ar`, `fr`) matching `<html lang>`. Not set on Organization, Product, BreadcrumbList, ItemList and Service, correctly, because they are not CreativeWorks. The file header documents this.
Note: the shared Organization @id carries the language of whichever page rendered it (description changes per language while slogan and alternateName stay English), so crawlers see different values for one @id. It is not an error, but language-tagged values (`{"@language":"ar","@value":"..."}`) would be cleaner. Low.
How we'd know it failed: `inLanguage` differs from `<html lang>` on a localised page (the 12-language build test should assert this).

### S13. WebSite
Severity: Low.
Evidence: present on every page, with a per-language @id (`/fr/#website`), publisher (@id to Org). No `potentialAction` (correct, since the Sitelinks Search Box was retired in 2024 and the site has no search). The home WebSite supports the site name feature (name plus alternateName), which is fine.
Fix: none. Keep `name` identical to the Organization name. Do not add SearchAction.

## Recommended additions (honest, B2B)

### R1. Organization enrichment (emit only real values)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.goodbizhygiene.com/#organization",
  "name": "GoodBiz Hygiene",
  "legalName": "<registered legal name, only when confirmed>",
  "url": "https://www.goodbizhygiene.com/",
  "address": { "@type": "PostalAddress", "addressLocality": "<city>", "addressCountry": "IN" },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "url": "https://www.goodbizhygiene.com/contact/",
    "availableLanguage": ["English"]
  },
  "identifier": [
    { "@type": "PropertyValue", "propertyID": "IEC (Importer Exporter Code, India)", "value": "<10-char IEC, only when shown on the site>" }
  ],
  "memberOf": [
    { "@type": "Organization", "@id": "https://www.fieo.org/#organization", "name": "Federation of Indian Export Organisations", "url": "https://www.fieo.org/" },
    { "@type": "Organization", "@id": "https://www.chemexcil.in/#organization", "name": "Basic Chemicals, Cosmetics & Dyes Export Promotion Council", "url": "https://www.chemexcil.in/" }
  ],
  "sameAs": ["<LinkedIn company page URL once it exists>"]
}
```
Rules: drop any key whose value is not final. Do not add `<...>` placeholders to production. `memberOf` should stay only while the membership is current and verifiable. Move `alternateName` to a real variant (for example "GoodBiz Hygiene India") or remove it.

### R2. Organization.hasOfferCatalog (no prices, no Offer objects)
Use it as a catalogue index, linking categories rather than faking Offers.
```json
{
  "@type": "Organization",
  "@id": "https://www.goodbizhygiene.com/#organization",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Soaps and home-care products for export",
    "itemListElement": [
      { "@type": "OfferCatalog", "name": "Laundry Care", "url": "https://www.goodbizhygiene.com/categories/laundry-care/" },
      { "@type": "OfferCatalog", "name": "Kitchen Care", "url": "https://www.goodbizhygiene.com/categories/kitchen-care/" }
    ]
  }
}
```
Check the real category slugs before use. No SERP feature. It is entity and AI-parsing context only.

### R3. Link the HoReCa Service into the page graph
On the /horeca/ WebPage add:
```json
"mainEntity": { "@id": "https://www.goodbizhygiene.com/horeca/#service" }
```
and on the Service:
```json
"mainEntityOfPage": { "@id": "https://www.goodbizhygiene.com/horeca/#webpage" },
"hasOfferCatalog": {
  "@type": "OfferCatalog",
  "name": "HoReCa supplies by space",
  "itemListElement": [
    { "@id": "https://www.goodbizhygiene.com/horeca/#space-rooms" },
    { "@id": "https://www.goodbizhygiene.com/horeca/#space-kitchen" }
  ]
}
```
(Repeat for the remaining four spaces.) Alternative: reference the ItemLists with `hasPart` on the WebPage.

### R4. Product: additions that stay honest
Add `image` on every Product, `audience` (`BusinessAudience`) and a `mainEntityOfPage` pointing at `<url>#webpage`. Remove `sku` unless it is a real code. Do not add offers, ProductGroup, aggregateRating or review.

### R5. Things NOT to add
HowTo (deprecated), SpecialAnnouncement (deprecated), SearchAction, merchant-listing offers with a fake price, ProductGroup, review or rating markup, Person author without a real named expert.

## Priority order
1. S1 launch host swap (with a post-build grep).
2. S4/R1 Organization enrichment, with real values only.
3. S7/R3 link Service and ItemLists into the graph.
4. S2 HowTo: low value, keep or drop, do not extend.
5. S6 Product image, sku and brand.
6. S10 author Person and real timestamps.
