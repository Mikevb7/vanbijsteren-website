#!/usr/bin/env node
/**
 * scripts/fetch-google-reviews.mjs
 *
 * Build-time Google Places API integration voor klantreviews.
 *
 * Wat dit script doet:
 *   1. Zoekt (of hergebruikt gecachete) Google Place ID via Places API "Find Place from Text"
 *      op basis van bedrijfsnaam + adres uit src/data/bedrijf.ts.
 *   2. Fetcht Place Details met velden: name, rating, user_ratings_total, reviews, url.
 *   3. Schrijft resultaat naar src/data/google-reviews.json.
 *
 * Waarom build-time:
 *   - Geen extra network roundtrip per pagerequest.
 *   - Geen widget van derden nodig, geen tracking-pixels.
 *   - Google's Places T&C staat caching van reviews toe tot 30 dagen — bij elke deploy
 *     halen we ze opnieuw op, dus altijd binnen die window.
 *
 * Vereisten (env):
 *   GOOGLE_MAPS_API_KEY — API key met "Places API" (en optioneel "Places API (New)")
 *                        ingeschakeld in Google Cloud Console.
 *
 * Gedrag zonder key:
 *   - Behoudt bestaande cache (als er al reviews binnen zijn)
 *   - Anders schrijft lege payload; site fallt terug op alleen lokale reviews
 *
 * Foutmodus:
 *   - Bij API-fouten wordt de bestaande cache behouden (fail-safe) en een waarschuwing
 *     gelogged. Build faalt nooit door dit script.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');
const CACHE     = resolve(ROOT, 'src/data/google-reviews.json');
const BEDRIJF   = resolve(ROOT, 'src/data/bedrijf.ts');

const API_KEY   = process.env.GOOGLE_MAPS_API_KEY;

const emptyPayload = () => ({
  placeId: null,
  fetchedAt: null,
  name: null,
  rating: null,
  userRatingsTotal: null,
  url: null,
  reviews: [],
});

function log(msg) { console.log(`[google-reviews] ${msg}`); }
function warn(msg) { console.warn(`[google-reviews] ⚠ ${msg}`); }

function readCache() {
  if (!existsSync(CACHE)) return emptyPayload();
  try {
    return JSON.parse(readFileSync(CACHE, 'utf8'));
  } catch {
    return emptyPayload();
  }
}

function writeCache(data) {
  const dir = dirname(CACHE);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(CACHE, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

/**
 * Extract de gecachete Place ID uit bedrijf.ts (googlePlaceId veld) als bron van waarheid.
 * Als niet ingesteld, val terug op de cache-JSON.
 */
function readCachedPlaceId(fallback) {
  try {
    const src = readFileSync(BEDRIJF, 'utf8');
    const m   = src.match(/googlePlaceId:\s*['"]([^'"]+)['"]/);
    if (m) return m[1];
  } catch { /* ignore */ }
  return fallback;
}

async function findPlaceId(query) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json');
  url.searchParams.set('input', query);
  url.searchParams.set('inputtype', 'textquery');
  url.searchParams.set('fields', 'place_id,name,formatted_address');
  url.searchParams.set('key', API_KEY);
  const res = await fetch(url);
  const json = await res.json();
  if (json.status !== 'OK' || !json.candidates?.length) {
    throw new Error(`Find Place API status=${json.status} error=${json.error_message ?? '(none)'}`);
  }
  const first = json.candidates[0];
  log(`Vond Place: "${first.name}" — ${first.formatted_address}`);
  return first.place_id;
}

async function fetchPlaceDetails(placeId) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'name,rating,user_ratings_total,reviews,url');
  url.searchParams.set('language', 'nl');
  // reviews_sort=most_relevant is default. Wij willen de meest overtuigende reviews.
  url.searchParams.set('reviews_sort', 'most_relevant');
  url.searchParams.set('key', API_KEY);
  const res = await fetch(url);
  const json = await res.json();
  if (json.status !== 'OK') {
    throw new Error(`Place Details API status=${json.status} error=${json.error_message ?? '(none)'}`);
  }
  return json.result;
}

/** Google's review-object → onze normalized shape. Volgt Google's attributieregels. */
function normalizeReview(r) {
  return {
    auteur:      r.author_name,
    auteurUrl:   r.author_url,
    profielFoto: r.profile_photo_url,
    rating:      r.rating,
    tijdRelatief: r.relative_time_description,  // "3 maanden geleden" — Google wilt dit tonen
    tijd:         r.time,                        // Unix seconds
    tekst:        (r.text ?? '').trim(),
    taal:         r.language,
  };
}

async function main() {
  const cache = readCache();

  if (!API_KEY) {
    warn('GOOGLE_MAPS_API_KEY niet gezet — bestaande cache behouden (of leeg).');
    if (!existsSync(CACHE)) writeCache(cache);
    log(`Cache: ${cache.reviews.length} reviews, placeId=${cache.placeId ?? 'null'}`);
    return;
  }

  // Bepaal Place ID: 1) uit bedrijf.ts, 2) uit cache, 3) via API-lookup
  let placeId = readCachedPlaceId(cache.placeId);

  if (!placeId) {
    log('Geen Place ID gecacheted — zoek via Places API "Find Place from Text"...');
    // Query bouwt naam + straat + stad — hoge specificity om juiste match te krijgen
    // eslint-disable-next-line no-unused-vars
    const bedrijf = readFileSync(BEDRIJF, 'utf8');
    const naamMatch    = bedrijf.match(/naam:\s*['"]([^'"]+)['"]/);
    const straatMatch  = bedrijf.match(/straat:\s*['"]([^'"]+)['"]/);
    const stadMatch    = bedrijf.match(/stad:\s*['"]([^'"]+)['"]/);
    const naam   = naamMatch?.[1]  ?? 'Van Bijsteren Stukadoorsbedrijf B.V.';
    const straat = straatMatch?.[1] ?? 'Buys Ballotstraat 17';
    const stad   = stadMatch?.[1]  ?? 'Harderwijk';
    const query = `${naam} ${straat} ${stad}`;
    log(`Zoekterm: "${query}"`);
    try {
      placeId = await findPlaceId(query);
      log(`✓ Place ID gevonden: ${placeId}`);
      log(`  → Zet dit in src/data/bedrijf.ts als: googlePlaceId: '${placeId}',`);
    } catch (err) {
      warn(`Place ID lookup mislukt: ${err.message}`);
      if (!existsSync(CACHE)) writeCache(cache);
      return;
    }
  } else {
    log(`Hergebruik gecachete Place ID: ${placeId}`);
  }

  // Fetch details
  try {
    const details = await fetchPlaceDetails(placeId);
    const reviews = (details.reviews ?? []).map(normalizeReview);
    const payload = {
      placeId,
      fetchedAt: new Date().toISOString(),
      name:      details.name ?? null,
      rating:    details.rating ?? null,
      userRatingsTotal: details.user_ratings_total ?? null,
      url:       details.url ?? null,   // "attribution URL" — Google eist link terug naar hun listing
      reviews,
    };
    writeCache(payload);
    log(`✓ ${reviews.length} reviews opgehaald · gemiddelde ${payload.rating ?? '?'} · totaal ${payload.userRatingsTotal ?? '?'} recensies`);
  } catch (err) {
    warn(`Place Details fetch mislukt: ${err.message} — bestaande cache behouden.`);
    if (!existsSync(CACHE)) writeCache(cache);
  }
}

main().catch((err) => {
  warn(`Onverwachte fout: ${err.message}`);
  // Fail-safe: nooit build breken
  process.exit(0);
});
