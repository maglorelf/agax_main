export enum RegistrationType {
  LICHESS_TEAM = 'LICHESS_TEAM',
  MEMBER_SIGNUP = 'MEMBER_SIGNUP',
  OTHER_EVENT = 'OTHER_EVENT'
}

export interface UserFormData {
  fullName: string;
  email: string;
  lichessUsername: string;
  birthYear: string;
  clubName: string; // "Club de procedencia"
  isAgaxMember: string; // "Yes" | "No"
  comments: string;
  registrationDate: string;
  rgpdAccepted: boolean;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  lichessUsername?: string;
  birthYear?: string;
  rgpdAccepted?: string;
}

export interface SheetResponse {
  result: 'success' | 'error';
  message?: string;
}