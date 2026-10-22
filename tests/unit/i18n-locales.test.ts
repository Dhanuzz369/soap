import { describe, it, expect } from 'vitest';
import { LOCALES, LOCALE_CODES, PREFIXED_LOCALES, localizePath, splitLocale, alternates, langFromUrl } from '../../src/i18n/locales';
import { localeOfContentFile, localizeLinks } from '../../src/i18n/markdown-localize-links';

describe('locales', () => {
  it('has the 12 agreed languages, English first and unprefixed', () => {
    expect(LOCALE_CODES).toEqual(['en', 'ar', 'fr', 'es', 'pt', 'ru', 'zh', 'de', 'tr', 'id', 'sw', 'vi']);
    expect(PREFIXED_LOCALES).not.toContain('en');
    expect(LOCALES.find((l) => l.code === 'zh')!.hreflang).toBe('zh-Hans');
    expect(LOCALES.filter((l) => l.dir === 'rtl').map((l) => l.code)).toEqual(['ar']);
    expect(new Set(LOCALES.map((l) => l.native)).size).toBe(12);
  });
});

describe('localizePath', () => {
  it('prefixes site paths for non-default locales and keeps query and hash', () => {
    expect(localizePath('/products/labsa/', 'fr')).toBe('/fr/products/labsa/');
    expect(localizePath('/', 'ar')).toBe('/ar/');
    expect(localizePath('/contact/?product=sles#enquiry', 'de')).toBe('/de/contact/?product=sles#enquiry');
    expect(localizePath('/products/labsa/', 'en')).toBe('/products/labsa/');
  });
  it('never double-prefixes and can switch a localized path', () => {
    expect(localizePath('/fr/products/labsa/', 'fr')).toBe('/fr/products/labsa/');
    expect(localizePath('/fr/products/labsa/', 'es')).toBe('/es/products/labsa/');
    expect(localizePath('/fr/products/labsa/', 'en')).toBe('/products/labsa/');
  });
  it('leaves external links, anchors, mail and static files alone', () => {
    for (const href of ['https://wa.me/1', '//cdn.example.com/x', '#faq', 'mailto:a@b.c', 'tel:+1', '/images/products/x.webp', '/fonts/a.woff2', '/llms.txt', '/og-default.png'])
      expect(localizePath(href, 'fr'), href).toBe(href);
  });
});

describe('splitLocale / langFromUrl', () => {
  it('reads the locale from a path', () => {
    expect(splitLocale('/fr/products/x/')).toEqual({ lang: 'fr', path: '/products/x/' });
    expect(splitLocale('/zh/')).toEqual({ lang: 'zh', path: '/' });
    expect(splitLocale('/zh')).toEqual({ lang: 'zh', path: '/' });
    expect(splitLocale('/products/x/')).toEqual({ lang: 'en', path: '/products/x/' });
    expect(splitLocale('/en/x/')).toEqual({ lang: 'en', path: '/en/x/' });
    expect(langFromUrl(new URL('https://x.test/ar/faq/'))).toBe('ar');
  });
});

describe('alternates', () => {
  it('lists every locale once plus x-default pointing at English', () => {
    const a = alternates('/faq/');
    expect(a).toHaveLength(13);
    expect(a.find((x) => x.hreflang === 'x-default')!.path).toBe('/faq/');
    expect(a.find((x) => x.hreflang === 'zh-Hans')!.path).toBe('/zh/faq/');
    expect(new Set(a.map((x) => x.hreflang)).size).toBe(13);
  });
});

describe('markdown link localization', () => {
  it('detects the language of a translation file only', () => {
    expect(localeOfContentFile('/repo/src/content/i18n/fr/products/labsa.md')).toBe('fr');
    expect(localeOfContentFile('C:\\repo\\src\\content\\i18n\\ar\\blog\\x.md')).toBe('ar');
    expect(localeOfContentFile('/repo/src/content/products/labsa.md')).toBeUndefined();
    expect(localeOfContentFile('/repo/src/content/i18n/xx/products/labsa.md')).toBeUndefined();
  });
  it('rewrites internal links and definitions, not external ones', () => {
    const tree = {
      type: 'root',
      children: [
        { type: 'paragraph', children: [{ type: 'link', url: '/products/labsa/' }, { type: 'link', url: 'https://example.com/' }, { type: 'link', url: '/blog/x/#faq' }] },
        { type: 'definition', url: '/categories/kitchen-care/' },
        { type: 'link', url: '/fr/contact/' },
      ],
    };
    localizeLinks(tree, 'fr');
    const urls = JSON.stringify(tree).match(/"url":"[^"]+"/g);
    expect(urls).toEqual([
      '"url":"/fr/products/labsa/"',
      '"url":"https://example.com/"',
      '"url":"/fr/blog/x/#faq"',
      '"url":"/fr/categories/kitchen-care/"',
      '"url":"/fr/contact/"',
    ]);
  });
});
