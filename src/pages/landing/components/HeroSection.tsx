import { Link } from "react-router-dom";
import { Flame, Trophy, BarChart2, X, Check } from "lucide-react";

const stats = [
  { value: "500+", label: "Cartes disponibles" },
  { value: "6", label: "Modes d'apprentissage" },
  { value: "20+", label: "Badges à débloquer" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-sky-50/50 to-slate-50 dark:from-slate-950 dark:via-sky-950/10 dark:to-slate-950 pt-16">
      {/* Ambient blobs */}
      <div className="absolute top-24 right-0 w-[600px] h-[600px] bg-sky-100/60 dark:bg-sky-900/10 rounded-full blur-3xl pointer-events-none -translate-x-1/4" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-sky-100/40 dark:bg-sky-950/20 rounded-full blur-3xl pointer-events-none translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left — Copy */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 rounded-full px-4 py-1.5 mb-7">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse inline-block" />
            <span className="text-sm text-sky-700 dark:text-sky-400 font-medium">
              100 % gratuit · aucune installation
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.08] tracking-tight">
            Maîtrisez{" "}
            <span className="text-sky-400">n&apos;importe quel</span>
            <br />
            sujet avec des flashcards
          </h1>

          <p className="mt-6 text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
            Étudiez intelligemment grâce aux flashcards, quiz, examens et à la
            révision espacée. Suivez votre progression, maintenez votre streak
            et débloquez des badges au fil de votre apprentissage.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/auth"
              className="text-center text-base font-semibold bg-sky-400 hover:bg-sky-500 text-white px-8 py-3.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
            >
              Commencer gratuitement →
            </Link>
            <a
              href="#features"
              className="text-center text-base font-medium border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 px-8 py-3.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
            >
              Voir les fonctionnalités
            </a>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap gap-10">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  {s.value}
                </div>
                <div className="text-sm text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Learner photo + floating UI cards */}
        <div className="hidden lg:flex items-center justify-center relative z-10">
          <div className="relative w-full max-w-md">

            {/* Learner photo */}
            <div className="w-full h-[420px] rounded-3xl overflow-hidden">
              <img
                src="https://readdy.ai/api/search-image?query=young happy woman student studying english with laptop and colorful flashcards at a clean modern white desk, bright natural window light, casual style, warm tones, focused smiling expression, professional lifestyle photography with shallow depth of field, minimalist background&width=600&height=420&seq=learner-hero-main-001&orientation=landscape"
                alt="Apprenante utilisant FlashCards EN"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Floating flashcard preview */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-widest text-sky-500">
                  Réponse
                </span>
                <span className="text-xs text-gray-400">12 / 30</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Système de stockage durable de l&apos;information avec une capacité quasi illimitée.
              </p>
              <div className="flex gap-3">
                <button className="flex-1 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-500 text-sm font-medium flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer">
                  <X size={14} /> À revoir
                </button>
                <button className="flex-1 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 text-sm font-medium flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer">
                  <Check size={14} /> Je sais !
                </button>
              </div>
            </div>

            {/* Floating streak card */}
            <div className="absolute -top-5 -right-6 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-4 flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Flame size={22} className="text-orange-500" />
              </div>
              <div>
                <div className="text-base font-bold text-gray-900 dark:text-white leading-none">
                  7 jours
                </div>
                <div className="text-xs text-gray-400 mt-1">de streak</div>
              </div>
            </div>

            {/* Floating badge card */}
            <div className="absolute top-8 -left-8 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-4 flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <Trophy size={20} className="text-amber-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                  Badge débloqué !
                </div>
                <div className="text-xs text-gray-400 mt-1">Examen parfait</div>
              </div>
            </div>

            {/* Floating score card */}
            <div className="absolute top-[45%] -right-10 -translate-y-1/2 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-3.5 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center">
                <BarChart2 size={18} className="text-sky-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">92%</div>
                <div className="text-xs text-gray-400">Quiz — Neuro</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
