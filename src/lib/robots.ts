/**
 * Crawlers named explicitly in robots.txt once the site is launched. `User-agent: *` already allows
 * everyone; naming them makes the intent unmistakable, and keeps them allowed even if a stricter
 * `*` rule is added later. Search engines first, then the AI search and answer crawlers (so the
 * site can be cited by ChatGPT, Perplexity, Claude, Gemini, Apple Intelligence and Copilot), then
 * the training-data crawlers. CCBot (Common Crawl) is allowed on purpose: its public crawl feeds
 * many AI models and research tools, which helps GoodBiz Hygiene be known to them (GEO). See
 * docs/seo-launch-audit.md.
 */
export const SEARCH_BOTS = ['Googlebot', 'Bingbot', 'Applebot', 'YandexBot', 'Baiduspider', 'DuckDuckBot'];
export const AI_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'PerplexityBot',
  'Perplexity-User',
  'Claude-SearchBot',
  'Claude-User',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'DuckAssistBot',
  'CCBot',
];

export function buildRobots(url: string, launchReady: boolean): string {
  if (!launchReady) return 'User-agent: *\nDisallow: /';
  const base = url.replace(/\/$/, '');
  return [
    `# ${base}: every page may be crawled, indexed and quoted, by search engines and AI assistants alike.`,
    `# A plain-text summary for AI assistants: ${base}/llms.txt (full text: ${base}/llms-full.txt)`,
    '',
    'User-agent: *',
    'Allow: /',
    '',
    ...[...SEARCH_BOTS, ...AI_BOTS].flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
    `Sitemap: ${base}/sitemap-index.xml`,
  ].join('\n');
}
