/**
 * Google Analytics 4 with consent (spec 2026-11-01): the pure rules in src/lib/analytics.ts.
 * Consent record and expiry, the host check, the parameter allow-list, the tracker that only
 * sends with consent on the real host, and the cookie clean-up on withdrawal.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import site from '../../src/config/site';
import {
  CONSENT_KEY,
  CONSENT_DEFAULTS,
  GTAG_CONFIG,
  analyticsEnabled,
  asksFirst,
  cleanUrl,
  consentDefaults,
  consentRecord,
  contactMethod,
  createTracker,
  effectiveChoice,
  enquirySentParams,
  expireCookies,
  fallbackReason,
  gaCookieNames,
  gtagSrc,
  isAnalyticsHost,
  leadParams,
  pageConfig,
  parseConsent,
  sanitizeParams,
  stepEvent,
} from '../../src/lib/analytics';
import { CONSENT_COUNTRIES, CONSENT_COUNTRIES_BY_REASON } from '../../src/lib/consent-regions';
import { CONSENT_TIMEZONES } from '../../src/lib/consent-timezones';

const NOW = new Date('2026-11-01T10:00:00.000Z');
const LIVE = 'www.goodbizhygiene.com';

describe('site config', () => {
  it('has the GA4 measurement id', () => {
    expect(site.analytics.ga4).toBe('G-FWEG9Y5FVS');
  });
});

describe('consent record (localStorage gb-consent)', () => {
  it('is stored under gb-consent as {v:1, analytics, at}', () => {
    expect(CONSENT_KEY).toBe('gb-consent');
    expect(JSON.parse(consentRecord('granted', NOW))).toEqual({ v: 1, analytics: 'granted', at: '2026-11-01T10:00:00.000Z' });
    expect(JSON.parse(consentRecord('denied', NOW))).toEqual({ v: 1, analytics: 'denied', at: '2026-11-01T10:00:00.000Z' });
  });
  it('reads back the choice', () => {
    expect(parseConsent(consentRecord('granted', NOW), NOW)).toBe('granted');
    expect(parseConsent(consentRecord('denied', NOW), NOW)).toBe('denied');
  });
  it('is not chosen yet when nothing or nonsense is stored', () => {
    for (const raw of [null, undefined, '', 'yes', '{', '[]', 'null', '{"v":1}', '{"v":1,"analytics":"maybe","at":"2026-11-01T00:00:00Z"}', '{"v":1,"analytics":"granted","at":"not a date"}', '{"v":1,"analytics":"granted"}'])
      expect(parseConsent(raw, NOW), String(raw)).toBeNull();
  });
  it('asks again when the version changes', () => {
    expect(parseConsent(JSON.stringify({ v: 2, analytics: 'granted', at: NOW.toISOString() }), NOW)).toBeNull();
    expect(parseConsent(JSON.stringify({ v: 0, analytics: 'granted', at: NOW.toISOString() }), NOW)).toBeNull();
  });
  it('asks again after 12 months', () => {
    const at = new Date('2025-11-01T10:00:00.000Z');
    expect(parseConsent(consentRecord('granted', at), new Date('2026-10-31T10:00:00.000Z'))).toBe('granted');
    expect(parseConsent(consentRecord('granted', at), new Date('2026-11-01T10:00:00.001Z'))).toBeNull();
    expect(parseConsent(consentRecord('denied', at), new Date('2027-01-01T00:00:00.000Z'))).toBeNull();
  });
  it('does not trust a date in the future', () => {
    expect(parseConsent(consentRecord('granted', new Date('2027-06-01T00:00:00.000Z')), NOW)).toBeNull();
  });
});

describe('host check: only the real site sends', () => {
  it('matches the hostname of site.url exactly', () => {
    expect(isAnalyticsHost(LIVE, site.url)).toBe(true);
    for (const h of ['localhost', '127.0.0.1', 'goodbizhygiene.com', 'goodbiz-hygiene.vercel.app', 'goodbiz-hygiene-git-main.vercel.app', 'www.goodbizhygiene.com.evil.test', ''])
      expect(isAnalyticsHost(h, site.url), h).toBe(false);
    expect(isAnalyticsHost(LIVE, 'not a url')).toBe(false);
  });
  it('needs an id, a launched build and the real host', () => {
    const on = { id: 'G-FWEG9Y5FVS', launched: true, hostname: LIVE, siteUrl: site.url };
    expect(analyticsEnabled(on)).toBe(true);
    expect(analyticsEnabled({ ...on, id: '' })).toBe(false);
    expect(analyticsEnabled({ ...on, launched: false })).toBe(false);
    expect(analyticsEnabled({ ...on, hostname: 'localhost' })).toBe(false);
    expect(analyticsEnabled({ ...on, hostname: 'goodbiz-hygiene.vercel.app' })).toBe(false);
  });
});

describe('parameter allow-list: no personal data reaches Google', () => {
  it('keeps the allowed parameters of each event', () => {
    expect(sanitizeParams('generate_lead', { lead_source: 'enquiry_form', product: 'dish-wash-liquid', language: 'fr' })).toEqual({ lead_source: 'enquiry_form', product: 'dish-wash-liquid', language: 'fr' });
    expect(sanitizeParams('enquiry_step', { step: 'quantity', language: 'ar' })).toEqual({ step: 'quantity', language: 'ar' });
    expect(sanitizeParams('enquiry_sent', { group: 'kitchen-care', product: 'dish-wash-bar', terms: 'FOB', language: 'en' })).toEqual({ group: 'kitchen-care', product: 'dish-wash-bar', terms: 'FOB', language: 'en' });
    expect(sanitizeParams('enquiry_fallback', { reason: 'timeout' })).toEqual({ reason: 'timeout' });
    expect(sanitizeParams('contact_click', { method: 'whatsapp', location: 'fab' })).toEqual({ method: 'whatsapp', location: 'fab' });
    expect(sanitizeParams('quote_start', { product: 'labsa' })).toEqual({ product: 'labsa' });
    expect(sanitizeParams('language_change', { to: 'zh' })).toEqual({ to: 'zh' });
  });
  it('drops parameters that are not on the list (names, emails, phones, notes, the lead id)', () => {
    const out = sanitizeParams('generate_lead', {
      lead_source: 'enquiry_form',
      name: 'Ali Hassan',
      email: 'ali@example.ae',
      phone: '+971 50 123 4567',
      company: 'Hassan Trading',
      notes: 'call me',
      leadId: '0b6d1c0e-1111-4222-8333-944445555666',
    });
    expect(out).toEqual({ lead_source: 'enquiry_form' });
  });
  it('drops values that are not a known key or a plain slug', () => {
    expect(sanitizeParams('quote_start', { product: 'ali@example.ae' })).toEqual({});
    expect(sanitizeParams('quote_start', { product: '1×20ft dish wash, lemon' })).toEqual({});
    expect(sanitizeParams('quote_start', { product: 'Dish-Wash' })).toEqual({});
    expect(sanitizeParams('quote_start', { product: 'a'.repeat(65) })).toEqual({});
    expect(sanitizeParams('quote_start', { product: 42 })).toEqual({});
    expect(sanitizeParams('enquiry_step', { step: 'contact' })).toEqual({});
    expect(sanitizeParams('enquiry_sent', { terms: 'DDP' })).toEqual({});
    expect(sanitizeParams('enquiry_fallback', { reason: 'Network error at 10:00' })).toEqual({});
    expect(sanitizeParams('contact_click', { method: 'sms', location: 'nav' })).toEqual({});
    expect(sanitizeParams('language_change', { to: 'xx' })).toEqual({});
    expect(sanitizeParams('generate_lead', { lead_source: 'form', language: 'english' })).toEqual({});
  });
  it('refuses events that are not on the list', () => {
    expect(sanitizeParams('page_view_custom', {})).toBeNull();
    expect(sanitizeParams('constructor', {})).toBeNull();
    expect(sanitizeParams('__proto__', {})).toBeNull();
  });
});

describe('contact links', () => {
  it('names the method of wa.me, mailto: and tel: links', () => {
    expect(contactMethod('https://wa.me/918884799369?text=Hello')).toBe('whatsapp');
    expect(contactMethod('mailto:hygiene@goodbizglobal.com?subject=x')).toBe('email');
    expect(contactMethod('tel:+918884799369')).toBe('phone');
    expect(contactMethod('MAILTO:x@y.z')).toBe('email');
    for (const h of ['/contact/', 'https://www.goodbizhygiene.com/', 'https://example.com/wa.me/1', '', 'javascript:alert(1)']) expect(contactMethod(h), h).toBeNull();
  });
});

describe('where the site asks first (src/lib/consent-regions.ts)', () => {
  it('asks in Europe and in the countries of the other languages, by time zone', () => {
    for (const tz of ['Europe/Berlin', 'Europe/London', 'Europe/Istanbul', 'Europe/Moscow', 'Atlantic/Canary', 'Asia/Nicosia', 'Asia/Riyadh', 'Asia/Dubai', 'Africa/Cairo', 'Africa/Casablanca', 'Africa/Dakar', 'America/Toronto', 'America/Mexico_City', 'America/Sao_Paulo', 'America/Buenos_Aires', 'America/Argentina/Buenos_Aires', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Almaty', 'Asia/Jakarta', 'Africa/Nairobi', 'Africa/Dar_es_Salaam', 'Africa/Kampala', 'Asia/Saigon', 'Asia/Ho_Chi_Minh', 'Indian/Reunion']) {
      expect(asksFirst(tz), tz).toBe(true);
    }
  });
  it('runs by default elsewhere: India, the USA, Australia, …', () => {
    for (const tz of ['Asia/Calcutta', 'Asia/Kolkata', 'America/New_York', 'America/Los_Angeles', 'Australia/Sydney', 'Asia/Tokyo', 'Africa/Lagos', 'Asia/Karachi', 'Asia/Dhaka']) {
      expect(asksFirst(tz), tz).toBe(false);
    }
  });
  it('asks when the browser gives no time zone', () => {
    expect(asksFirst(undefined)).toBe(true);
    expect(asksFirst('')).toBe(true);
  });
  it('lists plain ISO country codes, each once; the generated time zones cover every country language', () => {
    expect(CONSENT_COUNTRIES.every((c) => /^[A-Z]{2}$/.test(c))).toBe(true);
    expect(new Set(CONSENT_COUNTRIES).size).toBe(CONSENT_COUNTRIES.length);
    expect(CONSENT_COUNTRIES).not.toContain('IN');
    expect(CONSENT_COUNTRIES).not.toContain('US');
    for (const c of ['DE', 'GB', 'CH', 'TR', 'SA', 'AE', 'BR', 'KE', 'VN', 'CN', 'ID', 'RU', 'CA']) expect(CONSENT_COUNTRIES, c).toContain(c);
    expect(Object.keys(CONSENT_COUNTRIES_BY_REASON).sort()).toEqual(['ar', 'de', 'es', 'europe', 'fr', 'id', 'pt', 'ru', 'sw', 'tr', 'vi', 'zh']);
    expect(CONSENT_TIMEZONES.some((z) => z.startsWith('Europe/'))).toBe(false);
  });
  it('the choice in effect: the visitor’s own first, else granted only where the site does not ask first', () => {
    expect(effectiveChoice('denied', false)).toBe('denied');
    expect(effectiveChoice('granted', true)).toBe('granted');
    expect(effectiveChoice(null, true)).toBeNull();
    expect(effectiveChoice(null, false)).toBe('granted');
  });
  it('by default, Google still keeps analytics storage denied for every ask-first country (by address)', () => {
    const [region, rest] = consentDefaults(true);
    expect(region).toEqual({ ...CONSENT_DEFAULTS, analytics_storage: 'denied', region: [...CONSENT_COUNTRIES] });
    expect(rest).toEqual(CONSENT_DEFAULTS);
    expect(consentDefaults(false)).toEqual([CONSENT_DEFAULTS]);
  });
});

describe('Google tag settings', () => {
  it('denies every advertising purpose, and grants analytics storage after Accept', () => {
    expect(CONSENT_DEFAULTS).toEqual({ ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
  });
  it('sends page views, with Google signals and ad personalisation off', () => {
    expect(GTAG_CONFIG).toEqual({ send_page_view: true, allow_google_signals: false, allow_ad_personalization_signals: false });
  });
  it('loads gtag.js for the id', () => {
    expect(gtagSrc('G-FWEG9Y5FVS')).toBe('https://www.googletagmanager.com/gtag/js?id=G-FWEG9Y5FVS');
    expect(gtagSrc('G-A&B')).toBe('https://www.googletagmanager.com/gtag/js?id=G-A%26B');
  });
});

describe('tracker', () => {
  const setup = (o: { enabled?: boolean; consent?: 'granted' | 'denied' | null } = {}) => {
    const gtag = vi.fn();
    let consent: 'granted' | 'denied' | null = o.consent === undefined ? 'granted' : o.consent;
    const tracker = createTracker({ enabled: () => o.enabled ?? true, consent: () => consent, gtag: () => gtag });
    return { gtag, tracker, set: (c: typeof consent) => (consent = c) };
  };
  it('sends the event with clean parameters on the real host with consent (fake host check)', () => {
    const hostname = LIVE;
    const gtag = vi.fn();
    const tracker = createTracker({
      enabled: () => analyticsEnabled({ id: site.analytics.ga4, launched: true, hostname, siteUrl: site.url }),
      consent: () => 'granted',
      gtag: () => gtag,
    });
    expect(tracker.track('contact_click', { method: 'email', location: 'footer', email: 'ali@example.ae' })).toBe(true);
    expect(gtag).toHaveBeenCalledWith('event', 'contact_click', { method: 'email', location: 'footer' });
  });
  it('is a no-op on any other host, even with consent', () => {
    for (const hostname of ['localhost', 'goodbiz-hygiene.vercel.app']) {
      const gtag = vi.fn();
      const tracker = createTracker({ enabled: () => analyticsEnabled({ id: site.analytics.ga4, launched: true, hostname, siteUrl: site.url }), consent: () => 'granted', gtag: () => gtag });
      expect(tracker.track('quote_start', { product: 'labsa' })).toBe(false);
      expect(gtag).not.toHaveBeenCalled();
    }
  });
  it('is a no-op before a choice and after Reject', () => {
    for (const consent of [null, 'denied'] as const) {
      const { gtag, tracker } = setup({ consent });
      expect(tracker.track('quote_start', {})).toBe(false);
      expect(gtag).not.toHaveBeenCalled();
    }
  });
  it('stops at once when consent is withdrawn', () => {
    const { gtag, tracker, set } = setup();
    tracker.track('language_change', { to: 'de' });
    set('denied');
    tracker.track('language_change', { to: 'fr' });
    expect(gtag).toHaveBeenCalledTimes(1);
  });
  it('is a no-op while gtag is missing, and never throws', () => {
    const tracker = createTracker({ enabled: () => true, consent: () => 'granted', gtag: () => undefined });
    expect(tracker.track('quote_start', {})).toBe(false);
    const throwing = createTracker({
      enabled: () => true,
      consent: () => 'granted',
      gtag: () => () => {
        throw new Error('blocked');
      },
    });
    expect(() => throwing.track('quote_start', {})).not.toThrow();
  });
  it('refuses unknown events', () => {
    const { gtag, tracker } = setup();
    expect(tracker.track('purchase', { value: 1 })).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });
});

describe('withdrawal: the _ga cookies are deleted on our domain', () => {
  it('finds every _ga cookie in document.cookie', () => {
    expect(gaCookieNames('_ga=GA1.1.123.456; gb=1; _ga_FWEG9Y5FVS=GS1.1.789; _gid=GA1.2.3; other_ga=1')).toEqual(['_ga', '_ga_FWEG9Y5FVS']);
    expect(gaCookieNames('')).toEqual([]);
  });
  it('expires each one on the host and on every parent domain', () => {
    const lines = expireCookies(['_ga', '_ga_FWEG9Y5FVS'], LIVE);
    for (const name of ['_ga', '_ga_FWEG9Y5FVS']) {
      expect(lines).toContain(`${name}=; Max-Age=0; path=/`);
      expect(lines).toContain(`${name}=; Max-Age=0; path=/; domain=www.goodbizhygiene.com`);
      expect(lines).toContain(`${name}=; Max-Age=0; path=/; domain=.goodbizhygiene.com`);
    }
    expect(lines.some((l) => /domain=\.?com$/.test(l))).toBe(false); // never a bare top-level domain
    expect(expireCookies(['_ga'], 'localhost')).toEqual(['_ga=; Max-Age=0; path=/']);
  });
});

describe('gtag.js loads only on the consent path', () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((f) => {
      const full = join(dir, f);
      return statSync(full).isDirectory() ? walk(full) : [full];
    });
  it('googletagmanager.com appears only in gtagSrc (src/lib/analytics.ts)', () => {
    const hits = walk(join(process.cwd(), 'src')).filter((f) => /googletagmanager/.test(readFileSync(f, 'utf8')));
    expect(hits.map((f) => f.slice(process.cwd().length + 1))).toEqual(['src/lib/analytics.ts']);
  });
  it('gtagSrc is used only by loadGtag in src/scripts/analytics.ts, which runs only when consent is granted (by Accept or by default)', () => {
    const users = walk(join(process.cwd(), 'src')).filter((f) => !f.endsWith('src/lib/analytics.ts') && /\bgtagSrc\b/.test(readFileSync(f, 'utf8')));
    expect(users.map((f) => f.slice(process.cwd().length + 1))).toEqual(['src/scripts/analytics.ts']);
    const src = readFileSync(join(process.cwd(), 'src/scripts/analytics.ts'), 'utf8');
    expect(src.match(/\bgtagSrc\(/g)?.length).toBe(1);
    const body = src.slice(src.indexOf('function loadGtag'));
    expect(body.slice(0, body.indexOf('\n}\n'))).toContain('gtagSrc(');
    // every call of loadGtag sits behind a granted choice
    const calls = [...src.matchAll(/^.*\bloadGtag\(.*$/gm)].map((m) => m[0]).filter((l) => !/function loadGtag/.test(l));
    expect(calls.length).toBeGreaterThan(0);
    for (const c of calls) expect(c, c).toMatch(/=== 'granted'/);
  });
});

describe('enquiry form events', () => {
  it('generate_lead: the form, the first ?product= slug if any, the language', () => {
    expect(leadParams({ products: ['dish-wash-liquid', 'floor-cleaner'], lang: 'fr' })).toEqual({ lead_source: 'enquiry_form', product: 'dish-wash-liquid', language: 'fr' });
    expect(leadParams({ products: [], lang: 'en' })).toEqual({ lead_source: 'enquiry_form', language: 'en' });
  });
  it('enquiry_step: only the later steps, never the contact step or the summary', () => {
    for (const step of ['group', 'product', 'quantity', 'destination', 'terms'] as const) expect(stepEvent(step, 'ar')).toEqual({ step, language: 'ar' });
    expect(stepEvent('contact', 'ar')).toBeNull();
    expect(stepEvent('send', 'ar')).toBeNull();
  });
  it('enquiry_sent: range and product keys, never free text', () => {
    const groupOf = (slug: string) => ({ 'dish-wash-bar': 'kitchen-care' })[slug];
    expect(enquirySentParams({ group: 'kitchen-care', products: ['dish-wash-bar'], terms: 'FOB', productOther: '' }, groupOf, 'en')).toEqual({ group: 'kitchen-care', product: 'dish-wash-bar', terms: 'FOB', language: 'en' });
    // opened from a product link: the range comes from the product
    expect(enquirySentParams({ products: ['dish-wash-bar'], terms: undefined }, groupOf, 'de')).toEqual({ group: 'kitchen-care', product: 'dish-wash-bar', language: 'de' });
    // "something else": the range key only, not what the buyer typed
    const other = enquirySentParams({ group: 'other', products: [], productOther: 'Sanitiser gel for Ali Hassan', terms: 'not-sure' }, groupOf, 'en');
    expect(other).toEqual({ group: 'other', terms: 'not-sure', language: 'en' });
    expect(JSON.stringify(other)).not.toContain('Sanitiser');
  });
  it('enquiry_fallback: why the WhatsApp / email panel took over', () => {
    expect(fallbackReason(false, 'failed')).toBe('no_endpoint');
    expect(fallbackReason(true, 'timeout')).toBe('timeout');
    expect(fallbackReason(true, 'failed')).toBe('error');
  });
});

describe('page URLs sent to Google carry no free text', () => {
  const BASE = 'https://www.goodbizhygiene.com';
  it('drops ?message=, ?variety= and anything unknown, and the hash', () => {
    expect(cleanUrl(`${BASE}/contact/?message=Call%20Ali%20on%20%2B971501234567%20ali%40example.ae&variety=lemon&x=1#enquiry`)).toBe(`${BASE}/contact/`);
    expect(cleanUrl(`${BASE}/fr/contact/?message=ali@example.ae`)).toBe(`${BASE}/fr/contact/`);
  });
  it('keeps product slugs and campaign tags (utm_*, gclid)', () => {
    expect(cleanUrl(`${BASE}/contact/?product=labsa,sles&message=hi&utm_source=indiamart&utm_medium=listing&utm_campaign=profile&utm_term=labsa&utm_content=logo&gclid=abc123`)).toBe(
      `${BASE}/contact/?product=labsa%2Csles&utm_source=indiamart&utm_medium=listing&utm_campaign=profile&utm_term=labsa&utm_content=logo&gclid=abc123`,
    );
  });
  it('drops a product value that is not a list of slugs', () => {
    expect(cleanUrl(`${BASE}/contact/?product=ali@example.ae`)).toBe(`${BASE}/contact/`);
    expect(cleanUrl(`${BASE}/contact/?product=Call me`)).toBe(`${BASE}/contact/`);
  });
  it('returns nothing for something that is not a URL', () => {
    expect(cleanUrl('not a url')).toBe('');
  });
  it('the config sends the cleaned page; a same-site referrer cleaned the same way, another site as its origin only', () => {
    const c = pageConfig({ href: `${BASE}/contact/?message=ali%40example.ae&product=labsa`, referrer: `${BASE}/contact/?message=%2B971501234567` });
    expect(c).toEqual({ ...GTAG_CONFIG, page_location: `${BASE}/contact/?product=labsa`, page_referrer: `${BASE}/contact/` });
    expect(JSON.stringify(c)).not.toMatch(/message=|%40|@|971/);
    expect(pageConfig({ href: `${BASE}/`, referrer: 'https://www.google.com/search?q=ali+hassan+phone' }).page_referrer).toBe('https://www.google.com/');
    expect(pageConfig({ href: `${BASE}/`, referrer: '' })).not.toHaveProperty('page_referrer');
  });
  it('events cannot carry a URL: page_location and other URL parameters are not on any allow-list', () => {
    for (const ev of ['generate_lead', 'enquiry_step', 'enquiry_sent', 'enquiry_fallback', 'contact_click', 'quote_start', 'language_change'])
      expect(sanitizeParams(ev, { page_location: `${BASE}/contact/?message=x`, page_referrer: 'x', link_url: 'https://wa.me/1?text=Ali' }), ev).toEqual({});
  });
  it('the Google tag is configured only through pageConfig (never the raw URL)', () => {
    const src = readFileSync(join(process.cwd(), 'src/scripts/analytics.ts'), 'utf8');
    const calls = src.split('\n').filter((l) => l.includes("gtag('config'")).map((l) => l.trim());
    expect(calls).toEqual(["w.gtag('config', id, pageConfig({ href: location.href, referrer: document.referrer }));"]);
    expect(src).not.toMatch(/page_location|location\.search/);
  });
});
