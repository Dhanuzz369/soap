/**
 * The launch decision for THIS build (src/lib/deploy.ts): `site.launchReady` AND a production
 * build (VERCEL_ENV === 'production', or no VERCEL_ENV at all, as on your own computer). Every page's
 * robots meta tag, robots.txt and the sitemap use it, so a Vercel preview is never indexable.
 */
import site from '../config/site.ts';
import { isLaunched, vercelEnv } from './deploy.ts';

export const launched: boolean = isLaunched(site.launchReady, vercelEnv());
