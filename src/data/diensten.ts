// src/data/diensten.ts

export interface Dienst {
  slug: string;
  naam: string;
  korteOmschrijving: string;       // 1 zin voor cards
  icon: string;                    // Lucide icon-naam
  href: string;
  parent?: string;                 // slug van pillar als dit een spoke is
  isPillar: boolean;
  kleurAccent?: string;            // optioneel afwijkend accent (altijd primary als niet ingesteld)
}

export const diensten: Dienst[] = [
  // Overzicht. Van Bijsteren doet ALLEEN onderstaande vier diensten (bevestigd door Marcel, 13-10-2026):
  // glad stucwerk voor schilderwerk, behangklaar, spackspuitwerk (wanden en plafonds).
  {
    slug:               "stucwerk",
    naam:               "Stucwerk",
    korteOmschrijving:  "Strak glad stucwerk, behangklaar en spackspuitwerk.",
    icon:               "Paintbrush",
    href:               "/stucwerk",
    isPillar:           false,
  },
  {
    slug:               "gladpleisterwerk",
    naam:               "Glad stucwerk (sausklaar)",
    korteOmschrijving:  "Strakke, gladde wanden, klaar voor de schilder.",
    icon:               "PaintRoller",
    href:               "/binnen-stucwerk/gladpleisterwerk",
    isPillar:           true,
  },
  {
    slug:               "behangklaar-sausklaar",
    naam:               "Behangklaar stucwerk",
    korteOmschrijving:  "Vlakke wanden, klaar om te behangen.",
    icon:               "CheckSquare",
    href:               "/binnen-stucwerk/behangklaar-sausklaar",
    isPillar:           true,
  },
  {
    slug:               "plafond-stucen",
    naam:               "Plafonds",
    korteOmschrijving:  "Strak gestuct of gespoten, zonder naden.",
    icon:               "ArrowUp",
    href:               "/binnen-stucwerk/plafond-stucen",
    isPillar:           true,
  },
  {
    slug:               "spackspuitwerk",
    naam:               "Spackspuitwerk",
    korteOmschrijving:  "Snel en strak gespoten, ideaal voor grote oppervlakken.",
    icon:               "Zap",
    href:               "/binnen-stucwerk/spackspuitwerk",
    isPillar:           true,
  },
];

// Helper: haal alle pillar-diensten op (voor homepage DienstGrid)
export const pillarDiensten = diensten.filter(d => d.isPillar && d.slug !== "stucwerk");

// Helper: haal spokes op voor een pillar
export function spokesVoor(pillarSlug: string): Dienst[] {
  return diensten.filter(d => d.parent === pillarSlug);
}
