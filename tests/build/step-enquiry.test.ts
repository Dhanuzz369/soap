/**
 * The step-by-step enquiry form (StepEnquiry.astro) as built (run `npm run build` first).
 * Without JS it is one long form, so everything here is checked in the static HTML.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import site from '../../src/config/site';
import { LOCALE_CODES, localizePath, type Locale } from '../../src/i18n/locales';
import { getUi } from '../../src/i18n/ui';
import { STEP_IDS } from '../../src/lib/enquiry-steps';

const DIST = resolve(process.cwd(), 'dist');
const page = (lang: Locale) => readFileSync(join(DIST, localizePath('/contact/', lang), 'index.html'), 'utf8');
const formOf = (html: string) => html.slice(html.indexOf('<form'), html.indexOf('</form>') + 7);
const tags = (html: string, re: RegExp) => [...html.matchAll(re)].map((m) => m[0]);
const attr = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const decode = (s: string) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const en = page('en');
const form = formOf(en);
const formTag = form.slice(0, form.indexOf('>') + 1);

describe('step enquiry form markup', () => {
  it('is the form on the contact page, with its data for the script', () => {
    expect(formTag).toContain('data-step-enquiry');
    expect(attr(formTag, 'data-lang')).toBe('en');
    expect(attr(formTag, 'data-language-name')).toBe('English');
    expect(attr(formTag, 'data-whatsapp')).toBe(site.contact.whatsapp);
    expect(attr(formTag, 'data-email')).toBe(site.contact.email);
    const english = JSON.parse(decode(attr(formTag, 'data-english') ?? '{}'));
    expect(english['dish-wash-liquid']).toBe('Dish Wash Liquid / Gel');
    expect(english['kitchen-care']).toBeTruthy();
    const variants = JSON.parse(decode(attr(formTag, 'data-variants') ?? '{}'));
    expect(variants['dish-wash-liquid']).toContain('green-apple');
  });
  it('has the seven steps in order, each with a focusable title', () => {
    const steps = tags(form, /<section[^>]*data-step="[^"]+"[^>]*>/g).map((t) => attr(t, 'data-step'));
    expect(steps).toEqual([...STEP_IDS]);
    expect(tags(form, /<h3[^>]*tabindex="-1"[^>]*>/g).length).toBeGreaterThanOrEqual(7);
  });
  it('offers five product groups plus "something else"', () => {
    const groups = tags(form, /<input[^>]*name="group"[^>]*>/g);
    expect(groups).toHaveLength(6);
    expect(groups.map((g) => attr(g, 'data-key')).slice(-1)).toEqual(['other']);
    expect(form).toMatch(/data-other-for="productOther"/);
  });
  it('lists all 23 products, grouped by range, plus "several" and "not sure" per range', () => {
    const products = tags(form, /<input[^>]*name="product"[^>]*>/g);
    expect(products.filter((p) => !/data-special/.test(p))).toHaveLength(23);
    expect(products.filter((p) => /data-special/.test(p))).toHaveLength(10);
    expect(tags(form, /data-products-for="[^"]+"/g)).toHaveLength(5);
  });
  it('has four quantities plus "another amount", and four terms with "not sure" first', () => {
    const q = tags(form, /<input[^>]*name="quantity"[^>]*>/g).map((t) => attr(t, 'data-key'));
    expect(q).toEqual(['trial', '1', '2-5', '6+', 'other']);
    const t = tags(form, /<input[^>]*name="terms"[^>]*>/g).map((x) => attr(x, 'data-key'));
    expect(t).toEqual(['not-sure', 'FOB', 'CFR', 'CIF']);
  });
  it('sends English values', () => {
    expect(tags(form, /<input[^>]*name="quantity"[^>]*data-key="2-5"[^>]*>/g)[0] ?? tags(form, /<input[^>]*data-key="2-5"[^>]*>/g)[0]).toContain('value="2–5 containers"');
    expect(tags(form, /<input[^>]*id="enq-product-kitchen-care-dish-wash-liquid"[^>]*>/g)[0]).toContain('value="Dish Wash Liquid / Gel"');
  });
  it('has a hidden honeypot that keyboard users never reach', () => {
    const hp = tags(form, /<input[^>]*name="website_confirm"[^>]*>/g)[0];
    expect(hp).toContain('type="checkbox"');
    expect(hp).toContain('tabindex="-1"');
    expect(hp).toContain('autocomplete="off"');
    expect(form).toMatch(/aria-hidden="true"[^>]*>\s*<label[^>]*>[^<]*<input[^>]*name="website_confirm"/);
  });
  it('falls back to mailto: while the endpoint is a placeholder', () => {
    expect(attr(formTag, 'action')).toBe(`mailto:${site.contact.email}`);
    expect(attr(formTag, 'enctype')).toBe('text/plain');
    expect(attr(formTag, 'method')).toBe('post');
    expect(formTag).toMatch(/\sdata-endpoint[\s>]/);
    expect(formTag).not.toMatch(/data-endpoint="[^"]+"/);
  });
  it('posts the lead id, stage and language with the answers', () => {
    expect(form).toMatch(/<input[^>]*type="hidden"[^>]*name="leadId"/);
    expect(form).toMatch(/<input[^>]*type="hidden"[^>]*name="stage"[^>]*value="submitted"/);
    expect(form).toMatch(/<input[^>]*type="hidden"[^>]*name="language"[^>]*value="English"/);
  });
  it('gives every input a unique id', () => {
    const ids = tags(form, /\sid="[^"]+"/g);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('has the stepper chrome, hidden until the script runs', () => {
    for (const sel of ['data-progress', 'data-step-label', 'data-back', 'data-next', 'data-skip', 'data-summary', 'data-send', 'data-wa-early']) expect(form, sel).toContain(sel);
    expect(tags(form, /<[^>]*data-chrome[^>]*>/g).every((t) => /\shidden/.test(t))).toBe(true);
    expect(tags(form, /<[^>]*data-success[^>]*>/g)[0]).toMatch(/\shidden/);
    expect(tags(form, /<[^>]*data-fail[^>]*>/g)[0]).toMatch(/\shidden/);
    expect(form).toMatch(/<p[^>]*role="status"[^>]*aria-live="polite"/);
  });
  it('keeps the error slots empty and hidden', () => {
    const slots = tags(form, /<p[^>]*data-error-for="[^"]+"[^>]*>/g);
    expect(slots.length).toBeGreaterThanOrEqual(8);
    expect(slots.every((s) => /\shidden/.test(s))).toBe(true);
  });
  it('shows the privacy line and the email-or-WhatsApp hint', () => {
    expect(form).toContain(getUi('en').steps.privacy);
    expect(form).toContain(getUi('en').steps.contactHint);
  });
});

describe('every language', () => {
  for (const l of LOCALE_CODES) {
    it(`${l}: the form is translated and keeps its English values`, () => {
      const html = page(l);
      const f = formOf(html);
      expect(f).toContain('data-step-enquiry');
      for (const id of STEP_IDS) expect(f, `${l} ${id}`).toContain(getUi(l).steps.titles[id].replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/’/g, '’'));
      expect(f).toContain('value="Dish Wash Liquid / Gel"');
    });
  }
  it('ar: the page is right-to-left with Arabic step titles', () => {
    const ar = page('ar');
    expect(ar).toMatch(/<html[^>]*dir="rtl"/);
    expect(formOf(ar)).toContain(getUi('ar').steps.titles.contact);
  });
});
