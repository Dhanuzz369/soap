/**
 * Plain-text files for AI assistants and answer engines (GEO), following https://llmstxt.org:
 *
 *   /llms.txt          English summary: who GoodBiz Hygiene is, key facts, and a link to every
 *                      product, range, guide and company page.
 *   /<lang>/llms.txt   the same in each language, linking to that language's pages.
 *   /llms-full.txt     English, the complete factual text as clean Markdown: every product with its
 *                      specifications, packs, MOQ, private label and FAQs, the export terms and
 *                      process, private label, the HoReCa page (by space) and the company FAQs.
 *
 * The company is always named the same way (ui.seo.entity). Contact details appear only once they
 * are real (site.contactIsPlaceholder false).
 */
import site from '../config/site';
import { absoluteUrl } from './seo';
import { getProductsByCategory } from './products';
import { getPosts } from './blog';
import { getFaqGroups } from './faqs';
import { LOCALES, localizePath, DEFAULT_LOCALE, type Locale } from '../i18n/locales';
import { getUi, fmt } from '../i18n/ui';
import { SPACES } from './horeca';
import { registrationsLlmsLine } from './registrations';

const firstSentence = (s: string) => (s.match(/^.*?[.!?。](?=\s+\S|\s*$)/su)?.[0] ?? s).trim();
/** Markdown body with site links made absolute (for text read outside the site). */
const absolutize = (md: string, lang: Locale = DEFAULT_LOCALE) =>
  md.replace(/\]\((\/[^)\s]*)\)/g, (_m, href: string) => `](${absoluteUrl(localizePath(href, lang))})`).trim();

function quickFacts(lang: Locale): string[] {
  const ui = getUi(lang);
  const Q = ui.quickFacts;
  const t = ui.terms;
  return [
    [Q.what, Q.whatValue],
    [Q.hsn, Q.hsnValue],
    [Q.terms, t.incoterms],
    [Q.port, t.port],
    [Q.moq, Q.moqValue],
    [Q.lead, t.leadTime],
  ].map(([k, v]) => `- **${k}:** ${v}`);
}

const contactLines = () =>
  site.contactIsPlaceholder
    ? []
    : [`- Email: ${site.contact.email}`, `- Phone / WhatsApp: ${site.contact.phone}`, `- Address: ${site.contact.address}`];

/**
 * The HoReCa page by space: "- Space: product (packs), product (packs)" lines, with links to the
 * product pages when `link` is given. Products and pack names in the page's language.
 */
async function horecaSpaces(lang: Locale, link: boolean): Promise<string[]> {
  const ui = getUi(lang);
  const lp = (p: string) => absoluteUrl(localizePath(p, lang));
  const products = (await getProductsByCategory(lang)).flatMap((g) => g.products);
  return SPACES.map((s) => {
    const items = s.products.map((sp) => {
      const p = products.find((x) => x.data.slug === sp.slug)!;
      const packs = sp.packs.map((i) => p.data.packSizes[i]).filter(Boolean).join(', ');
      const name = link ? `[${p.data.title}](${lp(`/products/${sp.slug}/`)})` : p.data.title;
      return `${name} (${packs})`;
    });
    return `- **${ui.horeca.spaces[s.id].name}:** ${items.join('; ')}`;
  });
}

