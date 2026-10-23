import { describe, it, expect } from 'vitest';
import { BRAND_MAX, COLOURWAYS, brandMessage, estimateEm, estimateSize, fitSize, labelText, sanitiseBrand } from '../../src/lib/brand-label';
import { enquiryHref, parseEnquiryParams } from '../../src/lib/enquiry';

describe('sanitiseBrand', () => {
  it('trims and folds runs of whitespace', () => {
    expect(sanitiseBrand('   Lumière \n\t Naturals  ')).toBe('Lumière Naturals');
  });
  it('drops control and bidi-override characters', () => {
    expect(sanitiseBrand('Ac\u0000me‮\u0007 Soap⁦')).toBe('Acme Soap');
  });
  it('keeps markup as plain text (it is only ever written with textContent)', () => {
    expect(sanitiseBrand('<b>Bold</b>')).toBe('<b>Bold</b>');
  });
  it(`caps the name at ${BRAND_MAX} characters without splitting a code point`, () => {
    const long = 'A'.repeat(23) + '😀😀';
    const out = sanitiseBrand(long);
    expect(Array.from(out)).toHaveLength(BRAND_MAX);
    expect(out.endsWith('😀')).toBe(true);
  });
  it('trims again after the cap', () => {
    expect(sanitiseBrand('A'.repeat(23) + ' B')).toBe('A'.repeat(23));
  });
  it('returns an empty string for blank input', () => {
    expect(sanitiseBrand(' ‎\n ')).toBe('');
  });
});

describe('labelText', () => {
  it('falls back to the placeholder when nothing usable was typed', () => {
    expect(labelText('   ', 'Your Brand')).toBe('Your Brand');
    expect(labelText(' Ola ', 'Your Brand')).toBe('Ola');
  });
});

describe('fitSize and estimateSize', () => {
  it('scales a measured line to the target width', () => {
    expect(fitSize(200, 20, 100, 40)).toBe(10);
  });
  it('never exceeds the largest size for short names', () => {
    expect(fitSize(30, 24, 92, 24)).toBe(24);
  });
  it('never goes below the smallest size', () => {
    expect(fitSize(5000, 24, 92, 24, 8)).toBe(8);
  });
  it('falls back to the largest size when nothing could be measured', () => {
    expect(fitSize(0, 24, 92, 24)).toBe(24);
    expect(fitSize(Number.NaN, 24, 92, 24)).toBe(24);
  });
  it('estimates wider text as wider and sizes it smaller', () => {
    expect(estimateEm('MMMM')).toBeGreaterThan(estimateEm('iiii'));
    expect(estimateSize('Your Brand', 92, 24)).toBeLessThanOrEqual(24);
    expect(estimateSize('A much longer brand name', 92, 24)).toBeLessThan(estimateSize('Ola', 92, 24));
  });
});

describe('brandMessage and the enquiry link', () => {
  const withBrand = 'Private-label enquiry: our brand “{brand}”.';
  const without = 'Private-label enquiry: our own brand.';
  it('puts the cleaned brand in the message, or uses the brand-less wording', () => {
    expect(brandMessage('  Acme  ', withBrand, without)).toBe('Private-label enquiry: our brand “Acme”.');
    expect(brandMessage('', withBrand, without)).toBe(without);
  });
  it('does not treat $ patterns in a brand as replacement tokens', () => {
    expect(brandMessage("$& $' Co", withBrand, without)).toBe("Private-label enquiry: our brand “$& $' Co”.");
  });
  it('round-trips through the contact page’s ?message= reader', () => {
    const msg = brandMessage('Ünïcode & Söhne #1', withBrand, without);
    const href = enquiryHref('/de/contact/', { message: msg });
    expect(href.startsWith('/de/contact/?message=')).toBe(true);
    expect(parseEnquiryParams(href.slice(href.indexOf('?'))).message).toBe(msg);
  });
  it('leaves the link bare when there is nothing to prefill', () => {
    expect(enquiryHref('/contact/', { message: '  ' })).toBe('/contact/');
    expect(enquiryHref('/contact/', { products: ['sles', 'labsa'] })).toBe('/contact/?product=sles%2Clabsa');
  });
});

describe('COLOURWAYS', () => {
  it('offers sage, ocean and blush with distinct hex colours', () => {
    expect(COLOURWAYS.map((c) => c.id)).toEqual(['sage', 'ocean', 'blush']);
    for (const c of COLOURWAYS) for (const v of [c.label, c.ink, c.accent]) expect(v).toMatch(/^#[0-9a-f]{6}$/);
    expect(new Set(COLOURWAYS.map((c) => c.label)).size).toBe(3);
  });
});
