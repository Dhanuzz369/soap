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
} as const;

type TextKey = Exclude<keyof EnquiryFields, 'products' | 'privateLabel'>;
const TEXT_KEYS: TextKey[] = ['name', 'company', 'country', 'email', 'phone', 'quantity', 'message'];

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
 * - `message`: text to prefill the message box (the home "Request a quote" card sends it).
 * Slugs are kept only if they look like slugs; the message is trimmed, has control characters
 * (other than line breaks) removed, and is capped at MAX_URL_MESSAGE characters.
 */
export function parseEnquiryParams(search: string): { products: string[]; message: string } {
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
  return { products, message };
}
