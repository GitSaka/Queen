'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.');
        setLoading(false);
        return;
      }

      localStorage.setItem('lueur_token', data.token);
      localStorage.setItem('lueur_user', JSON.stringify(data.user));
      router.push('/discovery');
    } catch {
      setError('Impossible de contacter le serveur.');
      setLoading(false);
    }
  }

  const inputClass =
    'w-full bg-card text-cream placeholder-muted rounded-2xl px-5 py-3.5 text-sm outline-none border border-white/10 focus:border-coral transition-colors cursor-text';

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_20%,#3A2450_0%,var(--color-ink)_65%)] flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full p-1 bg-[conic-gradient(from_0deg,var(--color-coral),var(--color-amber),var(--color-coral))]">
          <div className="w-full h-full rounded-full bg-card-2 flex items-center justify-center text-2xl">
            ◐
          </div>
        </div>

        <h1 className="font-display text-3xl font-semibold text-cream mb-2 text-center">
          Content de te revoir
        </h1>
        <p className="text-muted text-sm text-center mb-8">
          Connecte-toi à Lu<span className="text-coral">eu</span>r
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <input
            type="text"
            name="identifier"
            placeholder="Email ou téléphone"
            value={form.identifier}
            onChange={handleChange}
            required
            className={inputClass}
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            required
            className={inputClass}
          />

          {error && (
            <p className="text-coral text-sm text-center bg-coral/10 border border-coral/30 rounded-xl py-2 px-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 py-4 rounded-full font-sans font-semibold text-ink bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-muted text-sm mt-6">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-coral cursor-pointer hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  );
}