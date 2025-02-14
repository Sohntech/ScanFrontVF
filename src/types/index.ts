export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'VIGIL' | 'APPRENANT';
  matricule?: string;
  photoUrl?: string;
  referentiel?: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Presence {
  id: string;
  userId: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT';
  scanTime: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'APPRENANT';
  referentiel: string;
  photo: File;
}