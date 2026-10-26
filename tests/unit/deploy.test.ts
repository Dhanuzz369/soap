import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import site from '../../src/config/site';
import { buildVercelConfig, isLaunched, isProductionBuild, isRealDomain, vercelEnv, VERCEL_APP_HOST, SECURITY_HEADERS } from '../../src/lib/deploy';
import { launched } from '../../src/lib/launch';

const committed = JSON.parse(readFileSync(resolve('vercel.json'), 'utf8'));
const hostRe = new RegExp(`^${VERCEL_APP_HOST}$`);

describe('launch decision (launchReady AND a production build)', () => {
  it('treats Vercel production and builds outside Vercel as production', () => {
    expect(isProductionBuild(undefined)).toBe(true);
    expect(isProductionBuild('')).toBe(true);
    expect(isProductionBuild('production')).toBe(true);
    expect(isProductionBuild('preview')).toBe(false);
    expect(isProductionBuild('development')).toBe(false);
  });

  it('launches only when launchReady is true and the build is production', () => {
    expect(isLaunched(true, 'production')).toBe(true);
    expect(isLaunched(true, undefined)).toBe(true);
    expect(isLaunched(true, 'preview')).toBe(false);
    expect(isLaunched(true, 'development')).toBe(false);
    expect(isLaunched(false, 'production')).toBe(false);
    expect(isLaunched(false, undefined)).toBe(false);
  });

  it('reads VERCEL_ENV from the environment', () => {
    expect(vercelEnv({ VERCEL_ENV: 'preview' })).toBe('preview');
    expect(vercelEnv({ VERCEL_ENV: ' ' })).toBeUndefined();
    expect(vercelEnv({})).toBeUndefined();
  });

  it('this (local) build follows launchReady', () => {
    if (!process.env.VERCEL_ENV) expect(launched).toBe(site.launchReady);
  });
});

describe('isRealDomain', () => {
  it('accepts a public https domain', () => {
    expect(isRealDomain('https://www.goodbizhygiene.com')).toBe(true);
    expect(isRealDomain('https://goodbizhygiene.co.in/')).toBe(true);
  });
  it('rejects placeholders, vercel.app, local and example hosts', () => {
    for (const u of [
      'https://soap-gules.vercel.app',
      'http://www.goodbizhygiene.com',
      'https://localhost:4321',
      'https://127.0.0.1',
      'https://www.example.com',
      'https://shop.test',
      'https://PLACEHOLDER.com',
      'not a url',
    ])
      expect(isRealDomain(u), u).toBe(false);
  });
});

describe('vercel.json', () => {
  it('matches src/config/site.ts (run `npm run vercel:config` after changing url or launchReady)', () => {
    expect(committed).toEqual(buildVercelConfig({ url: site.url, launchReady: site.launchReady }));
  });

  it('uses trailing slashes as the canonical form', () => {
    expect(committed.trailingSlash).toBe(true);
  });

  it('sends the security headers on every path', () => {
    const all = committed.headers.find((h: { source: string; has?: unknown }) => h.source === '/(.*)' && !h.has);
    expect(all).toBeTruthy();
    const keys = Object.fromEntries(all.headers.map((h: { key: string; value: string }) => [h.key.toLowerCase(), h.value]));
    expect(keys['x-content-type-options']).toBe('nosniff');
    expect(keys['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(keys['permissions-policy']).toMatch(/camera=\(\)/);
    expect(keys['x-frame-options']).toBe('DENY');
    expect(keys['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(SECURITY_HEADERS.length).toBe(5);
  });

  it('caches fonts for a year (immutable) and images for a week', () => {
    const cc = (src: string) => committed.headers.find((h: { source: string }) => h.source === src)?.headers[0].value;
    expect(cc('/fonts/(.*)')).toMatch(/max-age=31536000.*immutable/);
    expect(cc('/images/(.*)')).toMatch(/max-age=604800/);
  });

  it('always sends X-Robots-Tag noindex on *.vercel.app hosts', () => {
    for (const launchReady of [false, true]) {
      const cfg = buildVercelConfig({ url: 'https://www.goodbizhygiene.com', launchReady });
      const rule = cfg.headers.find((h) => h.has?.[0]?.type === 'host');
      expect(rule?.headers).toEqual([{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]);
      expect(rule!.has![0].value).toBe(VERCEL_APP_HOST);
    }
    expect(hostRe.test('soap-gules.vercel.app')).toBe(true);
    expect(hostRe.test('soap-git-fix-seo-audit-goodbiz.vercel.app')).toBe(true);
    expect(hostRe.test('www.goodbizhygiene.com')).toBe(false);
  });

  it('redirects *.vercel.app (308) to the real domain only once launchReady is true', () => {
    expect(buildVercelConfig({ url: 'https://www.goodbizhygiene.com', launchReady: false }).redirects).toEqual([]);
    expect(buildVercelConfig({ url: 'https://soap-gules.vercel.app', launchReady: true }).redirects).toEqual([]);
    const r = buildVercelConfig({ url: 'https://www.goodbizhygiene.com/', launchReady: true }).redirects;
    expect(r).toEqual([{ source: '/:path*', has: [{ type: 'host', value: VERCEL_APP_HOST }], destination: 'https://www.goodbizhygiene.com/:path*', permanent: true }]);
  });
});
