# GoodBiz Hygiene Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fast, static, SEO/AEO/GEO-rich export website for GoodBiz Hygiene: a home page, 27 product pages in 5 categories, supporting pages, and an 8-post blog.

**Architecture:** An Astro static site. Products, categories and blog posts are Markdown content collections validated by Zod schemas. Every page renders through one `BaseLayout` that emits all head tags and JSON-LD from pure helper functions in `src/lib/`. Company details live in one config file, which also holds a `launchReady` flag that switches the whole site between noindex staging and indexable production.

**Tech Stack:** Node 24, Astro 7.x, Three.js 0.186 (home hero only) (Content Layer API: `src/content.config.ts`, `glob()` loader, `render()`), `@astrojs/sitemap`, Vitest 5, plain CSS with custom properties, Google Fonts.

**Spec:** `docs/superpowers/specs/2026-10-16-goodbiz-hygiene-website-design.md` (read it before any task; section numbers below refer to it).

**Project root:** the session folder (parent of `docs/`). All paths below are relative to it.

## Global Constraints

- Brand: "GoodBiz Hygiene", "a GoodBiz Global company", "merchant exporter from India", sister brand of GoodBiz Agro.
- Never claim GoodBiz manufactures. Never invent certifications, awards, clients, years or statistics. Drafted specs are labelled "typical".
- Titles and H1s use "Exporter & Supplier from India". Body copy says products are sourced from vetted Indian manufacturers.
- Organization JSON-LD type is `Organization`. Product JSON-LD has no `offers`, `review` or `aggregateRating`.
- HSN shown at 6 digits as "3402 50", with a note that the 8-digit ITC-HS code is confirmed per order. Fabric softener and herbal phenol pages note their alternative classifications (3809 91 and 3808 94).
- Export terms text (verbatim): "FOB, CIF and CFR available; payment terms agreed per order (T/T or LC)"; "Shipped from major Indian ports"; "Typically 3–5 weeks after order confirmation, depending on private-label requirements".
- Palette: light, soothing greens on off-white; deep green for text and buttons; WCAG AA contrast.
- Zero client-side JS except the enquiry form helper, the scroll-reveal (which must respect `prefers-reduced-motion`), and the Three.js home hero (spec §14).
- English only, with `<html lang="en">`.
- Category URLs are `/categories/<slug>/` and product URLs are `/products/<slug>/`.
- Placeholder site URL: `https://www.goodbizhygiene.com`.

## Review Focus

1. **`launchReady: false`:** every built page must contain `<meta name="robots" content="noindex, nofollow">`, and `robots.txt` must be `Disallow: /`. Covered in Task 7 (build tests).
2. **Missing product photo:** a product with no image file must still render a styled placeholder, not a broken `<img>`. Covered in Task 3.
3. **No JavaScript / JS fails:** the enquiry form must still let a buyer reach you. Its fallback is a plain `mailto:` action, and the WhatsApp link is a real `href`. Covered in Task 5.
4. **Long product names on a 360 px phone** (e.g. "LABSA (Linear Alkyl Benzene Sulphonic Acid)"): cards and the H1 wrap without horizontal scroll. Covered in Task 8 (browser check at 360 px).
5. **Duplicate or thin product content:** no two product pages share an identical intro or meta description. Covered in Task 7 (build test).

---

## File Structure

```
astro.config.mjs            site URL, sitemap integration (filtered by launchReady)
package.json                scripts: dev, build, test, check:placeholders
src/config/site.ts          the one config: brand, contact, export terms, launchReady, optional facts
src/content.config.ts       Zod schemas: products, categories, blog
src/content/categories/*.md 5 category files
src/content/products/*.md   27 product files
src/content/blog/*.md       8 posts
src/lib/seo.ts              pure JSON-LD + meta builders
src/lib/enquiry.ts          pure mailto / WhatsApp URL builders
src/lib/products.ts         sorting/grouping/related-product helpers
src/styles/tokens.css       colour, type, spacing tokens
src/styles/global.css       base + components
src/layouts/BaseLayout.astro head (meta, OG, canonical, robots, JSON-LD), header, footer, WhatsApp FAB
src/components/*.astro      Header, Footer, ProductCard, HsnChip, SpecTable, Faq, EnquiryForm, Breadcrumbs, ProductVisual, CtaBand
src/pages/index.astro, products/index.astro, products/[slug].astro, categories/[slug].astro,
          blog/index.astro, blog/[slug].astro, private-label.astro, export-process.astro,
          about.astro, contact.astro, faq.astro, 404.astro, robots.txt.ts, llms.txt.ts
public/images/products/     <slug>.webp (user supplies later), favicon.svg, og-default.png
scripts/check-placeholders.mjs
tests/unit/*.test.ts        Vitest unit tests for src/lib
tests/build/site.test.ts    Vitest tests run against dist/ after build
```

