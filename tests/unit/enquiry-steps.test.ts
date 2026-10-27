import { describe, it, expect } from 'vitest';
import {
  STEP_IDS,
  QUANTITY_KEYS,
  isValidEmail,
  phoneDigits,
  validateStep,
  visibleSteps,
  buildPayload,
  safeCell,
  toEnquiryFields,
} from '../../src/lib/enquiry-steps';
import { enquiryText } from '../../src/lib/enquiry';

const names: Record<string, string> = {
  'dish-wash-liquid': 'Dish Wash Liquid',
  'floor-cleaner': 'Floor Cleaner',
  'kitchen-care': 'Kitchen Care',
};
const english = (slug: string) => names[slug] ?? slug;

describe('step model', () => {
  it('has the seven steps in order', () => {
    expect(STEP_IDS).toEqual(['contact', 'group', 'product', 'quantity', 'destination', 'terms', 'send']);
    expect(QUANTITY_KEYS).toEqual(['trial', '1', '2-5', '6+']);
  });
});

describe('contact validation', () => {
  it('accepts a name plus a phone with 7 digits', () => {
    expect(validateStep('contact', { name: 'A', phone: '+91 98 7654' })).toEqual([]);
  });
  it('asks for email or phone when the phone has under 7 digits', () => {
    expect(validateStep('contact', { name: 'A', phone: '12-345' })).toEqual([{ field: 'email', code: 'contact' }]);
  });
  it('requires a name', () => {
    expect(validateStep('contact', { email: 'a@b.co' })).toEqual([{ field: 'name', code: 'required' }]);
  });
  it('treats a whitespace name as missing', () => {
    expect(validateStep('contact', { name: '  ', email: 'a@b.co' })).toEqual([{ field: 'name', code: 'required' }]);
  });
  it('flags a mistyped email', () => {
    expect(validateStep('contact', { name: 'A', email: 'a@b' })).toEqual([{ field: 'email', code: 'email' }]);
  });
  it('checks emails', () => {
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('a@b.co')).toBe(true);
    expect(isValidEmail(' ali@example.ae ')).toBe(true);
    expect(isValidEmail('a b@c.de')).toBe(false);
  });
  it('counts phone digits after stripping spaces, +, -, ( and )', () => {
    expect(phoneDigits('+91 (98) 76-5')).toBe(7);
    expect(phoneDigits('')).toBe(0);
    expect(phoneDigits('abc123')).toBe(0);
  });
});

describe('choice steps', () => {
  it('needs a group', () => {
    expect(validateStep('group', {})).toEqual([{ field: 'group', code: 'choose' }]);
  });
  it('needs text for "something else"', () => {
    expect(validateStep('group', { group: 'other', productOther: '' })).toEqual([{ field: 'productOther', code: 'required' }]);
    expect(validateStep('group', { group: 'other', productOther: 'Sanitiser gel' })).toEqual([]);
  });
  it('needs a product, quantity, country and terms', () => {
    expect(validateStep('product', {})).toEqual([{ field: 'products', code: 'choose' }]);
    expect(validateStep('product', { products: ['not-sure'] })).toEqual([]);
    expect(validateStep('quantity', {})).toEqual([{ field: 'quantity', code: 'choose' }]);
    expect(validateStep('quantity', { quantity: 'other' })).toEqual([{ field: 'quantityOther', code: 'required' }]);
    expect(validateStep('quantity', { quantity: '2-5' })).toEqual([]);
    expect(validateStep('destination', { port: 'Jebel Ali' })).toEqual([{ field: 'country', code: 'required' }]);
    expect(validateStep('destination', { country: 'Kenya' })).toEqual([]);
    expect(validateStep('terms', {})).toEqual([{ field: 'terms', code: 'choose' }]);
    expect(validateStep('send', {})).toEqual([]);
  });
});

describe('visibleSteps', () => {
  it('skips the product step after "something else"', () => {
    expect(visibleSteps({ group: 'other' }, { products: false })).not.toContain('product');
    expect(visibleSteps({ group: 'other' }, { products: false })).toHaveLength(6);
  });
  it('skips group and product when products are prefilled', () => {
    const s = visibleSteps({}, { products: true });
    expect(s).not.toContain('group');
    expect(s).not.toContain('product');
    expect(s).toEqual(['contact', 'quantity', 'destination', 'terms', 'send']);
  });
  it('shows all seven otherwise', () => {
    expect(visibleSteps({ group: 'kitchen-care' }, { products: false })).toEqual([...STEP_IDS]);
  });
});

