/**
 * The enquiry form with the keyboard alone (spec 2026-10-28 §5). Run `npm run build` first.
 * No test here moves or clicks the mouse: every action is a key press, and a counter in the page
 * proves that no pointer event happened.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Browser, Page } from 'playwright-core';
import { launch, open, active, waitStep, BASE } from './helpers';

let browser: Browser;
beforeAll(async () => {
  browser = await launch();
});
afterAll(async () => {
  await browser?.close();
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const focusedId = (page: Page) => page.evaluate(() => document.activeElement?.id ?? '');
const focused = (page: Page) =>
  page.evaluate(() => {
    const e = document.activeElement as HTMLElement | null;
    return e ? { id: e.id, cls: e.className, tag: e.tagName.toLowerCase(), text: (e.getAttribute('aria-label') ?? e.textContent ?? '').trim(), data: Object.keys(e.dataset).join(','), name: (e as HTMLInputElement).name ?? '' } : null;
  });
const checkedKey = (page: Page, name: string) => page.evaluate((n) => document.querySelector<HTMLInputElement>(`input[name="${n}"]:checked`)?.dataset.key ?? null, name);
/** Counts real pointer and mouse presses in the page. */
async function countPointer(page: Page) {
  await page.evaluate(() => {
    (window as unknown as { __pointer: number }).__pointer = 0;
    for (const t of ['pointerdown', 'mousedown']) addEventListener(t, (e) => e.isTrusted && (window as unknown as { __pointer: number }).__pointer++, true);
  });
}
const pointerCount = (page: Page) => page.evaluate(() => (window as unknown as { __pointer: number }).__pointer);
async function tabUntil(page: Page, test: (f: Awaited<ReturnType<typeof focused>>) => boolean, max = 30, key = 'Tab') {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press(key);
    const f = await focused(page);
    if (test(f)) return f;
  }
  throw new Error('focus never got there');
}

/** The whole enquiry, start to finish, with keys only. `next`/`prev` are the arrow keys for this direction. */
async function keyboardFlow(path: string, next: string) {
  const { page, bodies, errors } = await open(browser, path);
  await countPointer(page);
  // From the top of the page: skip link to content, then the form's own skip link.
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement?.getAttribute('href'))).toBe('#main');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement?.getAttribute('href'))).toBe('#enquiry');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  expect(await focusedId(page)).toBe('enq-name');
  await page.keyboard.type('Ali Hassan');
  await page.keyboard.press('Tab'); // company
  await page.keyboard.press('Tab'); // email
  expect(await focusedId(page)).toBe('enq-email');
  await page.keyboard.type('ali@example.ae');
  await page.keyboard.press('Enter'); // Enter in a text field is Next
  await waitStep(page, 'group');
  expect(await focusedId(page)).toBe('enq-h-group');
  expect(await page.textContent('[data-status]')).toMatch(/2/);
  // One tab stop into the cards; an arrow moves the choice without advancing.
  await page.keyboard.press('Tab');
  expect(await focusedId(page)).toBe('enq-group-bath-personal-soaps');
  await page.keyboard.press(next);
  expect(await focusedId(page)).toBe('enq-group-laundry-care');
  await sleep(450);
  expect(await active(page)).toBe('group');
  await page.keyboard.press('Enter');
  await waitStep(page, 'product');
  expect(await focusedId(page)).toBe('enq-h-product');
  await page.keyboard.press('Tab');
  expect(await focusedId(page)).toBe('enq-product-laundry-care-laundry-soap-bar');
  await page.keyboard.press(next);
  await page.keyboard.press(' ');
  await waitStep(page, 'quantity');
  await page.keyboard.press('Tab');
  await page.keyboard.press(next);
  await page.keyboard.press('Enter');
  await waitStep(page, 'destination');
  await page.keyboard.press('Tab');
  expect(await focusedId(page)).toBe('enq-country');
  await page.keyboard.type('keny');
  await page.waitForSelector('#enq-country-list li');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  expect(await focusedId(page)).toBe('enq-port');
  await page.keyboard.type('Mombasa');
  await page.keyboard.press('Enter');
  await waitStep(page, 'terms');
  await page.keyboard.press('Tab');
  expect(await focusedId(page)).toBe('enq-terms-not-sure');
  await page.keyboard.press('Enter');
  await waitStep(page, 'send');
  expect(await focusedId(page)).toBe('enq-h-send');
  await page.keyboard.press('Tab');
  expect(await focusedId(page)).toBe('enq-notes');
  await page.keyboard.type('Lemon, 500 ml');
  await page.keyboard.press('Tab');
  expect(await focusedId(page)).toBe('enq-brand-yes');
  await page.keyboard.press(' ');
  await sleep(400);
  expect(await active(page)).toBe('send');
  // Tab order: the summary's Edit buttons, then Send.
  const edits: string[] = [];
  const send = await tabUntil(page, (f) => {
    if (f?.cls === 'sq-edit') edits.push(f.text);
    return f?.data.includes('send') ?? false;
  });
  expect(send?.tag).toBe('button');
  expect(edits).toHaveLength(5); // contact, product, quantity, destination, terms
  await page.keyboard.press('Enter');
  await page.waitForSelector('[data-success]:not([hidden])');
  expect(await page.evaluate(() => document.activeElement?.matches('[data-success] h3'))).toBe(true);
  expect(bodies.at(-1)!.fields).toMatchObject({ group: 'Laundry Care', countryCode: 'KE', port: 'Mombasa', privateLabel: 'Yes', notes: 'Lemon, 500 ml' });
  expect(await pointerCount(page)).toBe(0);
  expect(errors).toEqual([]);
  await page.context().close();
}

