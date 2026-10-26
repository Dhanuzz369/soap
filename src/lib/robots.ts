/**
 * Crawlers named explicitly in robots.txt once the site is launched. `User-agent: *` already allows
 * everyone; naming them makes the intent unmistakable, and keeps them allowed even if a stricter
 * `*` rule is added later. Three kinds, which do different things:
 *
 * - Search and answer citation (what decides whether the site can appear and be quoted):
 *   Googlebot (Google Search and AI Overviews), Bingbot (Bing, Copilot, and ChatGPT search via
 *   Bing's index), Applebot (Siri, Spotlight, Safari), YandexBot, Baiduspider, DuckDuckBot,
 *   OAI-SearchBot and ChatGPT-User (ChatGPT search and user fetches), PerplexityBot and
 *   Perplexity-User, Claude-SearchBot and Claude-User, DuckAssistBot.
 * - Training and grounding: Google-Extended controls whether Gemini and Vertex AI may use pages for
 *   training and grounding. It does NOT control Google Search or AI Overviews (that is Googlebot),
 *   so blocking it would not remove the site from AI Overviews, and allowing it does not add it.
 * - Training only: GPTBot, ClaudeBot, Applebot-Extended (Apple Intelligence training; Siri and
 *   Spotlight follow Applebot) and CCBot (Common Crawl, whose public crawl feeds many AI models and
 *   research tools). They are allowed on purpose, so GoodBiz Hygiene is known to those models.
 *
 * If you ever opt out of training, remove only the training bots; tests/unit/robots.test.ts checks
 * that the search and answer crawlers stay allowed. See docs/seo-launch-audit.md.
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
