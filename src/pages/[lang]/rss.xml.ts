import type { APIRoute } from 'astro';
import { rssFor } from '../../lib/rss-feed';
import { localeParams } from '../../views/paths';
import type { Locale } from '../../i18n/locales';

/** /<lang>/rss.xml: the buyer guides in each language (src/lib/feeds.ts). */
export const getStaticPaths = localeParams;
export const GET: APIRoute = ({ params }) => rssFor(params.lang as Locale);
