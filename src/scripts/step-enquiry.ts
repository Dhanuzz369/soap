/**
 * Turns StepEnquiry.astro's long form into a stepper (spec 2026-10-27 §4, §5, §8).
 * - One step at a time; tapping an option selects it and moves on after 260 ms.
 * - Each Next saves that step to the Google Sheet (fire-and-forget); step 1 is the lead.
 * - Send is awaited; on failure, or with no endpoint, the WhatsApp / email panel takes over.
 * The rules live in src/lib/enquiry-steps.ts and src/lib/enquiry-send.ts (unit-tested);
 * the browser tests are tests/e2e/step-enquiry.test.ts.
 */
import { buildMailtoUrl, buildWhatsAppUrl, parseEnquiryParams } from '../lib/enquiry';
import { buildPayload, toEnquiryFields, validateStep, visibleSteps, type Answers, type FieldError, type StepId } from '../lib/enquiry-steps';
import { createSender, isConfiguredEndpoint, leadIdStore } from '../lib/enquiry-send';
import { initCountryCombobox } from './country-combobox';

const CONTACT_KEY = 'goodbiz-enquiry-contact';
const CONTACT_FIELDS = ['name', 'company', 'email', 'phone'] as const;
const ADVANCE_MS = 260;
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
/** Option groups that advance on a tap (the last step's brand choice does not). */
const AUTO = new Set(['group', 'product', 'quantity', 'terms']);
const OTHER_BOX: Record<string, keyof Answers> = { group: 'productOther', quantity: 'quantityOther' };

type Deps = { fetch?: typeof fetch; storage?: Storage | null; now?: () => number };

function session(): Storage | null {
  try {
    const s = window.sessionStorage;
    s.getItem('x');
    return s;
  } catch {
    return null;
  }
}

