# Translator guide: adding a language to the GoodBiz Hygiene website

Follow this guide step by step. French (`fr`) is complete and is the worked example: when in doubt, open the French file next to the English one and do the same.

The site already serves every page in every language. A page with no translation shows English text inside that language's menus and buttons. Your job is to replace that English with your language, one file at a time.

---

## 1. Your language code

| Language | Code (folder and file names) | Notes |
|---|---|---|
| Arabic | `ar` | Right-to-left. The layout already mirrors. |
| Spanish | `es` | |
| Portuguese | `pt` | Write Brazilian Portuguese (`pt-BR` buyers are the main audience) but avoid slang. |
| Russian | `ru` | |
| Simplified Chinese | `zh` | Simplified characters only. The HTML language tag is `zh-Hans`; the folder is still `zh`. |
| German | `de` | Nouns are capitalised: use `{name}` instead of `{nameLower}` (section 4). |
| Turkish | `tr` | |
| Indonesian | `id` | |
| Swahili | `sw` | |
| Vietnamese | `vi` | |

Below, `<lang>` means your code, for example `de`.

---

## 2. The exact files you create or edit

Do all of these. Nothing else needs to change.

### 2.1 The interface strings (1 file, edit)

`src/i18n/ui/<lang>.ts` already exists and is empty. Fill it in.

1. Open `src/i18n/ui/fr.ts` and copy everything from `const fr: UiPartial = {` down to the closing `};`.
2. Paste it into `src/i18n/ui/<lang>.ts`, replacing `const <lang>: UiPartial = {};`. Rename `const fr` to `const <lang>` (for example `const de`). Keep `export default <lang>;` at the bottom and keep the `export const sourceHash = '';` line.
3. Translate every string **from the English source `src/i18n/ui/en.ts`**, not from the French. Use French only to see the structure.
4. Do not rename, add or remove keys. Arrays (lists in `[ ]`) must keep exactly the same number of items in the same order.

### 2.2 The content (36 files, create)

Create these folders:

```
src/content/i18n/<lang>/products/
src/content/i18n/<lang>/categories/
src/content/i18n/<lang>/blog/
```

Then, for every English file, create a file with **the same file name**:

| English source | Your file |
|---|---|
| `src/content/products/<slug>.md` (23 files) | `src/content/i18n/<lang>/products/<slug>.md` |
| `src/content/categories/<slug>.md` (5 files) | `src/content/i18n/<lang>/categories/<slug>.md` |
| `src/content/blog/<slug>.md` (8 files) | `src/content/i18n/<lang>/blog/<slug>.md` |

The easiest way: copy the English file into your folder, then translate it in place. Never rename a file. `npm run i18n:check -- --lang <lang>` lists every file still missing.

### 2.3 The honesty phrases (1 file, edit)

In `src/i18n/honesty.ts`, fill your language's list in `FORBIDDEN_CLAIMS` with regular expressions for first-person manufacturing claims in your language: "we manufacture", "we produce", "our factory", "our factories", "our plant". Copy the style of the `fr` list. Match only claims the company makes about itself. A question such as "Does GoodBiz Hygiene manufacture…?" must not match, because it appears in the FAQ.

---

## 3. Rules for content files (`.md`)

Each file has a header between two `---` lines (the frontmatter) and a body below it.

### 3.1 Keep EXACTLY as in English (do not translate, do not change)

- `slug`, `category`, `order`, `hsn`, `hsnRange`, `related`, `relatedProducts`, `image`, `date`, `updated`
- every `src:` inside `gallery`
- `privateLabel: available: true/false`
- the field names themselves (`title:`, `faqs:`, `- q:`, `a:`, `label:`, `value:` …)
- all numbers, units and codes: `3402 50`, `500 ml`, `5 L`, `20 ft`, `pH`, `cP`, `%`, `TFM`, `LABSA`, `SLES`, `PKO`, `COA`, `MSDS`, `ITC-HS`, `HSN`, `IBC`, `T/T`, `LC`
- the names **GoodBiz Hygiene**, **GoodBiz Global**, **GoodBiz Agro**

(If you change a fixed field by mistake, the site ignores your value and uses English, and the checks report it.)

