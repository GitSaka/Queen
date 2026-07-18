'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileHero from '@/components/ProfileHero';
import ProfileInfo from '@/components/ProfileInfo';
import Link from 'next/link';

type MyProfile = {
  id: string;
  firstName: string;
  email: string | null;
  age: number;
  city: string;
  bio: string | null;
  profession: string | null;
  education: string | null;
  lookingFor: string | null;
  smokingHabit: string | null;
  drinkingHabit: string | null;
  childrenStatus: string | null;
  religion: string | null;
  isVerified: boolean;
  isOpenToDirectMessages: boolean;
  distanceKm: number | null;
  photos: string[];
  tags: string[];
  prompts: { question: string; answer: string }[];
};

export default function MyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const token = localStorage.getItem('lueur_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      if (!ignore) {
        setProfile(data);
        setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('lueur_token');
    localStorage.removeItem('lueur_user');
    router.push('/login');
  }

  if (loading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted">Chargement de ton profil...</p>
      </div>
    );
  }

  const mainPhoto = profile.photos[0] || '/images.jpeg';

  return (
    <div className="flex-1 overflow-y-auto">
      <ProfileHero mainPhoto={mainPhoto} />

      

      <ProfileInfo
        profile={profile}
        sendingDirect={false}
        onDirectMessage={() => {}}
         isOwnProfile
      />

      <div className="px-[22px] pb-8 flex flex-col gap-3">
        <Link
          href="/profile/edit/photo"
          className="block text-center w-full py-3.5 rounded-full font-semibold text-ink text-sm cursor-pointer bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))]"
        >
          Modifier mon profil
        </Link>

        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-full text-cream text-sm border border-white/15 cursor-pointer hover:bg-white/5 transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}