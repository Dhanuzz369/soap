import { describe, it, expect } from 'vitest';
import { latestDate, sourcesFor } from '../../src/lib/lastmod';

const NOW = new Date('2026-10-29T10:00:00Z');

describe('sitemap <lastmod>', () => {
  it('is the latest commit date among the page sources', () => {
    const dates = new Map([
      ['src/content/products/labsa.md', '2026-10-20T08:00:00+05:30'],
      ['src/views/Product.astro', '2026-10-26T09:00:00+05:30'],
    ]);
    expect(latestDate(sourcesFor('/products/labsa/'), dates, NOW)).toBe('2026-10-26T03:30:00.000Z');
  });
  it('falls back to the build date for a page whose sources have no commits yet', () => {
    expect(latestDate(sourcesFor('/products/labsa/'), new Map(), NOW)).toBe(NOW.toISOString());
  });
  it('is left out when the git history is incomplete (a shallow clone), instead of dating every page alike', () => {
    expect(latestDate(sourcesFor('/products/labsa/'), null, NOW)).toBeUndefined();
  });
});

describe('page sources', () => {
  it('dates content pages by their own text and template, not the shared interface strings', () => {
    expect(sourcesFor('/fr/products/labsa/')).toEqual(['src/content/products/labsa.md', 'src/content/i18n/fr/products/labsa.md', 'src/views/Product.astro']);
    expect(sourcesFor('/privacy/')).not.toContain('src/i18n/ui/en.ts');
  });
  it('dates the pages written from the interface strings by those strings too', () => {
    expect(sourcesFor('/de/')).toEqual(['src/views/Home.astro', 'src/i18n/ui/de.ts']);
  });
});
