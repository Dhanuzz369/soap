// npm run indexnow [-- --dry-run]
//
// After the site is live, tells Bing, Yandex, Seznam, Naver and other IndexNow search engines about
// every page in the sitemap, so they crawl new and changed pages quickly (https://www.indexnow.org).
// Run it after each deploy that adds or changes pages. Google does not use IndexNow: submit the
// sitemap in Google Search Console instead.
//
// It does nothing until the site is launched: launchReady must be true in src/config/site.ts, the
// built sitemap must exist (npm run build), and the live domain must already serve the key file
// public/<indexNowKey>.txt (that proves the domain is real and yours).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { planIndexNow, sitemapUrls } from './indexnow-lib.mjs';

const root = resolve(process.cwd());
const site = (await import(pathToFileURL(join(root, 'src/config/site.ts')).href)).default;
const dry = process.argv.includes('--dry-run');
const dist = join(root, 'dist');
const urls = existsSync(dist)
  ? readdirSync(dist)
      .filter((f) => /^sitemap-\d+\.xml$/.test(f))
      .flatMap((f) => sitemapUrls(readFileSync(join(dist, f), 'utf8')))
  : [];

const plan = planIndexNow({ launchReady: site.launchReady, url: site.url, key: site.indexNowKey, urls });
if (!plan.ok) {
  console.log(`IndexNow: ${plan.reason}`);
  process.exit(0);
}
const { payload } = plan;

// The live site must serve the key file, or the search engines reject the submission.
try {
  const res = await fetch(payload.keyLocation, { redirect: 'follow' });
  const body = (await res.text()).trim();
  if (!res.ok || body !== payload.key) {
    console.log(`IndexNow: ${payload.keyLocation} does not serve the key yet (HTTP ${res.status}). Deploy the site to its real domain first. Nothing sent.`);
    process.exit(0);
  }
} catch (e) {
  console.log(`IndexNow: could not reach ${payload.keyLocation} (${e.message}). Is the domain live? Nothing sent.`);
  process.exit(0);
}

console.log(`IndexNow: ${payload.urlList.length} URLs on ${payload.host}${dry ? ' (dry run, not sent)' : ''}.`);
if (dry) process.exit(0);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});
console.log(`IndexNow: HTTP ${res.status} ${res.statusText}${res.status === 200 || res.status === 202 ? ' (accepted)' : ''}`);
if (res.status >= 400) process.exit(1);
