'use client';

import Link from 'next/link';

type OtherUser = {
  firstName: string;
  photoUrl: string | null;
  isOnline: boolean;
};

interface ChatHeaderProps {
  otherUser: OtherUser | null;
}

export default function ChatHeader({ otherUser }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5 flex-shrink-0 select-none">
      <Link
        href="/matches"
        className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-lg cursor-pointer flex-shrink-0 hover:bg-card-2 transition-colors"
      >
        ←
      </Link>

      <div className="w-12 h-12 rounded-full bg-card-2 border-2 border-coral overflow-hidden flex items-center justify-center text-cream font-display text-lg flex-shrink-0">
        {otherUser?.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={otherUser.photoUrl} alt={otherUser.firstName} className="w-full h-full object-cover" />
        ) : (
          otherUser?.firstName?.[0] || '?'
        )}
      </div>

      <div className="min-w-0">
        <p className="font-display text-cream text-lg truncate">
          {otherUser?.firstName || 'Chargement...'}
        </p>
        {otherUser?.isOnline && (
          <p className="text-xs text-emerald flex items-center gap-1">● en ligne</p>
        )}
      </div>
    </div>
  );
}
