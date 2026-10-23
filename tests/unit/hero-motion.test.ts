import { describe, it, expect } from 'vitest';
import {
  BAND_DRIFT,
  clamp01,
  driftTransform,
  FAN_DRIFT,
  HERO_DRIFT,
  parallaxTransform,
  scrollProgress,
  viewProgress,
} from '../../src/lib/hero-motion';

describe('clamp01', () => {
  it('clamps to 0..1 and treats NaN as 0', () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(3)).toBe(1);
    expect(clamp01(Number.NaN)).toBe(0);
  });
});

describe('scrollProgress', () => {
  it('maps the range linearly and clamps outside it', () => {
    expect(scrollProgress(0, 0, 900)).toBe(0);
    expect(scrollProgress(450, 0, 900)).toBe(0.5);
    expect(scrollProgress(900, 0, 900)).toBe(1);
    expect(scrollProgress(2000, 0, 900)).toBe(1);
    expect(scrollProgress(-50, 0, 900)).toBe(0);
  });
  it('treats an empty range as a step', () => {
    expect(scrollProgress(10, 100, 100)).toBe(0);
    expect(scrollProgress(100, 100, 100)).toBe(1);
  });
});

describe('viewProgress', () => {
  it('is 0 as the element enters at the bottom and 1 as it leaves at the top', () => {
    expect(viewProgress(800, 400, 800)).toBe(0);
    expect(viewProgress(-400, 400, 800)).toBe(1);
    expect(viewProgress(200, 400, 800)).toBe(0.5);
  });
});

describe('driftTransform', () => {
  it('is the identity at the top of the page', () => {
    expect(driftTransform(0, 900)).toBe('translate3d(0, 0px, 0) rotate(0deg) scale(1)');
  });
  it('reaches the audit values at 100vh: rise 12vh, turn 6deg, scale 0.94', () => {
    expect(HERO_DRIFT).toEqual({ rise: 12, turn: 6, scale: 0.94 });
    expect(driftTransform(1, 900)).toBe('translate3d(0, -108px, 0) rotate(6deg) scale(0.94)');
  });
  it('clamps progress past the end and supports the lighter band drift', () => {
    expect(driftTransform(4, 1000)).toBe(driftTransform(1, 1000));
    expect(driftTransform(0.5, 1000, BAND_DRIFT)).toBe('translate3d(0, -30px, 0) rotate(1deg) scale(0.985)');
  });
});

describe('parallaxTransform', () => {
  it('runs from +amount to -amount', () => {
    expect(parallaxTransform(0, 40)).toBe('translate3d(0, 40px, 0)');
    expect(parallaxTransform(0.5, 40)).toBe('translate3d(0, 0px, 0)');
    expect(parallaxTransform(1, 40)).toBe('translate3d(0, -40px, 0)');
  });
});

describe('FAN_DRIFT', () => {
  it('rises 8vh over the first 100vh without turning or scaling', () => {
    expect(driftTransform(1, 900, FAN_DRIFT)).toBe('translate3d(0, -72px, 0) rotate(0deg) scale(1)');
    expect(driftTransform(0, 900, FAN_DRIFT)).toBe('translate3d(0, 0px, 0) rotate(0deg) scale(1)');
  });
});
