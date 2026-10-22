# Multilingual site: infrastructure and French (report)

Date: 2026-10-22 · Branch `feat/promise-moq-i18n` · Translator guide: `docs/i18n-translator-guide.md` · Screens: `docs/superpowers/screens/i18n/`

## What was built

**Locales and routing**
- 12 locales in `src/i18n/locales.ts`: en (unprefixed), ar, fr, es, pt, ru, zh (hreflang `zh-Hans`), de, tr, id, sw, vi. Astro i18n config with `defaultLocale: 'en'` and `prefixDefaultLocale: false`.
- Page templates moved to `src/views/`. `src/pages/*` (English) and `src/pages/[lang]/*` (other locales) are thin route shims. Per-entry paths come from `src/views/paths.ts`.
- 529 pages are built: 44 per locale × 12, plus the 404. English output is byte-identical to before, apart from the intended additions: `dir`, hreflang and og:locale alternates, the menu, `inLanguage`, the hidden Language field, and `dir="ltr"` on phone links. This was checked by a normalized diff against a build of the previous commit.

**UI dictionaries**
- `src/i18n/ui/en.ts` is the typed source of truth (349 strings), and `UiDict = typeof en`. Each locale file is a `DeepPartial`, merged key by key with English fallback. Arrays are used only when their length matches.
- English `terms` come from `site.ts`, so the existing export-terms test keeps holding.
- Every component and page reads the dictionaries through `useI18n(Astro.url)`. This covers header, footer, breadcrumbs, cards, quote card, answer wall, guide rows, process steps, spec table, the enquiry form, alt texts and aria labels. The company FAQs now live in the dictionaries; English output is unchanged and unit-tested.

**Content**
- Translations live in `src/content/i18n/<lang>/{products,categories,blog}/<slug>.md`, loaded by the `productsI18n`, `categoriesI18n` and `blogI18n` collections. Every field is optional.
- `getLocalized()` and `localizeEntry()` merge a translation over its English entry field by field (`src/i18n/content.ts`, `merge.ts`).
- Fixed fields always come from English: slug, category, order, hsn, related, image, gallery src, dates and relatedProducts.
- If a translation is missing, the page shows the English entry inside that locale's chrome, with its internal links localized (`EntryBody.astro`).
- In translated Markdown, a Sätteri mdast plugin (`src/i18n/markdown-localize-links.ts`) rewrites `/products/…`, `/categories/…` and `/blog/…` links to the page's locale. Astro 7's default processor is Sätteri, not remark. `@astrojs/markdown-satteri` 0.4.4 is now a direct dependency.

**Language menu** (`LangSwitch.astro`, `src/styles/i18n.css`)
- Placement:
  - A `<details>` pill, fixed in the bottom inline-start corner. WhatsApp sits in the other corner, and both mirror in RTL.
  - It shows a globe, the current language's native name and a chevron.
  - The panel lists all 12 languages in two columns, so all of them are visible at once on a 360px phone.
- Links and behaviour:
  - Each entry links to the same page in that language.
  - The last entry, "More languages…", opens Google Translate for the English page. The no-JS link uses `tl=auto`, and JS sets `tl` from `navigator.language` and builds `u` from `location.origin`.
  - Choosing a language stores `gb-lang`.
  - Escape closes the panel and returns focus to the pill. A click outside also closes it.
- Motion: the panel opens in 180ms with the strong ease-out, scaling from the corner it is anchored to (`transform-origin: bottom left`, or right in RTL). It closes instantly. With reduced motion it uses an opacity-only fade.
- Accessibility: the accessible name is in the page language and includes the visible text.
- No header link was added. The pill is always on screen, and adding a duplicate to the mobile menu gave nothing extra.

