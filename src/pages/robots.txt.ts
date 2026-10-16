import type { APIRoute } from 'astro';
import site from '../config/site';

const AI_BOTS = ['GPTBot', 'PerplexityBot', 'Google-Extended', 'ClaudeBot', 'OAI-SearchBot'];

export const GET: APIRoute = () => {
  const base = site.url.replace(/\/$/, '');
  const body = site.launchReady
    ? [
        'User-agent: *',
        'Allow: /',
        '',
        ...AI_BOTS.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
        `Sitemap: ${base}/sitemap-index.xml`,
        '',
      ].join('\n')
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
