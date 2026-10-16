/**
 * Strip softboxes for the studio stills only (never shipped: RectAreaLight needs a lookup table
 * the live hero does not need). Tall thin area lights draw a long specular streak down each
 * bottle, the signature of packaging photography: front-left warm, back-right cool.
 */
import { RectAreaLight, type Scene } from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

let ready = false;

export function addStrips(scene: Scene, aim: { x: number; y: number } = { x: 0, y: 1 }): void {
  if (!ready) {
    RectAreaLightUniformsLib.init();
    ready = true;
  }
  const front = new RectAreaLight('#fffaf0', 9, 0.9, 7);
  front.position.set(aim.x - 4.5, 3.2, 6);
  front.lookAt(aim.x, aim.y, 0);
  const back = new RectAreaLight('#d8f2e4', 7, 0.7, 6);
  back.position.set(aim.x + 5, 3, -3.5);
  back.lookAt(aim.x, aim.y + 0.1, 0);
  scene.add(front, back);
}
