/**
 * Per-page i18n context for .astro files: `const { lang, ui, lp, fmt } = useI18n(Astro.url)`.
 * - lang: the page's locale, read from the URL (/fr/… → fr, unprefixed → en)
 * - ui:   the UI dictionary for that locale (English where a key is missing)
 * - lp:   localizes an English site path (/products/ → /fr/products/)
 * - fmt:  fills {placeholders}
 */
import { langFromUrl, localeInfo, localizePath, type Locale } from './locales';
import { getUi, fmt } from './ui';

export function useI18n(url: URL) {
  const lang: Locale = langFromUrl(url);
  return {
    lang,
    info: localeInfo(lang),
    ui: getUi(lang),
    lp: (path: string) => localizePath(path, lang),
    fmt,
    /** A name in lower case for "{nameLower}" placeholders, using the locale's casing rules. */
    lower: (s: string) => s.toLocaleLowerCase(localeInfo(lang).hreflang),
  };
}
