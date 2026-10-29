/**
 * Decorative images (blur placeholders, background drawings, a thumbnail beside its own label)
 * have an empty alt so screen readers skip them. role="presentation" says the same thing
 * explicitly, which some AI and accessibility checkers look for. Run over the built pages by the
 * integration in astro.config.mjs, so no template can forget it.
 */
const EMPTY_ALT = /\salt(?:=""|(?=[\s/>]))/;

export function markDecorative(html: string): string {
  return html.replace(/<img\b[^>]*>/g, (tag) => {
    if (!EMPTY_ALT.test(tag) || /\srole=/.test(tag)) return tag;
    return tag.replace(/\s*(\/?)>$/, (_m, slash) => ` role="presentation"${slash}>`);
  });
}
