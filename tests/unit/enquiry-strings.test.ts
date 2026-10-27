import { describe, it, expect } from 'vitest';
import { LOCALE_CODES } from '../../src/i18n/locales';
import { DICTS, en, getUi, missingKeys } from '../../src/i18n/ui';
import { claimPatterns } from '../../src/i18n/honesty';
import { STEP_IDS, QUANTITY_KEYS, TERMS_KEYS, BRAND_KEYS } from '../../src/lib/enquiry-steps';

const strings = (v: unknown): string[] =>
  typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : [];

describe('ui.steps (step-by-step enquiry form)', () => {
  it('every language translates every key', () => {
    for (const code of LOCALE_CODES) {
      if (code === 'en') continue;
      expect(missingKeys(en.steps, (DICTS[code] as { steps?: unknown }).steps), code).toEqual([]);
    }
  });
  for (const code of LOCALE_CODES) {
    describe(code, () => {
      const s = getUi(code).steps;
      it('has a title and helper per step', () => {
        for (const id of STEP_IDS) {
          expect(s.titles[id], id).toBeTruthy();
          expect(s.helpers[id], id).toBeTruthy();
        }
      });
      it('keeps the option lists in the order of the values sent', () => {
        expect(s.quantities).toHaveLength(QUANTITY_KEYS.length);
        expect(s.terms.map((t) => t.key)).toEqual([...TERMS_KEYS]);
        expect(s.terms[0].key).toBe('not-sure');
        expect(s.brandOptions).toHaveLength(BRAND_KEYS.length);
      });
      it('keeps the Incoterm abbreviations in Latin script', () => {
        for (const t of s.terms.slice(1)) expect(t.title).toContain(t.key);
      });
      it('keeps its placeholders', () => {
        expect(s.stepOf).toContain('{n}');
        expect(s.stepOf).toContain('{m}');
        expect(s.successH).toContain('{name}');
        expect(s.remove).toContain('{name}');
      });
      it('makes no manufacturing claim', () => {
        for (const str of strings(s)) for (const re of claimPatterns(code)) expect(re.test(str), `${str} ~ ${re}`).toBe(false);
      });
      it('promises no minimum, price, certificate or delivery time', () => {
        const all = strings(getUi('en').steps).join(' ');
        expect(all).not.toMatch(/\bminimum order\b|\bMOQ\b|\bcertified\b|\bwithin \d|\b\d+ (days|hours)\b|\$|USD/i);
      });
    });
  }
  it('says the privacy line exactly as the spec wrote it', () => {
    expect(en.steps.privacy).toBe('We use these details only to reply to your enquiry. Nothing is shared or added to a mailing list.');
    expect(en.steps.contactHint).toBe('Email or WhatsApp is enough.');
  });
});
