import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { createPostSchema } from '../utils/validation';

const prisma = new PrismaClient();

/**
 * Créer un nouveau post
 */
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié.' });
      return;
    }

    // Valider les données d'entrée
    const validatedData = createPostSchema.parse(req.body);

    // Créer le post
    const post = await prisma.post.create({
      data: {
        content: validatedData.content,
        authorId: req.user.userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            bio: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Post créé avec succès.',
      post,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Données invalides.', details: error.errors });
      return;
    }
    console.error('Erreur lors de la création du post:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

/**
 * Récupérer tous les posts (feed global)
 */
export const getAllPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            bio: true,
          },
        },
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

/**
 * Récupérer un post par ID
 */
export const getPostById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      res.status(400).json({ error: 'ID invalide.' });
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            bio: true,
          },
        },
      },
    });

    if (!post) {
      res.status(404).json({ error: 'Post non trouvé.' });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Erreur lors de la récupération du post:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

/**
 * Supprimer un post (seulement par son auteur)
 */
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié.' });
      return;
    }

    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      res.status(400).json({ error: 'ID invalide.' });
      return;
    }

    // Vérifier que le post existe et appartient à l'utilisateur
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({ error: 'Post non trouvé.' });
      return;
    }

    if (post.authorId !== req.user.userId) {
      res.status(403).json({ error: 'Vous n\'êtes pas autorisé à supprimer ce post.' });
      return;
    }

    // Supprimer le post
    await prisma.post.delete({
      where: { id: postId },
    });

    res.status(200).json({ message: 'Post supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du post:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};
