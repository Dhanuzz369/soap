import { describe, it, expect } from 'vitest';
import { markDecorative } from '../../src/lib/decorative-images';

describe('markDecorative', () => {
  it('adds role="presentation" to images with an empty alt, in either spelling', () => {
    expect(markDecorative('<img src="/a.webp" alt="">')).toBe('<img src="/a.webp" alt="" role="presentation">');
    expect(markDecorative('<img src="/a.webp" alt decoding="async">')).toBe('<img src="/a.webp" alt decoding="async" role="presentation">');
    expect(markDecorative('<img src="/a.webp" alt/>')).toBe('<img src="/a.webp" alt role="presentation"/>');
  });
  it('leaves described images and images that already have a role alone', () => {
    const described = '<img src="/b.webp" alt="Detergent powder, exported from India">';
    expect(markDecorative(described)).toBe(described);
    const roled = '<img src="/c.webp" alt="" role="none">';
    expect(markDecorative(roled)).toBe(roled);
    const noAlt = '<img src="/d.webp">';
    expect(markDecorative(noAlt)).toBe(noAlt);
  });
  it('does not touch attributes that merely start with "alt"', () => {
    const t = '<img src="/e.webp" alt="x" data-alt="">';
    expect(markDecorative(t)).toBe(t);
  });
});
