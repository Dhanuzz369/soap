import { describe, it, expect } from 'vitest';
import { buildRobots, AI_BOTS } from '../../src/lib/robots';
import site from '../../src/config/site';

const URL = site.url.replace(/\/$/, '');

describe('buildRobots', () => {
  it('blocks everything before launch', () => {
    const out = buildRobots(URL, false);
    expect(out).toBe('User-agent: *\nDisallow: /');
    expect(out).not.toContain('Sitemap');
  });

  it('allows everything after launch with AI bots and sitemap', () => {
    const out = buildRobots(URL, true);
    expect(out).not.toContain('Disallow: /');
    expect(AI_BOTS).toHaveLength(5);
    for (const bot of ['GPTBot', 'PerplexityBot', 'Google-Extended', 'ClaudeBot', 'OAI-SearchBot']) {
      expect(out).toContain(`User-agent: ${bot}\nAllow: /`);
    }
    expect(out).toContain(`Sitemap: ${URL}/sitemap-index.xml`);
  });

  it('tolerates a trailing slash on the url', () => {
    expect(buildRobots(URL + '/', true)).toContain(`Sitemap: ${URL}/sitemap-index.xml`);
  });
});
