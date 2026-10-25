import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import site from '../../src/config/site';
import { resolveRegistrations, memberOfJsonLd, registrationsLlmsLine, svgSize } from '../../src/lib/registrations';
import { LOCALE_CODES } from '../../src/i18n/locales';
import { getUi } from '../../src/i18n/ui';

describe('registrations config', () => {
  it('lists the four registrations with official sites, in order', () => {
    expect(site.showRegistrations).toBe(true);
    expect(site.registrations.map((r) => r.id)).toEqual(['fieo', 'msme', 'chemexcil', 'dgft']);
    for (const r of site.registrations) {
      expect(r.url).toMatch(/^https:\/\/(www\.)?(fieo\.org|udyamregistration\.gov\.in|msme\.gov\.in|chemexcil\.in|dgft\.gov\.in)\/$/);
      expect(r.name.length).toBeGreaterThan(0);
      expect(r.fullName.length).toBeGreaterThan(0);
    }
  });
  it('never allows a DGFT logo', () => {
    const dgft = site.registrations.find((r) => r.id === 'dgft')!;
    expect(dgft.logoAllowed).toBe(false);
    expect(dgft.logo).toBeUndefined();
  });
  it('holds no registration numbers (no digits in names, urls or logo paths)', () => {
    for (const r of site.registrations) expect(JSON.stringify(r)).not.toMatch(/\d/);
  });
  it('every language has the strip text, without digits', () => {
    for (const code of LOCALE_CODES) {
      const R = getUi(code).registrations;
      expect(JSON.stringify(R), code).not.toMatch(/\d/);
      for (const id of ['fieo', 'msme', 'chemexcil', 'dgft'] as const) expect(R.status[id].length, `${code} ${id}`).toBeGreaterThan(0);
      expect(R.opens).toContain('{name}');
    }
  });
});

describe('resolveRegistrations', () => {
  let root: string;
  beforeAll(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'regs-'));
    fs.mkdirSync(path.join(root, 'public/images/registrations'), { recursive: true });
  });
  afterAll(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (name: string, body: string | Buffer) => fs.writeFileSync(path.join(root, 'public/images/registrations', name), body);

  it('uses no logo while no file exists', () => {
    for (const r of resolveRegistrations(root)) expect(r.logoSrc).toBeUndefined();
  });
  it('uses a logo only when its file exists, with its aspect ratio', () => {
    put('fieo.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"></svg>');
    const r = resolveRegistrations(root);
    expect(r.find((x) => x.id === 'fieo')).toMatchObject({ logoSrc: '/images/registrations/fieo.svg', aspect: 2 });
    expect(r.find((x) => x.id === 'chemexcil')!.logoSrc).toBeUndefined();
  });
  it('accepts msme.png when msme.svg is missing', () => {
    // 1x1 PNG
    put('msme.png', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64'));
    expect(resolveRegistrations(root).find((x) => x.id === 'msme')).toMatchObject({ logoSrc: '/images/registrations/msme.png', aspect: 1 });
  });
  it('never returns a logo for DGFT, even when the file exists', () => {
    put('dgft.svg', '<svg viewBox="0 0 10 10"></svg>');
    put('dgft.png', Buffer.from('x'));
    const list = site.registrations.map((r) => (r.id === 'dgft' ? { ...r, logo: '/images/registrations/dgft.svg' } : r));
    expect(resolveRegistrations(root, list).find((x) => x.id === 'dgft')!.logoSrc).toBeUndefined();
  });
  it('returns nothing when showRegistrations is false', () => {
    expect(resolveRegistrations(root, site.registrations, false)).toEqual([]);
    expect(memberOfJsonLd(site.registrations, false)).toEqual([]);
    expect(registrationsLlmsLine(site.registrations, false)).toBeUndefined();
  });
});

describe('helpers', () => {
  it('memberOf covers FIEO and CHEMEXCIL only, with name and url', () => {
    const m = memberOfJsonLd();
    expect(m).toHaveLength(2);
    expect(m.map((x) => x.url)).toEqual(['https://www.fieo.org/', 'https://www.chemexcil.in/']);
    for (const x of m) expect(x['@type']).toBe('Organization');
    expect(JSON.stringify(m)).not.toMatch(/\d/);
  });
  it('llms line', () => {
    expect(registrationsLlmsLine()).toBe('Registered with: FIEO (member), MSME Udyam, CHEMEXCIL (RCMC holder), DGFT (IEC)');
  });
  it('reads SVG sizes', () => {
    expect(svgSize('<svg width="120px" height="40">')).toEqual({ width: 120, height: 40 });
    expect(svgSize('<svg viewBox="0 0 300 100">')).toEqual({ width: 300, height: 100 });
    expect(svgSize('<div>')).toBeUndefined();
  });
});
