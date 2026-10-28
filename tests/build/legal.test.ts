/**
 * The Privacy Policy and Cookie Policy pages (spec 2026-10-28 §3) on the built site. Run
 * `npm run build` first. The English text is final copy: every sentence of the spec's English
 * text must appear on the English page, word for word.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { LOCALES, localizePath, alternates, type Locale } from '../../src/i18n/locales';
import { getUi } from '../../src/i18n/ui';

const ROOT = process.cwd();
const DIST = resolve(ROOT, 'dist');
const LANGS = LOCALES.map((l) => l.code as Locale);
/** Languages with a translation of the legal pages (npm run i18n:check -- --strict requires all 11). */
const translated = (l: Locale, slug: string) => l !== 'en' && existsSync(join(ROOT, 'src/content/i18n', l, 'legal', `${slug}.md`));
const file = (path: string, lang: Locale) => join(DIST, localizePath(path, lang), 'index.html');
const page = (path: string, lang: Locale = 'en') => readFileSync(file(path, lang), 'utf8');
const decode = (s: string) =>
  s
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;|&#160;/g, ' ');
const norm = (s: string) => decode(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
const mainText = (html: string) => norm(html.slice(html.indexOf('<main'), html.indexOf('</main>')).replace(/<[^>]+>/g, ' ')).replace(/ ([.,;:)])/g, '$1').replace(/\( /g, '(');

/** The spec's English final copy, as plain sentences. */
function specSentences(heading: string): string[] {
  const spec = readFileSync(join(ROOT, 'docs/superpowers/specs/2026-10-28-privacy-contacts-design.md'), 'utf8');
  const start = spec.indexOf(heading);
  const next = spec.indexOf('\n### ', start + heading.length);
  const nextH2 = spec.indexOf('\n## ', start + heading.length);
  const end = Math.min(...[next, nextH2].filter((i) => i > 0));
  return spec
    .slice(start + heading.length, end)
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('(The table from'))
    .map((l) => l.replace(/^\s*-\s+/, '').replace(/\*\*?/g, '').replace(/ \(link \/cookies\/\)/, ''))
    .flatMap((l) => l.split(/(?<=[.;:])\s+(?=[A-Z"(])/))
    .map((s) => norm(s))
    .filter(Boolean);
}

describe.each([
  ['/privacy/', 'Privacy Policy', '### Privacy Policy (English)'],
  ['/cookies/', 'Cookie Policy', '### Cookie Policy (English)'],
] as const)('%s', (path, title, heading) => {
  it('exists in all 12 languages', () => {
    for (const l of LANGS) expect(existsSync(file(path, l)), `${l}${path}`).toBe(true);
  });

  it(`has the short title "${title} | GoodBiz Hygiene" in English`, () => {
    expect(page(path)).toContain(`<title>${title} | GoodBiz Hygiene</title>`);
  });

  it('is indexable once launched: a canonical link and hreflang to every language, no noindex of its own', () => {
    for (const l of LANGS) {
      const html = page(path, l);
      expect(html, l).toContain(`<link rel="canonical" href="https://www.goodbizhygiene.com${localizePath(path, l)}"`);
      for (const a of alternates(path)) expect(html, `${l} ${a.hreflang}`).toContain(`hreflang="${a.hreflang}" href="https://www.goodbizhygiene.com${a.path}"`);
      // The only robots tag is the site-wide pre-launch one (src/lib/launch.ts).
      expect(html.match(/<meta name="robots"/g)?.length ?? 0, l).toBeLessThanOrEqual(1);
    }
  });

  it('has one h1, breadcrumbs and no PageHero band', () => {
    for (const l of LANGS) {
      const html = page(path, l);
      expect(html.match(/<h1\b/g)?.length, l).toBe(1);
      expect(html, l).toContain('class="crumbs"');
      expect(html, l).toContain('"@type":"BreadcrumbList"');
      expect(html, l).not.toContain('class="ph ');
      expect(html, l).not.toContain('page-dark');
    }
  });

  it('shows the last-updated date', () => {
    expect(mainText(page(path))).toContain('Last updated: 28 October 2026');
    expect(page(path)).toContain('<time datetime="2026-10-28">');
  });

  it('keeps every sentence of the English final copy', () => {
    const text = mainText(page(path));
    const sentences = specSentences(heading);
    expect(sentences.length).toBeGreaterThan(path === '/privacy/' ? 60 : 12);
    const missing = sentences.filter((s) => !text.includes(s));
    expect(missing).toEqual([]);
  });

  it('every translation carries the English-prevails line; English does not', () => {
    for (const l of LANGS) {
      const note = norm(getUi(l).legal.translationNote);
      if (!translated(l, path.slice(1, -1))) expect(mainText(page(path, l)), l).not.toContain(norm(getUi('en').legal.translationNote));
      else {
        expect(mainText(page(path, l)), l).toContain(note);
        expect(page(path, l), l).toContain(`href="${path}"`); // a link to the English version
      }
    }
  });
});

describe('privacy page facts in every language', () => {
  it.each(LANGS.filter((l) => l === 'en' || translated(l, 'privacy')))('%s keeps the contacts, the Act, the GDPR articles and the cookie link', (l) => {
    const html = page('/privacy/', l);
    const text = mainText(html);
    for (const s of ['hygiene@goodbizglobal.com', '+91 88847 99369', 'Digital Personal Data Protection Act, 2023', '7(a)', '6(1)(b)', '6(1)(f)', '6(1)(c)', '24', '30', '90', '18']) expect(text, `${l}: ${s}`).toContain(s);
    expect(html, l).toContain(`href="${localizePath('/cookies/', l)}"`);
  });
});

describe('cookie page', () => {
  it.each(LANGS)('%s lists every browser storage key in a three-column table', (l) => {
    const html = page('/cookies/', l);
    const table = html.slice(html.indexOf('<table'), html.indexOf('</table>'));
    expect(table.match(/<th\b/g)?.length, l).toBe(3);
    for (const key of ['gb-lang', 'gb-horeca', 'goodbiz-enquiry-lead', 'goodbiz-enquiry-contact', 'goodbiz-enquiry-products']) expect(table, `${l}: ${key}`).toContain(`<code>${key}</code>`);
    expect(table.match(/<tr\b/g)?.length, l).toBe(6);
  });
  it('English column headings: What it remembers, Why, How long', () => {
    const html = page('/cookies/');
    const head = html.slice(html.indexOf('<thead'), html.indexOf('</thead>'));
    expect(head.replace(/<[^>]+>/g, '|').split('|').map((s) => s.trim()).filter(Boolean)).toEqual(['What it remembers', 'Why', 'How long']);
  });
});

describe('footer links', () => {
  it.each(LANGS)('every page in %s links to its Privacy and Cookies pages', (l) => {
    const ui = getUi(l);
    for (const path of ['/', '/contact/', '/privacy/', '/products/labsa/']) {
      const html = page(path, l);
      const footer = html.slice(html.indexOf('<footer'), html.indexOf('</footer>'));
      expect(footer, `${l}${path}`).toContain(`<a href="${localizePath('/privacy/', l)}">${ui.footer.privacy}</a>`);
      expect(footer, `${l}${path}`).toContain(`<a href="${localizePath('/cookies/', l)}">${ui.footer.cookies}</a>`);
    }
  });
  it('English labels are "Privacy" and "Cookies"', () => {
    expect(getUi('en').footer.privacy).toBe('Privacy');
    expect(getUi('en').footer.cookies).toBe('Cookies');
  });
});

describe('enquiry form notice (step 1)', () => {
  it('English: the spec wording, with "Privacy Policy" linking to /privacy/', () => {
    const html = page('/contact/');
    const notice = html.slice(html.indexOf('class="sq-privacy"'), html.indexOf('</p>', html.indexOf('class="sq-privacy"')));
    expect(norm(notice.slice(notice.indexOf('>') + 1).replace(/<[^>]+>/g, ' '))).toBe(norm('We save these details when you tap Next, only to reply to your enquiry. We never sell them or add them to a mailing list. Privacy Policy'));
    expect(notice).toContain('<a href="/privacy/">Privacy Policy</a>');
    expect(html).not.toContain('Nothing is shared');
  });
  it.each(LANGS)('%s: the translated notice links to its own Privacy Policy, inside step 1', (l) => {
    const ui = getUi(l);
    const html = page('/contact/', l);
    const step1 = html.slice(html.indexOf('data-step="contact"'), html.indexOf('data-step="group"'));
    expect(step1, l).toContain(ui.steps.privacy.replace(/'/g, '&#39;'));
    expect(step1, l).toContain(`<a href="${localizePath('/privacy/', l)}">${ui.steps.privacyLink}</a>`);
  });
  it('every language has its own notice (no English fallback)', () => {
    const en = getUi('en').steps;
    expect(en.privacy).toBe('We save these details when you tap Next, only to reply to your enquiry. We never sell them or add them to a mailing list.');
    for (const l of LANGS.filter((x) => x !== 'en')) {
      expect(getUi(l).steps.privacy, l).not.toBe(en.privacy);
      expect(getUi(l).steps.privacyLink, l).not.toBe(en.privacyLink);
      // it names the step-1 button by its label in that language
      expect(getUi(l).steps.privacy, l).toContain(getUi(l).steps.next);
    }
  });
});
