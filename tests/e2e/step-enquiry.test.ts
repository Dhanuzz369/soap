/**
 * The step-by-step enquiry form in a real browser (spec 2026-10-27 §7). Run `npm run build` first.
 * The endpoint is mocked with page.route; every request body is recorded.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Browser } from 'playwright-core';
import site from '../../src/config/site';
import { isConfiguredEndpoint } from '../../src/lib/enquiry-send';
import { launch, open, active, label, waitStep, stages, fillContact, pick, ENDPOINT } from './helpers';

let browser: Browser;
beforeAll(async () => {
  browser = await launch();
});
afterAll(async () => {
  await browser?.close();
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('step enquiry form', () => {
  it('contact-first send', async () => {
    const { page, bodies, errors } = await open(browser);
    expect(await label(page)).toBe('Step 1 of 7');
    await fillContact(page);
    await expect.poll(() => bodies.length).toBe(1);
    expect(bodies[0].stage).toBe('contact');
    expect(bodies[0].fields.phone).toBe('+971 50 123 4567');
    expect(bodies[0].fields.name).toBe('Ali Hassan');
    expect(bodies[0].fields.language).toBe('English');
    expect(errors).toEqual([]);
    await page.context().close();
  });

  it('validates step 1 inline and focuses the first invalid field', async () => {
    const { page, bodies } = await open(browser);
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-phone', '12-345');
    await page.click('[data-next]');
    expect(await active(page)).toBe('contact');
    expect(await page.isVisible('[data-error-for="email"]')).toBe(true);
    expect(await page.getAttribute('#enq-email', 'aria-invalid')).toBe('true');
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('enq-email');
    expect(await page.isVisible('[data-error-for="name"]')).toBe(false);
    expect(bodies).toHaveLength(0);
    await page.context().close();
  });

  it('auto-advance and back', async () => {
    const { page } = await open(browser);
    await fillContact(page);
    await pick(page, 'enq-group-kitchen-care');
    expect(await active(page)).toBe('group'); // the selection lands first
    await waitStep(page, 'product');
    expect(await page.isVisible('label:has(> #enq-product-kitchen-care-dish-wash-liquid)')).toBe(true);
    expect(await page.isVisible('label:has(> #enq-product-laundry-care-detergent-powder)')).toBe(false);
    await page.click('[data-back]');
    await waitStep(page, 'group');
    expect(await page.isChecked('#enq-group-kitchen-care')).toBe(true);
    await page.context().close();
  });

  it('re-tapping a selected option still advances', async () => {
    const { page } = await open(browser);
    await fillContact(page);
    await pick(page, 'enq-group-laundry-care');
    await waitStep(page, 'product');
    await page.click('[data-back]');
    await waitStep(page, 'group');
    await pick(page, 'enq-group-laundry-care');
    await waitStep(page, 'product');
    await page.context().close();
  });

  it('back cancels pending auto-advance', async () => {
    const { page } = await open(browser);
    await fillContact(page);
    await pick(page, 'enq-group-kitchen-care');
    await waitStep(page, 'product');
    await pick(page, 'enq-product-kitchen-care-dish-wash-liquid');
    await page.click('[data-back]'); // within 260 ms of the tap
    await waitStep(page, 'group');
    await sleep(500);
    expect(await active(page)).toBe('group');
    await page.context().close();
  });

  it('arrow keys change selection without advancing; Enter advances', async () => {
    const { page } = await open(browser);
    await fillContact(page);
    await page.focus('#enq-group-bath-personal-soaps');
    await page.keyboard.press('Space');
    await waitStep(page, 'product');
    await page.click('[data-back]');
    await waitStep(page, 'group');
    await page.focus('#enq-group-bath-personal-soaps');
    await page.keyboard.press('ArrowRight');
    await sleep(500);
    expect(await active(page)).toBe('group');
    expect(await page.isChecked('#enq-group-laundry-care')).toBe(true);
    await page.keyboard.press('Enter');
    await waitStep(page, 'product');
    expect(await page.isVisible('label:has(> #enq-product-laundry-care-detergent-powder)')).toBe(true);
    await page.context().close();
  });

  it('other option stays on step and focuses its box; something else path skips the product step', async () => {
    const { page } = await open(browser);
    await fillContact(page);
    expect(await page.isVisible('[data-other-for="productOther"]')).toBe(false);
    await pick(page, 'enq-group-other');
    await sleep(500);
    expect(await active(page)).toBe('group');
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('enq-product-other');
    await page.keyboard.type('Hand sanitiser gel');
    await page.keyboard.press('Enter');
    await waitStep(page, 'quantity');
    expect(await label(page)).toBe('Step 3 of 6');
    await page.context().close();
  });

  it('prefill skips: one product from a product page', async () => {
    const { page } = await open(browser, '/contact/?product=dish-wash-liquid');
    expect(await label(page)).toBe('Step 1 of 5');
    await page.fill('#enq-name', 'Ana');
    await page.fill('#enq-phone', '');
    await page.fill('#enq-email', 'ana@example.pt');
    await page.click('[data-next]');
    await waitStep(page, 'quantity');
    expect(await label(page)).toBe('Step 2 of 5');
    await page.context().close();
  });

  it('horeca multi-product prefill', async () => {
    const { page } = await open(browser, '/contact/?product=liquid-hand-wash,floor-cleaner,not-a-product&message=Hotel%20order');
    expect(await label(page)).toBe('Step 1 of 5');
    expect(await page.inputValue('#enq-notes')).toBe('Hotel order');
    await fillContact(page, 'Chen', '+86 138 0000 0000', 'quantity');
    await pick(page, 'enq-quantity-1');
    await waitStep(page, 'destination');
    await page.click('[data-skip]');
    await waitStep(page, 'terms');
    await page.click('[data-skip]');
    await waitStep(page, 'send');
    const chips = await page.$$eval('[data-summary] .sq-chip', (c) => c.map((x) => x.textContent?.trim()));
    expect(chips).toHaveLength(2);
    expect(chips.join(' ')).toMatch(/Liquid Hand Wash/);
    await page.click('[data-summary] .sq-chip button');
    expect(await page.$$eval('[data-summary] .sq-chip', (c) => c.length)).toBe(1);
    await page.click('[data-summary] .sq-chip button');
    await waitStep(page, 'group');
    expect(await label(page)).toBe('Step 2 of 7');
    await page.context().close();
  });

  it('a known variety is recorded; an unknown one is ignored', async () => {
    const { page, bodies } = await open(browser, '/contact/?product=dish-wash-liquid&variety=Green%20apple');
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.click('[data-next]');
    await waitStep(page, 'quantity');
    await expect.poll(() => bodies.length).toBe(1);
    expect(bodies[0].fields.variety).toBe('green-apple');
    expect(bodies[0].fields.product).toBe('Dish Wash Liquid / Gel');
    const other = await open(browser, '/contact/?product=dish-wash-liquid&variety=chocolate');
    await other.page.fill('#enq-name', 'Ali');
    await other.page.fill('#enq-email', 'ali@example.ae');
    await other.page.click('[data-next]');
    await expect.poll(() => other.bodies.length).toBe(1);
    expect(other.bodies[0].fields.variety).toBeUndefined();
    await page.context().close();
    await other.page.context().close();
  });

  it('full flow one leadId', async () => {
    const { page, bodies, errors } = await open(browser);
    await fillContact(page);
    await pick(page, 'enq-group-kitchen-care');
    await waitStep(page, 'product');
    await pick(page, 'enq-product-kitchen-care-dish-wash-liquid');
    await waitStep(page, 'quantity');
    await pick(page, 'enq-quantity-2-5');
    await waitStep(page, 'destination');
    await page.fill('#enq-country', 'keny');
    await page.waitForSelector('#enq-country-list li');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    expect(await page.inputValue('#enq-country')).toBe('Kenya');
    await page.fill('#enq-port', 'Mombasa');
    await page.keyboard.press('Enter');
    await waitStep(page, 'terms');
    await pick(page, 'enq-terms-not-sure');
    await waitStep(page, 'send');
    const summary = await page.textContent('[data-summary]');
    expect(summary).toContain('Dish Wash Liquid');
    expect(summary).toContain('Kenya');
    await pick(page, 'enq-brand-maybe');
    await sleep(400);
    expect(await active(page)).toBe('send'); // no auto-advance on the last step
    await page.fill('#enq-notes', 'Lemon, 500 ml');
    await page.click('[data-send]');
    await page.waitForSelector('[data-success]:not([hidden])');
    expect(await page.textContent('[data-success] h3')).toContain('Ali Hassan');
    expect(await page.evaluate(() => document.activeElement?.closest('[data-success]') !== null)).toBe(true);
    expect(stages(bodies)).toEqual(['contact', 'group', 'product', 'quantity', 'destination', 'terms', 'submitted']);
    expect(new Set(bodies.map((b) => b.leadId)).size).toBe(1);
    const last = bodies.at(-1)!;
    expect(last.fields).toMatchObject({ country: 'Kenya', countryCode: 'KE', port: 'Mombasa', terms: 'Not sure, advise me', privateLabel: 'Maybe', quantity: '2–5 containers', notes: 'Lemon, 500 ml', group: 'Kitchen Care' });
    // A new enquiry after sending starts a new row.
    expect(await page.evaluate(() => sessionStorage.getItem('goodbiz-enquiry-lead'))).not.toBe(last.leadId);
    expect(errors).toEqual([]);
    await page.context().close();
  });

  it('reload keeps leadId and step-1 fields', async () => {
    const { page, bodies } = await open(browser);
    await fillContact(page, 'Grace', '+254 700 000 001');
    await pick(page, 'enq-group-laundry-care');
    await waitStep(page, 'product');
    await page.reload();
    await page.waitForSelector('form.is-enhanced');
    expect(await active(page)).toBe('contact');
    expect(await page.inputValue('#enq-name')).toBe('Grace');
    expect(await page.inputValue('#enq-phone')).toBe('+254 700 000 001');
    expect(await page.isChecked('#enq-group-laundry-care')).toBe(false);
    await page.click('[data-next]');
    await waitStep(page, 'group');
    await expect.poll(() => bodies.length).toBe(3);
    expect(new Set(bodies.map((b) => b.leadId)).size).toBe(1);
    await page.context().close();
  });

  it('double click sends once', async () => {
    const { page, bodies } = await open(browser, '/contact/?product=sles');
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.click('[data-next]');
    for (let i = 0; i < 3; i++) await page.click('[data-skip]');
    await waitStep(page, 'send');
    await page.dblclick('[data-send]');
    await page.keyboard.press('Enter');
    await page.waitForSelector('[data-success]:not([hidden])');
    await sleep(300);
    expect(stages(bodies).filter((s) => s === 'submitted')).toHaveLength(1);
    await page.context().close();
  });

  it('min delay: a fast send is held until 3 s after load, never dropped', async () => {
    const { page, bodies } = await open(browser, '/contact/?product=sles');
    const t0 = await page.evaluate(() => performance.now());
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.click('[data-next]');
    for (let i = 0; i < 3; i++) await page.click('[data-skip]');
    await page.click('[data-send]');
    expect(await page.getAttribute('[data-send]', 'aria-busy')).toBe('true');
    await page.waitForSelector('[data-success]:not([hidden])');
    const t1 = await page.evaluate(() => performance.now());
    expect(t0).toBeLessThan(3000);
    expect(t1).toBeGreaterThanOrEqual(3000);
    expect(stages(bodies).filter((s) => s === 'submitted')).toHaveLength(1);
    await page.context().close();
  });

  for (const mock of [500, 'hang'] as const) {
    it(`failure fallback (${mock})`, async () => {
      const { page } = await open(browser, '/contact/?product=sles', { mock, timeout: 1500 });
      await page.fill('#enq-name', 'Fatima');
      await page.fill('#enq-email', 'fatima@example.ma');
      await page.click('[data-next]');
      for (let i = 0; i < 3; i++) await page.click('[data-skip]');
      await page.click('[data-send]');
      await page.waitForSelector('[data-fail]:not([hidden])', { timeout: 10_000 });
      expect(await page.isVisible('[data-success]')).toBe(false);
      const wa = await page.getAttribute('[data-send-whatsapp]', 'href');
      expect(decodeURIComponent(wa ?? '')).toContain('Name: Fatima');
      expect(decodeURIComponent(wa ?? '')).toContain('SLES');
      expect(await page.getAttribute('[data-send-email]', 'href')).toMatch(/^mailto:.*body=.*Fatima/);
      await page.context().close();
    });
  }

  it('no endpoint: the early WhatsApp line after step 1, and Send shows the fallback', async () => {
    const { page, bodies } = await open(browser, '/contact/', { mock: 'none' });
    let requests = 0;
    page.on('request', (r) => r.method() === 'POST' && requests++);
    expect(await page.isVisible('[data-wa-early]')).toBe(false);
    await fillContact(page, 'Omar', '+20 100 000 0000');
    expect(await page.isVisible('[data-wa-early]')).toBe(true);
    expect(decodeURIComponent((await page.getAttribute('[data-wa-early] a', 'href')) ?? '')).toContain('Name: Omar');
    for (let i = 0; i < 5; i++) await page.click('[data-skip]');
    await waitStep(page, 'send');
    await page.click('[data-send]');
    await page.waitForSelector('[data-fail]:not([hidden])');
    expect(bodies).toHaveLength(0);
    expect(requests).toBe(0);
    await page.context().close();
  });

  it('honeypot shows success without fetch', async () => {
    const { page, bodies } = await open(browser, '/contact/?product=sles');
    await page.fill('#enq-name', 'Bot');
    await page.fill('#enq-email', 'bot@example.com');
    await page.click('[data-next]');
    await expect.poll(() => bodies.length).toBe(1);
    for (let i = 0; i < 3; i++) await page.click('[data-skip]');
    await page.evaluate(() => ((document.querySelector('input[name="website_confirm"]') as HTMLInputElement).checked = true));
    await page.click('[data-send]');
    await page.waitForSelector('[data-success]:not([hidden])');
    await sleep(300);
    expect(stages(bodies)).not.toContain('submitted');
    await page.context().close();
  });

  it('no-js: every step shows and the form posts to the Sheet endpoint (mailto: while there is none)', async () => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('http://localhost:4329/contact/');
    const sections = await page.$$('section[data-step]');
    expect(sections).toHaveLength(7);
    for (const s of sections) expect(await s.isVisible()).toBe(true);
    const endpoint = isConfiguredEndpoint(site.enquiry.endpoint) ? site.enquiry.endpoint : '';
    expect(await page.getAttribute('form[data-step-enquiry]', 'action')).toBe(endpoint || `mailto:${site.contact.email}`);
    expect(await page.isVisible('[data-next]')).toBe(false);
    expect(await page.isVisible('[data-send]')).toBe(true);
    expect(await page.isVisible('#enq-product-other')).toBe(true);
    await context.close();
  });

  it('rtl mirrors direction', async () => {
    const { page, errors } = await open(browser, '/ar/contact/');
    expect(await page.$eval('[data-progress]', (e) => getComputedStyle(e).transformOrigin)).toMatch(/^\d+(\.\d+)?px /);
    const [origin, width] = await page.$eval('[data-progress]', (e) => [parseFloat(getComputedStyle(e).transformOrigin), (e as HTMLElement).offsetWidth]);
    expect(origin).toBeCloseTo(width, 0);
    await page.fill('#enq-name', 'محمد');
    await page.fill('#enq-phone', '+966 50 000 0000');
    // Going forward, the incoming step slides in from the left in RTL (negative x), from the right in LTR.
    const firstFrame = () =>
      page.evaluate(() => {
        (document.querySelector('[data-next]') as HTMLButtonElement).click();
        const step = document.querySelector('section[data-step][data-active]');
        const anim = step?.getAnimations().find((a) => (a.effect as KeyframeEffect).getKeyframes()[0]?.transform);
        return String((anim?.effect as KeyframeEffect | undefined)?.getKeyframes()[0]?.transform ?? '');
      });
    expect(await firstFrame()).toBe('translateX(-16px)');
    expect(await page.$eval('.sq-back-arr', (e) => getComputedStyle(e).transform)).toMatch(/^matrix\(-1/);
    const ltr = await open(browser, '/contact/');
    await ltr.page.fill('#enq-name', 'Ali');
    await ltr.page.fill('#enq-phone', '+971 50 123 4567');
    expect(
      await ltr.page.evaluate(() => {
        (document.querySelector('[data-next]') as HTMLButtonElement).click();
        const step = document.querySelector('section[data-step][data-active]');
        const anim = step?.getAnimations().find((a) => (a.effect as KeyframeEffect).getKeyframes()[0]?.transform);
        return String((anim?.effect as KeyframeEffect | undefined)?.getKeyframes()[0]?.transform ?? '');
      }),
    ).toBe('translateX(16px)');
    await ltr.page.context().close();
    expect(errors).toEqual([]);
    await page.context().close();
  });

  it('no sideways scroll at 360 px', async () => {
    for (const path of ['/contact/', '/ar/contact/']) {
      const { page } = await open(browser, path, { context: { viewport: { width: 360, height: 780 } } });
      await fillContact(page);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(over, path).toBeLessThanOrEqual(0);
      await page.context().close();
    }
  });

  it('only posts to the configured endpoint', () => {
    expect(ENDPOINT).toMatch(/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/);
  });
});

describe('review fixes', () => {
  for (const slug of ['constructor', '__proto__', 'toString']) {
    it(`?product=${slug} still gives a working form`, async () => {
      const { page, bodies, errors } = await open(browser, `/contact/?product=${slug}`);
      expect(await label(page)).toBe('Step 1 of 7');
      await fillContact(page);
      await expect.poll(() => bodies.length).toBe(1);
      expect(errors).toEqual([]);
      await page.context().close();
    });
  }

  it('if the script fails to start, the long form shows instead of an empty card', async () => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.addInitScript(() => {
      crypto.randomUUID = () => {
        throw new Error('broken');
      };
    });
    await page.goto('http://localhost:4329/contact/');
    await page.waitForTimeout(800);
    expect(await page.$eval('form[data-step-enquiry]', (f) => f.classList.contains('is-enhanced'))).toBe(false);
    for (const s of await page.$$('section[data-step]')) expect(await s.isVisible()).toBe(true);
    expect(await page.isVisible('[data-next]')).toBe(false);
    expect(await page.isVisible('[data-send]')).toBe(true);
    expect(await page.isVisible('#enq-product-other')).toBe(true);
    await context.close();
  });

  it('an Enter pressed earlier in a field never blocks a later tap', async () => {
    const { page } = await open(browser, '/contact/?product=sles');
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-phone', '+971 50 123 4567');
    await page.focus('#enq-phone');
    await page.keyboard.press('Enter');
    await waitStep(page, 'quantity');
    await pick(page, 'enq-quantity-1');
    await waitStep(page, 'destination');
    await page.context().close();
  });

  it('a changed answer is sent with its cleared counterpart', async () => {
    const { page, bodies } = await open(browser);
    await fillContact(page);
    await pick(page, 'enq-group-kitchen-care');
    await waitStep(page, 'product');
    await pick(page, 'enq-product-kitchen-care-dish-wash-liquid');
    await waitStep(page, 'quantity');
    await page.click('[data-back]');
    await waitStep(page, 'product');
    await page.click('[data-back]');
    await waitStep(page, 'group');
    await pick(page, 'enq-group-other');
    await page.keyboard.type('Sanitiser gel');
    await page.keyboard.press('Enter');
    await waitStep(page, 'quantity');
    await expect.poll(() => bodies.length).toBe(4);
    const last = bodies.at(-1)!;
    expect(last.stage).toBe('group');
    expect(last.fields).toMatchObject({ group: 'Something else', productOther: 'Sanitiser gel', product: '' });
    // a cleared contact field travels as an empty value
    expect(last.fields.email).toBe('');
    await page.context().close();
  });

  it('removing the product its variety belongs to clears the variety', async () => {
    const { page, bodies } = await open(browser, '/contact/?product=dish-wash-liquid,floor-cleaner&variety=green-apple');
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.click('[data-next]');
    for (let i = 0; i < 3; i++) await page.click('[data-skip]');
    await waitStep(page, 'send');
    await page.click('[data-summary] .sq-chip button'); // Dish Wash Liquid first
    // focus stays on the chips
    expect(await page.evaluate(() => document.activeElement?.closest('.sq-chip') !== null)).toBe(true);
    await page.click('[data-send]');
    await page.waitForSelector('[data-success]:not([hidden])');
    const last = bodies.at(-1)!;
    expect(last.stage).toBe('submitted');
    expect(last.fields.variety).toBe('');
    expect(last.fields.product).toBe('Floor Cleaner');
    await page.context().close();
  });

  it('after the fallback panel, a second enquiry starts a new lead', async () => {
    const { page, bodies } = await open(browser, '/contact/?product=sles', { mock: 500 });
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.click('[data-next]');
    for (let i = 0; i < 3; i++) await page.click('[data-skip]');
    await page.click('[data-send]');
    await page.waitForSelector('[data-fail]:not([hidden])');
    const sent = bodies.at(-1)!.leadId;
    expect(await page.evaluate(() => sessionStorage.getItem('goodbiz-enquiry-lead'))).not.toBe(sent);
    await page.context().close();
  });

  it('a link with other products starts a new lead; a reload of the same link does not', async () => {
    const { page, bodies } = await open(browser, '/contact/?product=sles');
    await fillContact(page, 'Ali', '+971 50 123 4567', 'quantity');
    await expect.poll(() => bodies.length).toBe(1);
    await page.reload();
    await page.waitForSelector('form.is-enhanced');
    await page.click('[data-next]');
    await expect.poll(() => bodies.length).toBe(2);
    expect(bodies[1].leadId).toBe(bodies[0].leadId);
    await page.goto('http://localhost:4329/contact/?product=labsa');
    await page.waitForSelector('form.is-enhanced');
    await page.click('[data-next]');
    await expect.poll(() => bodies.length).toBe(3);
    expect(bodies[2].leadId).not.toBe(bodies[0].leadId);
    await page.context().close();
  });

  it('an unanswered choice step marks its radio group and announces the error', async () => {
    const { page } = await open(browser);
    await fillContact(page);
    await page.click('[data-next]');
    const group = '[role="radiogroup"][data-group="group"]';
    expect(await page.getAttribute(group, 'aria-invalid')).toBe('true');
    expect(await page.getAttribute(group, 'aria-describedby')).toContain('enq-err-group');
    const msg = await page.textContent('[data-error-for="group"]');
    expect(msg?.trim()).toBeTruthy();
    expect(await page.textContent('[data-status]')).toBe(msg);
    await pick(page, 'enq-group-laundry-care');
    expect(await page.getAttribute(group, 'aria-invalid')).toBeNull();
    await page.context().close();
  });

  it('on phones the floating WhatsApp button stays out of the way of the form', async () => {
    const { page } = await open(browser, '/contact/?product=sles', { context: { viewport: { width: 375, height: 812 } } });
    await page.fill('#enq-name', 'Ali');
    await page.fill('#enq-email', 'ali@example.ae');
    await page.click('[data-next]');
    for (let i = 0; i < 3; i++) await page.click('[data-skip]');
    await waitStep(page, 'send');
    await page.$eval('[data-summary] .sq-edit', (e) => e.scrollIntoView({ block: 'end' }));
    await page.waitForTimeout(400);
    expect(await page.$eval('.wa-fab', (e) => getComputedStyle(e).visibility)).toBe('hidden');
    await page.context().close();
  });
});
