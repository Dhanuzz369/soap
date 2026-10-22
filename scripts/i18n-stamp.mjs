/**
 * npm run i18n:stamp -- <file or folder> [more…]
 * npm run i18n:stamp -- --lang fr
 *
 * Records which English version a translation was made from, so `npm run i18n:check` can tell
 * when the English changes later. Run it on a translation AFTER you have translated or updated
 * it, never on one you have not checked against the current English.
 *
 *  - src/content/i18n/<lang>/<collection>/<slug>.md: sets `sourceHash:` in the frontmatter to
 *    the hash of src/content/<collection>/<slug>.md.
 *  - src/i18n/ui/<lang>.ts: sets `export const sourceHash = '…'` to the hash of the English
 *    dictionary (src/i18n/ui/en.ts as built, export terms included).
 *  - a folder: every such file inside it.
 *  - --lang <code>: src/i18n/ui/<code>.ts and everything in src/content/i18n/<code>/.
 */
import { readFileSync, writeFileSync, statSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, relative, sep } from 'node:path';
import { ROOT, I18N_CONTENT, UI_DIR, COLLECTIONS, contentHash, loadI18n, englishFile } from './i18n-lib.mjs';

const args = process.argv.slice(2);
const targets = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--lang') {
    const lang = args[++i];
    targets.push(join(UI_DIR, `${lang}.ts`), join(I18N_CONTENT, lang));
  } else targets.push(resolve(args[i]));
}
if (!targets.length) {
  console.error('Usage: npm run i18n:stamp -- <translation file or folder> … | --lang <code>');
  process.exit(2);
}

const { uiHash } = await loadI18n();
const files = [];
const collect = (p) => {
  if (!existsSync(p)) {
    console.error(`Not found: ${relative(ROOT, p)}`);
    process.exitCode = 1;
    return;
  }
  if (statSync(p).isDirectory()) readdirSync(p).forEach((f) => collect(join(p, f)));
  else files.push(p);
};
targets.forEach(collect);

let n = 0;
for (const file of files) {
  const r = relative(ROOT, file);
  const ui = r.match(/^src[\\/]i18n[\\/]ui[\\/]([a-z]{2})\.ts$/);
  if (ui && ui[1] !== 'en') {
    const src = readFileSync(file, 'utf8');
    if (!/export const sourceHash = '[^']*';/.test(src)) {
      console.error(`${r}: no "export const sourceHash = '';" line to update`);
      process.exitCode = 1;
      continue;
    }
    writeFileSync(file, src.replace(/export const sourceHash = '[^']*';/, `export const sourceHash = '${uiHash}';`));
    console.log(`stamped ${r}`);
    n++;
    continue;
  }
  const m = r.split(sep).join('/').match(/^src\/content\/i18n\/([a-z]{2})\/([a-z]+)\/([a-z0-9-]+)\.md$/);
  if (!m || !COLLECTIONS.includes(m[2])) {
    if (file.endsWith('.md') || file.endsWith('.ts')) console.warn(`skipped ${r} (not a translation file)`);
    continue;
  }
  const [, , coll, slug] = m;
  if (!existsSync(englishFile(coll, slug))) {
    console.error(`${r}: no English source src/content/${coll}/${slug}.md`);
    process.exitCode = 1;
    continue;
  }
  const hash = contentHash(coll, slug);
  const src = readFileSync(file, 'utf8');
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) {
    console.error(`${r}: no frontmatter (the file must start with ---)`);
    process.exitCode = 1;
    continue;
  }
  const body = /^sourceHash:.*$/m.test(fm[1])
    ? fm[1].replace(/^sourceHash:.*$/m, `sourceHash: "${hash}"`)
    : `sourceHash: "${hash}"\n${fm[1]}`;
  writeFileSync(file, src.replace(fm[0], `---\n${body}\n---`));
  console.log(`stamped ${r}`);
  n++;
}
console.log(`${n} file(s) stamped.`);
