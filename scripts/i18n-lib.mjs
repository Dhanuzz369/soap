/**
 * Shared helpers for `npm run i18n:check` and `npm run i18n:stamp` (and the tests).
 *
 * Staleness: every translation records the English source it was translated from as
 * `sourceHash` (a short SHA-256 of the English file, or of the English UI dictionary). When the
 * English changes, the hash no longer matches and the translation is reported as stale until a
 * translator updates it and runs `npm run i18n:stamp` on it.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const ROOT = resolve(process.cwd());
export const CONTENT = join(ROOT, 'src/content');
export const I18N_CONTENT = join(CONTENT, 'i18n');
export const UI_DIR = join(ROOT, 'src/i18n/ui');
export const COLLECTIONS = ['products', 'categories', 'blog'];

/** Fields that are never translated (they always come from English; src/i18n/merge.ts). */
export const FIXED_FIELDS = {
  products: ['slug', 'category', 'order', 'hsn', 'related', 'image'],
  categories: ['slug', 'order', 'hsnRange'],
  blog: ['date', 'updated', 'relatedProducts'],
};

export const shortHash = (text) => createHash('sha256').update(text.replace(/\r\n/g, '\n').trim()).digest('hex').slice(0, 12);

export const englishFile = (coll, slug) => join(CONTENT, coll, `${slug}.md`);
export const translationFile = (lang, coll, slug) => join(I18N_CONTENT, lang, coll, `${slug}.md`);

export function englishSlugs(coll) {
  return readdirSync(join(CONTENT, coll))
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .sort();
}

export function contentHash(coll, slug) {
  return shortHash(readFileSync(englishFile(coll, slug), 'utf8'));
}

/** The locales module, the English dictionary and every language dictionary (TypeScript, via Node's type stripping). */
export async function loadI18n() {
  const locales = await import(pathToFileURL(join(ROOT, 'src/i18n/locales.ts')).href);
  const ui = await import(pathToFileURL(join(UI_DIR, 'index.ts')).href);
  const hashes = {};
  for (const l of locales.LOCALES) {
    if (l.code === 'en') continue;
    const mod = await import(pathToFileURL(join(UI_DIR, `${l.code}.ts`)).href);
    hashes[l.code] = mod.sourceHash ?? '';
  }
  return { locales, ui, uiHashes: hashes, uiHash: shortHash(JSON.stringify(ui.en)) };
}

export const exists = existsSync;
