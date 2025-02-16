import { Request } from 'express';

export enum UserRole {
  ADMIN = 'ADMIN',
  VIGIL = 'VIGIL',
  APPRENANT = 'APPRENANT'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
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
  date?: string;
  matricule?: string;
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
  role: UserRole;
  referentiel: string;
  photo: Express.Multer.File;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    role?: UserRole;
  };
}

export interface FileRequest extends Request {
  file?: Express.Multer.File;
}
