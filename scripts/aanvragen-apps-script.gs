/**
 * Aanvragen Van Bijsteren - Google Apps Script (gekoppeld aan de Google Sheet).
 *
 * Wat het doet bij elke aanvraag vanaf vanbijsterenstukadoors.nl:
 *   1. slaat de aanvraag op in tabblad "Aanvragen" (status standaard "nieuw")
 *   2. stuurt de klant een bevestigingsmail met samenvatting
 *   3. stuurt een melding met alle gegevens naar MELDING_AAN
 *
 * Bron van deze code: scripts/aanvragen-apps-script.gs in de repo.
 * Wijzig je hier iets? Plak het daarna in de Apps Script-editor en kies
 * Implementeren > Implementaties beheren > bewerken > Nieuwe versie.
 */

// ─── Instellingen ────────────────────────────────────────────────────────────
// Pas deze aan via Projectinstellingen > Scripteigenschappen (overschrijft dit).
const STANDAARD = {
  MELDING_AAN: 'info@bystars.nl',   // wie krijgt de melding van een nieuwe aanvraag (komma-gescheiden mag)
  ANTWOORD_AAN: 'info@bystars.nl',  // reply-to op de bevestiging aan de klant
  AFZENDER_NAAM: 'Van Bijsteren Stukadoorsbedrijf',
  TELEFOON: '06 33 85 44 25',
  TELEFOON_LINK: '+31633854425',
  WEBSITE: 'https://www.vanbijsterenstukadoors.nl',
  KLANTMAIL_AAN: 'ja',              // 'nee' = geen bevestiging naar klanten (noodrem)
};
const TAB = 'Aanvragen';
const KOLOMMEN = ['Ontvangen', 'Type', 'Status', 'Naam', 'Telefoon', 'E-mail', 'Plaats', 'Dienst / functie',
  'Wanden m²', 'Plafonds m²', 'Indicatie excl. btw', 'Omschrijving / bericht', 'Bron', 'Pagina', 'Test', 'Notities', 'ID'];
const STATUSSEN = ['nieuw', 'gebeld', 'offerte', 'opdracht', 'afgewezen'];
const MERK = '#028188';

function instelling(sleutel) {
  const v = PropertiesService.getScriptProperties().getProperty(sleutel);
  return (v === null || v === '') ? STANDAARD[sleutel] : v;
}

// ─── Ontvangen ───────────────────────────────────────────────────────────────
function doPost(e) {
  const p = (e && e.parameter) || {};
  // Honeypot: bots vullen dit verborgen veld in. Doe alsof het gelukt is.
  if (p._gotcha) return json({ ok: true });

  const type = ['offerte', 'sollicitatie', 'contact'].includes(p.type) ? p.type : 'contact';
  const naam = schoon(p.naam, 120);
  const email = schoon(p.email, 160);
  if (!naam || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ ok: false, fout: 'ongeldig' });
  }

  const a = {
    id: Utilities.getUuid().slice(0, 8),
    ontvangen: new Date(),
    type: type,
    naam: naam,
    telefoon: schoon(p.telefoon, 40),
    email: email,
    plaats: schoon(p.plaats, 80),
    dienst: schoon(type === 'sollicitatie' ? p.functie : p.dienst, 120),
    wanden: getal(p.wanden),
    plafonds: getal(p.plafonds),
    indicatie: getal(p.indicatie),
    tekst: schoon(p.omschrijving || p.motivatie || p.bericht, 5000),
    bron: schoon(p.bron, 120),
    pagina: schoon(p.pagina, 200),
  };
  a.test = /^test\b/i.test(a.naam) || /@example\.(com|nl)$/i.test(a.email);

  // 1. Opslaan (eerst, zodat er nooit iets verloren gaat als mailen faalt)
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    blad().appendRow([a.ontvangen, a.type, 'nieuw', a.naam, a.telefoon, a.email, a.plaats, a.dienst,
      a.wanden || '', a.plafonds || '', a.indicatie || '', a.tekst, a.bron, a.pagina, a.test, '', a.id]);
  } finally {
    lock.releaseLock();
  }

  // 2 + 3. Mails (fouten hier blokkeren de aanvraag niet; ze staan al in de sheet)
  try { stuurMelding(a); } catch (err) { console.error('melding', err); }
  try {
    if (instelling('KLANTMAIL_AAN') !== 'nee') stuurBevestiging(a);
  } catch (err) { console.error('bevestiging', err); }

  return json({ ok: true, id: a.id });
}

