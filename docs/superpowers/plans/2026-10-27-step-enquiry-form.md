# Step-by-step Enquiry Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the one-page enquiry form on /contact/ with a 7-step, tap-first form that saves the lead to a Google Sheet from step 1.

**Architecture:**
- Pure logic lives in `src/lib/`: step model, validation, payload, prefill, countries and the sender. It is unit-tested with vitest.
- A static Astro component renders every step. Without JS it is one long form; `src/scripts/step-enquiry.ts` turns it into a stepper.
- An Apps Script file in the repo upserts one row per `leadId`.

**Tech Stack:** Astro 7.4 (static), TypeScript, vitest, playwright-core (already a dev dependency), Google Apps Script.

**Spec:** `docs/superpowers/specs/2026-10-27-step-enquiry-form-design.md` (read it fully; §3–§8 are binding)

## Global Constraints

- Values sent to the team are English. Labels shown are in the page's language. Every payload has a `language` field (native name).
- Step ids, in order: `contact`, `group`, `product`, `quantity`, `destination`, `terms`, `send`. Stage names sent are these ids, except that the final send is `submitted`.
- Contact rule: name is required, plus a valid email OR a phone whose digit count is at least 7. Before counting digits, strip spaces and `+ - ( )`.
- Auto-advance delay is 260 ms. The final send times out after 15 s. There is a 3 s minimum from page load to the final send: a fast, valid send is delayed, never dropped.
- Motion:
  - Step enter: 240 ms `cubic-bezier(0.23,1,0.32,1)` with a 16 px slide from the direction of travel. In RTL the direction is mirrored. With reduced motion: opacity only, 150 ms.
  - Step exit: opacity, 120 ms.
  - Progress bar: `transform: scaleX()`, 320 ms `cubic-bezier(0.77,0,0.175,1)`. Width is never animated.
  - Press: `scale(0.97)` over 160 ms. Hover only inside `@media (hover:hover) and (pointer:fine)`.
  - Option stagger: 30 ms each, at most 6 options.
