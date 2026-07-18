'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TabBar() {
  const pathname = usePathname();

  // 💡 PRÊT POUR LA BASE DE DONNÉES : 
  // Cet état stocke le nombre de notifications non lues.
  // Au début il est à 0, mais il changera dès que les infos viendront du serveur.
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);

  // SIMULATION / PRÉPARATION BACKEND :
  // Ce useEffect est l'endroit exact où nous connecterons l'appel API ou Pusher plus tard.
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const token = localStorage.getItem('lueur_token');
        if (!token) return;

        // Exemple d'appel vers votre future API :
        // const res = await fetch('/api/notifications/unread-count', { headers: { Authorization: `Bearer ${token}` } });
        // const data = await res.json();
        // setUnreadNotificationsCount(data.count);

        // Pour vos tests visuels actuels, vous pouvez remplacer 0 par 3 pour voir le badge s'allumer :
        setUnreadNotificationsCount(3); 
      } catch (err) {
        console.error("Erreur lors de la récupération des notifications:", err);
      }
    }

    fetchNotifications();
  }, [pathname]); // Se re-déclenche si l'utilisateur change de page

  const tabs = [
    { 
      href: '/discovery', 
      label: 'Découverte',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1-1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      href: '/likes-received', 
      label: 'Qui m’a liké',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    { 
      href: '/matches', 
      label: 'Conversations',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    { 
      href: '/notifications', 
      label: 'Notifications',
      // ✨ NOUVELLE ICÔNE : Cloche de notification (Style Facebook)
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      // Drapeau pour indiquer que cet onglet possède un badge dynamique
      hasBadge: true 
    },
    { 
      href: '/profile/me', 
      label: 'Profil',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 01-8 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-ink border-t border-white/5 z-40 pb-[env(safe-area-inset-bottom)] select-none">
      <div className="max-w-sm mx-auto flex justify-around items-center py-3">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname?.startsWith(tab.href + '/');
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative cursor-pointer transition-colors p-2 ${
                isActive ? 'text-coral' : 'text-muted hover:text-cream'
              }`}
              aria-label={tab.label}
            >
              {tab.icon}

              {/* 🔴 LE BADGE ADAPTATIF : 
                  Il s'affiche uniquement si l'onglet est configuré pour avoir un badge (hasBadge)
                  ET si le compteur venant de la base de données est supérieur à 0 */}
              {tab.hasBadge && unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-coral text-ink font-sans font-bold text-[9px] flex items-center justify-center rounded-full px-1 border border-ink animate-fade-in">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
