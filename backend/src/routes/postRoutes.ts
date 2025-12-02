import { Router } from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Routes protégées (nécessitent une authentification)
router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost); // 🆕 Modifier un post
router.delete('/:id', authenticateToken, deletePost);

export default router;
