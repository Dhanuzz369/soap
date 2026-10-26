/**
 * Export registrations (FIEO, MSME/Udyam, CHEMEXCIL RCMC, DGFT IEC): the config in site.ts, resolved
 * for display. A logo is used only when `logoAllowed` and the file exists in public/ at build time;
 * otherwise the component draws a text badge. DGFT is never given a logo (State Emblem of India).
 * No registration numbers are held or shown anywhere.
 */
import fs from 'node:fs';
import path from 'node:path';
import site, { type Registration, type RegistrationId } from '../config/site';
import { rasterSize } from './product-image';

export interface ResolvedRegistration extends Registration {
  /** Logo URL when it may be used and the file exists. */
  logoSrc?: string;
  /** Logo aspect ratio (width / height), for explicit width and height attributes. */
  aspect?: number;
}

/** Natural size of an SVG (width/height attributes or viewBox), or undefined. */
export function svgSize(svg: string): { width: number; height: number } | undefined {
  const tag = svg.match(/<svg\b[^>]*>/i)?.[0];
  if (!tag) return undefined;
  const num = (n: string) => {
    const v = tag.match(new RegExp(`\\s${n}="([\\d.]+)(?:px)?"`))?.[1];
    return v ? parseFloat(v) : undefined;
  };
  const w = num('width');
  const h = num('height');
  if (w && h) return { width: w, height: h };
  const vb = tag.match(/viewBox="([^"]+)"/i)?.[1]?.trim().split(/[\s,]+/).map(Number);
  if (vb && vb.length === 4 && vb[2] > 0 && vb[3] > 0) return { width: vb[2], height: vb[3] };
  return undefined;
}

const alt = (url: string) => (url.endsWith('.svg') ? url.replace(/\.svg$/, '.png') : url.replace(/\.png$/, '.svg'));

function logoFor(r: Registration, root: string): { src: string; aspect: number } | undefined {
  if (!r.logoAllowed || !r.logo) return undefined;
  for (const url of [r.logo, alt(r.logo)]) {
    const file = path.join(root, 'public', url);
    if (!fs.existsSync(file)) continue;
    try {
      const size = url.endsWith('.svg') ? svgSize(fs.readFileSync(file, 'utf8')) : rasterSize(fs.readFileSync(file));
      if (size) return { src: url, aspect: size.width / size.height };
    } catch {
      /* unreadable: fall back to the text badge */
    }
  }
  return undefined;
}

/** The registrations to show ([] when `showRegistrations` is false), each with its logo if usable. */
export function resolveRegistrations(
  root: string = process.cwd(),
  list: Registration[] = site.registrations,
  show: boolean = site.showRegistrations,
): ResolvedRegistration[] {
  if (!show) return [];
  return list.map((r) => {
    const l = logoFor(r, root);
    return { ...r, ...(l ? { logoSrc: l.src, aspect: l.aspect } : {}) };
  });
}

/** schema.org `memberOf` for the bodies the company is a member of (FIEO and CHEMEXCIL). No numbers. */
export function memberOfJsonLd(list: Registration[] = site.registrations, show: boolean = site.showRegistrations) {
  if (!show) return [];
  return list
    .filter((r) => r.id === 'fieo' || r.id === 'chemexcil')
    .map((r) => ({ '@type': 'Organization' as const, name: r.fullName, url: r.url }));
}

/** The words the llms line uses: `llmsLine` ("Registered with: {list}") and each body's status, from the UI file. */
export interface RegistrationLabels {
  llmsLine: string;
  status: Record<RegistrationId, string>;
}

/** The line for llms.txt and llms-full.txt, in the language of `labels` (ui.registrations). */
export function registrationsLlmsLine(
  labels: RegistrationLabels,
  list: Registration[] = site.registrations,
  show: boolean = site.showRegistrations,
): string | undefined {
  if (!show || !list.length) return undefined;
  const items = list.map((r) => (labels.status[r.id] ? `${r.name} (${labels.status[r.id]})` : r.name)).join(', ');
  return labels.llmsLine.replace('{list}', items);
}
