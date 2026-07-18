import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/getAuthUser';
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';


export async function POST(request: Request) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier reçu.' }, { status: 400 });
  }

  // Limite de taille raisonnable (5 Mo), important pour ton contexte data mobile
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Le fichier dépasse 5 Mo.' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'lueur/profile-photos',
          resource_type: 'image',
          transformation: [{ width: 1000, height: 1250, crop: 'fill', quality: 'auto' }],
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result as { secure_url: string });
        }
      )
      .end(buffer);
  });

  // Compte combien de photos l'utilisateur a déjà, pour savoir si c'est la première (= photo principale)
  const existingCount = await prisma.photo.count({ where: { userId: auth.userId } });

  const photo = await prisma.photo.create({
    data: {
      userId: auth.userId,
      url: uploadResult.secure_url,
      isMain: existingCount === 0,
      order: existingCount,
    },
  });

  return NextResponse.json({ photo }, { status: 201 });
}