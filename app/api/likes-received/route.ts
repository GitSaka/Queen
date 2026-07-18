import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/getAuthUser';
import { calculateAge } from '@/lib/distance';

export async function GET(request: Request) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  }

  // Tous ceux qui m'ont liké
  const receivedLikes = await prisma.like.findMany({
    where: { toUserId: auth.userId },
    include: {
      fromUser: {
        include: { photos: { where: { isMain: true }, take: 1 } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Les matchs déjà existants, pour exclure ceux qu'on a déjà matchés
  const existingMatches = await prisma.match.findMany({
    where: { OR: [{ userAId: auth.userId }, { userBId: auth.userId }] },
  });

  const alreadyMatchedIds = new Set(
    existingMatches.map((m) => (m.userAId === auth.userId ? m.userBId : m.userAId))
  );

  const profiles = receivedLikes
    .filter((like) => !alreadyMatchedIds.has(like.fromUserId))
    .map((like) => ({
      id: like.fromUser.id,
      firstName: like.fromUser.firstName,
      age: calculateAge(like.fromUser.birthDate),
      city: like.fromUser.city,
      photoUrl: like.fromUser.photos[0]?.url || null,
      isSuperLike: like.isSuperLike,
    }));

  return NextResponse.json({ profiles });
}