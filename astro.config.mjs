// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.vanbijsterenstukadoors.nl',

  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/admin') &&
        !page.includes('/_astro'),
      i18n: {
        defaultLocale: 'nl',
        locales: { nl: 'nl-NL' },
      },
    }),
  ],

  // Volledige statische output — geen server-side rendering
  output: 'static',

  // Afbeeldingen via Astro's eigen optimalisatie (Sharp)
  image: {
    remotePatterns: [],
  },

  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },

  vite: {
    // Tailwind CSS v4 via de officiële Vite-plugin
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@data': '/src/data',
        '@styles': '/src/styles',
        '@assets': '/src/assets',
      },
    },
  },
});
