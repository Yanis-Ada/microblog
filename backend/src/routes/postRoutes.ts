import { Router } from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
} from '../controllers/postController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Routes protégées (nécessitent une authentification)
router.post('/', authenticateToken, createPost);
router.delete('/:id', authenticateToken, deletePost);

export default router;
