import { describe, it, expect } from 'vitest';
import { parseEnquiryParams, MAX_URL_MESSAGE } from '../../src/lib/enquiry';

describe('parseEnquiryParams', () => {
  it('returns nothing for an empty query', () => {
    expect(parseEnquiryParams('')).toEqual({ products: [], message: '' });
  });
  it('reads products, comma-separated and repeated, without duplicates', () => {
    expect(parseEnquiryParams('?product=dish-wash-liquid,floor-cleaner&product=sles&product=floor-cleaner').products).toEqual([
      'dish-wash-liquid',
      'floor-cleaner',
      'sles',
    ]);
  });
  it('drops values that are not slugs', () => {
    expect(parseEnquiryParams('?product=<script>,,%20,Dish-Wash-Liquid').products).toEqual(['dish-wash-liquid']);
  });
  it('decodes the message the home quote card sends (GET form encoding)', () => {
    expect(parseEnquiryParams('?message=1%C3%9720ft+dish+wash%2C+lemon%2C+500+ml').message).toBe('1×20ft dish wash, lemon, 500 ml');
  });
  it('trims the message and strips control characters but keeps line breaks', () => {
    expect(parseEnquiryParams('?message=%20%20Hello%00%07%0Aworld%20').message).toBe('Hello\nworld');
  });
  it('caps a long message', () => {
    const long = 'a'.repeat(MAX_URL_MESSAGE + 50);
    expect(parseEnquiryParams(`?message=${long}`).message).toHaveLength(MAX_URL_MESSAGE);
  });
  it('reads products and message together', () => {
    expect(parseEnquiryParams('?product=labsa&message=Bulk+drums')).toEqual({ products: ['labsa'], message: 'Bulk drums' });
  });
});
