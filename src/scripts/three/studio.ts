/**
 * The studio: renderer settings, lights and backdrop for packs photographed on the forest field.
 * Shared by the live hero and the render script so every still and the live scene match.
 *
 * Lighting is a classic dark-field product setup: a soft warm key from the upper left,
 * two mint rim lights from behind that draw the edges against the dark, a dim room
 * environment for the clearcoat reflections, and a faint glow on the backdrop behind the subject.
 */
import {
  CanvasTexture,
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  NeutralToneMapping,
  PlaneGeometry,
  PMREMGenerator,
  SpotLight,
  SRGBColorSpace,
  type Scene,
  type WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { Disposable } from './packs';

/** The hero and footer field (--forest-950). The clear colour is not tone-mapped, so it matches CSS exactly. */
export const FIELD = '#0b211a';
const GLOW = '31, 74, 60'; // --forest-700

export type StudioOptions = {
  /** Where the key light points (world x, y); defaults to the origin. */
  aim?: { x: number; y: number };
  /** Backdrop glow: centre (world x, y), size (world units), strength 0..1. */
  glow?: { x: number; y: number; w: number; h: number; strength: number };
  /**
   * What sits behind the packs: the forest field (stills' colour pass), nothing (the live hero
   * over its CSS field, alpha canvas), or black (the matte pass of the stills).
   */
  background?: 'field' | 'none' | 'black';
  /** Studio stills: a brighter room for the reflections (the strip softboxes are scripts/render/strips.ts). */
  glossy?: boolean;
};

export function setupStudio(
  renderer: WebGLRenderer,
  scene: Scene,
  keep: <T extends Disposable>(d: T) => T,
  opts: StudioOptions = {},
): void {
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;

  const bg = opts.background ?? 'field';
  scene.background = bg === 'none' ? null : new Color(bg === 'black' ? '#000000' : FIELD);

  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envRT = pmrem.fromScene(room, 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = opts.glossy ? 0.42 : 0.24;
  room.dispose();
  pmrem.dispose();
  keep(envRT);

  scene.add(new HemisphereLight('#d6eadf', '#0b211a', 0.22));
  // Key: a soft spot from the upper left, so the light falls off across the set like a softbox.
  const key = new SpotLight('#fff7ea', 3.6, 0, 0.62, 1, 0);
  key.position.set(-6 + (opts.aim?.x ?? 0), 9, 9);
  key.target.position.set(opts.aim?.x ?? 0, opts.aim?.y ?? 1, 0);
  scene.add(key, key.target);
  const fill = new DirectionalLight('#cfe6da', 0.45);
  fill.position.set(6, 2, 7);
  scene.add(fill);
  const rimR = new DirectionalLight('#bfe3cf', 4.2);
  rimR.position.set(6, 4, -6);
  scene.add(rimR);
  const rimL = new DirectionalLight('#bfe3cf', 2.6);
  rimL.position.set(-7, 3, -4);
  scene.add(rimL);


  const g = opts.glow;
  if (g && g.strength > 0) {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, `rgba(${GLOW}, ${g.strength})`);
    grad.addColorStop(0.55, `rgba(${GLOW}, ${g.strength * 0.4})`);
    grad.addColorStop(1, `rgba(${GLOW}, 0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    const tex = keep(new CanvasTexture(c));
    tex.colorSpace = SRGBColorSpace;
    const plane = new Mesh(
      keep(new PlaneGeometry(g.w, g.h)),
      keep(new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false })),
    );
    plane.position.set(g.x, g.y, -6);
    plane.renderOrder = -2;
    scene.add(plane);
  }
}
