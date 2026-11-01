/**
 * Google Analytics 4 with consent (spec 2026-11-01): the pure rules, unit-tested in
 * tests/unit/analytics.test.ts. The browser side (banner, loading gtag.js, events) is
 * src/scripts/analytics.ts.
 *
 * - Consent: localStorage `gb-consent` = {"v":1,"analytics":"granted"|"denied","at":<ISO date>}.
 *   Anything else, a different version, a date in the future or a choice older than 12 months
 *   counts as "not chosen yet", so the banner asks again.
 * - Only the real site sends: an ID, a launched build (src/lib/launch.ts) AND the page's hostname
 *   equal to the hostname of site.url. Previews, *.vercel.app, local builds and tests never send.
 * - No personal data: every event's parameters pass an allow-list of names and values (known keys
 *   or plain slugs). Names, emails, phones, companies, notes and the lead id can never get through.
 * - Basic consent mode: gtag.js is not requested at all before Accept; advertising is always denied.
 * - Page addresses are cleaned before Google sees them (cleanUrl): only product slugs and campaign
 *   tags stay in the query, so ?message= from the quote card never leaves the page.
 */
import { LOCALE_CODES } from '../i18n/locales.ts';

export const CONSENT_KEY = 'gb-consent';
export const CONSENT_VERSION = 1;
/** The banner asks again after this many months. */
export const CONSENT_MONTHS = 12;

export type Choice = 'granted' | 'denied';

/** The stored record for a choice made at `now`. */
export function consentRecord(choice: Choice, now: Date): string {
  return JSON.stringify({ v: CONSENT_VERSION, analytics: choice, at: now.toISOString() });
}

/** The visitor's current choice, or null when they have not chosen (or must be asked again). */
export function parseConsent(raw: string | null | undefined, now: Date): Choice | null {
  if (!raw) return null;
  let o: unknown;
  try {
    o = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
  const { v, analytics, at } = o as Record<string, unknown>;
  if (v !== CONSENT_VERSION || (analytics !== 'granted' && analytics !== 'denied') || typeof at !== 'string') return null;
  const made = new Date(at);
  if (Number.isNaN(made.getTime()) || made.getTime() > now.getTime()) return null;
  const expires = new Date(made);
  expires.setUTCMonth(expires.getUTCMonth() + CONSENT_MONTHS);
  return now.getTime() <= expires.getTime() ? analytics : null;
}

/** The page is served from the site's own domain (site.url), not a preview or a local server. */
export function isAnalyticsHost(hostname: string, siteUrl: string): boolean {
  try {
    return !!hostname && hostname === new URL(siteUrl).hostname;
  } catch {
    return false;
  }
}

/** Analytics may run on this page at all (consent is checked separately). */
export function analyticsEnabled(o: { id: string; launched: boolean; hostname: string; siteUrl: string }): boolean {
  return !!o.id && o.launched && isAnalyticsHost(o.hostname, o.siteUrl);
}

// ---------- events and their allowed parameters ----------
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
type Check = (v: string) => boolean;
const oneOf = (...values: readonly string[]): Check => {
  const set = new Set(values);
  return (v) => set.has(v);
};
const slug: Check = (v) => v.length <= 64 && SLUG.test(v);
const language = oneOf(...LOCALE_CODES);

/** Every event the site sends, with the only parameters it may carry (spec §4). */
const EVENTS = new Map<string, Record<string, Check>>([
  ['generate_lead', { lead_source: oneOf('enquiry_form'), product: slug, language }],
  ['enquiry_step', { step: oneOf('group', 'product', 'quantity', 'destination', 'terms'), language }],
  ['enquiry_sent', { group: slug, product: slug, terms: oneOf('not-sure', 'FOB', 'CFR', 'CIF'), language }],
  ['enquiry_fallback', { reason: oneOf('no_endpoint', 'error', 'timeout') }],
  ['contact_click', { method: oneOf('whatsapp', 'email', 'phone'), location: oneOf('header', 'footer', 'fab', 'form', 'page') }],
  ['quote_start', { product: slug }],
  ['language_change', { to: language }],
]);

export type EventParams = Record<string, unknown>;

/**
 * The parameters Google may receive for this event: only allowed names with allowed values (a
 * known key or a plain lower-case slug). Null for an event that is not on the list.
 */
export function sanitizeParams(event: string, params: EventParams): Record<string, string> | null {
  const allowed = EVENTS.get(event);
  if (!allowed) return null;
  const out: Record<string, string> = {};
  for (const [k, check] of Object.entries(allowed)) {
    const v = params[k];
    if (typeof v === 'string' && check(v)) out[k] = v;
  }
  return out;
}

/** The contact method of a link (wa.me, mailto:, tel:), or null for any other link. */
export function contactMethod(href: string): 'whatsapp' | 'email' | 'phone' | null {
  const h = (href ?? '').trim().toLowerCase();
  if (h.startsWith('https://wa.me/')) return 'whatsapp';
  if (h.startsWith('mailto:')) return 'email';
  if (h.startsWith('tel:')) return 'phone';
  return null;
}

// ---------- the enquiry form's events (src/scripts/step-enquiry.ts) ----------
/** generate_lead: step 1 saved for the first time for this lead. */
export function leadParams(o: { products: string[]; lang: string }): EventParams {
  return { lead_source: 'enquiry_form', ...(o.products[0] ? { product: o.products[0] } : {}), language: o.lang };
}

const LATER_STEPS = new Set(['group', 'product', 'quantity', 'destination', 'terms']);
/** enquiry_step: a later step completed (null for the contact step and the summary). */
export function stepEvent(step: string, lang: string): EventParams | null {
  return LATER_STEPS.has(step) ? { step, language: lang } : null;
}

/**
 * enquiry_sent: the range and product as keys (a product opened from a link gives its range), the
 * Incoterm key and the language. Never the buyer's own words ("something else", notes).
 */
export function enquirySentParams(
  a: { group?: string; products?: string[]; terms?: string; productOther?: string },
  groupOf: (slug: string) => string | undefined,
  lang: string,
): EventParams {
  const product = a.products?.[0];
  const group = a.group ?? (product ? groupOf(product) : undefined);
  return { ...(group ? { group } : {}), ...(product ? { product } : {}), ...(a.terms ? { terms: a.terms } : {}), language: lang };
}

/** enquiry_fallback: why the WhatsApp / email panel took over from the final send. */
export function fallbackReason(configured: boolean, result: string): 'no_endpoint' | 'timeout' | 'error' {
  return !configured ? 'no_endpoint' : result === 'timeout' ? 'timeout' : 'error';
}

// ---------- the Google tag ----------
/** Consent Mode v2, set before gtag.js loads (which happens only after Accept). */
export const CONSENT_DEFAULTS = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted',
} as const;

