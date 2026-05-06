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

export interface MemberSignupFormData {
  fullName: string;
  birthDate: string;
  dniNie: string;
  email: string;
  phone: string;
  requestDate: string;
  signatureName: string;
  guardianName: string;
  privacyAccepted: boolean;
  mediaPermissionAccepted: boolean;
}

export interface MemberSignupErrors {
  fullName?: string;
  birthDate?: string;
  dniNie?: string;
  phone?: string;
  requestDate?: string;
  signatureName?: string;
  guardianName?: string;
  privacyAccepted?: string;
  mediaPermissionAccepted?: string;
}