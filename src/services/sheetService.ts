import { UserFormData, SheetResponse, MemberSignupFormData } from '../types';
import { GOOGLE_SCRIPT_URL, REXISTRO_SOCIOS_AGAX } from '../constants';

/**
 * SUBMITTING TO GOOGLE SHEETS WITHOUT A BACKEND:
 *
 * The full Google Apps Script source and deployment instructions live in:
 *   scripts/google-apps-script/Code.gs
 *
 * Quick steps:
 *   1. Open the target Google Sheet → Extensions > Apps Script.
 *   2. Paste the contents of Code.gs and save.
 *   3. Deploy > New deployment (Web app, Execute as: Me, Access: Anyone).
 *   4. Copy the Web App URL and set it as GOOGLE_SCRIPT_URL in constants.ts.
 *   5. Run setupHeaders() once from the Apps Script editor to write column titles.
 *
 * To update the script after changes, see the "Updating" section in Code.gs.
 */

export const submitToGoogleSheet = async (data: UserFormData): Promise<SheetResponse> => {
  // Check if we are using the placeholder URL
  if (GOOGLE_SCRIPT_URL.includes('PLACEHOLDER')) {
    console.warn("Usando envío simulado: a URL de Google Script non está configurada en constants.ts");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { result: 'success', message: 'Envío simulado correcto' };
  }

  try {
    // Google Apps Script requires a specific POST setup. 
    // Often 'no-cors' is needed for simple client-side fetches to Google Scripts, 
    // but that prevents reading the response. 
    // For a robust solution, we use standard fetch. If CORS fails, we often assume success if no network error.
    
    const formData = new FormData();
    // We append data for the script to read
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('lichessUser', data.lichessUsername);
    formData.append('birthYear', data.birthYear);
    formData.append('club', data.clubName);
    formData.append('isMember', data.isAgaxMember);
    formData.append('comments', data.comments);
    formData.append('rgpd', data.rgpdAccepted ? 'Si' : 'Non');
    formData.append('date', new Date().toISOString());

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // Important for Google Apps Script Web Apps consumed by browser
    });

    // With no-cors, we get an opaque response. We assume it worked if it didn't throw.
    return { result: 'success' };

  } catch (error) {
    console.error("Erro ao enviar á folla", error);
    return { result: 'error', message: 'Erro de conexión coa folla de cálculo.' };
  }
};

export const submitMemberSignupToGoogleSheet = async (data: MemberSignupFormData): Promise<SheetResponse> => {
  if (REXISTRO_SOCIOS_AGAX.includes('PENDENTE_DE_CONFIGURAR')) {
    console.warn('Usando envio simulado: REXISTRO_SOCIOS_AGAX segue pendente de configurar.');
    await new Promise(resolve => setTimeout(resolve, 1200));
    return { result: 'success', message: 'Envio simulado correcto' };
  }

  try {
    const formData = new FormData();
    formData.append('type', 'MEMBER_SIGNUP');
    formData.append('fullName', data.fullName);
    formData.append('birthDate', data.birthDate);
    formData.append('dniNie', data.dniNie);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('requestDate', data.requestDate);
    formData.append('signatureName', data.signatureName);
    formData.append('guardianName', data.guardianName);
    formData.append('privacyAccepted', data.privacyAccepted ? 'Si' : 'Non');
    formData.append('mediaPermissionAccepted', data.mediaPermissionAccepted ? 'Si' : 'Non');
    formData.append('submittedAt', new Date().toISOString());

    await fetch(REXISTRO_SOCIOS_AGAX, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    });

    return { result: 'success' };
  } catch (error) {
    console.error('Erro ao enviar o rexistro de socio', error);
    return { result: 'error', message: 'Erro de conexión ao enviar a solicitude.' };
  }
};