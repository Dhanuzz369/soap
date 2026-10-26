/** Product and category h1s are composed per language (audit B10): no stitched "Name Exporter…" strings. */
import { describe, it, expect } from 'vitest';
import { composeTitle, splitName } from '../../src/lib/heading';
import { getUi } from '../../src/i18n/ui';
import { LOCALE_CODES } from '../../src/i18n/locales';

const read = (t: ReturnType<typeof composeTitle>) => [t.l1, t.sub, t.l2].filter(Boolean).join(' ');

describe('composeTitle', () => {
  it('puts the name on line 1 and the exporter phrase on line 2 (English)', () => {
    const t = composeTitle(getUi('en').common.titleH1, 'Dish Wash Liquid / Gel');
    expect(t).toMatchObject({ l1: 'Dish Wash Liquid / Gel', l2: 'Exporter & Supplier from India' });
  });

  it('French: colon after the name, lower case after it', () => {
    const t = composeTitle(getUi('fr').common.titleH1, 'Nettoyant sols');
    expect(t.l1).toBe('Nettoyant sols :');
    expect(t.l2).toBe('exportateur et fournisseur depuis l’Inde');
    expect(read(t)).toBe('Nettoyant sols : exportateur et fournisseur depuis l’Inde');
  });

  it('keeps the descriptor in parentheses as the small line, with the colon after it', () => {
    const t = composeTitle(getUi('es').common.titleH1, 'LABSA (ácido alquilbencenosulfónico lineal)');
    expect(t.l1).toBe('LABSA');
    expect(t.sub).toBe('(ácido alquilbencenosulfónico lineal):');
    expect(t.l2).toBe('exportador y proveedor desde la India');
    expect(t.scale).toBe(splitName('LABSA (x)').scale);
  });

  it('German keeps the capitalised nouns; Chinese has no separator', () => {
    expect(read(composeTitle(getUi('de').common.titleH1, 'Bodenreiniger'))).toBe('Bodenreiniger: Exporteur und Lieferant aus Indien');
    expect(read(composeTitle(getUi('zh').common.titleH1, '地板清洁剂'))).toBe('地板清洁剂 印度出口商与供应商');
  });

  for (const lang of LOCALE_CODES) {
    it(`${lang}: the template has {name}, a line break and no stitched capital mid-phrase`, () => {
      const tpl = getUi(lang).common.titleH1;
      expect(tpl).toContain('{name}');
      expect(tpl.split('|')).toHaveLength(2);
      const t = composeTitle(tpl, 'X');
      expect(t.l2.length).toBeGreaterThan(5);
      // Languages that lower-case running text start line 2 in lower case after a colon.
      if (['fr', 'es', 'pt', 'ru', 'tr', 'id', 'sw', 'vi'].includes(lang)) {
        expect(t.l1.endsWith(':'), lang).toBe(true);
        const first = t.l2.replace(/^[^\p{L}]+/u, '')[0];
        if (lang !== 'tr') expect(first, lang).toBe(first.toLocaleLowerCase(lang));
      }
    });
  }
});
