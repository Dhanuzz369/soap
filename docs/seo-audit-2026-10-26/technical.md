# Technical SEO audit, 2026-10-26

Target: https://soap-gules.vercel.app/ (Astro static, 12 languages, pre-launch mode, `launchReady: false`).

Technical score: **A (live state, graded for pre-launch intent) 88/100. B (launch readiness, as the code stands today) 74/100.** Headline score: **78/100**.
The code paths are well built. The score loses points for missing Vercel-level config (no vercel.json), thin security headers, and a few launch-day traps.

## Category status

| Category | Live (A) | Launch (B) |
|---|---|---|
| Crawlability | PASS (intentional block: robots `Disallow: /`, no sitemap) | PASS in code, FAIL on *.vercel.app duplicate host unless handled |
| Indexability | PASS (noindex on all pages incl. 404) | Needs checks (F1, F2, F3) |
| Security | PARTIAL: HSTS only | PARTIAL until vercel.json |
| URL structure | PARTIAL: no-slash URLs return 200 | Same, see F4 |
| Mobile | PASS (viewport, responsive hero preload) | PASS |
| Core Web Vitals (source) | PASS likely | PASS likely |
| Structured data | PASS (Organization, WebSite, BreadcrumbList, BlogPosting, FAQPage present) | PASS |
| JS rendering | PASS (full SSG HTML, JS is enhancement only) | PASS, see F9 |
| IndexNow | Dormant by design | PASS in code, see F10 |

## Impact of the pre-launch mode (graded, not a bug)

Live state is consistent: robots.txt `User-agent: * / Disallow: /`, `<meta name="robots" content="noindex, nofollow">` on `/`, `/zh/products/floor-cleaner/`, 404. Sitemap probes (`/sitemap.xml`, `/sitemap_index.xml`, `/sitemap-index.xml`, `/wp-sitemap.xml`) are all 404 (helper: 0 found, 0 declared). Impact: zero search visibility today, which is the intent. Two real side effects:
1. `Disallow: /` hides the `noindex` tag from crawlers, so noindex is not what is protecting you. If anyone links to the vercel.app URL, Google can list the bare URL with no snippet. See F1.
2. Canonical, hreflang and og:url point to www.goodbizhygiene.com, which does not resolve. Link previews (WhatsApp, LinkedIn) of the vercel.app URL will fetch og:image from a dead host, so shares show no image. Acceptable pre-launch, but do not share vercel.app links with buyers expecting rich previews.

## Findings

### F1. Launch: the `*.vercel.app` host will stay live and duplicate the whole site (High)
Evidence: no `vercel.json` in the repo. Vercel keeps serving the `soap-gules.vercel.app` alias after a custom domain is attached. Pages there will carry `index, follow` once `launchReady` is true, and robots.txt there will be `Allow: /` plus a Sitemap line pointing to www. Canonical points to www, so Google will mostly consolidate, but the duplicate host still gets crawled and can outrank in odd cases.
Fix: in the Vercel dashboard set www.goodbizhygiene.com as primary and redirect the apex and the `.vercel.app` alias to it (Domains settings: "Redirect to"). If the alias redirect is not available for the production alias, add to `vercel.json`:
```json
{ "redirects": [{ "source": "/(.*)", "has": [{ "type": "host", "value": "soap-gules.vercel.app" }],
  "destination": "https://www.goodbizhygiene.com/$1", "permanent": true }] }
```
Also decide apex vs www and redirect the other with 308.
How we'd know it failed: `curl -sI https://soap-gules.vercel.app/products/` returns 200 instead of 308 to www, or Google Search Console shows "Duplicate, Google chose different canonical" for vercel.app URLs; `site:soap-gules.vercel.app` returns results.

### F2. Launch: preview deployments will be indexable (High)
Evidence: `BaseLayout.astro` line 125 and `src/pages/robots.txt.ts` depend only on `site.launchReady`, not on the Vercel environment. Once it is true, every preview URL (`soap-git-branch-*.vercel.app`) builds with `index, follow` and `Allow: /`. Vercel adds `x-robots-tag: noindex` to previews only for password or SSO protected deployments by default; verify in project settings. Live check: no `x-robots-tag` header on the production alias today (expected).
Fix: drive launch mode from the environment: `launchReady = LAUNCH && process.env.VERCEL_ENV === 'production'`. And add a header rule for non-production hosts in vercel.json using a `has` host condition for `.*\.vercel\.app`: `X-Robots-Tag: noindex, nofollow`. Keep Deployment Protection on for previews.
How we'd know it failed: `curl -sI <preview-url>/ | grep -i x-robots-tag` is empty and `curl <preview-url>/robots.txt` shows `Allow: /`.

