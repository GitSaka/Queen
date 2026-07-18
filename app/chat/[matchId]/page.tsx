'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

// Importation de nos 4 composants découpés dans le dossier chat
import ChatHeader from '@/components/chat/ChatHeader';
import InviteCard from '@/components/chat/InviteCard';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';

// Importation de notre réservoir de fausses données
import { mockMessagesList, MockMessage, MY_USER_ID } from '@/lib/mockMessages';

type OtherUser = {
  id: string;
  firstName: string;
  photoUrl: string | null;
  isOnline: boolean;
  isInvitation?: boolean;
  restaurantName?: string | null;
  restaurantPrice?: number | null;
  inviteIntent?: 'AMICAL' | 'SEXUEL' | null;
  inviteStatus?: 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE';
};

export default function ChatPage() {
  const params = useParams();
  const matchId = params.matchId as string;

  // 💡 UTILISATION DES FAUSSES DONNÉES EN V1
  const [messages, setMessages] = useState<MockMessage[]>(mockMessagesList);
  const [loading, setLoading] = useState(false); // Mis à false pour voir les faux messages directs
  const [processingInvite, setProcessingInvite] = useState(false);

  // Simulation des informations de l'autre personne pour vos tests visuels
  const [otherUser, setOtherUser] = useState<OtherUser | null>({
    id: "user_fatou_456",
    firstName: "Fatou",
    photoUrl: "https://unsplash.com",
    isOnline: true,
    isInvitation: true,             // Mettre à false pour masquer l'invitation
    restaurantName: "Glacier de la Paix",
    restaurantPrice: 3000,
    inviteIntent: "AMICAL",         // Ou "SEXUEL"
    inviteStatus: "EN_ATTENTE"
  });

  // Action de réponse à la carte d'invitation [Accepter/Refuser]
  const handleInviteResponse = (status: 'ACCEPTE' | 'REFUSE') => {
    setProcessingInvite(true);
    setTimeout(() => {
      setOtherUser((prev) => prev ? { ...prev, inviteStatus: status } : null);
      setProcessingInvite(false);
    }, 400); // Simulation d'une latence réseau ultra-fluide
  };

  // Ajout dynamique de messages, photos ou audios simulés dans l'écran
  const handleSendMessage = (content: string, type: 'TEXTE' | 'IMAGE' | 'AUDIO' | 'VIDEO') => {
    const newMsg: MockMessage = {
      id: `msg_fictif_${Date.now()}`,
      content,
      senderId: MY_USER_ID,
      type,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // REMPLACEZ : const showInviteCard = otherUser?.isInvitation && otherUser?.inviteStatus === 'EN_ATTENTE';
// PAR CECI :
const showInviteCard = !!otherUser?.isInvitation && otherUser?.inviteStatus === 'EN_ATTENTE';


  return (
    <main className="min-h-screen bg-ink flex justify-center">
      <div className="w-full max-w-md flex flex-col h-screen relative">
        
        {/* 1. L'En-tête Premium */}
        <ChatHeader otherUser={otherUser} />

        {/* Zone centrale de défilement */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          
          {/* Conteneur interne pour isoler la carte d'invitation et la liste */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
            
            {/* 2. La carte d'invitation directe V1 */}
            <InviteCard 
              show={showInviteCard}
              firstName={otherUser?.firstName || 'Queen'}
              restaurantName={otherUser?.restaurantName || ''}
              inviteIntent={otherUser?.inviteIntent || 'AMICAL'}
              processing={processingInvite}
              onRespond={handleInviteResponse}
            />

            {/* 3. La liste des messages multimédias */}
            <MessageList messages={messages} loading={loading} />

          </div>

        </div>

        {/* Petite mention de sécurité native */}
        <p className="text-center text-xs text-muted px-8 pb-2 flex-shrink-0 select-none">
          🔒 Conversation privée · captures d&apos;écran bloquées
        </p>

        {/* 4. La barre de saisie basse avec le bouton "＋" */}
        <ChatInput onSendMessage={handleSendMessage} />

      </div>
    </main>
  );
}
