import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

/** Words in a Markdown body, ignoring link URLs and markup characters. */
export function wordCount(md: string): number {
  return md
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/[#*|>`_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

export function readingMinutes(md: string): number {
  return Math.max(1, Math.round(wordCount(md) / 220));
}

/** Newest first. */
export async function getPosts(): Promise<BlogEntry[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
