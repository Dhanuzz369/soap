/**
 * Pure merge of an English entry's data with its translation's data (unit-tested).
 * Translatable fields come from the translation when present; FIXED fields always come from
 * English, so a translator can never change a slug, HSN code, link target or date by mistake.
 */

export const FIXED_FIELDS = {
  products: ['slug', 'category', 'order', 'reviewed', 'hsn', 'related', 'image'],
  categories: ['slug', 'order', 'hsnRange'],
  blog: ['date', 'updated', 'relatedProducts'],
  legal: ['updated'],
} as const;

/** Bookkeeping fields that only exist in translation files. */
export const STAMP_FIELDS = ['sourceHash'] as const;

type Data = Record<string, unknown>;

export function mergeEntryData(coll: keyof typeof FIXED_FIELDS, en: Data, tr: Data): Data {
  const fixed = new Set<string>(FIXED_FIELDS[coll]);
  const out: Data = { ...en };
  for (const [k, v] of Object.entries(tr)) {
    if (fixed.has(k) || (STAMP_FIELDS as readonly string[]).includes(k) || v === undefined || v === null) continue;
    if (!(k in en)) continue; // unknown keys (typos) are ignored; i18n:check reports them
    if (k === 'privateLabel' && typeof v === 'object') {
      const pl = v as { options?: string[] };
      out.privateLabel = { ...(en.privateLabel as object), ...(pl.options ? { options: pl.options } : {}) };
    } else if (k === 'gallery' && Array.isArray(v) && Array.isArray(en.gallery)) {
      // captions and alt text are translated; the photo files stay the English ones
      const g = en.gallery as { src: string; alt: string; caption: string }[];
      out.gallery = g.map((item, i) => ({ ...item, ...(v[i] ? { alt: v[i].alt ?? item.alt, caption: v[i].caption ?? item.caption } : {}), src: item.src }));
    } else {
      out[k] = v;
    }
  }
  return out;
}