### 3.2 Translate

`title`, `metaTitle`, `metaDescription`, `answer`, `hsnNote`, every item of `variants`, `packSizes` (unit words only, such as "can", "drum", "multipack"; keep the numbers and units), `packaging`, `specs` (both `label` and `value`), `moq`, `privateLabel` `options`, `containerLoad` (`ft20` and `ft40` text; keep the numbers), `uses`, `markets`, every `faqs` question and answer, `gallery` `alt` and `caption`, category `title`, `summary`, `intro`, blog `title`, `description`, `tags`, and the whole body.

Keep the same number of `specs` and `faqs` items as the English file, in the same order.

### 3.3 Length targets

- `metaDescription` (products) and `description` (blog): **120 to 160 characters**. The tests fail below 70 or above 170.
- `metaTitle`: keep `| GoodBiz Hygiene` at the end. The English pattern is "<Product> Exporter & Supplier from India | GoodBiz Hygiene"; use your language's translation of `common.exporterLine` from your UI file.

### 3.4 Links in the body

Write links with the **English path**, exactly as in the English file:

```
[detergent powder](/products/detergent-powder/)
```

Do **not** add your language prefix (`/<lang>/products/…`). The site adds it automatically when it builds, so visitors stay in your language. Only translate the link text in `[ ]`.

### 3.5 Headings and lists

Keep `## ` and `### ` headings, `- ` bullets, `1. ` numbered lists and `| … |` tables with the same structure. Translate the text inside them.

### 3.6 The export terms

Product and blog bodies repeat the export terms. Use **exactly** the wording of your UI file's `terms` section every time:

- `terms.incoterms`: in French "FOB, CIF et CFR disponibles ; conditions de paiement convenues à chaque commande (T/T ou LC)". Keep `FOB, CIF` and `CFR`, `T/T`, `LC` untranslated.
- `terms.leadTime`: in French "Généralement 3 à 5 semaines après confirmation de la commande, selon les exigences de marque de distributeur". In bodies, write the figure part identically ("3 à 5 semaines après confirmation de la commande").

The tests check this, so that changing the terms later finds every file to update.

### 3.7 YAML safety

- Keep every text value in double quotes `"…"`.
- Inside a value, never use a straight double quote `"`. Use your language's quotation marks (« », „ “, 「」…) or typographic apostrophes `’`.
- Keep the indentation exactly as in the English file (two spaces).

---

## 4. Rules for the interface file (`src/i18n/ui/<lang>.ts`)

- Keep the single quotes around each string: `'…'`. If your text needs an apostrophe, use the typographic one `’`, never `'`.
- Keep every `{placeholder}` that appears in the English string. You may move it inside the sentence. The common ones:
  - `{n}` a number; `{year}` the year; `{minutes}` "5 min read"; `{date}` a date
  - `{name}` a product or category name as written; `{nameLower}` the same name in lower case. If your language capitalises nouns (German) or has no case (Arabic, Chinese), use `{name}` instead of `{nameLower}`.
  - `{parent}` "GoodBiz Global"; `{port}`, `{leadTime}`, `{incoterms}` the export terms; `{creator}`, `{license}` photo credit; `{hsn}` a code
- `terms`: translate the meaning exactly, as legal-style text. These four strings appear on the footer, contact, FAQ and export pages.
- `form.quantities`: translate the labels only. The values sent to GoodBiz stay English automatically.
- `lang.label`, `lang.menuAria`, `lang.more`: the language menu.
- Numbers like "{n} products": write a form that reads correctly for any number from 2 to 30 (Arabic and Russian plural forms: prefer a structure such as "Products: {n}" if one form cannot cover all).
- `faqs`, `exportProcess.faqs`, `privateLabel.faqs`: the answer "No. GoodBiz Hygiene is a merchant exporter…" must stay a clear "no".

---

## 5. Tone and wording

