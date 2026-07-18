import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { hashPassword, generateToken } from '@/lib/auth';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères.'),
  email: z.string().email('Adresse email invalide.').optional(),
  phone: z.string().min(8, 'Numéro de téléphone invalide.').optional(),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
  birthDate: z.string(),
  gender: z.enum(['HOMME', 'FEMME', 'AUTRE']),
  city: z.string().min(2, 'La ville est requise.'),
});

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    if (!data.email && !data.phone) {
      return NextResponse.json({ error: 'Un email ou un numéro de téléphone est requis.' }, { status: 400 });
    }

    // Vérification stricte de l'âge — appliquée côté serveur, non contournable
    const age = calculateAge(data.birthDate);
    if (age < 18) {
      return NextResponse.json(
        { error: "L'inscription est réservée aux personnes majeures (18 ans et plus)." },
        { status: 403 }
      );
    }

    const orConditions: Prisma.UserWhereInput[] = [];
    if (data.email) orConditions.push({ email: data.email });
    if (data.phone) orConditions.push({ phone: data.phone });

    const existing = await prisma.user.findFirst({
      where: { OR: orConditions },
    });

    if (existing) {
      return NextResponse.json({ error: 'Un compte existe déjà avec ces identifiants.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        email: data.email,
        phone: data.phone,
        passwordHash,
        birthDate: new Date(data.birthDate),
        gender: data.gender,
        city: data.city,
        preferences: {
          create: { interestedInGender: ['HOMME', 'FEMME'] },
        },
      },
    });

    const token = generateToken(user.id);

    return NextResponse.json(
      { message: 'Compte créé.', token, user: { id: user.id, firstName: user.firstName, city: user.city } },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Une erreur est survenue lors de l'inscription." }, { status: 500 });
  }
}