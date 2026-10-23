/**
 * "Your brand, on our shelf": the /private-label/ hero's live label (src/components/LabelHero.astro),
 * as pure helpers. Unit-tested in tests/unit/brand-label.test.ts.
 */

/** The longest brand name the label takes (the input's maxlength). */
export const BRAND_MAX = 24;

/**
 * Cleans a typed brand name for the label and the enquiry link: drops control and bidi-override
 * characters, folds runs of whitespace into one space, trims, and caps it at BRAND_MAX characters
 * (whole code points, so an emoji or an accented letter is never cut in half).
 * The result is only ever written with textContent.
 */
export function sanitiseBrand(raw: string): string {
  const clean = raw
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F-\u009F‎‏‪-‮⁦-⁩]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return Array.from(clean).slice(0, BRAND_MAX).join('').trim();
}

/** The name on the label: the visitor's brand, or the placeholder when the field is empty. */
export const labelText = (raw: string, fallback: string): string => sanitiseBrand(raw) || fallback;

/**
 * Rough advance width of a line of text in em (Geist SemiBold-like proportions). Only used at
 * build time, before the browser can measure; the script refines it with the real width.
 */
export function estimateEm(text: string): number {
  let em = 0;
  for (const ch of text) {
    if (ch === ' ') em += 0.26;
    else if (/[ilIj.,'’!|]/.test(ch)) em += 0.3;
    else if (/[mwMW]/.test(ch)) em += 0.86;
    else if (/[A-Z]/.test(ch)) em += 0.68;
    else if (/[؀-ۿ]/.test(ch)) em += 0.5;
    else if (/[⺀-鿿가-힯]/.test(ch)) em += 1;
    else em += 0.56;
  }
  return em;
}

/**
 * The font size that fits a line into `target` units: scaled from a measured width at a known
 * size, never above `max` (short names stay a sensible size) nor below `min`.
 */
export function fitSize(measured: number, atSize: number, target: number, max: number, min = max / 4): number {
  if (!(measured > 0)) return max;
  const size = (atSize * target) / measured;
  return Math.round(Math.min(max, Math.max(min, size)) * 100) / 100;
}

/** The build-time size for a name: fitSize over the estimated width. */
export const estimateSize = (text: string, target: number, max: number, min?: number): number =>
  fitSize(estimateEm(text) * max, max, target, max, min);

/** The label colourways the swatches offer. Colours are drawn in the SVG (see LabelHero.astro). */
export const COLOURWAYS = [
  { id: 'sage', label: '#dcefe2', ink: '#12352a', accent: '#3f7d5e' },
  { id: 'ocean', label: '#d3e6f0', ink: '#10304a', accent: '#2f6a8c' },
  { id: 'blush', label: '#f6dfdc', ink: '#4a1f24', accent: '#b0646a' },
] as const;
export type ColourwayId = (typeof COLOURWAYS)[number]['id'];

/** The enquiry message for the contact form: with the brand, or the brand-less wording. */
export function brandMessage(raw: string, withBrand: string, withoutBrand: string): string {
  const brand = sanitiseBrand(raw);
  return brand ? withBrand.replace('{brand}', () => brand) : withoutBrand;
}
