import { describe, it, expect } from 'vitest';
import { enquiryText, buildWhatsAppUrl, buildMailtoUrl } from '../../src/lib/enquiry';

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
});
