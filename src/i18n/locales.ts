/**
 * The site's languages (pure module: no Astro imports, so tests and Node scripts can load it).
 *
 * - `code` is the path prefix (/fr/products/…). English is the default and has no prefix.
 * - `hreflang` is the BCP 47 tag used in <html lang>, hreflang links and the sitemap.
 * - `native` is the name shown in the language menu, in its own script.
 * - `og` is the Open Graph locale (language_TERRITORY).
 * - `dateLocale` formats dates (Intl).
 *
 * To add a language: add it here, add src/i18n/ui/<code>.ts and register it in
 * src/i18n/ui/index.ts. See docs/i18n-translator-guide.md.
 */

export const LOCALES = [
  { code: 'en', hreflang: 'en', native: 'English', english: 'English', dir: 'ltr', og: 'en_US', dateLocale: 'en-GB' },
  { code: 'ar', hreflang: 'ar', native: 'العربية', english: 'Arabic', dir: 'rtl', og: 'ar_AR', dateLocale: 'ar' },
  { code: 'fr', hreflang: 'fr', native: 'Français', english: 'French', dir: 'ltr', og: 'fr_FR', dateLocale: 'fr-FR' },
  { code: 'es', hreflang: 'es', native: 'Español', english: 'Spanish', dir: 'ltr', og: 'es_ES', dateLocale: 'es' },
  { code: 'pt', hreflang: 'pt', native: 'Português', english: 'Portuguese', dir: 'ltr', og: 'pt_BR', dateLocale: 'pt-BR' },
  { code: 'ru', hreflang: 'ru', native: 'Русский', english: 'Russian', dir: 'ltr', og: 'ru_RU', dateLocale: 'ru' },
  { code: 'zh', hreflang: 'zh-Hans', native: '简体中文', english: 'Chinese (Simplified)', dir: 'ltr', og: 'zh_CN', dateLocale: 'zh-CN' },
  { code: 'de', hreflang: 'de', native: 'Deutsch', english: 'German', dir: 'ltr', og: 'de_DE', dateLocale: 'de-DE' },
  { code: 'tr', hreflang: 'tr', native: 'Türkçe', english: 'Turkish', dir: 'ltr', og: 'tr_TR', dateLocale: 'tr' },
  { code: 'id', hreflang: 'id', native: 'Bahasa Indonesia', english: 'Indonesian', dir: 'ltr', og: 'id_ID', dateLocale: 'id' },
  { code: 'sw', hreflang: 'sw', native: 'Kiswahili', english: 'Swahili', dir: 'ltr', og: 'sw_KE', dateLocale: 'sw' },
  { code: 'vi', hreflang: 'vi', native: 'Tiếng Việt', english: 'Vietnamese', dir: 'ltr', og: 'vi_VN', dateLocale: 'vi' },
] as const;

export type LocaleInfo = (typeof LOCALES)[number];
export type Locale = LocaleInfo['code'];

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_CODES = LOCALES.map((l) => l.code) as Locale[];
/** Every locale that is served under a /<code>/ prefix. */
export const PREFIXED_LOCALES = LOCALE_CODES.filter((c) => c !== DEFAULT_LOCALE);

const BY_CODE = new Map<string, LocaleInfo>(LOCALES.map((l) => [l.code, l]));

export function isLocale(code: string | undefined): code is Locale {
  return !!code && BY_CODE.has(code);
}

export function localeInfo(code: Locale): LocaleInfo {
  return BY_CODE.get(code)!;
}

/**
 * Splits a site path into its locale and the English (unprefixed) path.
 *   /fr/products/x/ → { lang: 'fr', path: '/products/x/' }
 *   /products/x/    → { lang: 'en', path: '/products/x/' }
 */
export function splitLocale(pathname: string): { lang: Locale; path: string } {
  const m = pathname.match(/^\/([a-z]{2})(\/.*|$)/);
  if (m && isLocale(m[1]) && m[1] !== DEFAULT_LOCALE) return { lang: m[1], path: m[2] || '/' };
  return { lang: DEFAULT_LOCALE, path: pathname || '/' };
}

/**
 * The path of `path` (an English, unprefixed site path) in `lang`. Leaves external URLs, anchors,
 * mailto:/tel: links and static files (/images/…, /fonts/…, anything with a file extension) alone,
 * and never prefixes a path twice.
 */
export function localizePath(path: string, lang: Locale): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const [pathname, rest = ''] = splitSuffix(path);
  const { path: base } = splitLocale(pathname);
  if (isStaticFile(base)) return path;
  if (lang === DEFAULT_LOCALE) return base + rest;
  return `/${lang}${base === '/' ? '/' : base}` + rest;
}

function splitSuffix(path: string): [string, string] {
  const i = path.search(/[?#]/);
  return i === -1 ? [path, ''] : [path.slice(0, i), path.slice(i)];
}

const STATIC_PREFIXES = ['/images/', '/fonts/', '/_astro/'];
function isStaticFile(pathname: string): boolean {
  return STATIC_PREFIXES.some((p) => pathname.startsWith(p)) || /\.[a-z0-9]{2,5}$/i.test(pathname);
}

/** hreflang alternates for an English path: every locale plus x-default (English). */
export function alternates(path: string): { hreflang: string; lang: Locale | 'x-default'; path: string }[] {
  return [
    ...LOCALES.map((l) => ({ hreflang: l.hreflang, lang: l.code as Locale, path: localizePath(path, l.code) })),
    { hreflang: 'x-default', lang: 'x-default' as const, path: localizePath(path, DEFAULT_LOCALE) },
  ];
}

/** The locale of a page URL (used by components, which read Astro.url). */
export function langFromUrl(url: URL | string): Locale {
  const pathname = typeof url === 'string' ? url : url.pathname;
  return splitLocale(pathname).lang;
}

/** Localizes every internal href in rendered HTML (used for English bodies shown as a fallback). */
export function localizeHtmlLinks(html: string, lang: Locale): string {
  if (lang === DEFAULT_LOCALE) return html;
  return html.replace(/(\shref=")(\/[^"]*)"/g, (_m, pre: string, href: string) => `${pre}${localizePath(href, lang)}"`);
}
