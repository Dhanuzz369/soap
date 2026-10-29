import { describe, it, expect } from 'vitest';
import { buildRss, buildAiTxt, buildAiSummary } from '../../src/lib/feeds';
import site from '../../src/config/site';

const BASE = site.url.replace(/\/$/, '');

describe('RSS feed', () => {
  const xml = buildRss({
    title: 'Guides & notes',
    description: 'For <importers>',
    path: '/blog/',
    language: 'en',
    items: [
      { title: 'Older', description: 'A', path: '/blog/older/', date: new Date('2026-10-01T00:00:00Z') },
      { title: 'HSN 3401 vs 3402 & more', description: 'B', path: '/blog/newer/', date: new Date('2026-10-14T00:00:00Z') },
    ],
  });
  it('is RSS 2.0 with escaped text and absolute links', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"')).toBe(true);
    expect(xml).toContain('<title>Guides &amp; notes</title>');
    expect(xml).toContain('<description>For &lt;importers&gt;</description>');
    expect(xml).toContain(`<link>${BASE}/blog/</link>`);
    expect(xml).toContain(`<guid isPermaLink="true">${BASE}/blog/newer/</guid>`);
  });
  it('lists the newest guide first and dates the feed by it', () => {
    expect(xml.indexOf('/blog/newer/')).toBeLessThan(xml.indexOf('/blog/older/'));
    expect(xml).toContain('<lastBuildDate>Wed, 14 Oct 2026 00:00:00 GMT</lastBuildDate>');
  });
});

describe('/.well-known/ai.txt', () => {
  it('is closed before launch, like robots.txt', () => {
    expect(buildAiTxt(false)).toBe('User-Agent: *\nDisallow: /\n');
  });
  it('allows every AI agent once launched and points to llms.txt and the sitemap', () => {
    const t = buildAiTxt(true);
    expect(t).toContain('User-Agent: *\nAllow: /');
    expect(t).toContain(`${BASE}/llms.txt`);
    expect(t).toContain(`Sitemap: ${BASE}/sitemap-index.xml`);
    expect(t).not.toMatch(/Disallow/);
  });
});

describe('/ai/summary.json', () => {
  const s = JSON.parse(buildAiSummary({ description: 'D'.repeat(30), languages: ['en', 'ar'] }));
  it('names the company, says it does not manufacture, and carries the real contacts', () => {
    expect(s.name).toBe(site.name);
    expect(s.description.length).toBeGreaterThanOrEqual(20);
    expect(s.type).toMatch(/does not manufacture/);
    expect(s.parentOrganization.name).toBe(site.parentName);
    expect(s.contact.email).toBe(site.contact.email);
    expect(s.url).toBe(`${BASE}/`);
  });
});
