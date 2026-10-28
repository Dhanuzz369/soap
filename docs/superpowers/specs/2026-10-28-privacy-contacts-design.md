# Real contacts, business details, privacy and cookie pages, keyboard pass (design)

Date: 2026-10-28. Owner's answers (in chat):
- email: hygiene@goodbizglobal.com;
- mobile and WhatsApp: +91 88847 99369;
- city: Bengaluru, Karnataka;
- legal wording: "a unit of GoodBiz Global", with no legal form stated.

## 1. Audit result (done 2026-10-28; this is what the pages must say)

- **Cookies:** none. No analytics, no advertising or social trackers, no third-party embeds (no iframes, maps or video). No web fonts or scripts are loaded from other hosts; everything is self-hosted.
- **External links only.** Clicking one is the only time anything goes to these sites:
  - wa.me (WhatsApp);
  - translate.google.com (the "translate" option in the language menu);
  - the government and registration sites (DGFT, FIEO, CHEMEXCIL, Udyam, WCO, ICC, CBIC, BIS).
- **Browser storage (no cookies):**

  | Key | Where | What | When removed |
  |---|---|---|---|
  | `gb-lang` | localStorage | the language the visitor picked in the menu (written only when they pick one) | until cleared in the browser |
  | `gb-horeca` | localStorage | the product slugs and business type on the HoReCa page list (no personal data) | until cleared, or emptied with "Clear" |
  | `goodbiz-enquiry-lead` | sessionStorage | a random enquiry id | when the tab closes; replaced after sending |
  | `goodbiz-enquiry-contact` | sessionStorage | step-1 answers (name, company, email, phone), so a reload keeps them | when the tab closes; cleared after a successful send |
  | `goodbiz-enquiry-products` | sessionStorage | the product set the enquiry started with | when the tab closes |

  The builder must re-verify this table against the code and fix the pages if anything differs.
