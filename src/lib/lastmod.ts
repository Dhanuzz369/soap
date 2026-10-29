/**
 * `<lastmod>` dates for the sitemap (astro.config.mjs). A page's date is the latest git commit that
 * touched one of its source files. A product, range, guide or legal page is dated by its English
 * content file, its translation and its template: the language's interface strings only hold
 * shared labels (menus, footer), and an edit there must not re-date every page. The other pages
 * (home, products, about…) take their text from the interface strings, so those count for them. Without git (or for a file with no commits yet) the build
 * date is used, which is never earlier than the truth.
 *
 * Vercel builds from a shallow clone, where one commit appears to touch every file, so every page
 * would get the same date. The full history is fetched first (the repository is public); if that
 * fails, <lastmod> is left out, since a wrong date is worse than none for search engines.
 */
import { execFileSync } from 'node:child_process';
import { splitLocale } from '../i18n/locales.ts';

let cache: Map<string, string> | null | undefined;

const git = (args: string[]) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });

/** Where to fetch the full history from: the `origin` remote, then the GitHub repository Vercel names. */
function remotes(env: Record<string, string | undefined> = process.env): string[] {
  const list = ['origin'];
  if (env.VERCEL_GIT_PROVIDER === 'github' && env.VERCEL_GIT_REPO_OWNER && env.VERCEL_GIT_REPO_SLUG) {
    list.push(`https://github.com/${env.VERCEL_GIT_REPO_OWNER}/${env.VERCEL_GIT_REPO_SLUG}.git`);
  }
  return list;
}

/** A shallow clone, deepened if possible. True when the history is still incomplete. */
function shallowHistory(): boolean {
  const shallow = () => git(['rev-parse', '--is-shallow-repository']).trim() === 'true';
  if (!shallow()) return false;
  // The commit being built, not a branch: a deploy may have a detached HEAD or a one-branch remote.
  const head = git(['rev-parse', 'HEAD']).trim();
  const errors: string[] = [];
  for (const remote of remotes()) {
    try {
      execFileSync('git', ['fetch', '--unshallow', '--quiet', remote, head], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      if (!shallow()) {
        console.log(`[lastmod] fetched the full git history from ${remote}`);
        return false;
      }
    } catch (e) {
      errors.push(`${remote}: ${String((e as { stderr?: string }).stderr ?? e).trim().split('\n')[0]}`);
    }
  }
  console.warn(`[lastmod] shallow clone and the full history could not be fetched, so the sitemap has no <lastmod> (${errors.join('; ')})`);
  return true;
}

/** Latest commit date (ISO) per repository file, from one `git log` call; null when the history is incomplete. */
function commitDates(): Map<string, string> | null {
  if (cache !== undefined) return cache;
  cache = new Map();
  try {
    if (shallowHistory()) return (cache = null);
    const out = git(['log', '--format=@%cI', '--name-only', '--', 'src']);
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
    return [`src/content/${coll}/${slug}.md`, `src/content/i18n/${lang}/${coll}/${slug}.md`, `src/views/${view}.astro`];
  }
  const legal = path.match(/^\/(privacy|cookies)\/$/);
  if (legal) return [`src/content/legal/${legal[1]}.md`, `src/content/i18n/${lang}/legal/${legal[1]}.md`, 'src/views/Legal.astro'];
  const view = VIEWS[path];
  return view ? [`src/views/${view}.astro`, ui] : [ui];
}

/** The latest commit date among `sources` (ISO); the build date if none has commits; undefined without full history. */
export function latestDate(sources: string[], dates: Map<string, string> | null, now: Date): string | undefined {
  if (!dates) return undefined;
  const found = sources
    .map((f) => dates.get(f))
    .filter((d): d is string => !!d)
    .map((d) => new Date(d).toISOString())
    .sort();
  return found.length ? found[found.length - 1] : now.toISOString();
}

/** ISO date for a page URL's <lastmod>, or undefined to leave it out. */
export function lastmodFor(url: string, now: Date = new Date()): string | undefined {
  return latestDate(sourcesFor(new URL(url).pathname), commitDates(), now);
}
