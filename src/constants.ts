// This URL is a placeholder. In a real deployment, the user must create a Google Apps Script
// attached to their Sheet and paste the Web App URL here.
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwV7GmRv8ggXG2oDOtZLtmxXAkAw4NIii3mVd5S3jmrDRBk4Xq4v_ZSVOhBszQtx3VY/exec';
export const REXISTRO_SOCIOS_AGAX = 'https://script.google.com/macros/s/AKfycbx7s0al5rxLWG_9OdbZSiqG9YQiNtAAnQl9_bWdsDtqSQNPCR_5-t-BiUbG3hf9uB4JNg/exec';

export const LICHESS_TEAM_URL = 'https://lichess.org/team/agax-aberto';

export const INITIAL_FORM_DATA = {
  fullName: '',
  email: '',
  lichessUsername: '',
  birthYear: '',
  clubName: '',
  isAgaxMember: 'Non',
  comments: '',
  registrationDate: new Date().toISOString(),
  rgpdAccepted: false
};

export const STEPS = [
  { id: 1, title: 'Datos persoais', description: 'Identificación' },
  { id: 2, title: 'Verificación', description: 'Preguntas de control' },
  { id: 3, title: 'Confirmar', description: 'Revisión final' },
];