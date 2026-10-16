import { describe, it, expect } from 'vitest';
import { enquiryText, buildWhatsAppUrl, buildMailtoUrl, fieldsFromEntries } from '../../src/lib/enquiry';

const f = { name: 'Ali', country: 'UAE', products: ['Dish Wash Liquid', 'Floor Cleaner'], privateLabel: true };

describe('enquiry', () => {
  it('enquiryText formats non-empty fields', () => {
    expect(enquiryText(f)).toBe('Name: Ali\nCountry: UAE\nProducts: Dish Wash Liquid, Floor Cleaner\nPrivate label: Yes');
  });
  it('skips empty and whitespace fields', () => {
    expect(enquiryText({ name: '', message: '  ' })).toBe('');
  });
  it('whatsapp url', () => {
    expect(buildWhatsAppUrl('910000000000', f)).toBe('https://wa.me/910000000000?text=' + encodeURIComponent(enquiryText(f)));
  });
  it('mailto url', () => {
    const u = buildMailtoUrl('a@b.com', f);
    expect(u).toMatch(/^mailto:a@b\.com\?subject=Export%20Enquiry%20-%20GoodBiz%20Hygiene&body=/);
    expect(u.endsWith(encodeURIComponent(enquiryText(f)))).toBe(true);
  });
  it('omits an empty products array and renders privateLabel false as No', () => {
    expect(enquiryText({ products: [], privateLabel: false, quantity: '1 x 20ft' })).toBe('Quantity: 1 x 20ft\nPrivate label: No');
  });
});

describe('fieldsFromEntries (enquiry form)', () => {
  it('maps the form field names onto EnquiryFields, collecting every product', () => {
    const entries: [string, string][] = [
      ['Name', ' Ali '],
      ['Company', 'Gulf Trading'],
      ['Country', 'UAE'],
      ['Email', 'ali@example.com'],
      ['Phone', '+971 50 000 0000'],
      ['Products', 'Dish Wash Liquid / Gel'],
      ['Products', 'Floor Cleaner'],
      ['Quantity', '1 x 20ft container'],
      ['Private label', 'Yes'],
      ['Message', 'Lemon fragrance'],
    ];
    expect(fieldsFromEntries(entries)).toEqual({
      name: 'Ali',
      company: 'Gulf Trading',
      country: 'UAE',
      email: 'ali@example.com',
      phone: '+971 50 000 0000',
      products: ['Dish Wash Liquid / Gel', 'Floor Cleaner'],
      quantity: '1 x 20ft container',
      privateLabel: true,
      message: 'Lemon fragrance',
    });
  });
  it('leaves privateLabel undefined when not answered and reads No as false', () => {
    expect(fieldsFromEntries([['Name', 'A']]).privateLabel).toBeUndefined();
    expect(fieldsFromEntries([['Private label', 'No']]).privateLabel).toBe(false);
  });
  it('returns an empty products array when none are chosen, and ignores unknown names', () => {
    const f = fieldsFromEntries([['Other', 'x']]);
    expect(f.products).toEqual([]);
    expect(f).not.toHaveProperty('Other');
  });
});