- **Server logs:** Vercel processes IP address, user agent and requested URL to serve and protect the site.
- **Enquiry data processors:**
  - Google: the Sheets/Apps Script endpoint and the Gmail alert (the domain's mail is on Google Workspace).
  - Vercel: hosting.
- **Conclusion on consent:** no cookie or consent banner is needed. Everything stored is strictly necessary for a feature the visitor uses, and nothing tracks them. Adding analytics later would change this; the cookie page says so.

## 2. Contacts and business details

In `src/config/site.ts`:
- **Contact:**
  - `email: 'hygiene@goodbizglobal.com'`
  - `phone: '+91 88847 99369'`
  - `whatsapp: '918884799369'`
  - `address: 'Bengaluru, Karnataka, India'`
- **Facts:**
  - `facts.city = 'Bengaluru'`
  - `facts.region = 'Karnataka'` (add the field if missing)
  - `facts.parentUrl = 'https://goodbizglobal.com'` (live, title "Merchant Exporter from India | GoodBiz Global")
- `contactIsPlaceholder: false`.
- Do NOT change `launchReady` or `url`. The enquiry endpoint stays a placeholder.

Everything that shows contacts must pick these up: the contact page aside, footer, WhatsApp float, enquiry fallback, JSON-LD, llms.txt files and the HoReCa CTA. Grep for leftover `PLACEHOLDER` text in rendered output. Only the enquiry endpoint may remain, and `check:placeholders` must report only that.

Business details:
- **Footer legal line:** "GoodBiz Hygiene is a unit of GoodBiz Global, Bengaluru, Karnataka, India", with a link to goodbizglobal.com, the email and the phone.
- **About page:** a short "Business details" block with these rows:
  - Business: GoodBiz Hygiene, a unit of GoodBiz Global;
  - Based in: Bengaluru, Karnataka, India;
  - Email;
  - Phone / WhatsApp;
  - Parent company website;
  - Registered with: the existing registrations strip.
- **JSON-LD Organization:**
  - `email`, `telephone` (E.164 `+918884799369`) and `address` (PostalAddress: addressLocality Bengaluru, addressRegion Karnataka, addressCountry IN);
  - `parentOrganization` with a url;
  - `contactPoint` (sales, with email, telephone and the 12 `availableLanguage` values).

Keep every existing schema test passing and update the ones that pinned placeholders.

## 3. Pages: /privacy/ and /cookies/ in all 12 languages

Build them like the other inner pages (PageHero-free simple prose layout, breadcrumbs, hreflang, canonical, sitemap, footer links "Privacy" and "Cookies" on every page).
- Translate them into all 12 languages. Each translated page carries one extra line: "This translation is provided for convenience. If it differs from the English version, the English version applies."
- Also add the legal pages to the i18n check and stamps the way other content is handled.
- Meta: indexable once launched (no noindex of their own), short titles: "Privacy Policy | GoodBiz Hygiene" and "Cookie Policy | GoodBiz Hygiene".

The English text below is final copy. Keep its meaning exactly. Light formatting changes are fine; do not add claims.

### Privacy Policy (English)

Last updated: 28 October 2026

**Who we are**
GoodBiz Hygiene is a unit of GoodBiz Global, a merchant exporter based in Bengaluru, Karnataka, India. GoodBiz Global decides how and why the personal data described here is used. That makes it the "Data Fiduciary" under India's Digital Personal Data Protection Act, 2023, and the "controller" under the EU and UK General Data Protection Regulation.

For any question about your personal data, contact us:
- Email: hygiene@goodbizglobal.com
- Phone and WhatsApp: +91 88847 99369
- Bengaluru, Karnataka, India

**What this policy covers**
This website, and enquiries you send us through its form, by email, on WhatsApp or by phone.

**What we collect**
- *Through the enquiry form:*
  - your name;
  - company (optional);
  - your email address and/or WhatsApp or phone number;
  - the products, quantity, destination country and port, and shipping terms you choose;
  - whether you want your own brand;
  - any notes;
  - the language of the page and the page you came from.
- *When it is saved:* your contact details are saved when you tap Next on the first step, so that we can reply even if you do not finish. Each later step adds your answers, and Send completes the enquiry.
- *By email, WhatsApp or phone:* what you choose to send us.
- *Technical data:* our hosting provider processes your IP address, browser type and the pages requested, to deliver the website and keep it secure. We do not use this to identify you.

We do not collect payment card details or identity documents through this website. We do not use analytics, advertising or tracking tools, and we do not use cookies.

**Why we use it**
- To reply to your enquiry, prepare quotations and samples, and follow up on that enquiry.
- If you become a customer, to carry out your orders and keep the business, tax and export records the law requires.

We do not sell your personal data, add you to a mailing list, or use it for profiling or automated decisions.

**Legal basis**
- *India:* you give us your personal data voluntarily for a specified purpose (replying to your enquiry), and we use it only for that purpose (section 7(a) of the Digital Personal Data Protection Act, 2023). If you tell us you no longer want us to use it, we will stop and delete it, except where the law requires us to keep it.
- *EU and UK:* taking steps at your request before entering into a contract (Article 6(1)(b) GDPR), our legitimate interest in answering business enquiries (Article 6(1)(f)), and, for business records, our legal obligations (Article 6(1)(c)).

**Who processes it for us**
- *Google* (Google Workspace, Google Sheets and Gmail) stores enquiry form answers and delivers our email.
- *Vercel Inc.* hosts this website.
- *WhatsApp (Meta)* is used only if you choose to message us on WhatsApp; WhatsApp's own privacy policy applies to that chat.
- *Google Translate* is used only if you choose the "translate" option in the language menu; the address of the page is then sent to Google.

If you place an order, we share only the details needed to complete it (for example your company name and delivery details) with the manufacturer, freight forwarder, customs broker, inspection agency or bank involved in that order. We also disclose data where the law requires it.

**Where it is stored**
Our service providers may store data on servers outside India, for example in the United States or the European Union. Indian law allows such transfers except to countries the Government of India restricts. For visitors in the EU and UK, these providers offer recognised safeguards such as Standard Contractual Clauses.

**How long we keep it**
- *Enquiries that do not lead to business:* deleted within 24 months of our last contact with you.
- *Customers:* we keep personal data for as long as the business relationship lasts and, after that, for as long as Indian tax, customs and foreign trade laws require us to keep records.
- *Hosting logs:* kept by our hosting provider for a short period.

**How we protect it**
- Access is limited to the people who answer enquiries.
- Our accounts are protected.
- The website uses encrypted connections (HTTPS).

If a personal data breach happens, we will inform you and the Data Protection Board of India as the law requires.

**Your rights**
- *Under India's Digital Personal Data Protection Act, 2023,* you can ask us to:
  - give you a summary of the personal data we hold about you and how we use it;
  - correct, complete, update or erase it;
  - withdraw consent where we rely on it;
  - resolve a grievance;
  - accept a nominee to act for you in case of death or incapacity.
- *If you are in the EU or UK,* you also have the rights of access, rectification, erasure, restriction, objection and data portability, and you can complain to your data protection authority.

To use any of these rights, email hygiene@goodbizglobal.com with the subject "Privacy request". We may ask you to confirm your identity. We reply as soon as we can and within 30 days. Grievances are resolved within the time the law allows, at most 90 days. If you are not satisfied with our answer, you can complain to the Data Protection Board of India.

**Children**
This website is for businesses. It is not intended for anyone under 18, and we do not knowingly collect their personal data.

**Cookies**
We do not use cookies. See our Cookie Policy (link /cookies/).

**Changes**
If we change this policy, we will update the date at the top of this page.

### Cookie Policy (English)

Last updated: 28 October 2026

**No cookies, no tracking**
This website does not use cookies. It has no analytics, advertising or social media trackers, and no embedded content from other websites, such as videos or maps. Fonts and images are served from our own website.

**What we store in your browser**
A few features keep information in your browser's own storage. It stays on your device: nothing is sent to us or anyone else unless you send an enquiry.

(The table from §1, in plain words, with three columns: What it remembers, Why, How long.)

**Why there is no cookie banner**
We store only what is strictly necessary for features you choose to use, and nothing is used to track you, so we do not need to ask for consent. If we ever add analytics or other tools that need your consent, we will update this page and ask you first.

**Clearing it**
You can delete this information at any time in your browser settings ("clear site data"). The HoReCa list also has a Clear button.

**Links to other websites**
- Links to WhatsApp, Google Translate and government or registration websites take you to sites with their own privacy and cookie policies.
- Nothing is sent to those sites until you click.

**Contact**
hygiene@goodbizglobal.com

## 4. Enquiry form notice (step 1), all 12 languages

Replace the current line, which says "Nothing is shared". That isn't strictly true, because Google stores the answers. The new line, with "Privacy Policy" a link to the localized /privacy/:

"We save these details when you tap Next, only to reply to your enquiry. We never sell them or add them to a mailing list. Privacy Policy"

## 5. Keyboard-friendly form (the step enquiry form, plus the HoReCa list)

Goal: a buyer can complete the whole enquiry with the keyboard alone, never losing their place. Verify each point below with browser tests, then fix what fails:
- Tab order follows the visual order on every step, including the summary Edit links and the product chips' remove buttons, and nothing hidden is focusable (inactive steps are `inert` or `hidden`).
- Option groups behave as WAI-ARIA radio groups:
  - one tab stop per group;
  - Arrow keys move the selection and never advance (this is already designed), and wrap around;
  - Home/End go to the first/last option;
  - Space/Enter selects and advances;
  - in RTL, Left/Right are mirrored.
- Enter in a text input means Next. Shift+Tab reaches Back.
- Escape closes the country suggestions without clearing the text, and Escape in an "other" text box does nothing harmful.
- After every step change, focus lands on the new step's heading and the step change is announced.
- After an error, focus goes to the first invalid field or group.
- After Edit, Next returns to the summary with focus on the edited row's Edit link.
- After Send, focus moves to the success or fallback heading.
- A visible focus ring on every control (`:focus-visible`) with at least 3:1 contrast against the card, and not clipped by `overflow`.
- Keyboard users never trigger the 260 ms auto-advance by tabbing through options.
- A skip link ("Skip to the enquiry form") at the top of /contact/, if the page lacks one; check the site-wide skip link already targets main content.
- No keyboard traps (the combobox listbox, the floating WhatsApp button, the language menu).

E2E tests:
- a full keyboard-only flow in en and ar (no mouse events);
- Home/End and wrap;
- Escape on the combobox;
- focus after Edit and after Send;
- a check that no element in an inactive step is focusable.

## 6. DPDP check

Add `docs/dpdp-compliance.md`, a plain checklist mapping each obligation that applies to a small Data Fiduciary to where the site or the business meets it, and what the owner must do themselves. Rows:
- notice and legal basis (s.5–7);
- contact for questions (s.8(9));
- rights (s.11–14) and the request route;
- grievance timelines;
- retention and erasure (s.8(7));
- security safeguards (s.8(5));
- breach notification (s.8(6));
- children (s.9);
- processors (s.8(2), contracts with Google and Vercel through their standard terms);
- cross-border transfer (s.16).

Note the phased commencement: the DPDP Rules were notified in November 2025, and most obligations apply 18 months later (May 2027). Do not state exact dates you cannot verify; say "phased; check the current dates".

Owner actions to list:
- turn on 2-step verification on the Google account;
- restrict sheet sharing;
- calendar a deletion sweep for enquiries older than 24 months;
- keep a simple breach log;
- reply to privacy requests within 30 days.

Do not claim the site is "certified" or "fully compliant". Say what is in place.

## 7. Gates

All existing gates pass, plus the new tests. `npm run check:placeholders` reports only the enquiry endpoint. Lighthouse accessibility stays at 100 on /contact/, /privacy/ and /cookies/.
