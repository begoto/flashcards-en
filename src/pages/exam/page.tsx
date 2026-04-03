import { useState, useEffect, useRef, useCallback } from "react";
import { Clock, CheckCircle, XCircle, Trophy, RefreshCw, Volume2 } from "lucide-react";
import { Button } from "../../components/base/Button";
import { Badge } from "../../components/base/Badge";
import { useFlashcards } from "../../context/FlashcardsContext";
import { useAuth } from "../../context/AuthContext";
import { useAudio } from "../../hooks/useAudio";
import type { Flashcard, Level } from "../../types";

// ─────────────────────────────────────────────────────────────
// Page Examen — dark mode ready
// ─────────────────────────────────────────────────────────────

const EXAM_DURATION = 120;

const LEVELS: { key: Level; label: string }[] = [
  { key: "beginner",     label: "Débutant" },
  { key: "intermediate", label: "Intermédiaire" },
  { key: "advanced",     label: "Avancé" },
];

function buildOptions(card: Flashcard, wrongPool: string[]): string[] {
  const correct = card.french;
  const pool = wrongPool.filter((w) => w !== correct).slice(0, 3);
  const opts = [correct, ...pool];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

export default function ExamPage() {
  const { cardsByLevel, shuffle, getWrongOptions } = useFlashcards();
  const { addExamScore } = useAuth();
  const { speak, isSupported } = useAudio();

  const [level,    setLevel]    = useState<Level>("beginner");
  const [started,  setStarted]  = useState(false);
  const [cards,    setCards]    = useState<Flashcard[]>([]);
  const [idx,      setIdx]      = useState(0);
  const [options,  setOptions]  = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [score,    setScore]    = useState(0);
  const [done,     setDone]     = useState(false);
  const [results,  setResults]  = useState<boolean[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = cards[idx];

  const prepOptions = useCallback((card: Flashcard) => {
    setOptions(buildOptions(card, getWrongOptions(card, 3)));
  }, [getWrongOptions]);

  const startExam = () => {
    const shuffled = shuffle(cardsByLevel(level));
    setCards(shuffled);
    setIdx(0); setScore(0); setResults([]);
    setSelected(null); setTimeLeft(EXAM_DURATION);
    setDone(false); setStarted(true);
    if (shuffled.length > 0) prepOptions(shuffled[0]);
  };

  // Timer
  useEffect(() => {
    if (!started || done) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setDone(true);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, done]);

  // Sauvegarde quand done=true
  useEffect(() => {
    if (done && started && cards.length > 0) {
      addExamScore({
        date: new Date().toISOString(),
        score,
        total: cards.length,
        level,
        durationSeconds: EXAM_DURATION - timeLeft,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const handleSelect = (opt: string) => {
    if (selected !== null) return;
    const isCorrect = opt === current.french;
    if (isSupported) speak(current.english);
    setSelected(opt);
    const newScore   = isCorrect ? score + 1 : score;
    const newResults = [...results, isCorrect];
    if (isCorrect) setScore(newScore);
    setResults(newResults);
    setTimeout(() => {
      if (idx + 1 >= cards.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setDone(true);
      } else {
        setIdx((i) => i + 1);
        setSelected(null);
        prepOptions(cards[idx + 1]);
      }
    }, 800);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const pct        = cards.length > 0 ? Math.round((score / cards.length) * 100) : 0;
  const timerColor = timeLeft <= 20 ? "#EF4444" : timeLeft <= 45 ? "#F97316" : "#22C55E";

  // ─── Écran départ ────────────────────────────────────────
  if (!started) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 pb-24 md:pb-10">
        <h1 className="text-2xl font-bold font-display text-neutral-ink dark:text-slate-100 mb-1">Mode Examen</h1>
        <p className="text-sm text-neutral-muted dark:text-slate-400 mb-8">Toutes les cartes · Chrono 2 minutes · Score sauvegardé</p>

        <div className="mb-8">
          <p className="text-sm font-semibold text-neutral-ink dark:text-slate-200 mb-2">Choisir un niveau</p>
          <div className="flex gap-2 flex-wrap">
            {LEVELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setLevel(key)}
                className={[
                  "px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap",
                  level === key
                    ? "bg-[#87CEEB] text-white"
                    : "bg-neutral-soft dark:bg-slate-700 text-neutral-muted dark:text-slate-300 hover:bg-[#C9E8F6]",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/40 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-orange-600 dark:text-orange-400" />
            <p className="text-sm font-bold text-orange-800 dark:text-orange-300">Règles de l&apos;examen</p>
          </div>
          <ul className="text-xs text-orange-700 dark:text-orange-400 space-y-1 list-disc list-inside">
            <li>2 minutes pour répondre à un maximum de questions</li>
            <li>4 choix de réponse par question</li>
            <li>Le chrono continue même si vous changez de page</li>
            <li>Votre score est sauvegardé automatiquement</li>
          </ul>
        </div>

        <Button variant="primary" size="lg" onClick={startExam} className="gap-2">
          <Trophy size={18} /> Démarrer l&apos;examen
        </Button>
      </div>
    );
  }

  // ─── Résultats ───────────────────────────────────────────
  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 pb-24 flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-[#C9E8F6] dark:bg-sky-900/40 flex items-center justify-center">
          <Trophy size={40} className="text-[#5BAED6]" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold font-display text-neutral-ink dark:text-slate-100">Examen terminé !</h2>
          <p className="text-neutral-muted dark:text-slate-400 mt-1">Score sauvegardé dans votre historique</p>
        </div>
        <div className="flex gap-8 text-center">
          <div><p className="text-3xl font-bold text-[#22C55E]">{score}</p><p className="text-xs text-neutral-muted dark:text-slate-400">Correct</p></div>
          <div><p className="text-3xl font-bold text-[#5BAED6]">{pct}%</p><p className="text-xs text-neutral-muted dark:text-slate-400">Score</p></div>
          <div><p className="text-3xl font-bold text-[#EF4444]">{results.filter((r) => !r).length}</p><p className="text-xs text-neutral-muted dark:text-slate-400">Faux</p></div>
        </div>
        <Button variant="primary" size="lg" onClick={() => { setStarted(false); setDone(false); }} className="gap-2">
          <RefreshCw size={16} /> Nouvel examen
        </Button>
      </div>
    );
  }

  // ─── Écran de jeu ────────────────────────────────────────
  if (!current) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="sky">{idx + 1} / {cards.length}</Badge>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 font-mono text-sm font-bold"
          style={{ borderColor: timerColor, color: timerColor }}
        >
          <Clock size={14} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="w-full h-1.5 bg-neutral-soft dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(timeLeft / EXAM_DURATION) * 100}%`, backgroundColor: timerColor }} />
      </div>

      {/* Carte question */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-[#C9E8F6] dark:border-sky-900/50 p-8 mb-6 text-center">
        <p className="text-xs text-neutral-muted dark:text-slate-400 mb-2 uppercase tracking-wider">Quelle est la traduction ?</p>
        <h2 className="text-3xl font-bold font-display text-neutral-ink dark:text-slate-100">{current.english}</h2>
        <p className="text-base text-neutral-muted dark:text-slate-400 mt-1 font-mono">{current.phonetic}</p>
        {isSupported && (
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
            if (opt === current.french)  cls = "bg-green-50 dark:bg-green-900/20 border-2 border-[#22C55E]";
            else if (opt === selected)   cls = "bg-red-50 dark:bg-red-900/20 border-2 border-[#EF4444]";
            else                         cls = "bg-white dark:bg-slate-800 border-2 border-neutral-line dark:border-slate-700 opacity-50";
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={selected !== null}
              className={["w-full px-5 py-4 rounded-xl text-left text-sm font-semibold transition-all duration-150 cursor-pointer flex items-center justify-between", cls].join(" ")}
            >
              <span className="text-neutral-ink dark:text-slate-100">{opt}</span>
              {selected !== null && opt === current.french  && <CheckCircle size={18} className="text-[#22C55E] shrink-0" />}
              {selected !== null && opt === selected && opt !== current.french && <XCircle size={18} className="text-[#EF4444] shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
