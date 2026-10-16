import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const root = resolve(process.cwd());
const TOKEN = 'PLACEHOLDER';
const configPath = join(root, 'src/config/site.ts');
const distPath = join(root, 'dist');

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const full = join(dir, f);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const files = [configPath];
if (existsSync(distPath)) files.push(...walk(distPath).filter((f) => f.endsWith('.html') || f.endsWith('llms.txt')));
else console.warn('dist/ not found; run `npm run build` to scan built pages too.');

const hits = [];
for (const f of files) {
  readFileSync(f, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (!line.includes(TOKEN)) return;
      const idx = line.indexOf(TOKEN);
      const snippet = line.slice(Math.max(0, idx - 40), idx + 60).trim();
      hits.push(`${relative(root, f)}:${i + 1}: ${snippet}`);
    });
}

const stripped = readFileSync(configPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
const launchReady = /^\s*launchReady\s*:\s*true\b/m.test(stripped);

if (hits.length) {
  console.log(`${hits.length} ${TOKEN} occurrence(s):`);
  for (const h of hits) console.log(`  ${h}`);
}
if (hits.length && launchReady) {
  console.error(`\nFAIL: launchReady is true but ${TOKEN} values remain. Replace them in src/config/site.ts.`);
  process.exit(1);
}
if (hits.length) console.warn(`\nWARNING: launchReady is false, so this is allowed. Fix these before launch.`);
else console.log(`No ${TOKEN} values found.`);
