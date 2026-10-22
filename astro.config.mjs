import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import site from './src/config/site.ts';
import { LOCALES, DEFAULT_LOCALE } from './src/i18n/locales.ts';
import { satteri } from '@astrojs/markdown-satteri';
import localizeLinks from './src/i18n/markdown-localize-links.ts';

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
  integrations: site.launchReady
    ? [
        sitemap({
          i18n: {
            defaultLocale: DEFAULT_LOCALE,
            locales: Object.fromEntries(LOCALES.map((l) => [l.code, l.hreflang])),
          },
        }),
      ]
    : [],
});
