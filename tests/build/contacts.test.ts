/**
 * Real contacts and business details on the built site (spec 2026-10-28 §2). Run `npm run build` first.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import site from '../../src/config/site';
import { LOCALES, localizePath, type Locale } from '../../src/i18n/locales';
import { getUi, fmt } from '../../src/i18n/ui';

const DIST = resolve(process.cwd(), 'dist');
const page = (path: string, lang: Locale = 'en') => readFileSync(join(DIST, localizePath(path, lang), 'index.html'), 'utf8');
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const full = join(dir, f);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
const between = (html: string, a: string, b: string) => {
  const i = html.indexOf(a);
  return i < 0 ? '' : html.slice(i, html.indexOf(b, i));
};
const text = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
const LANGS = LOCALES.map((l) => l.code as Locale);

describe('no placeholder contact details', () => {
  it('no built page or text file contains PLACEHOLDER', () => {
    const files = walk(DIST).filter((f) => /\.(html|txt|xml)$/.test(f));
    const hits = files.filter((f) => readFileSync(f, 'utf8').includes('PLACEHOLDER'));
    expect(hits.map((f) => f.slice(DIST.length))).toEqual([]);
  });
  it('no all-zero WhatsApp number anywhere', () => {
    for (const f of htmlFiles) expect(readFileSync(f, 'utf8'), f).not.toContain('910000000000');
  });
});

describe.each(LANGS)('contacts in %s', (lang) => {
  const ui = getUi(lang);
  const home = page('/', lang);
  const footer = between(home, '<footer', '</footer>');
  const legal = between(footer, 'class="footer-legal"', '</div>');

  it('the footer legal line names the unit, the parent (linked), the place, the email and the phone', () => {
    const [before] = ui.footer.legal.split('{parent}');
    expect(text(legal)).toContain(text(fmt(before, { name: site.name, place: site.contact.address })).trim());
    expect(text(legal)).toContain(site.contact.address);
    expect(legal).toMatch(/<a [^>]*href="https:\/\/goodbizglobal\.com"[^>]*>GoodBiz Global<\/a>/);
    expect(legal).toContain('href="mailto:hygiene@goodbizglobal.com"');
    expect(legal).toContain('href="tel:+918884799369"');
  });

  it('the footer contact column, the WhatsApp button and the contact page use the real details', () => {
    expect(footer).toMatch(/>hygiene@(<wbr>)?goodbizglobal\.com<\/a>/);
    expect(footer).toContain('>+91 88847 99369</a>');
    expect(footer).toContain('Bengaluru, Karnataka, India');
    expect(home).toMatch(/class="wa-fab" href="https:\/\/wa\.me\/918884799369[?"]/);
    const contact = page('/contact/', lang);
    const aside = between(contact, 'class="contact-aside"', '</aside>');
    expect(aside).toContain('href="mailto:hygiene@goodbizglobal.com"');
    expect(aside).toContain('href="tel:+918884799369"');
    expect(aside).toContain('https://wa.me/918884799369');
    expect(aside).toContain('Bengaluru, Karnataka, India');
  });

  it('the enquiry fallback carries the real email, phone and WhatsApp number', () => {
    const contact = page('/contact/', lang);
    expect(contact).toContain('data-whatsapp="918884799369"');
    expect(contact).toContain('data-email="hygiene@goodbizglobal.com"');
    expect(contact).toContain('data-direct-phone>+91 88847 99369</span>');
  });

  it('the About page has a business details block', () => {
    const A = ui.about;
    const block = between(page('/about/', lang), 'id="business-details"', '</section>');
    expect(block, 'section id="business-details"').not.toBe('');
    for (const label of [A.bizBusiness, A.basedIn, ui.contact.email, A.bizPhone, A.bizParentSite, A.bizRegistered]) expect(text(block)).toContain(label);
    expect(text(block)).toContain(fmt(A.bizBusinessValue, { name: site.name, parent: site.parentName }));
    expect(text(block)).toContain('Bengaluru, Karnataka, India');
    expect(block).toContain('href="mailto:hygiene@goodbizglobal.com"');
    expect(block).toContain('href="tel:+918884799369"');
    expect(block).toContain('href="https://goodbizglobal.com"');
    expect(block).toContain('data-regs="full"');
  });
});

describe('llms.txt', () => {
  it('lists the email, phone and address in every language and in llms-full.txt', () => {
    for (const f of ['llms.txt', 'llms-full.txt', ...LANGS.filter((l) => l !== 'en').map((l) => `${l}/llms.txt`)]) {
      const t = readFileSync(join(DIST, f), 'utf8');
      expect(t, f).toContain('hygiene@goodbizglobal.com');
      expect(t, f).toContain('+91 88847 99369');
      expect(t, f).toContain('Bengaluru, Karnataka, India');
    }
  });
});
