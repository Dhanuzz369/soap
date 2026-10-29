import type { APIRoute } from 'astro';
import { rssFor } from '../lib/rss-feed';

/** /rss.xml: the English buyer guides (src/lib/feeds.ts). */
export const GET: APIRoute = () => rssFor('en');
