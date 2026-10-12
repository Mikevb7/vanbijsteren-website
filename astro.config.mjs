// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.vanbijsterenstukadoors.nl',

  // URL's zonder slash aan het eind, gelijk aan Vercel (trailingSlash: false).
  // Zo wijzen canonical, sitemap en interne links naar exact dezelfde URL
  // en verwijst de canonical nooit naar een redirect.
  trailingSlash: 'never',
  build: { format: 'file' },

  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/admin') &&
        !page.includes('/_astro') &&
        !/\/(bedankt|demo|404)$/.test(page) &&
        // Plaatspagina's staan op noindex (content-gate: eerst ≥2 projecten met foto per plaats).
        // Haal een plaats hier weg zodra je noindex op die pagina uitzet.
        !/\/stukadoor-(harderwijk|ermelo|putten|nunspeet|zeewolde)$/.test(page),
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
