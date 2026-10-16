import { describe, it, expect } from 'vitest';
// @ts-ignore plain ESM module shared with scripts/check-placeholders.mjs
import { isPlaceholderWhatsApp, placeholderProblems, shouldFail } from '../../scripts/placeholder-rules.mjs';

const real = { contactIsPlaceholder: false, whatsapp: '919876543210', tokenHits: [] as string[] };

describe('placeholder rules', () => {
  it('spots an all-zero WhatsApp number after the country code', () => {
    expect(isPlaceholderWhatsApp('910000000000')).toBe(true);
    expect(isPlaceholderWhatsApp('10000000')).toBe(true);
    expect(isPlaceholderWhatsApp('919876543210')).toBe(false);
    expect(isPlaceholderWhatsApp('971500000001')).toBe(false);
  });

  it('reports nothing for real details', () => {
    expect(placeholderProblems(real)).toEqual([]);
  });

  it('reports each kind of placeholder', () => {
    expect(placeholderProblems({ ...real, contactIsPlaceholder: true })).toHaveLength(1);
    expect(placeholderProblems({ ...real, whatsapp: '910000000000' })).toHaveLength(1);
    expect(placeholderProblems({ ...real, tokenHits: ['a', 'b'] })).toHaveLength(2);
  });

  it('fails only when launchReady is true and problems remain', () => {
    expect(shouldFail(true, ['x'])).toBe(true);
    expect(shouldFail(false, ['x'])).toBe(false);
    expect(shouldFail(true, [])).toBe(false);
  });
});
