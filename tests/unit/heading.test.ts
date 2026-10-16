import { describe, it, expect } from 'vitest';
import { splitName, splitPostTitle } from '../../src/lib/heading';

describe('splitName', () => {
  it('moves a trailing parenthetical into the descriptor', () => {
    expect(splitName('LABSA (Linear Alkyl Benzene Sulphonic Acid)')).toEqual({
      l1: 'LABSA',
      sub: '(Linear Alkyl Benzene Sulphonic Acid)',
      scale: 's',
    });
  });
  it('keeps short names whole at the large scale', () => {
    expect(splitName('Floor Cleaner')).toEqual({ l1: 'Floor Cleaner', sub: undefined, scale: 's' });
  });
  it('steps the scale down for long names', () => {
    expect(splitName('Dish Wash Liquid / Gel').scale).toBe('m');
    expect(splitName('Fabric Whitener / Stain Remover').scale).toBe('l');
  });
  it('rejoins to the original text', () => {
    for (const t of ['Hotel & Guest Soap (Mini Bars)', 'Kitchen Degreaser', 'SLES (Sodium Lauryl Ether Sulphate)']) {
      const p = splitName(t);
      expect([p.l1, p.sub].filter(Boolean).join(' ')).toBe(t);
    }
  });
});

describe('splitPostTitle', () => {
  it('splits at the first colon, keeping it on the first line', () => {
    expect(splitPostTitle('HSN Code 3401 vs 3402: A Buyer’s Guide')).toEqual({ l1: 'HSN Code 3401 vs 3402:', l2: 'A Buyer’s Guide' });
  });
  it('leaves titles without a colon whole', () => {
    expect(splitPostTitle('Detergent Powder vs Liquid Detergent')).toEqual({ l1: 'Detergent Powder vs Liquid Detergent' });
  });
});
