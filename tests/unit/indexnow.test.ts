import { describe, it, expect } from 'vitest';
// @ts-ignore plain ESM module shared with scripts/indexnow.mjs
import { planIndexNow, sitemapUrls } from '../../scripts/indexnow-lib.mjs';
import site from '../../src/config/site';

const URLS = ['https://www.example.com/', 'https://www.example.com/fr/', 'https://elsewhere.com/x/'];

describe('IndexNow plan', () => {
  it('does nothing before launch', () => {
    const p = planIndexNow({ launchReady: false, url: 'https://www.example.com', key: site.indexNowKey, urls: URLS });
    expect(p.ok).toBe(false);
  });
  it('needs a valid key and built sitemap URLs', () => {
    expect(planIndexNow({ launchReady: true, url: 'https://www.example.com', key: 'short', urls: URLS }).ok).toBe(false);
    expect(planIndexNow({ launchReady: true, url: 'https://www.example.com', key: site.indexNowKey, urls: [] }).ok).toBe(false);
  });
  it('sends only the site’s own URLs with the key location', () => {
    const p: any = planIndexNow({ launchReady: true, url: 'https://www.example.com/', key: site.indexNowKey, urls: URLS });
    expect(p.ok).toBe(true);
    expect(p.payload).toEqual({
      host: 'www.example.com',
      key: site.indexNowKey,
      keyLocation: `https://www.example.com/${site.indexNowKey}.txt`,
      urlList: URLS.slice(0, 2),
    });
  });
  it('reads <loc> URLs from a sitemap', () => {
    expect(sitemapUrls('<url><loc>https://a.com/</loc></url><url><loc> https://a.com/b/ </loc></url>')).toEqual(['https://a.com/', 'https://a.com/b/']);
  });
  it('the key file in public/ matches site.ts', async () => {
    const { readFileSync } = await import('node:fs');
    expect(readFileSync(`public/${site.indexNowKey}.txt`, 'utf8').trim()).toBe(site.indexNowKey);
  });
});
