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
  ar: [/(?<!لا )نصنّع(?:ها|ه|ون)?(?!\S)/i, /(?<!لا )نصنع(?:ها|ه)?(?!\S)/i, /(?<!لا )نقوم بتصنيع/i, /(?<!لا )ننتج(?:ها|ه)?(?!\S)/i, /(?<!لا )نقوم بإنتاج/i, /مصنعنا/i, /مصانعنا/i, /منشأتنا الإنتاجية/i, /خطوط إنتاجنا/i],
  es: [/\bnosotros fabricamos\b/i, /(?<!\bno )\bfabricamos\b/i, /(?<!\bno )\bproducimos\b/i, /(?<!\bno )\belaboramos\b/i, /\bnuestras? f[aá]bricas?\b/i, /\bnuestras? plantas?\b/i, /\bnuestras propias (f[aá]bricas|plantas)\b/i, /\bnuestras instalaciones de producci[oó]n\b/i, /(?<!\bno )\bsomos (un )?fabricantes?\b/i],
  pt: [/\bn[óo]s (fabricamos|produzimos)\b/i, /\bnossa(s)? (f[áa]brica|usina|planta|unidade de produ[çc][ãa]o)s?\b/i, /\bnossos? (parque fabril|site de produ[çc][ãa]o)\b/i, /\bnossas? pr[óo]prias? (f[áa]bricas?|usinas?)\b/i],
  ru: [/(?<![а-яё])мы (?:производим|изготавливаем|выпускаем)(?![а-яё])/iu, /(?<![а-яё])наш(?:а|и|е|его|ей|ем|ими|их|у|ей)? (?:завод(?:а|ы|ов|е|у)?|фабрик(?:а|и|у|е|ой)|заводы|фабрики|производственн(?:ая|ые|ой|ую|ых) (?:площадк[аиуе]|баз[аыу]|мощност[ьи]|лини[яией]))(?![а-яё])/iu, /(?<![а-яё])на (?:нашем|нашей|наших) (?:заводе|заводах|фабрике|фабриках|производстве|производствах)(?![а-яё])/iu, /(?<![а-яё])собственн(?:ое|ого|ым|ом) производств[оаум]/iu, /(?<![а-яё])собственн(?:ые|ых|ыми) (?:заводы|заводов|фабрики|фабрик)(?![а-яё])/iu],
  zh: [/我们(自行|自己)?(生产|制造)/, /我们的(工厂|厂房|生产基地|生产线|车间)/, /我们自有(的)?(工厂|生产基地|生产线)/, /本公司(自有)?(的)?(工厂|生产基地)/, /我们自己的(工厂|生产)/],
  de: [/\bwir (fertigen|produzieren|fabrizieren|erzeugen)\b(?![^.]{0,60}\bnicht\b)/i, /\bwir stellen\b(?![^.]{0,40}\bnicht\b)[^.]{0,60}\bher\b/i, /\bunsere[nr]? (eigene[nr]? )?(fabrik|fabriken|werk|werke|produktionsstätte|produktionsstätten|produktionsanlage|produktionsanlagen|produktion)\b/i, /\bin unserer (eigenen )?(fabrik|produktion|produktionsstätte)\b/i, /\bwir (betreiben|besitzen|unterhalten) (eine|ein|eigene)\b/i],
  tr: [/(?<![\p{L}])fabrikam(?![\p{L}])/iu, /(?<![\p{L}])fabrikalarımız(?![\p{L}])/iu, /(?<![\p{L}])tesisimiz(?![\p{L}])/iu, /(?<![\p{L}])tesislerimiz(?![\p{L}])/iu, /(?<![\p{L}])üretim tesisimiz(?![\p{L}])/iu, /(?<![\p{L}])(?:biz )?üretiyoruz(?![\p{L}])/iu, /(?<![\p{L}])imal ediyoruz(?![\p{L}])/iu],
  id: [/(?<!tidak )\bkami memproduksi\b/i, /(?<!tidak )\bkami memanufaktur\b/i, /\bpabrik kami\b/i, /\bpabrik-pabrik kami\b/i, /\bfasilitas produksi kami\b/i, /\bunit produksi kami\b/i, /\bpabrik milik kami\b/i],
  sw: [/\btunatengeneza\b/i, /\btunazitengeneza\b/i, /\btunazalisha\b/i, /\bkiwanda chetu\b/i, /\bviwanda vyetu\b/i, /\bmtambo wetu\b/i, /\bmitambo yetu\b/i, /\btunamiliki (?:kiwanda|viwanda|mitambo)\b/i, /\bsisi ni (?:mtengenezaji|watengenezaji)\b/i],
  vi: [/chúng tôi (tự )?(sản xuất|chế tạo|gia công|pha chế)/iu, /(nhà máy|xưởng|cơ sở sản xuất|dây chuyền sản xuất|nhà xưởng) (của (riêng )?chúng tôi|của GoodBiz)/iu, /chúng tôi sở hữu (các )?(nhà máy|xưởng)/iu, /(nhà máy|xưởng) riêng của chúng tôi/iu],
};

/** The patterns for a language: its own plus the English ones. */
export function claimPatterns(lang: Locale): RegExp[] {
  return [...FORBIDDEN_CLAIMS.en, ...(lang === 'en' ? [] : FORBIDDEN_CLAIMS[lang])];
}
