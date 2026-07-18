'use client';

import { useState } from 'react';
import { MockPost } from '@/lib/mockFeed';

interface ProfileFeedProps {
  posts: MockPost[];
}

export default function ProfileFeed({ posts }: ProfileFeedProps) {
  // 🔒 L'ÉTAT COMPOSITE : Stocke la publication actuellement ouverte en plein écran
  const [activePost, setActivePost] = useState<MockPost | null>(null);

  if (!posts || posts.length === 0) {
    return (
      <p className="text-muted text-center text-xs py-8 select-none">
        Aucun secret partagé pour le moment.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      
      {/* Titre de section élégant */}
      <div className="px-1 flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold text-cream tracking-wide">
          📖 Son Journal Intime
        </h2>
        <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
          {posts.length} capsules
        </span>
      </div>

      {/* 🚀 LE CARROUSEL HORIZONTAL AVEC APERÇU DIRECT */}
      <div className="w-full flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 snap-x">
        {posts.map((post) => {
          return (
            <button
              key={post.id}
              onClick={() => setActivePost(post)} // ⚡ Ouvre le plein écran au clic
              className="w-28 h-36 bg-card/60 border border-white/5 rounded-2xl relative overflow-hidden flex flex-col justify-between flex-shrink-0 cursor-pointer snap-centric hover:border-white/10 active:scale-95 transition-all shadow-sm"
            >
              {/* 📝 APERÇU TEXTE COURT */}
              {post.type === 'TEXTE_COURT' && (
                <div className="w-full h-full bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] p-3 flex items-center justify-center text-center">
                  <p className="font-display text-[10px] font-bold text-ink line-clamp-4 leading-normal">
                    {post.textContent}
                  </p>
                </div>
              )}

              {/* 📖 APERÇU TEXTE LONG */}
              {post.type === 'TEXTE_LONG' && (
                <div className="w-full h-full bg-card p-3 flex flex-col justify-between text-left">
                  <span className="text-lg">📖</span>
                  <p className="text-[9px] text-cream/70 line-clamp-3 leading-normal font-sans">
                    {post.textContent}
                  </p>
                  <span className="text-[7px] font-mono text-muted uppercase tracking-wider">Pensée</span>
                </div>
              )}

              {/* 📸 APERÇU PHOTO DIRECT */}
              {post.type === 'PHOTO_AVEC_TEXTE' && (
                <div className="w-full h-full relative bg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.mediaUrl} alt="Aperçu" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex items-end">
                    <span className="text-[8px] font-sans font-medium text-cream truncate w-full">📸 {post.textContent || "Instant"}</span>
                  </div>
                </div>
              )}

              {/* 🎬 APERÇU VIDÉO DIRECT */}
              {post.type === 'VIDEO_AVEC_TEXTE' && (
                <div className="w-full h-full relative bg-black flex items-center justify-center">
                  <video src={post.mediaUrl} muted playsInline className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center text-cream text-lg z-10">▶</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex items-end z-10">
                    <span className="text-[8px] font-sans font-medium text-cream truncate w-full">🎬 Clip</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* =================================================================
          🔮 LE MODE PLEIN ÉCRAN IMMERSIF (STYLE STORIES AVEC TEXTE SCROLLABLE)
         ================================================================= */}
      {activePost && (
        <div 
          className="fixed inset-0 bg-black z-50 flex flex-col justify-between"
          onClick={() => setActivePost(null)} // Clique n'importe où en dehors du texte pour fermer
        >
          
          {/* BARRE SUPÉRIEURE DE NAVIGATION DISCRÈTE */}
          <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/70 to-transparent p-6 flex justify-between items-center z-50">
            <span className="font-mono text-[10px] tracking-widest text-cream/70 uppercase">
              {activePost.type === 'TEXTE_COURT' && '💭 Humeur'}
              {activePost.type === 'TEXTE_LONG' && '📖 Pensée'}
              {activePost.type === 'PHOTO_AVEC_TEXTE' && '📸 Instant'}
              {activePost.type === 'VIDEO_AVEC_TEXTE' && '🎬 Clip'}
            </span>
            <button 
              className="w-10 h-10 rounded-full bg-white/10 text-cream font-sans text-lg flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all active:scale-90"
              onClick={() => setActivePost(null)}
            >
              ✕
            </button>
          </div>

          {/* ⚡ ZONE DE RENDU IMMERSIF */}
          <div className="w-full h-full relative flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            
            {/* 💭 TEXTE COURT DE PLEIN ÉCRAN */}
            {activePost.type === 'TEXTE_COURT' && (
              <div className="w-full h-full bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] px-8 flex items-center justify-center text-center">
                <p className="font-display text-xl font-bold text-ink leading-relaxed px-4 select-text">
                  {activePost.textContent}
                </p>
              </div>
            )}

            {/* 📖 TEXTE LONG DE PLEIN ÉCRAN */}
            {activePost.type === 'TEXTE_LONG' && (
              <div className="w-full h-full px-6 pt-24 pb-12 overflow-y-auto scrollbar-none flex items-center justify-center text-center bg-ink">
                <p className="font-display text-lg leading-relaxed text-cream select-text whitespace-pre-wrap max-w-sm">
                  {activePost.textContent}
                </p>
              </div>
            )}

            {/* 📸 PHOTO PLEIN ÉCRAN TOTAL AVEC VOLET TEXTE SCROLLABLE */}
            {activePost.type === 'PHOTO_AVEC_TEXTE' && (
              <div className="w-full h-full relative bg-black flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activePost.mediaUrl} alt="Média" className="w-full h-full object-cover block" />
                
                {/* 🔒 VOLET COULISSANT TRANSPARENT (BOTTOM SHEET) */}
                {activePost.textContent && (
                  <div 
                    className="absolute bottom-0 inset-x-0 max-h-[40vh] overflow-y-auto bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-20 pb-8 px-6 text-left scrollbar-none"
                    onClick={(e) => e.stopPropagation()} // Permet de scroller le texte sans fermer l'écran
                  >
                    <p className="text-[13.5px] leading-relaxed text-cream/90 select-text max-w-sm mx-auto font-sans">
                      {activePost.textContent}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 🎬 VIDÉO EN REEL PLEIN ÉCRAN TOTAL AVEC VOLET TEXTE SCROLLABLE */}
            {activePost.type === 'VIDEO_AVEC_TEXTE' && (
              <div className="w-full h-full relative bg-black flex items-center justify-center">
                <video src={activePost.mediaUrl} controls autoPlay playsInline className="w-full h-full object-cover block" />
                
                {/* 🔒 VOLET COULISSANT TRANSPARENT (BOTTOM SHEET) */}
                {activePost.textContent && (
                  <div 
                    className="absolute bottom-0 inset-x-0 max-h-[35vh] overflow-y-auto bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-16 pb-12 px-6 text-left scrollbar-none z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-[13.5px] leading-relaxed text-cream/90 select-text max-w-sm mx-auto font-sans">
                      {activePost.textContent}
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
