// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',
    functionPerRoute: true,
  }),
  integrations: [tailwind()],
  vite: {
    build: {
      rollupOptions: {
        external: ['node:async_hooks'], // Esto puede ser necesario para evitar errores con Firebase
      },
    },
  },
});
