// src/content.config.ts — Astro 7 Content Layer API (glob loaders).
// Schema's volgen DATA_MODELS.md §6. De docs gebruiken de legacy `type: 'content'`
// API (Astro 5); die is in Astro 7 verwijderd, daarom hier de Content Layer-variant.
import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

// ─── Vacatures ────────────────────────────────────────────────────────────────
const vacatures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/vacatures' }),
  schema: z.object({
    titel:              z.string(),          // bv. "Allround Stukadoor"
    slug:               z.string(),          // bv. "stukadoor" → URL: /werken-bij/vacature/stukadoor
    samenvatting:       z.string().max(160),
    isActief:           z.boolean().default(true),
    // JobPosting velden
    datePosted:         z.coerce.date(),
    validThrough:       z.coerce.date(),
    employmentType:     z.enum(["FULL_TIME","PART_TIME","CONTRACTOR","TEMPORARY","INTERN","VOLUNTEER","PER_DIEM","OTHER"]).default("FULL_TIME"),
    // Locatie
    stad:               z.string().default("Harderwijk"),
    postcode:           z.string().default(""),  // TE_VERIFIËREN (TV-03)
    // Salaris (optioneel — toon alleen als bevestigd)
    salarisMin:         z.number().optional(),   // TE_VERIFIËREN (TV-13)
    salarisMax:         z.number().optional(),   // TE_VERIFIËREN (TV-13)
    salarisEenheid:     z.enum(["HOUR","DAY","WEEK","MONTH","YEAR"]).default("MONTH"),
    // Inhoud
    vereisten:          z.array(z.string()),     // bullet-lijst vereisten
    aanbod:             z.array(z.string()),     // bullet-lijst wat wij bieden
    highlights:         z.array(z.string()).max(3), // 3 korte punten voor de VacatureCard
  }),
});

// ─── FAQ items ────────────────────────────────────────────────────────────────
const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    vraag:      z.string(),
    categorie:  z.enum(["klant","kandidaat","werkgebied","diensten","algemeen"]),
    volgorde:   z.number().default(99),
  }),
});

// ─── Reviews ──────────────────────────────────────────────────────────────────
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
  schema: z.object({
    auteur:       z.string(),              // "Peter V." — geen achternamen voor privacy
    plaats:       z.string().optional(),
    rating:       z.number().min(1).max(5),
    bron:         z.enum(["google","eigen","mondeling"]),
    datum:        z.coerce.date(),
    uitgelicht:   z.boolean().default(false),
    geverifieerd: z.boolean().default(false),
  }),
});

// ─── Team ─────────────────────────────────────────────────────────────────────
const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: ({ image }) => z.object({
    naam:     z.string(),
    rol:      z.string(),
    foto:     image().optional(),
    fotoAlt:  z.string().optional(),
    quote:    z.string().optional(),   // kort citaat voor de TeamSection
    volgorde: z.number().default(99),
  }),
});

// ─── Kennis artikelen ────────────────────────────────────────────────────────
const kennis = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/kennis' }),
  schema: z.object({
    titel:          z.string(),
    samenvatting:   z.string().max(160),
    gepubliceerd:   z.coerce.date(),
    bijgewerkt:     z.coerce.date().optional(),
    categorie:      z.enum(["kosten","keuze","proces","onderhoud","materiaal"]),
    gerelateerd:    z.array(z.string()).default([]),  // slugs van gerelateerde diensten
  }),
});

export const collections = {
  vacatures,
  faq,
  reviews,
  team,
  kennis,
};
