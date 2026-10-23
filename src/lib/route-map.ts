/**
 * "The route": the /export-process/ hero's map (src/components/RouteHero.astro), as pure data.
 * Shared by the build-time map generator (scripts/make-route-map.mjs, run with Node's type
 * stripping) and the page, so the dots, the ports and the arcs use one projection.
 * Unit-tested in tests/unit/route-map.test.ts.
 *
 * Honesty: the arcs are stylised quadratic curves, not navigational routes. No transit times or
 * freight prices are attached to them anywhere.
 */

/** The map window, in degrees: from the Brazilian coast to Indonesia, the Netherlands to the Cape. */
export const MAP_BOUNDS = { west: -62, east: 128, north: 62, south: -42 } as const;
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
 * Destination regions, in the order of the buttons. `port` is where the arc ends; `also` is a
 * second port named in the region's label. `via` is the arc's quadratic control point, chosen by
 * eye so each curve stays mostly at sea (stylised: a quadratic cannot follow a coast).
 */
export const REGIONS = [
  { id: 'gulf', port: 'jebelAli', at: [55.03, 25.01], via: [62, 19] },
  { id: 'eastAfrica', port: 'mombasa', at: [39.66, -4.05], via: [60, -2] },
  { id: 'westAfrica', port: 'lagos', also: 'tema', at: [3.39, 6.44], via: [36, -76] },
  { id: 'europe', port: 'rotterdam', at: [4.05, 51.95], via: [40, 10] },
  { id: 'southeastAsia', port: 'singapore', also: 'jakarta', at: [103.84, 1.26], via: [92, 0] },
  { id: 'latinAmerica', port: 'santos', at: [-46.3, -23.97], via: [30, -70] },
] as const satisfies readonly { id: string; port: string; also?: string; at: LonLat; via: LonLat }[];
export type RegionId = (typeof REGIONS)[number]['id'];
export type PortId = OriginId | (typeof REGIONS)[number]['port'] | 'tema' | 'jakarta';

/** Great-circle distance in km (haversine). */
export function distanceKm([lon1, lat1]: LonLat, [lon2, lat2]: LonLat): number {
  const r = Math.PI / 180;
  const a = Math.sin(((lat2 - lat1) * r) / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lon2 - lon1) * r) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

/** The Indian origin port nearest (great-circle) to a destination. */
export function nearestOrigin(at: LonLat): (typeof ORIGINS)[number] {
  return ORIGINS.reduce((best, o) => (distanceKm(o.at, at) < distanceKm(best.at, at) ? o : best));
}

export type Arc = { from: Point; via: Point; to: Point };

/** A region's arc in map units, from its nearest Indian port. */
export function regionArc(region: (typeof REGIONS)[number]): Arc & { origin: OriginId } {
  const origin = nearestOrigin(region.at);
  return { origin: origin.id, from: project(origin.at), via: project(region.via), to: project(region.at) };
}

/** The SVG path of an arc: one quadratic Bézier. */
export function arcPath({ from, via, to }: Arc): string {
  return `M${from.x} ${from.y}Q${via.x} ${via.y} ${to.x} ${to.y}`;
}

/** A point on the arc at t (0…1), and the direction of travel there in degrees (0 = east). */
export function arcPoint({ from, via, to }: Arc, t: number): Point & { angle: number } {
  const u = 1 - t;
  const x = u * u * from.x + 2 * u * t * via.x + t * t * to.x;
  const y = u * u * from.y + 2 * u * t * via.y + t * t * to.y;
  const dx = 2 * u * (via.x - from.x) + 2 * t * (to.x - via.x);
  const dy = 2 * u * (via.y - from.y) + 2 * t * (to.y - via.y);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

/** The strong ease-in-out (cubic-bezier(.77,0,.175,1)) approximated for JS-driven motion. */
export function easeInOut(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c < 0.5 ? 8 * c ** 4 : 1 - (-2 * c + 2) ** 4 / 2;
}

/** The next region index in the auto-cycle, wrapping around. */
export const nextRegion = (i: number, n = REGIONS.length): number => (i + 1) % n;