---

### Task 1: Scaffold, config and SEO helpers

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/config/site.ts`, `src/lib/seo.ts`, `src/lib/enquiry.ts`, `vitest.config.ts`
- Test: `tests/unit/seo.test.ts`, `tests/unit/enquiry.test.ts`

**Interfaces:**
- Produces:
  - `site` (default export from `src/config/site.ts`): `{ name: string; tagline: string; parentName: "GoodBiz Global"; url: string; launchReady: boolean; contact: { email: string; phone: string; whatsapp: string /* digits only, intl */; address: string }; exportTerms: { incoterms: string; payment: string; port: string; leadTime: string }; facts: { city?: string; iec?: string; founded?: string; parentUrl?: string; agroUrl?: string } }`. Contact values are placeholders containing the literal token `PLACEHOLDER` (e.g. `"PLACEHOLDER@goodbizhygiene.com"`, whatsapp `"910000000000"` with an accompanying `contactIsPlaceholder: true`).
  - `seo.ts`: `organizationJsonLd(): Record<string, unknown>`, `websiteJsonLd()`, `breadcrumbJsonLd(items: {name: string; url: string}[])`, `faqJsonLd(faqs: {q: string; a: string}[])`, `productJsonLd(p: ProductData, url: string)`, `articleJsonLd(a: {title: string; description: string; date: Date; url: string; image?: string})`, `pageTitle(title: string): string` (appends " | GoodBiz Hygiene" unless already present, max 60 chars before suffix is not enforced), `absoluteUrl(path: string): string`.
  - `enquiry.ts`: `type EnquiryFields = { name?: string; company?: string; country?: string; email?: string; phone?: string; products?: string[]; quantity?: string; privateLabel?: boolean; message?: string }`; `buildWhatsAppUrl(number: string, f: EnquiryFields): string` → `https://wa.me/<number>?text=<encoded>`; `buildMailtoUrl(email: string, f: EnquiryFields): string` → `mailto:<email>?subject=<encoded>&body=<encoded>`; `enquiryText(f: EnquiryFields): string` (one `Label: value` line per non-empty field).
  - `ProductData` type is defined in Task 2; in this task declare it in `src/lib/types.ts` matching Task 2's schema.

- [ ] **Step 1:** `git init`, then create the Astro project manually (`npm i astro @astrojs/sitemap` and `npm i -D vitest typescript @astrojs/check`). Scripts: `"build": "astro build"`, `"test": "vitest run tests/unit"`, `"test:build": "vitest run tests/build"`, `"check:placeholders": "node scripts/check-placeholders.mjs"`.
- [ ] **Step 2: Write failing tests**

```ts
// tests/unit/seo.test.ts
expect(organizationJsonLd()['@type']).toBe('Organization');
expect(JSON.stringify(organizationJsonLd())).not.toMatch(/Manufacturer/);
expect(organizationJsonLd().parentOrganization).toMatchObject({ '@type': 'Organization', name: 'GoodBiz Global' });
// sameAs omitted entirely when facts.parentUrl/agroUrl undefined
expect('sameAs' in organizationJsonLd()).toBe(false);
const p = productJsonLd(sampleProduct, 'https://www.goodbizhygiene.com/products/dish-wash-liquid/');
expect(p['@type']).toBe('Product');
expect(p).not.toHaveProperty('offers'); expect(p).not.toHaveProperty('aggregateRating');
expect(p.brand).toMatchObject({ name: 'GoodBiz Hygiene' });
expect(p.additionalProperty).toContainEqual({ '@type': 'PropertyValue', name: 'HSN Code', value: '3402 50' });
expect(faqJsonLd([{ q: 'Q?', a: 'A.' }]).mainEntity[0]).toMatchObject({ '@type': 'Question', name: 'Q?', acceptedAnswer: { '@type': 'Answer', text: 'A.' } });
expect(breadcrumbJsonLd([{name:'Home',url:'/'},{name:'X',url:'/x/'}]).itemListElement[1].position).toBe(2);
expect(pageTitle('Floor Cleaner Exporter & Supplier from India')).toBe('Floor Cleaner Exporter & Supplier from India | GoodBiz Hygiene');
expect(absoluteUrl('/products/')).toBe('https://www.goodbizhygiene.com/products/');
```

