import { verifyToken } from './auth';

// Extrait l'utilisateur connecté à partir de l'en-tête "Authorization: Bearer ..."
export function getAuthUser(request: Request): { userId: string } | null {
  const header = request.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) return null;

  const token = header.split(' ')[1];
  return verifyToken(token);
}