/**
 * Home hero: the range as a cut-out object, live (spec §14, glossy & motion audit).
 *
 * The page first shows `public/images/renders/range-cutout.webp`, a transparent studio still of
 * this same scene at rest (made by `npm run renders` with glossy materials). It is the LCP
 * element; CSS pops it in and drifts it with scroll. This module is imported by HeroScene.astro
 * only after the visitor first interacts; its canvas sits in the same box as the cut-out (inside
 * the same transformed wrapper), uses the same camera framing, and renders with a transparent
 * background, so its first frame lands exactly on the still before the two cross-fade.
 *
 * Once live, scrolling fans the packs apart and turns them gently (eased, paused off-screen).
 */
import { Box3, Group, MathUtils, PerspectiveCamera, Scene, Vector3, WebGLRenderer, type Mesh, type MeshBasicMaterial, type Object3D } from 'three';
import type { Shape } from '../lib/pack-shapes';
import { approach, fanPose, scrollProgress } from '../lib/hero-motion';
import { createPackKit, type PackQuality } from './three/packs';
import { createReflection } from './three/reflection';
import { setupStudio } from './three/studio';

export { shouldRun3D, detectHeroEnv, type HeroEnv } from './hero-env';

/** The cut-out's frame: 5:4. The CSS box (.hero-object) has the same aspect ratio. */
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

type Item = { obj: Group; shadow: Mesh; p: Placement; phase: number; kind: 'bottle' | 'bar'; i: number };

export type HeroOptions = {
  /** Render one frame at rest and stop (the render script's still). */
  still?: boolean;
  /** Material quality; the live hero uses 'live', the still's colour pass 'glossy', its coverage pass 'matte'. */
  quality?: PackQuality;
  /** Behind the packs: nothing (live, alpha canvas), the forest field or black (still passes). */
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
    powerPreference: 'low-power',
    preserveDrawingBuffer: !!opts.still,
  });
  renderer.setClearColor(0x000000, 0);
  try {
    return buildScene(canvas, renderer, disposables, opts);
  } catch (err) {
    // Construction failed part-way: release what exists and leave the still in place.
    for (const d of disposables) d.dispose();
    renderer.dispose();
    throw err;
  }
}

