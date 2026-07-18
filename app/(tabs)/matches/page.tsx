'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingScreen from '@/components/LoadingScreen';
import Header from '@/components/Header';

type MatchItem = {
  matchId: string;
  otherUser: { id: string; firstName: string; photoUrl: string | null };
  lastMessage: { content: string; createdAt: string } | null;
};

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'à l’instant';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} j`;
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const token = localStorage.getItem('lueur_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/matches', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      if (!ignore) {
        setMatches(data.matches || []);
        setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [router]);

  const recentMatches = matches;
  const conversations = matches.filter((m) => m.lastMessage);

  return (
    <>
      <Header
        center={
          <div className="text-center">
            <h1 className="font-display text-[17px] text-cream leading-tight">Tes matchs</h1>
            <p className="text-[10px] text-muted">
              {loading ? '\u00A0' : `${matches.length} connexion${matches.length > 1 ? 's' : ''}`}
            </p>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {loading && <LoadingScreen message="Chargement de tes matchs..." />}

        {!loading && matches.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center px-8 py-16">
            <p className="text-4xl mb-4">♥</p>
            <p className="text-cream font-display text-lg mb-2">Pas encore de match</p>
            <p className="text-muted text-sm mb-6">
              Retourne découvrir des profils pour trouver ta première connexion.
            </p>
            <Link
              href="/discovery"
              className="py-3 px-6 rounded-full font-semibold text-ink text-sm cursor-pointer bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))]"
            >
              Découvrir des profils
            </Link>
          </div>
        )}

        {recentMatches.length > 0 && (
          <div className="flex gap-3 px-5 py-3.5 overflow-x-auto">
            {recentMatches.map((m) => (
              <Link
                key={m.matchId}
                href={`/chat/${m.matchId}`}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer"
              >
                <div className="w-[58px] h-[58px] rounded-full p-0.5 mb-1.5 bg-[conic-gradient(from_90deg,var(--color-coral),var(--color-amber),var(--color-coral))]">
                  <div className="w-full h-full rounded-full bg-card-2 border-2 border-ink overflow-hidden flex items-center justify-center text-cream font-display text-sm">
                    {m.otherUser.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.otherUser.photoUrl} alt={m.otherUser.firstName} className="w-full h-full object-cover" />
                    ) : (
                      m.otherUser.firstName[0]
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-muted">{m.otherUser.firstName}</span>
              </Link>
            ))}
          </div>
        )}

        {conversations.length > 0 && (
          <div className="px-5 pt-1 flex flex-col gap-1">
            {conversations.map((m) => (
              <Link
                key={m.matchId}
                href={`/chat/${m.matchId}`}
                className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-white/5 rounded-xl -mx-2 px-2 transition-colors"
              >
                <div className="w-[46px] h-[46px] rounded-full bg-card-2 flex-shrink-0 overflow-hidden flex items-center justify-center text-cream font-display text-sm">
                  {m.otherUser.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.otherUser.photoUrl} alt={m.otherUser.firstName} className="w-full h-full object-cover" />
                  ) : (
                    m.otherUser.firstName[0]
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm text-cream">{m.otherUser.firstName}</p>
                  <p className="text-[11px] text-muted truncate">{m.lastMessage?.content}</p>
                </div>
                {m.lastMessage && (
                  <span className="text-[9px] text-muted flex-shrink-0">
                    {timeAgo(m.lastMessage.createdAt)}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}