- Use only the existing tokens in `src/styles/tokens.css`. Add no new colours.
- Sizes: touch targets of 48 px or more, input font of 16 px, and empty error slots take no space.
- Honesty rules (spec 2026-10-16 §4) apply to every new string. "No fixed minimum" stays true.
- Every new UI string is in all 12 `src/i18n/ui/<lang>.ts`. Run `npm run i18n:stamp` on the edited files and make sure `npm run i18n:check -- --strict` passes.
- `launchReady`, the contacts and `site.url` are untouched.
- Commits end with a blank line, then `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Gates: `npm run build && npm test && npm run test:build && npm run check:placeholders && npm run i18n:check -- --strict`, and `npx astro check` with 0 errors.

## Review Focus

1. **A reload in the middle of the flow.** The same leadId is reused, the form returns to step 1 with the step-1 fields restored, and the next send updates the same row. Test: Task 6 `reload keeps leadId and step-1 fields`.
2. **The HoReCa link with several products plus a message.** Steps 2 and 3 are skipped, the summary lists every product with a remove button, and the message lands in the notes. Removing the last product brings back steps 2 and 3. Test: Task 7 `horeca multi-product prefill`.
3. **The buyer presses Back after auto-advance has already been scheduled** (a tap and then Back within 260 ms). The pending advance is cancelled and no step is skipped. Test: Task 6 `back cancels pending auto-advance`.
4. **Arabic page.** The slide direction and the progress-bar origin are mirrored, and the Back arrow points right. Test: Task 7 `rtl mirrors direction`.
5. **The endpoint returns a non-JSON body, or `{ok:false}`.** This is treated as a failure, so the fallback panel shows, never a false success. Test: Task 2 `non-ok response is failure`.

---

### Task 1: Step model, validation, payload and prefill (pure)

**Files:**
- Create: `src/lib/enquiry-steps.ts`
- Create: `src/lib/countries.ts`
- Modify: `src/lib/enquiry.ts`
  - extend `parseEnquiryParams` to also return `variety: string`;
  - add `slugify(s: string): string` if no shared one exists (check `src/lib` first).
- Test: `tests/unit/enquiry-steps.test.ts`, `tests/unit/countries.test.ts`, extend `tests/unit/enquiry-params.test.ts`

**Interfaces (produces):**
```ts
export type StepId = 'contact' | 'group' | 'product' | 'quantity' | 'destination' | 'terms' | 'send';
export const STEP_IDS: readonly StepId[];
export type Answers = {
  name?: string; company?: string; email?: string; phone?: string;
  group?: string;          // category slug, or 'other'
  productOther?: string;   // text when group === 'other'
  products?: string[];     // product slugs; may also be ['several'] or ['not-sure']
  quantity?: string;       // QUANTITY_KEYS value or 'other'
  quantityOther?: string;
  country?: string; countryCode?: string; port?: string;
  terms?: 'not-sure' | 'FOB' | 'CFR' | 'CIF';
  privateLabel?: 'Yes' | 'No' | 'Maybe';
  notes?: string; variety?: string; source?: string;
};
export const QUANTITY_KEYS: readonly ['trial', '1', '2-5', '6+'];
export function isValidEmail(s: string): boolean;
export function phoneDigits(s: string): number;
export type FieldError = { field: keyof Answers; code: 'required' | 'contact' | 'email' | 'choose' };
export function validateStep(step: StepId, a: Answers): FieldError[];
export function visibleSteps(a: Answers, prefilled: { products: boolean }): StepId[];
export type Payload = { leadId: string; stage: StepId | 'submitted'; lang: string; page: string; ts: string; fields: Record<string, string> };
export function buildPayload(o: { leadId: string; stage: Payload['stage']; lang: string; page: string; now: Date; answers: Answers; english: (slug: string) => string; languageName: string }): Payload;
export function safeCell(v: string): string;
export function toEnquiryFields(a: Answers, english: (slug: string) => string, languageName: string): EnquiryFields;
// countries.ts
export const REGION_CODES: readonly string[];
export function countryNames(lang: string): { code: string; name: string; en: string }[];
export function suggestCountries(query: string, lang: string, limit?: number): { code: string; name: string; en: string }[];
```
(`toEnquiryFields` feeds the existing `enquiryText`, `buildWhatsAppUrl` and `buildMailtoUrl`.)

- [ ] **Step 1: Write failing tests.**
  - `validateStep('contact', {name:'A', phone:'+91 98 7654'})` returns `[]` (7 digits).
  - `{name:'A', phone:'12-345'}` returns `[{field:'email', code:'contact'}]`.
  - `{email:'a@b.co'}` returns `[{field:'name', code:'required'}]`.
  - `isValidEmail('a@b')` is false.
  - `validateStep('group', {})` returns `[{field:'group', code:'choose'}]`.
  - `validateStep('group', {group:'other', productOther:''})` returns `[{field:'productOther', code:'required'}]`.
  - `visibleSteps({group:'other'}, {products:false})` excludes `'product'`.
  - `visibleSteps({}, {products:true})` excludes `'group'` and `'product'`.
  - `buildPayload` maps product slugs through `english`. `fields` has only non-empty strings. `ts` is ISO.
  - `safeCell('=SUM(A1)') === "'=SUM(A1)"`, the same for `+`, `-`, `@`, `\t` and `\r`. `safeCell('Lemon') === 'Lemon'`.
  - `suggestCountries('alem', 'es')` includes `{code:'DE', name:'Alemania', en:'Germany'}`.
  - `suggestCountries('cote', 'fr')` matches "Côte d’Ivoire" (accents ignored).
  - `suggestCountries('', 'en')` returns `[]`.
  - Prefill: `parseEnquiryParams('?product=dish-wash-liquid&variety=Green Apple')` returns `variety: 'green-apple'`. `?variety=<script>` returns `''`.
- [ ] **Step 2:** Run `npx vitest run tests/unit/enquiry-steps.test.ts tests/unit/countries.test.ts tests/unit/enquiry-params.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement.
  - `REGION_CODES` are the ISO 3166-1 alpha-2 codes, without `AQ`, `BV`, `HM`, `TF` or `UM`.
  - Names come from `new Intl.DisplayNames([lang], {type:'region'})`, with `en` from the same API in English.
  - Matching folds case and accents (`normalize('NFD').replace(/\p{M}/gu,'')`) against both the local and the English name. Prefix matches rank before substring matches.
  - Variety validation against the product's variants happens in the controller (Task 6). The parser only slug-shapes the value.
- [ ] **Step 4:** Run the same command. Expected: PASS. Then run `npm test`: everything passes, including the existing enquiry tests.
- [ ] **Step 5:** Commit: `feat(enquiry): step model, validation, payload, prefill and country suggestions`.