/** /llms.txt (English) and /<lang>/llms.txt. */
export async function buildLlmsIndex(lang: Locale = DEFAULT_LOCALE): Promise<string> {
  const ui = getUi(lang);
  const en = lang === DEFAULT_LOCALE;
  const lp = (p: string) => absoluteUrl(localizePath(p, lang));
  const groups = await getProductsByCategory(lang);
  const posts = await getPosts(lang);
  const H = en
    ? { facts: 'Key facts', products: 'Products', guides: 'Guides', company: 'Company', languages: 'Languages', full: 'Full text' }
    : { facts: ui.quickFacts.heading, products: ui.common.products, guides: ui.header.nav.guides, company: ui.footer.company, languages: ui.lang.label, full: 'Full text (English)' };

  const lines: string[] = [`# ${site.name}`, '', `> ${ui.seo.entity}`, '', `## ${H.facts}`, '', ...quickFacts(lang), ''];
  const contact = contactLines();
  if (contact.length) lines.push(...contact, '');
  const reg = registrationsLlmsLine(ui.registrations);
  if (reg) lines.push(reg, '');

  lines.push(`## ${H.products}`, '');
  for (const { category, products } of groups) {
    lines.push(`### [${category.data.title}](${lp(`/categories/${category.data.slug}/`)})`, '');
    for (const p of products) {
      lines.push(`- [${p.data.title}](${lp(`/products/${p.data.slug}/`)}): HSN ${p.data.hsn}: ${firstSentence(p.data.answer)}`);
    }
    lines.push('');
  }

  lines.push(`## ${H.guides}`, '');
  for (const post of posts) lines.push(`- [${post.data.title}](${lp(`/blog/${post.id}/`)}): ${post.data.description}`);

  lines.push('', `## ${H.company}`, '');
  const company: [string, string, string][] = [
    [ui.header.nav.about, '/about/', ui.about.description],
    [ui.header.nav.exportProcess, '/export-process/', ui.exportProcess.description],
    [ui.header.nav.privateLabel, '/private-label/', ui.privateLabel.description],
    [ui.header.nav.faq, '/faq/', ui.faqPage.description],
    [ui.footer.contact, '/contact/', ui.contact.description],
  ];
  for (const [t, u, d] of company) lines.push(`- [${t}](${lp(u)}): ${d}`);

  // Hotels, restaurants and cafés: the HoReCa page, by space.
  lines.push('', `## ${ui.header.nav.horeca}`, '', `- [${ui.horeca.title}](${lp('/horeca/')}): ${ui.horeca.llms} ${ui.horeca.roomsNote}`, '', ...(await horecaSpaces(lang, false)));

  lines.push('', `## ${H.full}`, '', `- [llms-full.txt](${absoluteUrl('/llms-full.txt')}): ${en ? 'every product, specification, term and FAQ as Markdown, in English' : 'English'}`);

  lines.push('', `## ${H.languages}`, '');
  if (en) lines.push('Every page is also published in these languages, at the same path under the language prefix:', '');
  for (const l of LOCALES)
    lines.push(`- [${l.native === l.english ? l.native : `${l.native} (${l.english})`}](${absoluteUrl(localizePath('/', l.code))}): hreflang ${l.hreflang}, ${absoluteUrl(l.code === DEFAULT_LOCALE ? '/llms.txt' : `/${l.code}/llms.txt`)}`);
  lines.push('');
  return lines.join('\n');
}

