/**
 * The destination step's country field: a WAI-ARIA 1.2 combobox with list autocomplete.
 * Suggestions are country names in the page's language (src/lib/countries.ts); picking one stores
 * its ISO code and English name for the team. Free text is kept when nothing matches.
 * Keys: ArrowDown / ArrowUp move, Enter picks, Escape closes. Without JS it is a plain text field.
 */
import { countryNames, fold, suggestCountries, type Country } from '../lib/countries';

export type CountryValue = { country: string; countryCode: string };

export function initCountryCombobox(input: HTMLInputElement, list: HTMLUListElement, code: HTMLInputElement, lang: string) {
  let items: Country[] = [];
  let index = -1;
  let picked: Country | null = null;

  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', list.id);

  const close = () => {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    index = -1;
  };

  const mark = (i: number) => {
    index = i;
    list.querySelectorAll('li').forEach((li, j) => li.setAttribute('aria-selected', String(j === i)));
    if (i >= 0) input.setAttribute('aria-activedescendant', `${list.id}-${i}`);
    else input.removeAttribute('aria-activedescendant');
  };

  const pick = (c: Country) => {
    picked = c;
    input.value = c.name;
    code.value = c.code;
    close();
  };

  const render = () => {
    items = suggestCountries(input.value, lang, 6);
    list.replaceChildren(
      ...items.map((c, i) => {
        const li = document.createElement('li');
        li.id = `${list.id}-${i}`;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        li.append(c.name);
        if (fold(c.en) !== fold(c.name)) {
          const en = document.createElement('small');
          en.lang = 'en';
          en.textContent = c.en;
          li.append(en);
        }
        // Keep focus in the field while choosing with a pointer.
        li.addEventListener('pointerdown', (e) => e.preventDefault());
        li.addEventListener('click', () => pick(c));
        return li;
      }),
    );
    const open = items.length > 0;
    list.hidden = !open;
    input.setAttribute('aria-expanded', String(open));
    mark(-1);
  };

  input.addEventListener('input', () => {
    picked = null;
    code.value = '';
    render();
  });
  input.addEventListener('keydown', (e) => {
    const open = !list.hidden;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!open) render();
      if (!items.length) return;
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      mark((index + step + items.length) % items.length);
    } else if (e.key === 'Enter' && open && index >= 0) {
      e.preventDefault();
      e.stopPropagation(); // picking is not "Next"
      pick(items[index]);
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  });
  input.addEventListener('blur', () => setTimeout(close, 0));

  /** The country as GoodBiz reads it: the English name and code when known, else the typed text. */
  return {
    value(): CountryValue {
      const typed = input.value.trim();
      if (picked && typed === picked.name) return { country: picked.en, countryCode: picked.code };
      const f = fold(typed);
      const exact = f ? countryNames(lang).find((c) => fold(c.name) === f || fold(c.en) === f) : undefined;
      return exact ? { country: exact.en, countryCode: exact.code } : { country: typed, countryCode: '' };
    },
    /** The name shown to the buyer (summary). */
    label(): string {
      return input.value.trim();
    },
  };
}
