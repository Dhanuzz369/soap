/**
 * English UI strings: the SOURCE OF TRUTH for every other src/i18n/ui/<lang>.ts file.
 *
 * Rules (see docs/i18n-translator-guide.md):
 * - Every other language file has the same shape. Any key it leaves out falls back to English,
 *   and `npm run i18n:check` lists it.
 * - `{name}`-style placeholders are filled in by the templates. Keep every placeholder that
 *   appears in the English string (you may move it within the sentence). Common ones:
 *   {n} a number, {name} a product/category name as written, {nameLower} the same name in
 *   lower case (use {name} instead if your language capitalises nouns), {port} {leadTime}
 *   {incoterms} the export terms below, {parent} "GoodBiz Global", {year}.
 * - Arrays (steps, FAQs, promises…) must keep the same number of items, in the same order.
 * - `terms` repeats src/config/site.ts exportTerms. English reads them from site.ts so they are
 *   always identical (tests/unit/export-terms.test.ts relies on this).
 */
import site from '../../config/site.ts';

const en = {
  meta: {
    tagline: site.tagline,
  },

  /**
   * Search metadata. `entity` is how the company is described to search engines and AI answers
   * (Organization structured data, llms.txt): keep the facts exactly (merchant exporter, sources
   * from vetted Indian manufacturers, does not manufacture).
   *
   * `keywords`: the <meta name="keywords"> list of each page type (Bing, Yandex, Baidu and Naver may
   * read it; Google ignores it). Write the phrases buyers in your language actually type into a
   * search box, not word-for-word translations. {name}/{nameLower} is the product or range name,
   * {kw} the product's main search term (its `keyword` field), {hsn} its HSN code (e.g. 3402 50),
   * {hsn4} the 4-digit heading (3402). `productMarkets` names markets where your language is
   * spoken. A page never shows more than 12. See docs/seo-keywords.md.
   */
  seo: {
    entity:
      'GoodBiz Hygiene, a GoodBiz Global company, is a merchant exporter of soaps and home-care products from India. It sources from vetted Indian manufacturers and does not manufacture.',
    keywords: {
      home: [
        'soap exporter India',
        'detergent supplier India',
        'home care products exporter India',
        'cleaning products manufacturers India',
        'private label soap and detergent',
        'wholesale soap and detergent',
        'HSN 3401 3402 exporter',
      ],
      products: [
        'soap and detergent products India',
        'cleaning products wholesale India',
        'home care products catalogue',
        'bulk soap and detergent export',
        'HSN code list soaps detergents',
      ],
      category: [
        '{nameLower} exporter India',
        '{nameLower} supplier India',
        '{nameLower} manufacturers India',
        'wholesale {nameLower}',
        'private label {nameLower}',
        'HSN {hsn}',
      ],
      product: [
        '{kw} exporter India',
        '{kw} supplier India',
        '{kw} manufacturers India',
        'bulk {kw}',
        'wholesale {kw}',
        '{kw} HSN code {hsn}',
        '{kw} for import',
      ],
      /** Added for products offered under private label. */
      productPrivateLabel: ['private label {kw}', 'OEM {kw}'],
      /** Two markets where buyers of your language are: "{kw} supplier <country or region>". */
      productMarkets: ['{kw} supplier UAE', '{kw} supplier Africa'],
      privateLabel: [
        'private label soap manufacturer India',
        'private label cleaning products',
        'OEM detergent India',
        'own brand soap supplier',
        'white label home care products',
      ],
      exportProcess: [
        'import soap from India',
        'export documents soaps detergents',
        'FOB CIF CFR India',
        'COA MSDS certificate of origin',
        'container shipping from India',
      ],
      about: ['GoodBiz Hygiene', 'GoodBiz Global', 'merchant exporter India', 'soap and detergent exporter India'],
      faq: ['soap import FAQ', 'MOQ soaps detergents India', 'HSN code soap detergent', 'export lead time India'],
      contact: ['soap price quote India', 'detergent quotation', 'GoodBiz Hygiene contact', 'home care products enquiry'],
      blog: ['soap import guide', 'detergent buying guide', 'cleaning products import India', 'HSN 3401 vs 3402'],
      post: ['import from India', 'buyer guide'],
      /** The HoReCa page: what hotel, restaurant and café buyers type (purchasing, chefs, housekeeping). */
      horeca: [
        'hotel amenities supplier',
        'HoReCa cleaning products wholesale',
        'hotel housekeeping chemicals supplier',
        'bulk kitchen cleaning products for restaurants',
        'guest soap supplier India',
        'hotel soap private label',
        'restaurant dish wash liquid 20 L',
        'hotel laundry detergent bulk',
        'café cleaning supplies wholesale',
        'hospitality cleaning products India',
      ],
    },
  },

  /**
   * The "Quick facts" box (home and about pages): six short, self-contained facts that search
   * engines and AI assistants can quote. Incoterms, ports and lead time come from `terms`.
   */
  quickFacts: {
    heading: 'Quick facts',
    what: 'What we export',
    whatValue:
      'Soaps, detergents, dish wash, surface cleaners and soap raw materials, sourced from vetted Indian manufacturers. GoodBiz Hygiene is a merchant exporter and does not manufacture.',
    hsn: 'HSN codes',
    hsnValue: '3401 (soaps) and 3402 (detergents and cleaning preparations); the 8-digit code is confirmed per order',
    terms: 'Incoterms and payment',
    port: 'Ports',
    moq: 'Minimum order',
    moqValue: 'No fixed minimum: trial orders, part loads and mixed containers are quoted, and private label is available on most products',
    lead: 'Lead time',
  },

  /** The export terms (src/config/site.ts). Translate the meaning exactly; keep FOB, CIF, CFR, T/T, LC. */
  terms: {
    incoterms: site.exportTerms.incoterms,
    payment: site.exportTerms.payment,
    port: site.exportTerms.port,
    leadTime: site.exportTerms.leadTime,
  },

  common: {
    skip: 'Skip to content',
    home: 'Home',
    products: 'Products',
    blog: 'Blog',
    breadcrumb: 'Breadcrumb',
    requestQuote: 'Request a Quote',
    viewProducts: 'View Products',
    /** The italic second line of product and category titles, and the end of most <title>s. */
    exporterLine: 'Exporter & Supplier from India',
    hsn: 'HSN',
    hsnTitle: 'Harmonized System of Nomenclature',
    allProducts: 'All products',
    allGuides: 'All guides',
    productsCount: '{n} products',
    minRead: '{n} min read',
    readFaq: 'Read the FAQ',
    straightAnswers: 'Straight answers.',
    buyerFaq: 'Buyer FAQ',
    faqDefault: 'Questions buyers ask',
    exportProcessFull: 'The export process in full',
    /** Alt text for a studio render of one product. */
    renderAlt: 'Illustration of {nameLower} in a typical export pack',
    /** Alt text for a pack drawing (no render available). */
    drawingAlt: 'Illustration of {nameLower}',
    /** Alt text for a real product or category photo. */
    photoAlt: '{name}, exported from India by GoodBiz Hygiene',
    categoryRenderAlt: 'Illustration of typical {nameLower} packs',
    rangeAlt: 'Illustration of the GoodBiz Hygiene range in typical export packs',
    portAlt: 'Gantry cranes loading a container ship at night at the International Container Transshipment Terminal in Kochi, India',
    portCaption: 'Container terminal, Kochi. Photo: {creator}, {license}.',
    specCaption: 'Typical specifications. Final values are confirmed per order.',
  },

  header: {
    homeAria: '{name}, home',
    menu: 'Menu',
    mainNav: 'Main',
    mainNavMobile: 'Main (mobile)',
    nav: {
      products: 'Products',
      privateLabel: 'Private Label',
      exportProcess: 'Export Process',
      guides: 'Buyer Guides',
      /** The HoReCa page (/horeca/): the shortest natural name for hotels, restaurants and cafés. Keep it short: the desktop menu must fit at 1280px. */
      horeca: 'Hotels & Restaurants',
      about: 'About',
      faq: 'FAQ',
    },
  },

  footer: {
    tag: 'Clean, from India',
    lede: 'Soaps and home-care products, sourced from vetted Indian manufacturers and exported by GoodBiz Hygiene, a {parent} company.',
    nav: 'Footer',
    products: 'Products',
    company: 'Company',
    contact: 'Contact',
    whatsapp: 'WhatsApp',
    legal: '© {year} {name}, a {parent} company. Merchant exporter from India.',
    backToTop: 'Back to top',
  },

  /** The "Registered exporter" strip: no registration numbers, ever. */
  registrations: {
    heading: "Registered exporter",
    aria: "Our export registrations",
    aboutText: "GoodBiz Hygiene is registered with India’s export authorities and councils listed below; registration details are available to buyers on request.",
    opens: "{name} (opens official website)",
    /** llms.txt: {list} is each body with its status line, e.g. "FIEO (Member exporter)". */
    llmsLine: 'Registered with: {list}',
    status: {
      fieo: "Member exporter",
      msme: "Udyam registered",
      chemexcil: "RCMC holder",
      dgft: "IEC registered exporter",
    },
  },

  /** The language menu (bottom corner of every page). */
  lang: {
    label: 'Language',
    menuAria: 'Choose a language. Current language: {name}',
    more: 'More languages…',
    moreTitle: 'Opens this page in Google Translate (machine translation)',
  },

  whatsapp: {
    aria: 'Chat with GoodBiz Hygiene on WhatsApp',
    label: 'WhatsApp',
  },

  cards: {
    addToEnquiry: 'Add to enquiry',
    addAria: 'Add to enquiry: {name}',
    noteH: 'Mix it in one container.',
    noteText: 'Combine these with products from other ranges in one 20ft or 40ft container. We confirm the mix when we quote.',
  },

  quote: {
    heading: 'Request a quote.',
    text: 'Tell us what you need in one line. The enquiry form opens with it written in, ready for your products, quantity and port.',
    placeholder: 'e.g. 1×20ft dish wash, lemon, 500 ml',
    label: 'What do you need?',
    submit: 'Start enquiry',
  },

  /** Names used in the Product JSON-LD (structured data for search engines). */
  ld: {
    hsnCode: 'HSN Code',
    variants: 'Variants',
    packSizes: 'Pack sizes',
  },

  home: {
    title: 'Soap, Detergent & Cleaner Exporter & Supplier from India',
    description:
      'GoodBiz Hygiene exports soaps, detergents and home-care products from vetted Indian manufacturers: bulk or private label, mixed containers, FOB/CIF quotes.',
    eyebrow: 'Soaps · Detergents · Home care',
    h1a: 'Soap & Home Care',
    h1b: 'Exported from India.',
    text: 'GoodBiz Hygiene is a merchant exporter: we source soaps, detergents and cleaners from vetted Indian manufacturers, with private label and mixed containers.',
    rangeH: 'The Range.',
    rangeIntro: 'Three of {n} products. Each has its own page with typical specifications, pack sizes and private-label options.',
    rangeAll: 'View all {n} products',
    processL1: 'How export',
    processL2: 'orders work.',
    processIntro:
      'One merchant exporter between you and the manufacturer: the quote, the samples, the paperwork and the shipment, from the first message to the bill of lading.',
    /** {port} and {leadTime} are the export terms above. */
    steps: [
      {
        name: 'Specification and samples',
        text: 'Send the products, pack sizes, quantity and destination port. We quote prices per pack with typical specifications and lead times, and arrange samples for your approval.',
      },
      {
        name: 'Sourcing and private label',
        text: 'We match your brief to a vetted Indian manufacturer. For private label, your artwork, fragrance and pack choices are approved before bulk production.',
      },
      {
        name: 'Documents and shipping',
        text: 'The manufacturer produces and packs the order while we prepare the invoice, packing list, certificate of origin, COA and MSDS. {port}. {leadTime}.',
      },
    ],
    catsH: 'The Categories.',
    catsText: 'Five ranges under HSN 3401 and 3402. Mix them in one 20ft or 40ft container.',
    tileMeta: '{n} products · HSN {hsn}',
    answersMore: 'More answers on the FAQ page',
    statementA: 'Sourced with care,',
    statementB: 'shipped with confidence.',
    statementLead:
      'Every GoodBiz Hygiene order is matched to a vetted Indian manufacturer, checked against the sample you approved and shipped with complete export paperwork. This is how we work on every order, whatever its size.',
    promises: [
      { title: 'Vetted makers only', text: 'Each product comes from an Indian manufacturer we have checked for quality, consistency and export experience.' },
      { title: 'Your sample, matched', text: 'The formula, fragrance and pack you approve is the one that ships, checked against your sample before loading.' },
      { title: 'Paperwork done right', text: 'Invoice, packing list, certificate of origin, COA and MSDS prepared for every shipment, ready for your customs broker.' },
      { title: 'One partner, port to port', text: 'One quotation and one point of contact from first sample to the bill of lading, across every product you order.' },
    ],
    guidesH: 'Buyer guides',
    /** The photo fan in the hero: the range buttons' group label, each button's label ({name}: the range), the caption link and each card's link label. */
    fanTabs: 'Choose a range',
    fanShow: 'Show {name}',
    fanView: 'View range',
    fanOpen: '{name}: view the range',
  },

  productsIndex: {
    title: 'Soap, Detergent & Cleaning Products for Export from India',
    description:
      '{n} soaps, detergents, cleaners and raw materials from vetted Indian manufacturers, each with HSN code, pack sizes and private label. Mixed containers.',
    hsnLink: 'HSN codes by product',
    rangeFull: 'The range in full',
    hsnH: 'Which HSN code applies to each product?',
    hsnText:
      'Codes are shown at 6 digits. The 8-digit ITC-HS code is confirmed per order, and a few products have alternative classifications (see each product page).',
    hsnCaption: 'HSN overview by product, grouped by range',
    colProduct: 'Product',
    colRange: 'Range',
    colHsn: 'HSN (6 digits)',
    /** The products-page hero ("the shelf"): the h1 lines, the lead ({n} products, {r} ranges) and labels. */
    h1a: 'Every product,',
    h1b: 'one export partner.',
    shelfLead: '{n} products in {r} ranges, under HSN 3401 and 3402, with private label and mixed containers.',
    shelfAria: 'Product shelf',
    jumpNav: 'Jump to range',
    shelfPause: 'Pause the shelf',
  },

  product: {
    hsnAlt: 'Alternative classification noted below',
    hsnConfirmed: '8-digit ITC-HS code confirmed per order',
    factsH: 'Key facts for buyers',
    hsnCode: 'HSN code',
    hsnNoteDefault: 'The 8-digit ITC-HS code is confirmed per order.',
    moq: 'Minimum order quantity',
    privateLabel: 'Private label',
    plAvailable: 'Available.',
    plNot: 'Not offered for this product.',
    varH: 'Varieties, pack sizes and packaging',
    variants: 'Available varieties',
    variantsAria: 'Varieties',
    packSizes: 'Pack sizes',
    packaging: 'Packaging options',
    galleryH: 'More fragrances, in photos',
    specH: 'What are the typical specifications of {nameLower}?',
    specNote: '{name}: typical values for export grades. Final values are confirmed with the manufacturer per order.',
    aboutAria: 'About {name}',
    loadH: 'Container loading (approx.)',
    loadText: 'Approximate figures; the final loading plan is confirmed per order.',
    ft20: '20 ft container',
    ft40: '40 ft container',
    guidesH: 'Buyer guides for this product',
    relatedH: 'Related products',
    relatedAll: 'All {nameLower}',
    quoteH: 'Quote this product.',
    quoteText: 'Tell us the {nameLower} variety, pack size, quantity and destination port in one line. The enquiry form opens with it written in.',
  },

  category: {
    /** The <title> of a category page. */
    title: '{name} Exporter & Supplier from India',
    hsnMeta: '{n} products · 8-digit ITC-HS code confirmed per order',
    seeProducts: 'See the {n} products',
    productsH: 'Which {nameLower} products do we supply?',
    quoteH: 'Quote {nameLower}.',
  },

  blogIndex: {
    title: 'Import Guides: Soaps & Cleaning Products from India',
    description:
      'Practical guides for importers of soaps, detergents and home-care products from India: HSN codes, MOQ, documents, private label and shipping.',
    l1: 'Buyer guides.',
    l2: 'For importing soaps & home care.',
    lead: 'Plain-English notes for importers and distributors: classification, costs, documents and choosing products.',
    latest: 'Latest articles',
  },

  post: {
    meta: '{date} · {minutes} · GoodBiz Hygiene',
    quickAnswers: 'Quick answers',
    relatedH: 'Products mentioned in this guide',
    quoteH: 'Planning an order?',
    quoteText: 'Tell us what you need in one line. The enquiry form opens with it written in, ready for your products, quantity and port.',
  },

  contact: {
    title: 'Request a Quote: Soaps & Detergents from India',
    description:
      'Request a quote from GoodBiz Hygiene for soaps, detergents and home-care products from India. Send your products, pack sizes and port by email or WhatsApp.',
    l1: 'Request a quote.',
    l2: 'From India, to your port.',
    lead: 'Tell us what you need: the products, pack sizes, quantity and destination port. GoodBiz Hygiene replies with prices, typical specifications and lead times.',
    start: 'Start the enquiry',
    waMessage: 'Message us on WhatsApp',
    formH: 'Enquiry form',
    asideAria: 'Other ways to reach us',
    email: 'Email',
    whatsapp: 'WhatsApp',
    phone: 'Phone',
    office: 'Office',
    terms: 'Export terms',
    oftenH: 'Often quoted together',
    oftenText: 'Tap “Add to enquiry” on a card to tick that product in the form above.',
  },

  /** The enquiry form. The message sent to GoodBiz always uses English field names. */
  form: {
    name: 'Your name',
    company: 'Company',
    country: 'Country',
    email: 'Email',
    phone: 'WhatsApp or phone',
    phoneHint: '(with country code)',
    quantity: 'Quantity',
    choose: 'Choose one',
    /** Same order as QUANTITY_VALUES in src/lib/enquiry.ts (the English values sent to GoodBiz). */
    quantities: [
      'Samples or a trial quantity',
      'Part of a mixed container',
      '1 x 20ft container',
      '1 x 40ft container',
      'Several containers or regular supply',
      'Not sure yet',
    ],
    productsLegend: 'Products of interest',
    chooseAny: '(choose any)',
    plLegend: 'Do you need private label?',
    plYes: 'Yes, under my brand',
    plNo: 'No',
    message: 'Message',
    messageHint: '(pack sizes, fragrances, destination port)',
    submit: 'Send enquiry',
    hint: 'This opens your email app with the enquiry filled in. Prefer WhatsApp?',
    hintLink: 'Message us on WhatsApp',
    hintJs: 'Next, choose to send it by WhatsApp or by email.',
    sendH: 'Your enquiry is ready. How would you like to send it?',
    sendWa: 'Send via WhatsApp',
    sendEmail: 'Send via Email',
    sendNote: 'Each opens your own app with the message written out, so you can check it before sending.',
  },

  about: {
    title: 'About GoodBiz Hygiene: Soap & Detergent Exporter, India',
    description:
      'GoodBiz Hygiene, a GoodBiz Global company, is a merchant exporter of soaps and home-care products from India, sourced from vetted Indian manufacturers.',
    l1: 'GoodBiz Hygiene.',
    l2: 'A {parent} company.',
    lead: 'GoodBiz Hygiene is the home-care and hygiene export division of {parent}, a merchant exporter from India, and a sister brand of GoodBiz Agro.',
    whatH: 'What does GoodBiz Hygiene do?',
    what1:
      'GoodBiz Hygiene supplies soaps, detergents and home-care products to importers, distributors, wholesalers, supermarket chains and private-label brands outside India. It does not own a factory. Products are sourced from vetted Indian manufacturers, and GoodBiz Hygiene handles quotation, private-label coordination, export documents and shipping.',
    what2:
      'The range covers products classified under HSN 3401 (soaps) and HSN 3402 (detergents and washing or cleaning preparations), plus closely related items such as herbal phenol, in five ranges.',
    rangesH: 'The five ranges',
    familyH: 'Part of {parent}',
    familyText: '{parent} runs GoodBiz Agro for agricultural exports and GoodBiz Hygiene for soaps and home care.',
    visit: 'Visit',
    basedIn: 'Based in',
    founded: 'Founded',
    iec: 'Importer Exporter Code (IEC)',
  },

  faqPage: {
    title: 'Importer FAQ: Buying Soaps & Detergents from India',
    description:
      'Answers for importers buying soaps, detergents and cleaners from India: sourcing, private label, MOQ, incoterms, documents and lead times.',
    l1: 'Buyer questions.',
    l2: 'Straight answers.',
    lead: 'How GoodBiz Hygiene sources, quotes and ships soaps and home-care products from India. Product-specific questions are answered on each product page.',
    quoteH: 'Still have a question?',
    quoteText: 'Send it with your enquiry in one line. We reply with the details for your products and market.',
  },

  /**
   * Company FAQs (/faq/ shows all three groups; the home page shows six of them, picked by
   * position in src/lib/faqs.ts). Keep the order. {incoterms}, {leadTime}, {port} are filled in.
   */
  faqs: [
    {
      heading: 'Sourcing and products',
      faqs: [
        {
          q: 'Does GoodBiz Hygiene manufacture the products it exports?',
          a: 'No. GoodBiz Hygiene is a merchant exporter from India and a GoodBiz Global company. It sources soaps, detergents and home-care products from vetted Indian manufacturers, then handles quotation, private label coordination, documents and shipping for overseas buyers.',
        },
        {
          q: 'Which products does GoodBiz Hygiene supply?',
          a: 'Five ranges: bath and personal soaps, laundry care, kitchen care, surface and home cleaners, and industrial raw materials such as soap noodles, LABSA and SLES. Each product has its own page with typical specifications, pack sizes and its HSN code.',
        },
        {
          q: 'Which HSN codes apply to soaps and cleaning products?',
          a: 'Soaps fall under HSN 3401 and detergents and washing or cleaning preparations under HSN 3402. The site shows codes at 6 digits, for example 3402 50. The 8-digit ITC-HS code is confirmed per order, and a few products, such as fabric softener and herbal phenol, can be classified differently.',
        },
        {
          q: 'Are the specifications on product pages final?',
          a: 'No. Specifications are typical values for export grades. Final values, such as active matter, TFM or pH, are confirmed with the manufacturer for each order and stated on the quotation.',
        },
      ],
    },
    {
      heading: 'Ordering and private label',
      faqs: [
        {
          q: 'Can I order products under my own brand?',
          a: 'Yes. Private label is available on most products: your label artwork, a choice of fragrance and colour where the formulation allows, and the pack sizes your market needs. There is no fixed minimum order: trial orders, part loads and mixed containers are quoted. A private-label design can carry its own minimum for printed labels or cartons, which depends on the product and pack and is stated on the quotation.',
        },
        {
          q: 'Can I combine different products in one container?',
          a: 'Yes. You can consolidate products from several ranges in one 20ft or 40ft container, which lets you trial a range without filling a container per product. The mix is confirmed against packing and compatibility rules when we quote.',
        },
        {
          q: 'Can I get samples before ordering?',
          a: 'Yes. Samples can be arranged for most products before you confirm an order. Tell us the products and your courier details in your enquiry and we confirm what can be sent.',
        },
        {
          q: 'How do I request a quote?',
          a: 'Use the enquiry form on the contact page, or send a WhatsApp message or email with the products, pack sizes, quantity and destination port. We reply with prices, typical specifications and lead times.',
        },
      ],
    },
    {
      heading: 'Shipping, payment and documents',
      faqs: [
        { q: 'Which incoterms and payment terms do you offer?', a: '{incoterms}.' },
        { q: 'How long does an order take to ship?', a: '{leadTime}. {port}.' },
        {
          q: 'Which export documents come with a shipment?',
          a: 'Shipments normally travel with a commercial invoice, packing list, certificate of origin and bill of lading, plus product documents such as a certificate of analysis (COA) and material safety data sheet (MSDS). The exact set depends on your country and is confirmed per order.',
        },
        {
          q: 'Do you ship to my country?',
          a: 'GoodBiz Hygiene quotes for importers, distributors and private-label brands in most countries. Destination rules, such as labelling language or registration, are checked with you before the order is confirmed.',
        },
      ],
    },
  ],

  exportProcess: {
    title: 'Export Process: Importing Soaps & Detergents from India',
    description:
      'How GoodBiz Hygiene exports soaps, detergents and cleaners from India: quotation, samples, incoterms, payment terms, documents, ports and typical lead times.',
    lead: 'The steps, terms and documents for buying soaps and home-care products from India through GoodBiz Hygiene.',
    /** "The route": the page's hero, a dotted map with sea routes (src/components/RouteHero.astro). */
    route: {
      h1a: 'From India’s ports,',
      h1b: 'to yours.',
      regionsLabel: 'Choose a destination region',
      regions: {
        gulf: 'Gulf & Middle East',
        eastAfrica: 'East Africa',
        westAfrica: 'West Africa',
        europe: 'Europe',
        southeastAsia: 'Southeast Asia',
        latinAmerica: 'Latin America',
      },
      /** Port names as buyers in your language write them. */
      ports: {
        nhavaSheva: 'Nhava Sheva (Mumbai)',
        mundra: 'Mundra',
        chennai: 'Chennai',
        jebelAli: 'Jebel Ali',
        mombasa: 'Mombasa',
        lagos: 'Lagos',
        tema: 'Tema',
        rotterdam: 'Rotterdam',
        singapore: 'Singapore',
        jakarta: 'Jakarta',
        santos: 'Santos',
      },
      /** {from} an Indian port, {to} the destination port. Point the arrow the way your script reads. */
      lane: '{from} → {to}',
      /** The caption before a region is picked, and without JavaScript. */
      laneAll: 'Indian ports → your port',
      /** {leadTime} is filled in from terms.leadTime. Never add transit days or prices. */
      terms: 'FOB, CIF or CFR · {leadTime}',
      illustrative: 'Routes are illustrative.',
      credit: 'Map data: Natural Earth (public domain)',
      mapAlt: 'Map of illustrative sea routes from Nhava Sheva, Mundra and Chennai to ports in six regions',
      pause: 'Pause the route tour',
      timelineAria: 'From order to sailing',
      timeline: ['Order confirmed', 'Production and packing', 'Documents', 'Loading and sailing'],
    },
    stepsLink: 'The six steps',
    termsH: 'What are the export terms?',
    termsIncoterms: 'Incoterms and payment',
    termsPort: 'Port',
    termsLead: 'Lead time',
    processL1: 'What are the steps',
    processL2: 'from enquiry to shipment?',
    processIntro: 'Six steps, with your approval on the quotation, samples and proforma invoice before anything is produced.',
    /** The name of the six steps in structured data (HowTo) for search engines. */
    howToName: 'How to import soaps and home-care products from India through GoodBiz Hygiene',
    /** {incoterms} and {port} are filled in. */
    steps: [
      { name: 'Enquiry', text: 'Send the products, pack sizes, quantity, destination port and any private-label needs, using the enquiry form, email or WhatsApp.' },
      { name: 'Quotation', text: 'We quote prices per pack with typical specifications, the incoterm you need and the lead time. {incoterms}.' },
      { name: 'Samples and approvals', text: 'Product samples and, for private label, artwork proofs are approved before the order is confirmed.' },
      { name: 'Proforma invoice and payment', text: 'A proforma invoice confirms products, quantities, packing, incoterm and payment terms (T/T or LC).' },
      { name: 'Production and packing', text: 'The manufacturer produces and packs the order, marked for export and for your market.' },
      { name: 'Documents and shipping', text: 'We prepare the export documents and book the shipment. {port}.' },
    ],
    docsH: 'Which documents come with a shipment?',
    docsText: 'The exact set depends on your country and is confirmed per order.',
    documents: [
      'Commercial invoice',
      'Packing list',
      'Certificate of origin',
      'Bill of lading (sea freight)',
      'Certificate of analysis (COA)',
      'Material safety data sheet (MSDS)',
    ],
    faqH: 'Export process: questions buyers ask',
    /** {incoterms}, {port} and {leadTime} are filled in. */
    faqs: [
      { q: 'Which incoterms do you offer?', a: '{incoterms}.' },
      { q: 'Which port do shipments leave from?', a: '{port}. The port is chosen by product, manufacturer location and your destination, and stated on the quotation.' },
      { q: 'What is the lead time?', a: '{leadTime}.' },
      {
        q: 'Which documents are included?',
        a: 'Shipments normally travel with commercial invoice, packing list, certificate of origin, bill of lading (sea freight), plus a COA and MSDS where the product needs them. Your country may need more, such as a health certificate or legalised invoice; this is agreed per order.',
      },
      {
        q: 'Which HSN code goes on the invoice?',
        a: 'The site shows HSN codes at 6 digits, for example 3402 50. The 8-digit ITC-HS code is confirmed per order. Fabric softener and herbal phenol can fall under alternative classifications (3809 91 and 3808 94).',
      },
    ],
  },

  privateLabel: {
    title: 'Private Label Soaps & Cleaning Products from India (OEM)',
    description:
      'Private label soaps, detergents and cleaners from India: your artwork, fragrance, colour and pack sizes, made by vetted Indian manufacturers. Mixed containers.',
    lead: 'Sell soaps, detergents and cleaners under your own brand. GoodBiz Hygiene matches your brief to a vetted Indian manufacturer, manages samples and artwork, and ships the finished goods to your port.',
    /** "Your brand, on our shelf": the page's hero with a live label (src/components/LabelHero.astro). */
    hero: {
      h1a: 'Your brand,',
      h1b: 'sourced and shipped from India.',
      cta: 'Start a private-label enquiry',
      /** The brand shown on the drawn packs until the visitor types one (also the field's placeholder). */
      placeholder: 'Your Brand',
      inputLabel: 'Type your brand name',
      colourLegend: 'Label colour',
      colourways: { sage: 'Sage', ocean: 'Ocean', blush: 'Blush' },
      packAlt: 'Illustration of a pump bottle and a folding carton with a blank label showing a brand name',
      caption: 'Illustration of a typical private-label pack.',
      /** Prefilled in the contact form's message. {brand} is the name the visitor typed. */
      message: 'Private-label enquiry: we would like to sell under our brand “{brand}”.',
      messageNoBrand: 'Private-label enquiry: we would like to sell under our own brand.',
      stepsAria: 'A private-label order in four steps',
      steps: ['Brief', 'Artwork proof', 'Sample approved', 'Shipped'],
    },
    optionsH: 'What can be customised?',
    optionsText: 'Four choices make a range your own. Each is approved by you before bulk production.',
    options: [
      {
        title: 'Your brand on the pack',
        text: 'Label, sleeve, carton or wrapper printed with your artwork. We send your files to the manufacturer and return a proof for approval before printing.',
      },
      {
        title: 'Fragrance and colour',
        text: 'Choose from the fragrances and colours each product is typically made in, such as lemon, lavender, rose or neem. Changes outside the standard range are checked with the manufacturer first.',
      },
      {
        title: 'Pack sizes and formats',
        text: 'Retail bottles, refills, pouches, bars and bulk cans or drums, chosen to suit your shelf and your price point. Each product page lists its typical pack sizes.',
      },
      {
        title: 'Grade and specification',
        text: 'Pick the grade your market expects, for example TFM for bath soap or active matter for detergents. Typical values are shown on product pages and the final values are stated on your quotation.',
      },
    ],
    processL1: 'How a private-label',
    processL2: 'order runs.',
    processIntro: 'Five steps from your brief to goods at your port, with your approval on the sample and the artwork before anything is made.',
    /** {port} is filled in. */
    steps: [
      { name: 'Share your brief', text: 'Products, pack sizes, fragrances, target market and an estimate of quantity.' },
      { name: 'Quotation and manufacturer match', text: 'We match the brief to a vetted Indian manufacturer and quote per pack, with incoterms and lead time.' },
      { name: 'Samples and artwork', text: 'You approve a product sample and a printed proof of your artwork. Production normally starts after you approve both.' },
      { name: 'Production and packing', text: 'The manufacturer produces and packs your order under your brand, marked for export.' },
      { name: 'Documents and shipment', text: 'We prepare the export documents and book the shipment. {port}.' },
    ],
    faqH: 'Private label: questions buyers ask',
    /** {leadTime} is filled in. */
    faqs: [
      {
        q: 'What is the minimum order for private label?',
        a: 'It depends on the product and the pack. There is no fixed minimum order for most products, though a private-label design may carry its own minimum for printed labels or cartons. Tell us your quantity and we will quote it.',
      },
      {
        q: 'Who owns the artwork and the brand?',
        a: 'Artwork stays yours; usage terms are agreed per order. GoodBiz Hygiene coordinates printing with the manufacturer.',
      },
      {
        q: 'Can I mix private-label and standard products in one container?',
        a: 'Yes. Private-label lines can share a container with other products from the GoodBiz Hygiene range, subject to packing and compatibility rules confirmed at quotation.',
      },
      {
        q: 'How long does a private-label order take?',
        a: '{leadTime}. A first order includes time to approve samples and artwork; repeat orders are usually quicker.',
      },
      {
        q: 'Does GoodBiz Hygiene manufacture the products?',
        a: 'No. GoodBiz Hygiene is a merchant exporter from India. Products are made by vetted Indian manufacturers and GoodBiz Hygiene manages the brief, approvals, documents and shipping.',
      },
    ],
    quoteH: 'Start your brief.',
    quoteText: 'Send the products, packs and market you have in mind in one line. We reply with options, prices and lead times.',
  },

  /**
   * The HoReCa page (/horeca/): for hotels, restaurants, cafés and caterers, organised by the spaces
   * they run. The promise (`lead`, `promiseH`) is approved by the owner: translate its meaning
   * exactly. Never say the products are better than any brand, never name a brand, and add no
   * numbers, savings, clients, ratings or certifications.
   */
  horeca: {
    title: 'Hotel Amenities & HoReCa Cleaning Supplies from India',
    description:
      'Guest soaps and kitchen, washroom, floor and laundry cleaners for hotels, restaurants and cafés, in bulk packs. Private label, mixed containers, free samples.',
    h1a: 'Every space in your hotel,',
    h1b: 'one supplier.',
    lead: 'Made to the specifications you expect from leading brands, in bulk packs, at a lower cost per use. For purchasing managers, chefs and housekeeping teams at hotels, restaurants, cafés and caterers.',
    ctaHero: 'Build my sample list',
    sampleLink: 'How the free sample works',
    /** The hotel drawing in the hero. */
    stageTitle: 'Cross-section drawing of a hotel with six spaces: guest rooms, kitchen, washrooms, lobby and floors, laundry, and back-of-house',
    stageHint: 'Point at or tap a space to see what it uses.',
    spacesNav: 'Spaces in a hotel',
    /** In the floating card: {n} is the number of products. */
    cardLink: 'See the {n} products',
    spaces: {
      rooms: {
        name: 'Guest rooms & bathrooms',
        short: 'Rooms',
        need: 'Amenities guests notice: wrapped guest soaps with your hotel’s name, shower gel and hand wash in refill packs, and bath bars.',
      },
      kitchen: {
        name: 'Kitchen',
        short: 'Kitchen',
        need: 'Dish wash liquid in cans and drums for busy sinks, dish wash bars for pots and pans, and concentrated degreaser for heavy fat.',
      },
      washrooms: {
        name: 'Washrooms & public areas',
        short: 'Washrooms',
        need: 'Hand wash for refill dispensers, toilet bowl and tile cleaners, glass cleaner for mirrors and antibacterial bar soap.',
      },
      floors: {
        name: 'Floors & housekeeping',
        short: 'Lobby & floors',
        need: 'Floor cleaner and herbal phenol for mopping lobbies and corridors, with multi-surface and glass cleaner for the housekeeping trolley.',
      },
      laundry: {
        name: 'Laundry',
        short: 'Laundry',
        need: 'Detergent powder and liquid for the washing machines, softener for towels and bed linen, and a bar for scrubbing collars and stains.',
      },
      backOfHouse: {
        name: 'Bulk & back-of-house',
        short: 'Back-of-house',
        need: 'Concentrates for the central store: floor cleaner, kitchen degreaser, hand wash and laundry liquid, bought in large packs and decanted on each floor.',
      },
    },
    /** Under the back-of-house products. */
    bulkNote: 'Bulk packs for the store room: 5 L and 20 L cans and 200 L drums.',
    promiseH: 'The specifications you expect, at a lower cost per use.',
    promiseText: 'Five things every HoReCa order gets.',
    promises: [
      { title: 'Catering and housekeeping packs', text: '5 L and 20 L cans, 200 L drums and 25 kg sacks for kitchens, laundries and housekeeping stores.' },
      { title: 'Your hotel’s name on guest amenities', text: 'Private label on guest soaps, shower gel and hand wash: your logo on the wrapper or label.' },
      { title: 'One mixed container', text: 'Products for every department, from rooms to the kitchen and laundry, in one 20 ft or 40 ft container.' },
      { title: 'No fixed minimum order', text: 'Trial orders, part loads and mixed containers are all quoted, and quantities are agreed per order.' },
      { title: 'A free sample to compare', text: 'Test our products against your current brand before you order in bulk.' },
    ],
    listH: 'Tick what each space uses.',
    listText: 'Add products to your list as you go. The button sends the list to our enquiry form, ready for samples and a bulk quote.',
    /** Above each product card's pack chips. */
    packsLabel: 'HoReCa packs',
    add: 'Add to my list',
    addAria: 'Add {name} to my HoReCa list',
    /** The link shown instead of the checkbox without JavaScript. */
    addNoJs: 'Request a sample',
    viewProduct: 'View product',
    panel: {
      title: 'My HoReCa list',
      /** Next to the number of ticked products. */
      count: 'on your list',
      empty: 'Nothing ticked yet. Tick the products you use and we send samples of each.',
      noJs: 'Tell us your products and property type on the enquiry form.',
      typeLabel: 'Property type',
      typeChoose: 'Choose one',
      types: { hotel: 'Hotel', restaurant: 'Restaurant', cafe: 'Café', catering: 'Catering', other: 'Other' },
      cta: 'Request HoReCa samples & a bulk quote',
      clear: 'Clear list',
      remove: 'Remove {name}',
      open: 'Open my list',
      close: 'Close my list',
    },
    /** Prefilled in the contact form's message. {products}: the ticked names; {type}: the property type. */
    message: {
      samples: 'HoReCa enquiry: samples requested for {products}.',
      general: 'HoReCa enquiry: we would like samples and a bulk quote.',
      type: 'Property type: {type}.',
      separator: ', ',
    },
    samplesH: 'Free samples: how it works',
    samplesText: 'Samples are confirmed per enquiry: we reply with what can be sent for your products.',
    /** {leadTime} is filled in from the export terms. Never add other timelines. */
    samplesLead: 'Bulk orders: {leadTime}.',
    samplesSteps: [
      { name: 'Tick your products', text: 'Choose what your rooms, kitchen, washrooms and laundry use, and pick your property type.' },
      { name: 'We send samples', text: 'We confirm which samples can be sent for your enquiry and arrange them with you.' },
      { name: 'Compare, then order in bulk', text: 'Test them against your current brand. When you are happy, order in bulk packs, mixed in one container.' },
    ],
    faqH: 'HoReCa: questions buyers ask',
    /** Keep every answer in line with the product pages and the export terms. */
    faqs: [
      {
        q: 'Can you print our hotel name on guest soaps?',
        a: 'Yes. Guest soaps of 10 g to 40 g can be wrapped in paper or flow wrap printed with your hotel or resort logo, with your choice of wrapper colours and fragrance. Printed wrappers may carry their own minimum, which we quote with your order.',
      },
      {
        q: 'What pack sizes suit kitchens and housekeeping?',
        a: 'Dish wash liquid comes in 5 L and 20 L cans and 200 L drums; floor cleaner, hand wash and surface cleaners in 5 L and 20 L cans; detergent powder in 10 kg and 25 kg sacks; and bulk cleaning chemicals up to 1,000 L IBCs. Each product page lists its full pack range.',
      },
      {
        q: 'Can we mix products from different departments in one shipment?',
        a: 'Yes. Room, kitchen, washroom, floor and laundry products can travel together in one 20 ft or 40 ft container. The mix is confirmed against packing and compatibility rules when we quote.',
      },
      {
        q: 'Is there a minimum order?',
        a: 'There is no fixed minimum. Trial orders, part loads and mixed containers are all quoted, and quantities are agreed per order. Printed guest-soap wrappers may carry their own minimum.',
      },
      {
        q: 'How do samples work?',
        a: 'Tick the products you use on this page and send the enquiry. We confirm which samples can be sent and arrange them, so you can compare them with your current brand before you order in bulk.',
      },
      {
        q: 'Which documents come with each shipment?',
        a: 'A commercial invoice, packing list, certificate of origin and bill of lading, plus a certificate of analysis (COA) and material safety data sheet (MSDS) where the product needs them. The exact set depends on your country and is confirmed per order.',
      },
    ],
    quoteH: 'Supplying a property?',
    quoteText: 'Tell us your property and the products you use in one line. The enquiry form opens with it written in.',
    /** The link from the home page and from the hotel soap and bulk cleaner pages. */
    homeLine: 'Buying for a hotel, restaurant or café?',
    homeLink: 'See products by space',
    productLink: 'For hotels & restaurants',
    /** Structured data (Service) and llms.txt. */
    serviceName: 'HoReCa supply of guest amenities and cleaning products from India',
    serviceType: 'Wholesale supply of guest amenities and cleaning products for hotels, restaurants and cafés',
    audience: 'Hotels, restaurants, cafés and caterers',
    llms: 'Guest amenities and cleaning products for hotels, restaurants, cafés and caterers, organised by space (guest rooms, kitchen, washrooms, floors, laundry, back-of-house), in catering and housekeeping packs, with private label on guest amenities, mixed containers, no fixed minimum and free samples confirmed per enquiry.',
  },

  notFound: {
    title: 'Page not found',
    description: "This page could not be found. Browse GoodBiz Hygiene's soaps and home-care products or request a quote.",
    l1: 'This page is not',
    l2: 'on the shelf.',
    lead: 'The link may be old or mistyped. The full range is one click away.',
    sprayAlt: 'Illustration of a spray cleaner bottle',
  },
};

export default en;
export type UiDict = typeof en;
