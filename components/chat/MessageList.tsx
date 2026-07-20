'use client';

import { useEffect, useRef, useState } from 'react';


type Message = {
  id: string;
  content: string;
  senderId: string;
  type: 'TEXTE' | 'IMAGE' | 'AUDIO' | 'VIDEO';
  createdAt: string;
};

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  myUserId: string | null;
}

type FullscreenState = {
  images: string[];
  currentIndex: number;
} | null;

export default function MessageList({ messages, loading, myUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wasNearBottomRef = useRef(true);

  const [lightbox, setLightbox] = useState<FullscreenState>(null);

  // Mémorise si l'utilisateur est proche du bas avant que les messages changent
  function checkIfNearBottom() {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 100; // tolérance en pixels
    wasNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }

  useEffect(() => {
    // Ne défile automatiquement que si l'utilisateur était déjà proche du bas
    if (wasNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fonctions de navigation pour glisser d'une photo à l'autre
  const showNextImage = () => {
    if (!lightbox) return;
    setLightbox({
      ...lightbox,
      currentIndex: (lightbox.currentIndex + 1) % lightbox.images.length
    });
  };

  const showPrevImage = () => {
    if (!lightbox) return;
    setLightbox({
      ...lightbox,
      currentIndex: (lightbox.currentIndex - 1 + lightbox.images.length) % lightbox.images.length
    });
  };

  return (
    <div
      ref={containerRef}
      onScroll={checkIfNearBottom}
      className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 flex flex-col gap-3 min-w-0 relative"
    >
      
      {loading && <p className="text-muted text-center text-base mt-10 animate-pulse">Chargement...</p>}

      {!loading && messages.length === 0 && (
        <p className="text-muted text-center text-base mt-10">
          Dis bonjour, c&apos;est le début de votre conversation.
        </p>
      )}

      {messages.map((m) => {
        const isMine = m.senderId === myUserId;
        const isTextOrAudio = m.type === 'TEXTE' || m.type === 'AUDIO';
        
        // Extraction et nettoyage des URLs multiples séparées par une virgule
        const imageUrls = m.type === 'IMAGE' ? m.content.split(',').map(url => url.trim()) : [];
        const isMultiPhoto = imageUrls.length > 1;

        return (
          <div
            key={m.id}
            className={`rounded-3xl text-[15px] leading-relaxed break-words flex flex-col flex-shrink-0 ${
              isMine ? 'self-end' : 'self-start'
            } ${
              isTextOrAudio
                ? isMine
                  ? 'max-w-[78%] px-4 py-3 bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] text-ink font-medium rounded-br-md'
                  : 'max-w-[78%] px-4 py-3 bg-card text-cream rounded-bl-md'
                : isMultiPhoto
                  ? 'w-64 bg-card/20 p-2 border border-white/5'
                  : 'w-56 overflow-hidden bg-transparent'
            }`}
          >
            {/* 📝 1. RENDU DU TEXTE */}
            {m.type === 'TEXTE' && <span>{m.content}</span>}

            {/* 📷 2. RENDU DES IMAGES MULTIPLES */}
            {m.type === 'IMAGE' && (
              <div className={`grid gap-1.5 w-full ${isMultiPhoto ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {imageUrls.map((url, index) => (
                  <div 
                    key={index}
                    onClick={() => setLightbox({ images: imageUrls, currentIndex: index })} // Mémorise tout le groupe de photos
                    className={`relative rounded-2xl overflow-hidden bg-card flex-shrink-0 cursor-pointer active:scale-95 transition-transform ${
                      isMultiPhoto ? 'h-24' : 'h-72 w-56'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={url} 
                      alt={`Miniature ${index + 1}`} 
                      className="w-full h-full object-cover block rounded-2xl"
                      loading="eager"
                      onError={(e) => {
                        e.currentTarget.src = "https://unsplash.com";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 🎙️ 3. RENDU DE L'AUDIO */}
            {m.type === 'AUDIO' && (
              <div className="flex items-center gap-2 select-none min-w-[200px] h-9">
                <span className="text-base flex-shrink-0">{isMine ? '🗣️' : '🎙️'}</span>
                <audio 
                  src="https://soundhelix.com" 
                  controls 
                  className={`w-full h-8 ${isMine ? 'accent-ink' : 'accent-coral'}`} 
                />
              </div>
            )}

            {/* 🎬 4. RENDU DE LA VIDÉO */}
            {m.type === 'VIDEO' && (
              <div 
                className="w-56 h-80 relative rounded-2xl overflow-hidden bg-black flex-shrink-0 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                onClick={() => setLightbox({ images: [m.content], currentIndex: 0 })} // Géré comme une image unique dans le lecteur
              >
                <video 
                  src="https://googleapis.com" 
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover block rounded-2xl pointer-events-none" 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-cream text-2xl">
                  ▶
                </div>
                <span className="absolute top-2 right-2 text-[8px] font-mono bg-ink/75 border border-white/10 text-cream px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Reel
                </span>
              </div>
            )}

          </div>
        );
      })}
      
      <div ref={bottomRef} />

      {/* =================================================================
          🔮 LA GALERIE WHATSAPP/FACEBOOK EN VRAI PLEIN ÉCRAN
         ================================================================= */}
      {lightbox && (
        <div 
          className="fixed inset-0 bg-black/98 z-50 flex items-center justify-center select-none"
          onClick={() => setLightbox(null)}
        >
          {/* Bouton Fermer */}
          <button 
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 text-cream text-xl flex items-center justify-center cursor-pointer hover:bg-white/20 z-50 transition-colors"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>

          {/* Indication de l'index de la photo (Ex: 1 / 4) */}
          {lightbox.images.length > 1 && (
            <p className="absolute top-7 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest text-muted uppercase">
              {lightbox.currentIndex + 1} / {lightbox.images.length}
            </p>
          )}

          {/* ⬅️ FLÈCHE GAUCHE (Masquée si 1 seule photo) */}
          {lightbox.images.length > 1 && (
            <button
              className="absolute left-4 w-12 h-12 rounded-full bg-black/40 text-cream text-2xl flex items-center justify-center cursor-pointer hover:bg-black/60 z-50 active:scale-90 transition-transform"
              onClick={(e) => { e.stopPropagation(); showPrevImage(); }}
            >
              ‹
            </button>
          )}

          {/* ZONE CENTRALE : AFFICHAGE PLEIN ÉCRAN MAXIMAL */}
          <div className="w-full h-full flex items-center justify-center p-2" onClick={(e) => e.stopPropagation()}>
            {/* Détection dynamique si l'URL courante est un MP4 ou une Image */}
            {lightbox.images[lightbox.currentIndex].includes('.mp4') || messages.find(m => m.content === lightbox.images[lightbox.currentIndex])?.type === 'VIDEO' ? (
              <video 
                src="https://googleapis.com" 
                controls 
                autoPlay 
                playsInline
                className="w-full h-auto max-h-screen object-contain"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={lightbox.images[lightbox.currentIndex]} 
                alt="Affichage Grand Format" 
                className="w-full h-auto max-h-screen object-contain shadow-2xl"
              />
            )}
          </div>

          {/* ➡️ FLÈCHE DROITE (Masquée si 1 seule photo) */}
          {lightbox.images.length > 1 && (
            <button
              className="absolute right-4 w-12 h-12 rounded-full bg-black/40 text-cream text-2xl flex items-center justify-center cursor-pointer hover:bg-black/60 z-50 active:scale-90 transition-transform"
              onClick={(e) => { e.stopPropagation(); showNextImage(); }}
            >
              ›
            </button>
          )}

        </div>
      )}

    </div>
  );
}