### F3. Launch: canonical/og/hreflang/sitemap all derive from one `site.url`; a typo or apex/www mismatch breaks them together (Medium)
Evidence: `astro.config.mjs` `site: site.url`, canonical via `absoluteUrl()`, robots Sitemap line `${base}/sitemap-index.xml`. Code looks right: sitemap integration is only added when `launchReady`, emits `sitemap-index.xml` + `sitemap-0.xml`, filters the 404, adds 12 hreflang alternates plus x-default, and `zh` maps to `zh-Hans` consistently in head and sitemap. Verified live head: self-referencing canonical, reciprocal hreflang set of 12 plus x-default on `/` and `/zh/products/floor-cleaner/`.
Risk: `llms.txt` alternate link in the head (`https://www.goodbizhygiene.com/zh/llms.txt`) is emitted while `noindex` too; fine, those files exist (200 for /llms.txt, /zh/llms.txt, /ar/llms.txt).
Fix: add a post-build test (tests/build) that, with launchReady true and the real URL, asserts: all canonicals start with the site URL, sitemap-0.xml has no `soap-gules` or `localhost`, robots has no `Disallow: /`, no page has `noindex` except 404. Run it in CI before flipping the flag.
How we'd know it failed: Search Console "Alternate page with proper canonical tag" count is huge for www URLs, or "Submitted URL marked noindex".

### F4. Trailing-slash duplicates: `/products` returns 200 instead of redirecting to `/products/` (Medium)
Evidence: `curl -sI https://soap-gules.vercel.app/products` gives HTTP/2 200 with the same etag and 84964 bytes as `/products/`. Astro is `trailingSlash: 'always'` and canonical has the slash, but Vercel serves both. Every one of about 541 URLs has a second crawlable form.
Fix: in vercel.json set `"trailingSlash": true` (Vercel then 308-redirects `/products` to `/products/`). Verify static assets like `/favicon.ico`, `/llms.txt`, `/robots.txt` are unaffected (Vercel skips paths with file extensions).
How we'd know it failed: `curl -sI https://<domain>/products | head -1` is 200, not 308; Search Console shows non-slash URLs as "Duplicate without user-selected canonical".

### F5. Security headers: only HSTS is sent (Medium)
Evidence from live headers: `strict-transport-security: max-age=63072000; includeSubDomains; preload` (Vercel default) and `access-control-allow-origin: *`. Missing: Content-Security-Policy, X-Content-Type-Options, X-Frame-Options or frame-ancestors, Referrer-Policy, Permissions-Policy. No vercel.json exists. Also, `preload` in HSTS with includeSubDomains is Vercel's default but only matters once the real domain is on the preload list; make sure no subdomain of goodbizhygiene.com (e.g. mail) is HTTP-only before submitting.
Fix, vercel.json `headers` for `/(.*)`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. Start CSP in Report-Only: the site uses inline scripts (language detect, scroll reveal, JSON-LD), so it needs hashes or `'unsafe-inline'`. Set `Access-Control-Allow-Origin` only where needed (fonts) rather than `*` on HTML.
How we'd know it failed: securityheaders.com grade below B; `curl -sI` lacks `x-content-type-options`.

### F6. Caching: fonts and images revalidate on every visit (Low to Medium)
Evidence: `/_astro/*` hashed CSS/JS is already `max-age=31536000, immutable` (verified). But `/fonts/geist-latin-wght-normal.woff2` is `public, max-age=0, must-revalidate`, and `/images/*` (unhashed names) likely the same, as is all HTML (correct for HTML).
Fix: vercel.json headers for `/fonts/(.*)`: `Cache-Control: public, max-age=31536000, immutable` (font filenames are stable), and `/images/(.*)`: `public, max-age=604800, stale-while-revalidate=86400` (names are not hashed).
How we'd know it failed: repeat-visit Lighthouse flags "efficient cache policy"; `curl -sI .../fonts/geist-latin-wght-normal.woff2 | grep -i cache-control` lacks a long max-age.

### F7. Non-English 404 handling: single global 404 (Low)
Evidence: `/nonexistent-xyz` returns a real 404 status with `noindex` (good, correct status, not soft-404). One English `404.html` serves all languages, including `/ar/nope/`. No canonical or hreflang on it (correct).
Fix: acceptable; optionally add a small client-side language hint. No SEO action needed. Make sure 404 stays out of the sitemap (it is filtered).
How we'd know it failed: Search Console "Soft 404" entries.

### F8. HTTPS (Pass)
Evidence: `http://soap-gules.vercel.app/products/` returns 308 to https; HTTP/2; HSTS present. No mixed content found in sampled head resources (all relative). After the domain is added, confirm cert issuance for both apex and www and the http to https 308 on the real domain.
How we'd know it failed: `curl -sI http://www.goodbizhygiene.com/` is not 301/308 to https.

