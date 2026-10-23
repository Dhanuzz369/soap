/**
 * The home hero fan (HeroFan.astro, src/scripts/hero-fan.ts), as pure data and decisions:
 * which photos, the pose of each slot, the shuffle order, the swipe decision, the scroll mapping
 * and when the auto-shuffle may run. Unit-tested in tests/unit/hero-fan.test.ts; the CSS in
 * home.css repeats FAN_POSES and FAN_SCROLL (keep them in step).
 */
import { clamp01 } from './hero-motion.ts';

/**
 * One card per main range. `pos` is the object-position of the 4:3 photo in its 4:5 card, picked
 * by eye so the pack and its GoodBiz label stay in frame (the crop shows 60% of the width).
 */
export const FAN_RANGES = [
  { slug: 'bath-personal-soaps', photo: 'herbal-ayurvedic-soap', pos: '72% 50%' },
  { slug: 'laundry-care', photo: 'liquid-detergent', pos: '50% 50%' },
  { slug: 'kitchen-care', photo: 'dish-wash-liquid', pos: '62% 50%' },
  { slug: 'surface-home-cleaners', photo: 'floor-cleaner', pos: '80% 50%' },
] as const;

/** The fan's srcset: the hero's 480/640px copies (`npm run hero:images`) before the photo's own. */
export function fanSrcset(photo: string, photoSrcset: string): string {
  return `/images/hero/${photo}-480.webp 480w, /images/hero/${photo}-640.webp 640w, ${photoSrcset}`;
}

/**
 * The photos' `sizes`. A 4:3 photo covering a 4:5 card is drawn 5/3 as wide as the card
 * (--card-w in home.css: 50vw on phones, clamp(240px, 23vw, 360px) on wider screens), so this is
 * 5/3 of the card width. Home's preload uses the same string.
 */
export const FAN_SIZES = '(max-width: 759px) 84vw, clamp(400px, 38vw, 600px)';

/**
 * Slot poses, front (0) to back (3): x/y in % of the card, r in degrees (LTR; mirrored in RTL),
 * s the scale. The back cards are smaller, turned and offset to alternate sides. Each back card's
 * bounding box (turned, and with the hover widening) stays smaller than the front card's, so the
 * front photo is always the LCP element (tests/unit/hero-fan.test.ts).
 */
export const FAN_POSES = [
  { x: 0, y: 0, r: 0, s: 1 },
  { x: -17, y: -3, r: -6, s: 0.88 },
  { x: 15, y: -6, r: 5, s: 0.84 },
  { x: -30, y: -9, r: -10, s: 0.8 },
] as const;

/** Area of a card's axis-aligned bounding box, in card-widths² (a 4:5 card turned by `deg`, scaled by `s`). */
export function boxArea(s: number, deg: number): number {
  const a = (Math.abs(deg) * Math.PI) / 180;
  const w = s * (Math.cos(a) + 1.25 * Math.sin(a));
  const h = s * (1.25 * Math.cos(a) + Math.sin(a));
  return w * h;
}

/** A card order, front first: order[0] is the card shown in front. */
export type FanOrder = readonly number[];

export const initialOrder = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

/** The auto-shuffle: the front card goes to the back, the rest move up one. */
export function advance(order: FanOrder): number[] {
  return order.length < 2 ? [...order] : [...order.slice(1), order[0]];
}

/** The reverse: the back card comes to the front. */
export function retreat(order: FanOrder): number[] {
  return order.length < 2 ? [...order] : [order[order.length - 1], ...order.slice(0, -1)];
}

/** A chosen card to the front; the others keep their relative order behind it. */
export function bringToFront(order: FanOrder, card: number): number[] {
  if (!order.includes(card)) return [...order];
  return [card, ...order.filter((c) => c !== card)];
}

/** The slot of each card (index = card): the inverse of an order. */
export function slotsOf(order: FanOrder): number[] {
  const slots: number[] = [];
  order.forEach((card, slot) => (slots[card] = slot));
  return slots;
}

/* ---------- swipe (phones) ---------- */

/** Distance (px) that always counts, and the flick velocity (px/ms) that counts at any distance. */
export const SWIPE = { distance: 64, velocity: 0.11, intent: 8, tap: 10 } as const;

/** Which way a drag is heading once it has moved `intent` px: 'x' takes the gesture, 'y' leaves it to the page. */
export function swipeAxis(dx: number, dy: number): 'x' | 'y' | null {
  if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE.intent) return null;
  return Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
}

/**
 * The result of a horizontal swipe of `dx` px over `ms` milliseconds. A swipe toward the inline
 * start (left in LTR, right in RTL) deals the next card, like the auto-shuffle; the other way
 * brings the previous one back. A short, slow drag is nothing.
 */
export function swipeDecision(dx: number, ms: number, rtl = false): 'next' | 'prev' | null {
  const dist = Math.abs(dx);
  if (!Number.isFinite(dx) || dist < SWIPE.tap) return null;
  const velocity = dist / Math.max(ms, 1);
  if (dist < SWIPE.distance && velocity <= SWIPE.velocity) return null;
  const towardStart = rtl ? dx > 0 : dx < 0;
  return towardStart ? 'next' : 'prev';
}

/** The front card follows the finger, with growing friction past `limit` px (no hard stop). */
export function dragOffset(dx: number, limit = 96): number {
  const a = Math.abs(dx);
  if (a <= limit) return dx;
  return Math.sign(dx) * (limit + (a - limit) * 0.25);
}

/* ---------- scroll ---------- */

/** Over the first 100vh: the fan drifts up 8vh, the back cards turn 35% further out, the glow fades. */
export const FAN_SCROLL = { rise: 8, spread: 0.35 } as const;

export function fanScroll(p: number, vh: number): { y: number; spread: number; glow: number } {
  const k = clamp01(p);
  const y = Math.round(-((FAN_SCROLL.rise * vh) / 100) * k * 100) / 100;
  return { y: y === 0 ? 0 : y, spread: FAN_SCROLL.spread * k, glow: 1 - k };
}

/** The extra turn (degrees) of a card in `slot` at scroll progress p; `dir` is -1 in RTL. */
export function spreadTurn(slot: number, p: number, dir: 1 | -1 = 1): number {
  const pose = FAN_POSES[slot] ?? FAN_POSES[0];
  const deg = pose.r * fanScroll(p, 0).spread * dir;
  return Math.round(deg * 100) / 100 || 0;
}

/* ---------- auto-shuffle ---------- */

export const AUTOPLAY_MS = 5000;

export type AutoplayState = {
  reducedMotion: boolean;
  phone: boolean;
  hidden: boolean;
  offscreen: boolean;
  hovered: boolean;
  focused: boolean;
};

/** The auto-shuffle runs only when nobody is reading, pointing at or tabbing through the fan. */
export function canAutoplay(s: AutoplayState): boolean {
  return !(s.reducedMotion || s.phone || s.hidden || s.offscreen || s.hovered || s.focused);
}
