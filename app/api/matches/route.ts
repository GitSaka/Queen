import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/getAuthUser';

export async function GET(request: Request) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  }

  const matches = await prisma.match.findMany({
    where: {
      isActive: true,
      OR: [{ userAId: auth.userId }, { userBId: auth.userId }],
    },
    include: {
      userA: { include: { photos: { where: { isMain: true }, take: 1 } } },
      userB: { include: { photos: { where: { isMain: true }, take: 1 } } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { matchedAt: 'desc' },
  });

  const formatted = matches.map((m) => {
    const other = m.userAId === auth.userId ? m.userB : m.userA;
    return {
      matchId: m.id,
      matchedAt: m.matchedAt,
      otherUser: {
        id: other.id,
        firstName: other.firstName,
        photoUrl: other.photos[0]?.url || null,
      },
      lastMessage: m.messages[0]
        ? { content: m.messages[0].content, createdAt: m.messages[0].createdAt }
        : null,
    };
  });

  return NextResponse.json({ matches: formatted });
}