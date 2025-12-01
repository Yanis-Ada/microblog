import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // Niveau de sécurité pour le hachage (12 est recommandé)

/**
 * Hache un mot de passe avec bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare un mot de passe en clair avec un hash
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
