/**
 * npm run i18n:check [-- --lang fr[,ar]] [-- --strict] [-- --verbose]
 *
 * Reports, per language:
 *  - content: product, category and blog translations that are MISSING, STALE (the English file
 *    changed since the translation was stamped), have MISSING FIELDS, change a FIXED field
 *    (slug, hsn, related…), or have a different number of list items than English;
 *  - UI: dictionary keys missing from src/i18n/ui/<lang>.ts, lost {placeholders}, and a stale
 *    dictionary (src/i18n/ui/en.ts changed since it was stamped);
 *  - orphans: translation files with no English source.
 *
 * Exit code 0 with the report while translations are incomplete; with --strict it exits 1 when
 * anything is missing, stale or wrong. See docs/i18n-translator-guide.md.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import matter from 'gray-matter';
import {
  ROOT,
  I18N_CONTENT,
  COLLECTIONS,
  FIXED_FIELDS,
  englishSlugs,
  englishFile,
  translationFile,
  contentHash,
  loadI18n,
} from './i18n-lib.mjs';

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const verbose = args.includes('--verbose');
const langArg = args.find((a, i) => args[i - 1] === '--lang') ?? args.find((a) => a.startsWith('--lang='))?.slice(7);

const { locales, ui, uiHashes, uiHash } = await loadI18n();
const targets = locales.PREFIXED_LOCALES.filter((c) => !langArg || langArg.split(',').includes(c));
if (langArg && targets.length === 0) {
  console.error(`Unknown language "${langArg}". Languages: ${locales.PREFIXED_LOCALES.join(', ')}`);
  process.exit(2);
}

const rel = (p) => relative(ROOT, p);
const read = (p) => matter(readFileSync(p, 'utf8'));
const LIST_FIELDS = { products: ['variants', 'packSizes', 'packaging', 'specs', 'privateLabel.options', 'faqs', 'gallery'], categories: [], blog: ['faqs'], legal: [] };
const get = (o, path) => path.split('.').reduce((v, k) => (v == null ? v : v[k]), o);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

let problems = 0;
const lines = [];
const out = (s = '') => lines.push(s);

for (const lang of targets) {
  const info = locales.localeInfo(lang);
  const missing = [];
  const stale = [];
  const fieldIssues = [];
  let total = 0;
  let done = 0;

  for (const coll of COLLECTIONS) {
    for (const slug of englishSlugs(coll)) {
      total++;
      const file = translationFile(lang, coll, slug);
      if (!existsSync(file)) {
        missing.push(`${coll}/${slug}.md`);
        continue;
      }
      done++;
      const en = read(englishFile(coll, slug));
      const tr = read(file);
      const name = rel(file);
      if (tr.data.sourceHash !== contentHash(coll, slug)) {
        stale.push(`${name}${tr.data.sourceHash ? '' : ' (never stamped)'}`);
      }
      const translatable = Object.keys(en.data).filter((k) => !FIXED_FIELDS[coll].includes(k));
      const lost = translatable.filter((k) => tr.data[k] === undefined || tr.data[k] === '');
      if (lost.length) fieldIssues.push(`${name}: missing fields ${lost.join(', ')} (English is shown)`);
      if (en.content.trim() && !tr.content.trim()) fieldIssues.push(`${name}: the body (text below the second ---) is empty`);
      for (const k of FIXED_FIELDS[coll]) {
        if (tr.data[k] !== undefined && !same(tr.data[k], en.data[k]) && !(tr.data[k] instanceof Date && en.data[k] instanceof Date && +tr.data[k] === +en.data[k])) {
          fieldIssues.push(`${name}: "${k}" must stay exactly as in English (${JSON.stringify(en.data[k])}); the English value is used`);
        }
      }
      for (const k of LIST_FIELDS[coll]) {
        const a = get(en.data, k);
        const b = get(tr.data, k);
        if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) {
          fieldIssues.push(`${name}: "${k}" has ${b.length} items, English has ${a.length}`);
        }
      }
      const unknown = Object.keys(tr.data).filter((k) => !(k in en.data) && k !== 'sourceHash');
      if (unknown.length) fieldIssues.push(`${name}: unknown fields ${unknown.join(', ')} (typo? they are ignored)`);
    }
  }

  // orphans: translation files whose English source does not exist
  const orphans = [];
  for (const coll of COLLECTIONS) {
    const dir = join(I18N_CONTENT, lang, coll);
    if (!existsSync(dir)) continue;
    const known = new Set(englishSlugs(coll));
    for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
      if (!known.has(f.replace(/\.md$/, ''))) orphans.push(rel(join(dir, f)));
    }
  }

  // UI dictionary
  const dict = ui.DICTS[lang] ?? {};
  const uiMissing = ui.missingKeys(ui.en, dict);
  const uiTotal = ui.missingKeys(ui.en, {}).length;
  const uiPlaceholders = ui.placeholderProblems(ui.en, dict);
  const uiStale = uiMissing.length < uiTotal && uiHashes[lang] !== uiHash;

  const langProblems = missing.length + stale.length + fieldIssues.length + orphans.length + uiMissing.length + uiPlaceholders.length + (uiStale ? 1 : 0);
  problems += langProblems;

  out(`## ${lang}  ${info.native} (${info.english})`);
  out(`   content: ${done}/${total} files translated, ${stale.length} stale, ${fieldIssues.length} field issue(s), ${orphans.length} orphan(s)`);
  out(`   UI:      ${uiTotal - uiMissing.length}/${uiTotal} strings translated${uiStale ? ', STALE (src/i18n/ui/en.ts changed)' : ''}${uiPlaceholders.length ? `, ${uiPlaceholders.length} placeholder problem(s)` : ''}`);
  const list = (title, items, limit = verbose ? Infinity : 12) => {
    if (!items.length) return;
    out(`   ${title}:`);
    items.slice(0, limit).forEach((i) => out(`     - ${i}`));
    if (items.length > limit) out(`     … and ${items.length - limit} more (add --verbose to list all)`);
  };
  if (missing.length === total) out(`   missing: all ${total} content files (create src/content/i18n/${lang}/{products,categories,blog,legal}/)`);
  else list(`missing content files (create in src/content/i18n/${lang}/)`, missing);
  list('stale (update the translation, then: npm run i18n:stamp -- <file>)', stale);
  list('field issues', fieldIssues);
  list('orphans (no English source; delete or rename)', orphans);
  if (uiMissing.length === uiTotal) out(`   UI missing: every key (src/i18n/ui/${lang}.ts is empty)`);
  else list(`UI keys missing in src/i18n/ui/${lang}.ts (English is shown)`, uiMissing);
  list('UI placeholders lost', uiPlaceholders);
  if (uiStale) out(`   UI stale: review src/i18n/ui/${lang}.ts against en.ts, then: npm run i18n:stamp -- src/i18n/ui/${lang}.ts`);
  out();
}

console.log(`i18n check: ${targets.length} language(s)${strict ? ' (strict)' : ''}\n`);
console.log(lines.join('\n'));
if (problems === 0) {
  console.log('All translations complete and current.');
} else if (strict) {
  console.error(`FAIL: ${problems} translation problem(s). See docs/i18n-translator-guide.md.`);
  process.exit(1);
} else {
  console.log(`${problems} translation problem(s) reported. Missing pages fall back to English. (--strict fails on these.)`);
}