/** /llms-full.txt: everything an assistant needs to answer questions about the range, in English. */
export async function buildLlmsFull(): Promise<string> {
  const ui = getUi(DEFAULT_LOCALE);
  const groups = await getProductsByCategory(DEFAULT_LOCALE);
  const posts = await getPosts(DEFAULT_LOCALE);
  const t = ui.terms;
  const out: string[] = [
    `# ${site.name}: full product and export reference`,
    '',
    `> ${ui.seo.entity}`,
    '',
    `Website: ${absoluteUrl('/')}. Parent company: ${site.parentName}${site.facts.parentUrl ? ` (${site.facts.parentUrl})` : ''}. Sister brand: GoodBiz Agro (agricultural exports).`,
    'Specifications on this page are typical values for export grades; final values are confirmed with the manufacturer for each order and stated on the quotation. No prices are published: send an enquiry for a quotation.',
    '',
    '## Key facts',
    '',
    ...quickFacts(DEFAULT_LOCALE),
    ...contactLines(),
    ...(registrationsLlmsLine(ui.registrations) ? ['', registrationsLlmsLine(ui.registrations)!] : []),
    '',
    '## Export terms',
    '',
    `- Incoterms and payment: ${t.incoterms}.`,
    `- Payment: ${t.payment}.`,
    `- Ports: ${t.port}.`,
    `- Lead time: ${t.leadTime}.`,
    '',
    '## Ranges',
    '',
  ];
  for (const { category, products } of groups) {
    out.push(`- **${category.data.title}** (HSN ${category.data.hsnRange}, ${products.length} products): ${category.data.intro} ${absoluteUrl(`/categories/${category.data.slug}/`)}`);
  }
  out.push('');

  for (const { category, products } of groups) {
    out.push(`## ${category.data.title}`, '');
    for (const p of products) {
      const d = p.data;
      out.push(`### ${d.title}`, '');
      out.push(`URL: ${absoluteUrl(`/products/${d.slug}/`)}`, '');
      out.push(d.answer, '');
      out.push(`- **HSN code:** ${d.hsn}. ${d.hsnNote ?? 'The 8-digit ITC-HS code is confirmed per order.'}`);
      out.push(`- **Varieties:** ${d.variants.join('; ')}`);
      out.push(`- **Pack sizes:** ${d.packSizes.join('; ')}`);
      out.push(`- **Packaging:** ${d.packaging.join('; ')}`);
      out.push(`- **Minimum order:** ${d.moq}`);
      out.push(`- **Private label:** ${d.privateLabel.available ? `available. ${d.privateLabel.options.join('; ')}.` : 'not offered for this product.'}`);
      if (d.containerLoad) out.push(`- **Container loading (approx.):** 20 ft: ${d.containerLoad.ft20}. 40 ft: ${d.containerLoad.ft40}.`);
      if (d.uses.length) out.push(`- **Uses:** ${d.uses.join('; ')}`);
      if (d.markets.length) out.push(`- **Typical markets:** ${d.markets.join('; ')}`);
      out.push('', '| Specification (typical) | Value |', '| --- | --- |', ...d.specs.map((s) => `| ${s.label} | ${s.value.replace(/\|/g, '/')} |`), '');
      out.push(absolutize((p.body ?? '').replace(/^##\s+/gm, '#### ')), '');
      out.push('#### Questions buyers ask', '');
      for (const f of d.faqs) out.push(`**${f.q}**`, '', f.a, '');
    }
  }

  const E = ui.exportProcess;
  out.push('## Export process', '', E.processIntro, '');
  E.steps.forEach((s, i) => out.push(`${i + 1}. **${s.name}.** ${fmt(s.text, t)}`));
  out.push('', `Documents: ${E.documents.join('; ')}. ${E.docsText}`, '');
  for (const f of E.faqs) out.push(`**${fmt(f.q, t)}**`, '', fmt(f.a, t), '');

  const L = ui.privateLabel;
  out.push('## Private label', '', L.lead, '');
  for (const o of L.options) out.push(`- **${o.title}:** ${o.text}`);
  out.push('');
  L.steps.forEach((s, i) => out.push(`${i + 1}. **${s.name}.** ${fmt(s.text, t)}`));
  out.push('');
  for (const f of L.faqs) out.push(`**${fmt(f.q, t)}**`, '', fmt(f.a, t), '');

  const R = ui.horeca;
  out.push('## For hotels, restaurants and cafés (HoReCa)', '', `URL: ${absoluteUrl('/horeca/')}`, '', `${R.llms} ${R.roomsNote}`, '', `${R.lead}`, '');
  out.push(...(await horecaSpaces(DEFAULT_LOCALE, true)), '', R.bulkNote, '');
  for (const p of R.promises) out.push(`- **${p.title}:** ${p.text}`);
  out.push('', `${R.samplesH}. ${R.samplesText} ${fmt(R.samplesLead, t)}`, '');
  for (const f of R.faqs) out.push(`**${f.q}**`, '', f.a, '');

  out.push('## Company FAQ', '');
  for (const g of getFaqGroups(DEFAULT_LOCALE)) {
    out.push(`### ${g.heading}`, '');
    for (const f of g.faqs) out.push(`**${f.q}**`, '', f.a, '');
  }

  out.push('## Buyer guides', '');
  for (const post of posts) {
    out.push(`### ${post.data.title}`, '', `URL: ${absoluteUrl(`/blog/${post.id}/`)}`, '', post.data.description, '');
    for (const f of post.data.faqs ?? []) out.push(`**${f.q}**`, '', f.a, '');
  }

  out.push('## About', '', ui.about.what1, '', ui.about.what2, '', fmt(ui.about.familyText, { parent: site.parentName }), '');
  out.push(`## ${ui.about.vetH}`, '', `URL: ${absoluteUrl('/about/#how-we-vet')}`, '', ui.about.vetLead, '', ...ui.about.vetSteps.map((s) => `- **${s.title}.** ${s.text}`), '');
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}
