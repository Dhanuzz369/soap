/**
 * Scroll-linked motion, as pure numbers (glossy & motion audit, 2026-10-16).
 *
 * The CSS keyframes in home.css / floria.css (run by `animation-timeline: scroll()` / `view()`)
 * and the tiny rAF fallback in src/scripts/scroll-fallback.ts use the same values, so browsers
 * without scroll timelines see the same move. The live hero (hero-scene.ts) reads `fan`.
 */

export const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : Number.isFinite(n) ? n : 0);

/** 0 at `start`, 1 at `end` (pixels of scroll), clamped. A zero-length range is a step at `start`. */
export function scrollProgress(y: number, start: number, end: number): number {
  if (end <= start) return y >= start ? 1 : 0;
  return clamp01((y - start) / (end - start));
}

/**
 * Progress of an element through the viewport, like `view()` with `animation-range: cover`:
 * 0 when its top meets the bottom of the viewport, 1 when its bottom leaves the top.
 */
export function viewProgress(top: number, height: number, viewport: number): number {
  return scrollProgress(viewport - top, 0, viewport + height);
}

/** The home hero cut-out over the first 100vh of scroll: rises 12vh, turns +6deg, scales to 0.94. */
export const HERO_DRIFT = { rise: 12, turn: 6, scale: 0.94 } as const;
/** Inner-page band renders: a lighter drift. */
export const BAND_DRIFT = { rise: 6, turn: 2, scale: 0.97 } as const;

export type Drift = { readonly rise: number; readonly turn: number; readonly scale: number };

/** The transform at progress p (0..1) for a viewport `vh` pixels tall. */
export function driftTransform(p: number, vh: number, d: Drift = HERO_DRIFT): string {
  const k = clamp01(p);
  const y = -((d.rise * vh) / 100) * k;
  const r = d.turn * k;
  const s = 1 + (d.scale - 1) * k;
  return `translate3d(0, ${round(y)}px, 0) rotate(${round(r)}deg) scale(${round(s, 4)})`;
}

/** Parallax: from +amount px to -amount px across p = 0..1 (amount may be negative). */
export function parallaxTransform(p: number, amount: number): string {
  const y = amount * (1 - 2 * clamp01(p));
  return `translate3d(0, ${round(y)}px, 0)`;
}

/**
 * The live 3D range fans out as the hero scrolls away: each pack moves away from the group's
 * centre (`spread` of its offset) and turns (`turn` radians, alternating direction).
 */
export function fanPose(fan: number, offsetX: number, index: number, spread = 0.22, turn = 0.38): { dx: number; yaw: number } {
  const k = clamp01(fan);
  return { dx: offsetX * spread * k, yaw: (index % 2 === 0 ? 1 : -1) * turn * k };
}

/**
 * A frame-rate independent ease towards a target (a critically damped feel without overshoot):
 * after `dt` seconds the gap shrinks by e^(-rate·dt).
 */
export function approach(current: number, target: number, rate: number, dt: number): number {
  if (!(dt > 0)) return current;
  return target + (current - target) * Math.exp(-rate * dt);
}

function round(n: number, places = 2): number {
  const f = 10 ** places;
  const r = Math.round(n * f) / f;
  return Object.is(r, -0) ? 0 : r;
}
