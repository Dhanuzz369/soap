/**
 * `<lastmod>` dates for the sitemap (astro.config.mjs). A page's date is the latest git commit that
 * touched one of its source files: the English content file, its translation, the page template
 * and the language's interface strings. Without git (or for a file with no commits yet) the build
 * date is used, which is never earlier than the truth.
 */
import { execFileSync } from 'node:child_process';
import { splitLocale } from '../i18n/locales.ts';

let cache: Map<string, string> | undefined;

/** Latest commit date (ISO) per repository file, from one `git log` call. */
function commitDates(): Map<string, string> {
  if (cache) return cache;
  cache = new Map();
  try {
    const out = execFileSync('git', ['log', '--format=@%cI', '--name-only', '--', 'src'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    let date = '';
    for (const line of out.split('\n')) {
      if (line.startsWith('@')) date = line.slice(1);
      else if (line && !cache.has(line)) cache.set(line, date);
    }
  } catch {
    // not a git checkout: every page falls back to the build date
  }
  return cache;
}

const VIEWS: Record<string, string> = {
  '/': 'Home',
  '/products/': 'Products',
  '/private-label/': 'PrivateLabel',
  '/export-process/': 'ExportProcess',
  '/about/': 'About',
  '/faq/': 'Faq',
  '/contact/': 'Contact',
  '/blog/': 'Blog',
};

/** The source files behind a page path (English path plus language). */
export function sourcesFor(pathname: string): string[] {
  const { lang, path } = splitLocale(pathname);
  const ui = `src/i18n/ui/${lang}.ts`;
  const m = path.match(/^\/(products|categories|blog)\/([^/]+)\/$/);
  if (m) {
    const [, coll, slug] = m;
    const view = coll === 'products' ? 'Product' : coll === 'categories' ? 'Category' : 'Post';
    return [`src/content/${coll}/${slug}.md`, `src/content/i18n/${lang}/${coll}/${slug}.md`, `src/views/${view}.astro`, ui];
  }
  const view = VIEWS[path];
  return view ? [`src/views/${view}.astro`, ui] : [ui];
}

/** ISO date for a page URL's <lastmod>. */
export function lastmodFor(url: string, now: Date = new Date()): string {
  const dates = commitDates();
  const found = sourcesFor(new URL(url).pathname)
    .map((f) => dates.get(f))
    .filter((d): d is string => !!d)
    .sort();
  return found.length ? new Date(found[found.length - 1]).toISOString() : now.toISOString();
}
