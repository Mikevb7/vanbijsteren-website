// src/types/index.ts

// ─── Basis ────────────────────────────────────────────────────────────────────

export interface CTA {
  label: string;
  href:  string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
  external?: boolean;
  ariaLabel?: string;  // indien de label-tekst niet volledig beschrijvend is
}

export interface Afbeelding {
  src:    string | ImageMetadata;
  alt:    string;
  width?: number;
  height?: number;
}

// ─── Componenten ──────────────────────────────────────────────────────────────

export interface HeroProps {
  heading:        string;
  subheading?:    string;
  primaryCta:     CTA;
  secondaryCta?:  CTA;
  image?:         Afbeelding;
  badge?:         string;
  variant:        'home' | 'service' | 'recruitment' | 'local' | 'simple';
  overlayDark?:   boolean;
}

export interface DienstCardProps {
  icon:         string;
  titel:        string;
  omschrijving: string;
  href:         string;
  ctaLabel?:    string;
}

export interface VacatureCardProps {
  titel:            string;
  locatie:          string;
  contractType:     string;
  salarisRange?:    string;
  highlights:       string[];
  href:             string;
  isOpen?:          boolean;
}

export interface FAQItem {
  vraag:    string;
  antwoord: string;
  categorie?: string;
}

export interface ReviewProps {
  quote:      string;
  auteur:     string;
  plaats?:    string;
  rating:     number;
  bron?:      string;
  datum?:     string;
  /** Alleen aanwezig bij Google-reviews (via Places API). */
  auteurUrl?:    string;
  profielFoto?:  string;
  tijdRelatief?: string;
}

/** Payload zoals scripts/fetch-google-reviews.mjs schrijft. */
export interface GoogleReviewsPayload {
  placeId:           string | null;
  fetchedAt:         string | null;
  name:              string | null;
  rating:            number | null;
  userRatingsTotal:  number | null;
  url:               string | null;
  reviews: Array<{
    auteur:        string;
    auteurUrl:     string;
    profielFoto:   string;
    rating:        number;
    tijdRelatief:  string;
    tijd:          number;
    tekst:         string;
    taal:          string;
  }>;
}

export interface TeamLidProps {
  naam:     string;
  rol:      string;
  foto?:    Afbeelding;
  quote?:   string;
}

export interface WerkwijzeStap {
  nummer:       number;
  titel:        string;
  beschrijving: string;
  icon?:        string;
}

export interface Statistiek {
  waarde:    string;
  label:     string;
  icon?:     string;
  logoSrc?:  string;  // optioneel: pad naar SVG/PNG logo dat i.p.v. de "waarde" tekst wordt getoond
  logoAlt?:  string;
}

export interface TijdlijnEvent {
  jaar:         number;
  titel:        string;
  beschrijving: string;
}

// ─── Schema helpers ───────────────────────────────────────────────────────────

export interface JobPostingData {
  titel:            string;
  beschrijving:     string;  // HTML
  datePosted:       string;  // ISO 8601
  validThrough:     string;  // ISO 8601
  employmentType:   string;
  stad:             string;
  postcode:         string;
  salarisMin?:      number;
  salarisMax?:      number;
  salarisEenheid?:  string;
}

export interface LocalBusinessData {
  naam:       string;
  adres:      { straat: string; stad: string; postcode: string; land: string };
  telefoon:   string;
  email:      string;
  website:    string;
  sameAs:     string[];
  areaServed: string[];
  openingstijden?: Record<string, { open: string; sluit: string }>;
  geo:        { lat: number; lng: number };
  oprichtingsjaar: number;
}
