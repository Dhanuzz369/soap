import { describe, it, expect } from 'vitest';
import { interleave, shelfRows } from '../../src/lib/shelf';

describe('interleave', () => {
  it('takes one from each range in turn and keeps the order inside a range', () => {
    expect(interleave([['a1', 'a2', 'a3'], ['b1'], ['c1', 'c2']])).toEqual(['a1', 'b1', 'c1', 'a2', 'c2', 'a3']);
  });
  it('skips empty ranges and handles no ranges', () => {
    expect(interleave([[], ['b1', 'b2'], []])).toEqual(['b1', 'b2']);
    expect(interleave([])).toEqual([]);
  });
});

describe('shelfRows', () => {
  const groups = [
    ['s1', 's2', 's3', 's4', 's5', 's6'],
    ['l1', 'l2', 'l3', 'l4'],
    ['k1', 'k2', 'k3'],
    ['h1', 'h2', 'h3', 'h4', 'h5'],
    [],
  ];

  it('uses every item exactly once', () => {
    const [a, b] = shelfRows(groups);
    expect([...a, ...b].sort()).toEqual(groups.flat().sort());
  });

  it('balances the rows (row 1 takes the odd card)', () => {
    const [a, b] = shelfRows(groups);
    expect(a.length).toBe(9);
    expect(b.length).toBe(9);
    const [c, d] = shelfRows([['x', 'y', 'z']]);
    expect([c.length, d.length]).toEqual([2, 1]);
  });

  it('mixes the ranges in both rows', () => {
    const [a, b] = shelfRows(groups);
    const ranges = (row: string[]) => new Set(row.map((s) => s[0]));
    expect(ranges(a).size).toBeGreaterThanOrEqual(3);
    expect(ranges(b).size).toBeGreaterThanOrEqual(3);
    // no two neighbours from the same range at the start of row 1
    expect(a.slice(0, 4).map((s) => s[0])).toEqual(['s', 'l', 'k', 'h']);
  });

  it('handles an empty shelf', () => {
    expect(shelfRows([])).toEqual([[], []]);
  });
});
