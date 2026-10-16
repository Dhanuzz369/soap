/**
 * Three.js pack builders: one stylised model per pack shape in src/lib/pack-shapes.ts.
 *
 * Shared by the live home hero (hero-scene.ts) and the studio render script
 * (scripts/render-packs.mjs), so the pre-rendered stills and the live scene are the same models.
 * Everything is built from primitives, lathes and deformed boxes: no model files to download.
 * Each builder returns a Group standing on y = 0, roughly 1.6–2.5 units tall.
 *
 * Three material qualities share the same models:
 *   live    the runtime hero: opaque glossy plastic, cheap enough for a phone
 *   glossy  the pre-rendered stills: PET bottles with transmission and thickness, clearcoat 1 on
 *           caps, clearcoated labels (no runtime cost, so no compromise)
 *   matte   a white coverage pass of the same scene, used by the render script to cut the stills
 *           out with a clean alpha channel (see scripts/render-packs.mjs)
 */
import {
  BoxGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  Group,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NoColorSpace,
  PlaneGeometry,
  SphereGeometry,
  SplineCurve,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  type BufferGeometry,
  type Material,
  type Texture,
  type WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { Shape } from '../../lib/pack-shapes';

/* Category tints, the same values as tokens.css [data-cat] (--pv-body / --pv-dark / --pv-light). */
export const TINT = {
  soaps: { body: '#a9d9bd', dark: '#3f7d5e', light: '#f2faf5' },
  laundry: { body: '#9ccbca', dark: '#39716f', light: '#f0f8f8' },
  kitchen: { body: '#bfd396', dark: '#5b7339', light: '#f6f9ee' },
  surface: { body: '#8fc0aa', dark: '#3a6f5a', light: '#eef7f2' },
  raw: { body: '#b6c0ad', dark: '#56634f', light: '#f4f6f1' },
} as const;
export type Tint = (typeof TINT)[keyof typeof TINT];

/** The tint for each product category (category slug → tint). */
export const CATEGORY_TINT: Record<string, Tint> = {
  'bath-personal-soaps': TINT.soaps,
  'laundry-care': TINT.laundry,
  'kitchen-care': TINT.kitchen,
  'surface-home-cleaners': TINT.surface,
  'industrial-raw-materials': TINT.raw,
};

/** Which tint each shape takes when it stands alone (its most typical category). */
export const SHAPE_TINT: Record<Shape, Tint> = {
  squeeze: TINT.kitchen,
  jug: TINT.laundry,
  spray: TINT.surface,
  pump: TINT.soaps,
  angled: TINT.surface,
  bar: TINT.soaps,
  'bar-clear': TINT.soaps,
  'bar-duo': TINT.soaps,
  'bar-long': TINT.laundry,
  tub: TINT.kitchen,
  pouch: TINT.laundry,
  carboy: TINT.raw,
  drum: TINT.raw,
  sack: TINT.raw,
};

export type Disposable = { dispose(): void };

export type PackQuality = 'live' | 'glossy' | 'matte';

export type PackKit = {
  /** Builds one pack. `tint` overrides the shape's default category colour. */
  build(shape: Shape, tint?: Tint): Group;
  /** A soft contact shadow (a unit plane on the floor; scale it to the pack's footprint). */
  shadow(): Mesh;
};

export function createPackKit(
  renderer: WebGLRenderer,
  keep: <T extends Disposable>(d: T) => T,
  quality: PackQuality = 'live',
): PackKit {
  const glossy = quality === 'glossy';
  const matte = quality === 'matte';
  /* In the matte pass every surface is plain white: the render script reads coverage from it. */
  const white = matte ? keep(new MeshBasicMaterial({ color: '#ffffff', toneMapped: false })) : null;

  /* ---------- materials ---------- */
  const bottleMat = (t: Tint): Material =>
    white ??
    keep(
      glossy
        ? new MeshPhysicalMaterial({
            // Filled PET: a tinted liquid seen through a thin glossy wall.
            color: t.body,
            roughness: 0.1,
            metalness: 0,
            transmission: 0.42,
            thickness: 1.3,
            ior: 1.46,
            attenuationColor: new Color(t.dark),
            attenuationDistance: 1.8,
            specularIntensity: 1,
            clearcoat: 1,
            clearcoatRoughness: 0.04,
            sheen: 0.2,
            sheenColor: new Color(t.light),
          })
        : new MeshPhysicalMaterial({
            color: t.body,
            roughness: 0.22,
            metalness: 0,
            clearcoat: 1,
            clearcoatRoughness: 0.14,
            sheen: 0.25,
            sheenColor: new Color(t.light),
          }),
    );
  const capMat = (hex: string): Material =>
    white ??
    keep(
      glossy
        ? new MeshPhysicalMaterial({ color: hex, roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.06 })
        : new MeshPhysicalMaterial({ color: hex, roughness: 0.34, clearcoat: 0.7, clearcoatRoughness: 0.25 }),
    );
  const soapMat = (hex: string): Material =>
    white ??
    keep(
      new MeshPhysicalMaterial({
        color: hex,
        roughness: glossy ? 0.38 : 0.5,
        sheen: 0.7,
        sheenColor: new Color('#ffffff'),
        sheenRoughness: 0.55,
        ...(glossy ? { clearcoat: 0.35, clearcoatRoughness: 0.3 } : {}),
      }),
    );
  /** Printed labels and faces: clearcoated in the stills, a plain print in the live scene. */
  const printMat = (map: Texture, roughness: number): Material =>
    white ??
    keep(
      glossy
        ? new MeshPhysicalMaterial({ map, roughness: roughness * 0.6, clearcoat: 0.8, clearcoatRoughness: 0.1 })
        : new MeshStandardMaterial({ map, roughness }),
    );
  const clearSoapMat = (t: Tint): Material =>
    white ??
    keep(
      new MeshPhysicalMaterial({
        color: t.body,
        roughness: 0.08,
        transmission: 0.82,
        thickness: 1.2,
        ior: 1.5,
        attenuationColor: new Color(t.dark),
        attenuationDistance: 1.1,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      }),
    );
  const filmMat = (t: Tint, map?: Texture): Material =>
    white ??
    keep(
      new MeshPhysicalMaterial({
        color: map ? '#ffffff' : t.body,
        map,
        roughness: glossy ? 0.24 : 0.38,
        clearcoat: glossy ? 0.9 : 0.55,
        clearcoatRoughness: glossy ? 0.12 : 0.3,
      }),
    );
  const wovenMat = (hex: string, map?: Texture): Material =>
    white ?? keep(new MeshStandardMaterial({ color: map ? '#ffffff' : hex, map, roughness: 0.86 }));

  const geo = <G extends BufferGeometry>(g: G): G => keep(g);
  const mesh = (g: BufferGeometry, m: Material | Material[], x = 0, y = 0, z = 0) => {
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

  /* ---------- printed labels (canvas textures) ---------- */
  const texture = (w: number, h: number, paint: (g: CanvasRenderingContext2D) => void): Texture => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    paint(c.getContext('2d')!);
    const tex = keep(new CanvasTexture(c));
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    return tex;
  };
  const leafMark = (g: CanvasRenderingContext2D, x: number, y: number, s: number, fg: string, bg: string) => {
    g.save();
    g.translate(x, y);
    g.scale(s, s);
    g.fillStyle = fg;
    g.beginPath();
    g.moveTo(0, -18);
    g.bezierCurveTo(15, -11, 15, 10, 0, 18);
    g.bezierCurveTo(-15, 10, -15, -11, 0, -18);
    g.fill();
    g.fillStyle = bg;
    g.fillRect(-1.3, -11, 2.6, 26);
    g.restore();
  };
  /** The brand label: light panel, leaf mark, two text bars. */
  const labelTexture = (t: Tint): Texture =>
    texture(512, 384, (g) => {
      g.fillStyle = t.light;
      g.fillRect(0, 0, 512, 384);
      leafMark(g, 256, 150, 3.4, t.dark, t.light);
      g.fillStyle = t.dark;
      g.fillRect(176, 268, 160, 14);
      g.fillRect(206, 300, 100, 10);
    });
  /** A whole printed face: body colour with a centred label panel (pouch, sack, wrapped soap). */
  const faceTexture = (t: Tint, opts: { panel?: [number, number, number, number]; top?: string; dots?: boolean; base?: string }) =>
    texture(512, 640, (g) => {
      g.fillStyle = opts.base ?? t.body;
      g.fillRect(0, 0, 512, 640);
      if (opts.top) {
        g.fillStyle = opts.top;
        g.fillRect(0, 0, 512, 92);
      }
      const [px, py, pw, ph] = opts.panel ?? [96, 200, 320, 300];
      g.fillStyle = t.light;
      g.beginPath();
      g.roundRect(px, py, pw, ph, 28);
      g.fill();
      leafMark(g, px + pw / 2, py + ph * 0.38, 3, t.dark, t.light);
      g.fillStyle = t.dark;
      g.fillRect(px + pw / 2 - 70, py + ph * 0.7, 140, 12);
      g.fillRect(px + pw / 2 - 44, py + ph * 0.7 + 26, 88, 9);
      if (opts.dots) {
        g.fillStyle = t.dark;
        for (let i = 0; i < 9; i++) g.fillRect(40 + i * 50, 120, 22, 6);
      }
    });

  const labelBand = (t: Tint, r: number, y0: number, y1: number, arc = 1.9) => {
    const m = printMat(labelTexture(t), 0.6);
    const g = geo(new CylinderGeometry(r, r, y1 - y0, 48, 1, true, -arc / 2, arc));
    return mesh(g, m, 0, (y0 + y1) / 2, 0);
  };

  /**
   * A box whose front and back bulge like a filled bag. `bulge(u, v)` (0..1 across, 0..1 up)
   * returns how much of the half-depth to keep at that point.
   */
  const bag = (w: number, h: number, d: number, bulge: (u: number, v: number) => number, mats: Material[]) => {
    const g = geo(new BoxGeometry(w, h, d, 24, 32, 6));
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const u = x / w + 0.5;
      const v = y / h + 0.5;
      pos.setZ(i, z * Math.max(0.04, bulge(u, v)));
    }
    g.computeVertexNormals();
    const o = mesh(g, mats);
    o.position.y = h / 2;
    return o;
  };

  /* ---------- the packs ---------- */
  const builders: Record<Shape, (t: Tint) => Group> = {
    // Dish wash: tall, flattened squeeze bottle with a flip cap.
    squeeze: (t) => {
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
    },

    // Fabric softener / liquid detergent: wide jug with a side handle and a measuring cap.
    jug: (t) => {
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
    },

    // Surface cleaner: slim bottle with a trigger spray head.
    spray: (t) => {
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
      g.add(mesh(geo(new RoundedBoxGeometry(0.86, 0.34, 0.36, 3, 0.1)), head, 0.18, 2.12, 0));
      g.add(mesh(geo(new RoundedBoxGeometry(0.16, 0.14, 0.16, 2, 0.04)), head, 0.66, 2.1, 0));
      const trigger = mesh(geo(new RoundedBoxGeometry(0.11, 0.44, 0.16, 2, 0.04)), capMat(t.body), 0.38, 1.82, 0);
      trigger.rotation.z = 0.18;
      g.add(trigger);
      return g;
    },

    // Hand wash / body wash: rounded pump bottle.
    pump: (t) => {
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
    },

    // Toilet bowl cleaner: bottle with an angled neck and nozzle cap.
    angled: (t) => {
      const g = new Group();
      const body = bottleMat(t);
      g.add(
        mesh(
          lathe([
            [0, 0], [0.5, 0.005], [0.56, 0.08], [0.58, 0.3], [0.58, 1.18], [0.5, 1.38],
            [0.3, 1.5], [0.2, 1.56],
          ]),
          body,
        ),
      );
      g.add(labelBand(t, 0.588, 0.36, 1.08));
      const neck = new Group();
      neck.add(mesh(geo(new CylinderGeometry(0.16, 0.2, 0.62, 32)), body, 0, 0.31, 0));
      neck.add(mesh(geo(new CylinderGeometry(0.1, 0.17, 0.34, 32)), capMat(t.dark), 0, 0.76, 0));
      neck.position.set(0.02, 1.5, 0);
      neck.rotation.z = -0.62;
      g.add(neck);
      g.scale.set(1, 1, 0.78);
      return g;
    },

    // Bath soap: a pillow bar with a pressed oval.
    bar: (t) => {
      const g = new Group();
      g.add(mesh(geo(new RoundedBoxGeometry(1.5, 0.46, 0.96, 5, 0.2)), soapMat(t.body), 0, 0.23, 0));
      const oval = mesh(geo(new SphereGeometry(0.42, 40, 20)), soapMat(t.light), 0, 0.44, 0);
      oval.scale.set(1.25, 0.08, 0.8);
      g.add(oval);
      return g;
    },

    // Glycerin soap: a clear, glassy bar.
    'bar-clear': (t) => {
      const g = new Group();
      g.add(mesh(geo(new RoundedBoxGeometry(1.44, 0.52, 0.92, 6, 0.24)), clearSoapMat(t), 0, 0.26, 0));
      const oval = mesh(geo(new SphereGeometry(0.36, 40, 20)), clearSoapMat(TINT.soaps), 0, 0.5, 0);
      oval.scale.set(1.25, 0.07, 0.8);
      g.add(oval);
      return g;
    },

    // Hotel guest soap: a wrapped mini bar next to an open one.
    'bar-duo': (t) => {
      const g = new Group();
      const wrap = faceTexture(t, { panel: [56, 150, 400, 340], base: t.light });
      const paper = wovenMat(t.light);
      const wrapped = mesh(
        geo(new RoundedBoxGeometry(0.98, 0.34, 0.66, 3, 0.05)),
        // box face order is +x, -x, +y, -y, +z, -z: the print goes on top (+y)
        [paper, paper, printMat(wrap, 0.7), paper, paper, paper],
        -0.42, 0.17, 0.1,
      );
      wrapped.rotation.y = 0.28;
      g.add(wrapped);
      const open = mesh(geo(new RoundedBoxGeometry(0.86, 0.34, 0.58, 5, 0.15)), soapMat(t.body), 0.55, 0.17, 0.32);
      open.rotation.y = -0.4;
      g.add(open);
      return g;
    },

    // Laundry soap: a long bar with a pressed panel.
    'bar-long': (t) => {
      const g = new Group();
      g.add(mesh(geo(new RoundedBoxGeometry(2.1, 0.5, 0.74, 5, 0.18)), soapMat(t.body), 0, 0.25, 0));
      const panel = mesh(geo(new RoundedBoxGeometry(1.1, 0.04, 0.44, 3, 0.02)), soapMat(t.light), 0, 0.5, 0);
      g.add(panel);
      return g;
    },

    // Dish wash bar: a round tub with a lid and a printed band.
    tub: (t) => {
      const g = new Group();
      g.add(mesh(geo(new CylinderGeometry(0.78, 0.68, 0.7, 64)), filmMat(t), 0, 0.35, 0));
      g.add(labelBand(t, 0.745, 0.12, 0.56, 2.2));
      const lid = capMat(t.dark);
      g.add(mesh(geo(new CylinderGeometry(0.82, 0.82, 0.16, 64)), lid, 0, 0.76, 0));
      const rim = mesh(geo(new TorusGeometry(0.81, 0.035, 12, 64)), lid, 0, 0.84, 0);
      rim.rotation.x = Math.PI / 2;
      g.add(rim);
      return g;
    },

    // Detergent / dish wash powder: a stand-up pouch.
    pouch: (t) => {
      const g = new Group();
      const front = filmMat(t, faceTexture(t, { panel: [110, 250, 292, 300], top: t.dark }));
      const side = filmMat(t);
      const w = 1.24;
      const h = 1.9;
      const body = bag(w, h, 0.62, (u, v) => {
        const across = Math.sin(Math.PI * Math.min(1, Math.max(0, u))) ** 0.45;
        const up = v > 0.9 ? 0.1 : v < 0.08 ? 0.8 + v : 1 - 0.75 * v ** 1.6;
        return across * up;
      }, [side, side, side, side, front, front]);
      g.add(body);
      g.add(mesh(geo(new BoxGeometry(w * 1.02, 0.12, 0.04)), capMat(t.dark), 0, h - 0.06, 0));
      return g;
    },

    // Bulk cleaners: a jerrycan with a carry handle and a spout.
    carboy: (t) => {
      const g = new Group();
      const body = bottleMat(t);
      g.add(mesh(geo(new RoundedBoxGeometry(1.5, 1.5, 0.92, 6, 0.18)), body, 0, 0.75, 0));
      const lbl = mesh(geo(new PlaneGeometry(0.92, 0.62)), printMat(labelTexture(t), 0.6), 0, 0.68, 0.462);
      g.add(lbl);
      // handle: two posts and a grip
      g.add(mesh(geo(new RoundedBoxGeometry(0.16, 0.34, 0.26, 2, 0.06)), body, -0.62, 1.62, 0));
      g.add(mesh(geo(new RoundedBoxGeometry(0.16, 0.34, 0.26, 2, 0.06)), body, 0.02, 1.62, 0));
      g.add(mesh(geo(new RoundedBoxGeometry(0.8, 0.14, 0.26, 2, 0.06)), body, -0.3, 1.8, 0));
      g.add(mesh(geo(new CylinderGeometry(0.17, 0.17, 0.3, 32)), capMat(t.dark), 0.46, 1.62, 0));
      return g;
    },

    // Raw materials: a ribbed drum.
    drum: (t) => {
      const g = new Group();
      const body =
        white ??
        keep(
          new MeshPhysicalMaterial({
            color: t.body,
            roughness: glossy ? 0.3 : 0.4,
            clearcoat: glossy ? 0.9 : 0.5,
            clearcoatRoughness: glossy ? 0.12 : 0.35,
          }),
        );
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
    },

    // Soap noodles: a filled woven sack, stitched at the top.
    sack: (t) => {
      const g = new Group();
      const front = wovenMat(t.body, faceTexture(t, { panel: [100, 230, 312, 300], base: t.body, dots: true }));
      const side = wovenMat(t.body);
      const w = 1.5;
      const h = 1.8;
      g.add(
        bag(w, h, 0.9, (u, v) => {
          const across = Math.sin(Math.PI * Math.min(1, Math.max(0, u))) ** 0.5;
          const up = v > 0.94 ? 0.12 : Math.sin(Math.PI * Math.min(1, v * 0.92 + 0.08)) ** 0.35;
          return across * up;
        }, [side, side, side, side, front, front]),
      );
      const seam = capMat(t.dark);
      g.add(mesh(geo(new BoxGeometry(w * 1.04, 0.1, 0.08)), seam, 0, h - 0.06, 0));
      return g;
    },
  };

  /* ---------- soft contact shadow ---------- */
  const shadowTex = texture(128, 128, (g) => {
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0,8,5,0.82)');
    grad.addColorStop(0.5, 'rgba(0,8,5,0.32)');
    grad.addColorStop(1, 'rgba(0,8,5,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
  });
  // The matte pass needs the shadow's coverage as white: the same falloff, read through alphaMap (green).
  const shadowMatteTex = matte
    ? texture(128, 128, (g) => {
        const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, 'rgb(209,209,209)');
        grad.addColorStop(0.5, 'rgb(82,82,82)');
        grad.addColorStop(1, 'rgb(0,0,0)');
        g.fillStyle = grad;
        g.fillRect(0, 0, 128, 128);
      })
    : null;
  if (shadowMatteTex) shadowMatteTex.colorSpace = NoColorSpace;
  const shadowGeo = geo(new PlaneGeometry(1, 1));

  return {
    build: (shape, tint) => builders[shape](tint ?? SHAPE_TINT[shape]),
    shadow: () => {
      const m = keep(
        shadowMatteTex
          ? new MeshBasicMaterial({ color: '#ffffff', alphaMap: shadowMatteTex, transparent: true, depthWrite: false, toneMapped: false })
          : new MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, toneMapped: false }),
      );
      const s = new Mesh(shadowGeo, m);
      s.rotation.x = -Math.PI / 2;
      s.renderOrder = -1;
      return s;
    },
  };
}