### F9. JS rendering and auto language redirect (Low to Medium)
Evidence: full HTML is server-rendered (hero h1 and body text in the raw source, 11 script tags: JSON-LD, small inline scripts, two module scripts for HeroFan and QuoteCard). No SPA shell; no rendering needed for indexing. Risk: `BaseLayout.astro` lines 102-114 runs a client-side `location.replace('/<lang>/...')` on English pages for visitors whose browser language is supported, unless the user agent matches the bot regex. Cloaking-adjacent if misjudged, and Google evaluates with a Chrome UA that includes "Googlebot", so it is safe. But the regex does not cover all tools (e.g. generic Chrome-based fetchers with `en` language are fine because language is `en`). A buyer in Germany opening a shared English product link is bounced to /de/, which is a UX feature but can confuse link sharing; it also uses a client redirect, not hreflang-aware server logic.
Fix: keep. Add `Vary`-free behaviour as is, and make sure the redirect never runs on a URL with `?lang=` or when referrer is a search result for that language. Confirm in Search Console URL Inspection (live test) that the English home is fetched as English.
How we'd know it failed: URL Inspection screenshot shows a non-English page for an English URL, or English pages missing from the index while /de/ etc. are present.

### F10. IndexNow (Pass, dormant)
Evidence: `scripts/indexnow.mjs` + `indexnow-lib.mjs` exist, read `dist/sitemap-N.xml` (matches Astro's `sitemap-0.xml`), refuse to run unless `launchReady` and the live domain serves `public/<key>.txt` (key file `1ea134f5...txt` is live now, 32 chars, body equals filename). Good safeguards. Only Bing, Yandex, Naver, Seznam consume it; Google does not.
Fix: after launch run `npm run build && npm run indexnow` once, then on each deploy. Consider wiring it into a Vercel production-only build hook, not previews.
How we'd know it failed: IndexNow returns 4xx (403 key mismatch, 422 host mismatch); Bing Webmaster Tools "URL submission" shows no IndexNow activity.

### F11. Mobile and Core Web Vitals potential (Pass, with notes) (Low)
Evidence: `<meta name="viewport" content="width=device-width, initial-scale=1">`; responsive LCP image preload with `imagesrcset`, `imagesizes` and `fetchpriority="high"` on `/`; fonts preloaded (Geist, Newsreader italic); base64 inline LQIP for the hero fan; reveal-on-scroll limited to below-fold. Homepage HTML 52 KB, `/horeca/` 93 KB, `/products/` 85 KB (all fine). Notes: the hero preload `href` is the 1448w file while srcset offers smaller widths; browsers that honor `imagesrcset` use the srcset, so OK. The `/horeca/` interactive hotspot cards are the main INP risk; test on a throttled mobile profile after launch. I did not run Lighthouse here (source inspection only).
Fix: run PageSpeed Insights on `/`, `/products/`, `/horeca/` and the `/ar/` RTL home once on the real domain; collect CrUX after 28 days.
How we'd know it failed: LCP above 2.5 s, INP above 200 ms or CLS above 0.1 in Search Console Core Web Vitals report.

### F12. Meta and structured data (Pass) (Low)
Evidence: unique title and description on sampled pages; `keywords` meta is emitted (ignored by Google, harmless). JSON-LD on the sample blog post: Organization, WebSite, WebPage, BreadcrumbList, BlogPosting, FAQPage, ImageObject. Note FAQPage rich results are restricted to government and health sites since 2023, so no SERP benefit, only machine readability. Organization `sameAs` is empty (`profiles: []`) and contact data is placeholder; the `check:placeholders` script should be a launch gate.
Fix: run `npm run check:placeholders` in CI and fail the production build if `launchReady` is true while `contactIsPlaceholder` is true. Fill `profiles` with LinkedIn, IndiaMART and so on.
How we'd know it failed: placeholder email or phone appears in JSON-LD or `llms.txt` on the live domain.

## Launch checklist (do in this order)
1. Buy domain, add apex and www in Vercel, choose primary, redirect the other and the `.vercel.app` alias (F1, F3).
2. Add vercel.json: `trailingSlash: true`, security headers, immutable cache headers, vercel.app host redirect or noindex header (F1, F2, F4, F5, F6).
3. Gate `launchReady` on `VERCEL_ENV === 'production'` (F2).
4. Fill contact, `site.url`, `profiles`; set `launchReady: true`; run build tests (F3, F12).
5. After deploy verify: `/robots.txt` has Allow and Sitemap, `/sitemap-index.xml` returns 200 with sitemap-0.xml listing about 540 URLs and hreflang, no `noindex` on pages, 404 status for junk URLs.
6. Submit the sitemap in Google Search Console and Bing Webmaster Tools, run `npm run indexnow`.

## Top 5
1. F1 vercel.app duplicate host (High)
2. F2 preview deployments indexable once launched (High)
3. F4 no-slash URL duplicates (Medium)
4. F5 only HSTS, no other security headers (Medium)
5. F6 no long-term caching on hashed assets (Medium)
