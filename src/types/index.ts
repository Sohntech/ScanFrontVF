import { Request } from 'express';

export enum UserRole {
  ADMIN = 'ADMIN',
  VIGIL = 'VIGIL',
  APPRENANT = 'APPRENANT'
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  matricule: string;
  referentiel: string;
  photoUrl?: string;
  role: UserRole;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
  presences?: any[]
}

export interface Presence {
  scanTime: string;
  id: string;
  status: string;
  arrivalTime?: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    matricule: string;
    referentiel: string;
    photoUrl: string;
  };
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