export function initStepEnquiry(form: HTMLFormElement, deps: Deps = {}): void {
  const w = window as unknown as { __ENQ_ENDPOINT__?: string; __ENQ_TIMEOUT__?: number };
  const d = form.dataset;
  const endpoint = typeof w.__ENQ_ENDPOINT__ === 'string' ? w.__ENQ_ENDPOINT__ : (d.endpoint ?? '');
  const configured = isConfiguredEndpoint(endpoint);
  const now = deps.now ?? (() => Date.now());
  const storage = deps.storage !== undefined ? deps.storage : session();
  const sender = createSender({
    endpoint,
    fetch: deps.fetch ?? window.fetch.bind(window),
    loadedAt: now() - performance.now(),
    now,
    timeoutMs: typeof w.__ENQ_TIMEOUT__ === 'number' && w.__ENQ_TIMEOUT__ > 0 ? w.__ENQ_TIMEOUT__ : undefined,
  });
  const lead = leadIdStore(storage, () => crypto.randomUUID());
  const english: Record<string, string> = JSON.parse(d.english || '{}');
  const variants: Record<string, string[]> = JSON.parse(d.variants || '{}');
  const lang = d.lang || 'en';
  const languageName = d.languageName || '';
  const rtl = getComputedStyle(form).direction === 'rtl';
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Every visible string travels in the markup (ui.steps), so the script stays language-free.
  const errorText: Record<string, string> = JSON.parse(d.tErrors || '{}');
  const summaryText: Record<string, string> = JSON.parse(d.tSummary || '{}');
  const fmt = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (m, k) => (k in v ? String(v[k]) : m));

  const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = form) => root.querySelector<T>(sel)!;
  const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = form) => [...root.querySelectorAll<T>(sel)];
  const section = (id: StepId) => $(`section[data-step="${id}"]`);
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
  const checked = (name: string, root: ParentNode = form) => root.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
  const status = $('[data-status]');
  const sendBtn = $<HTMLButtonElement>('[data-send]');
  const country = initCountryCombobox($<HTMLInputElement>('#enq-country'), $<HTMLUListElement>('#enq-country-list'), $<HTMLInputElement>('[data-country-code]'), lang);

  form.classList.add('is-enhanced');
  form.noValidate = true;
  $$('[data-chrome]').forEach((el) => (el.hidden = false));
  $<HTMLInputElement>('[data-lead]').value = lead.get();

  // ---------- prefill ----------
  // A reload returns to step 1 with only the step-1 fields (spec §8): undo the browser's own restore.
  for (const el of $$<HTMLInputElement>('input, textarea')) {
    if (el.type === 'radio' || el.type === 'checkbox') el.checked = false;
    else if (el.type !== 'hidden' && el.type !== 'submit' && !(CONTACT_FIELDS as readonly string[]).includes(el.name)) el.value = '';
  }
  $<HTMLInputElement>('[data-country-code]').value = '';
  try {
    const saved = JSON.parse(storage?.getItem(CONTACT_KEY) ?? 'null');
    if (saved) for (const k of CONTACT_FIELDS) if (typeof saved[k] === 'string' && field(k)) field(k)!.value = saved[k];
  } catch {
    /* nothing saved */
  }
  const params = parseEnquiryParams(location.search);
  let prefilled = params.products.filter((s) => s in variants);
  const variety = prefilled.some((p) => variants[p]?.includes(params.variety)) ? params.variety : '';
  const notes = field('notes') as HTMLTextAreaElement;
  if (params.message && !notes.value) notes.value = params.message;
  let source = '';
  try {
    if (document.referrer) {
      const r = new URL(document.referrer);
      source = r.origin === location.origin ? r.pathname : r.hostname;
    }
  } catch {
    /* no referrer */
  }

  // ---------- reading the answers ----------
  const keyOf = (name: string, root?: ParentNode) => checked(name, root)?.dataset.key;
  const read = (): Answers => {
    const v = (n: string) => field(n)?.value.trim() ?? '';
    const group = keyOf('group');
    const box = group && group !== 'other' ? form.querySelector(`[data-products-for="${group}"]`) : null;
    const product = box ? keyOf('product', box) : undefined;
    const c = country.value();
    return {
      name: v('name'), company: v('company'), email: v('email'), phone: v('phone'),
      group: prefilled.length ? undefined : group,
      productOther: group === 'other' && !prefilled.length ? v('productOther') : '',
      products: prefilled.length ? [...prefilled] : product ? [product] : [],
      quantity: keyOf('quantity'), quantityOther: keyOf('quantity') === 'other' ? v('quantityOther') : '',
      country: c.country, countryCode: c.countryCode, port: v('port'),
      terms: keyOf('terms') as Answers['terms'], privateLabel: keyOf('privateLabel') as Answers['privateLabel'],
      notes: v('notes'), variety, source,
    };
  };
  const nameOf = (slug: string) => english[slug] ?? slug;
  const payload = (stage: StepId | 'submitted') =>
    buildPayload({ leadId: lead.get(), stage, lang, page: location.pathname, now: new Date(now()), answers: read(), english: nameOf, languageName });
  const fields = () => toEnquiryFields(read(), nameOf, languageName);

  // ---------- showing a step ----------
  let steps: StepId[] = [];
  let current: StepId = 'contact';
  let returnTo: StepId | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cancel = () => clearTimeout(timer);
  const recompute = () => (steps = visibleSteps(read(), { products: prefilled.length > 0 }));

  const waEarly = $('[data-wa-early]');
  const refreshWa = () => {
    if (!waEarly.hidden) $<HTMLAnchorElement>('[data-wa-early-link]').href = buildWhatsAppUrl(d.whatsapp ?? '', fields());
  };
  const showWaEarly = () => {
    waEarly.hidden = current === 'contact';
    waEarly.dataset.on = '';
    refreshWa();
  };

  const scrollIntoView = () => {
    const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 104;
    const top = form.getBoundingClientRect().top;
    if (top < offset) window.scrollTo({ top: window.scrollY + top - offset, behavior: reduce() ? 'auto' : 'smooth' });
  };

  const show = (next: StepId, dir: 1 | -1 | 0, opts: { focus?: boolean } = {}) => {
    cancel();
    recompute();
    const prev = form.querySelector<HTMLElement>('section[data-step][data-active]');
    const el = section(next);
    current = next;
    if (next === 'product') {
      const g = keyOf('group');
      $$('[data-products-for]').forEach((b) => b.toggleAttribute('data-current', b.dataset.productsFor === g));
    }
    if (next === 'send') buildSummary();
    if (prev && prev !== el) {
      prev.removeAttribute('data-active');
      if (dir !== 0) {
        // The outgoing step fades on top of the incoming one, out of the flow.
        const stage = $('[data-stage]');
        const r = prev.getBoundingClientRect();
        const s = stage.getBoundingClientRect();
        Object.assign(prev.style, { position: 'absolute', insetInline: '0', top: `${r.top - s.top}px`, pointerEvents: 'none' });
        prev.toggleAttribute('data-leaving', true);
        prev.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: 'ease-out' }).finished.finally(() => {
          prev.removeAttribute('data-leaving');
          prev.removeAttribute('style');
        });
      }
    }
    el.setAttribute('data-active', '');
    if (dir !== 0 && prev !== el) {
      const dx = 16 * dir * (rtl ? -1 : 1);
      const frames = reduce()
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [{ opacity: 0, transform: `translateX(${dx}px)` }, { opacity: 1, transform: 'translateX(0)' }];
      el.animate(frames, { duration: reduce() ? 150 : 240, easing: EASE_OUT });
      if (!reduce())
        $$('.sq-opt-item', el)
          .filter((o) => o.offsetParent !== null)
          .slice(0, 6)
          .forEach((o, i) =>
            o.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 240, delay: 40 + i * 30, easing: EASE_OUT, fill: 'backwards' }),
          );
    }
    const i = Math.max(0, steps.indexOf(next));
    $('[data-progress]').style.transform = `scaleX(${(i + 1) / steps.length})`;
    $('[data-step-label]').textContent = fmt(d.tStepOf ?? '', { n: i + 1, m: steps.length });
    $('[data-back]').hidden = i === 0;
    $('[data-next]').hidden = next === 'send';
    $('[data-skip]').hidden = next === 'contact' || next === 'send';
    if ('on' in waEarly.dataset) waEarly.hidden = next === 'contact';
    refreshWa();
    if (opts.focus !== false) {
      el.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true });
      scrollIntoView();
    }
  };

  // ---------- errors ----------
  const errorTarget = (e: FieldError) =>
    e.field === 'group' || e.field === 'products' || e.field === 'quantity' || e.field === 'terms'
      ? (section(current).querySelector<HTMLInputElement>(`input[name="${e.field === 'products' ? 'product' : e.field}"]:not([hidden])`) ?? null)
      : (field(e.field) as HTMLElement | null);
  const clearErrors = () => {
    $$('[data-error-for]', section(current)).forEach((p) => {
      p.hidden = true;
      p.textContent = '';
    });
    $$('[aria-invalid]', section(current)).forEach((i) => {
      i.removeAttribute('aria-invalid');
      i.setAttribute('aria-describedby', (i.getAttribute('aria-describedby') ?? '').replace(/\s*enq-err-\S+/g, '').trim());
      if (!i.getAttribute('aria-describedby')) i.removeAttribute('aria-describedby');
    });
  };
  const showErrors = (errs: FieldError[]) => {
    errs.forEach((e) => {
      const slot = section(current).querySelector<HTMLElement>(`[data-error-for="${e.field}"]`);
      if (slot) {
        slot.textContent = errorText[e.code] ?? '';
        slot.hidden = false;
      }
      const t = errorTarget(e);
      if (t && slot && t.matches('input:not([type=radio]), textarea')) {
        t.setAttribute('aria-invalid', 'true');
        t.setAttribute('aria-describedby', `${t.getAttribute('aria-describedby') ?? ''} ${slot.id}`.trim());
      }
    });
    const first = errorTarget(errs[0]);
    const visibleRadio = first?.matches('input[type=radio]')
      ? $$<HTMLInputElement>('input[type=radio]', section(current)).find((i) => (i.closest('label') as HTMLElement | null)?.offsetParent)
      : null;
    (visibleRadio ?? first)?.focus();
  };

  // ---------- moving ----------
  const after = (from: StepId) => {
    recompute();
    let i = steps.indexOf(from) + 1;
    if (returnTo) {
      // Back from an Edit: skip ahead over steps that are already answered.
      while (i < steps.length - 1 && validateStep(steps[i], read()).length === 0) i++;
    }
    const next = steps[Math.min(i, steps.length - 1)];
    if (next === 'send') returnTo = null;
    return next;
  };
  const saveStep = (step: StepId) => {
    if (step === 'send') return;
    const sent = sender.step(payload(step));
    if (step === 'contact') {
      try {
        const a = read();
        storage?.setItem(CONTACT_KEY, JSON.stringify(Object.fromEntries(CONTACT_FIELDS.map((k) => [k, a[k] ?? '']))));
      } catch {
        /* memory only */
      }
      if (!configured) showWaEarly();
      else void sent.then((r) => r === 'failed' && showWaEarly());
    }
  };
  const next = () => {
    cancel();
    clearErrors();
    const errs = validateStep(current, read());
    if (errs.length) return showErrors(errs);
    saveStep(current);
    show(after(current), 1);
  };
  const skip = () => {
    cancel();
    clearErrors();
    saveStep(current);
    show(after(current), 1);
  };
  const back = () => {
    cancel();
    clearErrors();
    recompute();
    const i = steps.indexOf(current);
    if (i > 0) show(steps[i - 1], -1);
  };

  $('[data-next]').addEventListener('click', next);
  $('[data-skip]').addEventListener('click', skip);
  $('[data-back]').addEventListener('click', back);

  // ---------- options: auto-advance, "other" boxes ----------
  const otherBox = (f: string) => form.querySelector<HTMLElement>(`[data-other-for="${f}"]`);
  for (const [g, f] of Object.entries(OTHER_BOX)) {
    const box = otherBox(f);
    if (box) box.hidden = keyOf(g) !== 'other';
  }
  let lastKey: string | null = null;
  let wasChecked = false;
  const picked = (input: HTMLInputElement) => {
    const group = input.name;
    const boxField = OTHER_BOX[group];
    if (boxField) {
      const box = otherBox(boxField)!;
      const isOther = input.dataset.key === 'other';
      box.hidden = !isOther;
      if (isOther) {
        cancel();
        box.querySelector<HTMLInputElement>('input')?.focus();
        return;
      }
    }
    if (!AUTO.has(group)) return;
    cancel();
    timer = setTimeout(next, ADVANCE_MS);
  };
  form.addEventListener('keydown', (e) => {
    lastKey = e.key;
    const t = e.target as HTMLElement;
    if (t instanceof HTMLInputElement && t.type === 'radio' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      t.checked = true;
      picked(t);
    } else if (e.key === 'Enter' && t instanceof HTMLInputElement && t.type !== 'radio' && t.type !== 'checkbox') {
      e.preventDefault();
      if (current === 'send') return;
      next();
    }
  });
  form.addEventListener('pointerdown', (e) => {
    lastKey = null;
    const input = (e.target as HTMLElement).closest('.sq-opt-item')?.querySelector<HTMLInputElement>('input[type=radio]');
    wasChecked = !!input?.checked;
  });
  form.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.type !== 'radio') return;
    if (lastKey?.startsWith('Arrow')) {
      cancel();
      const boxField = OTHER_BOX[t.name];
      if (boxField) otherBox(boxField)!.hidden = t.dataset.key !== 'other';
      return;
    }
    if (lastKey === 'Enter' || lastKey === ' ') return; // handled on keydown
    picked(t);
  });
  form.addEventListener('click', (e) => {
    const t = e.target as HTMLInputElement;
    // Re-tapping the option already chosen still moves on (no change event fires for it).
    if (t instanceof HTMLInputElement && t.type === 'radio' && wasChecked && lastKey === null) {
      wasChecked = false;
      picked(t);
    }
  });
  form.addEventListener('input', () => refreshWa());

  // ---------- summary (last step) ----------
  const labelText = (input: HTMLInputElement | null | undefined) => input?.closest('label')?.querySelector('span:not(.sq-badge):not(.sq-card-media):not(.sq-plus)')?.textContent?.trim() ?? '';
  const productLabel = (slug: string) => labelText(form.querySelector<HTMLInputElement>(`input[name="product"][data-key="${slug}"]`)) || nameOf(slug);
  function buildSummary() {
    const a = read();
    const dl = $('[data-summary]');
    const rows: { step: StepId; label: string; value: string | Node }[] = [];
    const title = (k: string) => summaryText[k] ?? k;
    rows.push({ step: 'contact', label: title('contact'), value: [a.name, a.company, a.email, a.phone].filter(Boolean).join(' · ') });
    let product: string | Node;
    if (prefilled.length) {
      const chips = document.createElement('span');
      chips.className = 'sq-chips';
      for (const slug of prefilled) {
        const name = productLabel(slug);
        const chip = document.createElement('span');
        chip.className = 'sq-chip';
        chip.append(name);
        const x = document.createElement('button');
        x.type = 'button';
        x.textContent = '×';
        x.setAttribute('aria-label', fmt(d.tRemove ?? '{name}', { name }));
        x.addEventListener('click', () => removeProduct(slug));
        chip.append(x);
        chips.append(chip);
      }
      product = chips;
    } else if (a.group === 'other') product = a.productOther ?? '';
    else product = (a.products ?? []).map(productLabel).join(', ');
    rows.push({ step: prefilled.length ? 'send' : 'group', label: title('product'), value: product });
    rows.push({ step: 'quantity', label: title('quantity'), value: a.quantity === 'other' ? (a.quantityOther ?? '') : labelText(checked('quantity')) });
    rows.push({ step: 'destination', label: title('destination'), value: [country.label(), a.port].filter(Boolean).join(' · ') });
    rows.push({ step: 'terms', label: title('terms'), value: checked('terms')?.closest('label')?.querySelector('.sq-term-title')?.textContent?.trim() ?? '' });
    dl.replaceChildren(
      ...rows.map((r) => {
        const row = document.createElement('div');
        row.className = 'sq-row';
        const dt = document.createElement('dt');
        dt.textContent = r.label;
        const dd = document.createElement('dd');
        if (typeof r.value === 'string') {
          dd.textContent = r.value || '—';
          dd.classList.toggle('is-empty', !r.value);
        } else dd.append(r.value);
        row.append(dt, dd);
        if (r.step !== 'send') {
          const edit = document.createElement('button');
          edit.type = 'button';
          edit.className = 'sq-edit';
          edit.textContent = d.tEdit ?? 'Edit';
          edit.setAttribute('aria-label', `${d.tEdit ?? 'Edit'}: ${r.label}`);
          edit.addEventListener('click', () => {
            returnTo = 'send';
            show(r.step, -1);
          });
          row.append(edit);
        }
        return row;
      }),
    );
  }
  function removeProduct(slug: string) {
    prefilled = prefilled.filter((p) => p !== slug);
    if (prefilled.length) {
      buildSummary();
      ($('[data-summary] .sq-chip button') as HTMLElement | null)?.focus();
      show('send', 0, { focus: false });
    } else {
      returnTo = 'send';
      show('group', -1);
    }
  }

  // ---------- sending ----------
  let sending = false;
  const finish = (panel: HTMLElement) => {
    $('[data-stage]').hidden = true;
    $$('[data-chrome]').forEach((el) => (el.hidden = true));
    panel.hidden = false;
    const h = panel.querySelector<HTMLElement>('h3')!;
    h.focus({ preventScroll: true });
    status.textContent = `${h.textContent ?? ''} ${panel.querySelector('p')?.textContent ?? ''}`.trim();
    scrollIntoView();
  };
  const success = () => {
    const panel = $('[data-success]');
    const name = read().name ?? '';
    panel.querySelector('h3')!.textContent = name ? fmt(d.tSuccess ?? '', { name }) : panel.querySelector('h3')!.textContent;
    if (!reduce()) panel.querySelector('svg')?.classList.add('is-drawing');
    finish(panel);
  };
  const fail = () => {
    const f = fields();
    $<HTMLAnchorElement>('[data-send-whatsapp]').href = buildWhatsAppUrl(d.whatsapp ?? '', f);
    $<HTMLAnchorElement>('[data-send-email]').href = buildMailtoUrl(d.email ?? '', f);
    finish($('[data-fail]'));
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    sending = true;
    cancel();
    if (checked('website_confirm')) return success(); // a bot: look sent, send nothing
    sendBtn.disabled = true;
    sendBtn.setAttribute('aria-busy', 'true');
    status.textContent = d.tSending ?? '';
    const result = await sender.submit(payload('submitted'));
    sendBtn.removeAttribute('aria-busy');
    if (result === 'ok') {
      lead.reset();
      try {
        storage?.removeItem(CONTACT_KEY);
      } catch {
        /* memory only */
      }
      success();
    } else fail();
  });

  recompute();
  show(steps[0], 0, { focus: false });
}
