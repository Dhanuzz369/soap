/**
 * Starts `astro preview` on PORT for the browser tests and stops it afterwards.
 * Run `npm run build` first: the preview serves dist/ as it is.
 */
import { execFileSync, spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';

export const PORT = 4329;
let server: ChildProcess | undefined;

async function up(url: string, ms: number) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      if ((await fetch(url)).ok) return true;
    } catch {
      /* not yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

export async function setup() {
  if (!existsSync('dist/contact/index.html')) throw new Error('dist/ is missing: run `npm run build` before `npm run test:e2e`.');
  const url = `http://localhost:${PORT}/contact/`;
  if (await up(url, 300)) throw new Error(`Port ${PORT} is already in use; stop that server first.`);
  server = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--port', String(PORT)], { stdio: 'ignore', detached: true });
  if (!(await up(url, 30_000))) throw new Error('astro preview did not start');
}

export async function teardown() {
  // astro preview re-launches itself as a detached process, so stop whatever now listens on PORT
  // (setup checked the port was free, so it is the server we started), then the launcher.
  try {
    const pids = execFileSync('lsof', ['-tiTCP:' + PORT, '-sTCP:LISTEN'], { encoding: 'utf8' }).split(/\s+/).filter(Boolean);
    for (const pid of pids) process.kill(Number(pid), 'SIGTERM');
  } catch {
    /* nothing listening, or no lsof */
  }
  server?.kill('SIGTERM');
}
