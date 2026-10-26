# Performance audit: https://soap-gules.vercel.app/ (2026-10-26)

Method: PageSpeed Insights API was rate-limited (HTTP 429 on all 14 requests), so lab data comes from local Lighthouse 13.5.0 (Chrome headless, default Lighthouse mobile throttling and desktop preset). Mobile and desktop runs per URL were executed in parallel pairs, so single numbers carry noise. Home mobile was re-run 3 times sequentially for variance. Raw JSON is in the session scratchpad (lh/).

Field data: none. A new site has no CrUX entry, so Core Web Vitals pass/fail cannot be assessed from real users. INP is represented by TBT only (lab proxy).

Performance score (0-100): **93** (mobile 96-100, desktop 100 on every page except as noted; deducted for cache headers, LCP render delay, image oversizing).

## Lab results

| Page | Mobile score | LCP | FCP | TBT | CLS | TTFB | Weight | Desktop score / LCP |
|---|---|---|---|---|---|---|---|---|
| / | 96 (seq. reruns 98-99) | 1.76s | 0.93s | 1-118ms | 0 | 27ms | 401KB | 100 / 0.48s |
| /products/ | 100 | 1.76s | 0.94s | 0 | 0 | 28ms | 557KB | 100 / 0.73s (844KB) |
| /products/dish-wash-liquid/ | 100 | 1.66s | 0.91s | 0 | 0 | 25ms | 181KB | 100 / 0.39s |
| /horeca/ | 100 | 1.54s | 0.98s | 4ms | 0 | 26ms | 414KB | 100 / 0.47s |
| /export-process/ | 100 | 1.57s | 0.97s | 0 | 0 | 28ms | 325KB | 100 / 0.41s |
| /ar/ | 96 | 2.13s | 1.53s | 0 | 0 | 27ms | 470KB | 100 / 0.40s |
| /zh/ | 97 | 1.76s | 1.24s | 176ms | 0 | 27ms | 402KB | 100 / 0.42s |

All LCP values are inside the 2.5s "good" band, CLS is 0, and TBT is under the 200ms INP-proxy comfort level. Origin/edge TTFB is excellent (x-vercel-cache: HIT, bom1 edge, about 0.16s curl wall time to first byte including TLS from this machine).

Transport: HTTP/2 confirmed on every request (Lighthouse protocol column = h2). HTTP/3 could not be confirmed: local curl lacks h3 and the response carried no alt-svc header. Brotli is on (content-encoding: br for HTML and CSS). HTML 13KB transferred, JS 2-6KB per page (no framework runtime), CSS 15-20KB, images WebP only, fonts WOFF2 only.

Render-blocking: two CSS files on home (BaseLayout 15KB, Home 4KB) with about 150ms estimated wasted on mobile throttling. No blocking JS. Both are small and Astro hashed.

Fonts: Geist (29KB) and Newsreader italic (63KB) are preloaded, WOFF2, font-display audit passes. /ar/ preloads Geist plus IBM Plex Sans Arabic 400 only; the 300 and 600 weights (44KB and 45KB) are not preloaded and load late. Arabic page font total is 164KB versus 94KB for other languages.

## Findings

