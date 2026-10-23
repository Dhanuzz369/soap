import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  DOT_STEP,
  MAP_BOUNDS,
  MAP_HEIGHT,
  MAP_SCALE,
  MAP_WIDTH,
  ORIGINS,
  REGIONS,
  catmullRom,
  cubicPoint,
  dotsPath,
  easeInOut,
  gridPoints,
  landDotsAt,
  nextRegion,
  parseDots,
  project,
  regionRoute,
  routeDuration,
  routeLength,
  routePath,
  sampleRoute,
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
  it('leaves from the agreed Indian port for each region', () => {
    const from = Object.fromEntries(REGIONS.map((r) => [r.id, regionRoute(r).origin]));
    expect(from).toEqual({
      gulf: 'mundra',
      eastAfrica: 'nhavaSheva',
      westAfrica: 'nhavaSheva',
      europe: 'mundra',
      southeastAsia: 'chennai',
      latinAmerica: 'nhavaSheva',
    });
  });
  it('keeps every route inside the map', () => {
    for (const r of REGIONS) {
      for (const p of sampleRoute(regionRoute(r).segments, 200)) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(MAP_WIDTH);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(MAP_HEIGHT);
      }
    }
  });
});

describe('routes stay at sea', () => {
  const svg = readFileSync(resolve('src/assets/route-map.svg'), 'utf8');
  const land = parseDots(svg.match(/\sd="([^"]+)"/)![1]);
  /** Ports sit on the coast, so the first and last ~2° of a route may touch their own land dot. */
  const PORT_CLEARANCE = 9;

  it('reads the same land dots the map draws', () => {
    expect(land.length).toBe((svg.match(/h0/g) ?? []).length);
    expect(dotsPath(land)).toBe(svg.match(/\sd="([^"]+)"/)![1]);
  });
  it('finds a land dot under a point on land and none at sea', () => {
    expect(landDotsAt(project([20, 11]), land).length).toBeGreaterThan(0); // Chad
    expect(landDotsAt(project([65, 1]), land)).toEqual([]); // Indian Ocean
  });
  it.each(REGIONS.map((r) => [r.id, r] as const))('%s: no sample of the route falls on a land dot', (_id, r) => {
    const { points, segments } = regionRoute(r);
    const [a, b] = [points[0], points[points.length - 1]];
    const samples = sampleRoute(segments, 200);
    expect(samples.length).toBeGreaterThanOrEqual(190);
    const onLand = samples
      .filter((p) => Math.hypot(p.x - a.x, p.y - a.y) > PORT_CLEARANCE && Math.hypot(p.x - b.x, p.y - b.y) > PORT_CLEARANCE)
      .filter((p) => landDotsAt(p, land).length > 0)
      .map((p) => [(p.x / MAP_SCALE + MAP_BOUNDS.west).toFixed(1), (MAP_BOUNDS.north - p.y / MAP_SCALE).toFixed(1)].join(','));
    expect(onLand).toEqual([]);
  });
  it('keeps the port clearance under one grid step', () => {
    expect(PORT_CLEARANCE).toBeLessThan(DOT_STEP * MAP_SCALE);
  });
});

describe('route path builder', () => {
  const pts = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }];
  it('runs a smooth curve through every waypoint', () => {
    const segs = catmullRom(pts);
    expect(segs).toHaveLength(2);
    expect(segs[0].from).toEqual(pts[0]);
    expect(segs[0].to).toEqual(pts[1]);
    expect(segs[1].to).toEqual(pts[2]);
    // smooth: the tangents either side of a waypoint are parallel
    const out = { x: segs[1].c1.x - pts[1].x, y: segs[1].c1.y - pts[1].y };
    const into = { x: pts[1].x - segs[0].c2.x, y: pts[1].y - segs[0].c2.y };
    expect(out.x * into.y - out.y * into.x).toBeCloseTo(0, 6);
  });
  it('does not overshoot at a tight corner (centripetal)', () => {
    const segs = catmullRom([{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 101, y: 1 }, { x: 101, y: 100 }]);
    for (const s of segs) for (let t = 0; t <= 1; t += 0.05) expect(cubicPoint(s, t).x).toBeLessThanOrEqual(103);
  });
  it('writes one move and one C per segment', () => {
    expect(routePath(catmullRom(pts))).toMatch(/^M0 0C[\d. -]+C[\d. -]+$/);
    expect(routePath([])).toBe('');
    for (const r of REGIONS) expect((routePath(regionRoute(r).segments).match(/C/g) ?? []).length).toBe(r.via.length + 1);
  });
  it('samples about n points and measures length', () => {
    const segs = catmullRom([{ x: 0, y: 0 }, { x: 300, y: 0 }]);
    expect(sampleRoute(segs, 200).length).toBe(201);
    expect(routeLength(segs)).toBeCloseTo(300, 0);
  });
  it('scales the draw time with length, 800ms to 1.6s', () => {
    expect(routeDuration(0)).toBe(800);
    expect(routeDuration(5000)).toBe(1600);
    const ms = REGIONS.map((r) => routeDuration(routeLength(regionRoute(r).segments)));
    const by = Object.fromEntries(REGIONS.map((r, i) => [r.id, ms[i]]));
    expect(by.gulf).toBeLessThan(by.europe);
    expect(by.europe).toBeLessThan(by.latinAmerica);
    for (const m of ms) expect(m).toBeLessThanOrEqual(1600);
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
