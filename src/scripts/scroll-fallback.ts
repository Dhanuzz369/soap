/**
 * The scroll-linked moves are CSS (`animation-timeline: scroll()` / `view()`, compositor only).
 * Where a browser has no scroll timelines, this tiny fallback writes the same values from the
 * same numbers (src/lib/hero-motion.ts, src/lib/hero-fan.ts), once per frame while scrolling,
 * transform and opacity only:
 *   [data-drift="band" | "fan"]           drift over the first 100vh of the page
 *   [data-fade="page"]                     fades out over the first 100vh (the fan's glow)
 *   [data-spread] (a fan card)             turns further out over the first 100vh, by its slot
 *   [data-par="<px>"][data-par-mode="page"] parallax over the first 100vh
 *   [data-par="<px>"] (default "view")     parallax while the element crosses the viewport
 * Nothing runs with prefers-reduced-motion, or when CSS already handles it.
 */
import { BAND_DRIFT, driftTransform, FAN_DRIFT, parallaxTransform, scrollProgress, viewProgress } from '../lib/hero-motion';
import { fanScroll, spreadTurn } from '../lib/hero-fan';

const cssHandles = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DRIFTS = { band: BAND_DRIFT, fan: FAN_DRIFT } as const;

if (!cssHandles && !reduce) {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-drift], [data-par], [data-fade], [data-spread]'));
  const dir = document.documentElement.dir === 'rtl' ? -1 : 1;
  if (els.length) {
    let queued = false;
    const update = () => {
      queued = false;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const page = scrollProgress(y, 0, vh);
      for (const el of els) {
        const drift = el.dataset.drift as keyof typeof DRIFTS | undefined;
        if (drift) {
          el.style.transform = driftTransform(page, vh, DRIFTS[drift] ?? BAND_DRIFT);
          continue;
        }
        if (el.dataset.fade !== undefined) {
          el.style.opacity = String(fanScroll(page, vh).glow);
          continue;
        }
        if (el.dataset.spread !== undefined) {
          const slot = Number(el.dataset.slot);
          el.style.rotate = `${spreadTurn(Number.isInteger(slot) ? slot : 0, page, dir)}deg`;
          continue;
        }
        const amount = parseFloat(el.dataset.par ?? '0') || 0;
        if (el.dataset.parMode === 'page') {
          el.style.transform = parallaxTransform(page, amount);
        } else {
          const r = el.getBoundingClientRect();
          el.style.transform = parallaxTransform(viewProgress(r.top, r.height, vh), amount);
        }
      }
    };
    const queue = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    update();
  }
}
