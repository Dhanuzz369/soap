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

export function organizationJsonLd(): Record<string, unknown> {
  const sameAs = [site.facts.parentUrl, site.facts.agroUrl].filter((u): u is string => !!u);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    description: site.tagline,
    parentOrganization: { '@type': 'Organization', name: site.parentName },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
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

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function productJsonLd(p: ProductData, url: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    description: p.metaDescription,
    url,
    brand: { '@type': 'Brand', name: site.name },
    ...(p.image ? { image: absoluteUrl(p.image) } : {}),
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'HSN Code', value: p.hsn },
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
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    datePublished: a.date.toISOString(),
    mainEntityOfPage: absoluteUrl(a.url),
    author: { '@type': 'Organization', name: site.name },
    publisher: { '@type': 'Organization', name: site.name },
    ...(a.image ? { image: absoluteUrl(a.image) } : {}),
  };
}