```ts
// tests/unit/enquiry.test.ts
const f = { name: 'Ali', country: 'UAE', products: ['Dish Wash Liquid', 'Floor Cleaner'], privateLabel: true };
expect(enquiryText(f)).toBe('Name: Ali\nCountry: UAE\nProducts: Dish Wash Liquid, Floor Cleaner\nPrivate label: Yes');
expect(buildWhatsAppUrl('910000000000', f)).toBe('https://wa.me/910000000000?text=' + encodeURIComponent(enquiryText(f)));
expect(buildMailtoUrl('a@b.com', f)).toMatch(/^mailto:a@b\.com\?subject=Export%20Enquiry%20-%20GoodBiz%20Hygiene&body=/);
expect(enquiryText({ name: '', message: '  ' })).toBe('');
```

- [ ] **Step 3:** Run `npm test`. Expected: FAIL (modules missing).
- [ ] **Step 4:** Implement `site.ts`, `types.ts`, `seo.ts`, `enquiry.ts`. `astro.config.mjs`: `site: site.url`, `trailingSlash: 'always'`, sitemap integration only when `site.launchReady` is true.
- [ ] **Step 5:** Run `npm test`. Expected: all pass.
- [ ] **Step 6:** Commit `feat: scaffold Astro project, site config, SEO and enquiry helpers`.

---

### Task 2: Content schemas, categories and 27 product files

**Files:**
- Create: `src/content.config.ts`, `src/content/categories/*.md` (5), `src/content/products/*.md` (27), `src/lib/products.ts`
- Test: `tests/unit/products.test.ts`

**Interfaces:**
- Consumes: `ProductData` declared in `src/lib/types.ts` (Task 1). Keep it identical to this schema.
- Produces:
  - Collection `categories`: `{ title: string; slug: string; order: number; hsnRange: string; summary: string /* ≤160 chars */; intro: string }`. Slugs: `bath-personal-soaps`, `laundry-care`, `kitchen-care`, `surface-home-cleaners`, `industrial-raw-materials`.
  - Collection `products` (frontmatter, body = long-form Markdown description of ≥350 words): `{ title: string; slug: string; category: reference('categories'); order: number; hsn: string /* "3402 50" pattern /^\d{4} \d{2}$/ */; hsnNote?: string; metaTitle: string; metaDescription: string /* 120–160 chars */; answer: string /* 2–3 sentence "What is X" definition */; variants: string[] /* ≥3 */; packSizes: string[] /* ≥3 */; packaging: string[]; specs: {label: string; value: string}[] /* ≥4, values prefixed "Typical" where numeric */; moq: string; privateLabel: { available: boolean; options: string[] }; containerLoad?: { ft20: string; ft40: string }; uses: string[]; markets: string[]; faqs: {q: string; a: string}[] /* 4–6 */; related: string[] /* product slugs */; image?: string }`.
  - `products.ts`: `getProductsByCategory(): Promise<{category: CategoryEntry; products: ProductEntry[]}[]>` (sorted by `order`), `getRelated(p: ProductEntry, limit = 3): Promise<ProductEntry[]>` (explicit `related` first, then same category).
- The 27 products, their slugs, categories and HSN codes are exactly as in spec §6 (slug = kebab-case of the short name, e.g. `dish-wash-liquid`, `herbal-phenol`, `labsa`, `sles`, `soap-noodles`). Content follows spec §6 "Per-product variety data" and the Global Constraints. Each `answer`, `metaDescription` and body must be written specifically for that product.

- [ ] **Step 1: Write failing test** `tests/unit/products.test.ts`, which loads all product Markdown via `import.meta.glob('/src/content/products/*.md', { eager: true })` and parses frontmatter:

