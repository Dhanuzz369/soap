/**
 * "The route": the /export-process/ hero's map (src/components/RouteHero.astro), as pure data.
 * Shared by the build-time map generator (scripts/make-route-map.mjs, run with Node's type
 * stripping) and the page, so the dots, the ports and the arcs use one projection.
 * Unit-tested in tests/unit/route-map.test.ts.
 *
 * Honesty: the arcs are stylised quadratic curves, not navigational routes. No transit times or
 * freight prices are attached to them anywhere.
 */

/** The map window, in degrees: Brazil's coast to Indonesia, the North Sea to below the Cape. */
export const MAP_BOUNDS = { west: -56, east: 118, north: 58, south: -42 } as const;
/** SVG units per degree (equirectangular: the same on both axes). */
export const MAP_SCALE = 5;
export const MAP_WIDTH = (MAP_BOUNDS.east - MAP_BOUNDS.west) * MAP_SCALE;
export const MAP_HEIGHT = (MAP_BOUNDS.north - MAP_BOUNDS.south) * MAP_SCALE;
/** Dot grid step in degrees; odd rows shift by half a step (a hex-like grid). */
export const DOT_STEP = 2;

export type LonLat = readonly [lon: number, lat: number];
export type Point = { x: number; y: number };

/** Equirectangular projection into the map's SVG units (x to the east, y down). */
export function project([lon, lat]: LonLat): Point {
  return { x: round((lon - MAP_BOUNDS.west) * MAP_SCALE), y: round((MAP_BOUNDS.north - lat) * MAP_SCALE) };
}

const round = (n: number) => Math.round(n * 10) / 10;

/** The dot grid's sample points (longitude, latitude), row by row from the north. */
export function gridPoints(step = DOT_STEP): LonLat[] {
  const out: LonLat[] = [];
  let row = 0;
  for (let lat = MAP_BOUNDS.north - step / 2; lat > MAP_BOUNDS.south; lat -= step, row++) {
    const shift = row % 2 ? step / 2 : 0;
    for (let lon = MAP_BOUNDS.west + step / 2 + shift; lon < MAP_BOUNDS.east; lon += step) out.push([lon, lat]);
  }
  return out;
}

/**
 * Packs dots into one compact SVG path: per row an absolute move to the first dot, then relative
 * moves; each dot is a zero-length segment (`h0`) drawn by a round stroke cap.
 */
export function dotsPath(points: readonly Point[]): string {
  const rows = new Map<number, number[]>();
  for (const p of points) rows.set(p.y, [...(rows.get(p.y) ?? []), p.x]);
  const fmt = (n: number) => String(round(n));
  let d = '';
  for (const [y, xs] of [...rows].sort((a, b) => a[0] - b[0])) {
    xs.sort((a, b) => a - b);
    d += `M${fmt(xs[0])} ${fmt(y)}h0`;
    for (let i = 1; i < xs.length; i++) d += `m${fmt(xs[i] - xs[i - 1])} 0h0`;
  }
  return d;
}

/** Indian ports the arcs leave from. */
export const ORIGINS = [
  { id: 'nhavaSheva', at: [72.95, 18.95] },
  { id: 'mundra', at: [69.72, 22.74] },
  { id: 'chennai', at: [80.29, 13.1] },
] as const satisfies readonly { id: string; at: LonLat }[];
export type OriginId = (typeof ORIGINS)[number]['id'];

/**
 * Destination regions, in the order of the buttons. `from` is the Indian port the route leaves
 * (Mundra for the Gulf and Europe, Nhava Sheva for Africa and Latin America, Chennai for
 * Southeast Asia); `port` is where it ends and `also` a second port named in the label.
 * `via` are sea waypoints (lon, lat) along the usual lanes: Hormuz, the Red Sea and Suez, the
 * Cape of Good Hope, the Strait of Malacca. A smooth curve runs through them (catmullRom), and
 * tests/unit/route-map.test.ts checks that no part of any route sits on a land dot.
 * Stylised, not navigational: no transit times or prices are attached to any route.
 */
