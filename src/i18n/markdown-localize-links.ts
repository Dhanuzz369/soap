/**
 * Markdown plugin (Sätteri mdast plugin, Astro's default processor): inside translated Markdown (src/content/i18n/<lang>/…), internal links such as
 * [text](/products/labsa/) are rewritten to the same locale (/fr/products/labsa/). Translators
 * keep writing the English paths. External links, anchors, files (/images/…) and links that
 * already carry a locale prefix are left alone. Registered in astro.config.mjs.
 */
import { isLocale, localizePath, DEFAULT_LOCALE } from './locales.ts';

type Node = { type: string; url?: string; children?: Node[] };

export function localeOfContentFile(path: string | undefined): string | undefined {
  const m = (path ?? '').replace(/\\/g, '/').match(/\/content\/i18n\/([a-z]{2})\//);
  return m && isLocale(m[1]) && m[1] !== DEFAULT_LOCALE ? m[1] : undefined;
}

export function localizeLinks(tree: Node, lang: string): void {
  if (!isLocale(lang)) return;
  const walk = (n: Node) => {
    if ((n.type === 'link' || n.type === 'definition') && typeof n.url === 'string') n.url = localizePath(n.url, lang);
    n.children?.forEach(walk);
  };
  walk(tree);
}

type Ctx = { setProperty(node: unknown, key: 'url', value: string): void };

/**
 * A plugin factory: Sätteri calls it once per document with the file's URL, and the plugin only
 * runs for files under src/content/i18n/<lang>/.
 */
export default function localizeLinksPlugin({ fileURL }: { fileURL: URL | undefined }) {
  const lang = localeOfContentFile(fileURL ? decodeURIComponent(fileURL.pathname) : undefined);
  if (!lang || !isLocale(lang)) return null;
  const fix = (node: { url: string }, ctx: Ctx) => {
    const url = localizePath(node.url, lang);
    if (url !== node.url) ctx.setProperty(node, 'url', url);
  };
  return { name: 'goodbiz-localize-links', link: fix, definition: fix };
}
