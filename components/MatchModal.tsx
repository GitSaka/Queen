'use client';

import Link from 'next/link';

interface MatchModalProps {
  matchName: string | null;
  onClose: () => void;
}

export default function MatchModal({ matchName, onClose }: MatchModalProps) {
  if (!matchName) return null;

  return (
    <div
      className="fixed inset-0 bg-ink/90 flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <div className="text-center" onClick={(e) => e.stopPropagation()}>
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="font-display text-3xl text-cream mb-2">C&apos;est un match !</h2>
        <p className="text-muted mb-6">Toi et {matchName} vous êtes plu mutuellement.</p>
        <Link
          href="/matches"
          className="inline-block py-3 px-8 rounded-full font-semibold text-ink cursor-pointer bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))]"
        >
          Voir mes matchs
        </Link>
      </div>
    </div>
  );
}
