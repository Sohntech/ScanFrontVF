import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken';
import { generateQRCode } from '../utils/generateQR';
import { generateMatricule } from '../utils/generateMatricule';
import { loginSchema, registerSchema } from '../validations/authValidation';
import cloudinary from '../config/cloudinary';
import { FileRequest } from '../types/index';

const prisma = new PrismaClient();

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'VIGIL' | 'APPRENANT';
  referentiel?: string;
}

export const register = async (req: FileRequest, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body) as RegisterData;
    
    const userExists = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    if (validatedData.role === 'APPRENANT' && !validatedData.referentiel) {
      res.status(400).json({ message: 'Referentiel is required for students' });
      return;
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    let photoUrl = undefined;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      photoUrl = result.secure_url;
    }

    let matricule = undefined;
    let qrCode = undefined;

    if (validatedData.role === 'APPRENANT') {
      // Generate matricule
      matricule = await generateMatricule(validatedData.referentiel!);
      
      // Generate QR Code with matricule
      qrCode = await generateQRCode(matricule);
    }

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role,
        referentiel: validatedData.referentiel,
        matricule,
        qrCode,
        photoUrl,
      },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      matricule: user.matricule,
      referentiel: user.referentiel,
      photoUrl: user.photoUrl,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid input' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (user && (await bcrypt.compare(validatedData.password, user.password))) {
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        matricule: user.matricule,
        referentiel: user.referentiel,
        photoUrl: user.photoUrl,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid input' });
  }
};