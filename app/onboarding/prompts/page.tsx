'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Prompt = { id: string; question: string };
type Answer = { promptId: string; answer: string };

const MAX_SELECTED = 3;
const MAX_ANSWER_LENGTH = 150;

export default function OnboardingPromptsPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [savedPromptId, setSavedPromptId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('lueur_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const [promptsRes, answersRes] = await Promise.all([
        fetch('/api/prompts', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/users/me/prompts', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const promptsData = await promptsRes.json();
      const answersData = await answersRes.json();

      setPrompts(promptsData.prompts || []);

      const existingAnswers: Record<string, string> = {};
      (answersData.answers || []).forEach((a: { promptId: string; answer: string }) => {
        existingAnswers[a.promptId] = a.answer;
      });
      setAnswers(existingAnswers);
      setExpandedIds(new Set(Object.keys(existingAnswers)));
      setLoading(false);
    }

    load();
  }, [router]);

  const selectedIds = Object.keys(answers).filter((id) => answers[id]?.trim());

function toggleSelect(promptId: string) {
    if (answers[promptId] !== undefined) {
      // Déjà sélectionné : on plie/déplie juste visuellement, rien n'est supprimé
      setExpandedIds((prev) => {
        const updated = new Set(prev);
        if (updated.has(promptId)) {
          updated.delete(promptId);
        } else {
          updated.add(promptId);
        }
        return updated;
      });
      return;
    }

    if (selectedIds.length >= MAX_SELECTED) return;
    setAnswers({ ...answers, [promptId]: '' });
    setExpandedIds((prev) => new Set(prev).add(promptId));
  }

  function handleRemove(promptId: string) {
    const updated = { ...answers };
    delete updated[promptId];
    setAnswers(updated);

    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(promptId);
      return next;
    });

    const token = localStorage.getItem('lueur_token');
    fetch('/api/users/me/prompts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ promptId }),
    });
  }

  function handleAnswerChange(promptId: string, value: string) {
    setAnswers({ ...answers, [promptId]: value.slice(0, MAX_ANSWER_LENGTH) });
  }

  async function handleAnswerSave(promptId: string) {
    const answer = answers[promptId];
    if (!answer || !answer.trim()) return;

    const token = localStorage.getItem('lueur_token');
    const order = selectedIds.indexOf(promptId);

    await fetch('/api/users/me/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ promptId, answer, order }),
    });

    setSavedPromptId(promptId);
    setTimeout(() => setSavedPromptId(null), 1500);
  }

  function handleContinue() {
    router.push('/discovery');
  }

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
          Fais-toi remarquer
        </h1>
        <p className="text-muted text-sm text-center mb-8">
          Choisis jusqu&apos;à {MAX_SELECTED} questions et réponds avec tes mots (optionnel).
        </p>

        <div className="flex flex-col gap-3">
          {prompts.map((prompt) => {
            const isSelected = answers[prompt.id] !== undefined;
            return (
              <div key={prompt.id}>
                <button
                  type="button"
                  onClick={() => toggleSelect(prompt.id)}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl border cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-coral/10 border-coral text-cream'
                      : 'bg-card border-white/10 text-cream hover:border-white/20'
                  }`}
                >
                  <span className="text-sm font-display">{prompt.question}</span>
                </button>

                {isSelected && expandedIds.has(prompt.id) && (
                  <div className="mt-2 px-1">
                    <textarea
                      value={answers[prompt.id]}
                      onChange={(e) => handleAnswerChange(prompt.id, e.target.value)}
                      onBlur={() => handleAnswerSave(prompt.id)}
                      placeholder="Ta réponse..."
                      rows={2}
                      className="w-full bg-card text-cream placeholder-muted rounded-2xl px-4 py-3 text-sm outline-none border border-white/10 focus:border-coral resize-none cursor-text"
                    />
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] text-emerald">
                        {savedPromptId === prompt.id ? '✓ Enregistré' : '\u00A0'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted">
                          {answers[prompt.id].length}/{MAX_ANSWER_LENGTH}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemove(prompt.id)}
                          className="text-[10px] text-coral cursor-pointer hover:underline"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleContinue}
          className="w-full mt-8 py-4 rounded-full font-sans font-semibold text-ink bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Terminer et découvrir l&apos;app
        </button>
      </div>
    </main>
  );
}