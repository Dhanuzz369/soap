export type EnquiryFields = {
  name?: string;
  company?: string;
  country?: string;
  email?: string;
  phone?: string;
  products?: string[];
  quantity?: string;
  privateLabel?: boolean;
  message?: string;
  /** The buyer's site language as its native name ("Français"). Field labels stay English. */
  language?: string;
};

const SUBJECT = 'Export Enquiry - GoodBiz Hygiene';

export function enquiryText(f: EnquiryFields): string {
  const lines: string[] = [];
  const add = (label: string, value?: string) => {
    const v = value?.trim();
    if (v) lines.push(`${label}: ${v}`);
  };
  add('Name', f.name);
  add('Company', f.company);
  add('Country', f.country);
  add('Email', f.email);
  add('Phone', f.phone);
  add('Products', f.products?.map((p) => p.trim()).filter(Boolean).join(', '));
  add('Quantity', f.quantity);
  if (f.privateLabel !== undefined) add('Private label', f.privateLabel ? 'Yes' : 'No');
  add('Message', f.message);
  add('Language', f.language);
  return lines.join('\n');
}

export function buildWhatsAppUrl(number: string, f: EnquiryFields): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(enquiryText(f))}`;
}

export function buildMailtoUrl(email: string, f: EnquiryFields): string {
  return `mailto:${email}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(enquiryText(f))}`;
}

/**
 * The enquiry form's field names. They double as the labels in the native
 * mailto (enctype="text/plain") body, so they are written for people.
 */
export const FORM_FIELDS = {
  name: 'Name',
  company: 'Company',
  country: 'Country',
  email: 'Email',
  phone: 'Phone',
  products: 'Products',
  quantity: 'Quantity',
  privateLabel: 'Private label',
  message: 'Message',
  language: 'Language',
} as const;

/**
 * The quantity choices as sent to GoodBiz (always English). The form shows the translated labels
 * from the UI dictionary (`form.quantities`, same order).
 */
export const QUANTITY_VALUES = [
  'Samples or a trial quantity',
  'Part of a mixed container',
  '1 x 20ft container',
  '1 x 40ft container',
  'Several containers or regular supply',
  'Not sure yet',
] as const;

type TextKey = Exclude<keyof EnquiryFields, 'products' | 'privateLabel'>;
const TEXT_KEYS: TextKey[] = ['name', 'company', 'country', 'email', 'phone', 'quantity', 'message', 'language'];

/** Reads form entries (e.g. `new FormData(form)`) into EnquiryFields. */
export function fieldsFromEntries(entries: Iterable<[string, FormDataEntryValue | string]>): EnquiryFields {
  const f: EnquiryFields = { products: [] };
  for (const [key, raw] of entries) {
    if (typeof raw !== 'string') continue;
    const value = raw.trim();
    if (key === FORM_FIELDS.products) {
      if (value) f.products!.push(value);
    } else if (key === FORM_FIELDS.privateLabel) {
      if (value === 'Yes') f.privateLabel = true;
      else if (value === 'No') f.privateLabel = false;
    } else {
      const k = TEXT_KEYS.find((t) => FORM_FIELDS[t] === key);
      if (k) f[k] = value;
    }
  }
  return f;
}

/** The longest message accepted from the URL (the home quote card caps its input at 500). */
export const MAX_URL_MESSAGE = 1000;

/**
 * Reads what other pages pass to the contact form in the query string:
 * - `product`: product slugs to tick, comma-separated or repeated (`?product=a,b&product=c`);
 * - `message`: text to prefill the message box (the home "Request a quote" card sends it);
 * - `variety`: one product variety ("Green apple" or "green-apple"), returned slug-shaped.
 * Slugs are kept only if they look like slugs; the message is trimmed, has control characters
 * (other than line breaks) removed, and is capped at MAX_URL_MESSAGE characters. A variety made of
 * anything other than letters, digits, spaces and hyphens (or over 60 characters) is dropped.
 * Whether the variety belongs to the product is checked by the form, which knows the variants.
 */
export function parseEnquiryParams(search: string): { products: string[]; message: string; variety: string } {
  const params = new URLSearchParams(search);
  const products = [
    ...new Set(
      params
        .getAll('product')
        .flatMap((v) => v.split(','))
        .map((s) => s.trim().toLowerCase())
        .filter((s) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)),
    ),
  ];
  const message = (params.get('message') ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, MAX_URL_MESSAGE);
  const rawVariety = (params.get('variety') ?? '').trim();
  const variety = /^[\p{L}\p{N} _-]{1,60}$/u.test(rawVariety) ? slugify(rawVariety) : '';
  return { products, message, variety };
}

/** "Green apple" → "green-apple": lower case, accents dropped, anything else becomes one hyphen. */
export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * A link to the contact page that prefills it: the writing side of parseEnquiryParams.
 * `contact` is the (localized) contact path; empty values are left out.
 */
export function enquiryHref(contact: string, { message, products = [] }: { message?: string; products?: string[] }): string {
  const params = new URLSearchParams();
  if (products.length) params.set('product', products.join(','));
  const m = message?.trim().slice(0, MAX_URL_MESSAGE);
  if (m) params.set('message', m);
  const q = params.toString();
  return q ? `${contact}?${q}` : contact;
}
