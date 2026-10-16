/**
 * Visual splits for long h1s. The h1 keeps its full text; only how it is set changes
 * (PageHero renders l1, an optional small `sub`, and the italic second line).
 */

export type TitleParts = { l1: string; sub?: string; scale: 's' | 'm' | 'l' };

/**
 * A product or category name: a trailing parenthetical becomes the small descriptor
 * ("LABSA" + "(Linear Alkyl Benzene Sulphonic Acid)"), and long names get a smaller scale.
 */
export function splitName(title: string): TitleParts {
  const m = title.match(/^(.+?)\s+(\([^)]+\))$/);
  const l1 = m ? m[1] : title;
  const sub = m ? m[2] : undefined;
  const scale = l1.length <= 18 ? 's' : l1.length <= 26 ? 'm' : 'l';
  return { l1, sub, scale };
}

/** An article title: the part after the first ": " becomes the italic second line. */
export function splitPostTitle(title: string): { l1: string; l2?: string } {
  const i = title.indexOf(': ');
  if (i <= 0) return { l1: title };
  return { l1: title.slice(0, i + 1), l2: title.slice(i + 2) };
}