```ts
expect(products).toHaveLength(27);
expect(new Set(products.map(p => p.slug)).size).toBe(27);
for (const p of products) {
  expect(p.hsn).toMatch(/^\d{4} \d{2}$/);
  expect(p.metaDescription.length).toBeGreaterThanOrEqual(120);
  expect(p.metaDescription.length).toBeLessThanOrEqual(160);
  expect(p.faqs.length).toBeGreaterThanOrEqual(4);
  expect(p.variants.length).toBeGreaterThanOrEqual(3);
  expect(p.related.every(r => slugs.has(r))).toBe(true);
  expect(`${p.answer} ${p.body}`).not.toMatch(/\bwe manufacture\b|\bour factory\b|\bour plant\b/i);
  expect(p.body.split(/\s+/).length).toBeGreaterThanOrEqual(350);
}
expect(new Set(products.map(p => p.metaDescription)).size).toBe(27);
expect(new Set(products.map(p => p.answer)).size).toBe(27);
expect(bySlug['fabric-softener'].hsnNote).toMatch(/3809 91/);
expect(bySlug['herbal-phenol'].hsnNote).toMatch(/3808 94/);
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL (0 products).
- [ ] **Step 3:** Write `content.config.ts` and the 5 category files.
- [ ] **Step 4:** Write the 27 product files. The work is independent per category, so it may be parallelised across subagents by category.
- [ ] **Step 5:** Implement `products.ts`. Run `npm test` and `npx astro sync`. Expected: all pass, no schema errors.
- [ ] **Step 6:** Commit `content: add categories and 27 product pages content`.

---

### Task 3: Art direction, tokens, layout and shared components

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/{Header,Footer,Breadcrumbs,HsnChip,ProductCard,ProductVisual,SpecTable,Faq,CtaBand,WhatsAppFab}.astro`, `public/favicon.svg`
- Test: covered by Task 7 build tests and Task 8 visual check

**Interfaces:**
- Consumes: `site`, `seo.ts` (Task 1); `ProductEntry` (Task 2).
- Produces:
  - `BaseLayout` props: `{ title: string; description: string; path: string; ogImage?: string; jsonLd?: Record<string, unknown>[]; breadcrumbs?: {name: string; url: string}[] }`. It always emits Organization and WebSite JSON-LD, plus the canonical (`absoluteUrl(path)`), OG/Twitter tags, `hreflang="en"` and `x-default`, and the robots meta when `!site.launchReady`.
  - `ProductCard` props: `{ product: ProductEntry }`. `ProductVisual` props: `{ slug: string; title: string; category: string; size: 'card' | 'hero' }`. It renders `<img>` from `/images/products/<slug>.webp` only if that file exists at build time (`fs.existsSync`); otherwise it renders a CSS/SVG placeholder (a bottle, bar or can silhouette chosen by category, tinted from the palette, labelled with the product name).
  - `Header`: sticky, with nav (Products, Private Label, Export Process, Blog, About) and a "Request a Quote" button; collapses to a menu under 768 px using `<details>` (no JS). `WhatsAppFab`: a fixed bottom-right link to `buildWhatsAppUrl(site.contact.whatsapp, {})`.
  - `Faq` props: `{ faqs: {q: string; a: string}[] }`. It renders `<details>`/`<summary>` with question-style text. JSON-LD is passed by the page, not by the component.

- [ ] **Step 1:** Invoke the `taste-skill:taste-skill` skill to choose the art direction within spec §9 (light green palette, calm and premium). Record the chosen fonts, hex tokens and hero composition as a comment at the top of `tokens.css`.
- [ ] **Step 2:** Implement the tokens, global CSS, layout and components. Verify AA contrast for text/background pairs with a quick script or the browser.
- [ ] **Step 3:** Add a temporary `src/pages/index.astro` that renders 3 ProductCards (one with no image). Run `npm run build`. Expected: build succeeds, and `dist/index.html` contains `noindex` and the Organization JSON-LD.
- [ ] **Step 4:** Commit `feat: design tokens, base layout and shared components`.

---

### Task 4: Product, category and listing pages

**Files:**
- Create: `src/pages/products/index.astro`, `src/pages/products/[slug].astro`, `src/pages/categories/[slug].astro`

**Interfaces:**
- Consumes: Tasks 1–3.
- Product page order: breadcrumbs → H1 (`title` + " Exporter & Supplier from India"), with `answer` as a lead paragraph → ProductVisual (hero) + key facts (HSN chip with `hsnNote`, MOQ, private label) → "Available varieties" chips → "Pack sizes & packaging" → SpecTable ("Typical specifications") → body Markdown → "Container loading (approx.)" if present → FAQ → enquiry CtaBand linking to `/contact/?product=<slug>` → related products. JSON-LD: Product, FAQPage, BreadcrumbList.
- Category page: H1, intro, product grid, category FAQ drawn from the first FAQ of each product (max 6), BreadcrumbList.
- Products index: all categories with grids, plus an HSN overview table (product → HSN).