### Task 2: Sender and endpoint config

**Files:**
- Create: `src/lib/enquiry-send.ts`
- Modify: `src/config/site.ts`
  - add `enquiry: { endpoint: 'PLACEHOLDER_ENQUIRY_ENDPOINT' }`, with a comment pointing to `docs/enquiry-sheet-setup.md`.
- Modify: `scripts/placeholder-rules.mjs` and `scripts/check-placeholders.mjs`
  - report `enquiry.endpoint` as a problem (which fails only when `launchReady`);
  - make sure the token scan doesn't flag it twice.
- Test: `tests/unit/enquiry-send.test.ts`, extend `tests/unit/placeholders.test.ts`

**Interfaces:**
- Consumes: `Payload` (Task 1).
- Produces:
```ts
export function isConfiguredEndpoint(url: string): boolean; // https://script.google.com/macros/s/.../exec only
export type SendResult = 'ok' | 'failed';
export type Sender = {
  step(p: Payload): void;                       // fire-and-forget, keepalive
  submit(p: Payload): Promise<SendResult>;      // awaited, guarded, min-delay, 15 s timeout
};
export function createSender(o: { endpoint: string; fetch: typeof fetch; loadedAt: number; now?: () => number; sleep?: (ms: number) => Promise<void>; timeoutMs?: number; minMs?: number }): Sender;
export function leadIdStore(storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null, uuid: () => string): { get(): string; reset(): void };
```

- [ ] **Step 1: Write failing tests (fake fetch).**
  - `step()` calls fetch with `method:'POST'`, `keepalive:true`, the header `'Content-Type':'text/plain;charset=utf-8'` and the body `JSON.stringify(p)`, and swallows rejections.
  - `submit()` called twice concurrently makes 1 fetch and both calls resolve to the same result.
  - `submit()` at 1 s after `loadedAt` sleeps 2000 ms before fetching.
  - A response `{ok:true}` gives `'ok'`.
  - `non-ok response is failure`: an HTTP 500, a body of `"<html>"`, or `{ok:false}` each give `'failed'`.
  - A fetch that never resolves gives `'failed'` after `timeoutMs` (15000 by default), via AbortController.
  - With an unconfigured endpoint, `submit()` gives `'failed'` and `step()` makes no fetch.
  - `leadIdStore` returns the same id across `get()` calls, persists it under `goodbiz-enquiry-lead`, and `reset()` makes a new one. A `null` storage works in memory.
  - `placeholderProblems` with `endpoint:'PLACEHOLDER_ENQUIRY_ENDPOINT'` includes a line naming `enquiry.endpoint`.
- [ ] **Step 2:** Run `npx vitest run tests/unit/enquiry-send.test.ts tests/unit/placeholders.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement as above. Apps Script answers with a redirect to `googleusercontent`; use the fetch default `redirect:'follow'` and parse the body as JSON.
- [ ] **Step 4:** Run the same command, then `npm test` and `npm run check:placeholders`. Expected: PASS, and the check exits 0 while `launchReady` is false.
- [ ] **Step 5:** Commit: `feat(enquiry): sender with keepalive steps, guarded submit, timeout and endpoint config`.

### Task 3: Apps Script backend and setup doc

**Files:**
- Create: `scripts/apps-script/enquiry.gs`
- Create: `docs/enquiry-sheet-setup.md`
- Test: `tests/unit/apps-script.test.ts` (loads the `.gs` into `node:vm` with fake `SpreadsheetApp`, `LockService`, `MailApp`, `PropertiesService` and `ContentService`/`HtmlService`)

**Interfaces:**
- Consumes: the `Payload` shape (Task 1). The `.gs` copies `safeCell` verbatim, and a test checks the two give equal results on the same inputs.
- Produces: `doPost(e)`.
  - Columns: `leadId, firstSeen, updated, stage, language, page, name, company, email, phone, group, product, productOther, quantity, quantityOther, country, countryCode, port, terms, privateLabel, notes, variety, source`.

- [ ] **Step 1: Write failing tests.**
  - Two posts with the same leadId leave 1 row. `firstSeen` is unchanged and `updated` changes.
  - A later post with `email:''` keeps the earlier email.
  - `name:'=HYPERLINK(...)'` is stored as `"'=HYPERLINK(...)"`.
  - MailApp is called for stages `contact` and `submitted` only, to the `ALERT_EMAIL` property.
  - A form-encoded post (`e.parameter` with no `postData.contents` JSON) is stored, and the response is HTML containing a link to the site.
  - A JSON post returns `{"ok":true}`.
  - A missing or malformed leadId returns `{ok:false}` and writes nothing.
  - The lock is always released (in a `finally`).
- [ ] **Step 2:** Run `npx vitest run tests/unit/apps-script.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement `enquiry.gs`:
  - the header row is created on first run;
  - rows are found by a leadId column lookup;
  - the alert email body is the plain enquiry text.
  Write `docs/enquiry-sheet-setup.md` with the six steps in spec §6, a test with curl, and how to redeploy a new version. Link it from the README's before-launch list (also add the privacy-page item from spec §8).
