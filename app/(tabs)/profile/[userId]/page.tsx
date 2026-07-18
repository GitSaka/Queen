'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProfileHero from '@/components/ProfileHero';
import ProfileInfo from '@/components/ProfileInfo';
import MatchModal from '@/components/MatchModal';
import Link from 'next/link';
import ProfileFeed from '@/components/chat/ProfileFeed';
import { mockFeedList } from '@/lib/mockFeed';

type ProfileDetail = {
  id: string;
  firstName: string;
  age: number;
  city: string;
  bio: string | null;
  profession: string | null;
  education: string | null;
  lookingFor: string | null;
  smokingHabit: string | null;
  drinkingHabit: string | null;
  childrenStatus: string | null;
  religion: string | null;
  isVerified: boolean;
  isOpenToDirectMessages: boolean;
  distanceKm: number | null;
  photos: string[];
  tags: string[];
  prompts: { question: string; answer: string }[];
};

export default function ProfileDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [profile, setProfile] = useState<ProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchName, setMatchName] = useState<string | null>(null);
  const [sendingDirect, setSendingDirect] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const token = localStorage.getItem('lueur_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (!ignore) {
          setProfile(data);
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [userId, router]);

  async function handleAction(liked: boolean, isSuperLike = false) {
    if (!profile) return;

    if (liked) {
      const token = localStorage.getItem('lueur_token');
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetId: profile.id, isSuperLike }),
      });
      const data = await res.json();
      if (data.matched) {
        setMatchName(profile.firstName);
        return;
      }
    }
    router.push('/discovery');
  }

  async function handleDirectMessage() {
    if (!profile || sendingDirect) return;
    setSendingDirect(true);
    const token = localStorage.getItem('lueur_token');

    const res = await fetch('/api/direct-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ targetId: profile.id }),
    });

    const data = await res.json();
    setSendingDirect(false);
    if (res.ok && data.matchId) router.push(`/chat/${data.matchId}`);
  }

  if (loading || !profile) {
    return (
      <main className="min-h-screen bg-ink flex items-center justify-center">
        <p className="text-muted">Chargement du profil...</p>
      </main>
    );
  }

  const mainPhoto = profile.photos[0] || '/images.jpeg';

  return (
    <main className="min-h-screen bg-ink flex justify-center overflow-y-auto">
      <div className="w-full max-w-sm flex flex-col">
        
        {/* Photo de couverture et retour */}
        <ProfileHero mainPhoto={mainPhoto} />

        {/* Informations de base (Prénom, Âge, Bio, Prompts, Bouton Message Direct) */}
       <ProfileInfo 
          profile={profile} 
          sendingDirect={sendingDirect} 
          onDirectMessage={handleDirectMessage}
          onAction={handleAction}
        />

        {/* =========================================================
            🛠️ EMPLACEMENT DES SECTIONS SUIVANTES (VIDÉOS, PUBS)
            Tout ce que vous ajouterez ici apparaîtra EN BAS des boutons d'actions.
            Le pb-28 garantit que la toute dernière section ne soit pas masquée par la TabBar.
           ========================================================= */}
        <div className="pb-28 flex flex-col gap-6">
         {/* 📍 LE BOUTON MAGIQUE D'INVITATION DIRECTE V1 */}
          <Link
            href={`/invite/${profile.id}`}
            className="w-full py-4 rounded-2xl font-display text-sm font-semibold text-center text-ink bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] shadow-md shadow-coral/10 hover:opacity-95 active:scale-[0.99] transition-all select-none cursor-pointer"
          >
            📍 L&apos;inviter à sortir (Rendez-vous Sécurisé)
          </Link>

          <ProfileFeed posts={mockFeedList} />
          
        </div>

        {/* Alerte modale en cas de Match */}
        <MatchModal matchName={matchName} onClose={() => setMatchName(null)} />

      </div>
    </main>
  );
}
