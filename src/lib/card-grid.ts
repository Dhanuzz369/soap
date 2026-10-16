/**
 * Column count for a staggered card grid, so the last row is never one lonely card:
 * 3 columns by default, 4 when that fills the rows better, and a "mix in one container"
 * note tile to fill a single remaining gap.
 */
export function cardGrid(n: number): { cols: 2 | 3 | 4; note: boolean } {
  if (n <= 2) return { cols: 2, note: false };
  if (n % 3 === 0) return { cols: 3, note: false };
  if (n % 4 === 0) return { cols: 4, note: false };
  if (n % 3 === 2) return { cols: 3, note: true };
  return { cols: 4, note: n % 4 === 3 };
}