function doGet() {
  return json({ ok: true, dienst: 'aanvragen-van-bijsteren' });
}

// ─── Mails ───────────────────────────────────────────────────────────────────
function stuurBevestiging(a) {
  const voornaam = a.naam.split(' ')[0];
  const isSol = a.type === 'sollicitatie';
  const onderwerp = isSol
    ? 'Bedankt voor je sollicitatie bij Van Bijsteren'
    : a.type === 'offerte' ? 'We hebben uw offerteaanvraag ontvangen' : 'We hebben uw bericht ontvangen';

  const intro = isSol
    ? `<p>Hoi ${esc(voornaam)},</p>
       <p>Bedankt voor je sollicitatie! We hebben hem goed ontvangen. Binnen een paar werkdagen nemen we contact met je op om kennis te maken.</p>
       <p>Heb je een cv? Stuur die gerust als antwoord op deze mail.</p>`
    : `<p>Beste ${esc(voornaam)},</p>
       <p>Bedankt voor uw ${a.type === 'offerte' ? 'offerteaanvraag' : 'bericht'}. We hebben alles goed ontvangen.
       <strong>Binnen één werkdag nemen wij contact met u op</strong>${a.type === 'offerte' ? ' om een moment af te spreken waarop we vrijblijvend bij u komen kijken' : ''}.</p>`;

  const html = kader(`
    ${intro}
    <p style="margin:24px 0 8px;font-weight:600;color:#1a1a1a">${isSol ? 'Wat je ons stuurde' : 'Wat u ons stuurde'}</p>
    ${samenvatting(a, false)}
    ${a.indicatie ? `<p style="font-size:13px;color:#555">De prijsindicatie is exclusief btw en geen offerte. De exacte prijs hoort u na de opname bij u thuis.</p>` : ''}
    <p>${isSol ? 'Vragen? Bel ons gerust' : 'Liever direct even bellen? Dat kan altijd'}: <a href="tel:${instelling('TELEFOON_LINK')}" style="color:${MERK};font-weight:600">${instelling('TELEFOON')}</a>.</p>
    <p>Met vriendelijke groet,<br><strong>Marcel van Bijsteren</strong><br>Van Bijsteren Stukadoorsbedrijf</p>
  `);
  const tekst = `${isSol ? 'Hoi' : 'Beste'} ${voornaam},\n\n${isSol ? 'Bedankt voor je sollicitatie. Binnen een paar werkdagen nemen we contact met je op.' : 'Bedankt voor uw aanvraag. Binnen één werkdag nemen wij contact met u op.'}\n\n${samenvattingTekst(a)}\n\nBellen kan altijd: ${instelling('TELEFOON')}.\n\nMet vriendelijke groet,\nMarcel van Bijsteren\nVan Bijsteren Stukadoorsbedrijf`;

  MailApp.sendEmail({
    to: a.email,
    subject: onderwerp,
    htmlBody: html,
    body: tekst,
    name: instelling('AFZENDER_NAAM'),
    replyTo: instelling('ANTWOORD_AAN'),
  });
}

