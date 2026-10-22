import type { APIRoute } from 'astro';
import site from '../config/site';
import { absoluteUrl } from '../lib/seo';
import { getProductsByCategory } from '../lib/products';
import { getPosts } from '../lib/blog';
import { LOCALES, localizePath } from '../i18n/locales';

const firstSentence = (s: string) => (s.match(/^.*?[.!?](?=\s+[A-Z]|\s*$)/s)?.[0] ?? s).trim();

export const GET: APIRoute = async () => {
  const groups = await getProductsByCategory();
  const posts = await getPosts();

  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${site.name}, a GoodBiz Global company, is a merchant exporter from India. We export soaps, detergents, dish wash, floor and toilet cleaners, and bulk raw materials sourced from vetted Indian manufacturers, with private label options, mixed containers and export documentation for importers and distributors.`,
    '',
    '## Products',
    '',
  ];
  for (const { category, products } of groups) {
    lines.push(`### ${category.data.title}`, '');
    for (const p of products) {
      lines.push(
        `- [${p.data.title}](${absoluteUrl(`/products/${p.data.slug}/`)}): HSN ${p.data.hsn}: ${firstSentence(p.data.answer)}`,
      );
    }
    lines.push('');
  }

  lines.push('## Guides', '');
  for (const post of posts) {
    lines.push(`- [${post.data.title}](${absoluteUrl(`/blog/${post.id}/`)}): ${post.data.description}`);
  }
  lines.push('', '## Company', '');
  const company: [string, string, string][] = [
    ['About', '/about/', 'Who we are and how we source from vetted Indian manufacturers'],
    ['Export process', '/export-process/', 'From enquiry to shipment: documents, Incoterms, payment and lead times'],
    ['Private label', '/private-label/', 'Custom brands, packaging and formulations for importers'],
    ['FAQ', '/faq/', 'Answers on MOQs, packaging, shipping and payment'],
    ['Contact', '/contact/', 'Send an enquiry for prices and specification sheets'],
  ];
  for (const [t, u, d] of company) lines.push(`- [${t}](${absoluteUrl(u)}): ${d}`);
  lines.push('', '## Languages', '');
  lines.push('Every page is also published in these languages, at the same path under the language prefix:', '');
  for (const l of LOCALES) lines.push(`- [${l.native === l.english ? l.native : `${l.native} (${l.english})`}](${absoluteUrl(localizePath('/', l.code))}): hreflang ${l.hreflang}`);
  lines.push('');

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
