/**
 * Google Analytics 4 with consent, in the browser (spec 2026-11-01). The rules are pure and
 * unit-tested in src/lib/analytics.ts; the browser tests are tests/e2e/consent.test.ts.
 *
 * - Where the site asks first (the browser's time zone is in Europe or in a country of one of the
 *   site's other languages: src/lib/consent-regions.ts), the banner (ConsentBanner.astro, in every
 *   page's markup, hidden) shows until the visitor chooses, and asks again after 12 months.
 *   Everywhere else no banner shows and analytics runs by default. The footer's "Cookie settings"
 *   button opens the banner anywhere, with the choice in effect marked.
 * - gtag.js loads once the page is idle, only on the live domain of a launched build, and only with
 *   consent in effect (Accept, or by default). Reject, or a later withdrawal: the choice is stored,
 *   sending stops at once, and the _ga cookies on our domain are deleted.
 * - track(name, params) is what the other scripts call. It does nothing unless analytics is on for
 *   this host and consent is in effect, and it sends only allow-listed parameters.
 * - Without storage (private mode, blocked) the choice lives for this page only: the banner asks
 *   again on the next page, and nothing breaks.
 */
import {
  CONSENT_KEY,
  analyticsEnabled,
  asksFirst,
  consentDefaults,
  consentRecord,
  contactMethod,
  createTracker,
  effectiveChoice,
  expireCookies,
  gaCookieNames,
  gtagSrc,
  pageConfig,
  parseConsent,
  type Choice,
  type EventParams,
  type Gtag,
} from '../lib/analytics';

type GaWindow = Window & { dataLayer?: unknown[]; gtag?: Gtag } & Record<string, unknown>;
const w = window as unknown as GaWindow;

/** This page's choice when storage cannot keep it. */
let memory: Choice | null = null;

const banner = () => document.querySelector<HTMLElement>('[data-consent]');

function storage(): Storage | null {
  try {
    const s = window.localStorage;
    s.getItem(CONSENT_KEY);
    return s;
  } catch {
    return null;
  }
}

/** The visitor's current choice (null: not chosen yet, or asked again after 12 months). */
export function currentChoice(): Choice | null {
  try {
    const raw = storage()?.getItem(CONSENT_KEY);
    return raw ? parseConsent(raw, new Date()) : memory;
  } catch {
    return memory;
  }
}

