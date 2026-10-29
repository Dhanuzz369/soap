/**
 * Machine-readable files beside llms.txt (pure, unit-tested; the endpoints are in src/pages):
 * - /rss.xml and /<lang>/rss.xml: the buyer guides as an RSS 2.0 feed, linked from every page's head.
 * - /.well-known/ai.txt: AI use of the site, in robots.txt syntax (the same open/closed state as
 *   robots.txt: closed until the site is launched).
 * - /ai/summary.json: who the company is, for AI agents that look for it.
 * Google Search uses none of these (its AI answers come from the normal index); feed readers and
 * some AI tools do. Everything here comes from site.ts and the content, so it never goes stale.
 */
import site from '../config/site.ts';

const base = () => site.url.replace(/\/+$/, '');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export type FeedItem = { title: string; description: string; path: string; date: Date };

/** An RSS 2.0 feed; `path`s are site paths (already localized), newest item first. */
export function buildRss(feed: { title: string; description: string; path: string; language: string; items: FeedItem[] }): string {
  const link = base() + feed.path;
  const items = [...feed.items].sort((a, b) => b.date.getTime() - a.date.getTime());
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${esc(feed.title)}</title>`,
    `<link>${esc(link)}</link>`,
    `<description>${esc(feed.description)}</description>`,
    `<language>${esc(feed.language)}</language>`,
    ...(items[0] ? [`<lastBuildDate>${items[0].date.toUTCString()}</lastBuildDate>`] : []),
    ...items.map((i) => {
      const url = esc(base() + i.path);
      return `<item><title>${esc(i.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${esc(i.description)}</description><pubDate>${i.date.toUTCString()}</pubDate></item>`;
    }),
    '</channel>',
    '</rss>',
    '',
  ].join('\n');
}

/** /.well-known/ai.txt: robots.txt syntax, open only once the site is launched. */
export function buildAiTxt(launched: boolean): string {
  if (!launched) return 'User-Agent: *\nDisallow: /\n';
  return [
    `# ${site.name}: AI assistants and crawlers may read, quote and link to every page.`,
    `# A plain-text summary: ${base()}/llms.txt (full text: ${base()}/llms-full.txt)`,
    'User-Agent: *',
    'Allow: /',
    '',
    `Sitemap: ${base()}/sitemap-index.xml`,
    '',
  ].join('\n');
}

/** /ai/summary.json: the company in a few facts (the same ones as the Organization structured data). */
export function buildAiSummary(p: { description: string; languages: string[] }): string {
  const f = site.facts;
  return (
    JSON.stringify(
      {
        name: site.name,
        description: p.description,
        url: `${base()}/`,
        type: 'Merchant exporter (sources from Indian manufacturers; does not manufacture)',
        parentOrganization: { name: site.parentName, ...(f.parentUrl ? { url: f.parentUrl } : {}) },
        location: [f.city, f.region, 'India'].filter(Boolean).join(', '),
        contact: { email: site.contact.email, telephone: site.contact.phone, whatsapp: `https://wa.me/${site.contact.whatsapp}` },
        languages: p.languages,
        products: `${base()}/products/`,
        llms: `${base()}/llms.txt`,
        sitemap: `${base()}/sitemap-index.xml`,
      },
      null,
      2,
    ) + '\n'
  );
}
