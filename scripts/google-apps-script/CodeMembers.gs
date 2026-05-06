/**
 * AGAX - Alta de socios (Faite socio)
 * Google Apps Script - xestor doPost
 *
 * Columnas escritas (A -> L):
 *   A: Data de envío
 *   B: Nome e apelidos
 *   C: Data de nacemento
 *   D: DNI/NIE
 *   E: Correo electrónico
 *   F: Teléfono
 *   G: Data da solicitude
 *   H: Sinatura
 *   I: Nome do titor/a
 *   J: Aceptación privacidade
 *   K: Permiso publicación
 *   L: Tipo
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var p = e.parameter;

    sheet.appendRow([
      p.submittedAt || new Date().toISOString(),
      p.fullName || '',
      p.birthDate || '',
      p.dniNie || '',
      p.email || '',
      p.phone || '',
      p.requestDate || '',
      p.signatureName || '',
      p.guardianName || '',
      p.privacyAccepted || 'Non',
      p.mediaPermissionAccepted || 'Non',
      p.type || 'MEMBER_SIGNUP'
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

function setupMemberHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(1, 1, 1, 12).setValues([[
    'Data de envío',
    'Nome e apelidos',
    'Data de nacemento',
    'DNI/NIE',
    'Correo electrónico',
    'Teléfono',
    'Data da solicitude',
    'Sinatura',
    'Nome do titor/a',
    'Aceptación privacidade',
    'Permiso publicación',
    'Tipo'
  ]]);

  sheet.getRange(1, 1, 1, 12).setFontWeight('bold');
}
