/**
 * "The route" (RouteHero.astro): region selection, the arc draw with the gliding ship, and the
 * 5s tour.
 * - A pointer pick draws the arc (stroke-dashoffset) and glides the ship along it, both from one
 *   rAF clock over 800ms on the strong ease-in-out, so the ship rides the tip of the line.
 * - A keyboard pick (arrow keys in the radio group) is instant: no animation on keyboard-driven,
 *   repeated actions. Reduced motion: every pick is instant and there is no ship.
 * - The tour pauses on hover or focus inside the hero, with the pause button, when the tab is
 *   hidden or the map is off-screen, and never runs with reduced motion.
 * - The caption is aria-live="polite" only for the visitor's own picks, never for the tour.
 */
import { easeInOut, nextRegion } from '../lib/route-map';

const root = document.querySelector<HTMLElement>('[data-route]');
const group = document.querySelector<HTMLElement>('[data-route-regions]');
const lane = document.querySelector<HTMLElement>('[data-route-lane]');
const ship = document.querySelector<SVGGElement>('[data-ship]');
const toggle = document.querySelector<HTMLButtonElement>('[data-route-toggle]');
const timeline = document.querySelector<HTMLElement>('[data-route-timeline]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

const DRAW_MS = 800;
const TOUR_MS = 5000;

if (root && group) {
  const buttons = [...group.querySelectorAll<HTMLButtonElement>('[data-region]')];
  const arcOf = (id: string) => root.querySelector<SVGPathElement>(`[data-arc="${id}"]`);
  const baseOf = (id: string) => root.querySelector<SVGPathElement>(`[data-lane-base="${id}"]`);
  const destOf = (id: string) => root.querySelector<SVGGElement>(`[data-dest="${id}"]`);
  root.dataset.js = '';

  let current = -1;
  let anim = 0;

  /** Places the ship at a fraction of the arc, heading along it. */
  const placeShip = (path: SVGPathElement, p: number) => {
    if (!ship) return;
    const len = path.getTotalLength();
    const a = path.getPointAtLength(Math.max(0, p * len - 0.5));
    const b = path.getPointAtLength(Math.min(len, p * len + 0.5));
    const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    const at = path.getPointAtLength(p * len);
    ship.setAttribute('transform', `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
  };

  const select = (i: number, how: 'pointer' | 'key' | 'tour') => {
    if (i === current) return;
    const prev = buttons[current];
    current = i;
    const btn = buttons[i];
    const id = btn.dataset.region!;
    for (const b of buttons) {
      const on = b === btn;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    }
    if (prev) {
      arcOf(prev.dataset.region!)?.removeAttribute('data-on');
      baseOf(prev.dataset.region!)?.removeAttribute('data-on');
      destOf(prev.dataset.region!)?.removeAttribute('data-on');
    }
    const arc = arcOf(id);
    baseOf(id)?.setAttribute('data-on', '');
    destOf(id)?.setAttribute('data-on', '');

    if (lane) {
      lane.setAttribute('aria-live', how === 'tour' ? 'off' : 'polite');
      lane.textContent = btn.dataset.lane ?? '';
    }

    cancelAnimationFrame(anim);
    if (!arc) return;
    arc.setAttribute('data-on', '');
    const animate = how !== 'key' && !reduce.matches;
    if (!animate) {
      arc.style.strokeDashoffset = '0';
      if (ship) {
        if (reduce.matches) ship.removeAttribute('data-on');
        else {
          ship.setAttribute('data-on', '');
          placeShip(baseOf(id) ?? arc, 1);
        }
      }
      return;
    }
    const geo = baseOf(id) ?? arc; // the same curve, without pathLength, for exact ship positions
    ship?.setAttribute('data-on', '');
    const start = performance.now();
    const step = (now: number) => {
      const p = easeInOut((now - start) / DRAW_MS);
      arc.style.strokeDashoffset = String(1 - p);
      placeShip(geo, p);
      if (p < 1) anim = requestAnimationFrame(step);
    };
    arc.style.strokeDashoffset = '1';
    anim = requestAnimationFrame(step);
  };

  // ---------- picks ----------
  buttons.forEach((b, i) =>
    b.addEventListener('click', (e) => {
      // a click from the keyboard (Enter/Space) reports detail 0: keep it instant
      select(i, (e as MouseEvent).detail === 0 ? 'key' : 'pointer');
      restartTour();
    }),
  );
  group.addEventListener('keydown', (e) => {
    const rtl = getComputedStyle(group).direction === 'rtl';
    const keys: Record<string, number> = {
      ArrowDown: 1,
      ArrowUp: -1,
      ArrowRight: rtl ? -1 : 1,
      ArrowLeft: rtl ? 1 : -1,
    };
    let i = current < 0 ? 0 : current;
    if (e.key in keys) i = (i + keys[e.key] + buttons.length) % buttons.length;
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = buttons.length - 1;
    else return;
    e.preventDefault();
    select(i, 'key');
    buttons[i].focus();
  });

  // ---------- the tour ----------
  const state = { hover: false, focus: false, hidden: document.hidden, offscreen: false, user: false };
  let timer = 0;
  const paused = () => reduce.matches || state.hover || state.focus || state.hidden || state.offscreen || state.user;
  function restartTour() {
    clearTimeout(timer);
    if (!paused()) timer = window.setTimeout(() => {
      select(nextRegion(current), 'tour');
      restartTour();
    }, TOUR_MS);
  }
  const section = root.closest('section') ?? root;
  section.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') {
      state.hover = true;
      restartTour();
    }
  });
  section.addEventListener('pointerleave', () => {
    state.hover = false;
    restartTour();
  });
  section.addEventListener('focusin', () => {
    state.focus = true;
    restartTour();
  });
  section.addEventListener('focusout', (e) => {
    if (section.contains(e.relatedTarget as Node | null)) return;
    state.focus = false;
    restartTour();
  });
  document.addEventListener('visibilitychange', () => {
    state.hidden = document.hidden;
    restartTour();
  });
  new IntersectionObserver(([entry]) => {
    state.offscreen = !entry.isIntersecting;
    restartTour();
  }).observe(root.querySelector('.rt-map') ?? root);

  if (toggle) {
    const showToggle = () => (toggle.hidden = reduce.matches);
    showToggle();
    reduce.addEventListener('change', () => {
      showToggle();
      restartTour();
    });
    toggle.addEventListener('click', () => {
      state.user = !state.user;
      toggle.setAttribute('aria-pressed', String(state.user));
      restartTour();
    });
  }

  // the first lane draws in shortly after load (instantly with reduced motion)
  window.setTimeout(() => {
    select(0, 'tour');
    restartTour();
  }, reduce.matches ? 0 : 500);
}

// ---------- the timeline: staggered entrance when on screen ----------
if (timeline) {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      timeline.dataset.play = '';
      io.disconnect();
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  io.observe(timeline);
}
