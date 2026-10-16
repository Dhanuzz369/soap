export const AI_BOTS = ['GPTBot', 'PerplexityBot', 'Google-Extended', 'ClaudeBot', 'OAI-SearchBot'];

export function buildRobots(url: string, launchReady: boolean): string {
  if (!launchReady) return 'User-agent: *\nDisallow: /';
  const base = url.replace(/\/$/, '');
  return [
    'User-agent: *',
    'Allow: /',
    '',
    ...AI_BOTS.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
    `Sitemap: ${base}/sitemap-index.xml`,
  ].join('\n');
}
