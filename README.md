# GoodBiz Hygiene website

This is the website for **GoodBiz Hygiene**, a GoodBiz Global company and merchant exporter of soaps, detergents and cleaning products from India. It shows the product range (23 products in 5 categories), explains private label and the export process, publishes buyer guides (the blog), and lets importers send an enquiry by WhatsApp or email.

The site is "static": it is a folder of ready-made web pages. There is no database, no server and no monthly hosting bill. You edit a few text files, run one command to rebuild, and upload the result.

> **The site is not live yet.** Until you finish the launch checklist below, every page tells search engines "do not index me" (`noindex`). This is deliberate. It stops Google from showing placeholder contact details.

---

## 1. Run it on your computer

You need **Node.js** (version 22.22 or newer; version 24 is recommended) from <https://nodejs.org>. Install the "LTS" version.

Open a terminal in this folder, then:

```bash
npm install        # first time only: downloads the tools the site needs
npm run dev        # starts a local copy at http://localhost:4321
```

Open <http://localhost:4321> in your browser. While `npm run dev` is running, any change you save shows up in the browser straight away. Press `Ctrl + C` in the terminal to stop it.

Other useful commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the finished site into the `dist/` folder (this is what you upload). |
| `npm run preview` | Shows the built `dist/` site at <http://localhost:4321>, exactly as visitors will see it. |
| `npm test` | Runs the automatic checks on the site's logic. |
| `npm run test:build` | Runs checks on the built pages (run `npm run build` first). |
| `npm run check:placeholders` | Lists placeholder contact details still left on the site (`PLACEHOLDER` text, the all-zero WhatsApp number, `contactIsPlaceholder: true`). |
| `npm run i18n:check` | Lists missing, out-of-date (stale) and faulty translations and missing interface text per language. Add `-- --lang fr` for one language, `-- --strict` to fail when anything is missing. |
| `npm run i18n:stamp -- <file>` | Marks a translation as matching the current English (run after translating or updating it). |
| `npm run i18n:sweep -- --lang fr` | With `npm run preview` running: opens every page of a language in Chrome and reports sideways scrolling or console errors. |
| `npm run renders` | Re-draws the glossy studio cut-outs (transparent WebP) of each pack shape, the category groups and the range group (`range-cutout.webp`, used on the Products and Export Process pages) into `public/images/renders/`, plus the neem-leaf cut-out (needs Google Chrome). Run it after changing the 3D pack models in `src/scripts/three/`. Three.js is only used here, never on the live site. |
| `npm run hero:images` | Re-makes the home hero's smaller photo copies and its blurred colour glows in `public/images/hero/`, and the 480px copies of every product photo for the Products page's photo shelf in `public/images/shelf/`. Run it after replacing one of the four hero photos (the list is `FAN_RANGES` in `src/lib/hero-fan.ts`) or after adding or replacing any product photo. |
| `npm run icons` | Re-makes `favicon.ico`, the apple touch icon, the web-app icons and the square `logo-512.png` (used in Google's company data) from the leaf mark. |
| `npm run og:cards` | Re-makes the 1200 × 630 share images in `public/og/`: one per main page and language, and one per product and range from its photo (needs Google Chrome). Run it after changing a page headline or adding a product or category photo. |
| `npm run test:e2e` | Runs the contact form in Chrome (step by step, prefill, sending, fallback, Arabic). Run `npm run build` first; it starts its own preview on port 4329. |
| `npm run indexnow` | After launch: tells Bing, Yandex and other IndexNow search engines about every page (see the go-live checklist). Does nothing before launch. |
| `npm run check:types` | Type-checks the site, including the structured data for search engines (an unknown schema.org property is an error). |
| `npm run vercel:config` | Re-writes `vercel.json` (Vercel's redirects and headers) from `src/config/site.ts`. Run it after changing `url` or `launchReady`, then commit `vercel.json`; `npm test` fails while the two disagree. See section 7. |
| `npm run route:map` | Re-draws the dotted world map behind the Export Process page's hero ("the route") into `src/assets/route-map.svg`, from Natural Earth land data (public domain). Only needed after changing the map window, scale or dot spacing in `src/lib/route-map.ts`; the ports, regions and the sea-lane waypoints of each route live in that file too (a unit test checks that no route crosses a land dot). |

---

## 2. Change contact details and company facts

**All contact details live in one file: `src/config/site.ts`.** Change them there and every page (header, footer, contact page, enquiry form, WhatsApp button) updates.

```ts
contact: {
  email: 'PLACEHOLDER@goodbizhygiene.com',   // your sales email
  phone: '+91 PLACEHOLDER',                  // shown as text, e.g. '+91 98765 43210'
  whatsapp: '910000000000',                  // digits only: country code + number, no + or spaces
  address: 'PLACEHOLDER, India',             // e.g. 'Ahmedabad, Gujarat, India'
},
```

In the same file:

- `url`: your website address (see the launch checklist).
- `exportTerms`: the export terms text shown in the footer, contact, FAQ, export-process and private-label pages. See the note below: some product and blog texts repeat these terms in their own words.
- `facts`: optional extras (`city`, `iec`, `founded`, `parentUrl`, `agroUrl`). Only fill these in with **true, checkable** information. Leave them out rather than guess.
- `contactIsPlaceholder`: a safety switch. It is `true` while the contact details above are dummies; **set it to `false` once real details are in.** While it is `true`, `npm run check:placeholders` will not pass at launch.

**Note on export terms.** Most pages read the terms from `site.ts`, but the product files and buyer guides also mention them inside normal sentences (for example "FOB, CIF and CFR available; payment terms agreed per order (T/T or LC)" and "3–5 weeks after order confirmation"). If you change `incoterms` or `leadTime`, run `npm test`. The check called "export terms repeated in content files" fails and lists every file in `src/content/` that still has the old wording. Edit those sentences, run `npm test` again, and it passes. (It ignores capital letters, the dash style and small words like "are", and for the lead time it only compares the figure, such as "3–5 weeks after order confirmation".)

---

## 3. Add product photos

Until a photo is added, each product shows a studio illustration of its pack type (from `public/images/renders/`), so nothing looks broken.

To add a real photo:

1. Make it **square**, ideally **1200 × 1200 pixels**, on a plain light background.
2. Save it in **WebP** format (most image editors can do this, or use <https://squoosh.app>, which is free). Aim for under 150 KB.
3. Name it exactly after the product's **slug** (the list is below) and put it in `public/images/products/`. You may need to create that folder.
   Example: `public/images/products/dish-wash-liquid.webp`
4. Run `npm run hero:images` (makes the small copy for the Products page shelf), then `npm run build`. The photo replaces the illustration on the product page, the category page and the product cards, it joins the photo shelf at the top of the Products page, and it becomes the product's image in social-media previews and in the data Google reads.

**Product slugs** (file name = slug + `.webp`):

| Category | Slugs |
| --- | --- |
| Bath and Personal Soaps | `toilet-bath-soap`, `herbal-ayurvedic-soap`, `glycerin-transparent-soap`, `antibacterial-soap`, `hotel-guest-soap`, `liquid-hand-wash`, `body-wash-shower-gel` |
| Laundry Care | `laundry-soap-bar`, `detergent-powder`, `liquid-detergent`, `fabric-softener` |
| Kitchen Care | `dish-wash-liquid`, `dish-wash-bar` |
| Surface and Home Cleaners | `floor-cleaner`, `herbal-phenol`, `glass-cleaner`, `toilet-bowl-cleaner`, `bathroom-tile-cleaner`, `multi-surface-cleaner` |
| Industrial and Raw Materials | `soap-noodles`, `labsa`, `sles`, `bulk-institutional-cleaners` |

Only use photos you own or are allowed to use (for example, from your manufacturer with permission).

---

## 4. Edit a product

Each product is one text file in `src/content/products/`, named after its slug (for example `src/content/products/dish-wash-liquid.md`).

The top of the file, between the two `---` lines, holds the facts in a simple `label: value` format:

- `title`, `metaTitle`, `metaDescription`: the name, the browser-tab title and the Google snippet. Keep `metaTitle` to about 60 characters (" | GoodBiz Hygiene" is added automatically) and `metaDescription` between 120 and 160 characters: say what the product is, one or two facts, and what the buyer gets (private label, mixed containers, FOB/CIF).
- `keyword`: the main search term buyers type for this product, for example `"dish wash liquid"`. It feeds the page's search keywords, headings and image text. See `docs/seo-keywords.md`.
- `answer`: the short summary under the heading.
- `variants`, `packSizes`, `packaging`: lists, one item per line starting with `- `.
- `specs`: the specification table. **These are drafted "typical" values.** Check each one against your manufacturer's real specification sheet before launch.
- `moq`, `privateLabel`, `faqs`, `related` (slugs of related products).

Below the second `---` is the longer description, written as normal paragraphs. Lines starting with `## ` become headings.

Tips:
- Keep the quotation marks around text values, and keep the indentation as it is.
- Do not claim GoodBiz manufactures the products. Do not add certifications, awards, client names or numbers you cannot prove.
- If something is wrong after editing, `npm run build` stops and names the file and the field to fix.

To **add a new product**, copy an existing file in the same category, give it a new file name and `slug`, and change the content. The category is set with `category:` (one of `bath-personal-soaps`, `laundry-care`, `kitchen-care`, `surface-home-cleaners`, `industrial-raw-materials`).

Adding products is safe: the automatic checks find every file in `src/content/products/` and apply the same rules to the new one. They check that the file name matches the `slug`, the HSN code looks like `3402 50`, `metaDescription` is 120 to 160 characters, there are 4 to 6 FAQs, every slug in `related` exists, the description is at least 350 words, and the text does not claim GoodBiz manufactures anything. Rewrite the copied text in your own words: the checks also fail if the same long sentence appears in more than 3 product files, or two products share a `metaDescription` or `answer`. The new product appears on its category page, in the product list and in `llms.txt` automatically.

---

## 5. Add a blog post

Blog posts are text files in `src/content/blog/`. The file name becomes the web address: `src/content/blog/my-new-guide.md` is published at `/blog/my-new-guide/`.

The easiest way is to copy an existing post and change it. The top section needs:

```yaml
---
title: "How to Choose a Liquid Detergent Supplier in India"
metaTitle: "Choosing a Liquid Detergent Supplier in India"            # optional: a shorter title for Google (about 60 characters)
description: "A 120 to 160 character summary that appears on Google and on the blog list page, written for an importer deciding what to buy."
date: 2026-11-02
tags: ["liquid detergent", "sourcing"]
relatedProducts: ["liquid-detergent", "detergent-powder"]   # at least 2 product slugs
faqs:                                                         # optional
  - q: "A question buyers ask?"
    a: "A short, direct answer."
---
```

Then write the article underneath in plain paragraphs. Use `## ` for headings, `- ` for bullet points, and `[link text](/products/liquid-detergent/)` for links to your own pages. Run `npm run build` to check it, and `npm run preview` to read it on the page.

Adding posts is safe too. The checks look at every file in `src/content/blog/` and ask for: at least 600 words, a 120 to 160 character `description` that no other post uses, at least 2 `relatedProducts` that exist, and at least 2 links to product pages that exist. Each product named in `relatedProducts` automatically lists the post under "Buyer guides for this product" on its page.

---

## 5b. Languages

The site is published in 12 languages: English at `/`, and Arabic, French, Spanish, Portuguese, Russian, Simplified Chinese, German, Turkish, Indonesian, Swahili and Vietnamese at `/ar/`, `/fr/`, `/es/` … with the same page addresses after the prefix. A language menu sits in the bottom corner of every page, and a first-time visitor on an English page is sent to their browser's language if the site has it.

- **All 11 languages are fully translated** (`npm run i18n:check -- --strict` passes). If a translation goes missing or out of date, that page shows English text until it is fixed.
- **Translators follow `docs/i18n-translator-guide.md`.** Interface text is in `src/i18n/ui/<language>.ts`; product, category and blog translations are in `src/content/i18n/<language>/`.
- **When you edit an English product, category or post,** run `npm run i18n:check`: it lists the translations that are now out of date. Send those to the translator.
- **Export terms** in `src/config/site.ts` are English. Each language repeats them in `terms` in its interface file; update those too when you change the terms.

---

## 5b2. Enquiry form (contact page)

The contact page asks one small thing per screen, mostly by tapping: (1) name and email or WhatsApp, (2) the product range, as five photo cards or "Something else", (3) the product, (4) roughly how much, (5) the country and port, (6) the shipping terms ("Not sure, advise me" first, then FOB, CFR and CIF), and (7) notes, own brand or not, a summary with "Edit" links, and **Send enquiry**. A tap moves to the next step by itself; Back and "Skip this step" are always there. Links from product pages, the HoReCa list and the private-label page (`?product=…&message=…`) skip the steps they already answer.

**Where leads go.** Every step is saved, as it is answered, to one row per visitor in a Google Sheet, so a buyer who stops after step 1 is still a lead with a name and a way to reply. You get an email when someone finishes step 1 and again when they press Send. Setting up the sheet takes ten minutes: `docs/enquiry-sheet-setup.md` (the script is `scripts/apps-script/enquiry.gs`, the address goes in `enquiry.endpoint` in `src/config/site.ts`).

**Until the sheet is set up, or if sending fails,** nothing is lost: the form ends with "Send via WhatsApp" and "Send via Email" buttons with the whole enquiry already written in, and from step 2 a line offers to send it on WhatsApp straight away. Without JavaScript the form shows every step on one page and posts to the sheet (or opens the visitor's email app before launch).

The form's text is `steps` in `src/i18n/ui/<language>.ts`; what the team receives is always English, plus the visitor's language. The logic is in `src/lib/enquiry-steps.ts` and `src/lib/enquiry-send.ts`, the browser part in `src/scripts/step-enquiry.ts`. `npm run test:e2e` runs the form in Chrome (after `npm run build`).

---

## 5c. Registrations ("Registered exporter" strip)

The footer, the About page, the Export Process page and the HoReCa page show the company's four export registrations: **FIEO** (member), **MSME / Udyam** (registered), **CHEMEXCIL** (RCMC holder) and **DGFT** (IEC holder). The list, each body's full name and official website are `registrations` in `src/config/site.ts`; `showRegistrations: false` hides the strip everywhere (and the matching lines in `llms.txt` and the structured data). The status lines ("Member exporter", "RCMC holder"…) are in each language file under `registrations`.

**No registration numbers are shown, in the pages, the structured data or `llms.txt`.** Do not add any. Buyers get the details on request.

**To add the official logos**, save the files at exactly these names in `public/images/registrations/` (create the folder), then run `npm run build`:

| File | Body |
| --- | --- |
| `fieo.svg` | FIEO |
| `msme.svg` (or `msme.png`) | MSME / Udyam |
| `chemexcil.svg` | CHEMEXCIL |

SVG is preferred (sharp at any size, tiny). A PNG is fine if that is all you have (at least 3 times the display height: 168px tall or more). Use the files the councils provide to their members, and follow each council's logo-use rules. A logo is used only when its file exists at build time; until then the page shows a tidy text badge (the short name with its status line), so nothing looks missing. In the footer the logos are tinted to a single light colour on the dark field, so a logo with a white background should be supplied with a transparent one.

**DGFT stays a text badge, always.** The DGFT mark carries the State Emblem of India, and the State Emblem of India (Prohibition of Improper Use) Act, 2005 restricts private use of the emblem. So `logoAllowed` is `false` for DGFT, no DGFT image is ever rendered (a build test fails if one appears), and the emblem must not be drawn or included anywhere on the site.

---

## 6. Go-live checklist

Do these **in order**. Steps 1-5 happen before anyone can find the site; steps 6-13 after it is live.

**Be realistic about results.** Nobody can guarantee a first-place ranking on Google, Bing or in AI answers, and anyone who promises it is not being honest. What this site does is pull every lever that is in your hands: fast pages, clean structure, structured data, 12 languages, keyword-led titles, and text that search engines and AI assistants can quote. The rest comes from time, real enquiries, other sites linking to you, and new buyer guides. Expect the first impressions in Search Console within a few weeks and steady rankings over 3 to 6 months.

### Before launch

1. **Fill in `src/config/site.ts`:**
   - `contact`: real email, phone, WhatsApp (digits only, with country code) and address; then set `contactIsPlaceholder: false`.
   - `url`: your real domain, for example `'https://www.goodbizhygiene.com'` (with `https://`, no slash at the end). Canonical links, hreflang, share images, the sitemap, `llms.txt` and IndexNow all use it.
   - `facts`: only true, checkable facts (`city`, `iec`, `founded`, `parentUrl`, `agroUrl`). Leave out anything you cannot prove.
   - `profiles`: the full `https://` addresses of company profiles you own (LinkedIn, IndiaMART, TradeIndia, Alibaba…). Add them as you create them (step 11). They tell Google and AI assistants these profiles are the same company.
   - `enquiry.endpoint`: the address of your enquiry Google Sheet (the Apps Script web app URL ending in `/exec`). Follow `docs/enquiry-sheet-setup.md`. Until it is set, the contact form cannot save leads to the sheet and offers WhatsApp and email instead.
   - **Privacy page.** The enquiry form promises one thing: "We use these details only to reply to your enquiry. Nothing is shared or added to a mailing list." Keep that true, and add a full privacy page (who you are, what the form collects, where it is stored, how to ask for deletion) before launch.
2. **Correct the specifications.** Go through each product file and confirm `specs`, `packSizes`, `moq` and the HSN code against your manufacturers' documents. Remove anything you cannot confirm.
   **Confirm "How we vet manufacturers and check orders"** (About page, `about.vetSteps` in `src/i18n/ui/en.ts` and the 11 language files). It lists only checks the site already describes elsewhere: specification agreed first, samples and artwork approved before production, a check against your approved sample before loading, documents with every shipment, and pre-shipment photos and a loading plan on request. Remove any step you do not actually take, and add the ones you do (for example licence checks, factory visits or third-party inspection) only when they really happen, in all 12 languages.
3. **Set `launchReady: true`** in `src/config/site.ts`. This removes the "do not index" tag, opens `robots.txt` to search engines and AI crawlers, and creates the sitemap, but only in a **production** build (see "Vercel: previews and the vercel.app address" in section 7). Then run `npm run vercel:config` and commit the new `vercel.json`: it adds the redirect from the `*.vercel.app` address to your domain.
4. **Run every check.** All must pass:
   ```bash
   npm run build && npm test && npm run test:build && npm run check:placeholders && npm run i18n:check -- --strict
   ```
   `check:placeholders` must say **"No PLACEHOLDER values found."**
5. **Deploy** (section 7). Then open these on the live domain and check they load: `/robots.txt` (says `Allow: /`), `/sitemap-index.xml`, `/llms.txt`, `/llms-full.txt`, and `/1ea134f5e8470b6f56bd1766bc62c1b1.txt` (the IndexNow key, `indexNowKey` in `site.ts`).

### After launch

6. **Google Search Console** (<https://search.google.com/search-console>): add the site. The easiest proof of ownership is the "HTML tag" method: copy only the `content="…"` value into `verification.google` in `site.ts`, rebuild, deploy, then click Verify. (A "Domain" property verified through your DNS provider works too and needs no tag.) Then open **Sitemaps** and submit `sitemap-index.xml`.
7. **Bing Webmaster Tools** (<https://www.bing.com/webmasters>): sign in and choose "Import from Google Search Console" (fastest), or verify with the meta tag (`verification.bing`). Submit `https://your-domain/sitemap-index.xml`. Bing also feeds ChatGPT search, Copilot and DuckDuckGo. Optional for Russian and Central Asian buyers: **Yandex Webmaster** (`verification.yandex`).
8. **Ping IndexNow:** `npm run build` then `npm run indexnow`. It tells Bing, Yandex, Seznam and Naver about every page at once. Run it again after each deploy that adds or changes pages. (It refuses to send anything until the site is launched and the live domain serves the key file.)
9. **Request indexing of the key pages** in Search Console (URL Inspection → "Request indexing"), one by one: the home page, `/products/`, the five range pages, your most important products (for example dish wash liquid, detergent powder, toilet soap, soap noodles, LABSA), `/private-label/`, `/export-process/`, and the home pages of the languages you sell into most (`/ar/`, `/fr/`, `/es/` …).
10. **Google Business Profile** (<https://business.google.com>): only if you have a real address that can receive Google's verification. Use exactly the same company name, address and phone as on the site. Without a walk-in office, set it up as a service-area business, or skip it.
11. **Get the first links from other sites.** These matter more than anything else on this list:
    - The GoodBiz Global and GoodBiz Agro websites: link to GoodBiz Hygiene from their home or "Our companies" pages, and put their addresses in `facts.parentUrl` and `facts.agroUrl`.
    - B2B directories where importers search: IndiaMART, TradeIndia, ExportersIndia, Alibaba, go4WorldBusiness, Tradekey. Use the same name, description ("merchant exporter of soaps and home-care products from India") and contact details everywhere, link to the site, and add each profile URL to `profiles` in `site.ts`.
    - Chamber of commerce and export council listings you are a member of (for example your local chamber, FIEO, or the export promotion council for your products).
    - A LinkedIn company page, then share each new buyer guide there.
12. **Monitor** in Search Console every week for the first month, then monthly: **Page indexing** (fix anything "Not indexed" that should be), **Core Web Vitals** (field data appears once there is traffic; the lab scores at launch were 96-100 on mobile), **Enhancements** (structured data warnings), and **Performance → Queries** (which searches bring visitors). Do the same in Bing Webmaster Tools.
13. **Keep publishing.** One new buyer guide a month (section 5), aimed at a question importers really ask, does more for rankings and AI answers than any tag. Every quarter, compare the queries in Search Console with `docs/seo-keywords.md` and adjust product `keyword`s and titles.

What is already built in, and how it was checked, is in `docs/seo-launch-audit.md`; the keyword plan for every product and language is in `docs/seo-keywords.md`.

---

## 7. Deploy for free

All three services below host static sites like this one for free and give you HTTPS. Pick one. The easiest route is to put this folder in a **GitHub** repository first (free at <https://github.com>). The host then rebuilds the site automatically every time you change a file.

Settings to enter on any of them:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output / publish directory | `dist` |
| Node version | 24 (set the environment variable `NODE_VERSION` to `24` if asked) |

**Netlify** (<https://www.netlify.com>)
1. Sign up, then "Add new site" > "Import an existing project" > choose your GitHub repository.
2. Enter the build command and publish directory above, then "Deploy".
3. No GitHub? Run `npm run build` on your computer and drag the `dist` folder onto <https://app.netlify.com/drop>.

**Vercel** (<https://vercel.com>)
1. Sign up with GitHub, then "Add New" > "Project" > import the repository.
2. Vercel detects Astro automatically. Check that the output directory is `dist`, then "Deploy".

**Vercel: previews and the vercel.app address.** The site is set up for Vercel by `vercel.json` (written by `npm run vercel:config` from `src/config/site.ts`; do not edit it by hand):

- **Search engines only see the production build.** A page is indexable only when `launchReady` is `true` **and** the build is Vercel's production build (`VERCEL_ENV=production`). Every preview deployment (each branch and pull request) is built with "do not index" on every page and a `robots.txt` that says `Disallow: /`, whatever `launchReady` says. A build on your own computer counts as production, so `npm run build` shows exactly what the live site will be. The rule is in `src/lib/deploy.ts`.
- **Every `*.vercel.app` address always sends `X-Robots-Tag: noindex, nofollow`.** That covers preview links and the project's own address (for example `soap-gules.vercel.app`), so they never compete with your domain in Google.
- **After launch, the `*.vercel.app` addresses redirect to your domain.** Once `launchReady` is `true` and `url` is your real domain, `vercel.json` sends every `*.vercel.app` request to the same page on your domain with a permanent (308) redirect. Preview links on `*.vercel.app` then open the live site too, so check unpublished changes on your own computer with `npm run build && npm run preview`.
- **One address per page.** `trailingSlash: true` sends `/products` to `/products/` (308), the address used in canonical links and the sitemap. Files such as `/robots.txt` and `/llms.txt` are not affected.
- **Security and caching headers** for every page (no framing by other sites, no MIME sniffing, a strict referrer policy, camera, microphone and location switched off) and long caching for `/fonts/` (one year) and `/images/` (one week).

If you host somewhere other than Vercel, `vercel.json` is ignored: set the same redirects and headers in that host's settings.

**Cloudflare Pages** (<https://pages.cloudflare.com>)
1. Sign up, go to "Workers & Pages" > "Create" > "Pages" > "Connect to Git", and pick the repository.
2. Framework preset: **Astro**. Build command `npm run build`, output directory `dist`. Then "Save and Deploy".

**Connect your domain:** each host has a "Domains" (or "Custom domains") page. Add your domain there and follow the instructions to update the DNS records at the company where you bought the domain. Make sure the address matches the `url` in `src/config/site.ts`.

---

## Where things are (for whoever maintains the site)

| Path | What it is |
| --- | --- |
| `src/config/site.ts` | Contact details, export terms, launch switch |
| `src/content/products/` | One file per product |
| `src/content/categories/` | One file per category (`summary` is the line under the title; `metaDescription` is the Google snippet) |
| `src/content/blog/` | Blog posts |
| `src/content/i18n/<language>/` | Translations of products, categories and posts |
| `src/i18n/` | Languages, interface text per language (`ui/`), language detection |
| `src/views/` | The page templates (every language uses the same ones) |
| `src/pages/` | Page addresses (each one shows a template from `src/views/`) |
| `src/components/StepEnquiry.astro`, `src/scripts/step-enquiry.ts`, `src/lib/enquiry-*.ts` | The step-by-step enquiry form; `scripts/apps-script/enquiry.gs` is its Google Sheet backend (`docs/enquiry-sheet-setup.md`) |
| `src/components/Registrations.astro`, `src/lib/registrations.ts` | The "Registered exporter" strip (config in `site.ts`, logos in `public/images/registrations/`) |
| `src/styles/` | Colours, fonts and layout |
| `public/images/products/` | Product photos (`<slug>.webp`) |
| `public/fonts/` | Self-hosted fonts (Geist with Latin, Cyrillic and Vietnamese subsets, Newsreader italic for accents, IBM Plex Sans Arabic for Arabic pages; SIL Open Font License) |
| `src/lib/seo.ts`, `src/lib/llms.ts`, `src/lib/robots.ts` | Search data: titles, keywords, structured data, `llms.txt`, `robots.txt` |
| `public/og/` | Share images for social media and chat apps (`npm run og:cards`) |
| `docs/seo-launch-audit.md`, `docs/seo-keywords.md` | What was checked for search and AI answers, and the keyword plan |
| `tests/` | Automatic checks |

The site is built with [Astro](https://astro.build). The home page hero is "the fan": four real product photos, one per main range (bath soaps, laundry, kitchen, surface cleaners), held like a hand of cards beside the headline. They deal out on load, shuffle every 5 seconds on larger screens (paused while a visitor points at, tabs into or scrolls past them), and the small dots below pick a range; on phones a sideways swipe changes the card. Without JavaScript, or with reduced motion, the fan simply sits still and every card is a link to its range.

**To change a hero photo or the range it shows:** edit `FAN_RANGES` in `src/lib/hero-fan.ts` (the range, the photo in `public/images/products/` and how the photo is framed in its tall card, `pos`), then run `npm run hero:images`. Range names and product counts come from the category pages, in every language.

The Products page hero is "the shelf": two rows of every product that has its own photo, gliding slowly in opposite directions (`src/components/ProductsHero.astro`, styles in `src/styles/shelf.css`). It pauses when a visitor points at a row, tabs into it, presses the pause button or scrolls past it; with reduced motion each row is a still strip that scrolls sideways. Products without a photo are left off it, and the counts in its headline come from the product files.

The page for hotels, restaurants and cafés (`/horeca/`) is "the floor plan": a drawn cross-section of a hotel with six spaces (guest rooms, kitchen, washrooms, floors, laundry, back-of-house). Pointing at or tapping a space shows its products; below, each space lists its products with the larger catering and housekeeping packs and an "Add to my list" box, and the "My HoReCa list" panel (a bottom sheet on phones) sends the ticked products and the property type to the contact form. **To change which products a space shows, or which pack sizes:** edit `SPACES` in `src/lib/horeca.ts` (pack sizes are positions in the product's `packSizes` list); `npm test` checks that each product's own file supports the space. The share image is `public/og/horeca.jpg` (`npm run og:cards -- --only horeca`); the 96px thumbnails in the hotel drawing's cards come from `npm run hero:images`.
