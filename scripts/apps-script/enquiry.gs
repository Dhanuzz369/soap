/**
 * GoodBiz Hygiene: enquiry form → Google Sheet (spec 2026-10-27 §6).
 *
 * Paste this whole file into the sheet's Extensions → Apps Script editor and deploy it as a web app
 * (docs/enquiry-sheet-setup.md). The site posts each step of the enquiry form here:
 *   JSON (text/plain body): { leadId, stage, lang, page, ts, fields: { name, email, … } }
 *   or, without JavaScript, an ordinary form post with the same field names.
 * One row per leadId: the first post appends it, later posts fill it in. A filled cell is never
 * blanked, and "submitted" is never downgraded by a late step. An email alert goes to the
 * ALERT_EMAIL script property when a buyer finishes step 1 (stage "contact") and when they send.
 *
 * This file is versioned in the repo (scripts/apps-script/enquiry.gs) and tested in
 * tests/unit/apps-script.test.ts. Edit it there, then paste it again and redeploy.
 */

var SHEET_NAME = 'Leads';
var SITE_URL = 'https://www.goodbizhygiene.com/';
var COLUMNS = [
  'leadId', 'firstSeen', 'updated', 'stage', 'language', 'page',
  'name', 'company', 'email', 'phone',
  'group', 'product', 'productOther', 'quantity', 'quantityOther',
  'country', 'countryCode', 'port', 'terms', 'privateLabel', 'notes', 'variety', 'source',
];
/** The answer columns, in the order the alert email lists them. */
var FIELDS = COLUMNS.slice(6);
var LABELS = {
  name: 'Name', company: 'Company', email: 'Email', phone: 'Phone', group: 'Group', product: 'Product',
  productOther: 'Product (own words)', quantity: 'Quantity', quantityOther: 'Quantity (own words)',
  country: 'Country', countryCode: 'Country code', port: 'Port or city', terms: 'Terms',
  privateLabel: 'Private label', notes: 'Notes', variety: 'Variety', source: 'Came from',
};
var STAGES = ['contact', 'group', 'product', 'quantity', 'destination', 'terms', 'send', 'submitted'];
var LEAD_ID = /^[A-Za-z0-9-]{8,64}$/;

// Copied verbatim from src/lib/enquiry-steps.ts (a test checks they agree).
function safeCell(v) {
  return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  var isForm = false;
  try {
    var req = parseRequest(e);
    isForm = req.isForm;
    if (req.honeypot) return reply(true, isForm);
    if (!req.data || !LEAD_ID.test(String(req.data.leadId || ''))) return reply(false, isForm);
    var row = upsert(req.data);
    if (req.data.stage === 'contact' || req.data.stage === 'submitted') alert(req.data, row);
    return reply(true, isForm);
  } catch (err) {
    return reply(false, isForm);
  } finally {
    lock.releaseLock();
  }
}

/** A JSON body from the site's script, or the form fields of a no-JS post. */
function parseRequest(e) {
  var post = (e && e.postData) || {};
  var params = (e && e.parameter) || {};
  if (post.type !== 'application/x-www-form-urlencoded' && post.contents) {
    try {
      var data = JSON.parse(post.contents);
      if (!data || typeof data !== 'object') return { isForm: false, data: null };
      return { isForm: false, data: { leadId: data.leadId, stage: String(data.stage || ''), page: String(data.page || ''), fields: data.fields || {} } };
    } catch (err) {
      return { isForm: false, data: null };
    }
  }
  if (params.website_confirm) return { isForm: true, honeypot: true };
  var fields = {};
  for (var i = 0; i < FIELDS.length; i++) if (params[FIELDS[i]] != null) fields[FIELDS[i]] = params[FIELDS[i]];
  fields.language = params.language || '';
  // A no-JS post has no lead id (the site's script fills it in), so it starts its own row.
  var leadId = LEAD_ID.test(String(params.leadId || '')) ? params.leadId : Utilities.getUuid();
  return { isForm: true, data: { leadId: leadId, stage: params.stage || 'submitted', page: params.page || '', fields: fields } };
}

function sheet() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var s = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
  if (s.getLastRow() === 0) {
    s.appendRow(COLUMNS);
    s.setFrozenRows(1);
  }
  return s;
}

function upsert(data) {
  var s = sheet();
  var values = s.getDataRange().getValues();
  var now = new Date().toISOString();
  var rowIndex = -1;
  for (var r = 1; r < values.length; r++) {
    if (values[r][0] === data.leadId) {
      rowIndex = r;
      break;
    }
  }
  var row = rowIndex === -1 ? COLUMNS.map(function () { return ''; }) : values[rowIndex].slice();
  while (row.length < COLUMNS.length) row.push('');

  var set = function (name, value) {
    var v = value == null ? '' : String(value).trim();
    if (v === '') return; // never blank a filled cell
    row[COLUMNS.indexOf(name)] = safeCell(v);
  };
  set('leadId', data.leadId);
  if (rowIndex === -1) set('firstSeen', now);
  set('updated', now);
  var current = row[COLUMNS.indexOf('stage')];
  if (STAGES.indexOf(data.stage) >= STAGES.indexOf(current)) set('stage', data.stage);
  set('page', data.page);
  set('language', data.fields.language);
  for (var i = 0; i < FIELDS.length; i++) set(FIELDS[i], data.fields[FIELDS[i]]);

  if (rowIndex === -1) s.appendRow(row);
  else s.getRange(rowIndex + 1, 1, 1, COLUMNS.length).setValues([row]);
  return row;
}

/** The alert lists everything the row holds so far (the whole enquiry, not just this step). */
function alert(data, row) {
  var to = PropertiesService.getScriptProperties().getProperty('ALERT_EMAIL');
  if (!to) return;
  var cell = function (name) { return String(row[COLUMNS.indexOf(name)] || ''); };
  var lines = [];
  for (var i = 0; i < FIELDS.length; i++) {
    if (cell(FIELDS[i]) !== '') lines.push(LABELS[FIELDS[i]] + ': ' + cell(FIELDS[i]));
  }
  if (cell('language')) lines.push('Language: ' + cell('language'));
  var subject = data.stage === 'submitted' ? 'Enquiry sent' : 'New enquiry started';
  var who = cell('name') ? ' - ' + cell('name').replace(/^'/, '') : '';
  MailApp.sendEmail(to, subject + who + ' (GoodBiz Hygiene)', lines.join('\n') + '\n\nLead: ' + data.leadId);
}

function reply(ok, isForm) {
  if (isForm) {
    return HtmlService.createHtmlOutput(
      '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
        '<title>Thank you</title><body style="font-family:system-ui,sans-serif;max-width:36rem;margin:15vh auto;padding:0 16px;color:#12352a">' +
        (ok ? '<h1>Thank you. Your enquiry has reached GoodBiz Hygiene.</h1><p>We will reply by email or WhatsApp.</p>'
            : '<h1>Sorry, your enquiry could not be saved.</h1><p>Please write to us from the contact page.</p>') +
        '<p><a href="' + SITE_URL + '">Back to goodbizhygiene.com</a></p></body>',
    );
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: ok })).setMimeType(ContentService.MimeType.JSON);
}
