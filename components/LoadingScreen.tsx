'use client';

interface LoadingScreenProps {
  message?: string;
  isCompact?: boolean; // Si vrai, s'intègre discrètement dans une carte sans prendre tout l'écran
}

export default function LoadingScreen({ message = "Connexion sécurisée...", isCompact = false }: LoadingScreenProps) {
  return (
    <div 
      className={`relative flex flex-col items-center justify-center select-none bg-ink transition-all duration-300 ${
        isCompact ? 'w-full h-48 rounded-2xl' : 'fixed inset-0 z-50'
      }`}
    >
      {/* 🔮 EFFET LUMIÈRE DIFFUSE (Pulsation organique haut de gamme en arrière-plan) */}
      {!isCompact && (
        <div className="absolute w-72 h-72 rounded-full bg-coral/15 blur-[100px] animate-pulse pointer-events-none" />
      )}

      {/* 🌀 LE SPINNER LOGO PREMIUM (Inspiré de votre écran d'accueil avec dégradé conique) */}
      <div className="relative w-16 h-16 mb-6">
        {/* Anneau lumineux rotatif */}
        <div className="absolute inset-0 rounded-full p-[2px] animate-spin-slow bg-[conic-gradient(from_0deg,var(--color-coral),var(--color-amber),var(--color-coral))] shadow-[0_0_20px_rgba(255,84,104,0.2)]">
          {/* Centre sombre pour créer l'effet d'anneau */}
          <div className="w-full h-full rounded-full bg-ink" />
        </div>
        
        {/* Symbole mystérieux central immobile */}
        <div className="absolute inset-0 flex items-center justify-center text-cream/40 font-display text-xl">
          ◐
        </div>
      </div>

      {/* 📝 TEXTE ACCOMPAGNATEUR SÉCURISÉ */}
      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-amber/80 text-center px-6 animate-pulse">
        {message}
      </p>
    </div>
  );
}
