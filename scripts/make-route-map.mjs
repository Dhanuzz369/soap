/**
 * npm run route:map
 *
 * Draws the dotted world map behind the /export-process/ hero ("the route") at build time from
 * Natural Earth land (public domain, via the world-atlas package, 1:50m) into
 * src/assets/route-map.svg: one <path> of round-capped zero-length segments, one per land dot on
 * an equirectangular grid. The window, scale and grid come from src/lib/route-map.ts (read with
 * Node's TypeScript type stripping), so the page's ports and arcs line up with the dots.
 *
 * Only re-run it after changing MAP_BOUNDS, MAP_SCALE or DOT_STEP; the SVG is committed.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';
import { MAP_WIDTH, MAP_HEIGHT, gridPoints, project, dotsPath } from '../src/lib/route-map.ts';

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/land-50m.json'), 'utf8'));
const land = feature(topo, topo.objects.land);

const dots = gridPoints()
  .filter((p) => geoContains(land, p))
  .map(project);

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}">` +
  `<!-- Land: Natural Earth 1:50m (public domain) via world-atlas; ${dots.length} dots. npm run route:map -->` +
  `<path d="${dotsPath(dots)}"/></svg>\n`;

const out = resolve('src/assets/route-map.svg');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, svg);
console.log(`${out}: ${dots.length} dots, ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
