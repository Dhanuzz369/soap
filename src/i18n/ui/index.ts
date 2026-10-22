/**
 * UI dictionaries: English (en.ts) is the source of truth; each other language file may leave
 * out keys, which then fall back to English. `getUi(lang)` returns the merged dictionary.
 */
import type { Locale } from '../locales.ts';
import en, { type UiDict } from './en.ts';
import type { UiPartial } from './types.ts';
import ar from './ar.ts';
import fr from './fr.ts';
import es from './es.ts';
import pt from './pt.ts';
import ru from './ru.ts';
import zh from './zh.ts';
import de from './de.ts';
import tr from './tr.ts';
import id from './id.ts';
import sw from './sw.ts';
import vi from './vi.ts';

export const DICTS: Record<Locale, UiPartial> = { en, ar, fr, es, pt, ru, zh, de, tr, id, sw, vi };

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/**
 * Deep merge: objects merge key by key; strings and arrays from `over` replace the base value.
 * An array only replaces the English one when it has the same length (a shorter or longer array
 * would break the page, so English is kept and `npm run i18n:check` reports it).
 */
export function mergeDict<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(over) || over.length !== base.length) return base;
    return base.map((b, i) => mergeDict(b, over[i])) as T;
  }
  if (isObj(base)) {
    if (!isObj(over)) return base;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(base)) out[k] = mergeDict((base as Record<string, unknown>)[k], over[k]);
    return out as T;
  }
  return (typeof over === typeof base && over !== '' ? over : base) as T;
}

const cache = new Map<Locale, UiDict>();
export function getUi(lang: Locale): UiDict {
  let d = cache.get(lang);
  if (!d) {
    d = lang === 'en' ? en : mergeDict(en, DICTS[lang]);
    cache.set(lang, d);
  }
  return d;
}

/** Fills `{key}` placeholders. Unknown placeholders are left as they are (and show up in review). */
export function fmt(template: string, vars: Record<string, string | number | undefined>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (vars[k] === undefined ? m : String(vars[k])));
}

/**
 * Keys present in English but missing (or empty, or a wrong-length array) in `dict`, as dotted
 * paths such as `home.promises` or `form.submit`. Used by `npm run i18n:check` and the tests.
 */
export function missingKeys(base: unknown, dict: unknown, prefix = ''): string[] {
  if (typeof base === 'string') return typeof dict === 'string' && dict.trim() !== '' ? [] : [prefix];
  if (Array.isArray(base)) {
    if (!Array.isArray(dict)) return [prefix];
    if (dict.length !== base.length) return [`${prefix} (needs ${base.length} items, has ${dict.length})`];
    return base.flatMap((b, i) => missingKeys(b, dict[i], `${prefix}[${i}]`));
  }
  if (isObj(base)) {
    const d = isObj(dict) ? dict : {};
    return Object.keys(base).flatMap((k) => missingKeys(base[k], d[k], prefix ? `${prefix}.${k}` : k));
  }
  return [];
}

/** Placeholders ({n}, {port}…) used in an English string but missing from its translation. */
export function placeholderProblems(base: unknown, dict: unknown, prefix = ''): string[] {
  const ph = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
  if (typeof base === 'string') {
    if (typeof dict !== 'string' || !dict) return [];
    const want = ph(base);
    const have = new Set(ph(dict));
    // {nameLower} and {name} are interchangeable (languages that capitalise nouns use {name}).
    const lost = want.filter((p) => !have.has(p) && !(p === 'nameLower' && have.has('name')) && !(p === 'name' && have.has('nameLower')));
    return lost.length ? [`${prefix}: missing ${lost.map((p) => `{${p}}`).join(', ')}`] : [];
  }
  if (Array.isArray(base)) return Array.isArray(dict) ? base.flatMap((b, i) => placeholderProblems(b, dict[i], `${prefix}[${i}]`)) : [];
  if (isObj(base)) {
    const d = isObj(dict) ? dict : {};
    return Object.keys(base).flatMap((k) => placeholderProblems(base[k], d[k], prefix ? `${prefix}.${k}` : k));
  }
  return [];
}

export { en };
export type { UiDict };
