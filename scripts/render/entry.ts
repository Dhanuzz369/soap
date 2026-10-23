/**
 * The studio page driven by scripts/render-packs.mjs (served by Vite, never shipped).
 * It renders, with the site's own pack builders, studio lights and range still:
 *   window.renderShape(shape, w, h, category, pass)   one pack, centred
 *   window.renderGroup(items, tint, w, h, fill, pass) a small group of packs (category tiles)
 *   window.renderHero(pass)                            the range group cut-out (range-cutout.webp)
 * Each still is drawn twice: pass 'color' with glossy materials on the forest field, and pass
 * 'matte' (white coverage on black). The node script divides one by the other to cut it out.
 * Each resolves once the frame is drawn into the canvas #c.
 */
import { Box3, Group, PerspectiveCamera, Scene, Vector3, WebGLRenderer, type MeshBasicMaterial } from 'three';
import type { Shape } from '../../src/lib/pack-shapes';
import { CATEGORY_TINT, createPackKit, TINT, type Tint } from '../../src/scripts/three/packs';
import { createReflection } from '../../src/scripts/three/reflection';
import { setupStudio } from '../../src/scripts/three/studio';
import { HERO_FRAME, mountHero } from './hero-still';
import { addStrips } from './strips';

type Pass = 'color' | 'matte';

type GroupItem = { shape: Shape; x: number; z: number; yaw: number; lift?: number; shadow: number };

let canvas = document.getElementById('c') as HTMLCanvasElement;
let dispose: (() => void) | null = null;

/** A fresh canvas per render: a canvas keeps the first WebGL context it was given. */
function freshCanvas(w: number, h: number) {
  dispose?.();
  dispose = null;
  const c = document.createElement('canvas');
  c.id = 'c';
  c.width = w;
  c.height = h;
  c.style.width = `${w}px`;
  c.style.height = `${h}px`;
  canvas.replaceWith(c);
  canvas = c;
  return c;
}

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

async function shoot(
  items: GroupItem[],
  tint: Tint | undefined,
  w: number,
  h: number,
  opts: { fill: number; elev: number; lift?: number },
  pass: Pass,
) {
  const c = freshCanvas(w, h);
  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(d: T): T => (disposables.push(d), d);
  const renderer = new WebGLRenderer({ canvas: c, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(w, h, false);
  const scene = new Scene();

  const kit = createPackKit(renderer, keep, pass === 'matte' ? 'matte' : 'glossy');
  const world = new Group();
  const packs = new Group(); // framed without the shadow planes
  world.add(packs);
  const reflection = createReflection(keep, 0.16, 0.6);
  world.add(reflection.group);
  for (const it of items) {
    const obj = kit.build(it.shape, tint);
    obj.position.set(it.x, it.lift ?? 0.12, it.z);
    obj.rotation.y = it.yaw;
    const s = kit.shadow();
    s.position.set(it.x, 0.002, it.z);
    s.scale.setScalar(it.shadow);
    (s.material as MeshBasicMaterial).opacity = 0.95;
    packs.add(obj);
    world.add(s);
    reflection.add(obj);
  }
  scene.add(world);

  // Frame the group: fit its bounding sphere so it fills `fill` of the shorter side.
  const box = new Box3().setFromObject(packs);
  const centre = box.getCenter(new Vector3());
  const size = box.getSize(new Vector3());
  const camera = new PerspectiveCamera(22, w / h, 0.1, 100);
  const tan = Math.tan((camera.fov * Math.PI) / 360);
  const halfH = size.y / 2 / opts.fill;
  const halfW = Math.max(size.x, size.z * 0.7) / 2 / opts.fill;
  const dist = Math.max(halfH / tan, halfW / (tan * camera.aspect));
  const elev = (opts.elev * Math.PI) / 180;
  camera.position.set(centre.x, centre.y + Math.sin(elev) * dist, centre.z + Math.cos(elev) * dist);
  camera.lookAt(centre.x, centre.y - size.y * (0.04 + (opts.lift ?? 0)), centre.z);

  // No backdrop glow in the stills: they are cut out, and the page draws the glow in CSS.
  setupStudio(renderer, scene, keep, {
    aim: { x: centre.x, y: centre.y },
    background: pass === 'matte' ? 'black' : 'field',
    glossy: pass === 'color',
  });
  if (pass === 'color') addStrips(scene, { x: centre.x, y: centre.y });
  renderer.render(scene, camera);
  await frame();
  dispose = () => {
    for (const d of disposables) d.dispose();
    renderer.dispose();
  };
}

const api = {
  /** One pack; `category` tints it in that category's colours instead of the shape's default. */
  async renderShape(shape: Shape, w: number, h: number, category: string | undefined, pass: Pass) {
    const flat = shape.startsWith('bar') || shape === 'tub';
    const tint = category ? CATEGORY_TINT[category] : undefined;
    await shoot(
      [{ shape, x: 0, z: 0, yaw: flat ? 0.55 : 0.32, lift: 0.02, shadow: flat ? 2.6 : 1.9 }],
      tint,
      w,
      h,
      { fill: flat ? 0.74 : 0.66, elev: flat ? 24 : 9 },
      pass,
    );
  },
  async renderGroup(items: GroupItem[], tint: keyof typeof TINT, w: number, h: number, fill: number, pass: Pass) {
    // lift: the group sits in the upper part of the frame, leaving room for the tile's label below
    await shoot(items, TINT[tint], w, h, { fill, elev: 10, lift: 0.12 }, pass);
  },
  async renderHero(pass: Pass) {
    const c = freshCanvas(HERO_FRAME.width, HERO_FRAME.height);
    dispose =
      pass === 'matte'
        ? mountHero(c, { quality: 'matte', background: 'black' })
        : mountHero(c, { quality: 'glossy', background: 'field', decorate: (s) => addStrips(s, { x: 0, y: 1 }) });
    await frame();
  },
};

Object.assign(window, api, { studioReady: true });
