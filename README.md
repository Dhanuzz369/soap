# GoodBiz Hygiene website

This is the website for **GoodBiz Hygiene**, a GoodBiz Global company and merchant exporter of soaps, detergents and cleaning products from India. It shows the product range (27 products in 5 categories), explains private label and the export process, publishes buyer guides (the blog), and lets importers send an enquiry by WhatsApp or email.

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
| `npm run check:placeholders` | Lists any `PLACEHOLDER` text still left on the site. |

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
- `exportTerms`: the export terms text shown on product pages and the footer.
- `facts`: optional extras (`city`, `iec`, `founded`, `parentUrl`, `agroUrl`). Only fill these in with **true, checkable** information. Leave them out rather than guess.
- `contactIsPlaceholder`: set this to `false` once the contact details are real.

---

## 3. Add product photos

Until a photo is added, each product shows a clean drawn illustration, so nothing looks broken.

To add a real photo:

1. Make it **square**, ideally **1200 × 1200 pixels**, on a plain light background.
2. Save it in **WebP** format (most image editors can do this, or use <https://squoosh.app>, which is free). Aim for under 150 KB.
3. Name it exactly after the product's **slug** (the list is below) and put it in `public/images/products/`. You may need to create that folder.
   Example: `public/images/products/dish-wash-liquid.webp`
4. Run `npm run build`. The photo replaces the illustration on the product page, the category page and the product cards.

**Product slugs** (file name = slug + `.webp`):

| Category | Slugs |
| --- | --- |
| Bath and Personal Soaps | `toilet-bath-soap`, `herbal-ayurvedic-soap`, `glycerin-transparent-soap`, `antibacterial-soap`, `hotel-guest-soap`, `liquid-hand-wash`, `body-wash-shower-gel` |
| Laundry Care | `laundry-soap-bar`, `detergent-powder`, `liquid-detergent`, `fabric-softener`, `fabric-whitener-stain-remover` |
| Kitchen Care | `dish-wash-liquid`, `dish-wash-bar`, `dish-wash-powder`, `kitchen-degreaser` |
| Surface and Home Cleaners | `floor-cleaner`, `herbal-phenol`, `glass-cleaner`, `toilet-bowl-cleaner`, `bathroom-tile-cleaner`, `multi-surface-cleaner`, `car-wash-shampoo` |
| Industrial and Raw Materials | `soap-noodles`, `labsa`, `sles`, `bulk-institutional-cleaners` |

Only use photos you own or are allowed to use (for example, from your manufacturer with permission).

---

## 4. Edit a product

Each product is one text file in `src/content/products/`, named after its slug (for example `src/content/products/dish-wash-liquid.md`).

The top of the file, between the two `---` lines, holds the facts in a simple `label: value` format:

- `title`, `metaTitle`, `metaDescription`: the name, the browser-tab title and the Google snippet. Keep `metaDescription` between 120 and 160 characters.
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

---

## 5. Add a blog post

Blog posts are text files in `src/content/blog/`. The file name becomes the web address: `src/content/blog/my-new-guide.md` is published at `/blog/my-new-guide/`.

The easiest way is to copy an existing post and change it. The top section needs:

```yaml
---
title: "How to Choose a Liquid Detergent Supplier in India"
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

---

## 6. Launch checklist

Do these in order before the site goes public:

1. **Real contact details** in `src/config/site.ts` (email, phone, WhatsApp, address), and set `contactIsPlaceholder: false`.
2. **Your domain** in `src/config/site.ts`: set `url` to your real address, for example `'https://www.goodbizhygiene.com'` (with `https://`, no slash at the end). Search engines, social previews and the sitemap all use it.
3. **Correct the specifications.** Go through each product file and confirm the `specs`, `packSizes`, `moq` and HSN against your manufacturers' documents. Remove anything you cannot confirm.
4. **Optional:** add product photos (section 3) and any true company `facts`.
5. Run:
   ```bash
   npm run build
   npm run check:placeholders
   ```
   It must say **"No PLACEHOLDER values found."** If it lists anything, fix those lines and run it again.
6. **Flip the switch:** in `src/config/site.ts` change `launchReady: false` to `launchReady: true`. This removes the "do not index" tag, opens `robots.txt` to search engines and creates the sitemap. (`npm run check:placeholders` will refuse to pass if placeholders remain while this is `true`.)
7. Run `npm run build && npm test && npm run test:build`. Everything must pass. Then deploy (section 7).
8. After it is live, add the site to **Google Search Console** and **Bing Webmaster Tools** and submit `https://your-domain/sitemap-index.xml`.

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
| `src/content/categories/` | One file per category |
| `src/content/blog/` | Blog posts |
| `src/pages/` | Page templates (home, about, contact, FAQ, etc.) |
| `src/styles/` | Colours, fonts and layout |
| `public/images/products/` | Product photos (`<slug>.webp`) |
| `public/fonts/` | Self-hosted fonts (Newsreader and Albert Sans, SIL Open Font License) |
| `tests/` | Automatic checks |

The site is built with [Astro](https://astro.build). The home page's 3D product shelf uses Three.js. It loads only after the page has appeared, and it is skipped for visitors who prefer reduced motion or are using data saver.
