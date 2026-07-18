'use client';

import Link from 'next/link';

const steps = [
  { key: 'photo', label: 'Photos', href: '/profile/edit/photo' },
  { key: 'profile', label: 'Profil', href: '/profile/edit/profile' },
  { key: 'prompts', label: 'Prompts', href: '/profile/edit/prompts' },
];

export default function EditProgressBar({ current }: { current: 'photo' | 'profile' | 'prompts' }) {
  return (
    <div className="sticky top-0 z-30 bg-ink/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-sm mx-auto flex items-center justify-between px-5 h-[56px]">
        <div className="flex items-center gap-2">
          {steps.map((step) => (
            <Link
              key={step.key}
              href={step.href}
              className={`text-[11px] font-mono uppercase tracking-wide px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                current === step.key
                  ? 'bg-coral/15 text-coral border border-coral/40'
                  : 'text-muted border border-white/10 hover:text-cream'
              }`}
            >
              {step.label}
            </Link>
          ))}
        </div>

        <Link
          href="/profile/me"
          className="text-[12px] text-muted cursor-pointer hover:text-cream transition-colors"
        >
          Quitter
        </Link>
      </div>
    </div>
  );
}