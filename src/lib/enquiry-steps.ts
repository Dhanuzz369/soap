/**
 * The step-by-step enquiry form's pure logic (spec 2026-10-27): the steps, what each one needs,
 * which steps a buyer sees, and the payload sent to the Google Sheet. No DOM here, so it is
 * unit-tested (tests/unit/enquiry-steps.test.ts) and shared by StepEnquiry.astro and the
 * controller in src/scripts/step-enquiry.ts.
 *
 * Values sent to GoodBiz are English; the labels a buyer sees come from `ui.steps`.
 */
import type { EnquiryFields } from './enquiry';

export type StepId = 'contact' | 'group' | 'product' | 'quantity' | 'destination' | 'terms' | 'send';
export const STEP_IDS: readonly StepId[] = ['contact', 'group', 'product', 'quantity', 'destination', 'terms', 'send'];

export type Terms = 'not-sure' | 'FOB' | 'CFR' | 'CIF';
export type PrivateLabel = 'Yes' | 'No' | 'Maybe';

export type Answers = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  /** Category slug, or 'other'. */
  group?: string;
  /** The buyer's own words when group is 'other'. */
  productOther?: string;
  /** Product slugs, or ['several'] / ['not-sure']. */
  products?: string[];
  /** A QUANTITY_KEYS value, or 'other'. */
  quantity?: string;
  quantityOther?: string;
  country?: string;
  countryCode?: string;
  port?: string;
  terms?: Terms;
  privateLabel?: PrivateLabel;
  notes?: string;
  variety?: string;
  source?: string;
};

export const QUANTITY_KEYS = ['trial', '1', '2-5', '6+'] as const;
export const TERMS_KEYS: readonly Terms[] = ['not-sure', 'FOB', 'CFR', 'CIF'];
export const BRAND_KEYS: readonly PrivateLabel[] = ['Yes', 'No', 'Maybe'];

/** What GoodBiz reads for each choice (English, whatever the page language). */
export const ENGLISH = {
  quantity: { trial: 'Samples / trial order', '1': '1 container', '2-5': '2–5 containers', '6+': '6+ containers' } as Record<string, string>,
  terms: { 'not-sure': 'Not sure, advise me', FOB: 'FOB', CFR: 'CFR', CIF: 'CIF' } as Record<string, string>,
  product: { several: 'Several from this range (mixed container)', 'not-sure': 'Not sure yet' } as Record<string, string>,
  groupOther: 'Something else',
} as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function isValidEmail(s: string): boolean {
  return EMAIL.test((s ?? '').trim());
}

/** Digits in a phone number once spaces, +, -, ( and ) are removed; any other character makes it 0. */
export function phoneDigits(s: string): number {
  const stripped = (s ?? '').replace(/[\s+\-()]/g, '');
  return /^\d+$/.test(stripped) ? stripped.length : 0;
}

export type FieldError = { field: keyof Answers; code: 'required' | 'contact' | 'email' | 'choose' };

const blank = (v?: string) => !v || !v.trim();

/** The errors for one step (empty when the buyer may go on). Only the current step is checked. */
export function validateStep(step: StepId, a: Answers): FieldError[] {
  switch (step) {
    case 'contact': {
      if (blank(a.name)) return [{ field: 'name', code: 'required' }];
      const email = (a.email ?? '').trim();
      if (email && !isValidEmail(email)) return [{ field: 'email', code: 'email' }];
      if (!email && phoneDigits(a.phone ?? '') < 7) return [{ field: 'email', code: 'contact' }];
      return [];
    }
    case 'group':
      if (blank(a.group)) return [{ field: 'group', code: 'choose' }];
      if (a.group === 'other' && blank(a.productOther)) return [{ field: 'productOther', code: 'required' }];
      return [];
    case 'product':
      return a.products?.length ? [] : [{ field: 'products', code: 'choose' }];
    case 'quantity':
      if (blank(a.quantity)) return [{ field: 'quantity', code: 'choose' }];
      if (a.quantity === 'other' && blank(a.quantityOther)) return [{ field: 'quantityOther', code: 'required' }];
      return [];
    case 'destination':
      return blank(a.country) ? [{ field: 'country', code: 'required' }] : [];
    case 'terms':
      return a.terms ? [] : [{ field: 'terms', code: 'choose' }];
    default:
      return [];
  }
}

/** The steps this buyer will see, in order. */
export function visibleSteps(a: Answers, prefilled: { products: boolean }): StepId[] {
  return STEP_IDS.filter((s) => {
    if (prefilled.products && (s === 'group' || s === 'product')) return false;
    if (s === 'product' && a.group === 'other') return false;
    return true;
  });
}

