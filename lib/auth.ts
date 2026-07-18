import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET as string;

// Transforme un mot de passe en clair en version chiffrée, pour ne jamais stocker le vrai mot de passe
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Compare un mot de passe tapé par l'utilisateur avec la version chiffrée en base
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Génère un token de connexion (une sorte de "badge temporaire") valable 7 jours
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Vérifie qu'un token reçu est valide, et retourne l'identifiant de l'utilisateur
export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}