- Audience: professional importers, distributors and wholesalers. Write natural, clear business language, as a trade magazine in your country would. No machine-literal phrasing, no marketing superlatives, no slang.
- Address the reader politely (formal "you": vous, Sie, usted, вы, Anda, quý khách/bạn as appropriate).
- **Honesty rule.** GoodBiz Hygiene is a **merchant exporter**: it sources from vetted Indian manufacturers and does not own factories. Never write "we manufacture", "our factory", "we produce". Do not add certifications, awards, client names, statistics or claims that are not in the English.
- Specifications are **typical** values. Keep words such as "typical", "approx.", "confirmed per order".
- Do not translate or invent prices.

### Glossary of fixed terms

| English | Rule | French (reference) |
|---|---|---|
| GoodBiz Hygiene, GoodBiz Global, GoodBiz Agro | never translated | unchanged |
| merchant exporter | the trade term for an exporter that buys and resells, not a manufacturer | exportateur négociant |
| vetted Indian manufacturers | "manufacturers we have checked" | fabricants indiens contrôlés |
| private label | the local trade term for selling under the buyer's brand | marque de distributeur |
| Exporter & Supplier from India | used in titles and the italic line | Exportateur et fournisseur depuis l’Inde |
| HSN code, ITC-HS | keep the letters; you may add a gloss | code HSN, code ITC-HS |
| FOB, CIF, CFR, Incoterms | never translated | unchanged |
| T/T, LC | keep the letters | T/T, LC |
| COA, MSDS / SDS | keep the letters; first mention may add your local name | COA, FDS (MSDS) |
| TFM (Total Fatty Matter) | keep TFM; explain once | TFM (matières grasses totales) |
| LABSA, SLES, PKO | never translated | unchanged |
| 20 ft / 40 ft container | local container wording | conteneur 20 / 40 pieds |
| bill of lading, packing list, certificate of origin, commercial invoice | the official trade terms in your language | connaissement, liste de colisage, certificat d’origine, facture commerciale |
| quotation | the business word for a price offer | devis |
| MOQ | keep "MOQ" or the local term | MOQ / quantité minimale de commande |

Product names: translate them descriptively, the way a buyer in your country would search for the product, and keep them consistent everywhere (the product `title`, the blog bodies, the FAQ). Record your choice in this table in your pull request. French choices:

| Slug | French title |
|---|---|
| toilet-bath-soap | Savon de toilette / savon de bain |
| herbal-ayurvedic-soap | Savon aux plantes et ayurvédique |
| glycerin-transparent-soap | Savon à la glycérine / savon transparent |
| antibacterial-soap | Savon antibactérien / traitant |
| hotel-guest-soap | Savons d’hôtel et d’accueil (mini-savons) |
| liquid-hand-wash | Savon liquide pour les mains |
| body-wash-shower-gel | Gel douche / nettoyant corps |
| laundry-soap-bar | Savon de lessive / pain détergent |
| detergent-powder | Lessive en poudre |
| liquid-detergent | Lessive liquide |
| fabric-softener | Adoucissant / assouplissant textile |
| dish-wash-liquid | Liquide vaisselle / gel vaisselle |
| dish-wash-bar | Pain vaisselle solide |
| floor-cleaner | Nettoyant sols |
| herbal-phenol | Phénol aux plantes / phényl |
| glass-cleaner | Nettoyant vitres |
| toilet-bowl-cleaner | Nettoyant WC |
| bathroom-tile-cleaner | Nettoyant salle de bain et carrelage |
| multi-surface-cleaner | Nettoyant multi-surfaces |
| soap-noodles | Noodles de savon (base savon) |
| labsa | LABSA (acide alkylbenzène sulfonique linéaire) |
| sles | SLES (lauryl éther sulfate de sodium) |
| bulk-institutional-cleaners | Produits d’entretien en vrac et pour collectivités |
| Categories | Savons et hygiène corporelle · Entretien du linge · Vaisselle et cuisine · Nettoyants surfaces et maison · Matières premières et produits industriels |

### Typography

Use your language's own punctuation and spacing: French puts a non-breaking space before `: ; ? ! %` and inside « »; German uses „…“; Chinese uses full-width punctuation (，。：；？！); Arabic uses ، ؛ ؟ and Western digits (keep numbers as `0-9`, as in English, because codes and specifications must match documents).

---

## 6. Run the checks

From the project folder (first time: `npm install`).

