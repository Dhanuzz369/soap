/**
 * Search metadata: absolute URLs, <title>s, meta keywords and the JSON-LD structured data blocks.
 *
 * Every builder is typed with schema-dts (the schema.org vocabulary as TypeScript types), so a
 * misspelt or unknown property fails `npx astro check`. tests/build/structured-data.test.ts parses
 * every block on every built page and checks the required fields per type.
 *
 * Honesty rules (docs/superpowers/specs/2026-10-16-goodbiz-hygiene-website-design.md §4): the
 * Organization is an `Organization`, never a `Manufacturer`; a Product never carries `offers`,
 * `aggregateRating` or `review` (there are no public prices, ratings or reviews); contact details
 * are only emitted once they are real (`contactIsPlaceholder: false`).
 *
 * Entities are linked with `@id`s: the Organization (`<site>/#organization`), the WebSite per
 * language (`<home>#website`), and on each page the WebPage (`<url>#webpage`), its BreadcrumbList
 * (`<url>#breadcrumb`) and its main entity (`#product`, `#itemlist`, `#article`, `#howto`, `#faq`).
 * `inLanguage` is set on every CreativeWork (WebSite, WebPage, FAQPage, BlogPosting, HowTo).
 * Organization, Product, BreadcrumbList and ItemList are not CreativeWorks, so schema.org gives
 * them no `inLanguage`; they belong to their language through the WebPage that names them and
 * through their localized URLs.
 */
import type {
  BlogPosting,
  BreadcrumbList,
  FAQPage,
  HowTo,
  ItemList,
  Organization,
  Product,
  Service,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts';
import site from '../config/site';
import { memberOfJsonLd } from './registrations';
import type { ProductData } from './types';

const CONTEXT = 'https://schema.org' as const;
const BASE = () => site.url.replace(/\/$/, '');

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return BASE() + (path.startsWith('/') ? path : `/${path}`);
}

export function pageTitle(title: string): string {
  const suffix = ` | ${site.name}`;
  return title.endsWith(suffix) ? title : title + suffix;
}

/** The longest meta keywords list a page gets (Google ignores the tag; Bing, Yandex, Baidu and Naver may read it). */
export const MAX_KEYWORDS = 12;

/**
 * Fills keyword templates (`{name}`, `{nameLower}`, `{hsn}`, `{hsn4}`) and returns a short, de-duplicated
 * list (case-insensitive), in order, capped at MAX_KEYWORDS.
 */
export function buildKeywords(templates: readonly string[], vars: Record<string, string> = {}, extra: readonly string[] = []): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of [...templates, ...extra]) {
    const k = raw
      .replace(/\{(\w+)\}/g, (m, key: string) => vars[key] ?? m)
      .replace(/\s+/g, ' ')
      .trim();
    if (!k || /\{\w+\}/.test(k)) continue;
    const key = k.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(k);
    if (out.length === MAX_KEYWORDS) break;
  }
  return out;
}

export const ORG_ID = () => `${BASE()}/#organization`;
export const LOGO_URL = () => absoluteUrl('/logo-512.png');

/** What GoodBiz Hygiene knows about (Organization.knowsAbout): its ranges and the export topics it covers. */
export const KNOWS_ABOUT = [
  'Bath and personal soaps',
  'Laundry care products',
  'Kitchen care and dish wash products',
  'Surface and home cleaners',
  'Soap noodles, LABSA and SLES',
  'HSN 3401 soaps',
  'HSN 3402 detergents and cleaning preparations',
  'Private label home-care products',
  'Export of soaps and detergents from India',
];

/**
 * The company. `description` is the entity sentence in the page's language (ui.meta.entity).
 * Contact details, address and profiles appear only when they are real and filled in.
 */
