/**
 * Buyer guides cite primary sources (audit B7): each guide links WCO, DGFT, CBIC, BIS or ICC pages,
 * in every language, carries a "last reviewed" (`updated`) date, and the HSN guide explains the HS
 * 2022 renumbering without publishing any 8-digit code.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { PREFIXED_LOCALES } from '../../src/i18n/locales';

const PRIMARY = /^https:\/\/(www\.wcoomd\.org|www\.dgft\.gov\.in|www\.cbic\.gov\.in|www\.bis\.gov\.in|iccwbo\.org)\//;
const dir = 'src/content/blog';
const slugs = readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
const external = (body: string) => [...body.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]);
const EIGHT_DIGIT = /\b340[12][ .]?\d{2}[ .]?\d{2}\b/;

describe('buyer guides cite primary sources', () => {
  for (const slug of slugs) {
    const en = matter(readFileSync(join(dir, `${slug}.md`), 'utf8'));
    it(`${slug}: links primary sources, has a last-reviewed date, and every translation links the same sources`, () => {
      const links = external(en.content);
      expect(links.length).toBeGreaterThanOrEqual(2);
      for (const u of links) expect(u, 'only primary sources').toMatch(PRIMARY);
      expect(en.data.updated, 'updated: the last-reviewed date').toBeInstanceOf(Date);
      expect(+en.data.updated).toBeGreaterThanOrEqual(+en.data.date);
      for (const l of PREFIXED_LOCALES) {
        const tr = readFileSync(join('src/content/i18n', l, 'blog', `${slug}.md`), 'utf8');
        expect(external(matter(tr).content), `${l}/${slug}`).toEqual(links);
      }
    });
  }

  it('the HSN guide explains the HS 2022 change and says how 8-digit codes are confirmed, in every language', () => {
    const slug = 'hsn-code-3401-vs-3402-soaps-detergents';
    const en = readFileSync(join(dir, `${slug}.md`), 'utf8');
    expect(en).toContain('3402 20');
    expect(en).toContain('HS 2022');
    expect(en).toContain('8-digit ITC-HS codes are confirmed per order against the current DGFT schedule.');
    expect(en).toMatch(/www\.wcoomd\.org/);
    expect(en).toMatch(/www\.dgft\.gov\.in/);
    expect(en).toMatch(/www\.cbic\.gov\.in/);
    for (const l of PREFIXED_LOCALES) {
      const tr = readFileSync(join('src/content/i18n', l, 'blog', `${slug}.md`), 'utf8');
      expect(tr, l).toContain('3402 20');
      expect(tr, l).toContain('DGFT');
    }
  });

  it('no guide publishes an 8-digit ITC-HS code (they are confirmed per order)', () => {
    for (const slug of slugs) {
      expect(readFileSync(join(dir, `${slug}.md`), 'utf8'), slug).not.toMatch(EIGHT_DIGIT);
      for (const l of PREFIXED_LOCALES) expect(readFileSync(join('src/content/i18n', l, 'blog', `${slug}.md`), 'utf8'), `${l}/${slug}`).not.toMatch(EIGHT_DIGIT);
    }
  });

  it('the bath soap grades guide names the standard, IS 2888, and links BIS', () => {
    const t = readFileSync(join(dir, 'bath-soap-grades-tfm-explained.md'), 'utf8');
    expect(t).toContain('IS 2888');
    expect(t).toMatch(/www\.bis\.gov\.in/);
  });
});
