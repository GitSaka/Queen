'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import EditProgressBar from '@/components/EditProgressBar';

export default function EditPhotoPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('lueur_token');
      if (!token) {
        router.push('/login');
        return;
      }
      const res = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPhotos(data.photos || []);
      }
      setLoading(false);
    }
    load();
  }, [router]);

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

  if (loading) {
    return (
      <>
        <EditProgressBar current="photo" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted">Chargement...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <EditProgressBar current="photo" />
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center text-center">
        <h1 className="font-display text-2xl font-semibold text-cream mb-2">Tes photos</h1>
        <p className="text-muted text-sm mb-8">
          Ajoute, complète ou change tes photos à tout moment.
        </p>

        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-6">
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

        {uploading && <p className="text-amber text-sm mb-4">Envoi de la photo en cours...</p>}
        {error && (
          <p className="text-coral text-sm text-center bg-coral/10 border border-coral/30 rounded-xl py-2 px-3 mb-4 w-full max-w-sm">
            {error}
          </p>
        )}
      </div>
    </>
  );
}