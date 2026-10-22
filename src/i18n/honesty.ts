/**
 * Honesty rule (spec §4): GoodBiz Hygiene is a merchant exporter. No page, in any language, may
 * claim that GoodBiz manufactures the products or owns a factory.
 *
 * These patterns are checked against every translated product, category and blog file
 * (tests/unit/i18n-content.test.ts) and every built page in that language
 * (tests/build/i18n.test.ts). English patterns apply to every language too.
 *
 * TRANSLATORS: add the first-person claims for your language ("we manufacture", "our factory",
 * "our plant", "we produce") as case-insensitive regular expressions. Match only claims made by
 * the company about itself: a question such as "Does GoodBiz Hygiene manufacture…?" or a
 * sentence about "the manufacturer's factory" is fine.
 */
import type { Locale } from './locales.ts';

export const FORBIDDEN_CLAIMS: Record<Locale, RegExp[]> = {
  en: [/\bwe manufacture\b/i, /\bour factory\b/i, /\bour factories\b/i, /\bour plant\b/i, /\bwe produce\b/i],
  fr: [
    /\bnous fabriquons\b/i,
    /\bnous produisons\b/i,
    /\bnotre usine\b/i,
    /\bnos usines\b/i,
    /\bnotre site de production\b/i,
    /\bnotre unité de production\b/i,
    /\bnos propres usines\b/i,
  ],
  ar: [],
  es: [],
  pt: [],
  ru: [],
  zh: [],
  de: [],
  tr: [],
  id: [],
  sw: [],
  vi: [],
};

/** The patterns for a language: its own plus the English ones. */
export function claimPatterns(lang: Locale): RegExp[] {
  return [...FORBIDDEN_CLAIMS.en, ...(lang === 'en' ? [] : FORBIDDEN_CLAIMS[lang])];
}
