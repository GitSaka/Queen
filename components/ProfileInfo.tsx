'use client';

import { lookingForLabels, smokingLabels, drinkingLabels, childrenLabels } from '@/lib/labels';
import { useState } from 'react';

interface ProfileInfoProps {
  profile: {
    firstName: string;
    age: number;
    city: string;
    distanceKm: number | null;
    isVerified: boolean;
    education: string | null;
    profession: string | null;
    tags: string[];
    lookingFor: string | null;
    smokingHabit: string | null;
    drinkingHabit: string | null;
    childrenStatus: string | null;
    religion: string | null;
    bio: string | null;
    prompts: { question: string; answer: string }[];
    isOpenToDirectMessages: boolean;
  };
  sendingDirect: boolean;
  onDirectMessage: () => void;
  onAction?: (liked: boolean, isSuperLike?: boolean) => void;
  isOwnProfile?: boolean;
}

export default function ProfileInfo({ profile, sendingDirect,onAction, onDirectMessage,isOwnProfile }: ProfileInfoProps) {

    const [isBioExpanded, setIsBioExpanded] = useState(false);


  return (
    <div className="px-[22px] -mt-[30px] relative z-[2]">
      {isOwnProfile && (
        <div className="inline-flex items-center gap-1.5 bg-emerald/90 text-cream text-[10px] font-mono uppercase tracking-wide px-3 py-1 rounded-full mb-3">
          ● Toi, connecté
        </div>
      )}
      <div className="flex items-baseline gap-2">
        <h1 className="font-display text-[28px] font-medium text-cream">{profile.firstName}, {profile.age}</h1>
        {profile.isVerified && (
          <span className="w-5 h-5 rounded-full bg-emerald flex items-center justify-center text-[11px]">✓</span>
        )}
      </div>
      <p className="text-[13px] text-muted mt-1 mb-3.5">
        {profile.city}{profile.distanceKm !== null ? ` · à ${profile.distanceKm} km` : ''}
      </p>

      {onAction && (
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => onAction(false)}
            className="w-11 h-11 rounded-full bg-card text-muted text-lg cursor-pointer hover:opacity-80 transition-opacity"
          >
            ✕
          </button>
          <button
            onClick={() => onAction(true, true)}
            className="w-10 h-10 rounded-full bg-emerald text-cream text-sm cursor-pointer hover:opacity-80 transition-opacity"
          >
            ★
          </button>
          <button
            onClick={() => onAction(true, false)}
            className="rounded-full font-semibold text-ink text-xl cursor-pointer bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] hover:opacity-90 active:scale-95 transition-all flex items-center justify-center"
            style={{ width: '52px', height: '52px' }}
          >
            ♥
          </button>
        </div>
      )}

      {(profile.education || profile.profession) && (
        <div className="flex gap-2.5 mb-4">
          {profile.education && (
            <div className="flex-1 bg-card rounded-2xl py-2.5 text-center">
              <p className="font-display text-sm text-amber">{profile.education}</p>
              <p className="text-[9px] uppercase tracking-wide text-muted">Niveau</p>
            </div>
          )}
          {profile.profession && (
            <div className="flex-1 bg-card rounded-2xl py-2.5 text-center">
              <p className="font-display text-sm text-amber">{profile.profession}</p>
              <p className="text-[9px] uppercase tracking-wide text-muted">Parcours</p>
            </div>
          )}
        </div>
      )}

      {profile.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {profile.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-cream">
              {tag}
            </span>
          ))}
        </div>
      )}

      {(profile.lookingFor || profile.smokingHabit || profile.drinkingHabit || profile.childrenStatus || profile.religion) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.lookingFor && (
            <span className="text-[11px] px-3 py-1.5 rounded-full bg-card border border-white/10 text-cream">
              🎯 {lookingForLabels[profile.lookingFor]}
            </span>
          )}
          {profile.smokingHabit && (
            <span className="text-[11px] px-3 py-1.5 rounded-full bg-card border border-white/10 text-cream">
              🚬 {smokingLabels[profile.smokingHabit]}
            </span>
          )}
          {profile.drinkingHabit && (
            <span className="text-[11px] px-3 py-1.5 rounded-full bg-card border border-white/10 text-cream">
              🍷 {drinkingLabels[profile.drinkingHabit]}
            </span>
          )}
          {profile.childrenStatus && (
            <span className="text-[11px] px-3 py-1.5 rounded-full bg-card border border-white/10 text-cream">
              👶 {childrenLabels[profile.childrenStatus]}
            </span>
          )}
          {profile.religion && (
            <span className="text-[11px] px-3 py-1.5 rounded-full bg-card border border-white/10 text-cream">
              🙏 {profile.religion}
            </span>
          )}
        </div>
      )}

      {profile.bio && (
        <div className="relative mb-6 select-none">
            {/* Conteneur de la Bio avec gestion de la hauteur dynamique */}
            <div 
            className={`text-[13px] leading-relaxed text-cream/90 transition-all duration-300 relative overflow-hidden ${
                isBioExpanded ? 'max-h-[1000px]' : 'max-h-[60px]'
            }`}
            >
            <p>{profile.bio}</p>

            {/* ✨ EFFET FLOU PREMIUM : S'affiche uniquement si la bio est longue et pas encore dépliée */}
            {!isBioExpanded && profile.bio.length > 150 && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-ink via-ink/40 to-transparent pointer-events-none" />
            )}
            </div>

            {/* Bouton Voir plus / Voir moins ultra-discret (S'affiche uniquement si le texte est long) */}
            {profile.bio.length > 120 && (
            <button
                onClick={() => setIsBioExpanded(!isBioExpanded)}
                className="mt-1.5 text-[8px] font-mono tracking-wider uppercase text-amber hover:text-coral transition-colors cursor-pointer"
            >
                {isBioExpanded ? '▲ Voir moins' : '▼ Voir plus'}
            </button>
            )}
        </div>
    )}


      {profile.prompts.length > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          {profile.prompts.map((p, i) => (
            <div key={i} className="bg-card rounded-2xl p-4">
              <p className="text-[11px] text-amber font-mono uppercase tracking-wide mb-1.5">
                {p.question}
              </p>
              <p className="text-[14px] text-cream leading-relaxed">{p.answer}</p>
            </div>
          ))}
        </div>
      )}

      {profile.isOpenToDirectMessages && (
        <button
          onClick={onDirectMessage}
          disabled={sendingDirect}
          className="w-full mb-3 py-3 rounded-full bg-white/10 border border-emerald/50 text-cream text-sm cursor-pointer hover:bg-white/20 transition-colors disabled:opacity-50"
        >
          {sendingDirect ? 'Ouverture...' : '✉ Écrire directement'}
        </button>
      )}
    </div>
  );
}