describe('keyboard-only enquiry', () => {
  it('English, start to finish, without the mouse', () => keyboardFlow('/contact/', 'ArrowRight'));
  it('Arabic, start to finish, without the mouse (Left is forward)', () => keyboardFlow('/ar/contact/', 'ArrowLeft'));

  it('option groups: Home/End, wrap-around, and Up/Down; nothing advances', async () => {
    const { page } = await open(browser);
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.focus('#enq-email');
    await page.keyboard.press('Enter');
    await waitStep(page, 'group');
    await page.keyboard.press('Tab');
    await page.keyboard.press('End');
    expect(await focusedId(page)).toBe('enq-group-other');
    expect(await checkedKey(page, 'group')).toBe('other');
    await page.keyboard.press('Home');
    expect(await focusedId(page)).toBe('enq-group-bath-personal-soaps');
    await page.keyboard.press('ArrowLeft'); // wraps to the last
    expect(await focusedId(page)).toBe('enq-group-other');
    await page.keyboard.press('ArrowRight'); // wraps to the first
    expect(await focusedId(page)).toBe('enq-group-bath-personal-soaps');
    await page.keyboard.press('ArrowDown');
    expect(await focusedId(page)).toBe('enq-group-laundry-care');
    await page.keyboard.press('ArrowUp');
    expect(await focusedId(page)).toBe('enq-group-bath-personal-soaps');
    await sleep(450);
    expect(await active(page)).toBe('group');
    expect(await checkedKey(page, 'group')).toBe('bath-personal-soaps');
    await page.context().close();
  });

  it('Arabic mirrors Left and Right', async () => {
    const { page } = await open(browser, '/ar/contact/');
    await page.fill('#enq-name', 'محمد');
    await page.fill('#enq-phone', '+966 50 000 0000');
    await page.focus('#enq-phone');
    await page.keyboard.press('Enter');
    await waitStep(page, 'group');
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowLeft');
    expect(await focusedId(page)).toBe('enq-group-laundry-care');
    await page.keyboard.press('ArrowRight');
    expect(await focusedId(page)).toBe('enq-group-bath-personal-soaps');
    await page.keyboard.press('ArrowRight'); // wraps to the last
    expect(await focusedId(page)).toBe('enq-group-other');
    await page.context().close();
  });

  it('tabbing through options never selects or advances', async () => {
    const { page } = await open(browser);
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.focus('#enq-email');
    await page.keyboard.press('Enter');
    await waitStep(page, 'group');
    for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await sleep(450);
    expect(await active(page)).toBe('group');
    expect(await checkedKey(page, 'group')).toBeNull();
    await page.context().close();
  });

  it('one tab stop for the product pills, even after the range was changed', async () => {
    const { page } = await open(browser);
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.focus('#enq-email');
    await page.keyboard.press('Enter');
    await waitStep(page, 'group');
    await page.keyboard.press('Tab'); // bath soaps
    await page.keyboard.press('Enter');
    await waitStep(page, 'product');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter'); // first bath soap
    await waitStep(page, 'quantity');
    await page.evaluate(() => (document.querySelector('[data-back]') as HTMLElement).focus());
    await page.keyboard.press('Enter');
    await waitStep(page, 'product');
    await page.evaluate(() => (document.querySelector('[data-back]') as HTMLElement).focus());
    await page.keyboard.press('Enter');
    await waitStep(page, 'group');
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowRight'); // laundry
    await page.keyboard.press('Enter');
    await waitStep(page, 'product');
    await page.keyboard.press('Tab');
    expect(await focusedId(page)).toMatch(/^enq-product-laundry-care-/);
    await page.context().close();
  });

  it('Shift+Tab from Next reaches Back', async () => {
    const { page } = await open(browser);
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.focus('#enq-email');
    await page.keyboard.press('Enter');
    await waitStep(page, 'group');
    await page.focus('[data-next]');
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => document.activeElement?.hasAttribute('data-skip'))).toBe(true);
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => document.activeElement?.hasAttribute('data-back'))).toBe(true);
    await page.keyboard.press('Enter');
    await waitStep(page, 'contact');
    expect(await focusedId(page)).toBe('enq-h-contact');
    await page.context().close();
  });

  it('Escape closes the country suggestions and keeps the text; Escape in an "other" box is harmless', async () => {
    const { page } = await open(browser, '/contact/?product=sles');
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.focus('#enq-email');
    await page.keyboard.press('Enter');
    await waitStep(page, 'quantity');
    await page.keyboard.press('Tab');
    await page.keyboard.press('End'); // "Another amount"
    expect(await checkedKey(page, 'quantity')).toBe('other');
    await page.keyboard.press('Tab');
    expect(await focusedId(page)).toBe('enq-quantity-other-text');
    await page.keyboard.type('3 pallets');
    await page.keyboard.press('Escape');
    expect(await page.inputValue('#enq-quantity-other-text')).toBe('3 pallets');
    expect(await active(page)).toBe('quantity');
    expect(await focusedId(page)).toBe('enq-quantity-other-text');
    await page.keyboard.press('Enter');
    await waitStep(page, 'destination');
    await page.keyboard.press('Tab');
    await page.keyboard.type('ken');
    await page.waitForSelector('#enq-country-list li');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    expect(await page.isVisible('#enq-country-list')).toBe(false);
    expect(await page.getAttribute('#enq-country', 'aria-expanded')).toBe('false');
    expect(await page.inputValue('#enq-country')).toBe('ken');
    expect(await focusedId(page)).toBe('enq-country');
    await page.keyboard.press('Escape');
    expect(await page.inputValue('#enq-country')).toBe('ken');
    expect(await active(page)).toBe('destination');
    // Tab leaves the field (no trap) and closes the list.
    await page.keyboard.type('y');
    await page.waitForSelector('#enq-country-list li');
    await page.keyboard.press('Tab');
    expect(await focusedId(page)).toBe('enq-port');
    await page.waitForSelector('#enq-country-list', { state: 'hidden', timeout: 1000 });
    await page.context().close();
  });

  it('after an error, focus goes to the first invalid group', async () => {
    const { page } = await open(browser);
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.focus('#enq-email');
    await page.keyboard.press('Enter');
    await waitStep(page, 'group');
    await page.focus('[data-next]');
    await page.keyboard.press('Enter');
    expect(await focusedId(page)).toBe('enq-group-bath-personal-soaps');
    await page.context().close();
  });

  it('after Edit, Next returns to the summary with focus on that row’s Edit button', async () => {
    const { page } = await open(browser, '/contact/?product=sles');
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.focus('#enq-email');
    await page.keyboard.press('Enter');
    await waitStep(page, 'quantity');
    for (const step of ['quantity', 'destination', 'terms']) {
      await page.focus('[data-skip]');
      await page.keyboard.press('Enter');
      await waitStep(page, step === 'quantity' ? 'destination' : step === 'destination' ? 'terms' : 'send');
    }
    const edit = await tabUntil(page, (f) => /Quantity$/.test(f?.text ?? ''));
    expect(edit?.tag).toBe('button');
    await page.keyboard.press('Enter');
    await waitStep(page, 'quantity');
    expect(await focusedId(page)).toBe('enq-h-quantity');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter'); // first quantity: selects and advances
    await waitStep(page, 'send');
    expect(await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))).toBe('Edit: Quantity');
    // and the same with the Next button instead of a choice
    await page.keyboard.press('Enter');
    await waitStep(page, 'quantity');
    await page.focus('[data-next]');
    await page.keyboard.press('Enter');
    await waitStep(page, 'send');
    expect(await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))).toBe('Edit: Quantity');
    await page.context().close();
  });

  it('after Send fails, focus moves to the fallback heading', async () => {
    const { page } = await open(browser, '/contact/?product=sles', { mock: 500 });
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.focus('#enq-email');
    await page.keyboard.press('Enter');
    for (const s of ['destination', 'terms', 'send']) {
      await page.focus('[data-skip]');
      await page.keyboard.press('Enter');
      await waitStep(page, s);
    }
    await page.focus('[data-send]');
    await page.keyboard.press('Enter');
    await page.waitForSelector('[data-fail]:not([hidden])', { timeout: 10_000 });
    expect(await focusedId(page)).toBe('enq-fail-h');
    await page.context().close();
  });
});

