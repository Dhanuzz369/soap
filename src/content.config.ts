import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const categories = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/categories' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number(),
    hsnRange: z.string(),
    summary: z.string().max(160),
    /** The search snippet (120–160 characters); `summary` is the shorter line under the page title. */
    metaDescription: z.string().min(120).max(160),
    intro: z.string(),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: reference('categories'),
    order: z.number(),
    hsn: z.string().regex(/^\d{4} \d{2}$/),
    hsnNote: z.string().optional(),
    metaTitle: z.string(),
    metaDescription: z.string().min(120).max(160),
    /** The main search term for this product, as buyers type it (docs/seo-keywords.md), e.g. "dish wash liquid". */
    keyword: z.string(),
    answer: z.string(),
    variants: z.array(z.string()).min(3),
    packSizes: z.array(z.string()).min(3),
    packaging: z.array(z.string()),
    specs: z.array(z.object({ label: z.string(), value: z.string() })).min(4),
    moq: z.string(),
    privateLabel: z.object({ available: z.boolean(), options: z.array(z.string()) }),
    containerLoad: z.object({ ft20: z.string(), ft40: z.string() }).optional(),
    uses: z.array(z.string()),
    markets: z.array(z.string()),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).min(4).max(6),
    related: z.array(z.string()),
    image: z.string().optional(),
    /** Extra photos of variants (fragrances, colours), shown under the varieties. */
    gallery: z.array(z.object({ src: z.string(), alt: z.string(), caption: z.string() })).optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /** A shorter <title> for search results (aim for 60 characters or fewer); the page heading stays `title`. */
    metaTitle: z.string().max(70).optional(),
    description: z.string().min(120).max(160),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()),
    relatedProducts: z.array(z.string()).min(2),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

/*
 * Translations (docs/i18n-translator-guide.md). One file per language and entry, mirroring the
 * English file: src/content/i18n/<lang>/{products,categories,blog}/<slug>.md. Every field is
 * optional here: a field that is missing falls back to the English value, and fixed fields
 * (slug, category, order, hsn, related, image, gallery src, dates, relatedProducts) always come
 * from the English file. `npm run i18n:check` reports missing and stale files.
 * Entry ids are the path without ".md", e.g. "fr/products/dish-wash-liquid".
 */
const i18nId = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '');
const qa = z.array(z.object({ q: z.string(), a: z.string() }));
const stamp = { sourceHash: z.string().optional() };

const productsI18n = defineCollection({
  loader: glob({ pattern: '*/products/*.md', base: './src/content/i18n', generateId: i18nId }),
  schema: z.object({
    ...stamp,
    title: z.string().optional(),
    slug: z.string().optional(),
    category: z.string().optional(),
    order: z.number().optional(),
    hsn: z.string().optional(),
    hsnNote: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keyword: z.string().optional(),
    answer: z.string().optional(),
    variants: z.array(z.string()).optional(),
    packSizes: z.array(z.string()).optional(),
    packaging: z.array(z.string()).optional(),
    specs: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    moq: z.string().optional(),
    privateLabel: z.object({ available: z.boolean().optional(), options: z.array(z.string()) }).optional(),
    containerLoad: z.object({ ft20: z.string(), ft40: z.string() }).optional(),
    uses: z.array(z.string()).optional(),
    markets: z.array(z.string()).optional(),
    faqs: qa.optional(),
    related: z.array(z.string()).optional(),
    image: z.string().optional(),
    gallery: z.array(z.object({ src: z.string().optional(), alt: z.string(), caption: z.string() })).optional(),
  }),
});

const categoriesI18n = defineCollection({
  loader: glob({ pattern: '*/categories/*.md', base: './src/content/i18n', generateId: i18nId }),
  schema: z.object({
    ...stamp,
    title: z.string().optional(),
    slug: z.string().optional(),
    order: z.number().optional(),
    hsnRange: z.string().optional(),
    summary: z.string().optional(),
    metaDescription: z.string().optional(),
    intro: z.string().optional(),
  }),
});

const blogI18n = defineCollection({
  loader: glob({ pattern: '*/blog/*.md', base: './src/content/i18n', generateId: i18nId }),
  schema: z.object({
    ...stamp,
    title: z.string().optional(),
    metaTitle: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    relatedProducts: z.array(z.string()).optional(),
    faqs: qa.optional(),
  }),
});

export const collections = { categories, products, blog, productsI18n, categoriesI18n, blogI18n };
