import { describe, it, expect } from 'vitest';
import { buildRobots, AI_BOTS, SEARCH_BOTS } from '../../src/lib/robots';
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
    const required = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Claude-SearchBot', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'CCBot'];
    for (const bot of required) expect([...AI_BOTS, ...SEARCH_BOTS]).toContain(bot);
    for (const bot of [...AI_BOTS, ...SEARCH_BOTS]) {
      expect(out).toContain(`User-agent: ${bot}\nAllow: /`);
    }
    expect(out).toContain(`${URL}/llms.txt`);
    expect(out).toContain(`Sitemap: ${URL}/sitemap-index.xml`);
  });

  it('keeps every search and answer crawler allowed (opting out of training must not remove these)', () => {
    const out = buildRobots(URL, true);
    for (const bot of ['Googlebot', 'Bingbot', 'Applebot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'Claude-SearchBot', 'Claude-User', 'DuckAssistBot']) {
      expect(out, bot).toContain(`User-agent: ${bot}\nAllow: /`);
    }
  });

  it('tolerates a trailing slash on the url', () => {
    expect(buildRobots(URL + '/', true)).toContain(`Sitemap: ${URL}/sitemap-index.xml`);
  });
});
