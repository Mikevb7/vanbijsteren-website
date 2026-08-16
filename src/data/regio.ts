// src/data/regio.ts

export interface Regio {
  naam:         string;
  slug:         string;
  href:         string;
  isHoofdlocatie: boolean;
  reistijdMinuten?: number;  // reistijd vanuit Harderwijk
  heeftPagina:  boolean;     // staat er een lokale pagina voor klaar?
}

export const regio: Regio[] = [
  { naam: "Harderwijk",  slug: "harderwijk", href: "/stukadoor-harderwijk", isHoofdlocatie: true,  reistijdMinuten: 0,  heeftPagina: true  },
  { naam: "Ermelo",      slug: "ermelo",     href: "/stukadoor-ermelo",     isHoofdlocatie: false, reistijdMinuten: 10, heeftPagina: true  },
  { naam: "Putten",      slug: "putten",     href: "/stukadoor-putten",     isHoofdlocatie: false, reistijdMinuten: 15, heeftPagina: true  },
  { naam: "Nunspeet",    slug: "nunspeet",   href: "/stukadoor-nunspeet",   isHoofdlocatie: false, reistijdMinuten: 15, heeftPagina: true  },
  { naam: "Zeewolde",    slug: "zeewolde",   href: "/stukadoor-zeewolde",   isHoofdlocatie: false, reistijdMinuten: 20, heeftPagina: true  },
  { naam: "Hierden",     slug: "hierden",    href: "/werkgebied",           isHoofdlocatie: false, reistijdMinuten: 5,  heeftPagina: false },
  { naam: "Elburg",      slug: "elburg",     href: "/werkgebied",           isHoofdlocatie: false, reistijdMinuten: 20, heeftPagina: false },
  { naam: "Oldebroek",   slug: "oldebroek",  href: "/werkgebied",           isHoofdlocatie: false, reistijdMinuten: 25, heeftPagina: false },
  { naam: "Nijkerk",     slug: "nijkerk",    href: "/werkgebied",           isHoofdlocatie: false, reistijdMinuten: 25, heeftPagina: false },
];

// Voor de RegioLinkBlok: toon alleen plaatsen met eigen pagina + de resterende als tekst
export const regioMetPagina = regio.filter(r => r.heeftPagina);
export const alleWerkplaatsen = regio.map(r => r.naam);
