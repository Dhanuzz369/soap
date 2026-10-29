import type { APIRoute } from 'astro';
import { buildAiTxt } from '../../lib/feeds';
import { launched } from '../../lib/launch';

/** /.well-known/ai.txt: AI use of the site, closed until launch like robots.txt (src/lib/feeds.ts). */
export const GET: APIRoute = () => new Response(buildAiTxt(launched), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
