import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { registerSchema, loginSchema, updateProfileSchema } from '../utils/validation';
import prisma from '../utils/prisma';

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Valider les données d'entrée
    const validatedData = registerSchema.parse(req.body);

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      res.status(409).json({ error: 'Cet email est déjà utilisé.' });
      return;
    }

    // Vérifier si le username existe déjà
    const existingUsername = await prisma.user.findUnique({
      where: { username: validatedData.username },
    });

    if (existingUsername) {
      res.status(409).json({ error: 'Ce nom d\'utilisateur est déjà pris.' });
      return;
    }

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(validatedData.password);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        createdAt: true,
      },
    });

    // Générer un token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    res.status(201).json({
      message: 'Inscription réussie.',
      user,
      token,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Données invalides.', details: error.errors });
      return;
    }
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription.' });
  }
};

/**
 * Connexion d'un utilisateur
 */
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Valider les données d'entrée
    const validatedData = loginSchema.parse(req.body);

    // Trouver l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(validatedData.password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      return;
    }

    // Générer un token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    res.status(200).json({
      message: 'Connexion réussie.',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Données invalides.', details: error.errors });
      return;
    }
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion.' });
  }
};

/**
 * Récupérer le profil de l'utilisateur connecté
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé.' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

/**
 * Mettre à jour le profil de l'utilisateur connecté
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié.' });
      return;
    }

    // Valider les données d'entrée
    const validatedData = updateProfileSchema.parse(req.body);

    // Vérifier si le nouveau username est déjà pris
    if (validatedData.username) {
      const existingUsername = await prisma.user.findFirst({
        where: {
          username: validatedData.username,
          NOT: { id: req.user.userId },
        },
      });

      if (existingUsername) {
        res.status(409).json({ error: 'Ce nom d\'utilisateur est déjà pris.' });
        return;
      }
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: validatedData,
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: 'Profil mis à jour avec succès.',
      user: updatedUser,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Données invalides.', details: error.errors });
      return;
    }
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

/**
 * Récupérer un profil utilisateur par username
 */
export const getUserByUsername = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        bio: true,
        createdAt: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé.' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};