describe('nothing hidden is focusable', () => {
  it('inactive steps are inert, including the step that is fading out', async () => {
    const { page } = await open(browser);
    const inactiveInert = () => page.$$eval('section[data-step]:not([data-active])', (s) => s.every((x) => (x as HTMLElement).inert));
    expect(await inactiveInert()).toBe(true);
    expect(await page.$eval('section[data-step][data-active]', (s) => (s as HTMLElement).inert)).toBe(false);
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    // Right after Next, the old step is still on screen for its fade: it must not take focus.
    const leaked = await page.evaluate(() => {
      (document.querySelector('[data-next]') as HTMLButtonElement).click();
      const name = document.getElementById('enq-name') as HTMLInputElement;
      name.focus();
      return document.activeElement === name;
    });
    expect(leaked).toBe(false);
    await waitStep(page, 'group');
    expect(await inactiveInert()).toBe(true);
    await page.context().close();
  });

  it('Tab never lands inside an inactive step or on an invisible element', async () => {
    const { page } = await open(browser);
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.focus('#enq-email');
    await page.keyboard.press('Enter');
    await waitStep(page, 'group');
    const bad: string[] = [];
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      const r = await page.evaluate(() => {
        const e = document.activeElement as HTMLElement;
        const s = e.closest('section[data-step]');
        const rect = e.getBoundingClientRect();
        const style = getComputedStyle(e);
        const radioLabel = e.matches('input[type=radio]') ? e.closest('label')!.getBoundingClientRect() : rect;
        return { id: e.id || e.className, inactive: !!s && !s.hasAttribute('data-active'), invisible: style.visibility === 'hidden' || radioLabel.width === 0 || radioLabel.height === 0 };
      });
      if (r.inactive || r.invisible) bad.push(JSON.stringify(r));
    }
    expect(bad).toEqual([]);
    await page.context().close();
  });
});

