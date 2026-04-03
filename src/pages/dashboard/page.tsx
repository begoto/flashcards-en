import { useMemo, useState } from "react";
import {
  BookOpen, Brain, ClipboardCheck, CalendarCheck,
  Zap, Flame, Trophy, Star, TrendingUp,
  ChevronRight, Target, Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFlashcards } from "../../context/FlashcardsContext";
import { BadgesSection } from "./components/BadgesSection";
import { LeaderboardSection } from "./components/LeaderboardSection";
import type { Level } from "../../types";

const LEVEL_LABELS: Record<Level, string> = {
  beginner: "Débutant", intermediate: "Intermédiaire", advanced: "Avancé",
};

const QUICK_ACTIONS = [
  {
    label: "Étudier",
    sub: "Flashcards recto/verso",
    path: "/study",
    icon: BookOpen,
    gradient: "from-sky-400 to-sky-600",
    shadowColor: "shadow-sky-200 dark:shadow-sky-900/40",
  },
  {
    label: "Quiz",
    sub: "QCM avec timer",
    path: "/quiz",
    icon: Brain,
    gradient: "from-orange-400 to-rose-500",
    shadowColor: "shadow-orange-200 dark:shadow-orange-900/40",
  },
  {
    label: "Examen",
    sub: "Test complet chronométré",
    path: "/exam",
    icon: ClipboardCheck,
    gradient: "from-emerald-400 to-teal-600",
    shadowColor: "shadow-emerald-200 dark:shadow-emerald-900/40",
  },
  {
    label: "Défi du jour",
    sub: "5 cartes quotidiennes",
    path: "/daily-challenge",
    icon: CalendarCheck,
    gradient: "from-amber-400 to-orange-500",
    shadowColor: "shadow-amber-200 dark:shadow-amber-900/40",
  },
];

