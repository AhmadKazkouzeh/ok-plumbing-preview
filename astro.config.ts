import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { SITE_URL } from './src/data/site';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  image: {
    // Sized once at build time; nothing is fetched at runtime.
    responsiveStyles: true,
  },
});
