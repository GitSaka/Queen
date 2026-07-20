'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';

type Message = {
  id: string;
  content: string;
  senderId: string;
  type: 'TEXTE' | 'IMAGE' | 'AUDIO' | 'VIDEO';
  createdAt: string;
};

type OtherUser = {
  id: string;
  firstName: string;
  photoUrl: string | null;
  isOnline: boolean;
};

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const matchId = params.matchId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [myUserId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('lueur_user');
    return stored ? JSON.parse(stored).id : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadMatchInfo() {
      const token = localStorage.getItem('lueur_token');
      if (!token) return;

      const res = await fetch(`/api/matches/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (!ignore) setOtherUser(data.otherUser);
      }
    }

    loadMatchInfo();
    return () => {
      ignore = true;
    };
  }, [matchId]);

  useEffect(() => {
    let ignore = false;

    async function loadMessages() {
      const token = localStorage.getItem('lueur_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`/api/messages/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      if (!ignore) {
        setMessages((prev) => {
          const serverMessages: Message[] = data.messages || [];
          // Garde les messages "optimistes" pas encore confirmés par le serveur (évite qu'ils disparaissent)
          const serverIds = new Set(serverMessages.map((m) => m.id));
          const pendingLocal = prev.filter((m) => m.id.startsWith('temp-') && !serverIds.has(m.id));
          return [...serverMessages, ...pendingLocal];
        });
        setLoading(false);
      }
    }

    loadMessages();
    const interval = setInterval(loadMessages, 3000);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, [matchId, router]);

  async function handleSendMessage(content: string, type: 'TEXTE' | 'IMAGE' | 'AUDIO' | 'VIDEO') {
    if (!content.trim() || !myUserId) return;

    // Affiche le message immédiatement, avant même la réponse du serveur
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      content,
      senderId: myUserId,
      type,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    const token = localStorage.getItem('lueur_token');

    const res = await fetch(`/api/messages/${matchId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, type }),
    });

    const data = await res.json();
    if (res.ok) {
      // Remplace le message temporaire par la vraie version confirmée du serveur
      setMessages((prev) => prev.map((m) => (m.id === tempId ? data.message : m)));
    }
  }

  return (
    <main className="min-h-screen bg-ink flex justify-center">
      <div className="w-full max-w-md flex flex-col h-screen relative">
        <ChatHeader otherUser={otherUser} />

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          <MessageList messages={messages} loading={loading} myUserId={myUserId} />
        </div>

        <p className="text-center text-xs text-muted px-8 pb-2 flex-shrink-0 select-none">
          🔒 Conversation privée · captures d&apos;écran bloquées
        </p>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </main>
  );
}