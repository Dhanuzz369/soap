/**
 * The HoReCa page's data (src/lib/horeca.ts): every space's products exist and suit that space
 * according to their own product files, the HoReCa packs are real pack sizes, the promise is
 * backed by the product files, and the checklist → contact page link builder.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { SPACES, PROPERTY_TYPES, HORECA_LINKED, horecaSlugs, horecaMessage, horecaEnquiryHref, DRAWING, type SpaceId } from '../../src/lib/horeca';
import { parseEnquiryParams, MAX_URL_MESSAGE } from '../../src/lib/enquiry';
import { getUi } from '../../src/i18n/ui';
import { LOCALES, PREFIXED_LOCALES } from '../../src/i18n/locales';

const root = process.cwd();
const product = (slug: string, lang = 'en') => {
  const file = lang === 'en' ? join(root, 'src/content/products', `${slug}.md`) : join(root, 'src/content/i18n', lang, 'products', `${slug}.md`);
  return matter(readFileSync(file, 'utf8')).data as Record<string, any>;
};
const ALL = readdirSync(join(root, 'src/content/products')).map((f) => f.replace(/\.md$/, ''));

/** What a product's own file must say for it to belong in a space (its `uses`, `variants` or `packaging`). */
const FITS: Record<SpaceId, RegExp> = {
  rooms: /hotel|lodge|guest|amenit/i,
  kitchen: /restaurant|kitchen|catering|canteen|eateries|degreaser/i,
  washrooms: /washroom|public|office|workplace|clinic|hostel/i,
  floors: /floor|mopping|housekeeping|hospitality|offices/i,
  laundry: /laundr|washing|linen|garment|clothing|rinse/i,
  backOfHouse: /hotel|hospitality|institutional/i,
};

describe('HoReCa spaces', () => {
  it('has the six approved spaces, in order, each with an anchor and a point on the drawing', () => {
    expect(SPACES.map((s) => s.id)).toEqual(['rooms', 'kitchen', 'washrooms', 'floors', 'laundry', 'backOfHouse']);
    for (const s of SPACES) {
      expect(s.anchor).toMatch(/^space-[a-z-]+$/);
      expect(s.spot.x).toBeGreaterThan(0);
      expect(s.spot.x).toBeLessThan(DRAWING.w);
      expect(s.spot.y).toBeGreaterThan(0);
      expect(s.spot.y).toBeLessThan(DRAWING.h);
    }
    expect(new Set(SPACES.map((s) => s.anchor)).size).toBe(SPACES.length);
  });

  it('lists only existing products, each once per space', () => {
    for (const s of SPACES) {
      const slugs = s.products.map((p) => p.slug);
      expect(new Set(slugs).size, s.id).toBe(slugs.length);
      for (const slug of slugs) expect(ALL, `${s.id}: ${slug}`).toContain(slug);
    }
    expect(horecaSlugs()).toHaveLength(new Set(SPACES.flatMap((s) => s.products.map((p) => p.slug))).size);
  });

  it('puts each product only where its own product file supports it', () => {
    for (const s of SPACES)
      for (const { slug } of s.products) {
        const d = product(slug);
        const said = [...d.uses, ...d.variants, ...d.packaging].join(' | ');
        expect(said, `${slug} in ${s.id}`).toMatch(FITS[s.id]);
      }
  });

  it('shows real pack sizes: every index is in the product file, in English and every translation', () => {
    for (const s of SPACES)
      for (const p of s.products) {
        expect(p.packs.length, `${s.id}/${p.slug}`).toBeGreaterThan(0);
        expect(new Set(p.packs).size).toBe(p.packs.length);
        const en = product(p.slug).packSizes as string[];
        for (const i of p.packs) expect(en[i], `${p.slug} pack ${i}`).toBeTruthy();
        for (const lang of PREFIXED_LOCALES) {
          const file = join(root, 'src/content/i18n', lang, 'products', `${p.slug}.md`);
          if (existsSync(file)) expect((product(p.slug, lang).packSizes as string[]).length, `${lang}/${p.slug}`).toBe(en.length);
        }
      }
  });

  it('uses the larger catering and housekeeping packs where the product has them', () => {
    const big = /(\d+)\s*(L|kg)\b/;
    for (const s of SPACES)
      for (const p of s.products) {
        const en = product(p.slug).packSizes as string[];
        const liquids = en.filter((x) => big.test(x) && Number(x.match(big)![1]) >= 5);
        const shown = p.packs.map((i) => en[i]);
        for (const l of liquids.filter((x) => !/1,000/.test(x))) expect(shown, `${p.slug} should show ${l}`).toContain(l);
      }
  });

  it('backs every promise with the product files', () => {
    const packs = horecaSlugs().flatMap((s) => product(s).packSizes as string[]);
    for (const want of ['5 L', '20 L', '200 L drum', '25 kg']) expect(packs.join(' | ')).toContain(want);
    // private label on guest amenities: soap with the hotel's logo, shower gel and hand wash
    for (const slug of ['hotel-guest-soap', 'body-wash-shower-gel', 'liquid-hand-wash']) expect(product(slug).privateLabel.available, slug).toBe(true);
    expect(product('hotel-guest-soap').privateLabel.options.join(' ')).toMatch(/logo/i);
    // no fixed minimum, on every product on the page
    for (const slug of horecaSlugs()) expect(product(slug).moq, slug).toMatch(/^No fixed minimum/);
  });

  it('links the HoReCa page from the hotel soap and bulk cleaner pages', () => {
    expect(HORECA_LINKED).toEqual(['hotel-guest-soap', 'bulk-institutional-cleaners']);
  });
});

