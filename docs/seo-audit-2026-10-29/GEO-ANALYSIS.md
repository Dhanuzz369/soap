# GEO analysis: www.goodbizhygiene.com, 29 October 2026

How ready the site is to be found and quoted by AI answers: Google AI Overviews and AI Mode, ChatGPT search, Perplexity, Claude and Copilot. Checked on the live site the day after launch.

Google's own guidance sets the frame: optimising for AI search "is still SEO". AI Overviews and AI Mode are built from Google's normal index; ChatGPT search and Copilot lean on Bing's. So the levers are the ordinary ones: being indexed, being a clear entity, and having passages worth quoting. `llms.txt` is reported below but carries no weight in the score, because no major AI provider has confirmed using it.

## GEO readiness score: 69 / 100

| Area | Weight | Score | Why |
| --- | --- | --- | --- |
| Citability | 25% | 80 | Every product page opens with a plain definition ("Detergent powder is a dry blend of…"), then spec tables and question headings |
| Structure | 20% | 85 | One h1, 6–13 h2s per page, tables on product pages and guides, short paragraphs |
| Multi-modal | 15% | 55 | Photos or illustrations with descriptive alt on every product; no video, charts or tools |
| Authority and brand | 20% | 25 | New domain: no mentions anywhere else, no linked profiles (`sameAs`), no named people |
| Technical access | 20% | 95 | Every page is complete without JavaScript; no crawler is blocked; dates in structured data |

**Platforms were not measured**: there is no tool here that queries ChatGPT or AI Overviews, and the site isn't indexed yet. In plain terms:
- **Google AI Overviews and AI Mode:** they draw from Google's index, so nothing happens until Search Console is verified and pages are indexed.
- **ChatGPT search and Copilot:** these use Bing's index. Bing has accepted all 564 pages through IndexNow; verifying in Bing Webmaster Tools confirms it.
- **Perplexity:** leans heavily on community sources (Reddit) and entity signals, the weakest area today.

## AI crawler access (robots.txt, live)

There is no `Disallow` rule anywhere. Each crawler is listed with what it controls:

| Controls | Crawler | Status |
| --- | --- | --- |
| Google Search, AI Overviews and AI Mode | Googlebot | Allowed |
| Bing, and through it ChatGPT search grounding and Copilot | Bingbot | Allowed |
| ChatGPT search citations | OAI-SearchBot | Allowed |
| Claude search citations | Claude-SearchBot | Allowed |
| Perplexity search | PerplexityBot | Allowed |
| Siri, Spotlight, Safari | Applebot | Allowed |
| DuckDuckGo AI answers | DuckAssistBot | Allowed |
| User-triggered fetches | ChatGPT-User, Claude-User, Perplexity-User | Allowed |
| Model training: OpenAI | GPTBot | Allowed |
| Model training: Anthropic | ClaudeBot | Allowed |
| Gemini and Vertex training and grounding (not Google Search) | Google-Extended | Allowed |
| Apple Intelligence training | Applebot-Extended | Allowed |
| Common Crawl dataset | CCBot | Allowed |
| Others (Bytespider, cohere-ai, Amazonbot, meta-externalagent) | `*` rule | Allowed |

Allowing the training crawlers is a choice, not a requirement for being cited. For a new exporter that wants to be known, allowing them is reasonable.

## llms.txt

`/llms.txt` (14.8 KB) and `/llms-full.txt` are present and well formed:
- an entity statement ("merchant exporter… does not manufacture");
- key facts (HSN, Incoterms, lead time, contacts, registrations);
- one line and a link for every product and guide.

Google says these files neither help nor hurt. Other AI tools may read them. No change is needed.

## Brand mentions

Searches for "GoodBiz Hygiene" and "goodbizhygiene.com" on 29 October found nothing:
- no Wikipedia, Wikidata, Reddit, YouTube or LinkedIn presence;
- no directory listing;
- one link from goodbizglobal.com, which search engines have not yet crawled.

This is the gap that matters most. Third-party studies (Ahrefs, 2025) found brand mentions correlate with AI citations about three times more strongly than backlinks.

## Passage-level citability

Strong passages, ready to be quoted:
- **Product definitions:** the opening paragraph of each product page (54–57 words) answers "what is X" outright. Example: /products/labsa/, "LABSA (Linear Alkyl Benzene Sulphonic Acid) is the main anionic surfactant…".
- **Spec tables:** every product page has one, with typical values.
- **The HSN guide:** /blog/hsn-code-3401-vs-3402-soaps-detergents/ has a product-by-product table, the HS 2022 note, and sources (WCO, DGFT, CBIC).