/** gtag('config', id, …): page views on; Google signals and ad personalisation off. */
export const GTAG_CONFIG = {
  send_page_view: true,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
} as const;

/**
 * The page addresses Google may see. Query strings can carry the visitor's own words (the quote
 * card's ?message=, ?variety=), so only these parameters survive: product slugs and campaign tags.
 */
const URL_PARAMS: Record<string, (v: string) => boolean> = {
  product: (v) => v.length <= 200 && /^[a-z0-9]+(?:-[a-z0-9]+)*(?:,[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(v),
  utm_source: () => true,
  utm_medium: () => true,
  utm_campaign: () => true,
  utm_term: () => true,
  utm_content: () => true,
  gclid: () => true,
};

/** The URL without its hash and without any query parameter not on the list above ('' if not a URL). */
export function cleanUrl(href: string): string {
  let u: URL;
  try {
    u = new URL(href);
  } catch {
    return '';
  }
  const out = new URL(u.origin + u.pathname);
  for (const [k, ok] of Object.entries(URL_PARAMS)) for (const v of u.searchParams.getAll(k)) if (ok(v)) out.searchParams.append(k, v);
  return out.href;
}

/**
 * gtag('config', id, …) for this page: GTAG_CONFIG plus a cleaned page_location, so the automatic
 * page view never sends free text from the address, and events inherit the same clean page. The
 * referrer: our own pages cleaned the same way, another site as its origin only.
 */
export function pageConfig(o: { href: string; referrer: string }): Record<string, unknown> {
  const config: Record<string, unknown> = { ...GTAG_CONFIG, page_location: cleanUrl(o.href) };
  if (o.referrer) {
    try {
      const r = new URL(o.referrer);
      config.page_referrer = r.origin === new URL(o.href).origin ? cleanUrl(o.referrer) : `${r.origin}/`;
    } catch {
      /* no usable referrer */
    }
  }
  return config;
}

/** The only place the site names Google's tag server (a unit test checks). */
export function gtagSrc(id: string): string {
  return `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
}

export type Gtag = (...args: unknown[]) => void;

/**
 * track(name, params): sends an event only when analytics is enabled on this host AND the visitor
 * has accepted, with the parameters cleaned. Never throws. Each check is read at call time, so a
 * withdrawal stops sending at once.
 */
export function createTracker(o: { enabled: () => boolean; consent: () => Choice | null; gtag: () => Gtag | undefined }) {
  return {
    track(name: string, params: EventParams = {}): boolean {
      try {
        if (!o.enabled() || o.consent() !== 'granted') return false;
        const clean = sanitizeParams(name, params);
        const gtag = o.gtag();
        if (!clean || typeof gtag !== 'function') return false;
        gtag('event', name, clean);
        return true;
      } catch {
        return false;
      }
    },
  };
}

// ---------- withdrawal ----------
/** The Google Analytics cookies (_ga, _ga_<container>) present in the page's cookie string. */
export function gaCookieNames(cookie: string): string[] {
  return (cookie ?? '')
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((n) => n === '_ga' || n.startsWith('_ga_'));
}

/**
 * Assignments for the cookie setter that expire each cookie on this host and on every parent domain
 * (Google sets them on the highest domain it can, e.g. .goodbizhygiene.com), never on a bare TLD.
 */
export function expireCookies(names: string[], hostname: string): string[] {
  const parts = hostname.split('.');
  const domains: string[] = [];
  if (parts.length > 1 && !/^\d+$/.test(parts[parts.length - 1])) {
    for (let i = 0; i < parts.length - 1; i++) {
      const d = parts.slice(i).join('.');
      domains.push(d, `.${d}`);
    }
  }
  return names.flatMap((n) => [`${n}=; Max-Age=0; path=/`, ...domains.map((d) => `${n}=; Max-Age=0; path=/; domain=${d}`)]);
}