describe('focus is always visible', () => {
  it('every control in the form shows a ring of at least 3:1 on the card, not clipped', async () => {
    const { page } = await open(browser, '/contact/?product=sles,labsa');
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    // after the fields' 120 ms box-shadow transition
    const check = async () => {
      await page.waitForTimeout(250);
      return page.evaluate(() => {
        const lum = (c: string) => {
          const [r, g, b] = (c.match(/[\d.]+/g) ?? ['0', '0', '0']).slice(0, 3).map((x) => {
            const v = Number(x) / 255;
            return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const ratio = (a: string, b: string) => {
          const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
          return (x + 0.05) / (y + 0.05);
        };
        const e = document.activeElement as HTMLElement;
        const target = e.matches('input[type=radio]') ? (e.closest('.sq-opt-item') as HTMLElement) : e;
        const s = getComputedStyle(target);
        const card = getComputedStyle(document.querySelector('form.sq')!).backgroundColor;
        let color = '';
        if (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2) color = s.outlineColor;
        else if (/inset 0px 0px 0px 2px|0px 0px 0px 2px/.test(s.boxShadow) || /\s2px(\s|$)/.test(s.boxShadow)) color = s.boxShadow.match(/rgba?\([^)]*\)/)?.[0] ?? '';
        // clipped by an ancestor that hides overflow?
        const pad = 6;
        const r = target.getBoundingClientRect();
        let clipped = '';
        for (let a = target.parentElement; a && a !== document.body; a = a.parentElement) {
          const o = getComputedStyle(a);
          if (o.overflowX !== 'visible' || o.overflowY !== 'visible') {
            const ar = a.getBoundingClientRect();
            if (r.left - pad < ar.left || r.right + pad > ar.right || r.top - pad < ar.top || r.bottom + pad > ar.bottom) clipped = a.className || a.tagName;
          }
        }
        return { el: e.id || e.className || e.tagName, color, ratio: color ? ratio(color, card) : 0, clipped };
      });
    };
    const seen: Awaited<ReturnType<typeof check>>[] = [];
    // step 1 fields, the notice's link and the footer buttons
    await page.focus('#enq-name');
    for (let i = 0; i < 7; i++) {
      seen.push(await check());
      await page.keyboard.press('Tab');
    }
    await page.focus('[data-next]');
    await page.keyboard.press('Enter');
    await waitStep(page, 'quantity');
    await page.keyboard.press('Tab');
    seen.push(await check()); // a pill
    for (const s of ['destination', 'terms']) {
      await page.focus('[data-skip]');
      await page.keyboard.press('Enter');
      await waitStep(page, s);
    }
    await page.keyboard.press('Tab');
    seen.push(await check()); // a terms card
    await page.focus('[data-skip]');
    await page.keyboard.press('Enter');
    await waitStep(page, 'send');
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      seen.push(await check()); // notes, brand pill, chip remove buttons, Edit, Send
    }
    const bad = seen.filter((s) => s.ratio < 3 || s.clipped);
    expect(bad).toEqual([]);
    await page.context().close();
  });
});

describe('page-level keyboard', () => {
  it('the contact page has a "Skip to the enquiry form" link right after the main skip link', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto(BASE + '/contact/');
    const skips = await page.$$eval('a.skip', (a) => a.map((x) => [x.getAttribute('href'), x.textContent?.trim()]));
    expect(skips).toEqual([
      ['#main', 'Skip to content'],
      ['#enquiry', 'Skip to the enquiry form'],
    ]);
    expect(await page.$('main#main')).not.toBeNull();
    await context.close();
  });

  it('no keyboard trap: Tab runs from the top of the contact page to the footer, through the WhatsApp button and language menu', async () => {
    const { page } = await open(browser);
    await countPointer(page);
    const seen = new Set<string>();
    let wrapped = false;
    for (let i = 0; i < 160; i++) {
      await page.keyboard.press('Tab');
      const key = await page.evaluate(() => {
        const e = document.activeElement as HTMLElement;
        if (e === document.body) return 'BODY';
        return e.matches('.wa-fab') ? 'WA' : e.matches('.lang-btn') ? 'LANG' : e.getAttribute('href') === '#top' ? 'TOP' : e.id || e.className || e.tagName;
      });
      if (key === 'BODY' || (seen.has('TOP') && key === 'LANG' && seen.has('LANG'))) {
        wrapped = true;
        break;
      }
      seen.add(key);
    }
    expect(seen.has('TOP')).toBe(true);
    expect(seen.has('LANG')).toBe(true);
    // the language menu opens with Enter and Escape closes it, returning focus
    await page.focus('.lang-btn');
    await page.keyboard.press('Enter');
    expect(await page.$eval('[data-lang-switch]', (d) => (d as HTMLDetailsElement).open)).toBe(true);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Escape');
    expect(await page.$eval('[data-lang-switch]', (d) => (d as HTMLDetailsElement).open)).toBe(false);
    expect(await page.evaluate(() => document.activeElement?.matches('.lang-btn'))).toBe(true);
    expect(wrapped || seen.size > 20).toBe(true);
    expect(await pointerCount(page)).toBe(0);
    await page.context().close();
  });
});