describe('HoReCa copy in every language', () => {
  for (const { code } of LOCALES) {
    const H = getUi(code).horeca;
    it(`${code}: names every space and property type, and makes no brand comparison`, () => {
      for (const s of SPACES) expect(H.spaces[s.id].name.trim().length, `${code} ${s.id}`).toBeGreaterThan(1);
      for (const t of PROPERTY_TYPES) expect(H.panel.types[t].trim().length).toBeGreaterThan(1);
      expect(H.promises).toHaveLength(5);
      expect(H.faqs).toHaveLength(6);
      expect(H.samplesSteps).toHaveLength(3);
      const all = JSON.stringify(H);
      expect(all).not.toMatch(/better than|outperform|beats|superior to|cheaper than/i);
      expect(all).not.toMatch(/\d+\s?%/); // no savings percentages
    });
  }
});

describe('the checklist → contact page link', () => {
  const m = getUi('en').horeca.message;
  const contact = '/contact/';

  it('sends every ticked product as ?product= and names them in ?message=, with the property type', () => {
    const href = horecaEnquiryHref(
      contact,
      [
        { slug: 'hotel-guest-soap', name: 'Hotel & Guest Soap' },
        { slug: 'dish-wash-liquid', name: 'Dish Wash Liquid' },
      ],
      'Hotel',
      m,
    );
    expect(href.startsWith('/contact/?')).toBe(true);
    const got = parseEnquiryParams(href.slice(href.indexOf('?')));
    expect(got.products).toEqual(['hotel-guest-soap', 'dish-wash-liquid']);
    expect(got.message).toBe('HoReCa enquiry: samples requested for Hotel & Guest Soap, Dish Wash Liquid. Property type: Hotel.');
  });

  it('leaves out the property type when none is chosen', () => {
    const href = horecaEnquiryHref(contact, [{ slug: 'floor-cleaner', name: 'Floor Cleaner' }], '', m);
    expect(parseEnquiryParams(href.slice(href.indexOf('?'))).message).toBe('HoReCa enquiry: samples requested for Floor Cleaner.');
  });

  it('sends a generic HoReCa message when nothing is ticked (also the no-JS link)', () => {
    const href = horecaEnquiryHref('/fr/contact/', [], '', m);
    const got = parseEnquiryParams(href.slice(href.indexOf('?')));
    expect(href.startsWith('/fr/contact/?')).toBe(true);
    expect(got.products).toEqual([]);
    expect(got.message).toBe(m.general);
    expect(parseEnquiryParams(horecaEnquiryHref(contact, [], 'Café', m).split('?')[1]).message).toBe(`${m.general} Property type: Café.`);
  });

  it('drops duplicates (a product shown in two spaces) and anything that is not a slug', () => {
    const href = horecaEnquiryHref(
      contact,
      [
        { slug: 'liquid-hand-wash', name: 'Liquid Hand Wash' },
        { slug: 'glass-cleaner', name: 'Glass Cleaner' },
        { slug: 'liquid-hand-wash', name: 'Liquid Hand Wash' },
        { slug: '<script>', name: 'x' },
      ],
      '',
      m,
    );
    const got = parseEnquiryParams(href.slice(href.indexOf('?')));
    expect(got.products).toEqual(['liquid-hand-wash', 'glass-cleaner']);
    expect(got.message).toBe('HoReCa enquiry: samples requested for Liquid Hand Wash, Glass Cleaner.');
  });

  it('keeps the message within the contact form’s limit and every slug in ?product=', () => {
    const many = horecaSlugs().map((slug) => ({ slug, name: `${slug} `.repeat(8).trim() }));
    const href = horecaEnquiryHref(contact, many, 'Catering', m);
    const got = parseEnquiryParams(href.slice(href.indexOf('?')));
    expect(got.products).toEqual(horecaSlugs());
    expect(got.message.length).toBeLessThanOrEqual(MAX_URL_MESSAGE);
    expect(got.message).toMatch(/Property type: Catering\.$/);
  });

  it('fills the translated templates (Chinese separator, Arabic)', () => {
    const zh = getUi('zh').horeca.message;
    expect(horecaMessage(['洗洁精', '地板清洁剂'], '酒店', zh)).toBe('HoReCa询价：申请以下产品的样品：洗洁精、地板清洁剂。场所类型：酒店。');
    const ar = getUi('ar').horeca.message;
    expect(horecaMessage(['أ', 'ب'], '', ar)).toContain('أ، ب');
  });
});
