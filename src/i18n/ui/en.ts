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
    photoAlt: '{name} from GoodBiz',
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
    title: 'Soap & Home-Care Products Exporter & Supplier from India',
    description:
      'GoodBiz Hygiene, a GoodBiz Global company, exports soaps, detergents and home-care products from vetted Indian manufacturers, with private label and mixed containers.',
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
    title: 'Soap, Detergent & Cleaning Products Exporter & Supplier from India',
    description:
      'Browse {n} soap, laundry, kitchen, surface-cleaner and raw-material products sourced from vetted Indian manufacturers, with HSN codes and private label options.',
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
    specH: 'What are the typical specifications?',
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
    title: 'Export Guides for Soap & Cleaning Product Buyers',
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
    title: 'Request a Quote: Soap & Home-Care Exporter & Supplier from India',
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
    title: 'About GoodBiz Hygiene: Soap & Home-Care Exporter & Supplier from India',
    description:
      'GoodBiz Hygiene is the home-care and hygiene export division of GoodBiz Global, a merchant exporter from India, and a sister brand of GoodBiz Agro.',
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
    title: 'FAQ: Soap & Home-Care Exporter & Supplier from India',
    description:
      'Answers for importers buying soaps, detergents and cleaners from India through GoodBiz Hygiene: sourcing, private label, MOQ, incoterms, documents and lead times.',
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
          a: 'Yes. Private label is available on most products: your label artwork, a choice of fragrance and colour where the formulation allows, and the pack sizes your market needs. Minimum quantities depend on the product and pack, and are listed as typical on each product page.',
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
    title: 'Export Process: Soap & Home-Care Exporter & Supplier from India',
    description:
      'How GoodBiz Hygiene exports soaps, detergents and cleaners from India: quotation, samples, incoterms, payment terms, documents, ports and typical lead times.',
    l1: 'The export process.',
    l2: 'From enquiry to bill of lading.',
    lead: 'The steps, terms and documents for buying soaps and home-care products from India through GoodBiz Hygiene.',
    stepsLink: 'The six steps',
    termsH: 'What are the export terms?',
    termsIncoterms: 'Incoterms and payment',
    termsPort: 'Port',
    termsLead: 'Lead time',
    processL1: 'What are the steps',
    processL2: 'from enquiry to shipment?',
    processIntro: 'Six steps, with your approval on the quotation, samples and proforma invoice before anything is produced.',
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
    title: 'Private Label Soaps & Cleaning Products: Exporter & Supplier from India',
    description:
      'Private label soaps, detergents and cleaners from India: your artwork, fragrance, colour and pack sizes, made by vetted Indian manufacturers and exported by GoodBiz Hygiene.',
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