export function organizationJsonLd(description: string = site.tagline): WithContext<Organization> {
  const f = site.facts;
  const real = !site.contactIsPlaceholder;
  const sameAs = site.profiles.filter((u) => /^https:\/\//.test(u));
  const member = memberOfJsonLd();
  const logo = { '@type': 'ImageObject' as const, url: LOGO_URL(), width: '512', height: '512' };
  return {
    '@context': CONTEXT,
    '@type': 'Organization',
    '@id': ORG_ID(),
    name: site.name,
    alternateName: `${site.name}, a ${site.parentName} company`,
    url: BASE() + '/',
    logo,
    image: logo,
    description,
    slogan: site.tagline,
    areaServed: 'Worldwide',
    knowsAbout: KNOWS_ABOUT,
    parentOrganization: { '@type': 'Organization', name: site.parentName, ...(f.parentUrl ? { url: f.parentUrl } : {}) },
    ...(f.founded ? { foundingDate: f.founded } : {}),
    ...(f.iec ? { identifier: { '@type': 'PropertyValue', propertyID: 'IEC (Importer Exporter Code, India)', value: f.iec } } : {}),
    // The country is a public fact now; the city once `facts.city` is filled in, the street once
    // the contact details are real.
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      ...(f.city ? { addressLocality: f.city } : {}),
      ...(real ? { streetAddress: site.contact.address } : {}),
    },
    ...(real
      ? {
          email: site.contact.email,
          telephone: site.contact.phone,
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'sales',
            email: site.contact.email,
            telephone: site.contact.phone,
            areaServed: 'Worldwide',
            availableLanguage: ['English'],
          },
        }
      : {}),
    ...(member.length ? { memberOf: member } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** `url` is the site home in the page's language; `inLanguage` its BCP 47 tag. */
export function websiteJsonLd(opts: { url?: string; inLanguage?: string; description?: string } = {}): WithContext<WebSite> {
  const url = opts.url ?? BASE() + '/';
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    '@id': `${url}#website`,
    name: site.name,
    alternateName: 'GoodBiz Hygiene, a GoodBiz Global company',
    url,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.inLanguage ? { inLanguage: opts.inLanguage } : {}),
    publisher: { '@id': ORG_ID() },
  };
}

export type PageType = 'WebPage' | 'CollectionPage' | 'ItemPage' | 'AboutPage' | 'ContactPage';

/** The page itself: links the WebSite, the breadcrumb trail, the main entity and the share image. */
export function webPageJsonLd(p: {
  url: string;
  name: string;
  description: string;
  inLanguage: string;
  homeUrl: string;
  type?: PageType;
  image?: string;
  breadcrumb?: boolean;
  mainEntity?: string;
  dateModified?: Date;
}): WithContext<WebPage> {
  const url = absoluteUrl(p.url);
  return {
    '@context': CONTEXT,
    '@type': p.type ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: p.name,
    description: p.description,
    inLanguage: p.inLanguage,
    isPartOf: { '@id': `${absoluteUrl(p.homeUrl)}#website` },
    publisher: { '@id': ORG_ID() },
    ...(p.type === 'AboutPage' || p.type === 'ContactPage' ? { about: { '@id': ORG_ID() } } : {}),
    ...(p.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl(p.image) } } : {}),
    ...(p.breadcrumb ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
    ...(p.mainEntity ? { mainEntity: { '@id': p.mainEntity } } : {}),
    ...(p.dateModified ? { dateModified: p.dateModified.toISOString() } : {}),
  } as WithContext<WebPage>;
}

/** The breadcrumb trail. The last item is the page; its `@id` is `<page url>#breadcrumb`. */
export function breadcrumbJsonLd(items: { name: string; url: string }[]): WithContext<BreadcrumbList> {
  const last = items.length ? absoluteUrl(items[items.length - 1].url) : BASE() + '/';
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    '@id': `${last}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.url),
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[], inLanguage?: string, url?: string): WithContext<FAQPage> {
  const abs = url ? absoluteUrl(url) : undefined;
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    ...(abs ? { '@id': `${abs}#faq`, url: abs } : {}),
    ...(inLanguage ? { inLanguage } : {}),
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/**
 * A list of products (the products page, a category page, one space on the HoReCa page), in display
 * order. `fragment` names the list when a page has several (default `itemlist`).
 */
export function itemListJsonLd(
  url: string,
  name: string,
  items: { name: string; url: string; image?: string }[],
  fragment = 'itemlist',
): WithContext<ItemList> {
  const abs = absoluteUrl(url);
  return {
    '@context': CONTEXT,
    '@type': 'ItemList',
    '@id': `${abs}#${fragment}`,
    name,
    numberOfItems: items.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.url),
      ...(it.image ? { image: absoluteUrl(it.image) } : {}),
    })),
  };
}

/**
 * A service offered by the Organization (the HoReCa page): what it is, for whom and where. No
 * offers, prices or ratings: Service is valid without them, and none exist.
 */
