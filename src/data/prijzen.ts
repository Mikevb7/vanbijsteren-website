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

// ─── Relatieve prijsniveaus (GEEN bedragen) ───────────────────────────────────
// Alleen wanden/plafonds hebben een bevestigde prijs. Voor de overige afwerkingen
// noemen we bewust geen bedragen — alleen hoe ze zich verhouden tot standaard
// stucwerk op wanden. Zo voorkomen we discussies over prijzen op de site.
export type Prijsniveau = 'Voordeliger' | 'Standaard' | 'Iets hoger' | 'Hoger' | 'Premium' | 'Wisselend';

export const prijsniveaus: { naam: string; href: string; niveau: Prijsniveau; uitleg: string }[] = [
  { naam: 'Spackspuitwerk',        href: '/binnen-stucwerk/spackspuitwerk',       niveau: 'Voordeliger', uitleg: 'Wordt gespoten in plaats van met de hand opgezet, dus snel klaar — vooral bij grote oppervlakten.' },
  { naam: 'Schuurwerk',            href: '/binnen-stucwerk/schuurwerk',           niveau: 'Voordeliger', uitleg: 'Een minder strakke afwerking dan glad stucwerk, en daardoor minder bewerkelijk.' },
  { naam: 'Behangklaar stucwerk',  href: '/binnen-stucwerk/behangklaar-sausklaar', niveau: 'Standaard',   uitleg: 'Een vlakke wand die klaar is voor behang. Dit valt onder onze prijsindicatie voor wanden.' },
  { naam: 'Gladpleisterwerk',      href: '/binnen-stucwerk/gladpleisterwerk',     niveau: 'Standaard',   uitleg: 'Strakke, gladde wanden. Dit is de basis van onze prijsindicatie voor wanden.' },
  { naam: 'Sausklaar stucwerk',    href: '/binnen-stucwerk/behangklaar-sausklaar', niveau: 'Iets hoger',  uitleg: 'Verf verbergt niets, dus de wand moet extra strak zijn. Dat vraagt meer afwerktijd.' },
  { naam: 'Plafond stucen',        href: '/binnen-stucwerk/plafond-stucen',       niveau: 'Iets hoger',  uitleg: 'Boven het hoofd werken is zwaarder en trager dan een wand.' },
  { naam: 'Spachtelputz & granolputz', href: '/sierpleister',                     niveau: 'Hoger',       uitleg: 'Sierpleister vraagt meer materiaal en handwerk om de structuur overal gelijk te krijgen.' },
  { naam: 'Buitengevelstucwerk',   href: '/buitengevelstucwerk',                  niveau: 'Hoger',       uitleg: 'Steigerwerk, weerbestendige materialen en planning rond het weer maken gevelwerk duurder.' },
  { naam: 'Italiaans stucwerk & Frescolori', href: '/decoratief-stucwerk/italiaans-stucwerk-frescolori', niveau: 'Premium', uitleg: 'Meerdere dunne lagen, hoogwaardige kalkpleisters en echt ambachtswerk.' },
  { naam: 'Reparatie & renovatie', href: '/stucwerk-reparatie-renovatie',         niveau: 'Wisselend',   uitleg: 'Hangt af van de schade. Per m² vaak relatief duurder, omdat voorbereiding en opstart hetzelfde blijven.' },
];

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
