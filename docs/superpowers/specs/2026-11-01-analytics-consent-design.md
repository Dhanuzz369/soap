# Google Analytics 4 with consent: design (2026-11-01)

The owner set up GA4 (measurement ID `G-FWEG9Y5FVS`) and asked for it to be added "as a senior performance marketer". The site currently promises no cookies and no analytics (Cookie Policy, Privacy Policy, README §6, tests). GA4 sets cookies (`_ga`, `_ga_<container>`) and sends data to Google, which under the EU/UK GDPR + ePrivacy and India's DPDP Act needs prior, freely given consent. So analytics ships together with a consent banner and updated legal pages, or not at all.

## 1. Principles

- **Nothing loads before consent.** "Basic" consent mode: `gtag.js` is not requested at all until the visitor accepts. No cookieless pings before consent.
- **Equal choice.** "Accept" and "Reject" are equally prominent buttons (same size, same style weight). No pre-ticked boxes, no "by browsing you agree".
- **Easy withdrawal.** A "Cookie settings" link in every footer reopens the banner. Withdrawing deletes the `_ga*` cookies and stops further sending (reload not required for stopping; cookie deletion on the site's own domain).
- **No ads, no signals.** Consent Mode v2 defaults: `ad_storage`, `ad_user_data`, `ad_personalization` always `denied`; `analytics_storage` `granted` only after Accept. `allow_google_signals: false`, `allow_ad_personalization_signals: false`.
- **No personal data to Google.** Never send names, emails, phone numbers, company names, notes or the lead id. Only product slugs, range/group, step names, language, link type.
- **Only the real site sends.** Send only when `launched` (src/lib/launch.ts) AND `location.hostname === new URL(site.url).hostname`. Previews, local builds, `*.vercel.app` and every test never send.
- **Performance.** No change before consent. After consent, gtag.js loads `async` after the page is idle; no render-blocking.

## 2. Configuration

`src/config/site.ts`: `analytics: { ga4: 'G-FWEG9Y5FVS' }` with a comment. Empty string = analytics and banner off entirely (banner only exists when an ID is set). `npm run check:placeholders` unaffected.

## 3. Consent banner

- Component in BaseLayout on every page (not on the 404). Bottom of the viewport, not a full-screen wall; the page stays usable. Doesn't cover the floating WhatsApp button or the enquiry form's Send/summary on phones (offset or stacking); respects safe-area insets.
- Text (English; translate naturally into all 11 other languages, ui dictionaries): heading-free short message:
  "We'd like to use Google Analytics cookies to see which pages and products buyers look at, so we can improve the site. No advertising, and nothing about you is sold. [Cookie Policy]" Buttons: **Accept** · **Reject**.
- Choice stored in localStorage `gb-consent` as `{"v":1,"analytics":"granted"|"denied","at":<ISO date>}`. Ask again after 12 months or if `v` changes. If storage is unavailable, treat as not yet chosen each visit and don't crash.
- Keyboard and screen reader: `role="region"` with `aria-label`, buttons are real `<button>`s, reachable by Tab right after the skip links (it's in the DOM early), visible focus ring (same tokens as the site), no focus trap, Escape does nothing (choice is required to dismiss, but the page stays usable). RTL mirrored in Arabic.
- Design: matches the site (emil-design-eng skill: ease-out `cubic-bezier(0.23,1,0.32,1)`, enter 200–250 ms translate+opacity, `scale(0.97)` on press, reduced-motion fallback, hover gated by `(hover:hover) and (pointer:fine)`).
- No-JS: the banner is not shown (no analytics can load without JS anyway).
- Footer: add "Cookie settings" (button styled as link) next to the Cookies link, all languages; it reopens the banner showing the current choice.

## 4. Events (GA4)

Page views: automatic via `gtag('config', id, { send_page_view: true })`; enhanced measurement (scrolls, outbound clicks) is configured by the owner in GA4.

Custom events, all only after consent, all params free of personal data:

| Event | When | Params |
| --- | --- | --- |
| `generate_lead` | Enquiry step 1 (contact) saved successfully for the first time for this lead | `lead_source: 'enquiry_form'`, `product` (slug from `?product=`, if any), `language` |
| `enquiry_step` | Each later step completed | `step` (group, product, quantity, destination, terms) , `language` |
| `enquiry_sent` | Final send succeeded (stage submitted) | `group`, `product` (slug or key, not free text), `terms`, `language` |
| `enquiry_fallback` | The WhatsApp/email fallback panel shown | `reason` (`no_endpoint`/`error`/`timeout`) |
| `contact_click` | Click on any `wa.me`, `mailto:` or `tel:` link anywhere on the site | `method` (`whatsapp`/`email`/`phone`), `location` (`header`/`footer`/`fab`/`form`/`page`) |
| `quote_start` | QuoteCard form submitted (it opens /contact/ with a message) | `product` (slug if the card has one) |
| `language_change` | Language picked in the menu | `to` (locale code) |

Implementation: a tiny `track(name, params)` in `src/scripts/analytics.ts` that is a no-op unless consent is granted and the host check passes; the step form and other scripts call it. Pure parts (consent parsing/expiry, param sanitising that drops anything not in an allow-list, host check) live in `src/lib/analytics.ts` with unit tests.

## 5. Legal pages (all 12 languages)

- **Cookie Policy**: rewrite "No cookies, no tracking" and "Why there is no cookie banner". New truth: the site uses Google Analytics cookies only if you accept; table gains rows for `_ga` (distinguishes visitors, up to 2 years per Google) and `_ga_FWEG9Y5FVS` (keeps session state, up to 2 years) set by Google Analytics on our domain only after Accept, plus `gb-consent` (your choice, 12 months). Describe how to change your mind (Cookie settings link) and that rejecting changes nothing else on the site. Keep "no advertising trackers, no embedded content".
- **Privacy Policy**: processors list adds Google Analytics (Google LLC / Google Ireland), what it collects (pages visited, approximate location from IP which Google does not store for GA4, device/browser, referrer, the events above, no names or contact details), legal basis: consent (DPDP s.6; GDPR 6(1)(a)), retention: as set in GA (owner sets 14 months), transfer to the US (Google; EU–US Data Privacy Framework). Update `updated:` dates. Remove every "we do not use analytics"/"no cookies" sentence.
- Translations: all 11, natural, keep honesty rules, restamp. English prevails line unchanged.
- Tests: legal tests updated to the new truth (the storage-key test includes `gb-consent`, `_ga`, `_ga_FWEG9Y5FVS`); a test fails if site code loads googletagmanager outside the consent path.

## 6. Owner guide `docs/analytics.md`

Short, plain: what's tracked; GA4 settings to change (data retention 14 months; Google signals off; mark `generate_lead` and `enquiry_sent` as key events; register custom dimensions `product`, `group`, `step`, `method`, `language`; define internal traffic filter for the owner's IP; link Search Console once verified; enhanced measurement on, site search off); how to test with DebugView; UTM conventions for marketplace listings, WhatsApp/LinkedIn shares and email signatures (`utm_source`/`utm_medium`/`utm_campaign` examples); a weekly 10-minute report (key events by source, top products by enquiry, landing pages, countries). Also update docs/backlinks-kit.md to use UTM-tagged links on listings, README §6 privacy note, docs/dpdp-compliance.md (consent record, withdrawal, processor).

## 7. Gates

All existing gates + new unit/build/e2e tests:
- e2e (in the helper, every page): block `https://www.googletagmanager.com/**` and `https://*.google-analytics.com/**` and record requests; assert none before consent; after Accept on a page served from the test host the host check keeps sending OFF (so assert `track` is a no-op and no request) — and a unit test covers the enabled path with a fake host. Banner: shows on first visit, Accept/Reject persist across reload, Cookie settings reopens, keyboard-only flow (Tab to buttons, Enter), Arabic RTL, phone width doesn't cover the WhatsApp button or the form's Send.
- Lighthouse mobile on `/` and `/contact/`: performance ≥ 95, accessibility 100 with the banner showing.
- `npm run i18n:check -- --strict`, `npx astro check` 0 errors, honesty checks.
