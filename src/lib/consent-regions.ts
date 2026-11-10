/**
 * Where the site asks before Google Analytics may run (pure module; docs/analytics.md §1).
 *
 * - Europe: the EU, the EEA, the UK and Switzerland (GDPR and the ePrivacy rules), with the French
 *   overseas regions that are part of the EU.
 * - Every country where one of the site's other languages is spoken: those are the markets the site
 *   is written for, and most of them have consent-based privacy laws (Turkey's KVKK, Brazil's LGPD,
 *   Saudi Arabia's and the UAE's PDPL, Kenya's Data Protection Act, China's PIPL, Vietnam's Decree 13…).
 *
 * Everywhere else (India, the USA, …) analytics runs by default and "Cookie settings" in the footer
 * turns it off. Adding a country: add its ISO 3166-1 code below, then run `npm run consent:zones`
 * so the banner also shows for its time zones (src/lib/consent-timezones.ts).
 */
export const CONSENT_COUNTRIES_BY_REASON = {
  europe: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH', 'GF', 'GP', 'MQ', 'RE', 'YT', 'MF'],
  ar: ['AE', 'BH', 'DJ', 'DZ', 'EG', 'IQ', 'JO', 'KM', 'KW', 'LB', 'LY', 'MA', 'MR', 'OM', 'PS', 'QA', 'SA', 'SD', 'SO', 'SY', 'TN', 'YE'],
  fr: ['BF', 'BI', 'BJ', 'BL', 'CA', 'CD', 'CF', 'CG', 'CI', 'CM', 'GA', 'GN', 'GQ', 'HT', 'MC', 'MG', 'ML', 'NC', 'NE', 'PF', 'PM', 'RW', 'SC', 'SN', 'TD', 'TG', 'VU', 'WF'],
  es: ['AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'GT', 'HN', 'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE'],
  pt: ['AO', 'BR', 'CV', 'GW', 'MO', 'MZ', 'ST', 'TL'],
  ru: ['BY', 'KG', 'KZ', 'RU'],
  zh: ['CN', 'HK', 'SG', 'TW'],
  // German (DE, AT, CH, LI), and French, Turkish, Swahili countries not repeated here: already listed above.
  de: [],
  tr: ['TR'],
  id: ['ID'],
  sw: ['KE', 'TZ', 'UG'],
  vi: ['VN'],
} as const;

/** Every country above once, sorted: Google's consent `region` list. */
export const CONSENT_COUNTRIES: readonly string[] = [...new Set(Object.values(CONSENT_COUNTRIES_BY_REASON).flat())].sort();