describe('buildPayload', () => {
  const now = new Date('2026-10-27T10:00:00Z');
  const p = buildPayload({
    leadId: 'L1',
    stage: 'product',
    lang: 'fr',
    page: '/fr/contact/',
    now,
    english,
    languageName: 'Français',
    answers: { name: 'Ali', email: '', group: 'kitchen-care', products: ['dish-wash-liquid', 'floor-cleaner'], quantity: '2-5', terms: 'not-sure', privateLabel: 'Maybe' },
  });
  it('carries the lead, stage, language and an ISO time', () => {
    expect(p).toMatchObject({ leadId: 'L1', stage: 'product', lang: 'fr', page: '/fr/contact/', ts: '2026-10-27T10:00:00.000Z' });
  });
  it('maps slugs to English', () => {
    expect(p.fields.product).toBe('Dish Wash Liquid, Floor Cleaner');
    expect(p.fields.group).toBe('Kitchen Care');
    expect(p.fields.quantity).toBe('2–5 containers');
    expect(p.fields.terms).toBe('Not sure, advise me');
    expect(p.fields.privateLabel).toBe('Maybe');
    expect(p.fields.language).toBe('Français');
  });
  it('sends every answer of the steps reached so far, empty ones too, so a changed answer clears its cell', () => {
    expect(p.fields.email).toBe('');
    expect(p.fields.company).toBe('');
    expect(p.fields.productOther).toBe('');
    // later steps are not reached yet: only their non-empty answers travel
    expect('country' in p.fields).toBe(false);
    expect('notes' in p.fields).toBe(false);
    expect(p.fields.quantity).toBe('2–5 containers');
  });
  it('clears the counterpart when "other" is picked', () => {
    const g = buildPayload({ leadId: 'L', stage: 'group', lang: 'en', page: '/contact/', now, english, languageName: 'English', answers: { group: 'other', productOther: 'Gel', products: [] } });
    expect(g.fields).toMatchObject({ group: 'Something else', productOther: 'Gel', product: '' });
    const q = buildPayload({ leadId: 'L', stage: 'quantity', lang: 'en', page: '/contact/', now, english, languageName: 'English', answers: { quantity: 'other', quantityOther: '3 pallets' } });
    expect(q.fields).toMatchObject({ quantity: '', quantityOther: '3 pallets' });
  });
  it('sends all keys on the final send', () => {
    const f = buildPayload({ leadId: 'L', stage: 'submitted', lang: 'en', page: '/contact/', now, english, languageName: 'English', answers: { name: 'A' } }).fields;
    for (const k of ['name', 'company', 'email', 'phone', 'group', 'productOther', 'product', 'variety', 'quantity', 'quantityOther', 'country', 'countryCode', 'port', 'terms', 'privateLabel', 'notes']) expect(f[k], k).toBe(k === 'name' ? 'A' : '');
  });
  it('never reads a slug from the prototype', () => {
    const q = buildPayload({ leadId: 'L', stage: 'product', lang: 'en', page: '/', now, english: (s) => s, languageName: 'English', answers: { products: ['constructor', 'toString'], quantity: 'constructor', terms: 'valueOf' as never } });
    expect(q.fields.product).toBe('constructor, toString');
    expect(q.fields.quantity).toBe('constructor');
  });
  it('writes the special product choices in English', () => {
    const q = buildPayload({ leadId: 'L', stage: 'submitted', lang: 'en', page: '/contact/', now, english, languageName: 'English', answers: { products: ['several'], group: 'other', productOther: 'Gel' } });
    expect(q.fields.product).toBe('Several from this range (mixed container)');
    expect(q.fields.group).toBe('Something else');
    expect(q.fields.productOther).toBe('Gel');
  });
});

describe('safeCell', () => {
  it('prefixes values a spreadsheet would run as formulas', () => {
    expect(safeCell('=SUM(A1)')).toBe("'=SUM(A1)");
    for (const c of ['+', '-', '@', '\t', '\r']) expect(safeCell(`${c}x`)).toBe(`'${c}x`);
  });
  it('leaves plain text alone', () => {
    expect(safeCell('Lemon')).toBe('Lemon');
    expect(safeCell('')).toBe('');
  });
});

describe('toEnquiryFields', () => {
  it('feeds the WhatsApp and email text with English values', () => {
    const f = toEnquiryFields(
      { name: 'Ali', phone: '+971 50 1234567', country: 'United Arab Emirates', countryCode: 'AE', port: 'Jebel Ali', products: ['dish-wash-liquid'], quantity: 'other', quantityOther: '3 pallets', terms: 'CIF', privateLabel: 'Yes', notes: 'Lemon, 500 ml' },
      english,
      'English',
    );
    const t = enquiryText(f);
    expect(t).toContain('Name: Ali');
    expect(t).toContain('Country: United Arab Emirates (AE)');
    expect(t).toContain('Products: Dish Wash Liquid');
    expect(t).toContain('Quantity: 3 pallets');
    expect(t).toContain('Private label: Yes');
    expect(t).toContain('Port or city: Jebel Ali');
    expect(t).toContain('Terms: CIF');
    expect(t).toContain('Lemon, 500 ml');
    expect(t).toContain('Language: English');
  });
  it('uses the free-text product for "something else"', () => {
    expect(toEnquiryFields({ group: 'other', productOther: 'Toilet tablets' }, english, 'English').products).toEqual(['Toilet tablets']);
  });
});
