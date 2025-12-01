import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  getUserByUsername,
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);
router.get('/:username', getUserByUsername);

// Routes protégées (nécessitent une authentification)
router.get('/me/profile', authenticateToken, getProfile);
router.put('/me/profile', authenticateToken, updateProfile);

export default router;
