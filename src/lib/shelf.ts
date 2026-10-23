/**
 * "The shelf": the /products/ hero's two rows of product photos (ProductsHero.astro), as pure
 * data. Unit-tested in tests/unit/shelf.test.ts.
 */

/** Cards in row 1 that load eagerly (the first carries fetchpriority="high"). */
export const SHELF_EAGER = 3;

/** The shelf's small copy of a product photo (`npm run hero:images`). */
export const shelfSmall = (slug: string): string => `/images/shelf/${slug}-480.webp`;

/**
 * A card's srcset: the 480px shelf copy (when it exists) before the photo's own 800px copy and
 * original, so a phone's 210px card or a 300px card on a 1x screen loads about half the bytes.
 */
export function shelfSrcset(slug: string, photoSrcset: string, hasSmall: boolean): string {
  return hasSmall ? `${shelfSmall(slug)} 480w, ${photoSrcset}` : photoSrcset;
}

/** The photos' `sizes`: the card is 210px on phones, about 300px on wider screens (shelf.css). */
export const SHELF_SIZES = '(max-width: 759px) 210px, 300px';

/**
 * Deals items grouped by range into one sequence that takes one from each range in turn
 * (range A's first, range B's first, …, then A's second …), so neighbours rarely share a range.
 * Ranges with no items are skipped; the order inside each range is kept.
 */
export function interleave<T>(groups: readonly (readonly T[])[]): T[] {
  const out: T[] = [];
  const longest = Math.max(0, ...groups.map((g) => g.length));
  for (let i = 0; i < longest; i++) for (const g of groups) if (i < g.length) out.push(g[i]);
  return out;
}

/**
 * Splits the ranges' items into two rows that each mix the ranges: the interleaved sequence is
 * cut in half (row 1 gets the extra card when the count is odd). Because each half of a
 * round-robin sequence walks through the ranges in turn, both rows mix them.
 */
export function shelfRows<T>(groups: readonly (readonly T[])[]): [T[], T[]] {
  const all = interleave(groups);
  const cut = Math.ceil(all.length / 2);
  return [all.slice(0, cut), all.slice(cut)];
}
