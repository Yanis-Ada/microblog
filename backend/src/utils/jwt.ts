import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_never_use_in_production';
const JWT_EXPIRES_IN = '7d'; // Le token expire après 7 jours

export interface JwtPayload {
  userId: number;
  email: string;
  username: string;
}

/**
 * Génère un token JWT pour un utilisateur
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Vérifie et décode un token JWT
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
