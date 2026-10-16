/**
 * Home hero: the range photographed in a dark studio, live (spec §14, restyle direction §1).
 *
 * Loaded with a dynamic import() from HeroScene.astro once the hero is visible and the
 * browser is idle. The pre-rendered still underneath (public/images/renders/range-hero.webp,
 * made by `npm run renders` from this same scene at t = 0) is the LCP element and the
 * fallback; the canvas fades in over it after the first frame, so the still comes alive.
 *
 * The camera frames a fixed 16:10 reference picture and crops it exactly like CSS
 * `object-fit: cover` with `object-position: <--still-x> 50%`, so the live scene and the still
 * line up at every viewport size.
 */
import { Group, MathUtils, PerspectiveCamera, Scene, Vector2, WebGLRenderer, type Mesh, type MeshBasicMaterial, type Object3D } from 'three';
import type { Shape } from '../lib/pack-shapes';
import { createPackKit } from './three/packs';
import { setupStudio } from './three/studio';

export { shouldRun3D, detectHeroEnv, type HeroEnv } from './hero-env';

/** The reference frame of the still: 16:10. */
export const HERO_FRAME = { width: 1600, height: 1000, fov: 24 } as const;

type Placement = { shape: Shape; x: number; z: number; yaw: number; lift?: number; shadow: number; scale?: number };

/** The range, grouped on the right of the frame so the copy sits on the open field at the left. */
export const HERO_LAYOUT: Placement[] = [
  { shape: 'jug', x: 0.5, z: -1.3, yaw: 0.45, shadow: 2.0 },
  { shape: 'drum', x: 2.9, z: -1.9, yaw: 0.1, shadow: 2.0 },
  { shape: 'spray', x: 1.75, z: -0.5, yaw: -0.5, shadow: 1.5 },
  { shape: 'carboy', x: 4.05, z: -0.35, yaw: -0.35, shadow: 2.1 },
  { shape: 'squeeze', x: -0.25, z: 0.8, yaw: -0.25, shadow: 1.4 },
  { shape: 'pump', x: 1.05, z: 1.25, yaw: 0.3, shadow: 1.5 },
  { shape: 'pouch', x: 2.55, z: 0.75, yaw: -0.35, shadow: 1.6 },
  { shape: 'bar', x: -0.15, z: 2.45, yaw: 0.35, shadow: 1.9, lift: 0.14 },
  { shape: 'bar-duo', x: 3.35, z: 2.1, yaw: -0.5, shadow: 2.0, lift: 0.14 },
];

type Item = { obj: Group; shadow: Mesh; p: Placement; phase: number; kind: 'bottle' | 'bar' };

export type HeroOptions = {
  /** Render one frame at t = 0 and stop (used by the render script for the still). */
  still?: boolean;
};

export function mountHero(canvas: HTMLCanvasElement, opts: HeroOptions = {}): () => void {
  const disposables: { dispose(): void }[] = [];
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'low-power',
    preserveDrawingBuffer: !!opts.still,
  });
  try {
    return buildScene(canvas, renderer, disposables, opts);
  } catch (err) {
    // Construction failed part-way: release what exists and leave the still in place.
    for (const d of disposables) d.dispose();
    renderer.dispose();
    throw err;
  }
}

