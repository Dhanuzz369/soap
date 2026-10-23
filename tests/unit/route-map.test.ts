import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  MAP_BOUNDS,
  MAP_HEIGHT,
  MAP_WIDTH,
  ORIGINS,
  REGIONS,
  arcPath,
  arcPoint,
  distanceKm,
  dotsPath,
  easeInOut,
  gridPoints,
  nearestOrigin,
  nextRegion,
  project,
  regionArc,
} from '../../src/lib/route-map';
import en from '../../src/i18n/ui/en';

describe('projection and grid', () => {
  it('maps the window corners to the SVG corners', () => {
    expect(project([MAP_BOUNDS.west, MAP_BOUNDS.north])).toEqual({ x: 0, y: 0 });
    expect(project([MAP_BOUNDS.east, MAP_BOUNDS.south])).toEqual({ x: MAP_WIDTH, y: MAP_HEIGHT });
  });
  it('samples a grid inside the window, odd rows shifted half a step', () => {
    const pts = gridPoints(10);
    for (const [lon, lat] of pts) {
      expect(lon).toBeGreaterThan(MAP_BOUNDS.west);
      expect(lon).toBeLessThan(MAP_BOUNDS.east);
      expect(lat).toBeLessThan(MAP_BOUNDS.north);
      expect(lat).toBeGreaterThan(MAP_BOUNDS.south);
    }
    const lats = [...new Set(pts.map((p) => p[1]))];
    const first = (lat: number) => pts.find((p) => p[1] === lat)![0];
    expect(first(lats[1]) - first(lats[0])).toBe(5);
  });
  it('packs dots row by row into one path of zero-length segments', () => {
    expect(dotsPath([{ x: 30, y: 5 }, { x: 10, y: 5 }, { x: 12.5, y: 15 }])).toBe('M10 5h0m20 0h0M12.5 15h0');
    expect(dotsPath([])).toBe('');
  });
});

describe('the committed map SVG', () => {
  const svg = readFileSync(resolve('src/assets/route-map.svg'), 'utf8');
  it('is one light path of 1,500–2,500 dots in the shared viewBox', () => {
    expect(Buffer.byteLength(svg)).toBeLessThan(60 * 1024);
    expect(svg).toContain(`viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}"`);
    expect(svg.match(/<path /g)).toHaveLength(1);
    const dots = (svg.match(/h0/g) ?? []).length;
    expect(dots).toBeGreaterThanOrEqual(1500);
    expect(dots).toBeLessThanOrEqual(2500);
    expect(svg).toContain('Natural Earth');
  });
});

describe('regions and ports', () => {
  it('has the six regions in button order, each with a localized name and ports in English', () => {
    expect(REGIONS.map((r) => r.id)).toEqual(['gulf', 'eastAfrica', 'westAfrica', 'europe', 'southeastAsia', 'latinAmerica']);
    for (const r of REGIONS) {
      expect(en.exportProcess.route.regions[r.id]).toBeTruthy();
      expect(en.exportProcess.route.ports[r.port]).toBeTruthy();
      if ('also' in r) expect(en.exportProcess.route.ports[r.also]).toBeTruthy();
    }
    for (const o of ORIGINS) expect(en.exportProcess.route.ports[o.id]).toBeTruthy();
  });
  it('keeps every port and arc end inside the map', () => {
    for (const r of REGIONS) {
      const { from, to } = regionArc(r);
      for (const p of [from, to]) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(MAP_WIDTH);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(MAP_HEIGHT);
      }
      for (let t = 0; t <= 1; t += 0.05) {
        const p = arcPoint(regionArc(r), t);
        expect(p.y).toBeLessThanOrEqual(MAP_HEIGHT);
        expect(p.y).toBeGreaterThanOrEqual(0);
      }
    }
  });
  it('measures great-circle distance', () => {
    expect(distanceKm([0, 0], [0, 0])).toBe(0);
    expect(distanceKm([0, 0], [90, 0])).toBeCloseTo(10007.5, 0);
  });
  it('leaves from the nearest Indian port', () => {
    const from = Object.fromEntries(REGIONS.map((r) => [r.id, regionArc(r).origin]));
    expect(from.southeastAsia).toBe('chennai');
    expect(from.gulf).toBe('mundra');
    for (const r of REGIONS) {
      const o = nearestOrigin(r.at);
      for (const other of ORIGINS) expect(distanceKm(o.at, r.at)).toBeLessThanOrEqual(distanceKm(other.at, r.at));
    }
  });
});

describe('arc path builder', () => {
  const arc = { from: { x: 0, y: 0 }, via: { x: 50, y: 100 }, to: { x: 100, y: 0 } };
  it('writes one quadratic Bézier', () => {
    expect(arcPath(arc)).toBe('M0 0Q50 100 100 0');
    expect(arcPath(regionArc(REGIONS[0]))).toMatch(/^M[\d.]+ [\d.]+Q[\d.-]+ [\d.-]+ [\d.]+ [\d.]+$/);
  });
  it('finds points and headings along the curve', () => {
    expect(arcPoint(arc, 0)).toMatchObject({ x: 0, y: 0 });
    expect(arcPoint(arc, 1)).toMatchObject({ x: 100, y: 0 });
    expect(arcPoint(arc, 0.5)).toMatchObject({ x: 50, y: 50, angle: 0 });
    expect(arcPoint(arc, 0).angle).toBeCloseTo(63.43, 1);
  });
  it('eases in and out between 0 and 1, clamped', () => {
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(1)).toBe(1);
    expect(easeInOut(0.5)).toBeCloseTo(0.5);
    expect(easeInOut(-1)).toBe(0);
    expect(easeInOut(2)).toBe(1);
    expect(easeInOut(0.1)).toBeLessThan(0.1);
    expect(easeInOut(0.9)).toBeGreaterThan(0.9);
  });
  it('cycles through the regions and wraps', () => {
    expect(nextRegion(0)).toBe(1);
    expect(nextRegion(REGIONS.length - 1)).toBe(0);
  });
});