### 1. Fonts, images, manifest and favicon are not cached (Medium)
- Evidence: `curl -I` on /fonts/geist-latin-wght-normal.woff2, /images/hero/herbal-ayurvedic-soap-640.webp, /images/grain.png, /favicon.svg, /site.webmanifest all return `cache-control: public, max-age=0, must-revalidate`. Only /_astro/*.css and .js return `public, max-age=31536000, immutable`. Static files in /public get Vercel's default.
- Impact: every repeat view and every page navigation revalidates about 20 files (up to 530KB of images and 94KB of fonts) with conditional requests. Lighthouse cache audit does not flag it because lab runs are cold, so this is invisible in the score but hurts real repeat visitors on slow mobile links.
- Fix: add headers in vercel.json for `/fonts/(.*)` and `/images/(.*)` with `public, max-age=31536000, immutable` (rename or hash files when they change), and a shorter value (for example 1 day) for favicon.svg, site.webmanifest and apple-touch-icon.
- How we'd know it failed: `curl -sI <asset>` on any /fonts or /images file still shows max-age=0, or a second Lighthouse/DevTools reload shows 304 responses instead of "(disk cache)".

### 2. Home hero LCP has a large element render delay (Medium)
- Evidence: LCP is the fan-card hero image (div#fan-stage a.fan-card img, 640w WebP, fetchpriority=high, preloaded, discoverable). Breakdown of the 4 runs: TTFB 62-132ms, load delay 22-48ms, load duration 59-110ms, but element render delay 223ms, 424ms, 2,121ms and 2,993ms. LCP also differs by locale (/ar/ 2.13s vs /products/dish-wash-liquid/ 1.66s). HeroFan script produced 50-75ms long tasks at 0.8-1.8s on /, /zh/, /ar/.
- Impact: image arrives in about 200ms but paints late when the main thread or the entrance animation is busy; this is the main risk to the 2.5s LCP threshold on slower real phones, and the cause of the 96 vs 99 score swing. /zh/ also shows a 516ms task on the document (TBT 176ms).
- Fix: make the first fan card visible at first paint (no opacity:0 or transform start state on the LCP card, animate the others), keep animation on transform/opacity only, and run the HeroFan init in requestIdleCallback or after the first frame; split any work over 50ms. Investigate the 516ms document task on /zh/ (CJK text layout or font fallback).
- How we'd know it failed: Lighthouse lcp-breakdown-insight element render delay above 500ms on /, or mobile LCP above 2.5s, or TBT above 200ms on /zh/ in repeated runs. Once field data exists, p75 LCP above 2.5s.

### 3. Images served larger than displayed (Low to Medium)
- Evidence: image-delivery insight estimated savings: /horeca/ 259KiB, /export-process/ 163KiB, home/ar/zh 116KiB, dish-wash-liquid 42KiB. Examples: kochi-port-night.webp 1200x900 (91KB) shown at 370x278 on mobile even though a -600 variant exists in srcset; herbal-ayurvedic-soap-640 shown at 338x253; neem-leaves.webp 101KB; /products/ desktop 735KB over 34 requests. All formats are already WebP.
- Fix: correct `sizes` values so mobile picks 480-600w (the Kochi image sizes attribute `(max-width: 900px) 92vw` resolves to a larger candidate than needed at DPR 2-2.6; add 400/480w variants), generate 1x and 2x tiers at about 360w, consider AVIF for photos, and keep below-the-fold images loading=lazy (already true).
- How we'd know it failed: image-delivery insight still reports above 50KiB savings on any page, or mobile page weight on /products/ exceeds about 500KB.

### 4. Two small render-blocking CSS files (Low)
- Evidence: render-blocking insight lists BaseLayout.DXBRFqQX.css (14.9KB) and Home.DyQXEryx.css (4.5KB), about 150ms estimated mobile savings. Page FCP is 0.9-1.0s on mobile (1.5s on /ar/).
- Fix: set Astro `build.inlineStylesheets: 'auto'` (or 'always' since CSS is under 20KB) so critical CSS is inlined and one request disappears; keep the immutable hashed file for the rest.
- How we'd know it failed: render-blocking insight still lists stylesheets, or FCP above 1.8s on mobile.

### 5. Arabic page loads three Arabic font weights, two not preloaded (Low)
- Evidence: /ar/ transfers IBM Plex Sans Arabic 300 (44KB), 400 (42KB), 600 (45KB); only 400 is preloaded. Font total 164KB versus 94KB elsewhere; FCP 1.53s vs 0.93s on /.
- Fix: drop the 300 weight or use a variable font file, preload the second weight actually used above the fold (600 if used by headings), keep font-display swap with a size-adjusted fallback.
- How we'd know it failed: /ar/ FCP stays above 1.2s mobile, or visible font swap/layout shift (CLS above 0.01) on /ar/.

### 6. HTTP/3 not verified (Info)
- Evidence: HTTP/2 confirmed, no alt-svc in response headers, and local curl cannot test h3.
- Fix: verify with `curl --http3` on a build with h3 or Chrome DevTools Protocol column (h3). Vercel supports HTTP/3 at the edge, no site change needed.
- How we'd know it failed: DevTools Network Protocol shows h2 for all requests on a repeat visit from a h3-capable client.

### 7. PSI and field data gaps (Info)
- PSI API returned 429 for all pages; rerun `pagespeed_check.py` later for official Lighthouse mobile/desktop figures (expected to match closely since both use Lighthouse 13.5.0).
- No CrUX data. Revisit 28 days after traffic arrives; check LCP image subparts, INP and CLS at p75.
- How we'd know it failed: crux_history.py still returns 404 after meaningful traffic, meaning the origin is not being collected (possible with low volume); fall back to RUM (web-vitals library).

## Page-specific notes
- /products/: CSS marquee did not cause CLS (0) or blocking (TBT 0). Desktop weight 844KB is the highest in the site because of the shelf images (34 requests).
- /horeca/ and /export-process/: LCP element is text (span) with about 1.2s render delay on mobile; no SVG-related long tasks or CLS. Check that hero text is not hidden by an entrance animation (same fix as finding 2).
- /products/dish-wash-liquid/: lightest page (181KB, 11 requests), LCP 1.66s.
