'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingScreen from '@/components/LoadingScreen';

// Simulation des restaurants de la V1 (Terre-à-terre, pas besoin d'IA ni de base de données lourde)
const availableVenues = [
  { id: '1', name: 'Glacier de la Paix', description: '2 Boissons + 1 Coupe géante à partager', price: 3000 },
  { id: '2', name: 'Maquis le Palace Chic', description: '2 Sucreries/Bières + 1 Plat d’Allocos/Poulet', price: 5000 },
  { id: '3', name: 'Salon de Thé L’Étoile', description: '2 Cafés/Thés + 2 Pâtisseries fines', price: 4000 },
];

type TargetUser = {
  firstName: string;
};

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const targetUserId = params.userId as string;

  const [targetUser, setTargetUser] = useState<TargetUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVenueId, setSelectedVenueId] = useState('1');
  const [intent, setIntent] = useState<'AMICAL' | 'SEXUEL'>('AMICAL');
  const [sending, setSending] = useState(false);

  // Charger rapidement le prénom de la fille pour personnaliser l'écran
  useEffect(() => {
    async function loadInfo() {
      const token = localStorage.getItem('lueur_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`/api/users/${targetUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setTargetUser({ firstName: data.firstName });
        setLoading(false);
      }
    }
    loadInfo();
  }, [targetUserId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const venue = availableVenues.find((v) => v.id === selectedVenueId);
    if (!venue) return;

    try {
      const token = localStorage.getItem('lueur_token');
      
      // Appel à votre future API d'invitation directe
      const res = await fetch('/api/invite/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetUserId,
          restaurantName: venue.name,
          restaurantPrice: venue.price,
          inviteIntent: intent,
        }),
      });

      const data = await res.json();
      
      if (res.ok && data.matchId) {
        // Redirection instantanée vers le chat déjà existant
        router.push(`/chat/${data.matchId}`);
      }
    } catch (err) {
      console.error("Erreur d'envoi de l'invitation", err);
    } finally {
      setSending(false);
    }
  };

  if (loading || !targetUser) {
    return <LoadingScreen message="Préparation de l'invitation..." />;
  }

  return (
    <main className="min-h-screen bg-ink flex justify-center overflow-y-auto select-none">
      <div className="w-full max-w-sm flex flex-col p-6">
        
        {/* En-tête avec bouton retour */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-cream text-lg cursor-pointer"
          >
            ←
          </button>
          <h1 className="font-display text-xl font-semibold text-cream">
            Inviter <span className="text-coral">{targetUser.firstName}</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between gap-6">
          
          <div className="space-y-6">
            {/* SECTION 1 : CHOIX DU LIEU (Boutons radio premium) */}
            <div>
              <label className="block font-mono text-[10px] tracking-wider uppercase text-muted mb-3">
                1. Choisir le lieu du rendez-vous
              </label>
              <div className="space-y-3">
                {availableVenues.map((venue) => (
                  <label
                    key={venue.id}
                    onClick={() => setSelectedVenueId(venue.id)}
                    className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedVenueId === venue.id
                        ? 'bg-card border-coral shadow-md shadow-coral/10'
                        : 'bg-card/50 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-display font-medium text-cream text-sm">{venue.name}</span>
                      <span className="font-mono text-xs font-semibold text-amber">{venue.price} CFA</span>
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed">{venue.description}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* SECTION 2 : CHOIX DE L'INTENTION (Bouton bascule exclusif Lueur) */}
            <div>
              <label className="block font-mono text-[10px] tracking-wider uppercase text-muted mb-3">
                2. Préciser vos intentions réelles
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIntent('AMICAL')}
                  className={`py-3.5 px-4 rounded-2xl font-sans text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                    intent === 'AMICAL'
                      ? 'bg-card border-emerald text-emerald'
                      : 'bg-card/30 border-white/5 text-muted hover:border-white/10'
                  }`}
                >
                  🤝 Rencontre Amicale
                </button>
                <button
                  type="button"
                  onClick={() => setIntent('SEXUEL')}
                  className={`py-3.5 px-4 rounded-2xl font-sans text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                    intent === 'SEXUEL'
                      ? 'bg-card border-coral text-coral'
                      : 'bg-card/30 border-white/5 text-muted hover:border-white/10'
                  }`}
                >
                  ⚡ Rencontre Sexuelle
                </button>
              </div>
              <p className="text-[10px] text-muted/60 mt-2 px-1 text-center">
                Cette intention sera affichée en toute discrétion sur l&apos;invitation reçue par la fille.
              </p>
            </div>
          </div>

          {/* BOUTON D'ACTION FINAL */}
          <div className="pt-4 pb-8">
            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 text-center text-ink font-semibold rounded-2xl bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] hover:opacity-95 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              {sending ? "Envoi de la proposition..." : `Envoyer la proposition (Gratuit)`}
            </button>
            <p className="text-center text-[10px] text-muted/40 mt-3 px-4">
              Tu ne paieras les {availableVenues.find(v => v.id === selectedVenueId)?.price} CFA que si {targetUser.firstName} clique sur &quot;Accepter&quot;.
            </p>
          </div>

        </form>

      </div>
    </main>
  );
}
