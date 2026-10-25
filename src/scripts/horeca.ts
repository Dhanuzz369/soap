/**
 * The HoReCa page (Horeca.astro, FloorPlanHero.astro).
 *
 * 1. The floor plan's hotspots. Hover (fine pointer) or focus opens the space's card and lights
 *    the room; a tap opens it, and a click, Enter or a second tap scrolls to the space's section
 *    and moves focus to its heading. Escape, a click outside or leaving closes it. The card is
 *    placed beside its hotspot and scales from it (transform-origin = the pin). Switching from an
 *    open card to the next is instant. Thumbnails load on the first open. One hotspot pulses
 *    until the drawing is first used, only while the drawing is on screen.
 * 2. The checklist. "Add to my list" checkboxes (the same product in two spaces stays in step),
 *    the property type, and the panel: the count slides to its new number, ticked products show
 *    as removable chips, and the CTA's link is rebuilt with horecaEnquiryHref (?product=,
 *    ?message=). The list is remembered in this browser (localStorage, optional).
 * 3. Phones and tablets: the panel is a bottom sheet above the WhatsApp and language buttons. It
 *    shows only its bar until opened, and slides away while the space sections are off-screen.
 */
import { horecaEnquiryHref, type HorecaMessages } from '../lib/horeca';

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

/* ---------------------------------------------------------------- 1. the floor plan */
const stage = document.querySelector<HTMLElement>('[data-plan]');
if (stage) {
  const spots = [...stage.querySelectorAll<HTMLButtonElement>('[data-spot]')];
  const cardOf = (id: string) => stage.querySelector<HTMLElement>(`[data-card="${id}"]`)!;
  const glowOf = (id: string) => stage.querySelector<SVGGElement>(`[data-space-g="${id}"]`);
  const spotOf = (id: string) => spots.find((s) => s.dataset.spot === id)!;
  let open: string | null = null;
  let closeTimer = 0;
  let lastPointer = '';
  let tapWasOpen = false;

  let thumbs = false;
  const loadThumbs = () => {
    if (thumbs) return;
    thumbs = true;
    stage.querySelectorAll<HTMLImageElement>('img[data-src]').forEach((img) => {
      img.src = img.dataset.src!;
      img.removeAttribute('data-src');
    });
  };

  /** Puts the card beside its pin, inside the drawing, and scales it from the pin. */
  const place = (spot: HTMLButtonElement, card: HTMLElement) => {
    const st = stage.getBoundingClientRect();
    const pin = spot.querySelector('.fp-pin')!.getBoundingClientRect();
    const px = pin.left + pin.width / 2 - st.left;
    const py = pin.top + pin.height / 2 - st.top;
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    const gap = pin.height / 2 + 10;
    let left = px - 16;
    if (left + cw > st.width) left = px + 16 - cw;
    left = Math.max(0, Math.min(left, st.width - cw));
    let top = py + gap;
    if (top + ch > st.height + 24 && py - gap - ch > -st.top) top = py - gap - ch;
    card.style.left = `${Math.round(left)}px`;
    card.style.top = `${Math.round(top)}px`;
    card.style.setProperty('--origin', `${Math.round(px - left)}px ${Math.round(py - top)}px`);
  };

  const hide = (id: string, instant = false) => {
    const card = cardOf(id);
    card.toggleAttribute('data-instant', instant);
    card.removeAttribute('data-open');
    spotOf(id).setAttribute('aria-expanded', 'false');
    glowOf(id)?.removeAttribute('data-on');
    if (open === id) open = null;
  };
  const show = (id: string) => {
    clearTimeout(closeTimer);
    if (open === id) return;
    const instant = open !== null;
    if (open) hide(open, true);
    open = id;
    stage.dataset.used = '';
    loadThumbs();
    const spot = spotOf(id);
    const card = cardOf(id);
    card.toggleAttribute('data-instant', instant);
    place(spot, card);
    card.setAttribute('data-open', '');
    spot.setAttribute('aria-expanded', 'true');
    glowOf(id)?.setAttribute('data-on', '');
  };
  const close = () => {
    clearTimeout(closeTimer);
    if (open) hide(open);
  };
  const closeSoon = () => {
    clearTimeout(closeTimer);
    closeTimer = window.setTimeout(close, 160);
  };

  /** Scrolls to the space's section and moves focus to its heading. */
  const go = (spot: HTMLButtonElement) => {
    const section = document.querySelector<HTMLElement>(spot.dataset.target!);
    if (!section) return;
    close();
    section.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
    const h = section.querySelector<HTMLElement>('h2');
    if (h) {
      h.tabIndex = -1;
      h.focus({ preventScroll: true });
    }
  };

  for (const spot of spots) {
    const id = spot.dataset.spot!;
    spot.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') show(id);
    });
    spot.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse' && document.activeElement !== spot) closeSoon();
    });
    spot.addEventListener('pointerdown', (e) => {
      lastPointer = e.pointerType;
      tapWasOpen = open === id;
    });
    spot.addEventListener('focus', () => show(id));
    spot.addEventListener('click', (e) => {
      // A touch opens the card first; a second tap (or a click, or Enter) goes to the section.
      const touch = (lastPointer === 'touch' || lastPointer === 'pen') && e.detail > 0;
      lastPointer = '';
      if (touch && !tapWasOpen) {
        show(id);
        return;
      }
      go(spot);
    });
    const card = cardOf(id);
    card.addEventListener('pointerenter', () => clearTimeout(closeTimer));
    card.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse' && !card.contains(document.activeElement)) closeSoon();
    });
  }

  // Focus leaving both the hotspot and its card closes the card.
  stage.addEventListener('focusout', (e) => {
    const to = e.relatedTarget as Node | null;
    if (!open) return;
    if (to && (spotOf(open).contains(to) || cardOf(open).contains(to))) return;
    if (to && spots.includes(to as HTMLButtonElement)) return; // the next hotspot opens its own card
    close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !open) return;
    const spot = spotOf(open);
    const inside = cardOf(open).contains(document.activeElement);
    close();
    if (inside) spot.focus({ preventScroll: true });
  });
  document.addEventListener('pointerdown', (e) => {
    if (open && !stage.contains(e.target as Node)) close();
  });
  addEventListener('resize', () => {
    if (open) place(spotOf(open), cardOf(open));
  });

  // The idle pulse runs only while the drawing is on screen (CSS reads data-live).
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      for (const e of entries) stage.toggleAttribute('data-live', e.isIntersecting);
    }).observe(stage);
  }
}