- [ ] **Step 1:** Implement the three pages.
- [ ] **Step 2:** Run `npm run build`. Expected: 27 product pages + 5 category pages + index under `dist/`.
- [ ] **Step 3:** Commit `feat: product, category and listing pages`.

---

### Task 5: Home, enquiry and supporting pages

**Files:**
- Create: `src/pages/index.astro` (replace the temporary one), `src/components/HeroScene.astro`, `src/scripts/hero-scene.ts`, `src/components/EnquiryForm.astro`, `src/scripts/enquiry-form.ts`, `src/pages/{contact,private-label,export-process,about,faq,404}.astro`
- Test: `tests/unit/enquiry.test.ts` (extend)

**Interfaces:**
- Consumes: `buildWhatsAppUrl`, `buildMailtoUrl`, `enquiryText` (Task 1); `getProductsByCategory` (Task 2).
- HeroScene (spec §14): renders a static SVG/CSS range composition (the LCP element and fallback) plus a `<canvas>`. `hero-scene.ts` exports `shouldRun3D(env: {reducedMotion: boolean; webgl: boolean; saveData: boolean}): boolean` (unit-tested: false if any of reducedMotion/!webgl/saveData) and `mountHero(canvas: HTMLCanvasElement): () => void` (returns dispose). Load it with `import()` on `requestIdleCallback` plus IntersectionObserver. Build 6–8 stylised objects from LatheGeometry (bottles), RoundedBox-style geometry (soap bars) and Cylinder (can) in palette colours with MeshPhysicalMaterial (soft transmission on bottles), use soft key and rim light, gentle float plus pointer parallax, pause when off-screen or hidden, DPR ≤ 2, and fade the canvas in over the fallback once the first frame renders. Follow the taste skill for composition.
- Home: hero (Three.js HeroScene behind/beside the copy; H1 names GoodBiz Hygiene and soaps/home-care export from India; CTAs "Request a Quote" → `/contact/`, "View Products" → `/products/`) → category strip → featured products → "Why source through GoodBiz Hygiene" (private label, flexible pack sizes, export documentation, consolidated mixed containers; no invented numbers) → 3-step export process → home FAQ (6, with FAQPage JSON-LD) → latest 3 blog posts → CtaBand.
- EnquiryForm: `<form method="post" action="mailto:{site.contact.email}" enctype="text/plain">` with the spec §10 fields. The products field is a multi-select of all 27 products, pre-selected from the `?product=` query. The progressive-enhancement script intercepts submit and offers two buttons, "Send via WhatsApp" and "Send via Email", using the builders. Without JS the native mailto fallback still works.
- export-process uses the `site.exportTerms` strings verbatim. about uses only the facts in spec §13; `site.facts` fields render only when defined.

- [ ] **Step 0: Failing test** `tests/unit/hero-scene.test.ts`: `shouldRun3D({reducedMotion:false,webgl:true,saveData:false})` → true; each of the three flags flipped → false. Run it to see it fail, then `npm i three` and implement.
- [ ] **Step 1: Add failing test:** `enquiryText({ products: [], privateLabel: false, quantity: '1 x 20ft' })` → `'Quantity: 1 x 20ft\nPrivate label: No'` (an empty array is omitted; `false` renders "No").
- [ ] **Step 2:** Run `npm test`, expect FAIL if not already handled. Then fix and expect PASS.
- [ ] **Step 3:** Implement the pages and form.
- [ ] **Step 4:** Run `npm run build`. Expected: success.
- [ ] **Step 5:** Commit `feat: home, enquiry form and supporting pages`.

---

### Task 6: Blog

**Files:**
- Create: `src/content/blog/*.md` (8 posts, titles exactly as in spec §8), `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`; extend `src/content.config.ts` with `blog: { title; description /* 120–160 */; date: Date; updated?: Date; tags: string[]; relatedProducts: string[] /* product slugs, ≥2 */; faqs?: {q,a}[] }`
- Test: `tests/unit/blog.test.ts`