- [ ] **Step 4:** Run the test. Expected: PASS.
- [ ] **Step 5:** Commit: `feat(enquiry): Apps Script upsert backend and Google Sheet setup guide`.

### Task 4: Strings in 12 languages

**Files:**
- Modify: `src/i18n/ui/en.ts` (new `ui.steps` block; keep `ui.form` keys that the fallback panel still uses), and the other 11 `src/i18n/ui/*.ts` files
- Test: the existing `tests/unit/i18n-ui.test.ts` (key parity), plus `tests/unit/enquiry-strings.test.ts`

**Interfaces (produces):** `ui.steps` with these keys:
- Header and navigation: `stepOf` ("Step {n} of {m}"), `next`, `back`, `skip`.
- Titles and helpers: `titles: Record<StepId,string>` and `helpers: Record<StepId,string>`.
- Step 1: `contactHint` ("Email or WhatsApp is enough."), `privacy` (the exact spec §8 sentence).
- Step 2: `groupOther` and `groupOtherPlaceholder` ("Which product? e.g. hand sanitiser gel, toilet cleaner tablets").
- Step 3: `productSeveral`, `productNotSure`.
- Step 4: `quantities` (4 labels, in the order of `QUANTITY_KEYS`), `quantityOther`, `quantityOtherPlaceholder`.
- Step 5: `country`, `countryPlaceholder`, `port`.
- Step 6: `terms` (`{key, title, line}` ×4, `not-sure` first, lines from spec §8).
- Step 7: `notes`, `notesPlaceholder`, `brand`, `brandOptions` (Yes, No, Maybe), `summaryH`, `edit`, `remove`, `send`, `sending`.
- Errors: `errors: {required, contact, email, choose}`.
- Success: `successH` ("Thank you, {name}"), `successLine`.
- Fallbacks: `waEarly` ("Prefer to talk now? Send this on WhatsApp"), `failH`.

`successLine` reuses the reply-time wording the site already uses. Search `en.ts` for it; if none exists, use "We'll reply by email or WhatsApp." with no time promise.

- [ ] **Step 1:** Write the failing `enquiry-strings.test.ts`.
  - Every locale has `steps.terms[0].key === 'not-sure'`.
  - `quantities.length === 4`.
  - `stepOf` contains `{n}` and `{m}`.
  - `successH` contains `{name}`.
  - No locale's `steps` strings match `FORBIDDEN_CLAIMS` from `src/i18n/honesty.ts`.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Write the English strings, then natural translations for ar, fr, es, pt, ru, zh, de, tr, id, sw and vi. The Incoterm abbreviations stay in Latin script. Run `npm run i18n:stamp -- --lang <code>` for each language.
- [ ] **Step 4:** Run `npm test && npm run i18n:check -- --strict`. Expected: PASS.
- [ ] **Step 5:** Commit: `feat(i18n): step-by-step enquiry strings in 12 languages`.

### Task 5: Markup and styles (works without JS)

**Files:**
- Create: `src/components/StepEnquiry.astro`, `src/styles/step-enquiry.css`
- Modify: `src/views/Contact.astro`
  - render `<StepEnquiry />` in place of `<EnquiryForm />`;
  - keep the aside.
  Then delete `EnquiryForm.astro` and `src/scripts/enquiry-form.ts` once nothing imports them, but keep the exports of `src/lib/enquiry.ts`.
- Test: `tests/build/step-enquiry.test.ts` (reads `dist/contact/index.html` and `dist/ar/contact/index.html`)

