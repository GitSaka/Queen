'use client';

interface InviteCardProps {
  show: boolean;
  firstName: string;
  restaurantName: string;
  inviteIntent: 'AMICAL' | 'SEXUEL';
  processing: boolean;
  onRespond: (status: 'ACCEPTE' | 'REFUSE') => void;
}

export default function InviteCard({
  show,
  firstName,
  restaurantName,
  inviteIntent,
  processing,
  onRespond,
}: InviteCardProps) {
  if (!show) return null;

  return (
    <div className="w-full bg-card border border-amber/30 rounded-3xl p-5 mb-4 text-center shadow-xl animate-fade-in select-none">
      <p className="text-2xl mb-2">📍</p>
      <h3 className="font-display text-base text-cream mb-1">
        Invitation Directe de {firstName}
      </h3>
      
      <div className="bg-ink/40 border border-white/5 rounded-2xl py-3 px-4 my-4 space-y-1">
        <p className="text-xs font-medium text-amber uppercase tracking-wider">
          {restaurantName}
        </p>
        <p className="text-[11px] text-muted">
          Type : {inviteIntent === 'SEXUEL' ? '⚡ Rencontre Directe' : '🤝 Rencontre Amicale'}
        </p>
      </div>

      <p className="text-[11px] text-muted leading-relaxed mb-5 px-2">
        Si tu acceptes, {firstName} devra régler le ticket pour débloquer définitivement la discussion.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onRespond('REFUSE')}
          disabled={processing}
          className="py-3 px-4 rounded-xl font-sans text-xs font-semibold text-muted bg-card border border-white/10 cursor-pointer hover:bg-card-2 disabled:opacity-50 transition-colors"
        >
          Refuser
        </button>
        <button
          onClick={() => onRespond('ACCEPTE')}
          disabled={processing}
          className="py-3 px-4 rounded-xl font-sans text-xs font-semibold text-ink bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] cursor-pointer hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          Accepter
        </button>
      </div>
    </div>
  );
}
