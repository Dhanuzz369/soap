/**
 * A faint floor reflection: a mirrored copy of each pack below y = 0 that fades out with depth
 * below the floor. Used by the stills (scripts/render).
 *
 * The copy reuses the pack's geometry; its materials are clones made transparent, without
 * transmission (no second transmission pass), and with a fragment fade on world height.
 */
import { Group, type Material, type Mesh, type Object3D } from 'three';
import type { Disposable } from './packs';

export type Reflection = {
  /** The group to add to the scene (mirrored about the floor). */
  group: Group;
  /** Adds a mirrored copy of `obj` and returns it. */
  add(obj: Object3D): Object3D;
  /** Copies every source's position, rotation and scale onto its mirror (call after posing). */
  sync(): void;
};

/** `opacity` at the floor line, fading to 0 at `depth` world units below it. */
export function createReflection(keep: <T extends Disposable>(d: T) => T, opacity = 0.16, depth = 0.9): Reflection {
  const group = new Group();
  group.scale.y = -1;
  const pairs: [Object3D, Object3D][] = [];
  const cache = new Map<Material, Material>();

  const faded = (m: Material): Material => {
    const hit = cache.get(m);
    if (hit) return hit;
    const c = keep(m.clone());
    const anyC = c as Material & { transmission?: number; opacity: number };
    if (typeof anyC.transmission === 'number') anyC.transmission = 0;
    c.transparent = true;
    c.depthWrite = false;
    c.opacity = (m.transparent ? m.opacity : 1) * opacity;
    c.onBeforeCompile = (shader) => {
      shader.uniforms.uReflDepth = { value: depth };
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying float vReflY;')
        .replace('#include <project_vertex>', '#include <project_vertex>\nvReflY = (modelMatrix * vec4(transformed, 1.0)).y;');
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying float vReflY;\nuniform float uReflDepth;')
        .replace(/}\s*$/, '\tgl_FragColor.a *= smoothstep(-uReflDepth, 0.0, vReflY);\n}');
    };
    c.customProgramCacheKey = () => `refl-${depth}`;
    cache.set(m, c);
    return c;
  };

  return {
    group,
    add(obj) {
      const copy = obj.clone(true);
      copy.traverse((o) => {
        const mesh = o as Mesh;
        if (!mesh.isMesh) return;
        mesh.material = Array.isArray(mesh.material) ? mesh.material.map(faded) : faded(mesh.material);
        mesh.renderOrder = -1;
      });
      group.add(copy);
      pairs.push([obj, copy]);
      return copy;
    },
    sync() {
      for (const [src, dst] of pairs) {
        dst.position.copy(src.position);
        dst.rotation.copy(src.rotation);
        dst.scale.copy(src.scale);
      }
    },
  };
}