**Interfaces:**
- Consumes: `STEP_IDS`, `QUANTITY_KEYS`, `ui.steps`, `getProductsByCategory(lang)`, `isConfiguredEndpoint`, `site.enquiry.endpoint`.
- Produces: the DOM contract for Task 6:
  - `form[data-step-enquiry]`, with these attributes:
    - `data-endpoint`, `data-lang`, `data-language-name`;
    - `data-whatsapp` and `data-email`;
    - `data-english` (JSON slug → English name map);
    - `data-variants` (JSON slug → variant slugs).
  - `section[data-step="<StepId>"]`, each holding an `h3` title (`tabindex=-1`).
  - Option groups are `[role=radiogroup][data-group="<field>"]` of `input[type=radio]` plus labels styled as cards or pills. Ids are prefixed by the group, e.g. `enq-product-kitchen-care-dish-wash-liquid`.
  - Product pills sit in one `div[data-products-for="<category>"]` per group.
  - `[data-other-for="<field>"]` text boxes are `hidden` until their option is chosen.
  - Error slots are `p[data-error-for="<field>"][hidden]`.
  - Header: `[data-progress]` (bar), `[data-step-label]`, `button[data-back]`, `button[data-next]` and `a[data-skip]`.
  - Send panel: `[data-summary]`, `button[data-send]`, `[data-wa-early][hidden]`.
  - Results: `[data-success][hidden]` (SVG check plus `h3 tabindex=-1`) and `[data-fail][hidden]` (the existing send-panel content: WhatsApp and email buttons and the plain-text contacts).
  - Honeypot: `input[type=checkbox][name="website_confirm"]`, off-screen, with `tabindex=-1`, `aria-hidden=true` and `autocomplete=off`.
  - Status: `p[role=status][aria-live=polite]`.
- No-JS form:
  - `method="post"`;
  - `action` is the endpoint when configured, otherwise `mailto:` with `enctype="text/plain"`;
  - field names are the English `Answers` keys plus `leadId` (a hidden input that is empty without JS; the script fills it), `stage=submitted` and `language`.
  - Every step is visible and stacked, with radios showing as cards or pills, and the stepper chrome is `hidden`.
- Group photos (our call, per spec): bath-personal-soaps → `toilet-bath-soap`, laundry-care → `detergent-powder`, kitchen-care → `dish-wash-liquid`, surface-home-cleaners → `floor-cleaner`, industrial-raw-materials → `soap-noodles`. Use the `-800.webp` variant when it exists; otherwise use the category's `--field-*` tint with the existing category icon (check `public/images/products` and the category components).

- [ ] **Step 1:** Write the failing build test.
  - The contact page has 7 `section[data-step]` in `STEP_IDS` order.
  - There are 5 group cards plus 1 "other".
  - There are 23 product radios, 4 quantity options plus "other", and 4 terms with `not-sure` first.
  - The honeypot exists with `tabindex="-1"`.
  - `action` starts with `mailto:` (the endpoint is a placeholder).
  - No two inputs share an id.
  - The `ar` page has `dir="rtl"` on `<html>`, and the step titles are in Arabic.
