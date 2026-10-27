# Step-by-step enquiry form (design)

Date: 2026-10-27. Replaces `src/components/EnquiryForm.astro` on /contact/ (and /<lang>/contact/) in all 12 languages.

## 1. Why

Buyers give up when they see a wall of fields. The new form asks one small thing per screen, mostly by tapping, so it never feels like work. Above all, **a visitor's contact details are never lost**: they are saved the moment the buyer finishes step 1, even if they stop halfway.

Success: more enquiries with at least a name plus one way to reach the buyer, and a Google Sheet holding one row per visitor that fills in as they go.

Non-goals: no account, no price calculator, no live chat, no CRM integration beyond the sheet and an email alert.

Anti-goals (a failure even if it "works"):
- a lead is lost because a step failed to send, or because no endpoint is configured yet;
- a buyer has to fill in fields we could have known (from the page they came from);
- the form looks like a generic SaaS wizard instead of this site (green palette, Geist, pill buttons, rounded media cards);
- any claim on the form that breaks the honesty rules (spec 2026-10-16 §4): no promised minimums, prices, certifications or delivery times.

## 2. Decided by the owner

- Step 2 shows the **five product groups** (the site's categories), not all 23 products.
- Build it with Emil Kowalski's principles in the page's existing theme, and make it beautiful.
- The owner asked us to decide the rest as a buyer would. Those decisions are marked *(our call)* below.

## 3. The flow (one step per screen)

Values sent to the team stay in English (as today), plus a `language` field with the buyer's language.

1. **Contact.** Name (required), company (optional), email, WhatsApp/phone. Required: name plus EITHER a valid email OR a phone with 7+ digits (digits counted after stripping spaces, `+`, `-`, `(`, `)`). Hint under the pair: "Email or WhatsApp is enough." Tapping Next sends stage `contact` to the backend. That is the lead.
2. **Product group.** Five photo cards: Bath & personal soaps, Laundry care, Kitchen care, Surface & home cleaners, Industrial raw materials. Each card uses one existing product photo (`public/images/products/*-800.webp`) *(our call: the best-known product of each group, e.g. dish wash liquid for kitchen care; raw materials uses soap noodles, or the group's field colour with a drawn mark if no photo exists)*. Below them, a full-width "Something else" card that opens a text box ("Which product? e.g. hand sanitiser gel, toilet cleaner tablets") and stays on the step; Next then skips step 3.
3. **Product.** Pill buttons for the products in the chosen group, from the content collection, in the page's language, plus:
   - "Several from this range (mixed container)" *(our call)*;
   - "Not sure yet".
   Varieties are **not** asked *(our call)*: a buyer at this stage knows "dish wash liquid", not "lemon gel concentrate, 5 L". They can mention a variety in the notes.
4. **Quantity.** Pills: Samples / trial order, 1 container, 2–5 containers, 6+ containers, plus "Another amount" which opens a text box (stays on the step). No minimum is implied (the site says "no fixed minimum").
5. **Destination.** A country field with type-ahead suggestions (names from `Intl.DisplayNames` in the page's language over a fixed list of ISO 3166 region codes; matching ignores case and accents; the value sent is the English name plus the code), plus an optional port/city field. Free text is accepted if it matches no country.
6. **Terms.** Cards, each with a one-line plain explanation:
   - "Not sure, advise me" comes first *(our call: most first-time importers don't know the terms, and the option tells them that's fine)*;
   - FOB, CFR and CIF follow.
   The lines are in §8.
7. **Notes and send.**
   - An optional notes textarea.
   - An optional "Under your own brand?" choice (Yes / No / Maybe) *(our call: keeps today's private-label question without adding a step)*.
   - The Send button.
   - Above the Send button, a short summary of the answers. Each line has an "Edit" link that jumps back to its step.

Header on every step: "Step N of M" and a thin progress bar. M counts only the steps this buyer will see (skipped steps are not counted).

## 4. Behaviour

- **Auto-advance.** Tapping a card or pill selects it and moves on after 260 ms, long enough to see the selection land. The rules around it:
  - Arrow keys move the selection within a group (roving radio behaviour) and never advance.
  - Enter or Space on a focused option selects it and advances.
  - "Other"-type options open their text box, focus it and stay.
  - Re-tapping a selected option still advances.
- **Navigation.**
  - Back on every step except step 1.
  - Enter in a text input means Next. In the textarea, Enter adds a new line.
  - Browser history is not touched *(our call: steps are not separate URLs)*.
- **Validation.** Only the current step is validated. Errors appear inline under the field and focus moves to the first invalid field. Steps 2–7 have no required fields except that a choice or a text value is needed to continue on steps 2–6. Each of those steps also has a quiet "Skip" link *(our call: never trap a buyer who doesn't know)*.
- **Lead ID and sending.**
  - One `leadId` per visit comes from `crypto.randomUUID()`, kept in `sessionStorage` so a reload continues the same row. If storage is unavailable it lives in memory only.
  - Each Next posts that step's answers with `stage` set to the step name.
  - In-between steps use `fetch(..., { keepalive: true })` and fire-and-forget; they never block the UI.
  - The final send has `stage: "submitted"`, is awaited, and times out after 15 s.
  - A double click or a double Enter sends once: the Send button is disabled, and an in-flight guard stops repeats.
- **Prefill from links.**
  - `?product=` (one or more slugs, as today) skips steps 2 and 3. The Product row in the summary shows the chosen names, each with a remove button.
  - `?variety=` (new, optional) is recorded in the notes payload when it is a known variety of that product.
  - `?message=` prefills the notes.
  - Unknown slugs, unknown varieties and hostile values are ignored. The existing `parseEnquiryParams` is extended rather than replaced. Prefill is scoped to the right option group, because option ids repeat across groups.
  - These pages keep working unchanged: the HoReCa links (several products plus a message), the LabelHero links (message with the brand name), product cards and product pages.
- **Spam.**
  - A hidden honeypot checkbox (off-screen, `tabindex=-1`, `aria-hidden`). If it is ticked, the form silently shows success and sends nothing.
  - A 3-second minimum from page load to the final send. A fast but valid submit is delayed until 3 s, never dropped.
- **Failure fallback.** If the final send fails, times out, or no endpoint is configured, the success screen is replaced by the existing send panel:
  - "Send on WhatsApp" and "Send by email" buttons, each with the whole request already written into the message (reusing `enquiryText`, `buildWhatsAppUrl` and `buildMailtoUrl`);
  - the email and phone as plain text, as today.
  The in-between sends fail silently.
- **Success.** The steps hide and a check mark draws itself once (SVG stroke-dashoffset, 600 ms). It is followed by "Thank you, {name}" and a line saying we reply within one working day. Use that wording only if the site already says it elsewhere; otherwise use the site's existing reply wording. Focus moves to the heading and a polite live region announces it.
- **Without JavaScript.** Every step shows at once as one long form, with radios instead of auto-advance. The form posts form-encoded to the endpoint. If the endpoint is still a placeholder, the action falls back to today's `mailto:` form.
- **Scroll.** If the top of the form is above the viewport after a step change, it scrolls into view, offset by the fixed header height. The scroll is smooth, or instant under reduced motion.

## 5. Design (Emil Kowalski principles, current theme)

Use only existing tokens from `src/styles/tokens.css`: `--paper*`, `--ink*`, `--forest-*`, `--action`, `--mint`, `--accent`, `--field-*` (group tints), `--radius-card`, `--font-display`, `--ease-out`, `--ease-in-out`. No new colours.

- **The form as an object.** The step area is one card on `--paper-2` with `--radius-card` and a hairline border. Inside it, the step title uses `--step-h3` with display tracking, plus a one-line helper in `--ink-soft`. It sits where the old form was, next to the contact aside. On phones the aside drops below.
- **Step transition.** The new step slides in 16 px from the direction of travel and fades in over 240 ms with `cubic-bezier(0.23,1,0.32,1)`. Going back enters from the other side. In RTL the directions are mirrored. The outgoing step leaves at once (opacity 0, 120 ms). The container height is not animated; it settles with `min-height` from the tallest step on desktop *(our call: avoids layout animation)*. With reduced motion: opacity only, 150 ms.
- **Progress bar.** 3 px, `--paper-3` track and `--action` fill. It animates with `transform: scaleX()` from the inline start (`transform-origin` flips in RTL), 320 ms `cubic-bezier(0.77,0,0.175,1)`. Width is never animated.
- **Press feedback.** Every card, pill and button scales to 0.97 on `:active` (160 ms `--ease-out`). Hover lifts (a shadow plus `translateY(-2px)` on cards, a tint on pills) apply only inside `@media (hover:hover) and (pointer:fine)`.
- **Selection.**
  - The selected card gets a 2 px `--action` ring (`box-shadow`, so no layout shift) and a small check badge that scales in from 0.9 with opacity.
  - Pills fill with `--action` and their text turns `--on-action`.
  - The focus ring uses `:has(:focus-visible)` on the card or pill wrapper, with the site's `--focus` colour.
- **Photo cards.** Square-ish (4:5) images with the group's `--field-*` tint behind the product photo (`object-fit: contain`, as on the product pages), and the label under the image. 3 across on phones (the five fit in about one screen), 5 across from 760 px. "Something else" spans the full width as a text card with a "+" mark.
- **Stagger.** When a step enters, its options stagger in at 30 ms each (max 6), using opacity and `translateY(6px)` only. They are never blocked from interaction.
- **Sizing.** Touch targets are 48 px minimum (pills) and cards are larger. Inputs use a 16 px font (no iOS zoom). Empty error slots take no space, so field spacing stays even.
- **Buttons.** Next and Send use the existing `.btn`. Back is a quiet text button with an arrow that flips in RTL. Step 7's Send button reads "Send enquiry" and shows a small spinner while awaiting; no layout shift.
- **Check mark.** Drawn on `--action` in a soft `--mint` circle. It plays once, and under reduced motion it appears without drawing.

## 6. Backend: Google Sheets via Apps Script

- **Config.** `site.enquiry.endpoint` in `src/config/site.ts` defaults to a placeholder. While it is the placeholder, the form uses the fallback panel only, and `npm run check:placeholders` warns but does not fail the build until launch. The placeholder is added to the launch checklist.
- **Request.**
  - JSON POST with `Content-Type: text/plain;charset=utf-8`, so there is no CORS preflight.
  - Payload: `{ leadId, stage, lang, page, ts, fields: {...} }`.
  - Field names are fixed English keys: name, company, email, phone, group, product, productOther, quantity, quantityOther, country, countryCode, port, terms, privateLabel, notes, variety and source (the referring prefill).
- **Apps Script `doPost`** (in `scripts/apps-script/enquiry.gs`, versioned in the repo):
  - takes `LockService.getScriptLock()`;
  - parses the JSON body, or `e.parameter` for the no-JS form post;
  - finds the row by leadId: it updates it, or appends a new one;
  - keeps `firstSeen` and sets `updated`;
  - never overwrites a filled cell with an empty value;
  - prefixes with `'` any value that starts with `= + - @`, a tab or a CR;
  - sends an email alert (MailApp, to a script property) on stages `contact` and `submitted`;
  - returns `{ok:true}` as JSON, or, for a no-JS post, a small HTML "Thank you" page with a link back to the site.
- **Setup doc.** `docs/enquiry-sheet-setup.md` walks through:
  1. create the sheet (headers are created by the script on first run);
  2. Extensions → Apps Script, then paste the script;
  3. set the alert email as a script property;
  4. Deploy → Web app (Execute as me, access Anyone);
  5. copy the `/exec` URL into `site.enquiry.endpoint`;
  6. redeploy, and how to test.

## 7. Quality bar

- Every new string is in all 12 languages and works right-to-left (Arabic). `npm run i18n:check -- --strict` passes and the edited files are re-stamped.
- **Unit tests (vitest):**
  - step validation (email or phone rule, the 7-digit count);
  - payload building;
  - CSV-injection prefixing (a shared pure function, also used for the Apps Script test copy);
  - query prefill (scoping, hostile values);
  - country suggestions;
  - the send queue (one leadId, stage order, double-send guard, timeout leading to the fallback).
- **Browser tests** (new `npm run test:e2e`, vitest plus playwright-core against `astro preview`, with a mocked endpoint):
  - contact-first send;
  - auto-advance and Back;
  - pre-fill skipping (single product, HoReCa multi-product, message);
  - the "Something else" path;
  - the full flow with one leadId across all requests;
  - double-click sends once;
  - failure fallback (500, timeout, no endpoint);
  - honeypot;
  - no-JS rendering;
  - RTL direction.
- All existing gates pass: `npm run build && npm test && npm run test:build && npm run check:placeholders && npm run i18n:check -- --strict`, and `astro check` shows 0 errors.
- Checked in a browser at 390 px and 1440 px in en and ar (screenshots in `docs/superpowers/screens/enquiry/`), with no sideways scroll and no console errors. Lighthouse accessibility stays at 100 on /contact/.

## 8. Settled after the builder check (all our calls)

- **Privacy notice on step 1.**
  - Under the contact fields, one line: "We use these details only to reply to your enquiry. Nothing is shared or added to a mailing list." No checkbox, so the step stays light; the business purpose is a pre-contract enquiry.
  - A full privacy page is out of scope here and goes on the launch checklist in the README.
  - This line is the only privacy wording, so it must stay true: no mailing list and no sharing.
- **FOB / CFR / CIF lines.**
  - The builder writes them from Incoterms® 2020, factually and with no promises. Proposed English:
    - FOB: "You arrange and pay for the sea freight; we deliver the goods on board at the Indian port."
    - CFR: "We arrange and pay for the sea freight to your port; you insure the cargo."
    - CIF: "We arrange the sea freight and the insurance to your port."
    - Not sure: "We'll suggest the best option for your port and quote it."
  - They are translated into all 12 languages and listed in the plan's review step so the owner can check them.
- **`?variety=`.** It matches a product's `variants` entry by slug (`slugify(variant)`, e.g. `green-apple`) and is ignored if there's no match. No page sends it yet. Adding it to product-page links is out of scope; the parser and tests are ready for it.
- **New enquiry after sending.**
  - After a successful `submitted` send, the leadId is cleared from sessionStorage. A second enquiry then starts a new row.
  - A reload keeps only the leadId and returns to step 1, with the fields restored from sessionStorage for step 1 only. Later answers are not restored.
- **No endpoint configured (before launch).** Once step 1 is valid, a quiet line stays under the step header from step 2 onward: "Prefer to talk now? Send this on WhatsApp ↗". It is pre-written with everything answered so far, so a buyer who quits halfway has already had a one-tap way to send. The line also shows when the step-1 send fails, even with an endpoint configured.

## 9. Left to the builder

File layout (components, the `src/lib` pure logic, the `src/scripts` controller), the exact copy wording within the honesty rules, the representative photo per group, the country list source, and test file names.