1. **What is missing or wrong in my language:**
   ```bash
   npm run i18n:check -- --lang <lang>
   ```
   It lists missing files, stale files, field problems and missing interface keys. Add `--verbose` to see every line. It always exits successfully while work is in progress.
2. **Stamp what you finished.** After translating or updating a file, record which English version it was made from:
   ```bash
   npm run i18n:stamp -- src/content/i18n/<lang>/products/labsa.md
   npm run i18n:stamp -- src/i18n/ui/<lang>.ts
   npm run i18n:stamp -- --lang <lang>     # everything in your language at once (only when ALL of it is checked)
   ```
   Later, when someone edits the English, `i18n:check` marks your file as **stale**. Update the translation to match the new English, then stamp it again.
3. **Build and test:**
   ```bash
   npm run build && npm test && npm run test:build && npm run check:placeholders
   ```
   All must pass. The tests check every translation file you created (fixed fields, counts, links, export terms, honesty) and every built page in your language (language tag, hreflang, canonical, one h1, JSON-LD, links stay in your language).
4. **Look at it:** `npm run preview`, then open `http://localhost:4321/<lang>/`. Check the home page, a product, a blog post and the contact form on a phone-size window.
5. **Sideways scroll and errors** (long words can overflow on phones):
   ```bash
   npm run preview          # in one terminal
   npm run i18n:sweep -- --lang <lang>    # in another (needs Google Chrome)
   ```
   It must say "No sideways scroll and no console errors." If a heading overflows, use a shorter wording for that string.
6. **Strict check when you are done:**
   ```bash
   npm run i18n:check -- --lang <lang> --strict
   ```
   It must end with "All translations complete and current."

---

## 7. Per-language checklist

Copy this into your pull request and tick every line.

- [ ] `src/i18n/ui/<lang>.ts`: every key translated from `en.ts`; placeholders kept; arrays same length; `const <lang>` and `export default <lang>` correct
- [ ] `terms` translated precisely; FOB, CIF, CFR, T/T, LC untouched
- [ ] 23 files in `src/content/i18n/<lang>/products/`
- [ ] 5 files in `src/content/i18n/<lang>/categories/`
- [ ] 8 files in `src/content/i18n/<lang>/blog/`
- [ ] Fixed fields unchanged (slug, category, order, hsn, related, image, gallery src, dates, relatedProducts, hsnRange)
- [ ] Links in bodies use English paths, no language prefix
- [ ] Export terms in bodies use exactly the `terms` wording
- [ ] Product names consistent with your glossary table everywhere
- [ ] No "we manufacture / our factory / we produce" in any form; your phrases added to `src/i18n/honesty.ts`
- [ ] `metaDescription` / `description` 120 to 160 characters
- [ ] All files stamped (`npm run i18n:stamp`)
- [ ] `npm run i18n:check -- --lang <lang> --strict` passes
- [ ] `npm run build && npm test && npm run test:build && npm run check:placeholders` passes
- [ ] `npm run i18n:sweep -- --lang <lang>` passes
- [ ] Home, a product, a blog post and contact checked by eye at phone width
- [ ] Arabic only: page reads right to left; numbers and codes still read correctly

---

## 8. How it works (for reference)

- Languages are listed in `src/i18n/locales.ts`. English is served at `/`, every other language at `/<lang>/` with the same English slugs (`/de/products/dish-wash-liquid/`).
- Pages are in `src/views/`; `src/pages/` only routes to them. Components read the language from the URL.
- Interface text: `src/i18n/ui/en.ts` (source) and one file per language, merged key by key with English fallback (`src/i18n/ui/index.ts`).
- Content: `src/content/i18n/<lang>/…` loaded by the `productsI18n`, `categoriesI18n` and `blogI18n` collections (`src/content.config.ts`) and merged field by field over the English entry (`src/i18n/content.ts`, `src/i18n/merge.ts`). Links are localized by `src/i18n/markdown-localize-links.ts`.
- English visitors whose browser prefers a supported language are redirected once to that language (unless they picked a language in the corner menu, which is remembered).
- The enquiry form shows your labels, but the message GoodBiz receives keeps English field names plus a `Language: <name>` line.