- [ ] **Step 2:** Run `npm run build && npx vitest run tests/build/step-enquiry.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Build the component and CSS to spec §5. The rules:
  - A card on `--paper-2`, with `--radius-card` and a hairline border.
  - Group cards are 4:5 with the photo `contain` on its `--field-*` tint: 3 columns under 760 px, 5 from 760 px. "Other" spans the full width.
  - Pills are full radius, 48 px tall, and fill `--action`/`--on-action` when `:checked`.
  - The selected card has a 2 px `--action` ring via `box-shadow` and a check badge.
  - The focus ring uses `:has(:focus-visible)` with `--focus`.
  - `:active` is `scale(0.97)` over 160 ms `--ease-out`. Hover is gated.
  - The progress bar is a 3 px track on `--paper-3` with a `--action` fill. It uses `transform-origin: left` and, under `[dir=rtl]`, `right`.
  - Inputs are 16 px.
  - `[data-error-for][hidden]{display:none}`.
  - The enhanced state is `.is-enhanced`: only `[data-active]` steps show.
  - Logical properties throughout, so RTL works.
- [ ] **Step 4:** Run `npm run build && npm run test:build`. Expected: PASS.
- [ ] **Step 5:** Commit: `feat(enquiry): step form markup and styles, no-JS long form`.

### Task 6: Controller script

**Files:**
- Create: `src/scripts/step-enquiry.ts` (imported by `StepEnquiry.astro`)
- Test: `tests/unit/step-enquiry-dom.test.ts` (vitest `environment: 'happy-dom'` only if it's already installed; otherwise put these cases in Task 7's browser tests and say so in the commit)

**Interfaces:**
- Consumes: everything from Tasks 1, 2 and 5.
- Produces: `initStepEnquiry(form: HTMLFormElement, deps?: { fetch?: typeof fetch; storage?: Storage | null; now?: () => number }): void`.

Behaviour to implement (spec §4 and §8, in this order):
1. **Start.**
   - Add `.is-enhanced`.
   - Read `leadIdStore(sessionStorage, crypto.randomUUID)` and fill the hidden `leadId`.
   - Restore the step-1 fields from sessionStorage key `goodbiz-enquiry-contact`.
   - Apply the prefill. `parseEnquiryParams` gives the products, message and variety:
     - keep only slugs present in `data-english`;
     - keep the variety only if it's in `data-variants[product]`;
     - the message goes to notes;
     - `source` is the referrer's path.
   - Compute `visibleSteps`.
2. **Show a step.**
   - Set `[data-active]`, then animate: the incoming step uses WAAPI `translateX(±16px)→0` plus opacity over 240 ms `cubic-bezier(0.23,1,0.32,1)`. The sign comes from direction × (rtl ? −1 : 1). With reduced motion: opacity only, 150 ms.
   - The outgoing step fades out over 120 ms and is then hidden.
   - The options stagger 30 ms each (max 6).
   - The progress uses `transform: scaleX(index/total)`.
   - The label shows `stepOf`.
   - Back is hidden on the first visible step.
   - Focus the step's `h3` (no scroll), then scroll the form top into view, offset by the header height, if it's above the viewport.
3. **Next.**
   - Run `validateStep`. On an error, unhide its error slot, set `aria-invalid` and `aria-describedby`, and focus the field.
   - Otherwise, send `sender.step(buildPayload(stage = current step))` and move on.
   - After `contact`:
     - save the step-1 fields to sessionStorage;
     - if the endpoint isn't configured, or the step-1 fetch rejects, unhide `[data-wa-early]` with an href from `buildWhatsAppUrl` that is refreshed on every step.
4. **Auto-advance.**
   - On `change` from a pointer or Enter/Space, call `scheduleAdvance(260)`. On `change` from arrow keys, don't (track the last `keydown` key).
   - Re-clicking a checked option also schedules the advance (handle `click` on the label of a checked input).
   - "Other" options reveal and focus their text box and do not schedule.
   - Back and every new schedule cancel the pending timer.
5. **Keys.** Enter in an `input` (not a textarea) means Next.
6. **Summary and edit.**
   - The summary is rebuilt on entering `send`.
   - Edit jumps to that step and returns to `send` on its Next.
   - In prefilled product chips, Remove deletes a slug. If none remain, the group and product steps become visible again.
7. **Send.**
   - The honeypot is checked: show success with no fetch.
   - Otherwise, disable the button and show `sending`.
   - Call `await sender.submit(buildPayload('submitted'))`.
   - On `'ok'`: run `leadIdStore.reset()`, clear `goodbiz-enquiry-contact`, and show success (hide the steps, unhide `[data-success]`, draw the check with stroke-dashoffset over 600 ms once (none under reduced motion), focus the `h3`, announce in the status).
   - On `'failed'`: unhide `[data-fail]` with WhatsApp and mailto hrefs from `toEnquiryFields` and focus its heading.
8. **Country field.** A combobox following the WAI-ARIA 1.2 pattern:
   - `role=combobox` with `aria-expanded`, `aria-controls` and `aria-activedescendant`;
   - the listbox holds `suggestCountries(value, lang, 6)`;
   - up and down move through the list, Enter picks, Escape closes;
   - picking sets `country` (English) and `countryCode`;
   - free text is kept in `country`.

- [ ] **Step 1:** Write the failing tests (DOM, if happy-dom is available; otherwise list them as browser tests in Task 7):
  - `reload keeps leadId and step-1 fields`;
  - `back cancels pending auto-advance`;
  - `arrow keys change selection without advancing`;
  - `other option stays on step and focuses its box`;
  - `honeypot shows success without fetch`.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement `initStepEnquiry`. Keep the module under about 350 lines: split the combobox into `src/scripts/country-combobox.ts`.
- [ ] **Step 4:** Run `npm test`, `npm run build` and `npx astro check`. Expected: PASS, with 0 errors.
- [ ] **Step 5:** Commit: `feat(enquiry): stepper controller with auto-advance, prefill, lead sends and fallback`.

### Task 7: Browser tests

**Files:**
- Create: `tests/e2e/step-enquiry.test.ts`, `tests/e2e/helpers.ts`, `vitest.e2e.config.ts`
- Modify: `package.json`, to add `"test:e2e": "vitest run --config vitest.e2e.config.ts"`

**Interfaces:**
- Consumes: the built `dist/`, served by `npx astro preview --port 4329`, started and stopped by the test setup.
- Uses the local Chrome through playwright-core's `chromium.launch({ channel: 'chrome' })`, with a fallback to `executablePath` from `CHROME_PATH`.
- Endpoint: the tests rewrite `form[data-step-enquiry]`'s `data-endpoint` to `https://script.google.com/macros/s/TEST/exec` before init (via `page.addInitScript` that sets `window.__ENQ_ENDPOINT__`, read by `initStepEnquiry` only when present), and intercept it with `page.route`, recording request bodies.

