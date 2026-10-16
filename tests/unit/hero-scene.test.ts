import { describe, it, expect } from 'vitest';
import { shouldRun3D } from '../../src/scripts/hero-scene';

const ok = { reducedMotion: false, webgl: true, saveData: false };

describe('shouldRun3D', () => {
  it('runs when motion is allowed, WebGL exists and data saver is off', () => {
    expect(shouldRun3D(ok)).toBe(true);
  });
  it('keeps the static fallback under prefers-reduced-motion', () => {
    expect(shouldRun3D({ ...ok, reducedMotion: true })).toBe(false);
  });
  it('keeps the static fallback without WebGL', () => {
    expect(shouldRun3D({ ...ok, webgl: false })).toBe(false);
  });
  it('keeps the static fallback when data saver is on', () => {
    expect(shouldRun3D({ ...ok, saveData: true })).toBe(false);
  });
});
