import type { CollectionEntry } from 'astro:content';
import { groupByCategory, pickRelated } from './product-utils';
import { getLocalizedCollection, type Localized } from '../i18n/content';
import { DEFAULT_LOCALE, type Locale } from '../i18n/locales';

/** Entries in the page's language (English fields where a translation is missing). */
export type CategoryEntry = Localized<'categories'>;
export type ProductEntry = Localized<'products'>;
export type RawProductEntry = CollectionEntry<'products'>;

// Entries expose `data.slug`/`data.category`; adapt them to the pure helpers.
const catLike = (c: CategoryEntry) => ({ slug: c.data.slug, order: c.data.order, entry: c });
const prodLike = (p: ProductEntry) => ({
  slug: p.data.slug,
  order: p.data.order,
  category: p.data.category.id,
  related: p.data.related,
  entry: p,
});

export async function getProductsByCategory(lang: Locale = DEFAULT_LOCALE): Promise<{ category: CategoryEntry; products: ProductEntry[] }[]> {
  const [cats, prods] = await Promise.all([getLocalizedCollection('categories', lang), getLocalizedCollection('products', lang)]);
  return groupByCategory(cats.map(catLike), prods.map(prodLike)).map((g) => ({
    category: g.category.entry,
    products: g.products.map((p) => p.entry),
  }));
}

export async function getProducts(lang: Locale = DEFAULT_LOCALE): Promise<ProductEntry[]> {
  return getLocalizedCollection('products', lang);
}

export async function getRelated(p: ProductEntry, limit = 3, lang: Locale = p.lang): Promise<ProductEntry[]> {
  const all = (await getLocalizedCollection('products', lang)).map(prodLike);
  return pickRelated(prodLike(p), all, limit).map((x) => x.entry);
}
