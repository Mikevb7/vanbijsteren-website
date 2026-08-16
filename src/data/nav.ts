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
      {
        label: "Binnen stucwerk",
        href: "/binnen-stucwerk",
        children: [
          { label: "Gladpleisterwerk",      href: "/binnen-stucwerk/gladpleisterwerk" },
          { label: "Plafond stucen",        href: "/binnen-stucwerk/plafond-stucen" },
          { label: "Schuurwerk",            href: "/binnen-stucwerk/schuurwerk" },
          { label: "Spackspuitwerk",        href: "/binnen-stucwerk/spackspuitwerk" },
          { label: "Behang-/sausklaar",     href: "/binnen-stucwerk/behangklaar-sausklaar" },
        ],
      },
      {
        label: "Sierpleister",
        href: "/sierpleister",
        children: [
          { label: "Spachtelputz",          href: "/sierpleister/spachtelputz" },
          { label: "Granolputz",            href: "/sierpleister/granolputz" },
        ],
      },
      {
        label: "Buitengevelstucwerk",
        href: "/buitengevelstucwerk",
        children: [
          { label: "Spachtelputz buiten",   href: "/buitengevelstucwerk/spachtelputz-buiten" },
        ],
      },
      {
        label: "Decoratief stucwerk",
        href: "/decoratief-stucwerk",
        children: [
          { label: "Italiaans stucwerk & Frescolori", href: "/decoratief-stucwerk/italiaans-stucwerk-frescolori" },
        ],
      },
      { label: "Reparatie & renovatie",    href: "/stucwerk-reparatie-renovatie" },
    ],
  },
  {
    label: "Kennis",
    href: "/kennis/wat-kost-stucwerk",
    children: [
      { label: "Wat kost stucwerk?",                    href: "/kennis/wat-kost-stucwerk" },
      { label: "Sausklaar of behangklaar?",             href: "/kennis/sausklaar-of-behangklaar" },
      { label: "Spachtelputz binnen of buiten?",        href: "/kennis/spachtelputz-binnen-of-buiten" },
      { label: "Doorlooptijd stucwerk",                 href: "/kennis/doorlooptijd-stucwerk" },
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
    { label: "Binnen stucwerk",    href: "/binnen-stucwerk" },
    { label: "Sierpleister",       href: "/sierpleister" },
    { label: "Buitengevelstucwerk",href: "/buitengevelstucwerk" },
    { label: "Decoratief stucwerk",href: "/decoratief-stucwerk" },
    { label: "Reparatie & renovatie", href: "/stucwerk-reparatie-renovatie" },
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
