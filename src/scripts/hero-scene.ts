/**
 * Home hero: a Three.js "range shelf" of stylised packs (spec §14).
 *
 * Loaded with a dynamic import() from HeroScene.astro once the hero is visible and the
 * browser is idle. The static SVG composition under the canvas is the LCP element and
 * the fallback; the canvas fades in over it after the first frame.
 *
 * Only the Three.js modules used here are imported so the chunk stays small.
 */
import {
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  LatheGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SphereGeometry,
  SplineCurve,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
  type Object3D,
  type Texture,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export { shouldRun3D, detectHeroEnv, type HeroEnv } from './hero-env';

/* Category tints, the same values as tokens.css [data-cat] (--pv-body / --pv-dark / --pv-light). */
const TINT = {
  soaps: { body: '#a9d9bd', dark: '#3f7d5e', light: '#f2faf5' },
  laundry: { body: '#9ccbca', dark: '#39716f', light: '#f0f8f8' },
  kitchen: { body: '#bfd396', dark: '#5b7339', light: '#f6f9ee' },
  surface: { body: '#8fc0aa', dark: '#3a6f5a', light: '#eef7f2' },
  raw: { body: '#b6c0ad', dark: '#56634f', light: '#f4f6f1' },
} as const;
type Tint = (typeof TINT)[keyof typeof TINT];

type Placement = { x: number; z: number; yaw: number; s?: number };
type Item = {
  obj: Group;
  shadow: Mesh;
  shadowSize: number;
  wide: Placement;
  narrow: Placement;
  phase: number;
  lift: number;
  /** soap bars rock, bottles turn */
  kind: 'bottle' | 'bar';
};

export function mountHero(canvas: HTMLCanvasElement): () => void {
  const disposables: { dispose(): void }[] = [];
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
  try {
    return buildScene(canvas, renderer, disposables);
  } catch (err) {
    // Construction failed part-way: release what exists and leave the static composition in place.
    for (const d of disposables) d.dispose();
    renderer.dispose();
    throw err;
  }
}

function buildScene(canvas: HTMLCanvasElement, renderer: WebGLRenderer, disposables: { dispose(): void }[]): () => void {
  const keep = <T extends { dispose(): void }>(d: T): T => (disposables.push(d), d);

  /* ---------- renderer, scene, camera ---------- */
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.02;

  const scene = new Scene();
  // Match the tile behind the canvas exactly, so the fade-in reads as the drawing coming alive.
  const field = getComputedStyle(canvas.parentElement ?? canvas).backgroundColor;
  scene.background = new Color(field && field !== 'rgba(0, 0, 0, 0)' ? field : '#dcefe2');

  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envRT = pmrem.fromScene(room, 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.55;
  room.dispose();
  pmrem.dispose();
  keep(envRT);

  const camera = new PerspectiveCamera(26, 1, 0.1, 100);

  scene.add(new HemisphereLight('#f5f8f2', '#a9c9b4', 1.1));
  const key = new DirectionalLight('#fffdf6', 1.9);
  key.position.set(4, 7, 6);
  scene.add(key);
  const rim = new DirectionalLight('#bfe6cc', 2.2);
  rim.position.set(-6, 3, -5);
  scene.add(rim);

  /* ---------- materials and helpers ---------- */
  const bottleMat = (t: Tint) =>
    keep(
      new MeshPhysicalMaterial({
        color: t.body,
        roughness: 0.24,
        metalness: 0,
        transmission: 0.32,
        thickness: 0.9,
        ior: 1.45,
        attenuationColor: new Color(t.dark),
        attenuationDistance: 2.4,
        clearcoat: 1,
        clearcoatRoughness: 0.18,
      }),
    );
  const capMat = (hex: string) =>
    keep(new MeshPhysicalMaterial({ color: hex, roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.3 }));
  const soapMat = (hex: string) =>
    keep(new MeshPhysicalMaterial({ color: hex, roughness: 0.55, sheen: 0.6, sheenColor: new Color('#ffffff'), sheenRoughness: 0.6 }));

  const geo = <G extends BufferGeometry>(g: G): G => keep(g);
  const mesh = (g: BufferGeometry, m: Material, x = 0, y = 0, z = 0) => {
    const o = new Mesh(g, m);
    o.position.set(x, y, z);
    return o;
  };

  /** Smooth lathe from a half-silhouette given as [radius, height] pairs. */
  const lathe = (pts: [number, number][]) => {
    const curve = new SplineCurve(pts.map(([x, y]) => new Vector2(x, y)));
    const p = curve.getPoints(90).map((v) => new Vector2(Math.max(0, v.x), v.y));
    return geo(new LatheGeometry(p, 72));
  };

  /** A label printed with the brand leaf; wraps the front of a straight body section. */
  const labelTexture = (t: Tint): Texture => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 384;
    const g = c.getContext('2d')!;
    g.fillStyle = t.light;
    g.fillRect(0, 0, 512, 384);
    g.save();
    g.translate(256, 150);
    g.scale(3.4, 3.4);
    g.fillStyle = t.dark;
    g.beginPath();
    g.moveTo(0, -18);
    g.bezierCurveTo(15, -11, 15, 10, 0, 18);
    g.bezierCurveTo(-15, 10, -15, -11, 0, -18);
    g.fill();
    g.fillStyle = t.light;
    g.fillRect(-1.3, -11, 2.6, 26);
    g.restore();
    g.fillStyle = t.dark;
    g.fillRect(176, 268, 160, 14);
    g.fillRect(206, 300, 100, 10);
    const tex = keep(new CanvasTexture(c));
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    return tex;
  };
  const labelBand = (t: Tint, r: number, y0: number, y1: number, arc = 1.9) => {
    const m = keep(new MeshStandardMaterial({ map: labelTexture(t), roughness: 0.62 }));
    const g = geo(new CylinderGeometry(r, r, y1 - y0, 48, 1, true, -arc / 2, arc));
    return mesh(g, m, 0, (y0 + y1) / 2, 0);
  };

  /* ---------- the packs ---------- */
  // Dish wash: tall, flattened squeeze bottle with a flip cap.
  const dishWash = () => {
    const t = TINT.kitchen;
    const g = new Group();
    g.add(
      mesh(
        lathe([
          [0, 0], [0.42, 0.005], [0.48, 0.08], [0.5, 0.3], [0.5, 1.45], [0.47, 1.72],
          [0.36, 1.94], [0.2, 2.07], [0.17, 2.14], [0.17, 2.2],
        ]),
        bottleMat(t),
      ),
    );
    g.add(labelBand(t, 0.508, 0.42, 1.28));
    const cap = capMat(t.dark);
    g.add(mesh(geo(new CylinderGeometry(0.21, 0.23, 0.24, 40)), cap, 0, 2.3, 0));
    g.add(mesh(geo(new CylinderGeometry(0.06, 0.08, 0.16, 20)), cap, 0, 2.48, 0));
    g.scale.set(1, 1, 0.72);
    return g;
  };

  // Fabric softener: wide jug with a side handle and a measuring cap.
  const softener = () => {
    const t = TINT.laundry;
    const g = new Group();
    const body = bottleMat(t);
    g.add(
      mesh(
        lathe([
          [0, 0], [0.7, 0.005], [0.79, 0.09], [0.82, 0.3], [0.82, 1.18], [0.77, 1.44],
          [0.56, 1.66], [0.36, 1.77], [0.31, 1.84], [0.31, 1.92],
        ]),
        body,
      ),
    );
    const handle = mesh(geo(new TorusGeometry(0.4, 0.1, 18, 40, Math.PI)), body, 0.66, 1.0, 0);
    handle.rotation.z = -Math.PI / 2;
    g.add(handle);
    g.add(labelBand(t, 0.83, 0.38, 1.1, 1.6));
    g.add(mesh(geo(new CylinderGeometry(0.36, 0.36, 0.3, 44)), capMat(t.dark), 0, 2.04, 0));
    g.scale.set(1, 1, 0.82);
    return g;
  };

  // Surface cleaner: slim bottle with a trigger spray head.
  const sprayBottle = () => {
    const t = TINT.surface;
    const g = new Group();
    g.add(
      mesh(
        lathe([
          [0, 0], [0.5, 0.005], [0.56, 0.08], [0.57, 0.3], [0.57, 1.3], [0.52, 1.5],
          [0.32, 1.64], [0.23, 1.72], [0.23, 1.8],
        ]),
        bottleMat(t),
      ),
    );
    g.add(labelBand(t, 0.578, 0.38, 1.18));
    const head = capMat(t.dark);
    g.add(mesh(geo(new CylinderGeometry(0.26, 0.26, 0.2, 36)), head, 0, 1.88, 0));
    const shroud = mesh(geo(new RoundedBoxGeometry(0.86, 0.34, 0.36, 3, 0.1)), head, 0.18, 2.12, 0);
    g.add(shroud);
    g.add(mesh(geo(new RoundedBoxGeometry(0.16, 0.14, 0.16, 2, 0.04)), head, 0.66, 2.1, 0));
    const trigger = mesh(geo(new RoundedBoxGeometry(0.11, 0.44, 0.16, 2, 0.04)), capMat(t.body), 0.38, 1.82, 0);
    trigger.rotation.z = 0.18;
    g.add(trigger);
    return g;
  };

  // Hand wash: rounded pump bottle.
  const pumpBottle = () => {
    const t = TINT.soaps;
    const g = new Group();
    g.add(
      mesh(
        lathe([
          [0, 0], [0.52, 0.005], [0.58, 0.09], [0.6, 0.32], [0.6, 1.1], [0.55, 1.3],
          [0.34, 1.46], [0.2, 1.52], [0.19, 1.6],
        ]),
        bottleMat(t),
      ),
    );
    g.add(labelBand(t, 0.608, 0.34, 1.02));
    const pump = capMat(t.dark);
    g.add(mesh(geo(new CylinderGeometry(0.23, 0.23, 0.16, 36)), pump, 0, 1.66, 0));
    g.add(mesh(geo(new CylinderGeometry(0.065, 0.065, 0.34, 16)), pump, 0, 1.9, 0));
    g.add(mesh(geo(new RoundedBoxGeometry(0.62, 0.16, 0.24, 2, 0.06)), pump, 0.16, 2.1, 0));
    return g;
  };

  // Raw materials: a ribbed drum.
  const drum = () => {
    const t = TINT.raw;
    const g = new Group();
    const body = keep(new MeshPhysicalMaterial({ color: t.body, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.35 }));
    const rib = capMat(t.dark);
    g.add(mesh(geo(new CylinderGeometry(0.74, 0.74, 1.72, 64)), body, 0, 0.86, 0));
    for (const y of [0.04, 0.6, 1.12, 1.7]) {
      const r = mesh(geo(new TorusGeometry(0.745, 0.04, 12, 64)), rib, 0, y, 0);
      r.rotation.x = Math.PI / 2;
      g.add(r);
    }
    g.add(labelBand(t, 0.748, 0.72, 1.02, 1.4));
    g.add(mesh(geo(new CylinderGeometry(0.1, 0.1, 0.08, 20)), rib, 0.36, 1.76, 0.12));
    return g;
  };

  // Soap bar with a pressed oval and the leaf mark's colour.
  const soapBar = (hex: string, ovalHex: string) => {
    const g = new Group();
    const m = soapMat(hex);
    g.add(mesh(geo(new RoundedBoxGeometry(1.5, 0.46, 0.96, 5, 0.2)), m, 0, 0.23, 0));
    const oval = mesh(geo(new SphereGeometry(0.42, 40, 20)), soapMat(ovalHex), 0, 0.44, 0);
    oval.scale.set(1.25, 0.08, 0.8);
    g.add(oval);
    return g;
  };

  /* ---------- soft contact shadows ---------- */
  const shadowTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(18,53,42,0.55)');
    grad.addColorStop(0.55, 'rgba(18,53,42,0.18)');
    grad.addColorStop(1, 'rgba(18,53,42,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const tex = keep(new CanvasTexture(c));
    tex.colorSpace = SRGBColorSpace;
    return tex;
  })();
  const shadowGeo = geo(new PlaneGeometry(1, 1));
  const makeShadow = () => {
    const m = keep(new MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, toneMapped: false }));
    const s = new Mesh(shadowGeo, m);
    s.rotation.x = -Math.PI / 2;
    s.renderOrder = -1;
    return s;
  };

  /* ---------- composition ---------- */
  const world = new Group();
  scene.add(world);
  const items: Item[] = [];
  const add = (obj: Group, shadowSize: number, kind: Item['kind'], wide: Placement, narrow: Placement, lift = 0.22) => {
    const shadow = makeShadow();
    world.add(obj, shadow);
    items.push({ obj, shadow, shadowSize, wide, narrow, phase: items.length * 1.37, lift, kind });
  };

  // [x, z, yaw] for a wide stage (about 2:1) and for a narrow one (phones).
  add(softener(), 1.9, 'bottle', { x: -2.55, z: -1.0, yaw: 0.35 }, { x: -1.3, z: -1.6, yaw: 0.35 });
  add(dishWash(), 1.3, 'bottle', { x: -0.95, z: 0.55, yaw: -0.2 }, { x: -0.45, z: 0.6, yaw: -0.2 });
  add(sprayBottle(), 1.4, 'bottle', { x: 0.55, z: -0.9, yaw: -0.45 }, { x: 0.6, z: -1.1, yaw: -0.45 });
  add(pumpBottle(), 1.4, 'bottle', { x: 1.95, z: 0.6, yaw: 0.25 }, { x: 1.2, z: 0.9, yaw: 0.25 });
  add(drum(), 1.9, 'bottle', { x: 3.35, z: -1.5, yaw: 0.1 }, { x: 1.9, z: -2.1, yaw: 0.1 });
  add(soapBar(TINT.soaps.body, TINT.soaps.light), 1.9, 'bar', { x: -3.85, z: 1.05, yaw: 0.5 }, { x: -1.3, z: 1.7, yaw: 0.5 }, 0.3);
  add(soapBar(TINT.soaps.light, TINT.soaps.body), 1.9, 'bar', { x: 3.55, z: 1.25, yaw: -0.55 }, { x: 1.3, z: 2.0, yaw: -0.55 }, 0.36);

  let narrow = false;
  const target = new Vector2(0, 0.95); // what the camera looks at (x unused, y height)
  const fit = (w: number, h: number) => {
    const aspect = w / Math.max(h, 1);
    narrow = aspect < 1.45;
    camera.aspect = aspect;
    const halfW = narrow ? 2.75 : 5.1;
    const halfH = narrow ? 1.75 : 1.45;
    const t = Math.tan(MathUtils.degToRad(camera.fov / 2));
    const dist = Math.max(halfH / t, halfW / (t * aspect)) + 0.6;
    camera.position.set(0, 2.1 + dist * 0.08, dist);
    camera.lookAt(0, target.y, 0);
    camera.updateProjectionMatrix();
  };

  /* ---------- motion ---------- */
  const pointer = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  const start = performance.now();
  const pose = (now: number) => {
    const t = (now - start) / 1000;
    eased.x += (pointer.x - eased.x) * 0.045;
    eased.y += (pointer.y - eased.y) * 0.045;
    world.rotation.y = eased.x * 0.14;
    world.rotation.x = eased.y * 0.04;
    for (const it of items) {
      const p = narrow ? it.narrow : it.wide;
      const bob = Math.sin(t * 0.75 + it.phase) * 0.09;
      const y = it.lift + bob;
      it.obj.position.set(p.x, y, p.z);
      if (it.kind === 'bottle') {
        it.obj.rotation.y = p.yaw + Math.sin(t * 0.22 + it.phase) * 0.55;
        it.obj.rotation.z = Math.sin(t * 0.5 + it.phase) * 0.035;
      } else {
        it.obj.rotation.set(Math.sin(t * 0.6 + it.phase) * 0.06, p.yaw + Math.sin(t * 0.18 + it.phase) * 0.3, Math.sin(t * 0.45 + it.phase) * 0.08);
      }
      // The shadow tightens and darkens as the pack dips towards the shelf.
      const k = 1 - (y - 0.1) * 0.7;
      it.shadow.position.set(p.x, 0.002, p.z);
      it.shadow.scale.setScalar(it.shadowSize * (0.85 + (1 - k) * 0.5));
      (it.shadow.material as MeshBasicMaterial).opacity = MathUtils.clamp(k, 0.35, 1);
    }
  };

  /* ---------- loop, visibility, resize ---------- */
  let raf = 0;
  let inView = true;
  let first = true;
  let disposed = false;
  let lost = false; // a lost context is not restored; the static composition takes over for good

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
    fit(w, h);
    if (!raf && !disposed && !lost) {
      pose(performance.now());
      renderer.render(scene, camera);
    }
  };
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

  // No preventDefault: we do not ask for a restore. Rendering stops for good and the
  // static composition underneath shows again.
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
