/**
 * Decides whether the home hero may upgrade from its static SVG composition to the
 * Three.js scene. Kept apart from hero-scene.ts so the loader can run this check
 * without pulling Three.js into the page's first script.
 */
export type HeroEnv = { reducedMotion: boolean; webgl: boolean; saveData: boolean };

export function shouldRun3D(env: HeroEnv): boolean {
  return !env.reducedMotion && env.webgl && !env.saveData;
}

/** Reads the environment in a browser. */
export function detectHeroEnv(): HeroEnv {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  let webgl = false;
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    webgl = !!gl;
    // Release the probe context straight away; browsers cap live contexts.
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webgl = false;
  }
  return { reducedMotion, webgl, saveData: !!conn?.saveData };
}
