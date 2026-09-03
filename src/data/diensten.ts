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
  // Pillars
  {
    slug:               "stucwerk",
    naam:               "Stucwerk",
    korteOmschrijving:  "Alle vormen van stucwerk voor binnen en buiten.",
    icon:               "Paintbrush",
    href:               "/stucwerk",
    isPillar:           true,
  },
  {
    slug:               "binnen-stucwerk",
    naam:               "Binnen stucwerk",
    korteOmschrijving:  "Strakke wanden en plafonds voor ieder interieur.",
    icon:               "Home",
    href:               "/binnen-stucwerk",
    isPillar:           true,
  },
  {
    slug:               "sierpleister",
    naam:               "Sierpleister",
    korteOmschrijving:  "Decoratieve wandafwerkingen zoals spachtelputz en granolputz.",
    icon:               "Layers",
    href:               "/sierpleister",
    isPillar:           true,
  },
  {
    slug:               "buitengevelstucwerk",
    naam:               "Buitengevelstucwerk",
    korteOmschrijving:  "Duurzame en mooie afwerking van uw gevel.",
    icon:               "Building2",
    href:               "/buitengevelstucwerk",
    isPillar:           true,
  },
  {
    slug:               "decoratief-stucwerk",
    naam:               "Decoratief stucwerk",
    korteOmschrijving:  "Premium afwerkingen zoals Italiaans stucwerk en Frescolori.",
    icon:               "Sparkles",
    href:               "/decoratief-stucwerk",
    isPillar:           true,
  },
  {
    slug:               "stucwerk-reparatie-renovatie",
    naam:               "Reparatie & renovatie",
    korteOmschrijving:  "Vakkundig herstel van beschadigd of verouderd stucwerk.",
    icon:               "Wrench",
    href:               "/stucwerk-reparatie-renovatie",
    isPillar:           true,
  },
  // Spokes
  {
    slug:               "gladpleisterwerk",
    naam:               "Gladpleisterwerk",
    korteOmschrijving:  "Strakke, gladde wanden, perfect afgewerkt.",
    icon:               "PaintRoller",
    href:               "/binnen-stucwerk/gladpleisterwerk",
    parent:             "binnen-stucwerk",
    isPillar:           false,
  },
  {
    slug:               "plafond-stucen",
    naam:               "Plafond stucen",
    korteOmschrijving:  "Strakke plafonds zonder naden of oneffenheden.",
    icon:               "ArrowUp",
    href:               "/binnen-stucwerk/plafond-stucen",
    parent:             "binnen-stucwerk",
    isPillar:           false,
  },
  {
    slug:               "schuurwerk",
    naam:               "Schuurwerk",
    korteOmschrijving:  "Egale ondergrond voor schilderwerk of behang.",
    icon:               "SlidersHorizontal",
    href:               "/binnen-stucwerk/schuurwerk",
    parent:             "binnen-stucwerk",
    isPillar:           false,
  },
  {
    slug:               "spackspuitwerk",
    naam:               "Spackspuitwerk",
    korteOmschrijving:  "Snel en kostenefficiënt voor grote oppervlakten.",
    icon:               "Zap",
    href:               "/binnen-stucwerk/spackspuitwerk",
    parent:             "binnen-stucwerk",
    isPillar:           false,
  },
  {
    slug:               "behangklaar-sausklaar",
    naam:               "Behang- en sausklaar",
    korteOmschrijving:  "Wanden perfect voorbereid voor verf of behang.",
    icon:               "CheckSquare",
    href:               "/binnen-stucwerk/behangklaar-sausklaar",
    parent:             "binnen-stucwerk",
    isPillar:           false,
  },
  {
    slug:               "spachtelputz",
    naam:               "Spachtelputz",
    korteOmschrijving:  "Populaire sierpleister voor binnen en buiten.",
    icon:               "Brush",
    href:               "/sierpleister/spachtelputz",
    parent:             "sierpleister",
    isPillar:           false,
  },
  {
    slug:               "granolputz",
    naam:               "Granolputz",
    korteOmschrijving:  "Grovere sierpleister met een robuuste uitstraling.",
    icon:               "Grip",
    href:               "/sierpleister/granolputz",
    parent:             "sierpleister",
    isPillar:           false,
  },
  {
    slug:               "spachtelputz-buiten",
    naam:               "Spachtelputz buiten",
    korteOmschrijving:  "Decoratieve en weersbestendige gevelafwerking.",
    icon:               "CloudRain",
    href:               "/buitengevelstucwerk/spachtelputz-buiten",
    parent:             "buitengevelstucwerk",
    isPillar:           false,
  },
  {
    slug:               "italiaans-stucwerk-frescolori",
    naam:               "Italiaans stucwerk & Frescolori",
    korteOmschrijving:  "Hoogwaardige kalk- en decoratiepleister voor een luxe uitstraling.",
    icon:               "Crown",
    href:               "/decoratief-stucwerk/italiaans-stucwerk-frescolori",
    parent:             "decoratief-stucwerk",
    isPillar:           false,
  },
];

// Helper: haal alle pillar-diensten op (voor homepage DienstGrid)
export const pillarDiensten = diensten.filter(d => d.isPillar && d.slug !== "stucwerk");

// Helper: haal spokes op voor een pillar
export function spokesVoor(pillarSlug: string): Dienst[] {
  return diensten.filter(d => d.parent === pillarSlug);
}
