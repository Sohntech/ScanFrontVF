import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import jsQR from 'jsqr'; // 📌 Import de la librairie pour décoder le QR code
import { Buffer } from 'buffer'; // 📌 Nécessaire pour gérer Base64

// Define the enum here since it's not exported from Prisma
enum PresenceStatus {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  ABSENT = 'ABSENT'
}

const prisma = new PrismaClient();

const determinePresenceStatus = (scanTime: Date): PresenceStatus => {
  const hour = scanTime.getHours();
  const minutes = scanTime.getMinutes();
  const timeInMinutes = hour * 60 + minutes;

  if (timeInMinutes <= 8 * 60 + 15) { // Avant 8:15
    return PresenceStatus.PRESENT;
  } else if (timeInMinutes <= 8 * 60 + 30) { // Entre 8:15 et 8:30
    return PresenceStatus.LATE;
  } else { // Après 8:30
    return PresenceStatus.ABSENT;
  }
};

// 📌 Fonction pour décoder l'image Base64 et extraire la matricule
const decodeQRCode = (base64Image: string): string | null => {
  try {
    const buffer = Buffer.from(base64Image, 'base64');
    const code = jsQR(new Uint8ClampedArray(buffer), 300, 300); // 📌 Adapter la taille selon l'image

    return code?.data || null;
  } catch (error) {
    console.error('Erreur de décodage du QR code:', error);
    return null;
  }
};

export const scanPresence = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { qrCode } = req.body;

    if (!qrCode) {
      res.status(400).json({ message: 'QR code manquant' });
      return;
    }

    const matricule = decodeQRCode(qrCode);
    if (!matricule) {
      res.status(400).json({ message: 'QR code invalide' });
      return;
    }

    // 📌 3. Recherche de l'apprenant avec la matricule extraite
    const student = await prisma.user.findFirst({
      where: { matricule },
    });

    if (!student) {
      res.status(404).json({ message: 'Matricule non trouvé' });
      return;
    }

    // 📌 4. Détermination du statut de présence
    const scanTime = new Date();
    const status = determinePresenceStatus(scanTime);

    // 📌 5. Enregistrement de la présence
    const presence = await prisma.presence.create({
      data: {
        userId: student.id,
        status,
        scanTime,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(presence);
  } catch (error) {
    res.status(500).json({ message: 'Error scanning presence' });
  }
};

// 📌 Récupération des présences avec des filtres
export const getPresences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, status, referentiel } = req.query;

    let where: any = {};

    if (startDate && endDate) {
      where.scanTime = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    if (status) {
      where.status = status;
    }

    if (referentiel) {
      where.user = {
        referentiel: referentiel as string,
      };
    }

    const presences = await prisma.presence.findMany({
      where,
      include: {
        user: true,
      },
      orderBy: {
        scanTime: 'desc',
      },
    });

    res.json(presences);
  } catch (error) {
    console.error('Erreur lors de la récupération des présences:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des présences' });
  }
};

// 📌 Récupération des présences d'un étudiant spécifique
export const getStudentPresences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const presences = await prisma.presence.findMany({
      where: {
        userId,
      },
      orderBy: {
        scanTime: 'desc',
      },
    });

    const stats = {
      total: presences.length,
      present: presences.filter((p: { status: any; }) => p.status === PresenceStatus.PRESENT).length,
      late: presences.filter((p: { status: any; }) => p.status === PresenceStatus.LATE).length,
      absent: presences.filter((p: { status: any; }) => p.status === PresenceStatus.ABSENT).length,
      presencePercentage: 0,
    };

    if (stats.total > 0) {
      stats.presencePercentage = (stats.present / stats.total) * 100;
    }

    res.json({
      presences,
      stats,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des présences de l\'étudiant:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des présences de l\'étudiant' });
  }
};
