// src/data/nav.ts

export interface NavItem {
  label: string;
  href: string;
  highlight?: boolean;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  {
    label: "Diensten",
    href: "/stucwerk",
    children: [
      { label: "Glad stucwerk (sausklaar)", href: "/binnen-stucwerk/gladpleisterwerk" },
      { label: "Behangklaar stucwerk",      href: "/binnen-stucwerk/behangklaar-sausklaar" },
      { label: "Plafonds",                  href: "/binnen-stucwerk/plafond-stucen" },
      { label: "Spackspuitwerk",            href: "/binnen-stucwerk/spackspuitwerk" },
      { label: "Alle diensten",             href: "/stucwerk" },
    ],
  },
  {
    label: "Kennis",
    href: "/kennis/wat-kost-stucwerk",
    children: [
      { label: "Wat kost stucwerk?",        href: "/kennis/wat-kost-stucwerk" },
      { label: "Sausklaar of behangklaar?", href: "/kennis/sausklaar-of-behangklaar" },
    ],
  },
  {
    label: "Over ons",
    href: "/over-ons",
    children: [
      { label: "Over Van Bijsteren",        href: "/over-ons" },
      { label: "Onze werkwijze",            href: "/onze-werkwijze" },
      { label: "Garanties & zekerheid",     href: "/garanties-en-zekerheid" },
      { label: "Keurmerken",                href: "/certificeringen-en-keurmerken" },
      { label: "Werkgebied",                href: "/werkgebied" },
    ],
  },
  {
    label: "Werken bij",
    href: "/werken-bij",
    highlight: true,
    children: [
      { label: "Werken bij Van Bijsteren",  href: "/werken-bij" },
      { label: "Het team",                  href: "/werken-bij/team" },
      { label: "Zo werken wij",             href: "/werken-bij/zo-werken-wij" },
      { label: "Groeien & leren",           href: "/werken-bij/groeien-en-leren" },
      { label: "Vacature: Stukadoor",       href: "/werken-bij/vacature/stukadoor" },
      { label: "Vacature: Aankomend stukadoor", href: "/werken-bij/vacature/aankomend-stukadoor" },
      { label: "Open sollicitatie",         href: "/werken-bij/open-sollicitatie" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  diensten: [
    { label: "Glad stucwerk",        href: "/binnen-stucwerk/gladpleisterwerk" },
    { label: "Behangklaar stucwerk", href: "/binnen-stucwerk/behangklaar-sausklaar" },
    { label: "Plafonds",             href: "/binnen-stucwerk/plafond-stucen" },
    { label: "Spackspuitwerk",       href: "/binnen-stucwerk/spackspuitwerk" },
    { label: "Prijsindicatie",       href: "/kennis/wat-kost-stucwerk" },
  ],
  werkgebied: [
    { label: "Stukadoor Harderwijk", href: "/stukadoor-harderwijk" },
    { label: "Stukadoor Ermelo",     href: "/stukadoor-ermelo" },
    { label: "Stukadoor Putten",     href: "/stukadoor-putten" },
    { label: "Stukadoor Nunspeet",   href: "/stukadoor-nunspeet" },
    { label: "Stukadoor Zeewolde",   href: "/stukadoor-zeewolde" },
    { label: "Werkgebied overzicht", href: "/werkgebied" },
  ],
  bedrijf: [
    { label: "Over ons",             href: "/over-ons" },
    { label: "Onze werkwijze",       href: "/onze-werkwijze" },
    { label: "Garanties",            href: "/garanties-en-zekerheid" },
    { label: "Keurmerken",           href: "/certificeringen-en-keurmerken" },
    { label: "Reviews",              href: "/reviews" },
    { label: "Veelgestelde vragen",  href: "/veelgestelde-vragen" },
  ],
  werkenBij: [
    { label: "Werken bij ons",       href: "/werken-bij" },
    { label: "Vacature stukadoor",   href: "/werken-bij/vacature/stukadoor" },
    { label: "Vacature aankomend",   href: "/werken-bij/vacature/aankomend-stukadoor" },
    { label: "Open sollicitatie",    href: "/werken-bij/open-sollicitatie" },
  ],
  juridisch: [
    { label: "Privacy",              href: "/privacy" },
    { label: "Cookies",              href: "/cookies" },
    { label: "Algemene voorwaarden", href: "/algemene-voorwaarden" },
  ],
};
