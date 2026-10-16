import type { APIRoute } from 'astro';
import site from '../config/site';
import { buildRobots } from '../lib/robots';

export const GET: APIRoute = () =>
  new Response(buildRobots(site.url, site.launchReady) + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
