// This URL is a placeholder. In a real deployment, the user must create a Google Apps Script
// attached to their Sheet and paste the Web App URL here.
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx...PLACEHOLDER.../exec';

export const LICHESS_TEAM_URL = 'https://lichess.org/team/agax-aberto';

export const INITIAL_FORM_DATA = {
  fullName: '',
  email: '',
  lichessUsername: '',
  birthYear: '',
  clubName: '',
  isAgaxMember: 'No',
  comments: '',
  registrationDate: new Date().toISOString()
};

export const STEPS = [
  { id: 1, title: 'Datos Personales', description: 'Identificación' },
  { id: 2, title: 'Verificación', description: 'Preguntas de control' },
  { id: 3, title: 'Confirmar', description: 'Revisión final' },
];