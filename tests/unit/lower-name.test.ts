import { describe, it, expect } from 'vitest';
import { lowerName } from '../../src/i18n/page';

describe('lowerName ("{nameLower}" in alt text and copy)', () => {
  it('lower-cases ordinary words', () => {
    expect(lowerName('Toilet / Bath Soap', 'en')).toBe('toilet / bath soap');
    expect(lowerName('Glycerin / Transparent Soap', 'en')).toBe('glycerin / transparent soap');
  });
  it('keeps abbreviations written in capitals', () => {
    expect(lowerName('LABSA (Linear Alkyl Benzene Sulphonic Acid)', 'en')).toBe('LABSA (linear alkyl benzene sulphonic acid)');
    expect(lowerName('SLES (Sodium Lauryl Ether Sulphate)', 'en')).toBe('SLES (sodium lauryl ether sulphate)');
  });
  it('still lower-cases a capitalised first letter and single capitals', () => {
    expect(lowerName('Detergent Powder', 'fr')).toBe('detergent powder');
    expect(lowerName('A Soap', 'en')).toBe('a soap');
  });
  it("uses the locale's casing rules", () => {
    expect(lowerName('Isparta Sabunu', 'tr')).toBe('ısparta sabunu');
  });
});
