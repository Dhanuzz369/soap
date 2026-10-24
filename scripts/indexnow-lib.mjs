// Pure rules for `npm run indexnow` (scripts/indexnow.mjs), shared with tests/unit/indexnow.test.ts.

/** <loc> URLs from sitemap XML. */
export function sitemapUrls(xml) {
  return [...String(xml).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

/**
 * What to send, or why nothing is sent. Sends only when the site is launched (launchReady), the
 * key looks valid, and there are page URLs on the site's own host.
 * @returns {{ ok: true, payload: object } | { ok: false, reason: string }}
 */
export function planIndexNow({ launchReady, url, key, urls }) {
  if (!launchReady) return { ok: false, reason: 'launchReady is false in src/config/site.ts: the site is not live, so nothing is sent.' };
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(String(key ?? ''))) return { ok: false, reason: 'indexNowKey in src/config/site.ts must be 8-128 letters, digits or dashes.' };
  let host;
  try {
    host = new URL(url).host;
  } catch {
    return { ok: false, reason: `site.url "${url}" is not a valid address.` };
  }
  const own = urls.filter((u) => {
    try {
      return new URL(u).host === host;
    } catch {
      return false;
    }
  });
  if (!own.length) return { ok: false, reason: 'No page URLs found: run `npm run build` (with launchReady true) first, so dist/ has the sitemap.' };
  const base = url.replace(/\/$/, '');
  return { ok: true, payload: { host, key, keyLocation: `${base}/${key}.txt`, urlList: own.slice(0, 10000) } };
}
