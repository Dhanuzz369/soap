import type { APIRoute } from 'astro';
import { buildLlmsIndex } from '../../lib/llms';
import { localeParams } from '../../views/paths';
import type { Locale } from '../../i18n/locales';

/** /<lang>/llms.txt: the summary for AI assistants in each language (src/lib/llms.ts). */
export const getStaticPaths = localeParams;
export const GET: APIRoute = async ({ params }) =>
  new Response(await buildLlmsIndex(params.lang as Locale), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