/** The site asks before analytics in this browser's time zone (src/lib/consent-regions.ts). */
function askFirst(): boolean {
  try {
    return asksFirst(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return true;
  }
}

/** The choice in effect: the visitor's own, or analytics by default where the site does not ask first. */
const inEffect = (): Choice | null => effectiveChoice(currentChoice(), askFirst());

/** An ID is set (the banner exists), the build is launched, and this is the live domain. */
function enabled(): boolean {
  const d = banner()?.dataset;
  return !!d && analyticsEnabled({ id: d.ga ?? '', launched: d.launched === 'true', hostname: location.hostname, siteUrl: d.site ?? '' });
}

const tracker = createTracker({ enabled, consent: inEffect, gtag: () => w.gtag });

/** Sends a GA4 event: a no-op without consent, off the live domain, or for unknown parameters. */
export function track(name: string, params: EventParams = {}): void {
  tracker.track(name, params);
}

let loaded = false;
/**
 * The Google tag, set up for consent mode before gtag.js is requested once the page is idle.
 * `byDefault`: no choice made, where analytics runs by default (consentDefaults).
 */
function loadGtag(id: string, byDefault: boolean): void {
  w[`ga-disable-${id}`] = false;
  if (loaded) {
    w.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    return;
  }
  loaded = true;
  w.dataLayer = w.dataLayer || [];
  // gtag.js reads the arguments object itself, not an array.
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  for (const d of consentDefaults(byDefault)) w.gtag('consent', 'default', d);
  w.gtag('js', new Date());
  // A cleaned page address (no ?message= or other free text); events inherit it.
  w.gtag('config', id, pageConfig({ href: location.href, referrer: document.referrer }));
  const add = () => {
    const s = document.createElement('script');
    s.async = true;
    s.src = gtagSrc(id);
    document.head.append(s);
  };
  if ('requestIdleCallback' in window) requestIdleCallback(add, { timeout: 4000 });
  else setTimeout(add, 1500);
}

/** Stops sending at once and deletes the Google Analytics cookies on this domain. */
function withdraw(id: string): void {
  w[`ga-disable-${id}`] = true;
  w.gtag?.('consent', 'update', { analytics_storage: 'denied' });
  for (const line of expireCookies(gaCookieNames(document.cookie), location.hostname)) document.cookie = line;
}

// ---------- the banner ----------
/** The exit transition's length (ConsentBanner.astro: enter 240 ms, exit 160 ms). */
const CLOSE_MS = 160;
let opener: HTMLElement | null = null;

function show(el: HTMLElement, opts: { focus?: boolean } = {}): void {
  const choice = inEffect();
  el.querySelectorAll<HTMLButtonElement>('[data-consent-choice]').forEach((b) => {
    if (choice) b.setAttribute('aria-pressed', String(b.dataset.consentChoice === choice));
    else b.removeAttribute('aria-pressed');
  });
  const current = el.querySelector<HTMLElement>('[data-consent-current]');
  if (current) {
    const text = currentChoice() === null ? current.dataset.default : choice === 'granted' ? current.dataset.granted : current.dataset.denied;
    current.textContent = choice ? (text ?? '') : '';
    current.hidden = !choice;
  }
  el.hidden = false;
  document.documentElement.toggleAttribute('data-consent-open', true);
  measure(el);
  // Enter: from just below, on the next frame so the transition runs.
  requestAnimationFrame(() => requestAnimationFrame(() => el.setAttribute('data-state', 'open')));
  // Opened from "Cookie settings": focus moves to the current choice (or Accept), not trapped there.
  if (opts.focus) (el.querySelector<HTMLElement>('[aria-pressed="true"]') ?? el.querySelector<HTMLElement>('[data-consent-choice]'))?.focus();
}

function hide(el: HTMLElement): void {
  const hadFocus = el.contains(document.activeElement);
  el.removeAttribute('data-state');
  document.documentElement.removeAttribute('data-consent-open');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(() => {
    if (!el.hasAttribute('data-state')) el.hidden = true;
  }, reduce ? 0 : CLOSE_MS);
  if (hadFocus && opener) opener.focus();
  opener = null;
}

/** The banner's height, so the floating buttons and the page's end can make room for it. */
let observer: ResizeObserver | null = null;
function measure(el: HTMLElement): void {
  const set = () => document.documentElement.style.setProperty('--consent-h', `${Math.ceil(el.getBoundingClientRect().height)}px`);
  set();
  if (!observer && 'ResizeObserver' in window) {
    observer = new ResizeObserver(set);
    observer.observe(el);
  }
}

function choose(el: HTMLElement, choice: Choice): void {
  memory = choice;
  try {
    storage()?.setItem(CONSENT_KEY, consentRecord(choice, new Date()));
  } catch {
    /* this page only */
  }
  const id = el.dataset.ga ?? '';
  if (choice === 'granted' && enabled()) loadGtag(id, false);
  if (choice === 'denied') withdraw(id);
  hide(el);
}

// ---------- events from anywhere on the page ----------
const where = (a: Element): string =>
  a.closest('.wa-fab') ? 'fab' : a.closest('.site-header') ? 'header' : a.closest('.site-footer') ? 'footer' : a.closest('form, .sq') ? 'form' : 'page';

function listen(): void {
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (!a) return;
      const method = contactMethod(a.getAttribute('href') ?? '');
      if (method) return track('contact_click', { method, location: where(a) });
      const to = a.getAttribute('data-lang-link');
      if (to && to !== 'more' && a.getAttribute('aria-current') !== 'true') track('language_change', { to });
    },
    true,
  );
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    if (!form.matches?.('.quote-form')) return;
    const product = form.querySelector<HTMLInputElement>('input[name="product"]')?.value;
    track('quote_start', product ? { product } : {});
  });
}

/** Starts consent and analytics on this page (once). Without a banner (no ID, the 404) it does nothing. */
export function initConsent(): void {
  const el = banner();
  if (!el || el.dataset.ready) return;
  el.dataset.ready = '';
  el.querySelectorAll<HTMLButtonElement>('[data-consent-choice]').forEach((b) =>
    b.addEventListener('click', () => choose(el, b.dataset.consentChoice === 'granted' ? 'granted' : 'denied')),
  );
  document.querySelectorAll<HTMLElement>('[data-consent-settings]').forEach((li) => (li.hidden = false));
  document.querySelectorAll<HTMLButtonElement>('[data-consent-open]').forEach((b) =>
    b.addEventListener('click', () => {
      opener = b;
      show(el, { focus: true });
    }),
  );
  listen();
  const stored = currentChoice();
  const choice = effectiveChoice(stored, askFirst());
  if (choice === null) show(el);
  else if (choice === 'granted' && enabled()) loadGtag(el.dataset.ga ?? '', stored === null);
}
