/**
 * Visitor-language detection, used by the tiny inline script in BaseLayout's <head> on English
 * (unprefixed) pages. Both functions are self-contained (no closures, no imports) because their
 * source is inlined into the page with Function.prototype.toString(). Unit-tested in
 * tests/unit/i18n-detect.test.ts.
 */

/**
 * The first supported locale in the browser's preference list, or `fallback`.
 * Matches on the primary subtag, so pt-BR → pt, es-419 → es, zh-TW/zh-Hans/zh-CN → zh,
 * fr-CA → fr, ar-EG → ar, sw-KE → sw. "in" (old Indonesian) → id.
 */
export function pickLocale(languages: readonly string[], supported: readonly string[], fallback: string): string {
  for (var i = 0; i < languages.length; i++) {
    var tag = String(languages[i] || '').toLowerCase().replace(/_/g, '-');
    var primary = tag.split('-')[0];
    if (primary === 'in') primary = 'id';
    if (supported.indexOf(primary) !== -1) return primary;
  }
  return fallback;
}

/** Crawlers, link previewers and audit tools never get redirected. */
export function isBot(userAgent: string): boolean {
  return /bot|crawl|spider|slurp|bingpreview|mediapartners|facebookexternalhit|embedly|quora link|whatsapp|telegram|skypeuripreview|lighthouse|pagespeed|headless|prerender|phantomjs|google-inspectiontool|gtmetrix/i.test(
    userAgent || '',
  );
}
