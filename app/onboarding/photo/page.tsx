'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPhotoPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    const token = localStorage.getItem('lueur_token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Échec de l'envoi de la photo.");
        setUploading(false);
        return;
      }

      setPhotos((prev) => [...prev, data.photo.url]);
    } catch {
      setError('Erreur de connexion. Vérifie ta connexion internet.');
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleContinue() {
    router.push('/onboarding/profile');
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_20%,#3A2450_0%,var(--color-ink)_65%)] flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center text-center">
        <h1 className="font-display text-3xl font-semibold text-cream mb-2">
          Montre-toi
        </h1>
        <p className="text-muted text-sm mb-8">
          Ajoute au moins une photo pour que les autres puissent te découvrir.
        </p>

        {/* Grille de photos (3 emplacements) */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          {[0, 1, 2].map((i) => {
            const photoUrl = photos[i];
            return (
              <button
                key={i}
                type="button"
                onClick={() => !uploading && fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-[3/4] rounded-2xl border border-white/10 bg-card flex items-center justify-center cursor-pointer overflow-hidden hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoUrl} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-muted text-2xl">+</span>
                )}
              </button>
            );
          })}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading && (
          <p className="text-amber text-sm mb-4">Envoi de la photo en cours...</p>
        )}

        {error && (
          <p className="text-coral text-sm text-center bg-coral/10 border border-coral/30 rounded-xl py-2 px-3 mb-4 w-full">
            {error}
          </p>
        )}

        <button
          onClick={handleContinue}
          disabled={photos.length === 0}
          className="w-full py-4 rounded-full font-sans font-semibold text-ink bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {photos.length === 0 ? 'Ajoute au moins une photo' : 'Continuer'}
        </button>
      </div>
    </main>
  );
}