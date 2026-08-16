// src/data/bedrijf.ts
// Single source of truth voor alle NAP-gegevens en bedrijfsinformatie.
// TE_VERIFIËREN velden zijn gemarkeerd. Vul nooit een gok in als fact.

export const bedrijf = {
  // Juridisch
  naam:           "Van Bijsteren Stukadoorsbedrijf B.V.",
  naamKort:       "Van Bijsteren Stukadoors",
  kvk:            "54799953",                         // TE_VERIFIËREN (TV-08)
  btw:            "",                                  // TE_VERIFIËREN (TV-18)

  // Contact
  telefoon:       "+31341418298",                     // bevestigd — internationaal
  telefoonDisplay:"0341 418298",                      // bevestigd — leesbaar
  email:          "info@vanbijsterenstukadoors.nl",    // bevestigd (TV-04 opgelost)
  mobielMarcel:   "+31633854425",                     // bevestigd — Marcel, internationaal
  mobielMarcelDisplay: "06 338 544 25",               // bevestigd — Marcel, leesbaar

  // Adres — bevestigd door eigenaar 2026-07-12 (gecrosscheckt met Google Business Profile)
  adres: {
    straat:       "Buys Ballotstraat 17",
    stad:         "Harderwijk",
    postcode:     "3846 BG",
    land:         "NL",
    landNaam:     "Nederland",
  },

  // Geo (voor schema + kaart)
  geo: {
    lat:          0,                                   // TE_VERIFIËREN (TV-17)
    lng:          0,                                   // TE_VERIFIËREN (TV-17)
  },

  // Bedrijfsinfo — bevestigd door eigenaar
  oprichtingsjaar: 1967,                              // bevestigd (Herman van Bijsteren)
  generaties:      3,                                 // bevestigd (Herman → Gert → Marcel)
  noa:             true,                              // bevestigd

  // Showroom
  showroom: {
    naam:         "Showroom Van Bijsteren",
    omschrijving: "Industrieterrein Lorentz, Harderwijk",
  },

  // Google Places — gecachet Place ID (build-time reviews fetch via scripts/fetch-google-reviews.mjs).
  // Bevestigd via Find Place API 2026-07-12 op naam + adres.
  googlePlaceId:  "ChIJAbi3n-IzxkcRJjoM6RJM840",

  // URLs / sameAs (voor entity stack)
  website:        "https://www.vanbijsterenstukadoors.nl",
  sameAs: [
    "",  // Google Business Profile URL — TE_VERIFIËREN (TV-10)
    "",  // Facebook pagina URL — TE_VERIFIËREN (TV-09)
    "",  // NOA profiel URL — TE_VERIFIËREN (TV-11)
  ].filter(Boolean),

  // Social
  social: {
    facebook:     "",  // TE_VERIFIËREN (TV-09)
  },

  // Openingstijden
  openingstijden: {
    maVr: {
      open:   "",  // TE_VERIFIËREN (TV-07) — bv. "07:00"
      sluit:  "",  // TE_VERIFIËREN (TV-07) — bv. "17:00"
    },
  },

  // Design — bevestigd door eigenaar
  merkkleur:    "#55A8AA",  // bevestigd — teal
  merkkleurPMS: "",         // TE_VERIFIËREN (TV-01) — Pantone voor drukwerk

  // Werkgebied
  werkgebiedRadius: 50,  // km
} as const;

export type Bedrijf = typeof bedrijf;
