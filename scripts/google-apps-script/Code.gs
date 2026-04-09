/**
 * AGAX – Lichess Team Registration
 * Google Apps Script – doPost handler
 *
 * Columns written to the active sheet (in order):
 *   A: Data       – ISO timestamp of the submission
 *   B: Nome       – Full name
 *   C: Email      – Email address
 *   D: Lichess    – Lichess username
 *   E: Ano nacem. – Birth year
 *   F: Clube      – Club / origin
 *   G: Socio AGAX – Yes / No / Processing
 *   H: Comentarios – Free-text comments
 *   I: RGPD       – "Si" when the privacy policy was accepted
 *
 * HOW TO DEPLOY / UPDATE
 * ─────────────────────────────────────────────────────────────────────────────
 * First deploy (initial setup):
 *   1. Open the Google Sheet that will receive the data.
 *   2. Go to Extensions > Apps Script.
 *   3. Delete any existing code and paste the contents of this file.
 *   4. Click Save (💾).
 *   5. Click Deploy > New deployment.
 *      · Type: Web app
 *      · Execute as: Me
 *      · Who has access: Anyone
 *   6. Click Deploy, authorise the permissions, and copy the Web App URL.
 *   7. Paste the URL into src/constants.ts → GOOGLE_SCRIPT_URL.
 *
 * Updating the script after changes:
 *   1. Edit the code in the Apps Script editor (Extensions > Apps Script).
 *   2. Click Deploy > Manage deployments.
 *   3. Click the pencil icon (✏️) on the existing deployment.
 *   4. Choose "New version" in the Version dropdown.
 *   5. Click Deploy.
 *      ⚠️  The Web App URL does NOT change on re-deploy, so no change is needed
 *          in constants.ts.
 *
 * Adding a new form field:
 *   1. Add the field to the FormData.append() calls in src/services/sheetService.ts.
 *   2. Add the corresponding column header to the sheet manually (or via the
 *      setupHeaders() function below – run it once from the Apps Script editor).
 *   3. Add data.newField to the appendRow() call in doPost() below, in the same
 *      column position.
 *   4. Re-deploy as described above.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Handles POST requests from the web form.
 * The body is sent as multipart/form-data (FormData).
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var p     = e.parameter; // FormData fields

    sheet.appendRow([
      p.date        || new Date().toISOString(), // A – Data
      p.fullName    || '',                        // B – Nome
      p.email       || '',                        // C – Email
      p.lichessUser || '',                        // D – Lichess
      p.birthYear   || '',                        // E – Ano nacem.
      p.club        || '',                        // F – Clube
      p.isMember    || '',                        // G – Socio AGAX
      p.comments    || '',                        // H – Comentarios
      p.rgpd        || 'Non'                      // I – RGPD
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Run this function ONCE manually from the Apps Script editor to write the
 * column headers into row 1 of the sheet.
 * Trigger: Apps Script editor > select setupHeaders > Run (▶).
 */
function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(1, 1, 1, 9).setValues([[
    'Data',
    'Nome',
    'Email',
    'Lichess',
    'Ano nacem.',
    'Clube',
    'Socio AGAX',
    'Comentarios',
    'RGPD'
  ]]);
  sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
}
