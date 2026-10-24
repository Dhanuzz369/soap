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
  /**
   * Other official profiles of GoodBiz Hygiene (LinkedIn, IndiaMART, TradeIndia, Alibaba…), as full
   * https:// URLs. They go into the Organization structured data (`sameAs`) so search engines and
   * AI answers connect them to this site. Only add profiles you own. Empty = nothing is emitted.
   */
  profiles: [] as string[],
  /**
   * Search-engine ownership checks. Paste only the `content` value of the <meta> tag each tool
   * gives you (Google Search Console, Bing Webmaster Tools, Yandex Webmaster). Empty = no tag.
   */
  verification: {
    google: '',
    bing: '',
    yandex: '',
  },
  /**
   * IndexNow key (Bing, Yandex, Seznam, Naver): `npm run indexnow` sends it with the page list, and
   * public/<key>.txt proves the site is yours. Any 8–128 hex characters; change both together.
   */
  indexNowKey: '1ea134f5e8470b6f56bd1766bc62c1b1',
};

export default site;
