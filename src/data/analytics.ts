// src/data/analytics.ts — meet-instellingen.
// GA_ID is openbaar (staat in elke pagina), dus hoeft niet geheim in een env var.
// Leeg laten = geen Google Analytics en geen cookiebanner; Vercel Analytics meet altijd (cookieloos).
export const GA_ID = 'G-7FP24FC9GK';

// Sleutel in localStorage voor de cookiekeuze ('ja' | 'nee').
export const COOKIE_KEUZE_SLEUTEL = 'vb-cookiekeuze';
