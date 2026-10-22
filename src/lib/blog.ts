import { getLocalizedCollection, type Localized } from '../i18n/content';
import { DEFAULT_LOCALE, localeInfo, type Locale } from '../i18n/locales';

export type BlogEntry = Localized<'blog'>;

/** Words in a Markdown body, ignoring link URLs and markup characters. */
export function wordCount(md: string): number {
  return md
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/[#*|>`_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

export function readingMinutes(md: string): number {
  return Math.max(1, Math.round(wordCount(md) / 220));
}

/** Newest first, in `lang` (English where a post is not translated). */
export async function getPosts(lang: Locale = DEFAULT_LOCALE): Promise<BlogEntry[]> {
  const posts = await getLocalizedCollection('blog', lang);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const fmtDate = (d: Date, lang: Locale = DEFAULT_LOCALE) =>
  d.toLocaleDateString(localeInfo(lang).dateLocale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
