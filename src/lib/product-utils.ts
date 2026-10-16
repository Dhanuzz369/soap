// Pure helpers (no Astro runtime imports) so they can be unit tested with Vitest.
export interface HasOrder { order: number }
export interface HasSlug { slug: string }
export interface CategoryLike extends HasOrder, HasSlug {}
export interface ProductLike extends HasOrder, HasSlug {
  category: string;
  related: string[];
}

export function groupByCategory<C extends CategoryLike, P extends ProductLike>(
  categories: C[],
  products: P[],
): { category: C; products: P[] }[] {
  return [...categories]
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      category,
      products: products
        .filter((p) => p.category === category.slug)
        .sort((a, b) => a.order - b.order),
    }));
}

/** Explicit `related` slugs first (in listed order), then same-category products by order. */
export function pickRelated<P extends ProductLike>(product: P, all: P[], limit = 3): P[] {
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const result: P[] = [];
  const seen = new Set<string>([product.slug]);
  for (const slug of product.related) {
    const p = bySlug.get(slug);
    if (p && !seen.has(slug)) { result.push(p); seen.add(slug); }
  }
  const sameCategory = all
    .filter((p) => p.category === product.category && !seen.has(p.slug))
    .sort((a, b) => a.order - b.order);
  for (const p of sameCategory) result.push(p);
  return result.slice(0, limit);
}