**Auto-detect**
- An inline `<head>` script runs on unprefixed English pages only, never on the 404.
- It is skipped when `gb-lang` is set, when storage is blocked (so a choice could not be remembered) or for bots.
- It maps `navigator.languages` with `pickLocale()`: pt-BR→pt, es-419→es, zh-*→zh, in→id. Both `pickLocale()` and `isBot()` are pure and unit-tested, and their source is inlined via `toString()`, so the tested code is the shipped code.
- It calls `location.replace` to the localized path, keeping the query and hash.

**RTL and fonts**
- `<html lang dir>` is set on every page.
- Physical CSS was converted to logical properties: hero object, band media, bubbles, leaves, step offset, tile labels, chip, FAB, skip link, plain-list bullets, prose and spec table radii, `text-align: start`, header padding and select padding.
- `i18n.css` mirrors what logical properties cannot:
  - glow position;
  - band mask direction;
  - plate crop;
  - arrows (`scale: -1 1`, which composes with the hover nudges);
  - breadcrumb separator `\`;
  - nav underline and menu origins;
  - select chevron;
  - leaf slide direction;
  - LTR isolation for HSN codes.
- Arabic:
  - IBM Plex Sans Arabic 300/400/600 (OFL, woff2, about 45 KB each) sets everything. The italic line becomes upright weight 300, display line-heights are relaxed and all letter-spacing is removed.
  - Only the 400 weight is preloaded, on ar pages only. A second preload cost Lighthouse points.
- Simplified Chinese uses a system stack with no web-font download, and its italic preload is skipped.
- Geist latin-ext, Cyrillic, cyrillic-ext and Vietnamese, and Newsreader italic latin-ext and Vietnamese, are self-hosted with `unicode-range`, so they download only when used. Newsreader has no Cyrillic, so Russian italics fall back to Georgia/serif.

**SEO**
- Self canonical per locale, plus 12 reciprocal hreflang links and x-default (→ English).
- `og:locale` and 11 `og:locale:alternate` tags.
- JSON-LD:
  - `inLanguage` on WebSite, FAQPage and BlogPosting;
  - localized Organization description, Product property names, and breadcrumb names and URLs;
  - Product `url` points to the locale page.
- Translated titles and descriptions.
- The sitemap is configured with i18n and is still emitted only when `launchReady` is true.
- llms.txt gains a "Languages" section; robots.txt is unchanged.

**Enquiry form**
- Labels, placeholders and quantity choices are translated.
- The values sent stay English: field names, product names, quantities and Yes/No.
- A hidden `Language` field adds a `Language: <native name>` line, as the last line in WhatsApp and email and in the no-JS mailto body. This is unit-tested.

**Honesty**
- `src/i18n/honesty.ts` holds per-language first-person claim patterns: English plus 7 French ones, with empty slots documented for translators.
- They are applied to every translation file (unit test) and to the visible text of every built page in that language (build test).

## French
Everything is translated as professional B2B French:
- the 349 UI strings;
- 23 products (all fields, specs, FAQs and bodies);
- 5 categories;
- 8 buyer guides, about 12,300 words.

Terms used: "exportateur négociant", "marque de distributeur", "fabricants indiens contrôlés", "connaissement", "liste de colisage" and "FDS (MSDS)". FOB/CIF/CFR, T/T, LC, HSN/ITC-HS codes, numbers and units are kept. French typography is applied: a non-breaking space before `: ; ? ! %` and between thousands.

The meta descriptions are 137–160 characters. All files are stamped, and `npm run i18n:check -- --lang fr --strict` passes.

## Checks added
- **`npm run i18n:check`** (`scripts/i18n-check.mjs`), per locale:
  - missing, stale (`sourceHash` against a SHA-256 of the English file), malformed (fixed-field changes, list-length mismatches, unknown or missing fields) and orphan files;
  - missing UI keys, lost placeholders and a stale dictionary.
  - It exits 0 with a report; `--strict` exits 1. Example: fr is clean; the other 10 report 36 missing files and 349 missing strings each.
- **`npm run i18n:stamp`** records sourceHash in a translation's frontmatter or UI file. **`npm run i18n:sweep`** checks sideways scroll and console errors per language and optionally takes screenshots.
- **Unit tests** (`i18n-detect`, `i18n-locales`, `i18n-ui`, `i18n-content` and an extra enquiry test): 196 → 448 tests. They cover:
  - detection mapping and bots;
  - path localization, alternates and link rewriting;
  - dictionary merge, missing keys and placeholders;
  - French completeness and typography;
  - each translation file's fixed fields, counts, HS codes in notes, snippet length, links, export-terms wording (incoterms and lead-time figure per language) and honesty;
  - `mergeEntryData`.
- **Build tests** (`tests/build/i18n.test.ts`), for every locale:
  - complete page set and `<html lang dir>`;
  - self canonical, and a complete, reciprocal hreflang set with x-default;
  - one h1, title and description;
  - JSON-LD parses, with the right `inLanguage`, breadcrumb URLs in the locale and Product url;
  - og:locale tags;
  - internal `<a>` and `<form>` links stay in the locale (the menu is exempt via `data-lang-link`);
  - the menu links every locale plus Google Translate;
  - honesty patterns.
- **Further build tests**:
  - detection script only on English pages;
  - Arabic font preloaded only on ar;
  - no English leaks on fr pages: 12 known UI strings checked in visible text;
  - French content is used for a product, a category and a post;
  - links inside translated Markdown are localized.

## Existing tests changed (intent kept)
- `site.test.ts`: `<html lang="en"` on every page became "the page's own `lang` and `dir`" (stricter). Title and description uniqueness is now checked within each language, because fallback locales legitimately repeat English titles. No other assertion changed.

## Gate
`npm run build && npm test && npm run test:build && npm run check:placeholders`:
- 529 pages built;
- unit tests: 448 passed;
- build tests: 639 passed;
- placeholders: warning only (launchReady false).

`astro check` reports 0 errors and 0 warnings.

## Browser checks
- `npm run i18n:sweep -- --lang fr,ar --widths 360,1440`: 176 page views, no sideways scroll and no console errors.
- en, fr and ar at 390 and 1440: 264 page views, all clean.
- Screens (18): `docs/superpowers/screens/i18n/{home,product,contact}-{en,fr,ar}-{1440,390}.png`.
- Language menu: opened and closed by mouse and Escape, with focus returning to the pill. Google Translate href set from the browser language.

## Lighthouse (mobile, `astro preview`, Lighthouse 13.5)
| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` (en) | 98 / 98 / 98 | 100 | 100 | 69 | 2.4–2.5s | 0 | 0 |
| `/ar/` | 96 / 96 / 96 / 96 | 100 | 100 | 69 | 2.8s | 0 | 0 |

SEO 69 is only the intended `noindex`. One cold `/ar/` run scored 86 (LCP 1.8s, an unattributed spike), but four further runs gave 96. A version that preloaded two Arabic weights scored 95–96.

## Concerns
- **Arabic shows English for now.** The 10 other locales show English text in RTL or LTR chrome until they are translated. In Arabic, English sentences put their final punctuation on the left (".Exported from India"). This is expected and disappears once `ar` is translated.
- **Duplicate content before launch.** Untranslated locales publish English pages under their own canonical URLs. Before `launchReady: true`, either finish each locale or accept this. The README launch checklist now says so. A possible follow-up is to `noindex` fully-fallback pages automatically.
- **Two-column menu labels.** These are short today. A very long native name added later could wrap.
- **zh italics.** These use a system font upright at 400. Rendering depends on the visitor's OS fonts (PingFang SC, Microsoft YaHei, Noto Sans SC).
- **Plural forms.** "{n} products" strings are single templates, and the guide tells ar and ru translators to choose a construction that works for 2–30. True plural rules (`Intl.PluralRules`) are not implemented.
- **Stamping trusts the translator.** Stale detection compares hashes of the whole English file, so any English edit, including a typo fix, marks every language stale.
