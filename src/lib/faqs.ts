import site from '../config/site';

export type QA = { q: string; a: string };

const t = site.exportTerms;

/** Company-level questions. The home page shows `homeFaqs`; /faq/ shows every group. */
export const faqGroups: { id: string; heading: string; faqs: QA[] }[] = [
  {
    id: 'faq-sourcing',
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
    id: 'faq-ordering',
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
    id: 'faq-shipping',
    heading: 'Shipping, payment and documents',
    faqs: [
      {
        q: 'Which incoterms and payment terms do you offer?',
        a: `${t.incoterms}.`,
      },
      {
        q: 'How long does an order take to ship?',
        a: `${t.leadTime}. ${t.port}.`,
      },
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
];

const all = faqGroups.flatMap((g) => g.faqs);
const pick = (q: string) => all.find((f) => f.q === q)!;

export const homeFaqs: QA[] = [
  pick('Does GoodBiz Hygiene manufacture the products it exports?'),
  pick('Can I order products under my own brand?'),
  pick('Can I combine different products in one container?'),
  pick('Which incoterms and payment terms do you offer?'),
  pick('How long does an order take to ship?'),
  pick('Which HSN codes apply to soaps and cleaning products?'),
];

export const allFaqs: QA[] = all;
