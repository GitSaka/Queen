'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    bio: '',
    profession: '',
    education: '',
    lookingFor: '',
  });
  const [savedField, setSavedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Pré-remplit avec ce qui existe déjà (utile si l'utilisateur revient plus tard)
  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('lueur_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setForm({
          bio: data.bio || '',
          profession: data.profession || '',
          education: data.education || '',
          lookingFor: data.lookingFor || '',
        });
      }
      setLoading(false);
    }

    load();
  }, [router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Sauvegarde silencieusement dès qu'on quitte un champ
  async function handleBlurSave(fieldName: string) {
    const token = localStorage.getItem('lueur_token');
    const value = form[fieldName as keyof typeof form];

    await fetch('/api/users/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ [fieldName]: value }),
    });

    setSavedField(fieldName);
    setTimeout(() => setSavedField(null), 1500);
  }

  function handleContinue() {
    router.push('/onboarding/prompts');
  }

  const inputClass =
    'w-full bg-card text-cream placeholder-muted rounded-2xl px-5 py-3.5 text-sm outline-none border border-white/10 focus:border-coral transition-colors cursor-text';

  if (loading) {
    return (
      <main className="min-h-screen bg-ink flex items-center justify-center">
        <p className="text-muted">Chargement...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_20%,#3A2450_0%,var(--color-ink)_65%)] flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-sm sm:max-w-md">
        <h1 className="font-display text-3xl font-semibold text-cream mb-2 text-center">
          Parle-nous un peu de toi
        </h1>
        <p className="text-muted text-sm text-center mb-8">
          Rien n&apos;est obligatoire — tu peux compléter ça plus tard aussi.
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              onBlur={() => handleBlurSave('bio')}
              placeholder="Parle un peu de toi... (500 caractères max)"
              maxLength={500}
              rows={4}
              className={`${inputClass} resize-none`}
            />
            <div className="flex justify-between mt-1 px-1">
              <span className="text-[10px] text-emerald">
                {savedField === 'bio' ? '✓ Enregistré' : '\u00A0'}
              </span>
              <span className="text-[10px] text-muted">{form.bio.length}/500</span>
            </div>
          </div>

          <div>
            <input
              type="text"
              name="profession"
              value={form.profession}
              onChange={handleChange}
              onBlur={() => handleBlurSave('profession')}
              placeholder="Ta profession / activité"
              className={inputClass}
            />
            {savedField === 'profession' && (
              <span className="text-[10px] text-emerald px-1">✓ Enregistré</span>
            )}
          </div>

          <div>
            <input
              type="text"
              name="education"
              value={form.education}
              onChange={handleChange}
              onBlur={() => handleBlurSave('education')}
              placeholder="Ton niveau d'études / parcours"
              className={inputClass}
            />
            {savedField === 'education' && (
              <span className="text-[10px] text-emerald px-1">✓ Enregistré</span>
            )}
          </div>

          <div>
            <select
              name="lookingFor"
              value={form.lookingFor}
              onChange={(e) => {
                handleChange(e);
                setTimeout(() => handleBlurSave('lookingFor'), 0);
              }}
              className={`${inputClass} cursor-pointer appearance-none`}
            >
              <option value="">Ce que tu recherches (optionnel)</option>
              <option value="RELATION_SERIEUSE">Relation sérieuse</option>
              <option value="RENCONTRE_CASUAL">Rencontre casual</option>
              <option value="AMITIE">Amitié</option>
              <option value="PAS_SUR_ENCORE">Pas encore sûr(e)</option>
            </select>
            {savedField === 'lookingFor' && (
              <span className="text-[10px] text-emerald px-1">✓ Enregistré</span>
            )}
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-full mt-8 py-4 rounded-full font-sans font-semibold text-ink bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Continuer
        </button>
      </div>
    </main>
  );
}