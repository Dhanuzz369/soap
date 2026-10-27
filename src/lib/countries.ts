/**
 * Country suggestions for the enquiry form's destination step. Names come from the browser's own
 * Intl.DisplayNames in the page's language, so no country list needs translating; the English
 * name and the ISO code are what GoodBiz receives.
 */

/** ISO 3166-1 alpha-2 codes, without the uninhabited AQ, BV, HM, TF and UM. */
export const REGION_CODES: readonly string[] = [
  'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF',
  'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG',
  'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ',
  'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH',
  'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL',
  'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW',
  'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH',
  'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF',
  'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS',
  'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL',
  'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO',
  'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'YE',
  'YT', 'ZA', 'ZM', 'ZW',
];

export type Country = { code: string; name: string; en: string };

const cache = new Map<string, Country[]>();

const regionNames = (lang: string) => {
  try {
    return new Intl.DisplayNames([lang], { type: 'region' });
  } catch {
    return new Intl.DisplayNames(['en'], { type: 'region' });
  }
};

/** Every country as { code, name in `lang`, English name }. */
export function countryNames(lang: string): Country[] {
  const hit = cache.get(lang);
  if (hit) return hit;
  const local = regionNames(lang);
  const en = regionNames('en');
  const list = REGION_CODES.map((code) => ({ code, name: local.of(code) ?? code, en: en.of(code) ?? code }));
  cache.set(lang, list);
  return list;
}

/** Lower case, accents and apostrophe styles folded, so "cote" finds "Côte d’Ivoire". */
export function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[’'`]/g, "'")
    .toLowerCase()
    .trim();
}

/**
 * Up to `limit` countries whose local or English name matches `query`, ignoring case and accents.
 * Names starting with the query (or with a word that does) come before names that only contain it.
 */
export function suggestCountries(query: string, lang: string, limit = 6): Country[] {
  const q = fold(query);
  if (!q) return [];
  const rank = (c: Country) => {
    let best = 9;
    for (const n of [fold(c.name), fold(c.en)]) {
      if (n.startsWith(q)) best = Math.min(best, 0);
      else if (n.split(/[\s'-]+/).some((w) => w.startsWith(q))) best = Math.min(best, 1);
      else if (n.includes(q)) best = Math.min(best, 2);
    }
    return best;
  };
  return countryNames(lang)
    .map((c) => ({ c, r: rank(c) }))
    .filter((x) => x.r < 9)
    .sort((a, b) => a.r - b.r || a.c.name.localeCompare(b.c.name, lang))
    .slice(0, limit)
    .map((x) => x.c);
}
