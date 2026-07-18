'use client';

import { useState } from 'react';
import Link from 'next/link';

const slides = [
  {
    icon: '◐',
    title: 'Vois au-delà de ta ville',
    text: "Découvre des profils près de chez toi, ou bien plus loin — la distance s'affiche toujours clairement.",
  },
  {
    icon: '✓',
    title: 'Des profils vérifiés',
    text: 'Chaque compte passe par une vérification pour limiter les faux profils et les arnaques.',
  },
  {
    icon: '🔒',
    title: 'Conversations privées et sûres',
    text: 'Une fois le match confirmé, discute en privé. Les captures d’écran sont bloquées pour ta tranquillité.',
  },
  {
    icon: '♥',
    title: 'Un match, une vraie rencontre',
    text: 'Pas de messages non désirés : vous devez vous aimer mutuellement avant de pouvoir discuter.',
  },
];

export default function IntroPage() {
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;
  const slide = slides[index];

  function next() {
    if (isLast) return;
    setIndex((i) => i + 1);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_20%,#3A2450_0%,var(--color-ink)_65%)] flex flex-col items-center justify-between px-6 py-14">
      {/* Bouton passer, en haut à droite */}
      <div className="w-full max-w-sm flex justify-end">
        <Link
          href="/register"
          className="text-muted text-sm cursor-pointer hover:text-cream transition-colors"
        >
          Passer
        </Link>
      </div>

      {/* Contenu du slide actuel */}
      <div className="w-full max-w-sm flex flex-col items-center text-center flex-1 justify-center">
        <div className="w-24 h-24 rounded-full p-1 mb-8 bg-[conic-gradient(from_0deg,var(--color-coral),var(--color-amber),var(--color-coral))]">
          <div className="w-full h-full rounded-full bg-card-2 flex items-center justify-center text-4xl">
            {slide.icon}
          </div>
        </div>

        <h1 className="font-display text-2xl font-semibold text-cream mb-3">
          {slide.title}
        </h1>
        <p className="text-muted text-sm leading-relaxed">{slide.text}</p>
      </div>

      {/* Points de progression */}
      <div className="flex gap-2 mb-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full cursor-pointer transition-all ${
              i === index ? 'w-6 bg-coral' : 'w-2 bg-white/20'
            }`}
            aria-label={`Aller à l'étape ${i + 1}`}
          />
        ))}
      </div>

      {/* Bouton d'action */}
      <div className="w-full max-w-sm">
        {isLast ? (
          <Link
            href="/register"
            className="block w-full py-4 rounded-full font-sans font-semibold text-ink text-center bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Créer mon compte
          </Link>
        ) : (
          <button
            onClick={next}
            className="w-full py-4 rounded-full font-sans font-semibold text-ink bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Suivant
          </button>
        )}
      </div>
    </main>
  );
}