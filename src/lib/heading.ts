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

/**
 * A product or category h1 in the page's language, from the UI template `common.titleH1`
 * ("{name}|Exporter & Supplier from India", French "{name} :|exportateur et fournisseur depuis
 * l’Inde"…). `{name}` becomes line 1 (with splitName's small descriptor), the text after `|` the
 * italic line 2; anything next to `{name}` in the template (a colon) stays attached to the name.
 * Read straight through, the h1 is one natural phrase in every language.
 */
export function composeTitle(template: string, name: string): TitleParts & { l2: string } {
  const bar = template.indexOf('|');
  const head = bar < 0 ? template : template.slice(0, bar);
  const l2 = bar < 0 ? '' : template.slice(bar + 1).trim();
  const at = head.indexOf('{name}');
  const before = at < 0 ? '' : head.slice(0, at);
  const after = at < 0 ? '' : head.slice(at + '{name}'.length).replace(/\s+$/, '');
  const parts = splitName(name);
  return parts.sub
    ? { l1: before + parts.l1, sub: parts.sub + after, l2, scale: parts.scale }
    : { l1: before + parts.l1 + after, l2, scale: parts.scale };
}

/** An article title: the part after the first ": " becomes the italic second line. */
export function splitPostTitle(title: string): { l1: string; l2?: string } {
  const i = title.indexOf(': ');
  if (i <= 0) return { l1: title };
  return { l1: title.slice(0, i + 1), l2: title.slice(i + 2) };
}
