/**
 * The range group still, `range-cutout.webp` (used by the Products and Export Process page bands),
 * drawn by `npm run renders` (scripts/render/entry.ts, renderHero). Never shipped to the browser.
 *
 * This was the live Three.js home hero until the photo fan replaced it (2026-10-23,
 * docs/superpowers/photo-hero-report.md); only the still at rest is kept.
 */
import { Box3, Group, MathUtils, PerspectiveCamera, Scene, Vector3, WebGLRenderer, type MeshBasicMaterial } from 'three';
import type { Shape } from '../../src/lib/pack-shapes';
import { createPackKit, type PackQuality } from '../../src/scripts/three/packs';
import { createReflection } from '../../src/scripts/three/reflection';
import { setupStudio } from '../../src/scripts/three/studio';

/** The cut-out's frame: 5:4. */
export const HERO_FRAME = { width: 1600, height: 1280, fov: 22 } as const;

type Placement = { shape: Shape; x: number; z: number; yaw: number; lift?: number; shadow: number; scale?: number };

/** The range as one tight group (back row tall packs, front row bars), like a bouquet. */
export const HERO_LAYOUT: Placement[] = [
  { shape: 'jug', x: -1.0, z: -1.25, yaw: 0.45, shadow: 2.0 },
  { shape: 'drum', x: 0.75, z: -1.9, yaw: 0.1, shadow: 2.0 },
  { shape: 'spray', x: -0.05, z: -0.4, yaw: -0.5, shadow: 1.5 },
  { shape: 'carboy', x: 1.6, z: -0.3, yaw: -0.35, shadow: 2.1 },
  { shape: 'squeeze', x: -1.65, z: 0.75, yaw: -0.25, shadow: 1.4 },
  { shape: 'pump', x: -0.6, z: 1.2, yaw: 0.3, shadow: 1.5 },
  { shape: 'pouch', x: 0.55, z: 0.85, yaw: -0.35, shadow: 1.6 },
  { shape: 'bar', x: -1.45, z: 2.35, yaw: 0.35, shadow: 1.9, lift: 0.14 },
  { shape: 'bar-duo', x: 0.75, z: 2.2, yaw: -0.5, shadow: 2.0, lift: 0.14 },
];

export type HeroOptions = {
  /** Material quality: the colour pass 'glossy', the coverage pass 'matte'. */
  quality?: PackQuality;
  /** Behind the packs: nothing (alpha), the forest field or black. */
  background?: 'none' | 'field' | 'black';
  /** Extra lights for the stills (strip softboxes, scripts/render/strips.ts). */
  decorate?: (scene: Scene) => void;
};

/** Camera elevation (degrees) and how much of the frame the group fills. */
const VIEW = { elev: 12, yaw: -6, fill: 0.84, below: 0.55 };

export function mountHero(canvas: HTMLCanvasElement, opts: HeroOptions = {}): () => void {
  const disposables: { dispose(): void }[] = [];
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    premultipliedAlpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setClearColor(0x000000, 0);
  try {
    return buildScene(canvas, renderer, disposables, opts);
  } catch (err) {
    // Construction failed part-way: release what exists.
    for (const d of disposables) d.dispose();
    renderer.dispose();
    throw err;
  }
}

/**
 * Frames a box: the camera looks at it from `elev`/`yaw` and backs off until every corner (and
 * the reflection `below` the floor) fits inside `fill` of the frame, then the view is offset so
 * the projected group is centred.
 */
export function frameBox(camera: PerspectiveCamera, box: Box3, v = VIEW): void {
  const c = box.getCenter(new Vector3());
  const pts: Vector3[] = [];
  for (const x of [box.min.x, box.max.x])
    for (const y of [box.min.y - v.below, box.max.y])
      for (const z of [box.min.z, box.max.z]) pts.push(new Vector3(x, y, z));
  const elev = MathUtils.degToRad(v.elev);
  const yaw = MathUtils.degToRad(v.yaw);
  const dir = new Vector3(Math.sin(yaw) * Math.cos(elev), Math.sin(elev), Math.cos(yaw) * Math.cos(elev));
  camera.clearViewOffset();
  const place = (d: number) => {
    camera.position.copy(c).addScaledVector(dir, d);
    camera.lookAt(c);
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();
  };
  const bounds = () => {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const p of pts) {
      const q = p.clone().project(camera);
      x0 = Math.min(x0, q.x);
      x1 = Math.max(x1, q.x);
      y0 = Math.min(y0, q.y);
      y1 = Math.max(y1, q.y);
    }
    return { x0, x1, y0, y1 };
  };
  let lo = 0.5;
  let hi = 200;
  for (let i = 0; i < 48; i++) {
    const mid = (lo + hi) / 2;
    place(mid);
    const b = bounds();
    if (b.x1 - b.x0 <= 2 * v.fill && b.y1 - b.y0 <= 2 * v.fill) hi = mid;
    else lo = mid;
  }
  place(hi);
  const b = bounds();
  const W = camera.aspect * 1000;
  const H = 1000;
  camera.setViewOffset(W, H, (((b.x0 + b.x1) / 2) * W) / 2, (-((b.y0 + b.y1) / 2) * H) / 2, W, H);
  camera.updateProjectionMatrix();
}

function buildScene(
  canvas: HTMLCanvasElement,
  renderer: WebGLRenderer,
  disposables: { dispose(): void }[],
  opts: HeroOptions,
): () => void {
  const keep = <T extends { dispose(): void }>(d: T): T => (disposables.push(d), d);
  const quality = opts.quality ?? 'glossy';

  renderer.setPixelRatio(1);
  const scene = new Scene();
  setupStudio(renderer, scene, keep, {
    aim: { x: 0, y: 1.0 },
    background: opts.background ?? 'none',
    glossy: quality === 'glossy',
  });
  opts.decorate?.(scene);

  const camera = new PerspectiveCamera(HERO_FRAME.fov, HERO_FRAME.width / HERO_FRAME.height, 0.1, 100);

  const kit = createPackKit(renderer, keep, quality);
  const world = new Group();
  const packs = new Group();
  world.add(packs);
  scene.add(world);
  const reflection = createReflection(keep, 0.12, 0.6);
  world.add(reflection.group);
  for (const p of HERO_LAYOUT) {
    const obj = kit.build(p.shape);
    if (p.scale) obj.scale.multiplyScalar(p.scale);
    const lift = p.lift ?? 0.16;
    obj.position.set(p.x, lift, p.z);
    obj.rotation.set(0, p.yaw, 0);
    // The shadow tightens and darkens as the pack sits closer to the floor.
    const k = 1 - (lift - 0.1) * 0.7;
    const shadow = kit.shadow();
    shadow.position.set(p.x, 0.002, p.z);
    shadow.scale.setScalar(p.shadow * (0.85 + (1 - k) * 0.5));
    (shadow.material as MeshBasicMaterial).opacity = MathUtils.clamp(k, 0.35, 1);
    packs.add(obj);
    world.add(shadow);
    reflection.add(obj);
  }

  // Frame the group (the packs only, not shadows or reflections).
  packs.updateMatrixWorld(true);
  frameBox(camera, new Box3().setFromObject(packs));
  reflection.sync();

  renderer.setSize(canvas.width, canvas.height, false);
  renderer.render(scene, camera);
  return () => {
    for (const d of disposables) d.dispose();
    renderer.dispose();
  };
}
