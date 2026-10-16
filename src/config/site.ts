const site = {
  name: 'GoodBiz Hygiene',
  tagline: 'Soaps & home-care products, exported from India',
  parentName: 'GoodBiz Global' as const,
  url: 'https://www.goodbizhygiene.com',
  launchReady: false,
  contactIsPlaceholder: true,
  contact: {
    email: 'PLACEHOLDER@goodbizhygiene.com',
    phone: '+91 PLACEHOLDER',
    whatsapp: '910000000000',
    address: 'PLACEHOLDER, India',
  },
  exportTerms: {
    incoterms: 'FOB, CIF and CFR available; payment terms agreed per order (T/T or LC)',
    payment: 'Agreed per order (T/T or LC)',
    port: 'Shipped from major Indian ports',
    leadTime: 'Typically 3–5 weeks after order confirmation, depending on private-label requirements',
  },
  facts: {} as {
    city?: string;
    iec?: string;
    founded?: string;
    parentUrl?: string;
    agroUrl?: string;
  },
};

export default site;
