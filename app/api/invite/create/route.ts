import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'; // 💡 Assurez-vous d'avoir importé votre outil de décodage JWT (jsonwebtoken, jose, ou autre)

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';


export async function POST(request: Request) {
  try {
    // 1. Récupération et décodage du vrai Token d'authentification
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // 🔒 RECUPERATION DYNAMIQUE DU VRAI ID UTILISATEUR CONNECTÉ
    // Remplacez 'VOTRE_JWT_SECRET' par la variable secrète que vous utilisez dans votre projet (.env)
    const JWT_SECRET = process.env.JWT_SECRET || 'secret'; 
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string; id?: string };
    
    // On extrait le vrai ID présent dans le token (selon comment votre ancien expert l'a nommé : userId ou id)
    const myUserId = decoded.userId || decoded.id;

    if (!myUserId) {
      return NextResponse.json({ error: 'Session invalide' }, { status: 401 });
    }

    // 2. Extraction des données envoyées par la page d'invitation
    const body = await request.json();
    const { targetUserId, restaurantName, restaurantPrice, inviteIntent } = body;

    // ... LE RESTE DE VOTRE CODE NE CHANGE PAS D'UN MILLIMÈTRE ...


    if (!targetUserId || !restaurantName || !restaurantPrice || !inviteIntent) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    // Sécurité élémentaire : on ne peut pas s'inviter soi-même
    if (myUserId === targetUserId) {
      return NextResponse.json({ error: 'Action impossible' }, { status: 400 });
    }

    // Ordering strict des IDs pour correspondre aux index uniques @@unique([userAId, userBId]) de Prisma
    const [userAId, userBId] = myUserId < targetUserId ? [myUserId, targetUserId] : [targetUserId, myUserId];

    // 3. Vérification si un Match ou une Invitation existe déjà entre ces deux profils
    const existingMatch = await prisma.match.findUnique({
      where: {
        userAId_userBId: { userAId, userBId },
      },
    });

    if (existingMatch) {
      // Si une invitation est déjà active ou qu'ils sont déjà en couple, on redirige directement vers le chat
      return NextResponse.json({ matchId: existingMatch.id });
    }

    // 4. CRÉATION DU MATCH EN BASE PostgreSQL (Sans IA, pur algorithme relationnel)
    const newMatch = await prisma.match.create({
      data: {
        userAId,
        userBId,
        source: 'MESSAGE_DIRECT', // Indique que ce n'est pas un swipe classique mutuel
        isInvitation: true,       // Active le calque d'invitation sur l'écran de la fille
        restaurantName,
        restaurantPrice: parseFloat(restaurantPrice),
        inviteIntent,             // 'AMICAL' ou 'SEXUEL'
        inviteStatus: 'EN_ATTENTE',
      },
    });

    // 5. Envoi de la réponse avec l'ID du match pour la redirection immédiate
    return NextResponse.json({ matchId: newMatch.id }, { status: 201 });

  } catch (error) {
    console.error('Erreur API Invitation:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
