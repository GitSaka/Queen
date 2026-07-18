import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/getAuthUser';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  }

  const { matchId } = await params;

  

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      userA: { include: { photos: { where: { isMain: true }, take: 1 } } },
      userB: { include: { photos: { where: { isMain: true }, take: 1 } } },
    },
  });

  

  if (!match || (match.userAId !== auth.userId && match.userBId !== auth.userId)) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  }

  const other = match.userAId === auth.userId ? match.userB : match.userA;

  return NextResponse.json({
    otherUser: {
      id: other.id,
      firstName: other.firstName,
      photoUrl: other.photos[0]?.url || null,
      isOnline: other.isOnline,
    },
  });
}