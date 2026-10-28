/**
 * The owner's real contact details and business facts (spec 2026-10-28 §2), and how the
 * Organization structured data and llms.txt carry them.
 */
import { describe, it, expect } from 'vitest';
import site from '../../src/config/site';
import { organizationJsonLd, telephoneE164 } from '../../src/lib/seo';
import { LOCALES } from '../../src/i18n/locales';
import { blockingProblems, placeholderProblems } from '../../scripts/placeholder-rules.mjs';

describe('contact details (site.ts)', () => {
  it('are the owner’s real details', () => {
    expect(site.contact).toEqual({
      email: 'hygiene@goodbizglobal.com',
      phone: '+91 88847 99369',
      whatsapp: '918884799369',
      address: 'Bengaluru, Karnataka, India',
    });
    expect(site.contactIsPlaceholder).toBe(false);
  });

  it('facts: city, region and the parent company website', () => {
    expect(site.facts.city).toBe('Bengaluru');
    expect(site.facts.region).toBe('Karnataka');
    expect(site.facts.parentUrl).toBe('https://goodbizglobal.com');
  });

  it('is launched on the real domain', () => {
    expect(site.launchReady).toBe(true);
    expect(site.url).toBe('https://www.goodbizhygiene.com');
  });

  it('has no placeholder that blocks launch', () => {
    const problems = placeholderProblems({ contactIsPlaceholder: site.contactIsPlaceholder, whatsapp: site.contact.whatsapp, endpoint: site.enquiry.endpoint, tokenHits: [] });
    expect(blockingProblems(problems)).toEqual([]);
  });
});

describe('telephoneE164', () => {
  it('keeps the plus and the digits only', () => {
    expect(telephoneE164('+91 88847 99369')).toBe('+918884799369');
    expect(telephoneE164('+254 700-000 001')).toBe('+254700000001');
  });
});

describe('Organization structured data', () => {
  const o: any = organizationJsonLd();
  it('has the email, the E.164 telephone and the postal address (city, state, country)', () => {
    expect(o.email).toBe('hygiene@goodbizglobal.com');
    expect(o.telephone).toBe('+918884799369');
    expect(o.address).toEqual({ '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressRegion: 'Karnataka', addressCountry: 'IN' });
  });
  it('names the parent organization with its website', () => {
    expect(o.parentOrganization).toEqual({ '@type': 'Organization', name: 'GoodBiz Global', url: 'https://goodbizglobal.com' });
  });
  it('has a sales contact point in the 12 site languages', () => {
    expect(o.contactPoint).toMatchObject({ '@type': 'ContactPoint', contactType: 'sales', email: 'hygiene@goodbizglobal.com', telephone: '+918884799369' });
    expect(o.contactPoint.availableLanguage).toEqual(LOCALES.map((l) => l.english));
    expect(o.contactPoint.availableLanguage).toHaveLength(12);
  });
});
