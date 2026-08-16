# Google Places API — setup & security

Deze integratie haalt Google-reviews op tijdens `npm run build` (server-side).
Zie ook: `scripts/fetch-google-reviews.mjs`.

## De 4 dingen die je in Google Cloud Console instelt

Doe deze in volgorde. Elke stap is losstaand — je kan tussendoor pauzeren.

### Stap 1 — Quota-limiet (bescherming tegen kosten-uitloop)

Dit is de belangrijkste. Zelfs als de key uitlekt kan iemand nooit meer verbruiken dan
je limiet.

1. Ga naar <https://console.cloud.google.com/apis/api/places-backend.googleapis.com/quotas>
2. Zoek de rij **"Requests per day"** onder Places API
3. Klik op het potlood-icoontje ✏️ rechts van de huidige quota (default is 100.000 per dag)
4. Vul in: `50` requests per day
5. Klik **Save**

Berekening: onze build doet 1 `Find Place` + 1 `Place Details` = 2 calls per build.
Bij 10 deploys per dag = 20 calls. Quota 50 geeft ruime marge voor development,
onmogelijk om ongemerkt te ontsporen.

Optioneel voor extra veiligheid: zet ook **"Requests per minute per user"** op `10`.

### Stap 2 — API key restrictions (voorkom misbruik)

1. Ga naar <https://console.cloud.google.com/apis/credentials>
2. Klik op je API key (waarschijnlijk "API key 1" of vergelijkbaar)
3. Onder **"Application restrictions"** → kies **"None"**
   - Waarom niet HTTP-referrer: onze `fetch-google-reviews.mjs` draait server-side.
     Server-side calls hebben géén browser-referrer. Referrer restrictions blokkeren
     zulke calls (dat is precies de fout die we net zagen).
   - Waarom niet IP addresses: Vercel/GitHub Actions gebruiken dynamische AWS-IP's
     die dagelijks wisselen. IP-restrictie zou de build breken.
   - Waarom "None" toch veilig is: gecombineerd met de strikte quota (stap 1) en
     API restriction (hieronder) is de blast radius bij een leak: max 50 calls/dag ≈ €0,00 dankzij Google's $200 gratis maandtegoed.
4. Onder **"API restrictions"** → kies **"Restrict key"**
5. In de dropdown: vink **alleen** aan → **"Places API"** — LET OP: niet "Places API (New)"
   - Waarom niet "New": andere pricing, andere endpoints. Ons script gebruikt de klassieke
     `findplacefromtext` en `place/details` endpoints — die zitten in "Places API".
6. Klik **Save**

### Stap 3 — Billing alert (e-mail bij €5)

Google's gratis $200/maand tegoed dekt ~11.000 calls (Find Place + Details). Onze setup
komt niet in de buurt, maar een alert geeft zekerheid.

1. Ga naar <https://console.cloud.google.com/billing>
2. Selecteer je billing account
3. Menu links → **"Budgets & alerts"**
4. Klik **"Create budget"**
5. **Name:** `Van Bijsteren website — Google APIs`
6. **Scope:** vink je project aan (die de key hoort)
7. **Amount:** kies **"Specified amount"** → `€5,00`
   - Time range: Monthly (herhaalt elke maand)
8. **Actions:** vink aan:
   - ☑ 50% van budget → e-mail alert bij €2,50
   - ☑ 90% van budget → e-mail alert bij €4,50
   - ☑ 100% van budget → e-mail alert bij €5,00
9. **Email notifications** → vink aan "Send alerts to billing admins" (jouw email dus)
10. Klik **Finish**

Optioneel: onder **"Manage notifications"** kan je ook Pub/Sub-integratie doen om
je project-billing volledig te disablen bij overschrijding. Overkill voor onze use case.

### Stap 4 — Test dat het werkt

Zodra stap 1 + 2 zijn afgerond:

```bash
cd ~/bystars-dashboard/vanbijsteren-website
node --env-file=.env scripts/fetch-google-reviews.mjs
```

Verwacht output:
```
[google-reviews] Geen Place ID gecacheted — zoek via Places API "Find Place from Text"...
[google-reviews] Zoekterm: "Van Bijsteren Stukadoorsbedrijf B.V. Buys Ballotstraat 17-19 Harderwijk"
[google-reviews] Vond Place: "Van Bijsteren ..." — Buys Ballotstraat 17-19, 3841 GJ Harderwijk
[google-reviews] ✓ Place ID gevonden: ChIJ...
[google-reviews]   → Zet dit in src/data/bedrijf.ts als: googlePlaceId: 'ChIJ...',
[google-reviews] ✓ N reviews opgehaald · gemiddelde 4.8 · totaal 32 recensies
```

## Deploy naar Vercel

De `.env` file wordt niet naar git gepusht. Voor Vercel-builds:

1. Vercel dashboard → jouw project → **Settings** → **Environment Variables**
2. **Key:** `GOOGLE_MAPS_API_KEY`
3. **Value:** je API-key
4. **Environment:** vink **alle drie** aan (Production, Preview, Development)
   - Het is een build-time-only key; wordt nooit in de client-bundle geplakt.
5. **Save**
6. Trigger een nieuwe deploy — de `prebuild` hook draait automatisch.

## FAQ

**Q: Wat als iemand de key toch te pakken krijgt?**
A: Met stap 1 (quota 50/dag) en stap 2 (Places API only) is de maximale schade
per dag ~50 calls × €0,017 = **€0,85**. Bij 30 dagen zonder ingrijpen: €25,50.
Ruim binnen het gratis tegoed ($200/mnd), maar de billing alert schreeuwt eerder.

**Q: Kan de key in browser-devtools worden ingezien?**
A: Nee. De key wordt alleen server-side gebruikt tijdens `npm run build`. In het
uitgeleverde bundelde HTML/JS staat hij nergens.

**Q: Hoe vaak wordt Google gecalled?**
A: Bij elke deploy 1x Find Place + 1x Place Details = 2 calls. Bij 5 deploys/week
= 40 calls/maand. Kosten: **€0,68/maand**, gedekt door gratis tegoed.

**Q: Google zegt dat ik reviews max 30 dagen mag cachen — voldoen we?**
A: Ja. `google-reviews.json` wordt bij elke deploy overschreven. Als je 30+ dagen
niet deployt kan je die JSON handmatig legen, maar in praktijk deploy je vaker.