function buildScene(
  canvas: HTMLCanvasElement,
  renderer: WebGLRenderer,
  disposables: { dispose(): void }[],
  opts: HeroOptions,
): () => void {
  const keep = <T extends { dispose(): void }>(d: T): T => (disposables.push(d), d);

  renderer.setPixelRatio(opts.still ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  const scene = new Scene();
  setupStudio(renderer, scene, keep, { aim: { x: 2.0, y: 1.0 }, glow: { x: 2.2, y: 1.8, w: 13, h: 9, strength: 0.9 } });

  const camera = new PerspectiveCamera(HERO_FRAME.fov, HERO_FRAME.width / HERO_FRAME.height, 0.1, 100);
  camera.position.set(0, 2.9, 11.5);
  camera.lookAt(0.2, 1.15, 0);

  /* ---------- the range ---------- */
  const kit = createPackKit(renderer, keep);
  const world = new Group();
  scene.add(world);
  const items: Item[] = HERO_LAYOUT.map((p, i) => {
    const obj = kit.build(p.shape);
    if (p.scale) obj.scale.multiplyScalar(p.scale);
    const shadow = kit.shadow();
    world.add(obj, shadow);
    const kind = p.shape.startsWith('bar') ? 'bar' : 'bottle';
    return { obj, shadow, p, phase: i * 1.37, kind };
  });

  /* ---------- framing: object-fit: cover of the 16:10 reference ---------- */
  const focus = new Vector2(0.5, 0.5);
  const readFocus = () => {
    const cs = getComputedStyle(canvas);
    const x = parseFloat(cs.getPropertyValue('--still-x'));
    const y = parseFloat(cs.getPropertyValue('--still-y'));
    focus.set(Number.isFinite(x) ? x : 0.5, Number.isFinite(y) ? y : 0.5);
  };
  const fit = (w: number, h: number) => {
    const s = Math.max(w / HERO_FRAME.width, h / HERO_FRAME.height);
    const fw = HERO_FRAME.width * s;
    const fh = HERO_FRAME.height * s;
    camera.setViewOffset(fw, fh, (fw - w) * focus.x, (fh - h) * focus.y, w, h);
    camera.updateProjectionMatrix();
  };

  /* ---------- motion ---------- */
  const pointer = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!opts.still) window.addEventListener('pointermove', onPointer, { passive: true });

  let start = -1;
  // At t = 0 every term below is at its resting value, so the first live frame equals the still.
  const pose = (now: number) => {
    if (start < 0) start = now;
    const t = (now - start) / 1000;
    const ramp = MathUtils.smoothstep(t, 0, 2.4); // ease motion in from the still's pose
    eased.x += (pointer.x - eased.x) * 0.045;
    eased.y += (pointer.y - eased.y) * 0.045;
    world.rotation.y = eased.x * 0.08;
    world.rotation.x = eased.y * 0.025;
    for (const it of items) {
      const p = it.p;
      const lift = p.lift ?? 0.16;
      const bob = Math.sin(t * 0.7 + it.phase) - Math.sin(it.phase);
      const y = lift + bob * 0.07 * ramp;
      it.obj.position.set(p.x, y, p.z);
      if (it.kind === 'bottle') {
        it.obj.rotation.set(0, p.yaw + Math.sin(t * 0.22) * 0.45 * ramp * Math.cos(it.phase), Math.sin(t * 0.5 + it.phase) * 0.03 * ramp);
      } else {
        it.obj.rotation.set(Math.sin(t * 0.6 + it.phase) * 0.05 * ramp, p.yaw + Math.sin(t * 0.18) * 0.25 * ramp, Math.sin(t * 0.45 + it.phase) * 0.06 * ramp);
      }
      // The shadow tightens and darkens as the pack dips towards the floor.
      const k = 1 - (y - 0.1) * 0.7;
      it.shadow.position.set(p.x, 0.002, p.z);
      it.shadow.scale.setScalar(p.shadow * (0.85 + (1 - k) * 0.5));
      (it.shadow.material as MeshBasicMaterial).opacity = MathUtils.clamp(k, 0.35, 1);
    }
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
    if (!raf && !disposed && !lost && inView && !document.hidden) raf = requestAnimationFrame(frame);
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
    readFocus();
    fit(w, h);
    if (!raf && !disposed && !lost) {
      pose(start < 0 ? 0 : performance.now());
      renderer.render(scene, camera);
    }
  };

  if (opts.still) {
    readFocus();
    const w = canvas.width;
    const h = canvas.height;
    renderer.setSize(w, h, false);
    fit(w, h);
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
