import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/getAuthUser';
import { calculateAge, getDistanceKm } from '@/lib/distance';

export const dynamic = 'force-dynamic';


export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  }

  const { userId } = await params;

  const me = await prisma.user.findUnique({ where: { id: auth.userId } });
  const target = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      photos: { orderBy: { order: 'asc' } },
      interests: { include: { interest: true } },
      promptAnswers: { include: { prompt: true }, orderBy: { order: 'asc' } },
    },
  });

  if (!target || !target.isActive) {
    return NextResponse.json({ error: 'Profil introuvable.' }, { status: 404 });
  }

  return NextResponse.json({
    id: target.id,
    firstName: target.firstName,
    age: calculateAge(target.birthDate),
    city: target.city,
    bio: target.bio,
    profession: target.profession,
    education: target.education,
    lookingFor: target.lookingFor,
    smokingHabit: target.smokingHabit,
    drinkingHabit: target.drinkingHabit,
    childrenStatus: target.childrenStatus,
    religion: target.religion,
    isVerified: target.verificationStatus === 'VERIFIE',
    isOpenToDirectMessages: target.isOpenToDirectMessages,
    distanceKm: me ? getDistanceKm(me.latitude, me.longitude, target.latitude, target.longitude) : null,
    photos: target.photos.map((p) => p.url),
    tags: target.interests.map((i) => i.interest.name),
    prompts: target.promptAnswers.map((pa) => ({
      question: pa.prompt.question,
      answer: pa.answer,
    })),
  });
}