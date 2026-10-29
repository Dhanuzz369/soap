/**
 * The HoReCa page (/horeca/, Horeca.astro + FloorPlanHero.astro) in every language, and the links
 * to it from the menu, the footer, the home page and two product pages (run `npm run build` first).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import site from '../../src/config/site';
import { LOCALES, localizePath, type Locale } from '../../src/i18n/locales';
import { getUi } from '../../src/i18n/ui';
import { parseEnquiryParams } from '../../src/lib/enquiry';
import { SPACES, HORECA_LINKED, horecaSlugs } from '../../src/lib/horeca';
import { MAX_KEYWORDS, pageTitle } from '../../src/lib/seo';

const DIST = resolve(process.cwd(), 'dist');
const BASE = site.url.replace(/\/$/, '');
const page = (path: string, lang: Locale) => readFileSync(join(DIST, localizePath(path, lang), 'index.html'), 'utf8');
const between = (s: string, start: string, end: string) => {
  const a = s.indexOf(start);
  if (a < 0) return '';
  const b = s.indexOf(end, a);
  return s.slice(a, b < 0 ? undefined : b);
};
const attr = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const decode = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
const blocks = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]) as Record<string, any>);
const visible = (html: string) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ');

describe.each(LOCALES.map((l) => l.code as Locale))('/horeca/ in %s', (lang) => {
  const ui = getUi(lang);
  const H = ui.horeca;
  const url = localizePath('/horeca/', lang);
  const contact = localizePath('/contact/', lang);
  const html = page('/horeca/', lang);
  const hero = between(html, '<section class="ph ph--plan"', '</section>');

  it('exists, with exactly one h1 (in the Floor Plan hero), its title and description', () => {
    expect((html.match(/<h1[\s>]/g) ?? []).length).toBe(1);
    expect(hero).toMatch(/<h1 id="page-h"/);
    expect(decode(hero)).toContain(H.h1a);
    expect(decode(hero)).toContain(H.h1b);
    expect(decode(html.match(/<title>([^<]*)<\/title>/)![1])).toBe(pageTitle(H.title));
    expect(decode(attr(html.match(/<meta name="description"[^>]*>/)![0], 'content')!)).toBe(H.description);
    expect(decode(hero)).toContain(H.lead);
  });

  it('has all six spaces: a hotspot, a card and a section for each', () => {
    const spots = [...hero.matchAll(/<button type="button" class="fp-spot"[^>]*>/g)].map((m) => m[0]);
    expect(spots.map((b) => attr(b, 'data-spot'))).toEqual(SPACES.map((s) => s.id));
    for (const s of SPACES) {
      const b = spots.find((x) => attr(x, 'data-spot') === s.id)!;
      expect(attr(b, 'aria-controls')).toBe(`fp-card-${s.id}`);
      expect(attr(b, 'aria-expanded')).toBe('false');
      expect(attr(b, 'data-target')).toBe(`#${s.anchor}`);
      expect(hero).toContain(`id="fp-card-${s.id}"`);
      expect(html).toContain(`<section class="hc-space" id="${s.anchor}" aria-labelledby="${s.anchor}-h">`);
      expect(decode(between(html, `id="${s.anchor}-h"`, '</h2>'))).toContain(H.spaces[s.id].name);
    }
    // without JS: a link to each section under the drawing
    const legend = between(hero, '<nav class="fp-legend"', '</nav>');
    expect([...legend.matchAll(/href="#([^"]+)"/g)].map((m) => m[1])).toEqual(SPACES.map((s) => s.anchor));
    expect(hero).toMatch(/<div class="fp-stage" dir="ltr" data-plan>/);
  });

  it('links every listed product to its page in this language, with its HoReCa packs and a checkbox', () => {
    for (const s of SPACES) {
      const sec = between(html, `<section class="hc-space" id="${s.anchor}"`, '</section>');
      const links = [...sec.matchAll(/<h3 class="hc-card-title"[^>]*>\s*<a href="([^"]+)"/g)].map((m) => m[1]);
      expect(links, s.id).toEqual(s.products.map((p) => localizePath(`/products/${p.slug}/`, lang)));
      for (const l of links) expect(existsSync(join(DIST, l, 'index.html')), l).toBe(true);
      expect((sec.match(/<input type="checkbox"[^>]*data-pick=/g) ?? []).length).toBe(s.products.length);
      expect((sec.match(/<ul class="hc-packs">/g) ?? []).length).toBe(s.products.length);
    }
    // the same card lists in the hero's floating cards (names and thumbnails)
    for (const slug of horecaSlugs()) expect(hero).toContain(`data-src="/images/thumbs/${slug}-96.webp"`);
    for (const slug of horecaSlugs()) expect(existsSync(join(DIST, 'images/thumbs', `${slug}-96.webp`)), slug).toBe(true);
  });

  it('without JS, every checklist item is a link to this language’s contact page for that product', () => {
    const links = [...html.matchAll(/<a class="hc-add-nojs link-arrow" href="([^"]+)"/g)].map((m) => decode(m[1]));
    expect(links).toHaveLength(SPACES.reduce((n, s) => n + s.products.length, 0));
    for (const l of links) {
      expect(l.startsWith(`${contact}?`)).toBe(true);
      const got = parseEnquiryParams(l.slice(l.indexOf('?')));
      expect(got.products).toHaveLength(1);
      expect(got.message).toBe(H.message.general);
    }
  });

  it('points the CTA to this language’s contact page with a generic HoReCa message', () => {
    const cta = html.match(/<a class="btn hc-cta"[^>]*>/)![0];
    const href = decode(attr(cta, 'href')!);
    expect(href.startsWith(`${contact}?`)).toBe(true);
    expect(parseEnquiryParams(href.slice(href.indexOf('?')))).toEqual({ products: [], message: H.message.general, variety: '' });
    expect(attr(cta, 'data-contact')).toBe(contact);
    expect(JSON.parse(decode(attr(cta, 'data-msg')!))).toEqual(H.message);
    expect(decode(cta + between(html, cta, '</a>'))).toContain(H.panel.cta);
    // the property types, and the hero's buttons to the checklist and the sample note
    const select = between(html, '<select id="hc-type"', '</select>');
    for (const t of Object.values(H.panel.types)) expect(decode(select)).toContain(`>${t}<`);
    expect(hero).toContain('href="#checklist"');
    expect(hero).toContain('href="#samples"');
    expect(html).toContain('id="checklist"');
    expect(html).toContain('id="samples"');
  });

  it('has a valid FAQPage with the six HoReCa questions shown on the page', () => {
    const faq = blocks(html).find((b) => b['@type'] === 'FAQPage')!;
    expect(faq).toBeTruthy();
    expect(faq.url).toBe(BASE + url);
    expect(faq.inLanguage).toBe(LOCALES.find((l) => l.code === lang)!.hreflang);
    expect(faq.mainEntity.map((q: any) => q.name)).toEqual(H.faqs.map((f) => f.q));
    for (const q of faq.mainEntity) {
      expect(q['@type']).toBe('Question');
      expect(q.acceptedAnswer['@type']).toBe('Answer');
      expect(q.acceptedAnswer.text.length).toBeGreaterThan(40);
      expect(visible(html)).toContain(q.name);
    }
  });

  it('describes the page with a BreadcrumbList, one ItemList per space and a Service, never offers', () => {
    const b = blocks(html);
    const crumbs = b.find((x) => x['@type'] === 'BreadcrumbList')!;
    expect(crumbs.itemListElement.at(-1).item).toBe(BASE + url);
    expect(crumbs.itemListElement.at(-1).name).toBe(ui.header.nav.horeca);
    const lists = b.filter((x) => x['@type'] === 'ItemList');
    expect(lists.map((l) => l['@id'])).toEqual(SPACES.map((s) => `${BASE}${url}#${s.anchor}`));
    lists.forEach((l, i) => {
      expect(l.numberOfItems).toBe(SPACES[i].products.length);
      expect(l.itemListElement.map((it: any) => it.url)).toEqual(SPACES[i].products.map((p) => BASE + localizePath(`/products/${p.slug}/`, lang)));
    });
    const service = b.find((x) => x['@type'] === 'Service')!;
    expect(service.provider['@id']).toBe(`${BASE}/#organization`);
    expect(service.audience.audienceType).toBe(H.audience);
    expect(JSON.stringify(b)).not.toMatch(/"(offers|price|priceCurrency|aggregateRating|review)"/);
  });

  it('shares the HoReCa collage and lists HoReCa search phrases in this language', () => {
    expect(html).toContain(`<meta property="og:image" content="${BASE}/og/horeca.jpg">`);
    const kw = decode(attr(html.match(/<meta name="keywords"[^>]*>/)![0], 'content')!).split(', ');
    expect(kw.length).toBeGreaterThanOrEqual(5);
    expect(kw.length).toBeLessThanOrEqual(MAX_KEYWORDS);
    expect(kw).toEqual(ui.seo.keywords.horeca.slice(0, MAX_KEYWORDS));
  });

  it('is linked from the menu (desktop and phone), the footer and the home page', () => {
    for (const p of ['/', '/products/', '/contact/']) {
      const h = page(p, lang);
      expect(between(h, '<nav class="nav-desktop"', '</nav>'), p).toContain(`href="${url}"`);
      expect(between(h, '<nav class="nav-panel"', '</nav>'), p).toContain(`href="${url}"`);
      expect(between(h, '<footer class="site-footer"', '</footer>'), p).toContain(`href="${url}"`);
    }
    expect(between(page('/', lang), '<p class="cats-horeca"', '</p>')).toContain(`href="${url}"`);
    expect(between(html, '<nav class="nav-desktop"', '</nav>')).toContain(`href="${url}" aria-current="page"`);
  });

  it('is linked from the hotel soap and bulk cleaner product pages', () => {
    for (const slug of HORECA_LINKED) {
      const p = page(`/products/${slug}/`, lang);
      const link = p.match(/<a class="link-arrow ph-horeca" href="([^"]+)">([\s\S]*?)<\/a>/);
      expect(link?.[1], slug).toBe(url);
      expect(decode(link![2])).toContain(H.productLink);
    }
  });
});

describe('/horeca/ honesty (English)', () => {
  const text = visible(page('/horeca/', 'en'));
  it('never claims to be better than a brand', () => {
    expect(text).not.toMatch(/(better than|outperform\w*|beats?)\W+(?:\w+\W+){0,6}brands?/i);
    expect(text).not.toMatch(/brands?\W+(?:\w+\W+){0,6}(better than|outperform\w*|beats?)\b/i);
  });
  it('makes no manufacturing claim and invents no savings', () => {
    expect(text).not.toMatch(/we manufacture|our factory|we produce/i);
    expect(text).not.toMatch(/save \d|\d+\s?% (less|cheaper|saving)/i);
  });
});

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

describe('HoReCa wording matches the range (audit B4)', () => {
  for (const l of LOCALES) {
    const lang = l.code as Locale;
    const ui = getUi(lang);
    const html = page('/horeca/', lang);
    it(`${lang}: the scope line sits under the h1 and the guest-room note says what is not supplied`, () => {
      expect(html).toContain(`<p class="fp-scope">${esc(ui.horeca.scope)}</p>`);
      expect(html).toContain(esc(ui.horeca.roomsNote));
    });
  }
  it('English title, description and keywords say hotel soaps and housekeeping chemicals, and do not lead with "hotel amenities supplier"', () => {
    const H = getUi('en').horeca;
    expect(H.title).toMatch(/Hotel Soaps/);
    expect(H.description).toMatch(/soap, body wash, hand wash/);
    expect(H.description).toMatch(/housekeeping, kitchen and laundry chemicals/);
    expect(getUi('en').seo.keywords.horeca).not.toContain('hotel amenities supplier');
    expect(H.roomsNote).toMatch(/do not supply shampoo, conditioner, dental kits or slippers/);
  });
});