function stuurMelding(a) {
  const soort = { offerte: 'Offerteaanvraag', sollicitatie: 'Sollicitatie', contact: 'Contactbericht' }[a.type];
  const onderwerp = `${a.test ? '[TEST] ' : ''}${soort}: ${a.naam}${a.plaats ? ' (' + a.plaats + ')' : ''}${a.wanden || a.plafonds ? ' - ' + ((a.wanden || 0) + (a.plafonds || 0)) + ' m²' : ''}`;
  const sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  const html = kader(`
    <p style="font-size:18px;font-weight:700;margin:0 0 4px">${soort}</p>
    <p style="margin:0 0 20px;color:#555">${Utilities.formatDate(a.ontvangen, 'Europe/Amsterdam', "d MMMM yyyy 'om' HH:mm")}</p>
    <p>
      ${a.telefoon ? `<a href="tel:${esc(a.telefoon.replace(/[^\d+]/g, ''))}" style="display:inline-block;background:${MERK};color:#fff;text-decoration:none;padding:10px 18px;border-radius:6px;font-weight:600;margin:0 8px 8px 0">Bel ${esc(a.telefoon)}</a>` : ''}
      <a href="mailto:${esc(a.email)}" style="display:inline-block;border:1px solid ${MERK};color:${MERK};text-decoration:none;padding:9px 18px;border-radius:6px;font-weight:600;margin:0 0 8px">Mail terug</a>
    </p>
    ${samenvatting(a, true)}
    <p style="margin-top:24px"><a href="${sheetUrl}" style="color:${MERK};font-weight:600">Open het aanvragenoverzicht</a> en zet de status op "gebeld" zodra je contact hebt gehad.</p>
  `);
  MailApp.sendEmail({
    to: instelling('MELDING_AAN'),
    subject: onderwerp,
    htmlBody: html,
    body: `${soort}\n\n${samenvattingTekst(a)}\nTelefoon: ${a.telefoon}\nE-mail: ${a.email}\nBron: ${a.bron}\nPagina: ${a.pagina}\n\nOverzicht: ${sheetUrl}`,
    name: 'Website Van Bijsteren',
    replyTo: a.email,
  });
}

function rijen(a, intern) {
  const r = [];
  r.push(['Naam', a.naam]);
  if (intern) { r.push(['Telefoon', a.telefoon]); r.push(['E-mail', a.email]); }
  else if (a.telefoon) r.push(['Telefoon', a.telefoon]);
  if (a.plaats) r.push(['Plaats', a.plaats]);
  if (a.dienst) r.push([a.type === 'sollicitatie' ? 'Functie' : 'Dienst', a.dienst]);
  if (a.wanden) r.push(['Wanden', a.wanden + ' m²']);
  if (a.plafonds) r.push(['Plafonds', a.plafonds + ' m²']);
  if (a.indicatie) r.push(['Prijsindicatie', '€ ' + Math.round(a.indicatie).toLocaleString('nl-NL') + ' excl. btw']);
  if (a.tekst) r.push([a.type === 'sollicitatie' ? 'Motivatie' : a.type === 'offerte' ? 'Omschrijving' : 'Bericht', a.tekst]);
  if (intern && a.bron) r.push(['Bron', a.bron]);
  if (intern && a.pagina) r.push(['Verstuurd vanaf', a.pagina]);
  return r;
}
function samenvatting(a, intern) {
  return '<table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px">' +
    rijen(a, intern).map(([k, v]) =>
      `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #eee;color:#555;vertical-align:top;width:130px">${esc(k)}</td>` +
      `<td style="padding:8px 0;border-bottom:1px solid #eee;color:#1a1a1a;white-space:pre-wrap">${esc(v)}</td></tr>`).join('') +
    '</table>';
}
function samenvattingTekst(a) {
  return rijen(a, false).map(([k, v]) => `${k}: ${v}`).join('\n');
}
function kader(inhoud) {
  return `<div style="background:#f5f5f3;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;line-height:1.55">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e6e6e6">
      <div style="background:${MERK};padding:18px 24px;color:#fff;font-size:18px;font-weight:700;letter-spacing:.2px">Van Bijsteren <span style="font-weight:400;opacity:.85">Stukadoorsbedrijf</span></div>
      <div style="padding:24px">${inhoud}</div>
      <div style="padding:14px 24px;background:#fafafa;border-top:1px solid #eee;font-size:12px;color:#777">
        Van Bijsteren Stukadoorsbedrijf · Buys Ballotstraat 17, Harderwijk · <a href="${instelling('WEBSITE')}" style="color:#777">vanbijsterenstukadoors.nl</a>
      </div>
    </div></div>`;
}

