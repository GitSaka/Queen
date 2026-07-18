'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingScreen from '@/components/LoadingScreen';
import Header from '@/components/Header';

type Profile = {
  id: string;
  firstName: string;
  age: number;
  city: string;
  bio: string | null;
  profession: string | null;
  education: string | null;
  isVerified: boolean;
  distanceKm: number | null;
  mainPhotoUrl: string | null;
  tags: string[];
  isOpenToDirectMessages: boolean;
};

export default function DiscoveryPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchName, setMatchName] = useState<string | null>(null);
  const [sendingDirect, setSendingDirect] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadProfiles() {
      const token = localStorage.getItem('lueur_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/discovery', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      if (!ignore) {
        setProfiles(data.profiles || []);
        setLoading(false);
      }
    }

    loadProfiles();
    return () => {
      ignore = true;
    };
  }, [router]);

  async function handleAction(liked: boolean, isSuperLike = false) {
    const current = profiles[0];
    if (!current) return;

    if (liked) {
      const token = localStorage.getItem('lueur_token');
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetId: current.id, isSuperLike }),
      });
      const data = await res.json();
      if (data.matched) setMatchName(current.firstName);
    }

    setProfiles((prev) => prev.slice(1));
  }

  async function handleDirectMessage() {
    const current = profiles[0];
    if (!current || sendingDirect) return;

    setSendingDirect(true);
    const token = localStorage.getItem('lueur_token');

    const res = await fetch('/api/direct-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetId: current.id }),
    });

    const data = await res.json();
    setSendingDirect(false);

    if (res.ok && data.matchId) {
      router.push(`/chat/${data.matchId}`);
    }
  }

  const current = profiles[0];

  return (
    <>
      <Header
        left={
          <h1 className="font-display text-[22px] font-semibold text-cream">
            Qu<span className="text-coral">ee</span>n
          </h1>
        }
        right={
          <Link
            href="/settings"
            className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-sm cursor-pointer hover:opacity-80"
          >
            ⚙
          </Link>
        }
      />

      <div className="relative flex-1 min-h-0 mx-3 mt-2 mb-1">
        {loading && <LoadingScreen message="Recherche de profils près de toi..." />}

        {!loading && !current && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-4xl mb-4">◐</p>
            <p className="text-cream font-display text-xl mb-2">Plus personne pour le moment</p>
            <p className="text-muted text-sm">Reviens plus tard, de nouveaux profils arrivent régulièrement.</p>
          </div>
        )}

        {current && (
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(21,14,27,0.95) 0%, rgba(21,14,27,0.1) 35%, rgba(21,14,27,0) 48%), url(${current.mainPhotoUrl || '/images.jpeg'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Mini Avatar en haut à gauche */}
            <div className="absolute top-4 left-4 w-14 h-14 rounded-full p-0.5 bg-[conic-gradient(from_180deg,var(--color-coral),var(--color-amber),var(--color-coral))]">
              <div className="w-full h-full rounded-full bg-[#6B4A82] border-2 border-ink flex items-center justify-center font-display text-lg text-cream overflow-hidden">
                <img src={current.mainPhotoUrl || '/images.jpeg'} alt={current.firstName} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Badges d'état en haut à droite */}
            <div className="absolute top-5 right-4 flex flex-col items-end gap-1.5">
              <span className="font-mono text-[10px] tracking-wider uppercase bg-ink/60 border border-amber/40 text-amber px-3 py-1.5 rounded-full">
                {current.distanceKm !== null ? `à ${current.distanceKm} km` : current.city}
              </span>

              {current.isOpenToDirectMessages && (
                <span className="font-mono text-[10px] tracking-wider uppercase bg-emerald/90 text-cream px-3 py-1.5 rounded-full flex items-center gap-1">
                  ● Disponible
                </span>
              )}
            </div>

            {/* Boutons d'actions verticaux (Swipe) à droite */}
            <div className="absolute right-3.5 bottom-28 flex flex-col items-center gap-5 z-10">
              <button
                onClick={() => handleAction(false)}
                className="w-11 h-11 rounded-full bg-ink/60 backdrop-blur-sm border border-white/10 text-cream text-lg cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
              >
                ✕
              </button>
              <button
                onClick={() => handleAction(true, true)}
                className="w-10 h-10 rounded-full bg-emerald text-cream text-sm cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
              >
                ★
              </button>
              <button
                onClick={() => handleAction(true, false)}
                className="rounded-full font-semibold text-ink text-xl cursor-pointer bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] hover:opacity-90 active:scale-95 transition-all flex items-center justify-center"
                style={{ width: '52px', height: '52px' }}
              >
                ♥
              </button>
            </div>

            {/* 1. Zone cliquable du profil (SANS le bouton à l'intérieur pour éviter la déformation) */}
            <Link 
              href={`/profile/${current.id}`} 
              className="absolute bottom-0 left-0 right-16 p-6 pb-20 cursor-pointer flex flex-col justify-end"
            >
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-display text-2xl text-cream">{current.firstName}</span>
                <span className="font-display text-lg text-cream">{current.age}</span>
                {current.isVerified && (
                  <span className="w-4 h-4 rounded-full bg-emerald flex items-center justify-center text-[9px] ml-0.5">
                    ✓
                  </span>
                )}
              </div>

              {(current.profession || current.education) && (
                <p className="text-cream/80 text-sm mb-2">
                  {[current.profession, current.education].filter(Boolean).join(' · ')}
                </p>
              )}

              {current.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-cream"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>

            {/* 2. Le bouton "Écrire directement" sorti du Link et géré de manière autonome au pixel près */}
            {current.isOpenToDirectMessages && (
              <div className="absolute bottom-6 left-6 z-20">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Bloque le lien vers le profil
                    handleDirectMessage();
                  }}
                  disabled={sendingDirect}
                  className="px-4 py-2 rounded-full bg-white/10 border border-emerald/50 text-cream text-xs cursor-pointer hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  {sendingDirect ? 'Ouverture...' : '✉ Écrire directement'}
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {matchName && (
        <div
          className="fixed inset-0 bg-ink/90 flex items-center justify-center z-50 px-6"
          onClick={() => setMatchName(null)}
        >
          <div className="text-center">
            <p className="text-5xl mb-4">🎉</p>
            <h2 className="font-display text-3xl text-cream mb-2">C&apos;est un match !</h2>
            <p className="text-muted mb-6">Toi et {matchName} vous êtes plu mutuellement.</p>
            <button
              onClick={() => setMatchName(null)}
              className="py-3 px-8 rounded-full font-semibold text-ink cursor-pointer bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))]"
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </>
  );
}