import { describe, it, expect } from 'vitest';
import {
  advance,
  bringToFront,
  canAutoplay,
  dragOffset,
  FAN_POSES,
  FAN_RANGES,
  fanScroll,
  initialOrder,
  retreat,
  slotsOf,
  spreadTurn,
  swipeAxis,
  swipeDecision,
} from '../../src/lib/hero-fan';
import fs from 'node:fs';
import path from 'node:path';

describe('fan ranges', () => {
  it('has one photo (with its 800px copy and glow) per main range', () => {
    expect(FAN_RANGES.map((r) => r.slug)).toEqual(['bath-personal-soaps', 'laundry-care', 'kitchen-care', 'surface-home-cleaners']);
    for (const r of FAN_RANGES) {
      for (const f of [`products/${r.photo}.webp`, `products/${r.photo}-800.webp`, `hero/glow-${r.photo}.webp`]) {
        expect(fs.existsSync(path.join('public/images', f)), f).toBe(true);
      }
    }
  });
  it('has a pose per card, the front one upright and largest', () => {
    expect(FAN_POSES).toHaveLength(FAN_RANGES.length);
    expect(FAN_POSES[0]).toEqual({ x: 0, y: 0, r: 0, s: 1 });
    for (let i = 1; i < FAN_POSES.length; i++) expect(FAN_POSES[i].s).toBeLessThan(FAN_POSES[i - 1].s);
  });
});

describe('shuffle order', () => {
  it('advance sends the front card to the back', () => {
    expect(advance([0, 1, 2, 3])).toEqual([1, 2, 3, 0]);
    expect(advance(advance(advance(advance([0, 1, 2, 3]))))).toEqual([0, 1, 2, 3]);
  });
  it('retreat undoes advance', () => {
    expect(retreat(advance([2, 0, 3, 1]))).toEqual([2, 0, 3, 1]);
    expect(retreat([0, 1, 2, 3])).toEqual([3, 0, 1, 2]);
  });
  it('bringToFront keeps the others in order behind the chosen card', () => {
    expect(bringToFront([0, 1, 2, 3], 2)).toEqual([2, 0, 1, 3]);
    expect(bringToFront([0, 1, 2, 3], 0)).toEqual([0, 1, 2, 3]);
    expect(bringToFront([0, 1, 2, 3], 9)).toEqual([0, 1, 2, 3]);
  });
  it('slotsOf inverts an order', () => {
    expect(slotsOf([2, 0, 1, 3])).toEqual([1, 2, 0, 3]);
    expect(slotsOf(initialOrder(4))).toEqual([0, 1, 2, 3]);
  });
  it('handles tiny hands', () => {
    expect(advance([])).toEqual([]);
    expect(advance([5])).toEqual([5]);
    expect(retreat([5])).toEqual([5]);
  });
});

describe('swipe', () => {
  it('waits for intent, then picks the dominant axis', () => {
    expect(swipeAxis(3, 4)).toBeNull();
    expect(swipeAxis(12, 4)).toBe('x');
    expect(swipeAxis(5, -14)).toBe('y');
  });
  it('a quick flick counts at any distance (velocity > 0.11 px/ms)', () => {
    expect(swipeDecision(-30, 120)).toBe('next'); // 0.25 px/ms
    expect(swipeDecision(30, 120)).toBe('prev');
  });
  it('a slow short drag does nothing; a long one counts', () => {
    expect(swipeDecision(-40, 800)).toBeNull(); // 0.05 px/ms, under 64px
    expect(swipeDecision(-90, 2000)).toBe('next');
  });
  it('a tap is not a swipe', () => {
    expect(swipeDecision(4, 10)).toBeNull();
    expect(swipeDecision(Number.NaN, 10)).toBeNull();
  });
  it('mirrors in right-to-left layouts', () => {
    expect(swipeDecision(-90, 200, true)).toBe('prev');
    expect(swipeDecision(90, 200, true)).toBe('next');
  });
  it('drags with friction past the limit', () => {
    expect(dragOffset(50)).toBe(50);
    expect(dragOffset(196)).toBe(121);
    expect(dragOffset(-196)).toBe(-121);
  });
});

describe('scroll mapping', () => {
  it('rises 8vh, spreads and fades the glow across the first 100vh', () => {
    expect(fanScroll(0, 900)).toEqual({ y: 0, spread: 0, glow: 1 });
    expect(fanScroll(0.5, 900)).toEqual({ y: -36, spread: 0.175, glow: 0.5 });
    expect(fanScroll(2, 900)).toEqual({ y: -72, spread: 0.35, glow: 0 });
  });
  it('turns back cards further out, mirrored in RTL; the front card stays upright', () => {
    expect(spreadTurn(0, 1)).toBe(0);
    expect(spreadTurn(3, 1)).toBe(-3.5);
    expect(spreadTurn(3, 1, -1)).toBe(3.5);
    expect(spreadTurn(2, 0)).toBe(0);
  });
});

describe('auto-shuffle', () => {
  const idle = { reducedMotion: false, phone: false, hidden: false, offscreen: false, hovered: false, focused: false };
  it('runs only when nothing holds it', () => {
    expect(canAutoplay(idle)).toBe(true);
    for (const k of Object.keys(idle) as (keyof typeof idle)[]) {
      expect(canAutoplay({ ...idle, [k]: true }), k).toBe(false);
    }
  });
});
