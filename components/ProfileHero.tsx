'use client';

import { useRouter } from 'next/navigation';

interface ProfileHeroProps {
  mainPhoto: string;
}

export default function ProfileHero({ mainPhoto }: ProfileHeroProps) {
  const router = useRouter();

  return (
    <div
      className="h-[340px] relative flex-shrink-0"
      style={{
        backgroundImage: `linear-gradient(to top, var(--color-ink) 0%, rgba(21,14,27,0.2) 30%, rgba(21,14,27,0) 40%), url(${mainPhoto})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      <button
        onClick={() => router.back()}
        className="absolute top-[18px] left-[18px] w-8 h-8 rounded-full bg-ink/50 flex items-center justify-center text-cream cursor-pointer"
      >
        ←
      </button>
    </div>
  );
}
