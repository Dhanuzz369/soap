import type { APIRoute } from 'astro';
import site from '../config/site';
import { buildRobots } from '../lib/robots';
import { launched } from '../lib/launch';

export const GET: APIRoute = () =>
  new Response(buildRobots(site.url, launched) + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