- [ ] **Step 1: Failing test:** 8 posts; each body has 1,000–1,800 words; `relatedProducts` resolve to existing slugs; unique descriptions; no "we manufacture"; each body contains at least 2 internal links matching `/products/`.
- [ ] **Step 2:** Run it. Expect FAIL.
- [ ] **Step 3:** Write the 8 posts (they can be parallelised across subagents) and the two pages (post page: BlogPosting + BreadcrumbList (+ FAQPage if faqs) JSON-LD, related product cards, CtaBand).
- [ ] **Step 4:** Run `npm test && npm run build`. Expect PASS.
- [ ] **Step 5:** Commit `content: blog with 8 buyer-focused articles`.

---

### Task 7: robots, llms.txt, placeholder check and build tests

**Files:**
- Create: `src/pages/robots.txt.ts`, `src/pages/llms.txt.ts`, `scripts/check-placeholders.mjs`, `tests/build/site.test.ts`

**Interfaces:**
- robots.txt: when `!launchReady`, `User-agent: *\nDisallow: /`. Otherwise allow all, explicitly list `GPTBot`, `PerplexityBot`, `Google-Extended`, `ClaudeBot`, `OAI-SearchBot` with `Allow: /`, and add `Sitemap: <url>/sitemap-index.xml`.
- llms.txt: `# GoodBiz Hygiene`, a one-paragraph summary, then `## Products` grouped by category with `- [Title](absolute url): HSN xxxx xx, one-line answer`, then `## Guides` (blog), then `## Company`.
- check-placeholders: scan `src/config/site.ts` and `dist/**/*.html` for `PLACEHOLDER`. Print each hit, exit code 1 if `launchReady` is true and hits exist, otherwise exit 0 with a warning list.

- [ ] **Step 1: Write `tests/build/site.test.ts`** (reads every `dist/**/index.html` except 404):

```ts
for (const page of pages) {
  expect(count(page, /<h1[\s>]/g)).toBe(1);
  expect(page.match(/<title>(.+?)<\/title>/)).toBeTruthy();
  expect(page).toMatch(/<meta name="description" content=".{50,}"/);
  expect(page).toMatch(/<link rel="canonical" href="https:\/\/www\.goodbizhygiene\.com\//);
  expect(page).toMatch(/<html lang="en"/);
  expect(page).toMatch(/<meta name="robots" content="noindex, nofollow"/); // launchReady false
  for (const block of jsonLdBlocks(page)) expect(() => JSON.parse(block)).not.toThrow();
}
expect(new Set(titles).size).toBe(titles.length);
expect(new Set(descriptions).size).toBe(descriptions.length);
expect(productPages).toHaveLength(27);
expect(read('dist/robots.txt')).toContain('Disallow: /');
expect(read('dist/llms.txt')).toContain('/products/dish-wash-liquid/');
expect(allHtml).not.toMatch(/we manufacture|our factory/i);
// every internal href resolves to a file in dist
```

- [ ] **Step 2:** Implement the three files.
- [ ] **Step 3:** Run `npm run build && npm run test:build && npm run check:placeholders`. Expected: tests pass, and the placeholder check lists contact placeholders and exits 0.
- [ ] **Step 4:** Commit `feat: robots, llms.txt, placeholder guard and build tests`.

---

### Task 8: Visual and performance verification

- [ ] **Step 1:** Add `.claude/launch.json` with a `preview` config (`npm run preview`, port 4321). Open it in the built-in browser.
- [ ] **Step 2:** Screenshot Home, one product page, one category page, a blog post and Contact at desktop (1440) and phone (360 px width). Expected: no horizontal scroll, long names (LABSA, SLES) wrap, hero shows the range, and contrast is readable. Fix any issues following the taste skill's look-and-fix loop.
- [ ] **Step 3:** Test the enquiry form: select 2 products, then check that the WhatsApp and Email buttons produce the correct prefilled URLs (read the `href`s; do not send).
- [ ] **Step 4:** Run Lighthouse (`npx lighthouse http://localhost:4321/ --only-categories=performance,seo,accessibility,best-practices --preset=desktop --quiet --chrome-flags=--headless`) on Home and one product page. Expected: ≥95 in each category (Home mobile performance ≥90 because of the 3D hero). Also confirm in the browser that the 3D hero renders, the fallback shows with reduced motion emulated, and there are no console errors. The SEO score will be capped by noindex; confirm that's the only SEO failure.
- [ ] **Step 5:** Commit `chore: visual and performance fixes`.
- [ ] **Step 6:** Write `README.md`: how to edit `site.ts`, add photos, add a blog post, flip `launchReady`, and deploy to Netlify/Vercel/Cloudflare. Commit.
