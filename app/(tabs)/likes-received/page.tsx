'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';

type LikerProfile = {
  id: string;
  firstName: string;
  age: number;
  city: string;
  photoUrl: string | null;
  isSuperLike: boolean;
};

export default function LikesReceivedPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<LikerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchName, setMatchName] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const token = localStorage.getItem('lueur_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/likes-received', {
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

    load();
    return () => {
      ignore = true;
    };
  }, [router]);

  async function handleLikeBack(targetId: string, firstName: string) {
    const token = localStorage.getItem('lueur_token');
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetId }),
    });
    const data = await res.json();
    if (data.matched) setMatchName(firstName);
    setProfiles((prev) => prev.filter((p) => p.id !== targetId));
  }

  function handlePass(targetId: string) {
    setProfiles((prev) => prev.filter((p) => p.id !== targetId));
  }

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <div className="px-5 pt-6 pb-2">
        <h1 className="font-display text-2xl text-cream">Qui t&apos;a liké</h1>
        <p className="font-mono text-[10px] text-muted uppercase tracking-wider mt-1">
          {loading
            ? '\u00A0'
            : `${profiles.length} personne${profiles.length > 1 ? 's' : ''} intéressée${profiles.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {loading && <LoadingScreen message="Recherche de tes admirateurs..." />}

      {!loading && profiles.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center px-8 py-16">
          <p className="text-4xl mb-4">♥</p>
          <p className="text-cream font-display text-lg mb-2">Personne pour le moment</p>
          <p className="text-muted text-sm">
            Dès que quelqu&apos;un te likera, il/elle apparaîtra ici.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 px-5">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl overflow-hidden border border-white/10 relative aspect-[3/4]"
            style={{
              backgroundImage: p.photoUrl
                ? `linear-gradient(to top, rgba(21,14,27,0.9) 0%, rgba(21,14,27,0.1) 50%, rgba(21,14,27,0) 65%), url(${p.photoUrl})`
                // : 'linear-gradient(135deg, #4A2E5C 0%, #2A1B3D 60%)',
                : `linear-gradient(to top, rgba(21,14,27,0.9) 0%, rgba(21,14,27,0.1) 50%, rgba(21,14,27,0) 65%), url("/images.jpeg")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {p.isSuperLike && (
              <span className="absolute top-2 left-2 text-emerald text-lg">★</span>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="font-display text-cream text-sm">
                {p.firstName}, {p.age}
              </p>
              <p className="text-muted text-[10px] mb-2">{p.city}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePass(p.id)}
                  className="flex-1 py-1.5 rounded-full bg-white/10 text-cream text-xs cursor-pointer hover:bg-white/20 transition-colors"
                >
                  ✕
                </button>
                <button
                  onClick={() => handleLikeBack(p.id, p.firstName)}
                  className="flex-1 py-1.5 rounded-full font-semibold text-ink text-xs cursor-pointer bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))]"
                >
                  ♥
                </button>
              </div>
            </div>
          </div>
        ))}
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
    </div>
  );
}