// ── Circular ring progress ──
function RingProgress({ value, size = 120, stroke = 9, color = "#34d399" }: {
  value: number; size?: number; stroke?: number; color?: string;
}) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke}
        className="text-neutral-100 dark:text-slate-800" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.7s ease" }} />
    </svg>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { cardsByLevel } = useFlashcards();

  const examScores   = user?.examScores  ?? [];
  const quizScores   = user?.quizScores  ?? [];
  const cardStatsArr = user?.cardStats   ?? [];
  const streak       = user?.streak      ?? 0;
  const badges       = user?.badges      ?? [];

  const [progressLevel, setProgressLevel] = useState<Level>("beginner");

  // KPIs
  const totalCardsStudied = cardStatsArr.reduce((a, s) => a + s.correct + s.wrong, 0);
  const bestScore = examScores.length ? Math.max(...examScores.map((s) => Math.round((s.score / s.total) * 100))) : 0;
  const avgScore  = examScores.length ? Math.round(examScores.reduce((a, s) => a + (s.score / s.total) * 100, 0) / examScores.length) : 0;

  // Category mastery
  const categoryMastery = useMemo(() => {
    const statMap    = new Map(cardStatsArr.map((s) => [s.cardId, s]));
    const levelCards = cardsByLevel(progressLevel);
    const categories = Array.from(new Set(levelCards.map((c) => c.category))).sort();
    return categories.map((cat) => {
      const catCards = levelCards.filter((c) => c.category === cat);
      let totalCorrect = 0, totalWrong = 0, studied = 0;
      catCards.forEach((card) => {
        const stat = statMap.get(card.id);
        if (stat && (stat.correct + stat.wrong) > 0) {
          totalCorrect += stat.correct; totalWrong += stat.wrong; studied++;
        }
      });
      const attempts = totalCorrect + totalWrong;
      const mastery  = attempts > 0 ? Math.round((totalCorrect / attempts) * 100) : 0;
      return { category: cat, mastery, studied, total: catCards.length };
    }).sort((a, b) => a.mastery - b.mastery);
  }, [cardStatsArr, progressLevel, cardsByLevel]);

  const globalMastery = useMemo(() => {
    const studied = categoryMastery.filter((c) => c.studied > 0);
    if (!studied.length) return null;
    return Math.round(studied.reduce((a, c) => a + c.mastery, 0) / studied.length);
  }, [categoryMastery]);

  const getMasteryBarColor = (m: number, studied: number) => {
    if (studied === 0) return "bg-neutral-200 dark:bg-slate-700";
    if (m >= 70) return "bg-emerald-400";
    if (m >= 40) return "bg-amber-400";
    return "bg-rose-400";
  };

  const getMasteryTextColor = (m: number, s: number) => {
    if (s === 0) return "text-neutral-400 dark:text-slate-500";
    if (m >= 70) return "text-emerald-600 dark:text-emerald-400";
    if (m >= 40) return "text-amber-600 dark:text-amber-400";
    return "text-rose-500 dark:text-rose-400";
  };

  const ringColor = globalMastery === null ? "#cbd5e1"
    : globalMastery >= 70 ? "#34d399"
    : globalMastery >= 40 ? "#fbbf24"
    : "#f87171";

  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 pb-28 md:pb-12 space-y-6">

        {/* ── 1. Welcome Hero + Streak ── */}
        <div className="flex flex-col sm:flex-row gap-4">

          {/* Welcome — dark gradient card */}
          <div className="flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-7 min-h-[160px]">
            {/* Blobs */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-amber-500/8 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full gap-3">
              <p className="text-slate-400 text-xs font-semibold capitalize">
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              <div>
                <h1 className="text-2xl font-extrabold text-white leading-tight">
                  Bonjour, {user?.name?.split(" ")[0] ?? "Apprenant"} !
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  {totalCardsStudied === 0
                    ? "Prêt à commencer votre apprentissage ?"
                    : `${totalCardsStudied} carte${totalCardsStudied > 1 ? "s" : ""} étudiées au total`}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-auto">
                <Link
                  to="/study"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold transition-all whitespace-nowrap cursor-pointer"
                >
                  <BookOpen size={14} /> Continuer à étudier
                </Link>
                <Link
                  to="/smart-review"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold transition-all whitespace-nowrap cursor-pointer"
                >
                  <Zap size={12} /> Révision rapide
                </Link>
              </div>
            </div>
          </div>

          {/* Streak — orange gradient card */}
          <div className={[
            "sm:w-52 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-1 relative overflow-hidden",
            streak >= 3
              ? "bg-gradient-to-br from-orange-400 to-amber-500"
              : "bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800",
          ].join(" ")}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full" />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className={["w-14 h-14 rounded-2xl flex items-center justify-center", streak >= 3 ? "bg-white/20" : "bg-white/30 dark:bg-slate-600"].join(" ")}>
                <Flame size={28} className={streak >= 3 ? "text-white" : "text-slate-400 dark:text-slate-400"} />
              </div>
              <p className={["text-4xl font-black leading-none mt-1", streak >= 3 ? "text-white" : "text-slate-500 dark:text-slate-300"].join(" ")}>
                {streak}
              </p>
              <p className={["text-xs font-semibold", streak >= 3 ? "text-white/80" : "text-slate-400"].join(" ")}>
                jour{streak > 1 ? "s" : ""} de suite
              </p>
              <div className="flex gap-1 mt-2">
                {[3, 7, 14, 30].map((t) => (
                  <div key={t} title={`${t} jours`}
                    className={["w-1.5 h-5 rounded-full transition-all",
                      streak >= t
                        ? streak >= 3 ? "bg-white/70" : "bg-amber-300"
                        : streak >= 3 ? "bg-white/20" : "bg-slate-300 dark:bg-slate-600",
                    ].join(" ")} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Quick Actions — gradient course cards ── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
            Que veux-tu faire ?
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map(({ label, sub, path, icon: Icon, gradient, shadowColor }) => (
              <Link
                key={path}
                to={path}
                className={[
                  "group relative flex flex-col gap-4 p-5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br",
                  gradient, shadowColor,
                ].join(" ")}
              >
                {/* BG circle deco */}
                <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-white/10 rounded-full" />
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-white/5 rounded-full" />

                <div className="relative z-10 flex flex-col gap-3 h-full">
                  <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white leading-tight">{label}</p>
                    <p className="text-xs text-white/70 mt-0.5">{sub}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-white/80 group-hover:text-white transition-colors">
                    Commencer <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 3. KPI Stats ── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
            Mes statistiques
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Cartes étudiées", value: totalCardsStudied,               icon: BookOpen,   topColor: "bg-sky-400",     valColor: "text-sky-600 dark:text-sky-400"     },
              { label: "Meilleur score",  value: examScores.length ? `${bestScore}%` : "—", icon: Trophy,    topColor: "bg-amber-400",   valColor: "text-amber-600 dark:text-amber-400"   },
              { label: "Score moyen",     value: examScores.length ? `${avgScore}%` : "—",  icon: TrendingUp, topColor: "bg-emerald-400", valColor: "text-emerald-600 dark:text-emerald-400" },
              { label: "Badges",          value: badges.length,                    icon: Star,       topColor: "bg-orange-400",  valColor: "text-orange-600 dark:text-orange-400"  },
            ].map(({ label, value, icon: Icon, topColor, valColor }) => (
              <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                <div className={["h-1 w-full", topColor].join(" ")} />
                <div className="p-5">
                  <Icon size={18} className={valColor} />
                  <p className={["text-2xl font-extrabold mt-3 mb-0.5", valColor].join(" ")}>{value}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Mastery (with ring) + Exam/Quiz ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Mastery (3/5) */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Maîtrise par catégorie</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Basée sur vos sessions d'étude</p>
              </div>
              <Link to="/smart-review" className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-700/40 hover:bg-amber-100 transition-colors whitespace-nowrap">
                <Zap size={10} /> Réviser
              </Link>
            </div>

            <div className="p-6 flex gap-6">
              {/* Circular ring */}
              <div className="shrink-0 flex flex-col items-center justify-center gap-2">
                <div className="relative">
                  <RingProgress value={globalMastery ?? 0} size={110} stroke={9} color={ringColor} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={["text-xl font-extrabold leading-none", globalMastery === null ? "text-slate-300 dark:text-slate-600" : getMasteryTextColor(globalMastery, 1)].join(" ")}>
                      {globalMastery !== null ? `${globalMastery}%` : "—"}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">global</span>
                  </div>
                </div>
                {/* Level tabs */}
                <div className="flex flex-col gap-1">
                  {(["beginner", "intermediate", "advanced"] as Level[]).map((lv) => (
                    <button key={lv} onClick={() => setProgressLevel(lv)}
                      className={[
                        "px-3 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer whitespace-nowrap",
                        progressLevel === lv
                          ? "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400"
                          : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800",
                      ].join(" ")}>
                      {lv === "beginner" ? "Débutant" : lv === "intermediate" ? "Intermédiaire" : "Avancé"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bars */}
              <div className="flex-1 min-w-0 space-y-3.5 overflow-y-auto max-h-64">
                {categoryMastery.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Target size={28} className="text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">Commencez à étudier !</p>
                  </div>
                ) : (
                  categoryMastery.map(({ category, mastery, studied, total }) => (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{category}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">{studied}/{total}</span>
                          <span className={["text-[11px] font-bold w-8 text-right", getMasteryTextColor(mastery, studied)].join(" ")}>
                            {studied === 0 ? "—" : `${mastery}%`}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={["h-full rounded-full transition-all duration-500", getMasteryBarColor(mastery, studied)].join(" ")}
                          style={{ width: studied === 0 ? "0%" : `${mastery}%` }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="px-6 pb-4 flex items-center gap-4">
              {[{ cls: "bg-emerald-400", label: "Maîtrisé ≥70%" }, { cls: "bg-amber-400", label: "En progrès" }, { cls: "bg-rose-400", label: "À retravailler" }]
                .map(({ cls, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={["w-2 h-2 rounded-full", cls].join(" ")} />
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{label}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Right col (2/5) */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Exam scores */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden flex-1">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Award size={14} className="text-slate-400" />
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Derniers examens</h2>
              </div>
              {examScores.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">Aucun examen encore</p>
                  <Link to="/exam" className="text-xs text-sky-600 dark:text-sky-400 font-bold mt-1 inline-block hover:underline">
                    Passer un examen →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {examScores.slice(0, 5).map((s) => {
                    const p = Math.round((s.score / s.total) * 100);
                    return (
                      <div key={s.id} className="px-5 py-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{s.score}/{s.total} correctes</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">
                            {new Date(s.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                            {" · "}{LEVEL_LABELS[s.level as Level] ?? s.level}
                          </p>
                        </div>
                        <span className={[
                          "text-xs font-extrabold px-2 py-0.5 rounded-full",
                          p >= 80 ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                            : p >= 50 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                              : "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
                        ].join(" ")}>{p}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quiz stats */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Brain size={14} className="text-orange-500" /> Résultats Quiz
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Complétés", value: quizScores.length },
                  { label: "Étoiles",   value: quizScores.filter((s) => s.reward === "star").length },
                  { label: "Médailles", value: quizScores.filter((s) => s.reward === "gold").length },
                  {
                    label: "Moy. quiz",
                    value: quizScores.length
                      ? `${Math.round(quizScores.reduce((a, s) => a + (s.score / s.total) * 100, 0) / quizScores.length)}%`
                      : "—",
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 dark:bg-slate-800/60 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400 dark:text-slate-400">{label}</span>
                    <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. Leaderboard ── */}
        <LeaderboardSection currentUserId={user?.id} />

        {/* ── 6. Badges ── */}
        <BadgesSection badges={badges} />

        <div className="flex justify-end">
          <Link to="/profile" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Profil complet <ChevronRight size={13} />
          </Link>
        </div>

      </div>
    </div>
  );
}
