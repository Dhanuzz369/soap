import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import site from '../../src/config/site';

/*
 * Product and blog files repeat the export terms in their own sentences. When the terms in
 * src/config/site.ts change, this test lists every content file that still has the old wording.
 *
 * Comparison ignores case, the dash style (3-5 vs 3–5), extra spaces, a trailing period and the
 * filler words "are"/"is" (so "FOB, CIF and CFR are available" matches "FOB, CIF and CFR available").
 *  - Incoterms: a file that mentions "FOB, CIF and CFR" must contain the whole `incoterms` text.
 *  - Lead time: a file that mentions "weeks after order confirmation" must contain the lead-time
 *    figure, i.e. `leadTime` up to its first comma without the opening "Typically"
 *    (today: "3–5 weeks after order confirmation"). Sentences may word the rest freely.
 */

const root = process.cwd();
const contentDir = join(root, 'src/content');
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const full = join(dir, f);
    return statSync(full).isDirectory() ? walk(full) : full.endsWith('.md') ? [full] : [];
  });

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[‐‑‒–—−]/g, '-')
    .replace(/\b(are|is)\s+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\.$/, '');

const files = walk(contentDir).map((f) => ({ file: relative(root, f), text: norm(readFileSync(f, 'utf8')) }));

const incoterms = norm(site.exportTerms.incoterms);
const leadFigure = norm(site.exportTerms.leadTime.split(',')[0]).replace(/^(typically|usually)\s+/, '');

function stale(trigger: string, required: string) {
  return files.filter((f) => f.text.includes(norm(trigger)) && !f.text.includes(required)).map((f) => f.file);
}

describe('export terms repeated in content files', () => {
  it('finds the terms in the content at all', () => {
    expect(files.some((f) => f.text.includes(incoterms))).toBe(true);
    expect(files.some((f) => f.text.includes(leadFigure))).toBe(true);
  });

  it(`incoterms match site.ts ("${site.exportTerms.incoterms}")`, () => {
    const out = stale('FOB, CIF and CFR', incoterms);
    expect(out, `Update the incoterms sentence in these files to match src/config/site.ts:\n${out.join('\n')}`).toEqual([]);
  });

  it(`lead time matches site.ts ("${site.exportTerms.leadTime}")`, () => {
    const out = stale('weeks after order confirmation', leadFigure);
    expect(out, `Update the lead-time sentence in these files to match src/config/site.ts:\n${out.join('\n')}`).toEqual([]);
  });
});