export const REGIONS = [
  {
    id: 'gulf',
    from: 'mundra',
    port: 'jebelAli',
    at: [55.03, 25.01],
    via: [[65, 23.2], [59, 24.4], [56.7, 26.4]],
  },
  {
    id: 'eastAfrica',
    from: 'nhavaSheva',
    port: 'mombasa',
    at: [39.66, -4.05],
    via: [[70.5, 17], [65, 12], [52, 0], [43.5, -3.5]],
  },
  {
    id: 'westAfrica',
    from: 'nhavaSheva',
    port: 'lagos',
    also: 'tema',
    at: [3.39, 6.44],
    via: [[71, 12], [70, 0], [58, -18], [45, -30], [32, -36.5], [19, -37], [11, -32], [5, -20], [3, -6], [3, 3]],
  },
  {
    id: 'europe',
    from: 'mundra',
    port: 'rotterdam',
    at: [4.05, 51.95],
    via: [
      [66, 21], [58, 17], [51, 13.4], [47.5, 12.2], [45, 11.6], [43.4, 12.4], [42.6, 14.2], [41.4, 16.6], [39.6, 19],
      [38.6, 21.2], [37.4, 23.2], [35.9, 25.1], [34.3, 27], [33, 29], [32.9, 31.2], [32.4, 33.2], [28, 33.8], [20, 34.6],
      [14.5, 35.6], [12.8, 37.4], [10, 38.6], [4, 38], [0.5, 37], [-2, 36], [-4, 36], [-6, 36.1], [-9.5, 37], [-10.6, 40],
      [-9.6, 44.5], [-5.5, 48.6], [-3, 49.6], [0, 50], [2, 50], [3.3, 50.6],
    ],
  },
  {
    id: 'southeastAsia',
    from: 'chennai',
    port: 'singapore',
    also: 'jakarta',
    at: [103.84, 1.26],
    via: [[82.5, 10.5], [88, 8], [94, 7], [98, 6.2], [99.2, 4.8], [100.2, 3], [101.5, 2]],
  },
  {
    id: 'latinAmerica',
    from: 'nhavaSheva',
    port: 'santos',
    at: [-46.3, -23.97],
    via: [[71, 12], [70, 0], [58, -18], [45, -30], [32, -36.5], [19, -37], [5, -34], [-20, -28], [-38, -25.5]],
  },
] as const satisfies readonly { id: string; from: OriginId; port: string; also?: string; at: LonLat; via: readonly LonLat[] }[];
export type Region = (typeof REGIONS)[number];
export type RegionId = Region['id'];
export type PortId = OriginId | Region['port'] | 'tema' | 'jakarta';

/** One cubic Bézier segment of a route, in map units. */
export type Cubic = { from: Point; c1: Point; c2: Point; to: Point };

/**
 * A smooth curve through the points: a centripetal Catmull-Rom spline (alpha 0.5, which never
 * loops or overshoots at unevenly spaced waypoints), converted to cubic Béziers, so it passes
 * through every waypoint. The end points are doubled.
 */
export function catmullRom(points: readonly Point[], alpha = 0.5): Cubic[] {
  const out: Cubic[] = [];
  const dist = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y) ** alpha;
  const mix = (terms: [number, Point][], div: number): Point => ({
    x: round(terms.reduce((s, [k, p]) => s + k * p.x, 0) / div),
    y: round(terms.reduce((s, [k, p]) => s + k * p.y, 0) / div),
  });
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const d1 = dist(p0, p1);
    const d2 = dist(p1, p2);
    const d3 = dist(p2, p3);
    const c1 = d1 === 0
      ? mix([[2, p1], [1, p2]], 3)
      : mix([[d1 * d1, p2], [-d2 * d2, p0], [2 * d1 * d1 + 3 * d1 * d2 + d2 * d2, p1]], 3 * d1 * (d1 + d2));
    const c2 = d3 === 0
      ? mix([[1, p1], [2, p2]], 3)
      : mix([[d3 * d3, p1], [-d2 * d2, p3], [2 * d3 * d3 + 3 * d3 * d2 + d2 * d2, p2]], 3 * d3 * (d3 + d2));
    out.push({ from: p1, c1, c2, to: p2 });
  }
  return out;
}

