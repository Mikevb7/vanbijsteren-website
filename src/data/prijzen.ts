// src/data/prijzen.ts — ENIGE bron voor prijsindicaties op de site.
// Bevestigd door Marcel van Bijsteren (12-10-2026). Wijzig prijzen alléén hier;
// alle pagina's, FAQ's en de prijscalculator lezen uit dit bestand.
// UITZONDERING: src/content/faq/wat-kost-stucwerk.md (markdown) staat hardcoded —
// pas die bij een prijswijziging handmatig mee aan.

export const prijzen = {
  wandPerM2:     30,   // € per m², excl. btw
  plafondPerM2:  35,   // € per m², excl. btw
  minimumM2:     100,  // minimale opdracht, totaal m²
  btwLaag:       9,    // % — woningen ouder dan 2 jaar
  btwHoog:       21,   // % — nieuwbouw en overige
} as const;
// Werkgebied (max. 40 km) staat in bedrijf.ts → werkgebiedRadius.

/** Bedrag als "€ 1.234" (nl-NL, zonder centen). */
export const euro = (n: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

/** Korte zin voor FAQ's en lopende tekst. */
export const prijsZin =
  `Als prijsindicatie rekenen wij €${prijzen.wandPerM2} per m² voor wanden en €${prijzen.plafondPerM2} per m² voor plafonds, ` +
  `exclusief btw (${prijzen.btwLaag}% voor woningen ouder dan 2 jaar, anders ${prijzen.btwHoog}%). ` +
  `De minimale opdracht is ${prijzen.minimumM2} m².`;

/** Standaard FAQ-antwoord op "Wat kost stucwerk per m²?". */
export const prijsFaqAntwoord =
  `${prijsZin} De definitieve prijs hangt af van de ondergrond, de gewenste afwerking en de bereikbaarheid. ` +
  `Voor een exacte prijs komen wij vrijblijvend bij u langs om het werk op te nemen.`;
