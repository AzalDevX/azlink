// src/pages/api/redirect/[shortCode].ts
import type { APIRoute } from 'astro';
import { linkService } from '../../../lib/linkService';

export const prerender = false; // 👈 Esto evita que Astro intente prerenderizar la API

export const get: APIRoute = async ({ params, redirect }) => {
  const { shortCode } = params;

  if (!shortCode) {
    return new Response('Short code not provided', { status: 400 });
  }

  try {
    const link = await linkService.getLinkByShortCode(shortCode);

    if (!link) {
      return new Response('Link not found', { status: 404 });
    }

    // Incrementar el contador de clicks
    await linkService.incrementClicks(shortCode);

    // Redireccionar al URL original
    return redirect(link.url, 302);
  } catch (error) {
    console.error('Error redirecting:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
