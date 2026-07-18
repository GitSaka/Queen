"use client";

import { useState } from "react";

export default function GlobalHeader() {
  const [isPremiumMode, setIsPremiumMode] = useState(false);

  return (
    /* L'astuce magique : "absolute top-0 left-0" permet au header de flotter 
       au-dessus de la page sans modifier sa taille ni créer de défilement parasite */
    <header className="absolute top-0 left-0 z-50 w-full flex items-center justify-between select-none bg-ink/95 backdrop-blur-md border-b border-white/5 h-14">
      
      {/* GAUCHE : Texte Gratuit */}
      <div className="flex items-center pl-4">
        <span className="font-sans text-xs tracking-wide uppercase text-muted-val font-medium">
          Gratuit
        </span>
      </div>

      {/* DROITE : Bouton Premium */}
      <div className="flex items-center pr-4">
        <button
          onClick={() => setIsPremiumMode(!isPremiumMode)}
          className={`font-sans text-xs font-semibold tracking-wide transition-all cursor-pointer active:scale-95 ${
            isPremiumMode
              ? "text-coral"
              : "text-amber"
          }`}
        >
          {isPremiumMode ? "★ Premium" : "Premium"}
        </button>
      </div>

    </header>
  );
}
