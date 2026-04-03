import { useState } from "react";
import { Flame, BookOpen, Brain, Trophy, Zap, Star, TrendingUp } from "lucide-react";

type Tab = "flashcard" | "quiz" | "dashboard";

const TABS: { key: Tab; label: string; icon: string; desc: string }[] = [
  { key: "flashcard", label: "Flashcards",  icon: "ri-stack-line",      desc: "Étudiez à votre rythme, recto/verso avec retournement 3D" },
  { key: "quiz",      label: "Quiz QCM",    icon: "ri-question-line",   desc: "4 choix, timer intégré, récompenses étoile ou or" },
  { key: "dashboard", label: "Dashboard",   icon: "ri-dashboard-line",  desc: "Stats clés, maîtrise par catégorie, historique examen" },
];

function FlashcardMockup() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flex flex-col h-full bg-[#F8FAFB] p-5 gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center">
            <BookOpen size={14} className="text-sky-600" />
          </div>
          <span className="text-xs font-bold text-slate-700">Mode Étude</span>
        </div>
        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-1">
          <Flame size={11} className="text-orange-500" />
          <span className="text-[11px] font-bold text-orange-600">7 jours</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-slate-400">Carte 8 / 30</span>
        <span className="text-[11px] font-semibold text-sky-600">Avancé</span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-sky-400 rounded-full" style={{ width: "26%" }} />
      </div>

      {/* Card */}
      <div
        className="flex-1 flex flex-col items-center justify-center cursor-pointer"
        onClick={() => setFlipped((f) => !f)}
        title="Cliquez pour retourner la carte"
      >
        {!flipped ? (
          <div className="w-full bg-white rounded-2xl border border-slate-200 p-7 flex flex-col items-center gap-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-sky-500 bg-sky-50 px-2.5 py-1 rounded-full">
              Philosophie
            </span>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">Serendipity</p>
            <p className="text-xs text-slate-400">Cliquez pour voir la traduction</p>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={["w-1.5 h-5 rounded-full", i === 1 ? "bg-emerald-400" : "bg-slate-200"].join(" ")} />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full bg-white rounded-2xl border border-emerald-200 p-7 flex flex-col items-center gap-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">
              Traduction
            </span>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">Sérendipité</p>
            <p className="text-sm text-slate-500">Découverte heureuse faite par hasard</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Difficile", cls: "bg-rose-50 text-rose-600 border-rose-200" },
          { label: "À revoir",  cls: "bg-amber-50 text-amber-600 border-amber-200" },
          { label: "Je sais !",  cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        ].map(({ label, cls }) => (
          <button key={label} className={`py-2 rounded-xl border text-xs font-bold whitespace-nowrap cursor-pointer ${cls}`}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuizMockup() {
  const [selected, setSelected] = useState<number | null>(null);
  const correct = 2;
  const options = ["Sentiment de nostalgie", "Peur de l'avenir", "Sérendipité", "Mélancolie douce"];

  return (
    <div className="flex flex-col h-full bg-[#F8FAFB] p-5 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
            <Brain size={14} className="text-orange-600" />
          </div>
          <span className="text-xs font-bold text-slate-700">Quiz QCM</span>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
          <i className="ri-timer-line text-amber-500 text-xs" />
          <span className="text-[11px] font-bold text-amber-600">0:42</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-orange-400 rounded-full" style={{ width: "40%" }} />
        </div>
        <span className="text-[11px] text-slate-400">4/10</span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Question 4</p>
        <p className="text-sm font-bold text-slate-800 leading-snug">
          Quelle est la traduction française de <strong className="text-sky-600">&quot;Serendipity&quot;</strong> ?
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2 flex-1">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === correct;
          let cls = "border-slate-200 bg-white text-slate-700";
          if (isSelected) {
            cls = isCorrect
              ? "border-emerald-400 bg-emerald-50 text-emerald-700"
              : "border-rose-400 bg-rose-50 text-rose-600";
          } else if (selected !== null && isCorrect) {
            cls = "border-emerald-400 bg-emerald-50 text-emerald-700";
          }
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-semibold text-left cursor-pointer transition-all ${cls}`}
            >
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 ${isSelected && isCorrect ? "bg-emerald-400 border-emerald-400 text-white" : isSelected ? "bg-rose-400 border-rose-400 text-white" : "border-slate-300 text-slate-400"}`}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Score row */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-2.5">
        <div className="flex items-center gap-1">
          <Star size={13} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-slate-600">Score: 3/3</span>
        </div>
        <span className="text-[11px] text-slate-400">Débutant · 10 questions</span>
      </div>
    </div>
  );
}

function DashboardMockup() {
  const categories = [
    { label: "Émotions",   pct: 82, color: "bg-emerald-400" },
    { label: "Voyage",     pct: 64, color: "bg-amber-400" },
    { label: "Sciences",   pct: 31, color: "bg-rose-400" },
    { label: "Business",   pct: 91, color: "bg-emerald-400" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8FAFB] p-5 gap-4">
      {/* Greeting row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-slate-400">Mercredi 12 mars</p>
          <p className="text-sm font-extrabold text-slate-800">Bonjour, Marie !</p>
        </div>
        <div className="flex flex-col items-center bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
          <Flame size={16} className="text-orange-500" />
          <p className="text-base font-extrabold text-slate-800 leading-none mt-0.5">7</p>
          <p className="text-[9px] text-slate-400">jours</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Cartes", value: "124", icon: BookOpen,   color: "text-sky-500",     bg: "bg-sky-100"     },
          { label: "Meilleur", value: "94%", icon: Trophy,   color: "text-amber-500",   bg: "bg-amber-100"   },
          { label: "Moyen",  value: "78%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-100" },
          { label: "Badges", value: "5",   icon: Star,       color: "text-orange-500",  bg: "bg-orange-100"  },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 px-2.5 py-2.5 flex flex-col gap-1.5">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${bg}`}>
              <Icon size={12} className={color} />
            </div>
            <p className={`text-sm font-extrabold ${color}`}>{value}</p>
            <p className="text-[9px] text-slate-400 leading-none">{label}</p>
          </div>
        ))}
      </div>

      {/* Mastery */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-700">Maîtrise par catégorie</p>
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
            <Zap size={9} className="text-amber-500" />
            <span className="text-[10px] font-bold text-amber-600">Réviser</span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          {categories.map(({ label, pct, color }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-600">{label}</span>
                <span className="text-[11px] font-bold text-slate-400">{pct}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AppScreenshots() {
  const [active, setActive] = useState<Tab>("flashcard");

  const mockups: Record<Tab, React.ReactNode> = {
    flashcard: <FlashcardMockup />,
    quiz:      <QuizMockup />,
    dashboard: <DashboardMockup />,
  };

  const activeTab = TABS.find((t) => t.key === active)!;

  return (
    <section id="screenshots" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold text-sky-500 uppercase tracking-widest">
            Application en action
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3 tracking-tight">
            Découvrez chaque mode en détail
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-base leading-relaxed">
            Interactif, intuitif et conçu pour apprendre vite. Explorez les interfaces ci-dessous.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">

          {/* Left — Tab list + description */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={[
                  "flex items-start gap-4 p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200",
                  active === tab.key
                    ? "border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-950/40"
                    : "border-transparent hover:border-gray-200 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50",
                ].join(" ")}
              >
                <div className={[
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  active === tab.key
                    ? "bg-sky-100 dark:bg-sky-900/50"
                    : "bg-gray-100 dark:bg-slate-800",
                ].join(" ")}>
                  <i className={[
                    tab.icon, "text-lg",
                    active === tab.key ? "text-sky-600 dark:text-sky-400" : "text-gray-400 dark:text-slate-500",
                  ].join(" ")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={[
                    "text-sm font-bold leading-tight",
                    active === tab.key
                      ? "text-sky-700 dark:text-sky-300"
                      : "text-gray-700 dark:text-gray-300",
                  ].join(" ")}>
                    {tab.label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 leading-relaxed">
                    {tab.desc}
                  </p>
                </div>
                {active === tab.key && (
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-1.5" />
                )}
              </button>
            ))}

            {/* CTA */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
              <p className="text-xs text-gray-400 dark:text-slate-500 mb-3 leading-relaxed">
                Tout est interactif — essayez de cliquer dans le mockup !
              </p>
              <a
                href="/auth"
                className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
              >
                Commencer maintenant <i className="ri-arrow-right-line" />
              </a>
            </div>
          </div>

          {/* Right — Browser mockup */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">

              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-white dark:bg-slate-700 rounded-md px-3 py-1 flex items-center gap-2 max-w-[240px] mx-auto">
                    <i className="ri-lock-line text-gray-400 text-xs" />
                    <span className="text-[11px] text-gray-400 truncate">flashcards-en.app/{activeTab.key}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <i className="ri-refresh-line text-gray-400 text-sm" />
                </div>
              </div>

              {/* App content */}
              <div className="h-[480px] overflow-hidden transition-all duration-300">
                {mockups[active]}
              </div>
            </div>

            {/* Caption */}
            <p className="text-center text-xs text-gray-400 dark:text-slate-500 mt-3">
              <i className="ri-cursor-line mr-1" />
              Le mockup est interactif — cliquez sur les cartes et les options !
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