Weak spots:
- **Home page.** It opens with "One merchant exporter between you and the manufacturer: the quote, the samples…". That's a good line for people, but there is no plain "GoodBiz Hygiene is…" sentence near the top for an answer engine to quote when asked who the company is. It has no dates in its structured data either.
- **HSN guide opening.** It starts with a teaser question ("Not sure whether your soap or detergent is HSN 3401 or 3402?"). The answer comes later. Answer engines favour pages that answer in the first lines.
- **Private-label dish wash.** No passage answers "private label dish wash liquid India" on its own. It is covered only by the general /private-label/ page.

## Server-side rendering

All content is in the HTML the server sends, so crawlers that don't run JavaScript (GPTBot and PerplexityBot among them) see everything. Words visible without JavaScript: home 1,049; detergent powder 1,365; LABSA 1,157; HSN guide 1,998. Structured data and meta tags are in the raw HTML too.

## Top 5 highest-impact changes

1. **Verify Google Search Console and Bing Webmaster Tools; submit `sitemap-index.xml`** (owner, 15 minutes). Every AI surface above depends on one of those two indexes.
   - *Worked when:* Search Console shows the sitemap read and pages indexed, and Bing shows the site indexed.
2. **Give the company a presence outside its own site** (owner):
   - a LinkedIn company page;
   - a free **FIEO member profile on GlobalLinker** (fieo.globallinker.com; GoodBiz is a FIEO member);
   - IndiaMART and TradeIndia listings;
   - a Google Business Profile.

   Then send the addresses so they go into `sameAs`.
   - *Worked when:* asking ChatGPT or Perplexity "Who is GoodBiz Hygiene?" returns the Bengaluru merchant exporter (check monthly).
3. **Correct goodbizglobal.com's structured data** (owner; it is a separate site). It lists goodbizhygiene.com under `sameAs` ("the same organisation"). It should be `subOrganization`; the exact code is in `docs/backlinks-kit.md`. This site already declares GoodBiz Global as its parent, so the two will then agree.
   - *Worked when:* a schema validator on goodbizglobal.com shows `subOrganization`.
4. **Three on-site passages** (ready to do):
   - a plain one-sentence definition of the company near the top of the home page;
   - a direct answer in the first lines of the HSN guide ("Soaps are classified under HSN 3401; detergents and cleaning preparations under 3402…");
   - a self-contained private-label dish wash section.

   Facts only.
   - *Worked when:* AI answers quote these passages for "who is GoodBiz Hygiene", "HSN code for soap" and "private label dish wash liquid India".
5. **Real community and video presence** (owner, ongoing):
   - Answer genuine HSN and import questions on Reddit or Quora as yourself, without promotion.
   - Post one short YouTube walkthrough of how an export order runs.
   - *Worked when:* those posts get engagement, and the brand starts appearing in Perplexity answers.

## Schema recommendations

- **`sameAs`** on the Organization, filled from `profiles` once the profiles exist. The code is already in place; the list is empty.
- **`identifier`** (IEC) on the Organization, only if you are willing to publish the number. It lets anyone verify the company with DGFT.
- **A named `author` (Person)** on guides, only if a real person with export experience writes or reviews them.
- **No new FAQPage.** Google retired FAQ rich results on 7 May 2026. The existing markup is harmless, and the visible questions still help readers.

## Content reformatting suggestions

| Page | Now | Suggested |
| --- | --- | --- |
| Home, first lines | "One merchant exporter between you and the manufacturer: the quote, the samples…" | Keep it, and add one plain sentence close by: "GoodBiz Hygiene, a unit of GoodBiz Global in Bengaluru, is a merchant exporter of soaps, detergents, cleaners and soap raw materials from India. It sources from vetted Indian manufacturers and does not manufacture." |
| HSN guide, first lines | "Not sure whether your soap or detergent is HSN 3401 or 3402?…" | Lead with the answer: "Soaps, including toilet, laundry and liquid soaps, fall under HSN 3401; detergents, surfactants and cleaning preparations fall under 3402. The 8-digit code depends on the product…", then the existing text. |
| /private-label/ | General private-label page | Add a "Private label dish wash liquid" section (~150 words): bottle and can formats, label MOQ approach, artwork steps, sample terms. Use only figures you can stand behind. |