/** A spreadsheet runs a cell that starts with = + - @, a tab or a CR as a formula: quote it. */
export function safeCell(v: string): string {
  return /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
}

/** A lookup that never reaches Object.prototype (a slug such as "constructor" comes from the URL). */
export function own(map: Record<string, string>, key: string | undefined): string | undefined {
  return key !== undefined && Object.hasOwn(map, key) ? map[key] : undefined;
}

const productNames = (a: Answers, english: (slug: string) => string) =>
  (a.products ?? []).map((p) => own(ENGLISH.product, p) ?? english(p));

/** The sheet columns each step answers. A send carries every key of the steps reached so far. */
export const STEP_KEYS: Record<StepId, readonly string[]> = {
  contact: ['name', 'company', 'email', 'phone'],
  group: ['group', 'productOther', 'product'], // a new range (or "something else") clears the product
  product: ['product', 'variety'],
  quantity: ['quantity', 'quantityOther'],
  destination: ['country', 'countryCode', 'port'],
  terms: ['terms'],
  send: ['privateLabel', 'notes'],
};

/** The answers as English values, keyed by the sheet's column names (empty strings included). */
function allFields(a: Answers, english: (slug: string) => string, languageName: string): Record<string, string> {
  const raw: Record<string, string | undefined> = {
    name: a.name,
    company: a.company,
    email: a.email,
    phone: a.phone,
    group: a.group === 'other' ? ENGLISH.groupOther : a.group ? english(a.group) : undefined,
    product: productNames(a, english).join(', '),
    productOther: a.productOther,
    quantity: a.quantity === 'other' ? undefined : a.quantity ? (own(ENGLISH.quantity, a.quantity) ?? a.quantity) : undefined,
    quantityOther: a.quantityOther,
    country: a.country,
    countryCode: a.countryCode,
    port: a.port,
    terms: a.terms ? (own(ENGLISH.terms, a.terms) ?? a.terms) : undefined,
    privateLabel: a.privateLabel,
    notes: a.notes,
    variety: a.variety,
    source: a.source,
    language: languageName,
  };
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) out[k] = v?.trim() ?? '';
  return out;
}

/** Only the non-empty answers. */
function englishFields(a: Answers, english: (slug: string) => string, languageName: string): Record<string, string> {
  return Object.fromEntries(Object.entries(allFields(a, english, languageName)).filter(([, v]) => v));
}

export type Payload = {
  leadId: string;
  stage: StepId | 'submitted';
  lang: string;
  page: string;
  ts: string;
  fields: Record<string, string>;
};

/**
 * Every key of the steps up to `stage` (empty strings included, so a changed answer clears its
 * cell in the sheet), plus any other non-empty answer. 'submitted' carries every key.
 */
function payloadFields(stage: Payload['stage'], a: Answers, english: (slug: string) => string, languageName: string) {
  const all = allFields(a, english, languageName);
  const upTo = stage === 'submitted' ? STEP_IDS.length - 1 : STEP_IDS.indexOf(stage);
  const keys = new Set(STEP_IDS.slice(0, upTo + 1).flatMap((s) => STEP_KEYS[s]));
  return Object.fromEntries(Object.entries(all).filter(([k, v]) => v || keys.has(k)));
}

export function buildPayload(o: {
  leadId: string;
  stage: Payload['stage'];
  lang: string;
  page: string;
  now: Date;
  answers: Answers;
  english: (slug: string) => string;
  languageName: string;
}): Payload {
  return {
    leadId: o.leadId,
    stage: o.stage,
    lang: o.lang,
    page: o.page,
    ts: o.now.toISOString(),
    fields: payloadFields(o.stage, o.answers, o.english, o.languageName),
  };
}

/** The answers in the shape the WhatsApp and email fallback text (enquiryText) reads. */
export function toEnquiryFields(a: Answers, english: (slug: string) => string, languageName: string): EnquiryFields {
  const f = englishFields(a, english, languageName);
  const products = a.group === 'other' && f.productOther ? [f.productOther] : productNames(a, english);
  const extra = [
    f.port && `Port or city: ${f.port}`,
    f.terms && `Terms: ${f.terms}`,
    f.privateLabel === 'Maybe' && 'Private label: Maybe',
    f.variety && `Variety: ${f.variety}`,
    f.notes,
  ].filter(Boolean);
  return {
    name: f.name,
    company: f.company,
    country: f.country && f.countryCode ? `${f.country} (${f.countryCode})` : f.country,
    email: f.email,
    phone: f.phone,
    products,
    quantity: a.quantity === 'other' ? f.quantityOther : f.quantity,
    privateLabel: f.privateLabel === 'Yes' ? true : f.privateLabel === 'No' ? false : undefined,
    message: extra.join('\n'),
    language: f.language,
  };
}