/** A region's route in map units: its origin, its sea waypoints and its port, smoothed. */
export function regionRoute(region: Region): { origin: OriginId; points: Point[]; segments: Cubic[] } {
  const origin = ORIGINS.find((o) => o.id === region.from)!;
  const points = [origin.at, ...region.via, region.at].map((p) => project(p as LonLat));
  return { origin: origin.id, points, segments: catmullRom(points) };
}

/** The SVG path of a route: a move and one `C` per segment. */
export function routePath(segments: readonly Cubic[]): string {
  if (!segments.length) return '';
  const p = (q: Point) => `${q.x} ${q.y}`;
  return `M${p(segments[0].from)}` + segments.map((s) => `C${p(s.c1)} ${p(s.c2)} ${p(s.to)}`).join('');
}

/** A point on one cubic at t (0…1). */
export function cubicPoint({ from, c1, c2, to }: Cubic, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return { x: a * from.x + b * c1.x + c * c2.x + d * to.x, y: a * from.y + b * c1.y + c * c2.y + d * to.y };
}

/** About `n` points along a route, spread over the segments by their chord length. */
export function sampleRoute(segments: readonly Cubic[], n = 200): Point[] {
  const chord = segments.map((s) => Math.hypot(s.to.x - s.from.x, s.to.y - s.from.y));
  const total = chord.reduce((a, b) => a + b, 0) || 1;
  const out: Point[] = [];
  segments.forEach((s, i) => {
    const k = Math.max(2, Math.round((n * chord[i]) / total));
    for (let j = 0; j < k; j++) out.push(cubicPoint(s, j / k));
  });
  if (segments.length) out.push(segments[segments.length - 1].to);
  return out;
}

/** A route's length in map units (summed over fine samples). */
export function routeLength(segments: readonly Cubic[]): number {
  const pts = sampleRoute(segments, 600);
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return len;
}

/** The draw-and-glide time for a route: longer routes take longer, 800ms to at most 1.6s. */
export const routeDuration = (length: number): number => Math.round(Math.min(1600, Math.max(800, 600 + length * 1.3)));

/** Reads the dot centres back out of a dotsPath() string. */
export function parseDots(d: string): Point[] {
  const out: Point[] = [];
  let x = 0;
  let y = 0;
  for (const m of d.matchAll(/([Mm])(-?[\d.]+) (-?[\d.]+)h0/g)) {
    if (m[1] === 'M') [x, y] = [Number(m[2]), Number(m[3])];
    else [x, y] = [round(x + Number(m[2])), round(y + Number(m[3]))];
    out.push({ x, y });
  }
  return out;
}

/**
 * The land dots a point sits on: dots closer than `r` map units (by default 0.45 of the grid
 * step, the drawn dot and its margin). A lane may thread between dots, never across one.
 */
export function landDotsAt(p: Point, dots: readonly Point[], r = DOT_STEP * MAP_SCALE * 0.45): Point[] {
  return dots.filter((d) => Math.hypot(d.x - p.x, d.y - p.y) < r);
}

/** The strong ease-in-out (cubic-bezier(.77,0,.175,1)) approximated for JS-driven motion. */
export function easeInOut(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c < 0.5 ? 8 * c ** 4 : 1 - (-2 * c + 2) ** 4 / 2;
}

/** The next region index in the auto-cycle, wrapping around. */
export const nextRegion = (i: number, n = REGIONS.length): number => (i + 1) % n;
