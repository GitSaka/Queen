import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/getAuthUser';

export async function POST(request: Request) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  }

  const { targetId, isSuperLike } = await request.json();

  if (targetId === auth.userId) {
    return NextResponse.json({ error: 'Action impossible sur son propre profil.' }, { status: 400 });
  }

  try {
    await prisma.like.create({
      data: { fromUserId: auth.userId, toUserId: targetId, isSuperLike: !!isSuperLike },
    });
  } catch {
    return NextResponse.json({ error: 'Profil déjà liké.' }, { status: 409 });
  }

  const reciprocal = await prisma.like.findUnique({
    where: { fromUserId_toUserId: { fromUserId: targetId, toUserId: auth.userId } },
  });

  if (reciprocal) {
    const [userAId, userBId] = [auth.userId, targetId].sort();
    const match = await prisma.match.create({ data: { userAId, userBId } });
    return NextResponse.json({ matched: true, match }, { status: 201 });
  }

  return NextResponse.json({ matched: false });
}