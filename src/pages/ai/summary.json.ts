import type { APIRoute } from 'astro';
import { buildAiSummary } from '../../lib/feeds';
import { getUi } from '../../i18n/ui';
import { LOCALE_CODES } from '../../i18n/locales';

/** /ai/summary.json: the company in a few facts, for AI agents (src/lib/feeds.ts). */
export const GET: APIRoute = () =>
  new Response(buildAiSummary({ description: getUi('en').seo.entity, languages: [...LOCALE_CODES] }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
