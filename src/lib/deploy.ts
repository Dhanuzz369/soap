/**
 * Where a build is going, and the Vercel configuration that follows from site.ts (pure, unit-tested).
 *
 * 1. The launch decision. `site.launchReady` is the owner's switch, but a build only opens the site
 *    to search engines (index, follow; robots.txt Allow; the sitemap) when it is ALSO a production
 *    build: `launchReady && VERCEL_ENV === 'production'`. Vercel sets VERCEL_ENV to 'production',
 *    'preview' or 'development' on every build. A build without VERCEL_ENV (your own computer, the
 *    tests) counts as production, so `npm run build` behaves exactly as before.
 *    Result: every preview deployment is noindex with `Disallow: /`, whatever launchReady says.
 *
 * 2. vercel.json (`npm run vercel:config` writes it from buildVercelConfig; a unit test fails when
 *    the committed file and site.ts disagree). Vercel reads vercel.json before the build, so it is a
 *    static, committed file rather than something the build writes. It holds:
 *    - `trailingSlash: true`: /products redirects (308) to /products/, the canonical form.
 *    - Security headers on every response, and long caching for /fonts and /images.
 *    - `X-Robots-Tag: noindex, nofollow` on every *.vercel.app host (preview URLs and the project's
 *      own vercel.app alias), always.
 *    - Once `launchReady` is true AND `site.url` is a real domain: a 308 redirect from every
 *      *.vercel.app host to the same path on site.url. Previews on *.vercel.app then redirect too.
 *    - 308 redirects for addresses people and tools guess: /sitemap.xml to /sitemap-index.xml, and
 *      the range index /categories/ (each language's too) to the products page that lists the ranges.
 */
import { DEFAULT_LOCALE, LOCALE_CODES } from '../i18n/locales.ts';
export interface DeployConfig {
  url: string;
  launchReady: boolean;
}

/** Vercel's VERCEL_ENV of this build (undefined outside Vercel). */
export function vercelEnv(env: Record<string, string | undefined> = typeof process !== 'undefined' ? process.env : {}): string | undefined {
  const v = env.VERCEL_ENV?.trim();
  return v ? v : undefined;
}

/** A production build: Vercel production, or a build outside Vercel (local builds and tests). */
export function isProductionBuild(env?: string): boolean {
  return env === undefined || env === '' || env === 'production';
}

/** The launch decision: the owner's switch AND a production build. */
export function isLaunched(launchReady: boolean, env?: string): boolean {
  return launchReady && isProductionBuild(env);
}

/** A real, public https domain (not localhost, a *.vercel.app alias, an example or test host, or a placeholder). */
export function isRealDomain(url: string): boolean {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  const host = u.hostname.toLowerCase();
  if (u.protocol !== 'https:') return false;
  if (!host.includes('.') || /placeholder/i.test(url)) return false;
  if (host === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(host) || host.startsWith('[')) return false;
  if (/\.(vercel\.app|localhost|test|local|invalid|example)$/.test(host)) return false;
  if (/(^|\.)example\.(com|net|org)$/.test(host)) return false;
  return true;
}

/** The host pattern Vercel matches for every *.vercel.app deployment and alias. */
export const VERCEL_APP_HOST = '(?<vhost>.+)\\.vercel\\.app';

export const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
] as const;

const prefixed = LOCALE_CODES.filter((l) => l !== DEFAULT_LOCALE).join('|');
const GUESSED_PATHS = [
  { source: '/sitemap.xml', destination: '/sitemap-index.xml', permanent: true },
  { source: '/categories/', destination: '/products/', permanent: true },
  { source: `/:lang(${prefixed})/categories/`, destination: '/:lang/products/', permanent: true },
];

type Header = { key: string; value: string };
type HostCondition = { type: 'host'; value: string };
export interface VercelConfig {
  $schema: string;
  trailingSlash: boolean;
  redirects: { source: string; has?: HostCondition[]; destination: string; permanent: boolean }[];
  headers: { source: string; has?: HostCondition[]; headers: Header[] }[];
}

/** vercel.json for this site. */
export function buildVercelConfig(site: DeployConfig): VercelConfig {
  const base = site.url.replace(/\/+$/, '');
  const onVercelApp: HostCondition[] = [{ type: 'host', value: VERCEL_APP_HOST }];
  const redirect = site.launchReady && isRealDomain(base);
  return {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    trailingSlash: true,
    redirects: [
      ...(redirect ? [{ source: '/:path*', has: onVercelApp, destination: `${base}/:path*`, permanent: true }] : []),
      ...GUESSED_PATHS,
    ],
    headers: [
      { source: '/(.*)', headers: [...SECURITY_HEADERS] },
      { source: '/(.*)', has: onVercelApp, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      // Font file names never change; image names are not hashed, so they get a week plus revalidation.
      { source: '/fonts/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/images/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }] },
      { source: '/og/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }] },
      {
        source: '/(favicon\\.ico|favicon\\.svg|apple-touch-icon\\.png|site\\.webmanifest|logo-512\\.png|icon-192\\.png|icon-512\\.png|icon-maskable-512\\.png)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ],
  };
}
