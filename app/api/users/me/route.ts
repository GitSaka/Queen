import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/getAuthUser';
import { calculateAge } from '@/lib/distance';

export const dynamic = 'force-dynamic';


export async function GET(request: Request) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  }

  const me = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: {
      photos: { orderBy: { order: 'asc' } },
      interests: { include: { interest: true } },
      promptAnswers: { include: { prompt: true }, orderBy: { order: 'asc' } },
    },
  });

  if (!me) {
    return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
  }

  return NextResponse.json({
    id: me.id,
    firstName: me.firstName,
    email: me.email,
    phone: me.phone,
    age: calculateAge(me.birthDate),
    city: me.city,
    bio: me.bio,
    profession: me.profession,
    education: me.education,
    lookingFor: me.lookingFor,
    smokingHabit: me.smokingHabit,
    drinkingHabit: me.drinkingHabit,
    childrenStatus: me.childrenStatus,
    religion: me.religion,
    isVerified: me.verificationStatus === 'VERIFIE',
    isOpenToDirectMessages: me.isOpenToDirectMessages,
    distanceKm: null,
    photos: me.photos.map((p) => p.url),
    tags: me.interests.map((i) => i.interest.name),
    prompts: me.promptAnswers.map((pa) => ({
      question: pa.prompt.question,
      answer: pa.answer,
    })),
  });
}

export async function PATCH(request: Request) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  }

  const body = await request.json();
  const allowedFields = ['bio', 'profession', 'education', 'lookingFor', 'city'];

  const data: Record<string, string> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) data[field] = body[field];
  }

  const updated = await prisma.user.update({
    where: { id: auth.userId },
    data,
  });

  return NextResponse.json({ success: true, user: { id: updated.id } });
}