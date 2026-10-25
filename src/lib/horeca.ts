/**
 * The HoReCa page (/horeca/): hotels, restaurants, cafés and caterers, organised by the spaces
 * they run rather than by our ranges. Pure module (no Astro imports): the page, its script and the
 * tests all read it.
 *
 * SPACES lists, per space, the products that space uses and, per product, which of its own
 * `packSizes` (by position in the product file, so the translated pack names line up) are the ones
 * a hotel or restaurant buys. tests/unit/horeca.test.ts checks every slug exists, every index is in
 * range, and that each space's claim matches the product file (its `uses` or `variants`).
 *
 * The checklist sends the buyer to the contact page with the existing enquiry parameters
 * (`?product=` and `?message=`, read by parseEnquiryParams), built by horecaEnquiryHref below.
 */
import { enquiryHref, MAX_URL_MESSAGE } from './enquiry';

export type SpaceId = 'rooms' | 'kitchen' | 'washrooms' | 'floors' | 'laundry' | 'backOfHouse';

export interface SpaceProduct {
  slug: string;
  /** Positions in the product's `packSizes` to show as its HoReCa packs. */
  packs: number[];
}

export interface Space {
  id: SpaceId;
  /** The section anchor on the page (#space-…). */
  anchor: string;
  products: SpaceProduct[];
  /** Where the hotspot sits on the hotel drawing, in drawing units (viewBox 600 × 520; never mirrored). */
  spot: { x: number; y: number };
}

export const SPACES: Space[] = [
  {
    id: 'rooms',
    anchor: 'space-rooms',
    spot: { x: 96, y: 74 },
    products: [
      { slug: 'hotel-guest-soap', packs: [0, 1, 2, 3, 4] },
      { slug: 'body-wash-shower-gel', packs: [0, 4, 5] },
      { slug: 'liquid-hand-wash', packs: [2, 3, 4] },
      { slug: 'toilet-bath-soap', packs: [0, 1, 2] },
    ],
  },
  {
    id: 'kitchen',
    anchor: 'space-kitchen',
    spot: { x: 96, y: 198 },
    products: [
      { slug: 'dish-wash-liquid', packs: [4, 5, 6] },
      { slug: 'dish-wash-bar', packs: [4, 5] },
      { slug: 'bulk-institutional-cleaners', packs: [0, 1, 2] },
    ],
  },
  {
    id: 'washrooms',
    anchor: 'space-washrooms',
    spot: { x: 392, y: 198 },
    products: [
      { slug: 'liquid-hand-wash', packs: [2, 3, 4] },
      { slug: 'toilet-bowl-cleaner', packs: [2, 3] },
      { slug: 'bathroom-tile-cleaner', packs: [2, 3, 4] },
      { slug: 'glass-cleaner', packs: [2, 3, 4] },
      { slug: 'antibacterial-soap', packs: [2, 3] },
    ],
  },
  {
    id: 'floors',
    anchor: 'space-floors',
    spot: { x: 96, y: 308 },
    products: [
      { slug: 'floor-cleaner', packs: [3, 4] },
      { slug: 'herbal-phenol', packs: [2, 3, 4] },
      { slug: 'multi-surface-cleaner', packs: [2, 3, 4] },
      { slug: 'glass-cleaner', packs: [2, 3, 4] },
    ],
  },
  {
    id: 'laundry',
    anchor: 'space-laundry',
    spot: { x: 96, y: 420 },
    products: [
      { slug: 'liquid-detergent', packs: [4, 5] },
      { slug: 'detergent-powder', packs: [3, 4, 5] },
      { slug: 'fabric-softener', packs: [4, 5] },
      { slug: 'laundry-soap-bar', packs: [3, 4] },
    ],
  },
  {
    id: 'backOfHouse',
    anchor: 'space-back-of-house',
    spot: { x: 326, y: 420 },
    products: [{ slug: 'bulk-institutional-cleaners', packs: [0, 1, 2, 3] }],
  },
];

/** Product pages that link to the HoReCa page ("For hotels & restaurants"). */
export const HORECA_LINKED = ['hotel-guest-soap', 'bulk-institutional-cleaners'];

/** The hotel drawing's viewBox (FloorPlanHero.astro). */
export const DRAWING = { w: 600, h: 520 } as const;

/** The space the idle pulse invites the visitor to try first. */
export const PULSE_SPACE: SpaceId = 'rooms';

/** Every product on the page, once, in page order. */
export function horecaSlugs(spaces: Space[] = SPACES): string[] {
  return [...new Set(spaces.flatMap((s) => s.products.map((p) => p.slug)))];
}

/** The property types the buyer can pick (labels come from the UI dictionary). */
export const PROPERTY_TYPES = ['hotel', 'restaurant', 'cafe', 'catering', 'other'] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

/** The translated message templates (ui.horeca.message). */
export interface HorecaMessages {
  /** Products ticked: "{products}" is filled in. */
  samples: string;
  /** Nothing ticked (also the link without JavaScript). */
  general: string;
  /** Appended when a property type is chosen: "{type}" is filled in. */
  type: string;
  /** Joins the product names ("a, b, c"). */
  separator: string;
}

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m);

/**
 * The message prefilled on the contact page. `names` are the ticked products' names in the page's
 * language; `type` is the translated property type (empty when not chosen). Kept within the
 * contact form's limit: when the list is too long, names are dropped from the end (the slugs in
 * ?product= still tick every product).
 */
export function horecaMessage(names: string[], type: string, m: HorecaMessages): string {
  const t = type.trim();
  // Sentences are joined with a space, except after a full-width stop (Chinese).
  const join = (a: string) => a + (t ? (/[。！？]$/.test(a) ? '' : ' ') + fill(m.type, { type: t }) : '');
  if (!names.length) return join(m.general).slice(0, MAX_URL_MESSAGE);
  let list = names.slice();
  const make = () => join(fill(m.samples, { products: list.join(m.separator) }));
  let msg = make();
  while (msg.length > MAX_URL_MESSAGE && list.length > 1) {
    list = list.slice(0, -1);
    msg = make();
  }
  return msg.slice(0, MAX_URL_MESSAGE);
}

/**
 * The checklist → contact link: `?product=` with every ticked slug (page order, no duplicates) and
 * `?message=` from horecaMessage. `contact` is the localized contact path.
 */
export function horecaEnquiryHref(
  contact: string,
  picked: { slug: string; name: string }[],
  type: string,
  m: HorecaMessages,
): string {
  const seen = new Set<string>();
  const unique = picked.filter((p) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) && !seen.has(p.slug) && seen.add(p.slug));
  return enquiryHref(contact, {
    products: unique.map((p) => p.slug),
    message: horecaMessage(
      unique.map((p) => p.name),
      type,
      m,
    ),
  });
}
