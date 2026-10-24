import type { APIRoute } from 'astro';
import { buildLlmsFull } from '../lib/llms';

/** /llms-full.txt: every product, term and FAQ as Markdown, in English (src/lib/llms.ts). */
export const GET: APIRoute = async () =>
  new Response(await buildLlmsFull(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
