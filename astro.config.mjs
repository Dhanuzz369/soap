import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import site from './src/config/site.ts';
import { LOCALES, DEFAULT_LOCALE } from './src/i18n/locales.ts';
import { satteri } from '@astrojs/markdown-satteri';
import localizeLinks from './src/i18n/markdown-localize-links.ts';
import { lastmodFor } from './src/lib/lastmod.ts';
import { launched } from './src/lib/launch.ts';

// English is served at /, every other language at /<code>/ (src/i18n/locales.ts).
// Simplified Chinese uses the path /zh/ and the language tag zh-Hans.
const locales = LOCALES.map((l) => (l.code === l.hreflang ? l.code : { path: l.code, codes: [l.hreflang] }));

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales,
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    // Links inside translated Markdown (src/content/i18n/<lang>/…) point to the same language.
    processor: satteri({ mdastPlugins: [localizeLinks] }),
  },
  // The sitemap only exists for a launched production build (src/lib/launch.ts).
  integrations: launched
    ? [
        sitemap({
          // Every URL lists its 12 language versions as <xhtml:link rel="alternate" hreflang>.
          i18n: {
            defaultLocale: DEFAULT_LOCALE,
            locales: Object.fromEntries(LOCALES.map((l) => [l.code, l.hreflang])),
          },
          // The 404 page is noindex; keep it out.
          filter: (page) => !/\/404\/?$/.test(new URL(page).pathname),
          // <lastmod>: the last commit that touched the page's sources (src/lib/lastmod.ts), and an
          // x-default alternate (the English page), matching the hreflang links in each page's head.
          serialize: (item) => {
            const en = item.links?.find((l) => l.lang === 'en');
            return {
              ...item,
              lastmod: lastmodFor(item.url),
              ...(en ? { links: [...item.links, { lang: 'x-default', url: en.url }] } : {}),
            };
          },
        }),
      ]
    : [],
});
