/**
 * The /private-label/ hero ("Your brand, on our shelf", LabelHero.astro) and the /export-process/
 * hero ("the route", RouteHero.astro) in every language (run `npm run build` first).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { LOCALES, localizePath, type Locale } from '../../src/i18n/locales';
import { getUi } from '../../src/i18n/ui';
import { parseEnquiryParams } from '../../src/lib/enquiry';
import { BRAND_MAX, COLOURWAYS } from '../../src/lib/brand-label';
import { REGIONS } from '../../src/lib/route-map';

const DIST = resolve(process.cwd(), 'dist');
const page = (path: string, lang: Locale) => readFileSync(join(DIST, localizePath(path, lang), 'index.html'), 'utf8');
const between = (s: string, start: string, end: string) => {
  const a = s.indexOf(start);
  if (a < 0) return '';
  const b = s.indexOf(end, a);
  return s.slice(a, b < 0 ? undefined : b);
};
const attr = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const decode = (s: string) =>
  s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const h1s = (html: string) => (html.match(/<h1[\s>]/g) ?? []).length;

describe.each(LOCALES.map((l) => l.code as Locale))('/private-label/ hero in %s', (lang) => {
  const ui = getUi(lang);
  const H = ui.privateLabel.hero;
  const html = page('/private-label/', lang);
  const hero = between(html, '<section class="ph ph--label"', '</section>');

  it('has the hero and exactly one h1, inside it', () => {
    expect(hero.length).toBeGreaterThan(0);
    expect(h1s(html)).toBe(1);
    expect(hero).toMatch(/<h1 id="page-h"/);
    expect(decode(hero)).toContain(H.h1a);
  });

  it('keeps the page title, description and the sections below the hero', () => {
    expect(decode(html.match(/<title>([^<]*)<\/title>/)![1])).toContain(ui.privateLabel.title);
    expect(decode(attr(html.match(/<meta name="description"[^>]*>/)![0], 'content')!)).toBe(ui.privateLabel.description);
    for (const id of ['pl-options-h', 'pl-process-h', 'faq', 'quote-h']) expect(html).toContain(`id="${id}"`);
  });

  it('links the enquiry button into this language’s contact page with a prefilled message', () => {
    const cta = hero.match(/<a class="btn btn--light lh-cta"[^>]*>/)![0];
    const href = decode(attr(cta, 'href')!);
    expect(href.startsWith(`${localizePath('/contact/', lang)}?`)).toBe(true);
    expect(parseEnquiryParams(href.slice(href.indexOf('?'))).message).toBe(H.messageNoBrand);
    expect(attr(cta, 'data-contact')).toBe(localizePath('/contact/', lang));
    expect(hero).toContain('href="#faq"');
  });

  it('draws both packs with the placeholder brand, and offers the field and the swatches', () => {
    const names = [...hero.matchAll(/<text class="lh-name"[^>]*>([^<]*)<\/text>/g)].map((m) => decode(m[1]));
    expect(names).toEqual([H.placeholder, H.placeholder]);
    const input = hero.match(/<input id="lh-brand"[^>]*>/)![0];
    expect(attr(input, 'maxlength')).toBe(String(BRAND_MAX));
    expect(hero).toContain('<label for="lh-brand">');
    expect((hero.match(/type="radio" name="colourway"/g) ?? []).length).toBe(COLOURWAYS.length);
    expect(decode(hero)).toContain(H.caption);
  });

  it('shows the four steps as numbered markers', () => {
    const steps = between(hero, '<ol class="lh-steps"', '</ol>');
    expect((steps.match(/<li/g) ?? []).length).toBe(4);
    expect(steps).toContain('>01<');
    expect(steps).toContain('>04<');
  });
});

describe.each(LOCALES.map((l) => l.code as Locale))('/export-process/ hero in %s', (lang) => {
  const ui = getUi(lang);
  const R = ui.exportProcess.route;
  const html = page('/export-process/', lang);
  const hero = between(html, '<section class="ph ph--route"', '</section>');
  const cap = between(hero, '<figcaption class="rt-cap"', '</figcaption>');

  it('has the hero and exactly one h1, inside it', () => {
    expect(hero.length).toBeGreaterThan(0);
    expect(h1s(html)).toBe(1);
    expect(hero).toMatch(/<h1 id="page-h"/);
    expect(decode(hero)).toContain(R.h1a);
  });

  it('keeps the page title, description and the sections below the hero', () => {
    expect(decode(html.match(/<title>([^<]*)<\/title>/)![1])).toContain(ui.exportProcess.title);
    expect(decode(attr(html.match(/<meta name="description"[^>]*>/)![0], 'content')!)).toBe(ui.exportProcess.description);
    for (const id of ['terms-h', 'steps', 'docs-h', 'faq', 'quote-h']) expect(html).toContain(`id="${id}"`);
  });

  it('credits Natural Earth in the map caption and states the terms without invented numbers', () => {
    expect(cap).toContain('Natural Earth');
    expect(decode(cap)).toContain(decode(R.credit));
    expect(decode(cap)).toContain(ui.terms.leadTime);
    expect(decode(cap)).toContain(R.laneAll);
  });

  it('draws the map un-mirrored, with an arc, a lane and a port for each region', () => {
    expect(hero).toMatch(/<div class="rt-canvas" dir="ltr">/);
    expect((hero.match(/<path class="rt-land"/g) ?? []).length).toBe(1);
    expect((hero.match(/class="rt-arc"/g) ?? []).length).toBe(REGIONS.length);
    expect((hero.match(/class="rt-lane"/g) ?? []).length).toBe(REGIONS.length);
    expect((hero.match(/class="rt-origin-dot"/g) ?? []).length).toBe(3);
  });

  it('offers the six regions as a radio group with a roving tabindex', () => {
    const buttons = [...hero.matchAll(/<button class="rt-region"[^>]*>/g)].map((m) => m[0]);
    expect(buttons.map((b) => attr(b, 'data-region'))).toEqual(REGIONS.map((r) => r.id));
    expect(buttons.map((b) => attr(b, 'tabindex'))).toEqual(['0', '-1', '-1', '-1', '-1', '-1']);
    for (const b of buttons) {
      expect(attr(b, 'role')).toBe('radio');
      expect(decode(attr(b, 'data-lane')!)).toMatch(/\S.*\S/);
    }
    expect(hero).toMatch(/role="radiogroup" aria-labelledby="rt-regions-l"/);
  });

  it('shows the four-step timeline and keeps the link to the full steps', () => {
    const tl = between(hero, '<ol class="rt-timeline"', '</ol>');
    expect((tl.match(/<li/g) ?? []).length).toBe(4);
    expect(hero).toContain('href="#steps"');
  });
});