/**
 * Frames a box: the camera looks at it from `elev`/`yaw` and backs off until every corner (and
 * the reflection `below` the floor) fits inside `fill` of the frame, then the view is offset so
 * the projected group is centred. Pure geometry, so the still and the live scene agree.
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
  const quality = opts.quality ?? 'live';

  renderer.setPixelRatio(opts.still ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
  const scene = new Scene();
  setupStudio(renderer, scene, keep, {
    aim: { x: 0, y: 1.0 },
    background: opts.background ?? 'none',
    glossy: quality === 'glossy',
  });
  opts.decorate?.(scene);

  const camera = new PerspectiveCamera(HERO_FRAME.fov, HERO_FRAME.width / HERO_FRAME.height, 0.1, 100);

  /* ---------- the range ---------- */
  const kit = createPackKit(renderer, keep, quality);
  const world = new Group();
  const packs = new Group();
  world.add(packs);
  scene.add(world);
  const reflection = createReflection(keep, 0.12, 0.6);
  world.add(reflection.group);
  const items: Item[] = HERO_LAYOUT.map((p, i) => {
    const obj = kit.build(p.shape);
    if (p.scale) obj.scale.multiplyScalar(p.scale);
    obj.position.set(p.x, p.lift ?? 0.16, p.z);
    obj.rotation.set(0, p.yaw, 0);
    const shadow = kit.shadow();
    packs.add(obj);
    world.add(shadow);
    reflection.add(obj);
    const kind = p.shape.startsWith('bar') ? 'bar' : 'bottle';
    return { obj, shadow, p, phase: i * 1.37, kind, i };
  });
  const centreX = HERO_LAYOUT.reduce((s, p) => s + p.x, 0) / HERO_LAYOUT.length;

  // Frame the group at rest (the packs only, not shadows or reflections).
  packs.updateMatrixWorld(true);
  frameBox(camera, new Box3().setFromObject(packs));

  /* ---------- motion ---------- */
  const pointer = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!opts.still) window.addEventListener('pointermove', onPointer, { passive: true });

  let start = -1;
  let last = -1;
  let fan = 0; // eased scroll fan, 0 at rest
  // At t = 0 every term below is at its resting value, so the first live frame equals the still.
  const pose = (now: number) => {
    if (start < 0) start = now;
    const t = (now - start) / 1000;
    const dt = last < 0 ? 0 : Math.min(0.1, (now - last) / 1000);
    last = now;
    // Hold the still's pose while the canvas fades in over it, then ease the idle motion in.
    const ramp = MathUtils.smoothstep(t, 1.0, 3.4);
    const target = opts.still ? 0 : scrollProgress(window.scrollY, 0, window.innerHeight) * ramp;
    fan = approach(fan, target, 5, dt);
    eased.x = approach(eased.x, pointer.x * ramp, 2.8, dt);
    eased.y = approach(eased.y, pointer.y * ramp, 2.8, dt);
    world.rotation.y = eased.x * 0.08;
    world.rotation.x = eased.y * 0.025;
    for (const it of items) {
      const p = it.p;
      const lift = p.lift ?? 0.16;
      const bob = Math.sin(t * 0.7 + it.phase) - Math.sin(it.phase);
      const y = lift + bob * 0.07 * ramp;
      const f = fanPose(fan, p.x - centreX, it.i);
      it.obj.position.set(p.x + f.dx, y, p.z);
      if (it.kind === 'bottle') {
        it.obj.rotation.set(0, p.yaw + f.yaw + Math.sin(t * 0.22) * 0.45 * ramp * Math.cos(it.phase), Math.sin(t * 0.5 + it.phase) * 0.03 * ramp);
      } else {
        it.obj.rotation.set(Math.sin(t * 0.6 + it.phase) * 0.05 * ramp, p.yaw + f.yaw * 0.6 + Math.sin(t * 0.18) * 0.25 * ramp, Math.sin(t * 0.45 + it.phase) * 0.06 * ramp);
      }
      // The shadow tightens and darkens as the pack dips towards the floor.
      const k = 1 - (y - 0.1) * 0.7;
      it.shadow.position.set(p.x + f.dx, 0.002, p.z);
      it.shadow.scale.setScalar(p.shadow * (0.85 + (1 - k) * 0.5));
      (it.shadow.material as MeshBasicMaterial).opacity = MathUtils.clamp(k, 0.35, 1);
    }
    reflection.sync();
  };

  /* ---------- loop, visibility, resize ---------- */
  let raf = 0;
  let inView = true;
  let first = true;
  let disposed = false;
  let lost = false; // a lost context is not restored; the still takes over for good

  const frame = (now: number) => {
    raf = 0;
    if (disposed || lost) return;
    pose(now);
    renderer.render(scene, camera);
    if (first) {
      first = false;
      canvas.dataset.live = '';
    }
    if (inView && !lost && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const resume = () => {
    if (!raf && !disposed && !lost && inView && !document.hidden) {
      last = -1; // no catch-up jump after a pause
      raf = requestAnimationFrame(frame);
    }
  };
  const pause = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    if (!raf && !disposed && !lost) {
      pose(start < 0 ? 0 : performance.now());
      renderer.render(scene, camera);
    }
  };

  if (opts.still) {
    renderer.setSize(canvas.width, canvas.height, false);
    pose(0);
    renderer.render(scene, camera);
    canvas.dataset.live = '';
    return () => {
      for (const d of disposables) d.dispose();
      renderer.dispose();
    };
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const io = new IntersectionObserver((entries) => {
    inView = entries.some((e) => e.isIntersecting);
    if (inView) resume();
    else pause();
  });
  io.observe(canvas);

  const onVisibility = () => (document.hidden ? pause() : resume());
  document.addEventListener('visibilitychange', onVisibility);

  // No preventDefault: we do not ask for a restore. Rendering stops for good and the still shows again.
  const onLost = () => {
    lost = true;
    pause();
    delete canvas.dataset.live;
  };
  canvas.addEventListener('webglcontextlost', onLost);

  resume();

  /* ---------- dispose ---------- */
  return () => {
    if (disposed) return;
    disposed = true;
    pause();
    ro.disconnect();
    io.disconnect();
    window.removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('webglcontextlost', onLost);
    delete canvas.dataset.live;
    scene.traverse((o: Object3D) => {
      if ((o as Mesh).isMesh) (o as Mesh).geometry.dispose();
    });
    for (const d of disposables) d.dispose();
    scene.environment = null;
    renderer.dispose();
  };
}
