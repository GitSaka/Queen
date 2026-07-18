import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_20%,#3A2450_0%,var(--color-ink)_65%)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <div className="w-32 h-32 rounded-full p-1 mb-10 animate-spin-slow bg-[conic-gradient(from_0deg,var(--color-coral),var(--color-amber),var(--color-coral))]">
          <div className="w-full h-full rounded-full bg-card-2 flex items-center justify-center">
            <span className="text-4xl">◐</span>
          </div>
        </div>

        <h1 className="font-display text-5xl font-semibold text-cream mb-3">
          Lu<span className="text-coral">eu</span>r
        </h1>

        <p className="text-muted text-sm leading-relaxed mb-10">
          La distance n&apos;a jamais éteint
          <br />
          une vraie connexion.
        </p>

        <Link
          href="/register"
          className="w-full py-4 rounded-full font-sans font-semibold text-ink mb-3 bg-[linear-gradient(135deg,var(--color-coral),var(--color-amber))] cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all text-center"
        >
          Créer mon compte
        </Link>

        <Link
          href="/login"
          className="w-full py-4 rounded-full font-sans text-cream border border-white/20 cursor-pointer hover:bg-white/5 transition-colors text-center"
        >
          J&apos;ai déjà un compte
        </Link>
      </div>
    </main>
  );
}