export function serviceJsonLd(p: {
  url: string;
  name: string;
  serviceType: string;
  description: string;
  audience: string;
  /** The page's product lists (ItemList `#<fragment>`), linked as the Service's catalogue. */
  catalog?: { name: string; fragments: string[] };
}): WithContext<Service> {
  const abs = absoluteUrl(p.url);
  return {
    '@context': CONTEXT,
    '@type': 'Service',
    '@id': `${abs}#service`,
    name: p.name,
    serviceType: p.serviceType,
    description: p.description,
    url: abs,
    provider: { '@id': ORG_ID() },
    areaServed: 'Worldwide',
    audience: { '@type': 'BusinessAudience', audienceType: p.audience },
    mainEntityOfPage: { '@id': `${abs}#webpage` },
    ...(p.catalog && p.catalog.fragments.length
      ? {
          // A catalogue without prices or offers: it only points at the page's product lists.
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: p.catalog.name,
            itemListElement: p.catalog.fragments.map((f) => ({ '@id': `${abs}#${f}` })),
          },
        }
      : {}),
  };
}

/** Ordered steps (the export process). `url` is the page; each step links to `#<anchor>`. */
export function howToJsonLd(p: {
  url: string;
  name: string;
  description: string;
  inLanguage: string;
  steps: { name: string; text: string }[];
  anchor?: string;
  image?: string;
}): WithContext<HowTo> {
  const abs = absoluteUrl(p.url);
  return {
    '@context': CONTEXT,
    '@type': 'HowTo',
    '@id': `${abs}#howto`,
    name: p.name,
    description: p.description,
    inLanguage: p.inLanguage,
    ...(p.image ? { image: absoluteUrl(p.image) } : {}),
    step: p.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${abs}#${p.anchor ?? 'steps'}`,
    })),
  };
}

/**
 * A product page's Product. `p.category` should be the category's display title (schema.org
 * `category`), `labels` names the additional properties in the page's language (default English).
 * No offers, prices, ratings or reviews: none exist.
 */
export function productJsonLd(
  p: ProductData,
  url: string,
  labels: { hsnCode: string; variants: string; packSizes: string } = { hsnCode: 'HSN Code', variants: 'Variants', packSizes: 'Pack sizes' },
): WithContext<Product> {
  return {
    '@context': CONTEXT,
    '@type': 'Product',
    '@id': `${url}#product`,
    name: p.title,
    description: p.answer || p.metaDescription,
    url,
    sku: p.slug,
    brand: { '@type': 'Brand', name: site.name },
    countryOfOrigin: { '@type': 'Country', name: 'India' },
    ...(p.category ? { category: p.category } : {}),
    ...(p.image ? { image: absoluteUrl(p.image) } : {}),
    additionalProperty: [
      { '@type': 'PropertyValue', name: labels.hsnCode, propertyID: 'HSN', value: p.hsn },
      ...(p.variants.length ? [{ '@type': 'PropertyValue' as const, name: labels.variants, value: p.variants.join(', ') }] : []),
      ...(p.packSizes.length ? [{ '@type': 'PropertyValue' as const, name: labels.packSizes, value: p.packSizes.join(', ') }] : []),
      ...p.specs.map((s) => ({ '@type': 'PropertyValue' as const, name: s.label, value: s.value })),
    ],
  };
}

export function articleJsonLd(a: {
  title: string;
  description: string;
  date: Date;
  updated?: Date;
  url: string;
  image?: string | string[];
  type?: 'Article' | 'BlogPosting';
  inLanguage?: string;
  keywords?: string[];
}): WithContext<BlogPosting> {
  const abs = absoluteUrl(a.url);
  const images = (Array.isArray(a.image) ? a.image : a.image ? [a.image] : []).map(absoluteUrl);
  const org = { '@type': 'Organization' as const, '@id': ORG_ID(), name: site.name, url: BASE() + '/' };
  return {
    '@context': CONTEXT,
    '@type': (a.type ?? 'Article') as 'BlogPosting',
    '@id': `${abs}#article`,
    headline: a.title.length > 110 ? a.title.slice(0, 107).trimEnd() + '…' : a.title,
    description: a.description,
    datePublished: a.date.toISOString(),
    dateModified: (a.updated ?? a.date).toISOString(),
    ...(a.inLanguage ? { inLanguage: a.inLanguage } : {}),
    mainEntityOfPage: { '@id': `${abs}#webpage` },
    url: abs,
    author: org,
    publisher: { ...org, logo: { '@type': 'ImageObject', url: LOGO_URL(), width: '512', height: '512' } },
    ...(a.keywords?.length ? { keywords: a.keywords.join(', ') } : {}),
    ...(images.length ? { image: images.length === 1 ? images[0] : images } : {}),
  };
}
