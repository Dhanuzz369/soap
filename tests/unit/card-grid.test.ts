import { describe, it, expect } from 'vitest';
import { cardGrid } from '../../src/lib/card-grid';

const holes = (n: number) => {
  const g = cardGrid(n);
  return (g.cols - ((n + (g.note ? 1 : 0)) % g.cols)) % g.cols;
};

describe('cardGrid', () => {
  it('fills every row for the sizes a range or page uses (3 to 9, 12)', () => {
    for (const n of [3, 4, 5, 6, 7, 8, 9, 12]) expect(holes(n), `n=${n}`).toBe(0);
  });
  it('uses two columns for one or two cards', () => {
    expect(cardGrid(2)).toEqual({ cols: 2, note: false });
  });
  it('prefers three columns, then four, then a note tile', () => {
    expect(cardGrid(6)).toEqual({ cols: 3, note: false });
    expect(cardGrid(4)).toEqual({ cols: 4, note: false });
    expect(cardGrid(5)).toEqual({ cols: 3, note: true });
    expect(cardGrid(7)).toEqual({ cols: 4, note: true });
  });
});
