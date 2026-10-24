/**
 * getStaticPaths helpers for the per-entry pages, shared by the English routes (src/pages/…) and
 * the prefixed ones (src/pages/[lang]/…). Each returns the entries already localized.
 */
import { getProductsByCategory, getRelated, getProducts } from '../lib/products';
import { getPosts } from '../lib/blog';
import { PREFIXED_LOCALES, type Locale } from '../i18n/locales';

export async function productPaths(lang: Locale) {
  const groups = await getProductsByCategory(lang);
  const posts = await getPosts(lang);
  return Promise.all(
    groups.flatMap((g) =>
      g.products.map(async (product) => ({
        params: { slug: product.data.slug },
        props: {
          product,
          category: g.category,
          related: await getRelated(product, 3, lang),
          // Guides about this product: listed in the post's relatedProducts, or linked from its text.
          guides: posts.filter(
            (p) => p.data.relatedProducts.includes(product.data.slug) || (p.body ?? '').includes(`/products/${product.data.slug}/`),
          ),
        },
      })),
    ),
  );
}

export async function categoryPaths(lang: Locale) {
  const groups = await getProductsByCategory(lang);
  return groups.map((g) => ({
    params: { slug: g.category.data.slug },
    props: { category: g.category, products: g.products },
  }));
}

export async function postPaths(lang: Locale) {
  const posts = await getPosts(lang);
  const products = await getProducts(lang);
  return posts.map((post) => {
    const related = post.data.relatedProducts
      .map((s) => products.find((p) => p.data.slug === s))
      .filter((p): p is NonNullable<typeof p> => !!p);
    return { params: { slug: post.id }, props: { post, related } };
  });
}

/** Adds the `lang` param to every path, for every prefixed locale. */
export async function forEachLocale<P extends { params: Record<string, string> }>(make: (lang: Locale) => Promise<P[]>) {
  const all = await Promise.all(
    PREFIXED_LOCALES.map(async (lang) => (await make(lang)).map((p) => ({ ...p, params: { ...p.params, lang } }))),
  );
  return all.flat();
}

/** Static paths for a page with no other parameter. */
export const localeParams = () => PREFIXED_LOCALES.map((lang) => ({ params: { lang } }));
