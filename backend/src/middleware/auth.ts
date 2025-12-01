import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';

// Extension de l'interface Request pour inclure l'utilisateur
export interface AuthRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: JwtPayload;
}

/**
 * Middleware d'authentification JWT
 * Vérifie le token dans le header Authorization
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      res.status(401).json({ error: 'Token manquant. Authentification requise.' });
      return;
    }

    // Vérifier et décoder le token
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(403).json({ error: 'Token invalide ou expiré.' });
      return;
    }

    // Ajouter les infos utilisateur à la requête
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la vérification du token.' });
  }
};
