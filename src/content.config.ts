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
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(120).max(160),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()),
    relatedProducts: z.array(z.string()).min(2),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

export const collections = { categories, products, blog };
