import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/getAuthUser';
import { calculateAge, getDistanceKm } from '@/lib/distance';

export async function GET(request: Request) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  }

  const me = await prisma.user.findUnique({ where: { id: auth.userId } });
  if (!me) {
    return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
  }

  const alreadyLiked = await prisma.like.findMany({
    where: { fromUserId: me.id },
    select: { toUserId: true },
  });

  const excludedIds = new Set([me.id, ...alreadyLiked.map((l) => l.toUserId)]);

  const candidates = await prisma.user.findMany({
    where: {
      id: { notIn: Array.from(excludedIds) },
      isActive: true,
      isBanned: false,
    },
    include: {
      photos: { orderBy: { order: 'asc' } },
      interests: { include: { interest: true } },
    },
    take: 30,
  });

  const profiles = candidates.map((c) => ({
    id: c.id,
    firstName: c.firstName,
    age: calculateAge(c.birthDate),
    city: c.city,
    bio: c.bio,
    profession: c.profession,
    education: c.education,
    isVerified: c.verificationStatus === 'VERIFIE',
    isOpenToDirectMessages: c.isOpenToDirectMessages,
    distanceKm: getDistanceKm(me.latitude, me.longitude, c.latitude, c.longitude),
    mainPhotoUrl: c.photos.find((p) => p.isMain)?.url || c.photos[0]?.url || null,
    tags: c.interests.map((i) => i.interest.name),
    
  }));

  return NextResponse.json({ profiles });
}