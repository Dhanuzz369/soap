import { describe, it, expect } from 'vitest';
import { pickLocale, isBot } from '../../src/i18n/detect';
import { LOCALE_CODES } from '../../src/i18n/locales';

const pick = (langs: string[]) => pickLocale(langs, LOCALE_CODES, 'en');

describe('pickLocale (visitor language → site locale)', () => {
  it('maps regional variants to the base language', () => {
    expect(pick(['pt-BR'])).toBe('pt');
    expect(pick(['es-419'])).toBe('es');
    expect(pick(['fr-CA', 'en'])).toBe('fr');
    expect(pick(['ar-EG'])).toBe('ar');
    expect(pick(['sw-KE'])).toBe('sw');
    expect(pick(['de-AT'])).toBe('de');
    expect(pick(['tr-TR'])).toBe('tr');
    expect(pick(['vi-VN'])).toBe('vi');
    expect(pick(['ru-RU'])).toBe('ru');
  });
  it('maps every Chinese tag to zh (the Simplified Chinese site)', () => {
    for (const t of ['zh', 'zh-CN', 'zh-Hans', 'zh-Hans-CN', 'zh-TW', 'zh-HK', 'zh_SG']) expect(pick([t]), t).toBe('zh');
  });
  it('maps Indonesian, including the legacy "in" tag', () => {
    expect(pick(['id-ID'])).toBe('id');
    expect(pick(['in'])).toBe('id');
  });
  it('takes the first supported language in preference order', () => {
    expect(pick(['ja-JP', 'ko', 'de-DE', 'fr'])).toBe('de');
    expect(pick(['en-US', 'fr-FR'])).toBe('en');
    expect(pick(['EN-gb'])).toBe('en');
  });
  it('falls back when nothing is supported or the list is empty', () => {
    expect(pick(['ja', 'ko', 'hi-IN'])).toBe('en');
    expect(pick([])).toBe('en');
    expect(pick([''])).toBe('en');
  });
  it('is self-contained, so its source can be inlined into the page', () => {
    const inlined = new Function(`return (${pickLocale.toString()})`)() as typeof pickLocale;
    expect(inlined(['pt-BR'], LOCALE_CODES, 'en')).toBe('pt');
    const bot = new Function(`return (${isBot.toString()})`)() as typeof isBot;
    expect(bot('Googlebot/2.1')).toBe(true);
  });
});

describe('isBot', () => {
  it('recognises crawlers, previewers and audit tools', () => {
    for (const ua of [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 (compatible; bingbot/2.0)',
      'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.0)',
      'facebookexternalhit/1.1',
      'WhatsApp/2.23.20.0',
      'Mozilla/5.0 (Linux; Android 11) Chrome/120.0 Mobile Safari/537.36 Chrome-Lighthouse',
      'Mozilla/5.0 HeadlessChrome/120.0',
      'Mozilla/5.0 (compatible; Google-InspectionTool/1.0)',
    ])
      expect(isBot(ua), ua).toBe(true);
  });
  it('lets ordinary browsers through', () => {
    expect(isBot('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15')).toBe(false);
    expect(isBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36')).toBe(false);
    expect(isBot('')).toBe(false);
  });
});
