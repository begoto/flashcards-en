import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  CheckCircle, XCircle, Clock, Trophy, Star,
  RefreshCw, Volume2, ArrowRight, Tag,
} from "lucide-react";
import { Button } from "../../components/base/Button";
import { Badge } from "../../components/base/Badge";
import { Modal } from "../../components/base/Modal";
import { useFlashcards } from "../../context/FlashcardsContext";
import { useAuth } from "../../context/AuthContext";
import { useAudio } from "../../hooks/useAudio";
import type { Flashcard, Level, QuizDirection } from "../../types";

// ─────────────────────────────────────────────────────────────
// Page Quiz QCM — dark mode ready
// ─────────────────────────────────────────────────────────────

const TIMER_SECONDS = 20;
const LEVELS: { key: Level; label: string }[] = [
  { key: "beginner",     label: "Débutant" },
  { key: "intermediate", label: "Intermédiaire" },
  { key: "advanced",     label: "Avancé" },
];

function getReward(pct: number): { type: "none"|"bronze"|"silver"|"gold"|"star"; label: string; color: string } {
  if (pct >= 95) return { type: "star",   label: "Étoile",  color: "#FFD700" };
  if (pct >= 80) return { type: "gold",   label: "Or",      color: "#FFD700" };
  if (pct >= 60) return { type: "silver", label: "Argent",  color: "#C0C0C0" };
  if (pct >= 40) return { type: "bronze", label: "Bronze",  color: "#CD7F32" };
  return { type: "none", label: "Continuez", color: "#6B7280" };
}

