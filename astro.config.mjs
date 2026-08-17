// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Update this to your Cloudflare Pages URL (or custom domain) after the first deploy.
  site: 'https://mahadi-hasan.pages.dev',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), react(), sitemap()]
});