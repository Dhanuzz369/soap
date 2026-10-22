import site from '../config/site';
import type { ProductData } from './types';

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return site.url.replace(/\/$/, '') + (path.startsWith('/') ? path : `/${path}`);
}

export function pageTitle(title: string): string {
  const suffix = ` | ${site.name}`;
  return title.endsWith(suffix) ? title : title + suffix;
}

export function organizationJsonLd(description: string = site.tagline): Record<string, unknown> {
  const sameAs = [site.facts.parentUrl, site.facts.agroUrl].filter((u): u is string => !!u);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    description,
    parentOrganization: { '@type': 'Organization', name: site.parentName },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** `url` is the site home in the page's language; `inLanguage` its BCP 47 tag. */
export function websiteJsonLd(opts: { url?: string; inLanguage?: string } = {}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: opts.url ?? site.url,
    ...(opts.inLanguage ? { inLanguage: opts.inLanguage } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.url),
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[], inLanguage?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(inLanguage ? { inLanguage } : {}),
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** `p.category` should be the category's display title (it becomes schema.org `category`). */
/** `labels` names the additional properties in the page's language (defaults: English). */
export function productJsonLd(
  p: ProductData,
  url: string,
  labels: { hsnCode: string; variants: string; packSizes: string } = { hsnCode: 'HSN Code', variants: 'Variants', packSizes: 'Pack sizes' },
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    description: p.metaDescription,
    url,
    brand: { '@type': 'Brand', name: site.name },
    ...(p.category ? { category: p.category } : {}),
    ...(p.image ? { image: absoluteUrl(p.image) } : {}),
    additionalProperty: [
      { '@type': 'PropertyValue', name: labels.hsnCode, value: p.hsn },
      ...(p.variants.length ? [{ '@type': 'PropertyValue', name: labels.variants, value: p.variants.join(', ') }] : []),
      ...(p.packSizes.length ? [{ '@type': 'PropertyValue', name: labels.packSizes, value: p.packSizes.join(', ') }] : []),
      ...p.specs.map((s) => ({ '@type': 'PropertyValue', name: s.label, value: s.value })),
    ],
  };
}

export function articleJsonLd(a: {
  title: string;
  description: string;
  date: Date;
  url: string;
  image?: string;
  type?: 'Article' | 'BlogPosting';
  inLanguage?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': a.type ?? 'Article',
    headline: a.title,
    description: a.description,
    datePublished: a.date.toISOString(),
    ...(a.inLanguage ? { inLanguage: a.inLanguage } : {}),
    mainEntityOfPage: absoluteUrl(a.url),
    author: { '@type': 'Organization', name: site.name },
    publisher: { '@type': 'Organization', name: site.name },
    ...(a.image ? { image: absoluteUrl(a.image) } : {}),
  };
}
