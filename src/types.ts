import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    // add other user properties you need
  };
}

export enum PresenceStatus {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  ABSENT = 'ABSENT'
} 

export enum UserRole {   
  ADMIN = 'ADMIN',
  VIGIL = 'VIGIL',
  APPRENANT = 'APPRENANT'
}