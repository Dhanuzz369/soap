/**
 * The home hero fan (HeroFan.astro): the deal on load, the auto-shuffle, the range buttons,
 * back-card clicks and the phone swipe. All motion is CSS transitions on transform and opacity
 * (home.css), so every change can be interrupted and retargeted; this script only sets
 * `data-slot` on each card and `data-mode` on the fan (which picks the durations and curves).
 * Decisions live in src/lib/hero-fan.ts (unit-tested).
 */
import {
  advance,
  AUTOPLAY_MS,
  bringToFront,
  canAutoplay,
  dragOffset,
  initialOrder,
  retreat,
  slotsOf,
  swipeAxis,
  swipeDecision,
} from '../lib/hero-fan';

type Mode = 'deal' | 'auto' | 'user';

/** How long each mode's transitions run (home.css), so data-mode can be cleared after. */
const SETTLE: Record<Mode, number> = { deal: 1100 + 3 * 90 + 50, auto: 800, user: 320 };
/** When the leaving card (out to the inline start) switches to the back slot. */
const TUCK: Record<Exclude<Mode, 'deal'>, number> = { auto: 360, user: 130 };

const root = document.querySelector<HTMLElement>('[data-fan]');
if (root) init(root);

function init(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>('.fan-stage');
  const cards = Array.from(root.querySelectorAll<HTMLAnchorElement>('.fan-card'));
  const faces = cards.map((c) => c.querySelector<HTMLElement>('.fan-face'));
  const glows = Array.from(root.querySelectorAll<HTMLElement>('.fan-glow-img'));
  const captions = Array.from(root.querySelectorAll<HTMLElement>('.fan-caption'));
  const captionBox = root.querySelector<HTMLElement>('[data-captions]');
  const tabList = root.querySelector<HTMLElement>('[data-tabs]');
  const tabs = Array.from(root.querySelectorAll<HTMLAnchorElement>('.fan-tab'));
  if (!stage || cards.length < 2 || !captionBox || !tabList) return;

  const rtl = getComputedStyle(root).direction === 'rtl';
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mqPhone = window.matchMedia('(max-width: 759.98px)');

  let order = initialOrder(cards.length);
  let tuckTimer = 0;
  let settleTimer = 0;
  let autoTimer = 0;
  let dealt = false;
  const hold = { hidden: document.hidden, offscreen: false, hovered: false, focused: false };

  /* ---------- ARIA: the range buttons become tabs controlling the fan ---------- */
  tabList.setAttribute('role', 'tablist');
  tabs.forEach((t) => {
    t.setAttribute('role', 'tab');
    t.setAttribute('aria-controls', stage.id);
  });

  /* ---------- render ---------- */
  const setMode = (mode: Mode) => {
    root.dataset.mode = mode;
    clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => delete root.dataset.mode, SETTLE[mode]);
  };

  const render = () => {
    const slots = slotsOf(order);
    const front = order[0];
    cards.forEach((c, i) => {
      c.dataset.slot = String(slots[i]);
      delete c.dataset.leaving;
      const isFront = i === front;
      c.tabIndex = isFront ? 0 : -1;
      if (isFront) c.removeAttribute('aria-hidden');
      else {
        // (mouse) focus left on a card that goes to the back would sit inside aria-hidden
        if (document.activeElement === c) c.blur();
        c.setAttribute('aria-hidden', 'true');
      }
    });
    glows.forEach((g, i) => g.toggleAttribute('data-active', i === front));
    captions.forEach((p, i) => p.toggleAttribute('data-active', i === front));
    tabs.forEach((t, i) => {
      t.setAttribute('aria-selected', String(i === front));
      t.toggleAttribute('data-active', i === front);
      t.tabIndex = i === front ? 0 : -1;
    });
    stage.setAttribute('aria-labelledby', `fan-name-${front}`);
  };

  /** Announce only what the visitor asked for; the auto-shuffle stays silent. */
  const announce = (on: boolean) => captionBox.setAttribute('aria-live', on ? 'polite' : 'off');

  /** The front card slides out toward the inline start, then tucks in at the back. */
  const deal = (mode: 'auto' | 'user') => {
    clearTimeout(tuckTimer);
    const leaving = order[0];
    order = advance(order);
    setMode(mode);
    render();
    const card = cards[leaving];
    card.dataset.slot = 'out';
    card.dataset.leaving = '';
    tuckTimer = window.setTimeout(() => {
      card.dataset.slot = String(order.length - 1);
    }, TUCK[mode]);
  };

  const select = (card: number) => {
    if (order[0] === card) return;
    clearTimeout(tuckTimer);
    order = bringToFront(order, card);
    announce(true);
    setMode('user');
    render();
  };

  /* ---------- auto-shuffle ---------- */
  const schedule = () => {
    clearTimeout(autoTimer);
    autoTimer = 0;
    const ok = canAutoplay({ ...hold, reducedMotion: mqReduce.matches, phone: mqPhone.matches });
    if (!ok || !dealt) return;
    autoTimer = window.setTimeout(() => {
      announce(false);
      deal('auto');
      schedule();
    }, AUTOPLAY_MS);
  };
  /** Any visitor action restarts the 5s idle wait. */
  const touched = () => schedule();

  document.addEventListener('visibilitychange', () => {
    hold.hidden = document.hidden;
    schedule();
  });
  new IntersectionObserver(
    (entries) => {
      for (const e of entries) hold.offscreen = e.intersectionRatio < 0.5;
      schedule();
    },
    { threshold: [0, 0.5, 1] },
  ).observe(stage);
  root.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse') return;
    hold.hovered = true;
    schedule();
  });
  root.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return;
    hold.hovered = false;
    schedule();
  });
  // Keyboard focus holds the fan; a mouse click that leaves focus on a card does not.
  root.addEventListener('focusin', (e) => {
    hold.focused = (e.target as HTMLElement).matches(':focus-visible');
    schedule();
  });
  root.addEventListener('focusout', (e) => {
    if (root.contains(e.relatedTarget as Node | null)) return;
    hold.focused = false;
    schedule();
  });
  mqReduce.addEventListener('change', schedule);
  mqPhone.addEventListener('change', schedule);

  /* ---------- range buttons: click, arrows (roving tabindex), Home/End, Space ---------- */
  tabs.forEach((t, i) => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      select(i);
      touched();
    });
  });
  tabList.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement as HTMLAnchorElement);
    if (i < 0) return;
    const n = tabs.length;
    const fwd = rtl ? 'ArrowLeft' : 'ArrowRight';
    const back = rtl ? 'ArrowRight' : 'ArrowLeft';
    let next = -1;
    if (e.key === fwd || e.key === 'ArrowDown') next = (i + 1) % n;
    else if (e.key === back || e.key === 'ArrowUp') next = (i - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else if (e.key === ' ') next = i;
    if (next < 0) return;
    e.preventDefault();
    tabs[next].focus();
    select(next);
    touched();
  });

  /* ---------- cards: the front one opens its range, a back card's edge brings it forward ---------- */
  let swallowClick = false;
  cards.forEach((c, i) => {
    c.addEventListener('click', (e) => {
      if (swallowClick) {
        e.preventDefault();
        swallowClick = false;
        return;
      }
      if (order[0] !== i) {
        e.preventDefault();
        select(i);
        touched();
      }
    });
  });

  /* ---------- swipe (touch and pen): pointer capture, one finger only, velocity flick ---------- */
  let drag: { id: number; x0: number; y0: number; t0: number; axis: 'x' | 'y' | null; dx: number } | null = null;
  const frontFace = () => faces[order[0]];
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' || drag) return; // a second finger is ignored
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: e.timeStamp, axis: null, dx: 0 };
  });
  stage.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x0;
    const dy = e.clientY - drag.y0;
    if (!drag.axis) {
      drag.axis = swipeAxis(dx, dy);
      if (drag.axis === 'y') {
        drag = null; // the page scrolls
        return;
      }
      if (drag.axis === 'x') {
        stage.setPointerCapture(e.pointerId);
        root.dataset.dragging = '';
      }
    }
    if (drag.axis !== 'x') return;
    drag.dx = dx;
    const face = frontFace();
    const x = dragOffset(dx);
    if (face) face.style.transform = `translate3d(${x}px, 0, 0) rotate(${x * 0.04}deg)`;
  });
  const endDrag = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    if (d.axis !== 'x') return;
    delete root.dataset.dragging;
    const face = frontFace();
    if (face) face.style.transform = '';
    swallowClick = true;
    window.setTimeout(() => (swallowClick = false), 0);
    if (e.type === 'pointercancel') return;
    const decision = swipeDecision(d.dx, e.timeStamp - d.t0, rtl);
    if (decision) announce(true);
    if (decision === 'next') deal('user');
    else if (decision === 'prev') {
      clearTimeout(tuckTimer);
      order = retreat(order);
      setMode('user');
      render();
    }
    touched();
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  /* ---------- the back cards' photos ----------
     They show their blurred colour (the inlined glow) until the deal has settled (or the visitor
     reaches for the fan), so they never compete with the front (LCP) photo; then they fade in. */
  let backLoaded = false;
  const loadBackPhotos = () => {
    if (backLoaded) return;
    backLoaded = true;
    root.querySelectorAll<HTMLImageElement>('img[data-srcset]').forEach((im) => {
      const shown = () => im.setAttribute('data-loaded', '');
      im.addEventListener('load', shown, { once: true });
      im.addEventListener('error', shown, { once: true });
      im.srcset = im.dataset.srcset ?? '';
      im.src = im.dataset.src ?? '';
      im.removeAttribute('data-srcset');
    });
  };
  for (const ev of ['pointerenter', 'touchstart', 'focusin'] as const) root.addEventListener(ev, loadBackPhotos, { once: true, passive: true });

  /* ---------- the deal: once the front photo has painted, fan out ---------- */
  render();
  const img = faces[0]?.querySelector('img');
  const go = () => {
    if (dealt) return;
    dealt = true;

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setMode('deal');
        root.dataset.dealt = '';
        window.setTimeout(() => {
          loadBackPhotos();
          schedule();
        }, SETTLE.deal);
      }),
    );
  };
  if (!img || img.complete) go();
  else {
    img.addEventListener('load', go, { once: true });
    img.addEventListener('error', go, { once: true });
  }
  window.setTimeout(go, 2500);
}
