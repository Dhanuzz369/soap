/**
 * The /private-label/ hero's live label (LabelHero.astro):
 * - the brand-name field rewrites both labels instantly (textContent only), fits the name to each
 *   label and updates the enquiry button's ?message= (no animation per keystroke);
 * - the colourway swatches set data-colourway (CSS cross-fades the label colours in 200ms);
 * - fine pointers: the packs tilt toward the pointer, a spring-like lerp in rAF, max ±4°, only
 *   while on screen; never with reduced motion;
 * - the step markers play their staggered entrance once they are on screen.
 */
import { brandMessage, fitSize, labelText } from '../lib/brand-label';
import { enquiryHref } from '../lib/enquiry';

const stage = document.querySelector<HTMLElement>('[data-label]');
const input = document.querySelector<HTMLInputElement>('[data-label-input]');
const cta = document.querySelector<HTMLAnchorElement>('[data-label-cta]');
const names = [...document.querySelectorAll<SVGTextElement>('[data-label-name]')];
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

/** Sets a name's font size so it fills its label width (measured, then scaled once). */
function fit(t: SVGTextElement) {
  const target = Number(t.dataset.fitW);
  const max = Number(t.dataset.fitMax);
  t.setAttribute('font-size', String(max));
  const measured = t.getComputedTextLength();
  t.setAttribute('font-size', String(fitSize(measured, max, target, max)));
}

if (stage && input) {
  const placeholder = input.placeholder;

  const render = () => {
    const text = labelText(input.value, placeholder);
    for (const t of names) {
      if (t.textContent !== text) t.textContent = text;
      fit(t);
    }
    if (cta) {
      const message = brandMessage(input.value, cta.dataset.msg ?? '', cta.dataset.msgNone ?? '');
      cta.href = enquiryHref(cta.dataset.contact ?? cta.href, { message });
    }
  };
  input.addEventListener('input', render);
  // The field is inside a form so Enter works: it follows the enquiry button instead of submitting.
  input.form?.addEventListener('submit', (e) => {
    e.preventDefault();
    cta?.click();
  });
  // A restored value (back/forward cache, autofill) and the web font's real widths.
  render();
  document.fonts?.ready.then(render);

  const colourway = (sw: HTMLInputElement) => {
    stage.dataset.colourway = sw.value;
    stage.setAttribute('style', sw.dataset.vars ?? '');
  };
  for (const sw of document.querySelectorAll<HTMLInputElement>('[data-label-swatch]')) {
    sw.addEventListener('change', () => sw.checked && colourway(sw));
    if (sw.checked) colourway(sw);
  }

  // ---------- tilt toward the pointer ----------
  const tilt = stage.querySelector<HTMLElement>('[data-label-tilt]');
  const bottle = stage.querySelector<SVGGElement>('[data-label-bottle]');
  const carton = stage.querySelector<SVGGElement>('[data-label-carton]');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const MAX = 4;
  const target = { x: 0, y: 0 };
  const cur = { x: 0, y: 0 };
  let raf = 0;
  let onScreen = true;

  const frame = () => {
    raf = 0;
    if (!tilt || !onScreen) return;
    cur.x += (target.x - cur.x) * 0.12;
    cur.y += (target.y - cur.y) * 0.12;
    const settled = Math.abs(target.x - cur.x) < 0.005 && Math.abs(target.y - cur.y) < 0.005;
    if (settled) Object.assign(cur, target);
    tilt.style.transform = `perspective(1100px) rotateX(${cur.x.toFixed(3)}deg) rotateY(${cur.y.toFixed(3)}deg)`;
    // a touch of depth: the bottle (in front) shifts with the tilt, the carton slightly against it
    if (bottle) bottle.style.translate = `${(cur.y * 1.6).toFixed(2)}px ${(-cur.x * 1.6).toFixed(2)}px`;
    if (carton) carton.style.translate = `${(-cur.y * 0.8).toFixed(2)}px ${(cur.x * 0.8).toFixed(2)}px`;
    if (!settled) raf = requestAnimationFrame(frame);
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  if (tilt) {
    stage.addEventListener('pointermove', (e) => {
      if (!fine.matches || reduce.matches || e.pointerType !== 'mouse') return;
      const r = tilt.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) - 0.5;
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) - 0.5;
      target.y = px * 2 * MAX;
      target.x = -py * 2 * MAX;
      kick();
    });
    stage.addEventListener('pointerleave', () => {
      target.x = target.y = 0;
      kick();
    });
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) kick();
    }).observe(stage);
    reduce.addEventListener('change', () => {
      if (!reduce.matches) return;
      target.x = target.y = cur.x = cur.y = 0;
      tilt.style.transform = '';
      if (bottle) bottle.style.translate = '';
      if (carton) carton.style.translate = '';
    });
  }
}

// ---------- the step markers: staggered entrance when on screen ----------
const steps = document.querySelector<HTMLElement>('[data-label-steps]');
if (steps) {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      steps.dataset.play = '';
      io.disconnect();
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  io.observe(steps);
}
