// tailwind.config.mjs
// Geladen via `@config` in src/styles/global.css (Tailwind v4 legacy-config support).
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],

  theme: {
    extend: {
      // ── Kleuren ────────────────────────────────────────────────────────────
      // PRIMAIRE KLEUR: #55A8AA — teal, bevestigd door eigenaar.
      // LET OP (contrast): wit op #55A8AA haalt ca. 3.8:1 → onvoldoende voor
      // kleine tekst (WCAG AA 4.5:1). Gebruik primary.dark voor kleine tekst op wit.
      colors: {
        primary: {
          DEFAULT: '#55A8AA',
          dark:    '#3E8284',
          light:   '#7FC0C2',
          10:      '#EAF4F4',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          light:   '#3D3D3D',
          muted:   '#6B7280',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft:    '#F8F7F5',
          mid:     '#F0EDE8',
        },
        border: {
          DEFAULT: '#E5E0D8',
          light:   '#F0EDE8',
        },
        // Functioneel
        success: '#2D7D46',
        error:   '#C0392B',
        warning: '#D97706',
      },

      // ── Typografie ─────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },

      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1rem' }],
        'sm':   ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem',     { lineHeight: '1.625rem' }],
        'lg':   ['1.125rem', { lineHeight: '1.75rem' }],
        'xl':   ['1.25rem',  { lineHeight: '1.875rem' }],
        '2xl':  ['1.5rem',   { lineHeight: '2rem' }],
        '3xl':  ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl':  ['2.25rem',  { lineHeight: '2.5rem' }],
        '5xl':  ['3rem',     { lineHeight: '1.2' }],
        'hero': ['3.5rem',   { lineHeight: '1.1' }],
      },

      borderRadius: {
        'sm':   '4px',
        'md':   '8px',
        'lg':   '12px',
        'xl':   '16px',
        '2xl':  '24px',
      },

      boxShadow: {
        'sm':  '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md':  '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg':  '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl':  '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },

      maxWidth: {
        'container': '1280px',
        'content':   '768px',
        'narrow':    '640px',
      },

      spacing: {
        '18':  '4.5rem',
        '22':  '5.5rem',
        '26':  '6.5rem',
        '30':  '7.5rem',
      },

      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '400': '400ms',
      },
    },
  },

  plugins: [],
};
