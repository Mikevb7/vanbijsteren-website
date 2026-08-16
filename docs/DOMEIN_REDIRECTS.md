# Domein-redirects

Van Bijsteren Stukadoors heeft meerdere marketingdomeinen die allemaal 301
permanent doorverwijzen naar het hoofddomein `vanbijsterenstukadoors.nl`.
Elk domein wijst naar een specifieke landingspagina.

## Mapping

| Bron-domein               | Doel-pad                                |
| ------------------------- | --------------------------------------- |
| `stukadoorharderwijk.nl`  | `/stukadoor-harderwijk`                 |
| `stucadoorharderwijk.nl`  | `/stukadoor-harderwijk`                 |
| `stukadoorermelo.nl`      | `/stukadoor-ermelo`                     |
| `stukadoornunspeet.nl`    | `/stukadoor-nunspeet`                   |
| `stukadoorzeewolde.nl`    | `/stukadoor-zeewolde`                   |
| `stukadoorhierden.nl`     | `/werkgebied`                           |
| `gladstucen.nl`           | `/binnen-stucwerk/gladpleisterwerk`     |
| `gladstuken.nl`           | `/binnen-stucwerk/gladpleisterwerk`     |

Alle redirects zijn **301 permanent** en dekken zowel het apex-domein
(`stukadoorharderwijk.nl`) als de `www.`-variant
(`www.stukadoorharderwijk.nl`).

Het pad van de bezoeker wordt genegeerd: `stukadoorharderwijk.nl/foo/bar`
gaat altijd naar `vanbijsterenstukadoors.nl/stukadoor-harderwijk`.

## Hoe werkt dit technisch

De redirects zijn geconfigureerd in `vercel.json` via de `redirects`-array met
een `has: [{ type: "host", value: "..." }]`-conditie. Vercel matcht daarmee
op het `Host`-header en stuurt door naar de juiste pagina op het
hoofddomein.

Voor de host-waarde wordt een regex `(www\.)?domein\.nl` gebruikt zodat
zowel apex als www worden gedekt in één regel.

## Instellingen in Vercel (bij Strato-registratie van de domeinen)

Zodra een van deze domeinen bij Strato is geregistreerd:

### 1. Voeg het domein toe aan het Vercel-project

- Ga naar het project in Vercel → **Settings → Domains**
- Klik **Add Domain**
- Vul het apex-domein in, bijvoorbeeld `stukadoorharderwijk.nl`
- Voeg daarna ook `www.stukadoorharderwijk.nl` toe

### 2. DNS instellen bij Strato

Vercel toont per domein welke DNS-records nodig zijn. Standaard:

**Voor het apex-domein (`stukadoorharderwijk.nl`):**
```
A     @     76.76.21.21
```

**Voor de www-subdomein (`www.stukadoorharderwijk.nl`):**
```
CNAME www   cname.vercel-dns.com.
```

Log in bij Strato → Domeinbeheer → DNS-instellingen en pas dit aan.
De propagatie duurt normaal 10 minuten tot een paar uur.

### 3. SSL-certificaat

Vercel regelt automatisch een Let's Encrypt SSL-certificaat per domein
zodra de DNS klopt. Geen actie nodig.

### 4. Verifieer de redirect

Zodra Vercel het domein als "Valid Configuration" toont:

```bash
curl -sI https://stukadoorharderwijk.nl/willekeurig-pad
```

Verwachte respons:
```
HTTP/2 308
location: https://vanbijsterenstukadoors.nl/stukadoor-harderwijk
```

> **Let op:** Vercel stuurt standaard 308 (permanent redirect met behoud
> van methode). Voor zoekmachines heeft dat hetzelfde effect als een 301.
> Als je specifiek een 301 wilt, kan dat via de Vercel dashboard "Redirect
> to" instelling per domein, maar de `vercel.json`-aanpak is stabieler
> omdat het in de repo staat.

## Toevoegen van een nieuw domein

1. Voeg een regel toe aan de mapping-tabel hierboven.
2. Voeg een redirect-object toe aan `vercel.json`:
   ```json
   {
     "source": "/:path*",
     "has": [{ "type": "host", "value": "(www\\.)?nieuwdomein\\.nl" }],
     "destination": "https://vanbijsterenstukadoors.nl/doelpad",
     "permanent": true
   }
   ```
3. Commit en deploy.
4. Voeg het domein toe in Vercel Dashboard + DNS bij Strato zoals hierboven.
