import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, UserRole } from '../types';

const prisma = new PrismaClient();

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (!req.headers.authorization?.startsWith('Bearer')) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }

  try {
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = await prisma.user.findUnique({ where: { id: decoded.id } });
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      res.status(403).json({ 
        message: 'Not authorized to access this resource' 
      });
      return;
    }
    next();
  };
};