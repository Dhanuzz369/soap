import { getCollection, type CollectionEntry } from 'astro:content';
import { groupByCategory, pickRelated } from './product-utils';

export type CategoryEntry = CollectionEntry<'categories'>;
export type ProductEntry = CollectionEntry<'products'>;

// Entries expose `data.slug`/`data.category`; adapt them to the pure helpers.
const catLike = (c: CategoryEntry) => ({ slug: c.data.slug, order: c.data.order, entry: c });
const prodLike = (p: ProductEntry) => ({
  slug: p.data.slug,
  order: p.data.order,
  category: p.data.category.id,
  related: p.data.related,
  entry: p,
});

export async function getProductsByCategory(): Promise<{ category: CategoryEntry; products: ProductEntry[] }[]> {
  const [cats, prods] = await Promise.all([getCollection('categories'), getCollection('products')]);
  return groupByCategory(cats.map(catLike), prods.map(prodLike)).map((g) => ({
    category: g.category.entry,
    products: g.products.map((p) => p.entry),
  }));
}

export async function getRelated(p: ProductEntry, limit = 3): Promise<ProductEntry[]> {
  const all = (await getCollection('products')).map(prodLike);
  return pickRelated(prodLike(p), all, limit).map((x) => x.entry);
}