/* ---------------------------------------------------------------- 2. the checklist */
const panel = document.querySelector<HTMLElement>('[data-panel]');
const region = document.querySelector<HTMLElement>('[data-checklist]');
if (panel && region) {
  const boxes = [...document.querySelectorAll<HTMLInputElement>('input[data-pick]')];
  const names = new Map<string, string>();
  for (const b of boxes) if (!names.has(b.dataset.pick!)) names.set(b.dataset.pick!, b.dataset.name ?? b.dataset.pick!);
  const order = [...names.keys()];
  const countEl = panel.querySelector<HTMLElement>('[data-count]')!;
  const list = panel.querySelector<HTMLUListElement>('[data-picked]')!;
  const empty = panel.querySelector<HTMLElement>('[data-empty]')!;
  const select = panel.querySelector<HTMLSelectElement>('[data-type]')!;
  const cta = panel.querySelector<HTMLAnchorElement>('[data-cta]')!;
  const clear = panel.querySelector<HTMLButtonElement>('[data-clear]')!;
  const contact = cta.dataset.contact!;
  const messages = JSON.parse(cta.dataset.msg!) as HorecaMessages;
  const removeLabel = list.dataset.remove ?? '{name}';
  const KEY = 'gb-horeca';

  const picked = new Set<string>();
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as { p?: string[]; t?: string } | null;
    for (const s of saved?.p ?? []) if (names.has(s)) picked.add(s);
    if (saved?.t && [...select.options].some((o) => o.value === saved.t)) select.value = saved.t;
  } catch {
    /* storage unavailable: start empty */
  }

  let shown = 0;
  const animateCount = (n: number) => {
    const up = n > shown;
    countEl.textContent = String(n);
    if (n !== shown) {
      const from = reduce.matches ? { opacity: 0.2 } : { opacity: 0, transform: `translateY(${up ? 45 : -45}%)` };
      countEl.animate([from, { opacity: 1, transform: 'none' }], { duration: 180, easing: EASE_OUT });
    }
    shown = n;
  };

  const chip = (slug: string) => {
    const li = document.createElement('li');
    li.dataset.slug = slug;
    const label = document.createElement('span');
    label.textContent = names.get(slug)!;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', removeLabel.replace('{name}', names.get(slug)!));
    btn.innerHTML = '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false"><path d="M3 3l6 6M9 3 3 9"/></svg>';
    btn.addEventListener('click', () => {
      set(slug, false);
      // keep focus in the list: the next chip, or the select when the list is empty
      const next = list.querySelector<HTMLButtonElement>('button');
      (next ?? select).focus({ preventScroll: true });
    });
    li.append(label, btn);
    return li;
  };

  const render = () => {
    for (const b of boxes) b.checked = picked.has(b.dataset.pick!);
    // the chips, in page order: add the new ones (they animate in), drop the removed ones at once
    const want = order.filter((s) => picked.has(s));
    const have = new Map([...list.children].map((li) => [(li as HTMLElement).dataset.slug!, li]));
    for (const [slug, li] of have) if (!picked.has(slug)) li.remove();
    want.forEach((slug, i) => {
      const li = have.get(slug) ?? chip(slug);
      if (list.children[i] !== li) list.insertBefore(li, list.children[i] ?? null);
    });
    empty.hidden = want.length > 0;
    clear.disabled = want.length === 0;
    animateCount(want.length);
    const type = select.value ? (select.selectedOptions[0]?.textContent ?? '').trim() : '';
    cta.href = horecaEnquiryHref(
      contact,
      want.map((slug) => ({ slug, name: names.get(slug)! })),
      type,
      messages,
    );
    try {
      localStorage.setItem(KEY, JSON.stringify({ p: want, t: select.value }));
    } catch {
      /* not saved: the list still works on this page */
    }
  };
  const set = (slug: string, on: boolean) => {
    if (on) picked.add(slug);
    else picked.delete(slug);
    render();
  };

  for (const b of boxes) b.addEventListener('change', () => set(b.dataset.pick!, b.checked));
  select.addEventListener('change', render);
  clear.addEventListener('click', () => {
    picked.clear();
    render();
    select.focus({ preventScroll: true });
  });
  shown = picked.size; // a restored list does not animate on load
  render();

  /* ---------------------------------------------------------------- 3. the bottom sheet */
  const sheet = matchMedia('(max-width: 999.98px)');
  const toggle = panel.querySelector<HTMLButtonElement>('[data-panel-toggle]')!;
  const bar = panel.querySelector<HTMLElement>('.hc-panel-bar')!;
  const body = panel.querySelector<HTMLElement>('.hc-panel-body')!;
  const sync = () => {
    const isOpen = panel.hasAttribute('data-open');
    const away = panel.hasAttribute('data-away');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', (isOpen ? toggle.dataset.close : toggle.dataset.open) ?? '');
    // On phones a closed sheet's body (and a sheet that has slid away) is out of reach.
    body.inert = sheet.matches && !isOpen;
    panel.inert = sheet.matches && away;
  };
  const setOpen = (on: boolean) => {
    panel.toggleAttribute('data-open', on);
    sync();
  };
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!panel.hasAttribute('data-open'));
  });
  bar.addEventListener('click', () => {
    if (sheet.matches) setOpen(!panel.hasAttribute('data-open'));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sheet.matches && panel.hasAttribute('data-open')) {
      setOpen(false);
      toggle.focus({ preventScroll: true });
    }
  });
  sheet.addEventListener('change', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      for (const e of entries) {
        panel.toggleAttribute('data-away', !e.isIntersecting);
        if (!e.isIntersecting) panel.removeAttribute('data-open');
      }
      sync();
    }).observe(region);
  }
  sync();
}
