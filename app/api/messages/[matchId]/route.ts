import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/getAuthUser';

export const dynamic = 'force-dynamic';


async function assertParticipant(matchId: string, userId: string) {
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match || !match.isActive) return null;
  if (match.userAId !== userId && match.userBId !== userId) return null;
  return match;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  }

  const { matchId } = await params;
  const match = await assertParticipant(matchId, auth.userId);
  if (!match) {
    return NextResponse.json({ error: 'Accès refusé à cette conversation.' }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { matchId },
    orderBy: { createdAt: 'asc' },
  });

  await prisma.message.updateMany({
    where: { matchId, senderId: { not: auth.userId }, isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json({ messages });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  }

  const { matchId } = await params;
  const match = await assertParticipant(matchId, auth.userId);
  if (!match) {
    return NextResponse.json({ error: 'Accès refusé à cette conversation.' }, { status: 403 });
  }

  const { content } = await request.json();
  if (!content || !content.trim()) {
    return NextResponse.json({ error: 'Message vide.' }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: { matchId, senderId: auth.userId, content: content.trim() },
  });

  return NextResponse.json({ message }, { status: 201 });
}