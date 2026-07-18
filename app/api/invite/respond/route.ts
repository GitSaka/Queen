import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';


export async function POST(request: Request) {
  try {
    // 1. Authentification et récupération de la session de la fille
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string; id?: string };
    const myUserId = decoded.userId || decoded.id;

    if (!myUserId) {
      return NextResponse.json({ error: 'Session invalide' }, { status: 401 });
    }

    // 2. Récupération des données envoyées par le clic du bouton de chat
    const body = await request.json();
    const { matchId, status } = body; // status vaut 'ACCEPTE' ou 'REFUSE'

    if (!matchId || !status || !['ACCEPTE', 'REFUSE'].includes(status)) {
      return NextResponse.json({ error: 'Données manquantes ou invalides' }, { status: 400 });
    }

    // 3. Vérification que ce match existe et concerne bien la fille connectée
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ error: 'Invitation introuvable' }, { status: 404 });
    }

    // Sécurité : Seule la destinataire de l'invitation (userA ou userB) peut y répondre
    if (match.userAId !== myUserId && match.userBId !== myUserId) {
      return NextResponse.json({ error: 'Action non autorisée' }, { status: 403 });
    }

    // 4. TRAITEMENT DE LA RÉPONSE DE LA FILLE
    if (status === 'REFUSE') {
      // Si elle refuse, on supprime proprement le match de PostgreSQL (ou isActive = false)
      // Cela évite de polluer sa messagerie. La discussion disparaît.
      await prisma.match.delete({
        where: { id: matchId },
      });

      return NextResponse.json({ message: 'Invitation refusée et supprimée' }, { status: 200 });
    } else {
      // Si elle accepte, on met à jour le statut
      const updatedMatch = await prisma.match.update({
        where: { id: matchId },
        data: {
          inviteStatus: 'ACCEPTE',
          // Note : isInvitation reste à true, ce qui nous permettra d'afficher un badge "Payé" 
          // ou de bloquer le chat tant que l'homme n'a pas réglé via Mobile Money.
        },
      });

      return NextResponse.json({ 
        message: 'Invitation acceptée avec succès',
        inviteStatus: updatedMatch.inviteStatus 
      }, { status: 200 });
    }

  } catch (error) {
    console.error('Erreur API Response Invitation:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
