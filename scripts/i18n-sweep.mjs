/**
 * npm run i18n:sweep -- --lang fr[,ar] [--base http://localhost:4321] [--widths 360,1440] [--shots dir]
 *
 * Opens every built page of the given language(s) in Chrome (playwright-core, channel "chrome",
 * or CHROME_PATH) and reports pages that scroll sideways or log console errors. Long words in
 * some languages (German, Swahili, Vietnamese…) can push a heading or a button wider than a
 * phone; this finds them. Needs the built site served first: `npm run build && npm run preview`.
 *
 * --shots <dir> also saves first-screen screenshots of home, a product and contact per width.
 * Exit code 1 when a problem is found.
 */
import { readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? def : args[i + 1];
};
const langs = opt('lang', 'fr').split(',');
const base = opt('base', 'http://localhost:4321').replace(/\/$/, '');
const widths = opt('widths', '360,1440').split(',').map(Number);
const shots = opt('shots', '');

const DIST = resolve('dist');
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const all = walk(DIST)
  .filter((f) => f.endsWith('/index.html'))
  .map((f) => f.slice(DIST.length).replace(/index\.html$/, ''));
const pagesFor = (lang) => (lang === 'en' ? all.filter((p) => !/^\/[a-z]{2}\//.test(p)) : all.filter((p) => p.startsWith(`/${lang}/`)));

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' });
const problems = [];
let checked = 0;
for (const lang of langs) {
  const pages = pagesFor(lang);
  for (const width of widths) {
    const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 800 : 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    let errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    for (const path of pages) {
      errors = [];
      await page.goto(base + path, { waitUntil: 'load' });
      // scroll through so lazy content and reveal states settle
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += innerHeight) {
          scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 30));
        }
        scrollTo(0, 0);
      });
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 1) {
        const culprits = await page.evaluate(() => {
          const w = document.documentElement.clientWidth;
          return [...document.querySelectorAll('body *')]
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return r.width > 0 && (r.right > w + 1 || r.left < -1) && getComputedStyle(el).position !== 'fixed';
            })
            .slice(0, 3)
            .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')} "${(el.textContent || '').trim().slice(0, 40)}"`);
        });
        problems.push(`${width}px ${path}: ${over}px sideways scroll (${culprits.join('; ')})`);
      }
      if (errors.length) problems.push(`${width}px ${path}: console ${errors.slice(0, 2).join(' | ')}`);
      checked++;
    }
    if (shots) {
      mkdirSync(shots, { recursive: true });
      const prefix = lang === 'en' ? '' : `/${lang}`;
      for (const [name, p] of [
        ['home', '/'],
        ['product', '/products/dish-wash-liquid/'],
        ['contact', '/contact/'],
      ]) {
        await page.goto(base + prefix + p, { waitUntil: 'load' });
        await page.waitForTimeout(2600); // the hero pop and reveals finish
        await page.screenshot({ path: join(shots, `${name}-${lang}-${width}.png`) });
      }
    }
    await ctx.close();
  }
}
await browser.close();
console.log(`Checked ${checked} page views (${langs.join(', ')} at ${widths.join(' and ')}px).`);
if (problems.length) {
  console.log(problems.join('\n'));
  process.exit(1);
}
console.log('No sideways scroll and no console errors.');
