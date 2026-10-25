/** The "Registered exporter" strip on the built site (run `npm run build` first). */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import site from '../../src/config/site';
import { LOCALES, localizePath, type Locale } from '../../src/i18n/locales';
import { getUi } from '../../src/i18n/ui';

const DIST = resolve(process.cwd(), 'dist');
const page = (path: string, lang: Locale) => readFileSync(join(DIST, localizePath(path, lang), 'index.html'), 'utf8');
const IDS = ['fieo', 'msme', 'chemexcil', 'dgft'];
const strip = (html: string) => {
  const a = html.indexOf('data-regs=');
  if (a < 0) return '';
  const start = html.lastIndexOf('<div', a);
  return html.slice(start, html.indexOf('</div>', a) + 6);
};
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const full = join(dir, f);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

describe.each(LOCALES.map((l) => l.code as Locale))('registrations in %s', (lang) => {
  const R = getUi(lang).registrations;
  const footer = (() => {
    const html = page('/', lang);
    return html.slice(html.indexOf('<footer'), html.indexOf('</footer>'));
  })();

  it('the footer has the four registrations, linked to the official sites, above the legal line', () => {
    const s = strip(footer);
    expect(s).toContain('data-regs="compact"');
    expect(s).toContain(`aria-label="${R.aria}"`);
    for (const r of site.registrations) {
      const a = s.match(new RegExp(`<a[^>]*data-reg="${r.id}"[^>]*>`))?.[0] ?? '';
      expect(a, r.id).toContain(`href="${r.url}"`);
      expect(a, r.id).toContain('rel="noopener"');
      expect(a, r.id).toContain('aria-label=');
      expect(s, r.id).toContain(R.status[r.id as 'fieo']);
    }
    expect(footer.indexOf('data-regs=')).toBeLessThan(footer.indexOf('class="footer-legal"'));
  });
  it('the strip has no digits (no registration numbers), apart from image sizes', () => {
    for (const path of ['/', '/about/', '/export-process/', '/horeca/']) {
      const html = page(path, lang);
      let from = 0;
      let n = 0;
      while ((from = html.indexOf('data-regs=', from)) >= 0) {
        const block = html.slice(html.lastIndexOf('<div', from), html.indexOf('</div>', from) + 6).replace(/\s(width|height)="\d+"/g, '');
        expect(block, `${lang}${path}`).not.toMatch(/\d/);
        from += 10;
        n++;
      }
      expect(n, `${lang}${path}`).toBe(path === '/' ? 1 : 2);
    }
  });
  it('the full strip is on About, Export process and HoReCa', () => {
    for (const path of ['/about/', '/export-process/', '/horeca/']) {
      const html = page(path, lang);
      expect(html, path).toContain('data-regs="full"');
      expect(html, path).toContain(R.heading);
      for (const id of IDS) expect(html, `${path} ${id}`).toContain(`data-reg="${id}"`);
    }
  });
});

describe('no DGFT image', () => {
  it('no page has an <img> for dgft (or the State Emblem)', () => {
    const files = walk(DIST).filter((f) => f.endsWith('.html'));
    expect(files.length).toBeGreaterThan(100);
    for (const f of files) {
      const imgs = readFileSync(f, 'utf8').match(/<img\b[^>]*>/g) ?? [];
      for (const img of imgs) expect(img, f).not.toMatch(/dgft|emblem|ashoka|satyamev/i);
    }
  });
  it('text badge when no logo file exists, and logos only for allowed registrations', () => {
    for (const f of walk(DIST).filter((x) => x.endsWith('.html'))) {
      const html = readFileSync(f, 'utf8');
      const a = html.match(/<a[^>]*data-reg="dgft"[\s\S]*?<\/a>/)?.[0];
      if (a) expect(a, f).not.toContain('<img');
    }
  });
});

describe('llms and structured data', () => {
  const line = 'Registered with: FIEO (member), MSME Udyam, CHEMEXCIL (RCMC holder), DGFT (IEC)';
  it('llms.txt in every language and llms-full.txt carry the registrations line', () => {
    for (const l of LOCALES) {
      const file = l.code === 'en' ? 'llms.txt' : `${l.code}/llms.txt`;
      expect(readFileSync(join(DIST, file), 'utf8'), file).toContain(line);
    }
    expect(readFileSync(join(DIST, 'llms-full.txt'), 'utf8')).toContain(line);
  });
  it('Organization memberOf lists FIEO and CHEMEXCIL, with no numbers', () => {
    for (const l of LOCALES) {
      const html = page('/', l.code as Locale);
      const org = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])).find((b) => b['@type'] === 'Organization');
      expect(org.memberOf.map((m: any) => m.url), l.code).toEqual(['https://www.fieo.org/', 'https://www.chemexcil.in/']);
      for (const m of org.memberOf) {
        expect(Object.keys(m).sort()).toEqual(['@type', 'name', 'url']);
        expect(JSON.stringify(m)).not.toMatch(/\d/);
      }
    }
  });
});
