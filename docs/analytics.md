# Google Analytics 4: owner guide

The site sends visits and a few events to Google Analytics 4 (property measurement ID `G-FWEG9Y5FVS`, set in `src/config/site.ts` → `analytics.ga4`). Design: `docs/superpowers/specs/2026-11-01-analytics-consent-design.md`.

**Where it runs** (the same approach as goodbizagro.com and goodbizpower.com, with a wider list):

- **Asked first:** the EU, the EEA, the UK, Switzerland, and every country where one of the site's other languages is spoken (the Arab countries, French-, Spanish- and Portuguese-speaking countries, Russia, China, Turkey, Indonesia, Kenya, Tanzania, Uganda, Vietnam…; the full list is `src/lib/consent-regions.ts`). Visitors there see the cookie banner, and Google's code is not loaded until they click Accept.
- **By default everywhere else** (India, the USA, …): no banner; GA4 counts the visit straight away. "Cookie settings" in every footer turns it off.
- The browser's time zone tells the site which case applies; Google also checks the visitor's approximate location and keeps cookies off for anyone from an ask-first country who has not accepted.
- Only on the live domain (www.goodbizhygiene.com): never on Vercel previews, `*.vercel.app` or your own computer.

GA4 still shows fewer visitors than really come (ask-first visitors who reject or ignore the banner, and ad blockers), so Search Console's click counts will stay a little higher. To change the list, edit `src/lib/consent-regions.ts`, run `npm run consent:zones`, and update the country wording in the Cookie Policy (all 12 languages).

To switch analytics and the banner off completely, set `analytics.ga4` to `''`, then update the Cookie and Privacy Policies (and their 11 translations) before you deploy.

## 1. What is tracked

- **Page views**, with the page address cleaned first: only `?product=` and campaign tags (`utm_*`, `gclid`) are kept. What a buyer typed into the "Request a quote" box (`?message=`) is never sent.
- **Events** (custom parameters are product, range and step keys only, never names, emails, phones, companies or notes):

| Event | When | Parameters |
| --- | --- | --- |
| `generate_lead` | Step 1 of the enquiry form (contact details) saved to the sheet, once per enquiry | `lead_source`, `product`, `language` |
| `enquiry_step` | Each later step of the form completed | `step`, `language` |
| `enquiry_sent` | The enquiry sent successfully | `group`, `product`, `terms`, `language` |
| `enquiry_fallback` | The WhatsApp / email panel shown instead | `reason` (`no_endpoint`, `error`, `timeout`) |
| `contact_click` | A WhatsApp, email or phone link clicked anywhere | `method`, `location` (`header`, `footer`, `fab`, `form`, `page`) |
| `quote_start` | The "Request a quote" box sent to the contact form | `product` |
| `language_change` | A language picked in the language menu | `to` |

## 2. Settings to change in GA4 (once)

All in **Admin** (the gear, bottom left).

1. **Data retention:** Data collection and modification → Data retention → **14 months**. Do this first: the Privacy Policy says 14 months, and GA4's default is only 2.
2. **Google signals: off.** Data collection → Google signals data collection stays off. The site also tells the tag not to use signals or ad personalisation.
3. **Key events:** Data display → Events → mark **`generate_lead`** and **`enquiry_sent`** as key events (they appear in the list after the first one happens).
4. **Custom dimensions:** Data display → Custom definitions → Create custom dimension, scope **Event**, one each for the event parameters `product`, `group`, `step`, `method`, `language` (and, if you want them in reports, `terms`, `location`, `reason`, `to`).
5. **Internal traffic:** Data streams → your stream → Configure tag settings → Define internal traffic → add your office/home IP address. Then Data collection and modification → Data filters → set the "Internal Traffic" filter to **Active** (test it first in "Testing" state).
6. **Search Console:** Product links → Search Console links → link the property once Search Console is verified (README §6, step 6).
7. **Enhanced measurement:** Data streams → your stream → Enhanced measurement: keep **Page views**, **Scrolls** and **File downloads** on; turn **Site search off** (the site has none) and **Outbound clicks off** (`contact_click` already counts WhatsApp, email and phone clicks, with cleaner labels). Turn **Form interactions** off too (the enquiry form has its own events). Even if these stay on, no personal data leaks: the enquiry form's WhatsApp and email links keep a plain address (`wa.me/<number>`, `mailto:<address>`) and add the buyer's message only at the moment of the click.

## 3. Check that it works (DebugView)

1. Install the "Google Analytics Debugger" extension in Chrome and switch it on.
2. Open https://www.goodbizhygiene.com/ in a private window, click **Accept**, browse a product, click WhatsApp, start the enquiry form.
3. In GA4: Admin → DebugView. Your events appear within a few seconds. Check that no parameter shows a name, email or phone.
4. Reject and reopen with **Cookie settings** (footer): no more events should arrive.

Remember your own visits count unless the internal-traffic filter is active.

## 4. Links you share: add UTM tags

GA4 can only say where buyers came from if the link says so. Add three tags to every link you post yourself:

- `utm_source`: the website or app (`indiamart`, `tradeindia`, `alibaba`, `linkedin`, `whatsapp`, `email`)
- `utm_medium`: the kind of link (`listing`, `social`, `message`, `signature`)
- `utm_campaign`: what it is for (`profile`, `product_listing`, `guide_share`, `oct_promo`)

Lower case, no spaces. Examples:

- IndiaMART company profile: `https://www.goodbizhygiene.com/?utm_source=indiamart&utm_medium=listing&utm_campaign=profile`
- IndiaMART LABSA listing: `https://www.goodbizhygiene.com/products/labsa/?utm_source=indiamart&utm_medium=listing&utm_campaign=product_listing`
- LinkedIn post sharing a guide: `https://www.goodbizhygiene.com/blog/import-dish-wash-liquid-from-india/?utm_source=linkedin&utm_medium=social&utm_campaign=guide_share`
- WhatsApp message to a buyer: `https://www.goodbizhygiene.com/products/detergent-powder/?utm_source=whatsapp&utm_medium=message&utm_campaign=followup`
- Email signature: `https://www.goodbizhygiene.com/?utm_source=email&utm_medium=signature&utm_campaign=signature`

Do not add UTM tags to links between the site's own pages, and never put a buyer's name or email in a tag.

## 5. A weekly 10-minute report

In GA4 → Reports (or one saved Exploration):

1. **Key events by source:** Acquisition → Traffic acquisition, with the key events column (`generate_lead`, `enquiry_sent`). Which listings and channels bring real enquiries, not just visits?
2. **Top products by enquiry:** Engagement → Events → `generate_lead` and `enquiry_sent`, broken down by the `product` and `group` dimensions.
3. **Landing pages:** Engagement → Landing page. Which pages start the visits that end in an enquiry?
4. **Countries:** User attributes → Demographic details → Country, with key events. Compare with the languages you are investing in.
5. **Drop-off:** `enquiry_step` by `step`. A step where many stop is worth a closer look; `enquiry_fallback` by `reason` shows when the sheet is not answering.

Write down three numbers each week (enquiries, top source, top product) so trends are visible without opening GA4.