function buildOptions(card: Flashcard, dir: QuizDirection, wrongPool: string[]): string[] {
  const correct = dir === "fr-en" ? card.english : card.french;
  const pool    = wrongPool.filter((w) => w !== correct);
  const opts    = [correct, ...pool.slice(0, 3)];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

export default function QuizPage() {
  const { cardsByLevel, shuffle, getWrongOptions } = useFlashcards();
  const { addQuizScore } = useAuth();
  const { speak, isSupported } = useAudio();

  const [level,          setLevel]          = useState<Level>("beginner");
  const [direction,      setDirection]      = useState<QuizDirection>("fr-en");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [started,    setStarted]    = useState(false);
  const [cards,      setCards]      = useState<Flashcard[]>([]);
  const [idx,        setIdx]        = useState(0);
  const [options,    setOptions]    = useState<string[]>([]);
  const [selected,   setSelected]   = useState<string | null>(null);
  const [timeLeft,   setTimeLeft]   = useState(TIMER_SECONDS);
  const [score,      setScore]      = useState(0);
  const [answers,    setAnswers]    = useState<boolean[]>([]);
  const [done,       setDone]       = useState(false);
  const [showReward, setShowReward] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = cards[idx];

  const availableCategories = useMemo(() => {
    return Array.from(new Set(cardsByLevel(level).map((c) => c.category))).sort();
  }, [level, cardsByLevel]);

  useEffect(() => { setFilterCategory("all"); }, [level]);

  const availableCount = useMemo(() => {
    const levelCards = cardsByLevel(level);
    return filterCategory === "all"
      ? levelCards.length
      : levelCards.filter((c) => c.category === filterCategory).length;
  }, [level, filterCategory, cardsByLevel]);

  const prepareOptions = useCallback(
    (card: Flashcard) => {
      const wrongs = getWrongOptions(card, 3);
      setOptions(buildOptions(card, direction, wrongs));
    },
    [direction, getWrongOptions]
  );

  const startQuiz = () => {
    const levelCards = cardsByLevel(level);
    const filtered   = filterCategory === "all" ? levelCards : levelCards.filter((c) => c.category === filterCategory);
    const shuffled   = shuffle(filtered).slice(0, 15);
    setCards(shuffled);
    setIdx(0); setScore(0); setAnswers([]); setSelected(null);
    setDone(false); setStarted(true); setTimeLeft(TIMER_SECONDS);
    if (shuffled.length > 0) prepareOptions(shuffled[0]);
  };

  const nextQuestion = useCallback(
    (isCorrect: boolean) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setAnswers((prev) => [...prev, isCorrect]);
      if (isCorrect) setScore((s) => s + 1);
      if (idx + 1 >= cards.length) {
        setDone(true); setShowReward(true);
      } else {
        const nextIdx = idx + 1;
        setIdx(nextIdx); setSelected(null); setTimeLeft(TIMER_SECONDS);
        prepareOptions(cards[nextIdx]);
      }
    },
    [idx, cards, prepareOptions]
  );

  useEffect(() => {
    if (!started || done || selected !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { nextQuestion(false); return TIMER_SECONDS; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, done, selected, idx, nextQuestion]);

  const handleSelect = (opt: string) => {
    if (selected !== null) return;
    const correct   = direction === "fr-en" ? current.english : current.french;
    const isCorrect = opt === correct;
    setSelected(opt);
    if (timerRef.current) clearInterval(timerRef.current);
    if (isSupported) speak(current.english);
    setTimeout(() => nextQuestion(isCorrect), 1000);
  };

  const handleFinish = () => {
    const pct    = cards.length > 0 ? Math.round((score / cards.length) * 100) : 0;
    const reward = getReward(pct);
    addQuizScore({ date: new Date().toISOString(), score, total: cards.length, level, reward: reward.type });
    setShowReward(false); setStarted(false); setDone(false);
  };

  const pct    = cards.length > 0 ? Math.round((score / cards.length) * 100) : 0;
  const reward = getReward(pct);

  // ─── Écran de démarrage ───────────────────────────────────
  if (!started) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 pb-24 md:pb-10">
        <h1 className="text-2xl font-bold font-display text-neutral-ink dark:text-slate-100 mb-1">Quiz QCM</h1>
        <p className="text-sm text-neutral-muted dark:text-slate-400 mb-8">4 choix · 20 secondes par question · Récompenses</p>

        {/* Niveau */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-neutral-ink dark:text-slate-200 mb-2">Niveau</p>
          <div className="flex gap-2 flex-wrap">
            {LEVELS.map(({ key, label }) => (
              <button key={key} onClick={() => setLevel(key)}
                className={["px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap",
                  level === key
                    ? "bg-[#87CEEB] text-white"
                    : "bg-neutral-soft dark:bg-slate-700 text-neutral-muted dark:text-slate-300 hover:bg-[#C9E8F6]",
                ].join(" ")}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Direction */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-neutral-ink dark:text-slate-200 mb-2">Direction</p>
          <div className="flex gap-2 flex-wrap">
            {(["fr-en", "en-fr"] as QuizDirection[]).map((d) => (
              <button key={d} onClick={() => setDirection(d)}
                className={["px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap",
                  direction === d
                    ? "bg-[#5BAED6] text-white"
                    : "bg-neutral-soft dark:bg-slate-700 text-neutral-muted dark:text-slate-300 hover:bg-[#C9E8F6]",
                ].join(" ")}
              >{d === "fr-en" ? "Français → Anglais" : "Anglais → Français"}</button>
            ))}
          </div>
        </div>

        {/* Filtre catégorie */}
        <div className="mb-8">
          <div className="flex items-center gap-1.5 mb-2">
            <Tag size={13} className="text-neutral-muted dark:text-slate-400" />
            <p className="text-sm font-semibold text-neutral-ink dark:text-slate-200">Catégorie</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setFilterCategory("all")}
              className={[
                "px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border",
                filterCategory === "all"
                  ? "bg-neutral-ink dark:bg-slate-200 text-white dark:text-slate-900 border-neutral-ink dark:border-slate-200"
                  : "bg-white dark:bg-slate-800 text-neutral-muted dark:text-slate-400 border-neutral-line dark:border-slate-600 hover:border-neutral-ink hover:text-neutral-ink",
              ].join(" ")}
            >
              Toutes ({cardsByLevel(level).length})
            </button>
            {availableCategories.map((cat) => {
              const count = cardsByLevel(level).filter((c) => c.category === cat).length;
              return (
                <button key={cat} onClick={() => setFilterCategory(cat)}
                  className={[
                    "px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border",
                    filterCategory === cat
                      ? "bg-[#87CEEB] text-white border-[#87CEEB]"
                      : "bg-white dark:bg-slate-800 text-neutral-muted dark:text-slate-400 border-neutral-line dark:border-slate-600 hover:border-[#87CEEB] hover:text-[#1A7BAD]",
                  ].join(" ")}
                >
                  {cat} <span className={`text-[10px] ${filterCategory === cat ? "opacity-80" : "opacity-50"}`}>{count}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-neutral-muted dark:text-slate-400 mt-2">
            {availableCount} carte{availableCount > 1 ? "s" : ""} disponible{availableCount > 1 ? "s" : ""}
            {filterCategory !== "all" && <span className="text-[#5BAED6] font-semibold"> · {filterCategory}</span>}
            {" · "}quiz de {Math.min(15, availableCount)} questions
          </p>
        </div>

        <Button variant="primary" size="lg" onClick={startQuiz} disabled={availableCount === 0} className="gap-2">
          <ArrowRight size={18} /> Commencer le quiz
        </Button>

        <div className="mt-8 bg-yellow-50 dark:bg-amber-900/20 rounded-xl p-4 border border-yellow-200 dark:border-amber-700/40">
          <p className="text-sm font-bold text-yellow-800 dark:text-amber-400 mb-2 flex items-center gap-2">
            <Star size={16} fill="#FFD700" color="#FFD700" /> Système de récompenses
          </p>
          <div className="grid grid-cols-2 gap-1 text-xs text-yellow-700 dark:text-amber-300">
            <span>&ge;95% → Étoile d&apos;or</span>
            <span>&ge;80% → Médaille d&apos;or</span>
            <span>&ge;60% → Argent</span>
            <span>&ge;40% → Bronze</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── Écran de jeu ─────────────────────────────────────────
  if (!done && current) {
    const correctAnswer = direction === "fr-en" ? current.english : current.french;
    const question      = direction === "fr-en" ? current.french  : current.english;
    const timerPct      = (timeLeft / TIMER_SECONDS) * 100;
    const timerColor    = timeLeft <= 5 ? "#EF4444" : timeLeft <= 10 ? "#F97316" : "#22C55E";

    return (
      <div className="max-w-lg mx-auto px-4 py-6 pb-24 md:pb-8">
        {/* Progression + timer */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="sky">{idx + 1} / {cards.length}</Badge>
          {filterCategory !== "all" && (
            <span className="text-xs text-neutral-muted dark:text-slate-400 font-semibold px-2 py-0.5 bg-neutral-soft dark:bg-slate-700 rounded-full truncate max-w-[120px]">
              {filterCategory}
            </span>
          )}
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-neutral-muted dark:text-slate-400" />
            <span className="text-sm font-bold" style={{ color: timerColor }}>{timeLeft}s</span>
          </div>
        </div>
        <div className="w-full h-2 bg-neutral-soft dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${timerPct}%`, backgroundColor: timerColor }} />
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-[#C9E8F6] dark:border-sky-900/50 p-8 mb-6 text-center">
          <p className="text-xs text-neutral-muted dark:text-slate-400 mb-2 uppercase tracking-wider">
            {direction === "fr-en" ? "Quelle est la traduction en anglais ?" : "Quelle est la traduction en français ?"}
          </p>
          <h2 className="text-3xl font-bold font-display text-neutral-ink dark:text-slate-100">{question}</h2>
          {direction === "en-fr" && isSupported && (
            <button
              onClick={() => speak(current.english)}
              className="mt-3 w-9 h-9 flex items-center justify-center rounded-full bg-[#C9E8F6] dark:bg-sky-900/40 hover:bg-[#87CEEB] transition-colors mx-auto cursor-pointer"
            >
              <Volume2 size={16} className="text-[#1A7BAD] dark:text-sky-400" />
            </button>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {options.map((opt, i) => {
            let cls = "bg-white dark:bg-slate-800 border-2 border-neutral-line dark:border-slate-600 hover:border-[#87CEEB] hover:bg-[#E8F6FD] dark:hover:bg-sky-900/20";
            if (selected !== null) {
              if (opt === correctAnswer)       cls = "bg-green-50 dark:bg-green-900/20 border-2 border-[#22C55E]";
              else if (opt === selected)       cls = "bg-red-50 dark:bg-red-900/20 border-2 border-[#EF4444]";
              else                             cls = "bg-white dark:bg-slate-800 border-2 border-neutral-line dark:border-slate-700 opacity-50";
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={selected !== null}
                className={["w-full px-5 py-4 rounded-xl text-left text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-between", cls].join(" ")}
              >
                <span className="text-neutral-ink dark:text-slate-100">{opt}</span>
                {selected !== null && opt === correctAnswer  && <CheckCircle size={18} className="text-[#22C55E] shrink-0" />}
                {selected !== null && opt === selected && opt !== correctAnswer && <XCircle size={18} className="text-[#EF4444] shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Score en temps réel */}
        <div className="flex justify-center gap-6 mt-6 text-center">
          <div><p className="text-lg font-bold text-[#22C55E]">{score}</p><p className="text-xs text-neutral-muted dark:text-slate-400">Correct</p></div>
          <div><p className="text-lg font-bold text-[#EF4444]">{answers.filter((a) => !a).length}</p><p className="text-xs text-neutral-muted dark:text-slate-400">Faux</p></div>
        </div>
      </div>
    );
  }

  // ─── Modal Récompense ─────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <Modal isOpen={showReward} onClose={handleFinish} title="Quiz terminé !" maxWidth="sm">
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: `${reward.color}22` }}>
            {reward.type === "star" ? (
              <Star size={40} fill={reward.color} color={reward.color} />
            ) : reward.type !== "none" ? (
              <Trophy size={40} color={reward.color} />
            ) : (
              <RefreshCw size={40} className="text-neutral-muted" />
            )}
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold font-display text-neutral-ink dark:text-slate-100">{pct}%</p>
            <p className="text-sm text-neutral-muted dark:text-slate-400 mt-1">{score} / {cards.length} bonnes réponses</p>
            {filterCategory !== "all" && (
              <p className="text-xs text-[#5BAED6] font-semibold mt-1">{filterCategory}</p>
            )}
            {reward.type !== "none" && (
              <p className="text-sm font-bold mt-2" style={{ color: reward.color }}>
                Récompense : {reward.label} !
              </p>
            )}
          </div>
          <Button variant="primary" size="lg" onClick={handleFinish} className="mt-2">Continuer</Button>
        </div>
      </Modal>
    </div>
  );
}
