import { describe, it, expect } from 'vitest';
import { REGION_CODES, countryNames, suggestCountries } from '../../src/lib/countries';

describe('countries', () => {
  it('lists the ISO 3166-1 codes without the uninhabited territories', () => {
    expect(REGION_CODES).toHaveLength(244);
    for (const c of ['AQ', 'BV', 'HM', 'TF', 'UM']) expect(REGION_CODES).not.toContain(c);
    for (const c of ['AE', 'KE', 'DE', 'IN', 'CI']) expect(REGION_CODES).toContain(c);
  });
  it('names countries in the page language with the English name alongside', () => {
    const de = countryNames('es').find((c) => c.code === 'DE');
    expect(de).toEqual({ code: 'DE', name: 'Alemania', en: 'Germany' });
  });
  it('suggests by local name', () => {
    expect(suggestCountries('alem', 'es')).toContainEqual({ code: 'DE', name: 'Alemania', en: 'Germany' });
  });
  it('ignores accents and case', () => {
    expect(suggestCountries('cote', 'fr').map((c) => c.code)).toContain('CI');
    expect(suggestCountries('KENYA', 'en')[0].code).toBe('KE');
  });
  it('also matches the English name on a non-English page', () => {
    expect(suggestCountries('germany', 'ar').map((c) => c.code)).toContain('DE');
  });
  it('ranks prefix matches before substring matches and respects the limit', () => {
    const r = suggestCountries('ind', 'en', 3);
    expect(r).toHaveLength(3);
    expect(r[0].en.toLowerCase().startsWith('ind')).toBe(true);
  });
  it('returns nothing for an empty query', () => {
    expect(suggestCountries('', 'en')).toEqual([]);
    expect(suggestCountries('   ', 'en')).toEqual([]);
  });
});
