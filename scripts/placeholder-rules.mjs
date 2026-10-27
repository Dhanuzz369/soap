// Pure rules for the launch placeholder check. Shared by scripts/check-placeholders.mjs
// and tests/unit/placeholders.test.ts, so keep this file free of file-system access.

export const TOKEN = 'PLACEHOLDER';

/** A WhatsApp number that is a country code followed only by zeros, e.g. 910000000000. */
export function isPlaceholderWhatsApp(number) {
  return /^\d{1,3}0{6,}$/.test(String(number ?? '').trim());
}

/** The enquiry form's Google Sheet endpoint: an Apps Script web app /exec URL (src/lib/enquiry-send.ts). */
export function isConfiguredEnquiryEndpoint(url) {
  return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(String(url ?? ''));
}

/**
 * Everything that still marks the site as not ready for launch.
 * `endpoint` is site.enquiry.endpoint; leave it out to skip that check.
 * @param {{ contactIsPlaceholder?: boolean, whatsapp?: string, endpoint?: string, tokenHits?: string[] }} input
 * @returns {string[]} one human-readable line per problem (empty when ready)
 */
export function placeholderProblems({ contactIsPlaceholder, whatsapp, endpoint, tokenHits = [] }) {
  const problems = [];
  if (contactIsPlaceholder) {
    problems.push('contactIsPlaceholder is true in src/config/site.ts (set it to false once real details are in)');
  }
  if (isPlaceholderWhatsApp(whatsapp)) {
    problems.push(`contact.whatsapp "${whatsapp}" is a placeholder (country code followed by zeros)`);
  }
  const endpointMissing = endpoint !== undefined && !isConfiguredEnquiryEndpoint(endpoint);
  if (endpointMissing) {
    problems.push(`enquiry.endpoint "${endpoint}" is not set: enquiries only reach you by WhatsApp or email (docs/enquiry-sheet-setup.md)`);
  }
  for (const hit of tokenHits) {
    // The endpoint line is already reported above.
    if (endpointMissing && endpoint && hit.includes(endpoint)) continue;
    problems.push(`${TOKEN} text: ${hit}`);
  }
  return problems;
}

/** The check fails only when the site claims to be launch ready and problems remain. */
export function shouldFail(launchReady, problems) {
  return Boolean(launchReady) && problems.length > 0;
}