- [ ] **Step 1: Write the tests** (390×844 viewport unless noted):
  - `contact-first send`: fill name and phone, then Next. 1 request has `stage:'contact'` and the phone.
  - `auto-advance and back`: tap the kitchen-care card. After 260 ms or more the product step is active. Back returns to group with kitchen-care still checked.
  - `prefill skips`: `/contact/?product=dish-wash-liquid` goes contact, then quantity after Next, and the label reads "Step 2 of 5".
  - `horeca multi-product prefill`: `?product=liquid-hand-wash,floor-cleaner&message=Hotel%20order` gives 2 summary chips and notes = "Hotel order". Removing both brings back the group step.
  - `something else path`: picking "other" keeps you on the step with its box focused. Typing then Next skips the product step.
  - `full flow one leadId`: complete all steps. Every request has the same `leadId`, the stages are in order, and the last is `submitted`.
  - `double click sends once`: double-click Send, and exactly 1 `submitted` request is made.
  - `failure fallback`: route 500, then the fail panel shows a WhatsApp href containing the name. The same happens for a never-answering route with the timeout shortened via `window.__ENQ_TIMEOUT__`.
  - `no endpoint`: without the init script, the wa-early line shows after step 1, and Send shows the fail panel.
  - `honeypot`: tick the box via JS, then Send gives success and 0 submitted requests.
  - `no-js`: with `javaScriptEnabled:false`, all 7 sections are visible and the form action is `mailto:`.
  - `rtl mirrors direction`: on `/ar/contact/` the progress-bar `transform-origin` computes to right, and the Back arrow is mirrored.
  - `min delay`: Send at under 3 s still sends once, at 3 s or later.
- [ ] **Step 2:** Run `npm run build && npm run test:e2e`. Expected: all PASS. Fix any failures in the owning task's code, then re-run.
- [ ] **Step 3:** Commit: `test(enquiry): browser tests for the step form`.

### Task 8: Visual check, sweeps and docs

**Files:**
- Create: `docs/superpowers/screens/enquiry/*.png` (en and ar at 390 and 1440: step 1, group, product, terms, send summary, success, fallback)
- Modify: `README.md` (an "Enquiry form" section on how the steps work and where leads go), and `docs/i18n-translator-guide.md` (the `ui.steps` block)

- [ ] **Step 1:** Run `npm run preview` (background) and take the screenshots with playwright-core.
  - Check: no sideways scroll at 360/390, the group cards are 3 across on phones and the five fit in about one screen, the selected ring and pill fill are visible, and the text in Arabic is mirrored.
  - Fix anything off in Task 5's CSS.
- [ ] **Step 2:** Run `npm run i18n:sweep -- --lang <code>` for en, ar, fr, de and zh. Expected: no overflow and no console errors.
- [ ] **Step 3:** Lighthouse mobile on /contact/ (en, ar): accessibility 100, CLS 0, performance no lower than the current /contact/ minus 2.
- [ ] **Step 4:** Run all gates (see Global Constraints) and `npm run test:e2e`. Expected: all pass.
- [ ] **Step 5:** Commit: `docs(enquiry): screenshots, README and translator guide`.
