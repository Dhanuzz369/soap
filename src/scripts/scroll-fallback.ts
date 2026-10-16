/**
 * The scroll-linked moves are CSS (`animation-timeline: scroll()` / `view()`, compositor only).
 * Where a browser has no scroll timelines, this tiny fallback writes the same transforms from the
 * same numbers (src/lib/hero-motion.ts), once per frame while scrolling, transform only:
 *   [data-drift="hero" | "band"]           drift over the first 100vh of the page
 *   [data-par="<px>"][data-par-mode="page"] parallax over the first 100vh
 *   [data-par="<px>"] (default "view")     parallax while the element crosses the viewport
 * Nothing runs with prefers-reduced-motion, or when CSS already handles it.
 */
import { BAND_DRIFT, driftTransform, HERO_DRIFT, parallaxTransform, scrollProgress, viewProgress } from '../lib/hero-motion';

const cssHandles = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!cssHandles && !reduce) {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-drift], [data-par]'));
  if (els.length) {
    let queued = false;
    const update = () => {
      queued = false;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const page = scrollProgress(y, 0, vh);
      for (const el of els) {
        const drift = el.dataset.drift;
        if (drift) {
          el.style.transform = driftTransform(page, vh, drift === 'band' ? BAND_DRIFT : HERO_DRIFT);
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
