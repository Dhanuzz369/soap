# Sitemap validation: www.goodbizhygiene.com, 29 October 2026

Checked live, after the domain setup was put back to www as the main address (`goodbizhygiene.com` → 308 → `www.goodbizhygiene.com`, one hop).

**Result: valid. No critical, high or medium issues.**

## Files

| File | Status |
| --- | --- |
| `/robots.txt` | Declares `Sitemap: https://www.goodbizhygiene.com/sitemap-index.xml` |
| `/sitemap-index.xml` | Valid sitemap index, 1 entry (`sitemap-0.xml`), lastmod = newest page date |
| `/sitemap-0.xml` | Valid XML, 564 URLs, 879 KB (limits: 50,000 URLs and 50 MB) |
| `/sitemap.xml` | 308 redirect to `/sitemap-index.xml` (for tools that guess the default name) |

The sitemap is generated at every build by `@astrojs/sitemap` (`astro.config.mjs`), so it can't drift from the site. Submit `https://www.goodbizhygiene.com/sitemap-index.xml` in Google Search Console and Bing Webmaster Tools.

## Checks

| Check | Result |
| --- | --- |
| Every URL returns HTTP 200 | ✅ 564 / 564, fetched as Googlebot |
| No redirected URLs | ✅ 0 |
| Only canonical URLs (each page's canonical equals its `<loc>`) | ✅ 564 / 564 |
| No noindexed URLs | ✅ 0 (the 404 page is excluded) |
| HTTPS on the main host only | ✅ all `https://www.` |
| No duplicates | ✅ 0 |
| `<priority>` / `<changefreq>` (ignored by Google) | ✅ none used |
| Every indexable page is in the sitemap | ✅ a full link crawl from the home page found no page missing from the sitemap, and every sitemap page is within 3 clicks of the home page |
| hreflang | ✅ every URL lists 13 alternates (12 languages + x-default, `zh-Hans` for Chinese); all 7,332 alternate links point to URLs in the sitemap, and every pair is reciprocal |
| `<lastmod>` present and valid W3C datetime | ✅ 564 / 564, none in the future |
| `<lastmod>` accurate | ✅ every page's date equals the last commit that touched its own sources (content file, translation, template; `src/lib/lastmod.ts`). Recomputed independently for all 564 URLs: 564 match |

### lastmod spread (live)

| Date | Pages | Why |
| --- | --- | --- |
| 26 Oct | 126 | Pages unchanged since the SEO audit fixes |
| 28 Oct | 24 | Privacy and Cookie pages, contact page |
| 29 Oct 10:44 UTC | 95 | Product structured data (image) and the LABSA correction |
| 29 Oct 11:42 UTC | 319 | Rewritten product overviews, the dish wash section, the home text, in 12 languages |

Dates vary by real content change, so Google can trust them. Vercel builds from a shallow git clone; the build fetches the full history first and logs `[lastmod] fetched the full git history…`. If that ever fails, `<lastmod>` is left out rather than set wrong.

## Recommendations

- **Low: image sitemap.** No `<image:image>` entries. Product photos are already in the page HTML (with descriptive alt text), which Google crawls, so the gain is small. Worth adding only if Google Images traffic becomes a goal.
- **Info: one sitemap file.** Fine at 564 URLs. Splitting by language or type is only worth it past roughly 40,000 URLs.

## Not covered

Google's own processing (Search Console → Sitemaps: "Success", discovered and indexed counts) needs the site to be verified in Search Console first.
