import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';

const loginSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: data.identifier }, { phone: data.identifier }] },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 });
    }

    if (user.isBanned) {
      return NextResponse.json({ error: 'Ce compte a été suspendu.' }, { status: 403 });
    }

    const validPassword = await verifyPassword(data.password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isOnline: true, lastActiveAt: new Date() },
    });

    const token = generateToken(user.id);

    return NextResponse.json({
      message: 'Connexion réussie.',
      token,
      user: { id: user.id, firstName: user.firstName, city: user.city },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Une erreur est survenue lors de la connexion.' }, { status: 500 });
  }

}