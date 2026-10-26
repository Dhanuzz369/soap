/**
 * npm run vercel:config
 *
 * Writes vercel.json from src/config/site.ts (src/lib/deploy.ts buildVercelConfig): trailing-slash
 * redirects, security and cache headers, `X-Robots-Tag: noindex` on *.vercel.app hosts, and, once
 * `launchReady` is true with a real `url`, the 308 redirect from *.vercel.app to that domain.
 * Run it after changing `url` or `launchReady`, then commit vercel.json. `npm test` fails while the
 * committed file and site.ts disagree.
 */
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(process.cwd());
const site = (await import(pathToFileURL(join(root, 'src/config/site.ts')).href)).default;
const { buildVercelConfig } = await import(pathToFileURL(join(root, 'src/lib/deploy.ts')).href);

const config = buildVercelConfig({ url: site.url, launchReady: site.launchReady });
writeFileSync(join(root, 'vercel.json'), JSON.stringify(config, null, 2) + '\n');
console.log(`vercel.json written (${config.redirects.length ? `redirects *.vercel.app to ${site.url}` : 'no *.vercel.app redirect yet: launchReady is false or url is not a real domain'}).`);
