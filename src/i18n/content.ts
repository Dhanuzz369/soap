/**
 * Localized content entries. `getLocalized('products', 'dish-wash-liquid', 'fr')` returns the
 * English entry with its translatable fields replaced by src/content/i18n/fr/products/
 * dish-wash-liquid.md (field by field; a missing field keeps the English value). Fixed fields
 * (slug, category, order, hsn, related, image, gallery src, dates, relatedProducts) always come
 * from English. Without a translation file the entry is English, with `fallback: true`.
 *
 * Render the body with `render(entry.source)`: it is the translation entry when there is one, so
 * its Markdown (with links localized by src/i18n/remark-localize-links.ts) is used.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { DEFAULT_LOCALE, type Locale } from './locales';
import { mergeEntryData } from './merge';

export type BaseCollection = 'products' | 'categories' | 'blog' | 'legal';
type I18nCollection = 'productsI18n' | 'categoriesI18n' | 'blogI18n' | 'legalI18n';
type SourceEntry = CollectionEntry<BaseCollection> | CollectionEntry<I18nCollection>;

export type Localized<C extends BaseCollection> = CollectionEntry<C> & {
  /** The page's locale. */
  lang: Locale;
  /** True when no translation file exists and the English content is shown. */
  fallback: boolean;
  /** The entry whose Markdown body is rendered (the translation, or the English entry). */
  source: SourceEntry;
};

const I18N: Record<BaseCollection, I18nCollection> = {
  products: 'productsI18n',
  categories: 'categoriesI18n',
  blog: 'blogI18n',
  legal: 'legalI18n',
};

/** The slug used in URLs and translation file names: data.slug, or the file name for posts and legal pages. */
export function slugOf(coll: BaseCollection, entry: { id: string; data: Record<string, unknown> }): string {
  return coll === 'blog' || coll === 'legal' ? entry.id : String(entry.data.slug ?? entry.id);
}

const maps = new Map<I18nCollection, Promise<Map<string, CollectionEntry<I18nCollection>>>>();
function translations(coll: I18nCollection) {
  let m = maps.get(coll);
  if (!m) {
    m = getCollection(coll).then((all) => new Map(all.map((e) => [e.id, e as CollectionEntry<I18nCollection>])));
    maps.set(coll, m);
  }
  return m;
}

/** Localizes an English entry. */
export async function localizeEntry<C extends BaseCollection>(coll: C, entry: CollectionEntry<C>, lang: Locale): Promise<Localized<C>> {
  const base = { ...entry, lang, fallback: false, source: entry as SourceEntry } as Localized<C>;
  if (lang === DEFAULT_LOCALE) return base;
  const slug = slugOf(coll, entry as never);
  const tr = (await translations(I18N[coll])).get(`${lang}/${coll}/${slug}`);
  if (!tr) return { ...base, fallback: true };
  return {
    ...base,
    data: mergeEntryData(coll, entry.data as never, tr.data as never) as CollectionEntry<C>['data'],
    body: tr.body,
    source: tr,
  } as Localized<C>;
}

export async function getLocalizedCollection<C extends BaseCollection>(coll: C, lang: Locale): Promise<Localized<C>[]> {
  const all = (await getCollection(coll)) as CollectionEntry<C>[];
  return Promise.all(all.map((e) => localizeEntry(coll, e, lang)));
}

/** One entry by slug (product/category slug, or post file name), in `lang`, falling back to English. */
export async function getLocalized<C extends BaseCollection>(coll: C, slug: string, lang: Locale): Promise<Localized<C> | undefined> {
  const all = (await getCollection(coll)) as CollectionEntry<C>[];
  const entry = all.find((e) => slugOf(coll, e as never) === slug);
  return entry ? localizeEntry(coll, entry, lang) : undefined;
}
