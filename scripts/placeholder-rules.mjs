// Pure rules for the launch placeholder check. Shared by scripts/check-placeholders.mjs
// and tests/unit/placeholders.test.ts, so keep this file free of file-system access.

export const TOKEN = 'PLACEHOLDER';

/** A WhatsApp number that is a country code followed only by zeros, e.g. 910000000000. */
export function isPlaceholderWhatsApp(number) {
  return /^\d{1,3}0{6,}$/.test(String(number ?? '').trim());
}

/**
 * Everything that still marks the site as not ready for launch.
 * @param {{ contactIsPlaceholder?: boolean, whatsapp?: string, tokenHits?: string[] }} input
 * @returns {string[]} one human-readable line per problem (empty when ready)
 */
export function placeholderProblems({ contactIsPlaceholder, whatsapp, tokenHits = [] }) {
  const problems = [];
  if (contactIsPlaceholder) {
    problems.push('contactIsPlaceholder is true in src/config/site.ts (set it to false once real details are in)');
  }
  if (isPlaceholderWhatsApp(whatsapp)) {
    problems.push(`contact.whatsapp "${whatsapp}" is a placeholder (country code followed by zeros)`);
  }
  for (const hit of tokenHits) problems.push(`${TOKEN} text: ${hit}`);
  return problems;
}

/** The check fails only when the site claims to be launch ready and problems remain. */
export function shouldFail(launchReady, problems) {
  return Boolean(launchReady) && problems.length > 0;
}
