import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/getAuthUser';

export const dynamic = 'force-dynamic';


export async function POST(request: Request) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  }

  const { targetId } = await request.json();

  if (targetId === auth.userId) {
    return NextResponse.json({ error: 'Action impossible sur son propre profil.' }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: targetId } });

  if (!target || !target.isActive) {
    return NextResponse.json({ error: 'Profil introuvable.' }, { status: 404 });
  }

  // Sécurité : on vérifie que la personne a bien activé "disponible", pas juste fait confiance au frontend
  if (!target.isOpenToDirectMessages) {
    return NextResponse.json(
      { error: 'Cette personne n’accepte pas les messages directs.' },
      { status: 403 }
    );
  }

  // Vérifie si un match existe déjà entre les deux (peu importe l'ordre userA/userB)
  const [userAId, userBId] = [auth.userId, targetId].sort();

  const existingMatch = await prisma.match.findUnique({
    where: { userAId_userBId: { userAId, userBId } },
  });

  if (existingMatch) {
    // Le match existe déjà (peut-être un ancien like mutuel) → on redirige simplement vers ce chat
    return NextResponse.json({ matchId: existingMatch.id }, { status: 200 });
  }

  const match = await prisma.match.create({
    data: { userAId, userBId, source: 'MESSAGE_DIRECT' },
  });

  return NextResponse.json({ matchId: match.id }, { status: 201 });
}