'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EditProgressBar from '@/components/EditProgressBar';

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ bio: '', profession: '', education: '', lookingFor: '' });
  const [savedField, setSavedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  async function handleBlurSave(fieldName: string) {
    const token = localStorage.getItem('lueur_token');
    const value = form[fieldName as keyof typeof form];

    await fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ [fieldName]: value }),
    });

    setSavedField(fieldName);
    setTimeout(() => setSavedField(null), 1500);
  }

  const inputClass =
    'w-full bg-card text-cream placeholder-muted rounded-2xl px-5 py-3.5 text-sm outline-none border border-white/10 focus:border-coral transition-colors cursor-text';

  const labelClass = 'text-[12px] text-cream font-medium mb-1.5 block px-1';

  if (loading) {
    return (
      <>
        <EditProgressBar current="profile" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted">Chargement...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <EditProgressBar current="profile" />
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <h1 className="font-display text-2xl font-semibold text-cream mb-2 text-center">
          Ton profil
        </h1>
        <p className="text-muted text-sm text-center mb-8">
          Chaque champ est enregistré automatiquement.
        </p>

        <div className="flex flex-col gap-5 max-w-sm mx-auto">
          <div>
            <label className={labelClass}>Ta présentation</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              onBlur={() => handleBlurSave('bio')}
              placeholder="Parle un peu de toi : tes passions, ce que tu aimes faire..."
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
            <label className={labelClass}>Ta profession</label>
            <input
              type="text"
              name="profession"
              value={form.profession}
              onChange={handleChange}
              onBlur={() => handleBlurSave('profession')}
              placeholder="Ex : Étudiante en gestion, Développeur web..."
              className={inputClass}
            />
            {savedField === 'profession' && (
              <span className="text-[10px] text-emerald px-1">✓ Enregistré</span>
            )}
          </div>

          <div>
            <label className={labelClass}>Ton niveau d&apos;études / parcours</label>
            <input
              type="text"
              name="education"
              value={form.education}
              onChange={handleChange}
              onBlur={() => handleBlurSave('education')}
              placeholder="Ex : Licence, Master, BTS..."
              className={inputClass}
            />
            {savedField === 'education' && (
              <span className="text-[10px] text-emerald px-1">✓ Enregistré</span>
            )}
          </div>

          <div>
            <label className={labelClass}>Ce que tu recherches</label>
            <select
              name="lookingFor"
              value={form.lookingFor}
              onChange={(e) => {
                handleChange(e);
                setTimeout(() => handleBlurSave('lookingFor'), 0);
              }}
              className={`${inputClass} cursor-pointer appearance-none`}
            >
              <option value="">Sélectionne une option (optionnel)</option>
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
      </div>
    </>
  );
}