describe('HoReCa list with the keyboard', () => {
  it('tick with Space, remove a chip with Enter, Clear with Enter; focus stays in the list', async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto(BASE + '/horeca/');
    await page.evaluate(() => localStorage.removeItem('gb-horeca'));
    await page.reload();
    const first = await page.$eval('input[data-pick]', (i) => i.id);
    await page.focus(`#${first}`);
    await page.keyboard.press('Space');
    expect(await page.$$eval('[data-picked] li', (l) => l.length)).toBe(1);
    const ring = await page.$eval(`#${first}`, (i) => {
      const box = (i.closest('label') ?? i) as HTMLElement;
      const s = getComputedStyle(i);
      const b = getComputedStyle(box);
      return s.outlineStyle !== 'none' || b.outlineStyle !== 'none' || s.boxShadow !== 'none' || b.boxShadow !== 'none';
    });
    expect(ring).toBe(true);
    await page.focus('[data-picked] li button');
    await page.keyboard.press('Enter');
    expect(await page.$$eval('[data-picked] li', (l) => l.length)).toBe(0);
    expect(await page.evaluate(() => document.activeElement?.matches('[data-type]'))).toBe(true);
    await page.focus(`#${first}`);
    await page.keyboard.press('Space');
    await page.focus('[data-clear]');
    await page.keyboard.press('Enter');
    expect(await page.$$eval('[data-picked] li', (l) => l.length)).toBe(0);
    expect(await page.evaluate(() => document.activeElement?.matches('[data-type]'))).toBe(true);
    await context.close();
  });
});
