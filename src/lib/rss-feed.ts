import { getPosts } from './blog.ts';
import { buildRss } from './feeds.ts';
import { getUi } from '../i18n/ui';
import { localeInfo, localizePath, type Locale } from '../i18n/locales.ts';

/** The buyer guides in `lang` as RSS (src/lib/feeds.ts); served at /rss.xml and /<lang>/rss.xml. */
export async function rssFor(lang: Locale): Promise<Response> {
  const B = getUi(lang).blogIndex;
  const posts = await getPosts(lang);
  const xml = buildRss({
    title: B.title,
    description: B.description,
    path: localizePath('/blog/', lang),
    language: localeInfo(lang).hreflang,
    items: posts.map((p) => ({ title: p.data.title, description: p.data.description, path: localizePath(`/blog/${p.id}/`, lang), date: p.data.date })),
  });
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
