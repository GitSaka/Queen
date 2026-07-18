import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/getAuthUser';

export async function GET(request: Request) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  }

  const answers = await prisma.userPromptAnswer.findMany({
    where: { userId: auth.userId },
    include: { prompt: true },
    orderBy: { order: 'asc' },
  });

  return NextResponse.json({ answers });
}

export async function POST(request: Request) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  }

  const { promptId, answer, order } = await request.json();

  if (!answer || !answer.trim()) {
    return NextResponse.json({ error: 'Réponse vide.' }, { status: 400 });
  }

  const saved = await prisma.userPromptAnswer.upsert({
    where: { userId_promptId: { userId: auth.userId, promptId } },
    update: { answer: answer.trim() },
    create: { userId: auth.userId, promptId, answer: answer.trim(), order: order ?? 0 },
  });

  return NextResponse.json({ answer: saved }, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  }

  const { promptId } = await request.json();

  await prisma.userPromptAnswer.deleteMany({
    where: { userId: auth.userId, promptId },
  });

  return NextResponse.json({ success: true });
}