/**
 * Company-level FAQs. The text lives in the UI dictionaries (src/i18n/ui/<lang>.ts, key `faqs`);
 * the export terms are filled in from the same dictionary. /faq/ shows every group; the home
 * page shows six, picked by position below.
 */
import { DEFAULT_LOCALE, type Locale } from '../i18n/locales';
import { getUi, fmt } from '../i18n/ui';

export type QA = { q: string; a: string };

const GROUP_IDS = ['faq-sourcing', 'faq-ordering', 'faq-shipping'] as const;

/** [group, item] positions of the six home-page questions. */
const HOME_PICKS: [number, number][] = [
  [0, 0], // Does GoodBiz Hygiene manufacture the products it exports?
  [1, 0], // Can I order products under my own brand?
  [1, 1], // Can I combine different products in one container?
  [2, 0], // Which incoterms and payment terms do you offer?
  [2, 1], // How long does an order take to ship?
  [0, 2], // Which HSN codes apply to soaps and cleaning products?
];

export function getFaqGroups(lang: Locale = DEFAULT_LOCALE): { id: string; heading: string; faqs: QA[] }[] {
  const ui = getUi(lang);
  const vars = { ...ui.terms };
  return ui.faqs.map((g, i) => ({
    id: GROUP_IDS[i] ?? `faq-${i}`,
    heading: g.heading,
    faqs: g.faqs.map((f) => ({ q: fmt(f.q, vars), a: fmt(f.a, vars) })),
  }));
}

export function getHomeFaqs(lang: Locale = DEFAULT_LOCALE): QA[] {
  const groups = getFaqGroups(lang);
  return HOME_PICKS.map(([g, i]) => groups[g].faqs[i]);
}

export function getAllFaqs(lang: Locale = DEFAULT_LOCALE): QA[] {
  return getFaqGroups(lang).flatMap((g) => g.faqs);
}

/** English, for code that predates the dictionaries. */
export const faqGroups = getFaqGroups();
export const homeFaqs = getHomeFaqs();
export const allFaqs = getAllFaqs();
