import express from 'express';
import { 
  scanPresence, 
  getPresences, 
  getStudentPresences 
} from '../controllers/presenceController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../types';

const router = express.Router();

router.post('/scan', protect, authorize(UserRole.VIGIL), scanPresence);
router.get('/', protect, authorize(UserRole.ADMIN, UserRole.VIGIL), getPresences);
router.get('/:userId', protect, getStudentPresences);

export default router;