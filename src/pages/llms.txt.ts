import type { APIRoute } from 'astro';
import { buildLlmsIndex } from '../lib/llms';

/** /llms.txt: the English summary for AI assistants (src/lib/llms.ts). */
export const GET: APIRoute = async () =>
  new Response(await buildLlmsIndex('en'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