// ─── Hulpjes ─────────────────────────────────────────────────────────────────
function blad() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB) || inrichten();
}
function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function schoon(v, max) {
  let s = String(v == null ? '' : v).trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s; // voorkomt formule-injectie in de sheet
  return s;
}
function getal(v) {
  const n = Math.round(Number(String(v || '').replace(',', '.')));
  return isFinite(n) && n > 0 && n < 100000 ? n : 0;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ─── Eenmalig inrichten (vanuit de editor: kies "inrichten" en klik Uitvoeren) ─
function inrichten() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('Europe/Amsterdam');
  let sh = ss.getSheetByName(TAB);
  if (!sh) { sh = ss.getSheets()[0]; sh.setName(TAB); }
  sh.getRange(1, 1, 1, KOLOMMEN.length).setValues([KOLOMMEN])
    .setFontWeight('bold').setBackground(MERK).setFontColor('#ffffff');
  sh.setFrozenRows(1);
  sh.getRange('A:A').setNumberFormat('dd-mm-yyyy hh:mm');
  sh.getRange('K:K').setNumberFormat('€ #,##0');
  sh.setColumnWidths(1, KOLOMMEN.length, 120);
  sh.setColumnWidth(12, 320);
  sh.getRange('L:L').setWrap(true);
  // Status-keuzelijst
  const status = sh.getRange('C2:C');
  status.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(STATUSSEN, true).setAllowInvalid(false).build());
  // Kleuren per status
  const kleur = { nieuw: '#fde68a', gebeld: '#bfdbfe', offerte: '#ddd6fe', opdracht: '#bbf7d0', afgewezen: '#e5e7eb' };
  sh.setConditionalFormatRules(Object.entries(kleur).map(([s, k]) =>
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(s).setBackground(k).setRanges([status]).build()));
  sh.getRange('O:O').setHorizontalAlignment('center');

  // Teller
  let t = ss.getSheetByName('Teller');
  if (!t) t = ss.insertSheet('Teller');
  t.clear();
  t.getRange('A1').setValue('Aanvragen per maand en type (testaanvragen tellen niet mee)').setFontWeight('bold');
  t.getRange('A2').setFormula(
    "=IFERROR(QUERY(Aanvragen!A2:O, \"select year(A), month(A)+1, count(A) where A is not null and O = false group by year(A), month(A)+1 pivot B order by year(A) desc, month(A)+1 desc label year(A) 'Jaar', month(A)+1 'Maand'\", 0), \"Nog geen aanvragen\")");
  t.getRange('H1').setValue('Status van alle aanvragen').setFontWeight('bold');
  t.getRange('H2').setFormula(
    "=IFERROR(QUERY(Aanvragen!A2:O, \"select C, count(A) where A is not null and O = false group by C label C 'Status', count(A) 'Aantal'\", 0), \"Nog geen aanvragen\")");
  t.getRange('H10').setValue('Offertes per maand → opdracht').setFontWeight('bold');
  t.getRange('H11').setFormula(
    "=IFERROR(QUERY(Aanvragen!A2:O, \"select year(A), month(A)+1, count(A) where A is not null and O = false and B = 'offerte' group by year(A), month(A)+1 pivot C label year(A) 'Jaar', month(A)+1 'Maand'\", 0), \"Nog geen offertes\")");
  return sh;
}
