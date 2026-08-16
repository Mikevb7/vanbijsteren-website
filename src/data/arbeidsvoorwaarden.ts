// src/data/arbeidsvoorwaarden.ts
// TE_VERIFIËREN: eigenaar bevestigt welke items getoond mogen worden

export interface Arbeidsvoorwaarde {
  icon:   string;    // Lucide icon
  titel:  string;
  detail: string;
  verified: boolean; // false = TE_VERIFIËREN, toon nog niet op site
}

export const arbeidsvoorwaarden: Arbeidsvoorwaarde[] = [
  {
    icon:     "FileText",
    titel:    "Vast contract",
    detail:   "Wij bieden een vast dienstverband, geen tijdelijk.",  // TE_VERIFIËREN (TV-15)
    verified: false,
  },
  {
    icon:     "Shield",
    titel:    "Cao Afbouw",
    detail:   "Beloning conform cao Afbouw, marktconform voor jouw ervaring.",
    verified: true,
  },
  {
    icon:     "Truck",
    titel:    "Bedrijfsbussen",
    detail:   "Je rijdt in een herkenbare Van Bijsteren-bus, voorzien van goed materieel.", // TE_VERIFIËREN (TV-15)
    verified: false,
  },
  {
    icon:     "Wrench",
    titel:    "Goed gereedschap",
    detail:   "We werken met kwalitatief gereedschap en A-merk materialen.", // TE_VERIFIËREN (TV-15)
    verified: false,
  },
  {
    icon:     "MapPin",
    titel:    "Dicht bij huis",
    detail:   "Wij werken in de Noord-Veluwe. Geen lange reistijden.",
    verified: true,
  },
  {
    icon:     "GraduationCap",
    titel:    "Leren en groeien",
    detail:   "Ruimte voor opleiding, begeleiding en doorgroei binnen het bedrijf.", // TE_VERIFIËREN (TV-15)
    verified: false,
  },
  {
    icon:     "Users",
    titel:    "Hecht team",
    detail:   "Een klein, persoonlijk team waar je echt gekend wordt.",
    verified: true,
  },
  {
    icon:     "Euro",
    titel:    "Salaris",
    detail:   "Salaris conform cao Afbouw, afhankelijk van ervaring.", // TE_VERIFIËREN (TV-13/14) voor exacte range
    verified: true,
  },
];

// Alleen verified items tonen totdat eigenaar de rest bevestigt
export const gechecktArbeidsvoorwaarden = arbeidsvoorwaarden.filter(a => a.verified);
