import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { TOKEN, blockingProblems, placeholderProblems, shouldFail } from './placeholder-rules.mjs';

const root = resolve(process.cwd());
const configPath = join(root, 'src/config/site.ts');
const distPath = join(root, 'dist');
// Node 22.18+ runs TypeScript files with type stripping, so the real config values are read here.
const site = (await import(pathToFileURL(configPath).href)).default;

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const full = join(dir, f);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const files = [configPath];
if (existsSync(distPath)) files.push(...walk(distPath).filter((f) => f.endsWith('.html') || f.endsWith('.txt') || f.endsWith('.xml')));
else console.warn('dist/ not found; run `npm run build` to scan built pages too.');

const tokenHits = [];
for (const f of files) {
  readFileSync(f, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (!line.includes(TOKEN)) return;
      const idx = line.indexOf(TOKEN);
      const snippet = line.slice(Math.max(0, idx - 40), idx + 60).trim();
      tokenHits.push(`${relative(root, f)}:${i + 1}: ${snippet}`);
    });
}

const problems = placeholderProblems({
  contactIsPlaceholder: site.contactIsPlaceholder,
  whatsapp: site.contact?.whatsapp,
  endpoint: site.enquiry?.endpoint ?? '',
  tokenHits,
});

if (problems.length) {
  console.log(`${problems.length} placeholder problem(s):`);
  for (const p of problems) console.log(`  ${p}`);
}
if (shouldFail(site.launchReady, blockingProblems(problems))) {
  console.error('\nFAIL: launchReady is true but placeholder contact details remain. Fix them in src/config/site.ts.');
  process.exit(1);
}
if (site.launchReady && problems.length) console.warn('\nWARNING: the site is launched, but set these as soon as you can.');
else if (problems.length) console.warn('\nWARNING: launchReady is false, so this is allowed. Fix these before launch.');
else console.log(`No ${TOKEN} values found.`);
