import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle, XCircle, SkipForward, RefreshCw,
  ChevronLeft, ChevronRight, Tag, AlertCircle, Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FlashCard3D } from "./components/FlashCard3D";
import { Button } from "../../components/base/Button";
import { useFlashcards } from "../../context/FlashcardsContext";
import { useAuth } from "../../context/AuthContext";
import { getAudioVolume } from "../../context/SettingsContext";
import type { Flashcard, Level } from "../../types";

// ─────────────────────────────────────────────────────────────
// Sons de réponse — Web Audio API · volume depuis SettingsContext
// ─────────────────────────────────────────────────────────────

function playCorrectSound() {
  const vol = getAudioVolume();
  if (vol === 0) return;
  try {
    const ctx = new AudioContext();
    const notes: [number, number][] = [[523.25, 0], [659.25, 0.12], [783.99, 0.24]];
    notes.forEach(([freq, delay]) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.value = freq;
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18 * vol, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  } catch (_e) { /* silencieux si AudioContext bloqué */ }
}

function playWrongSound() {
  const vol = getAudioVolume();
  if (vol === 0) return;
  try {
    const ctx = new AudioContext();
    const notes: [number, number][] = [[220, 0], [196, 0.18]];
    notes.forEach(([freq, delay]) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1 * vol, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  } catch (_e) { /* silencieux */ }
}

// ─────────────────────────────────────────────────────────────
// Page Mode Étude — dark mode + sons correct/wrong
// ─────────────────────────────────────────────────────────────

const LEVELS: { key: Level; label: string }[] = [
  { key: "beginner",     label: "Débutant" },
  { key: "intermediate", label: "Intermédiaire" },
  { key: "advanced",     label: "Avancé" },
];

export default function StudyPage() {
  const { cardsByLevel, shuffle, activeLevel, setActiveLevel } = useFlashcards();
  const { updateCardStats } = useAuth();

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [cards, setCards]     = useState<Flashcard[]>([]);
  const [index, setIndex]     = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong]     = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [done, setDone]       = useState(false);
  const [wrongCards, setWrongCards] = useState<Flashcard[]>([]);

  const availableCategories = useMemo(() => {
    return Array.from(new Set(cardsByLevel(activeLevel).map((c) => c.category))).sort();
  }, [activeLevel, cardsByLevel]);

  const loadCards = (cat: string = filterCategory) => {
    const levelCards = cardsByLevel(activeLevel);
    const filtered   = cat === "all" ? levelCards : levelCards.filter((c) => c.category === cat);
    setCards(shuffle(filtered));
    setIndex(0); setCorrect(0); setWrong(0); setSkipped(0);
    setWrongCards([]); setDone(false);
  };

  useEffect(() => { setFilterCategory("all"); loadCards("all"); /* eslint-disable-next-line */ }, [activeLevel]);

  const handleCategoryChange = (cat: string) => { setFilterCategory(cat); loadCards(cat); };

  const current  = cards[index];
  const total    = cards.length;
  const progress = total > 0 ? (index / total) * 100 : 0;

  const next = () => { if (index + 1 >= total) setDone(true); else setIndex((i) => i + 1); };

  const handleCorrect = () => {
    playCorrectSound();
    updateCardStats([{ cardId: current.id, correct: true }]);
    setCorrect((c) => c + 1);
    next();
  };

  const handleWrong = () => {
    playWrongSound();
    updateCardStats([{ cardId: current.id, correct: false }]);
    setWrong((w) => w + 1);
    setWrongCards((prev) => [...prev, current]);
    next();
  };

  const handleSkip = () => { setSkipped((s) => s + 1); next(); };

  const reviewWrongCards = () => {
    setCards(shuffle([...wrongCards]));
    setIndex(0); setCorrect(0); setWrong(0); setSkipped(0); setWrongCards([]); setDone(false);
  };

  // ─── Écran de résultats ────────────────────────────────────
  if (done) {
    const pct     = total > 0 ? Math.round((correct / total) * 100) : 0;
    const allGood = wrongCards.length === 0;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-4 py-8 max-w-lg mx-auto">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${allGood ? "bg-green-100 dark:bg-green-900/30" : "bg-red-50 dark:bg-red-900/20"}`}>
          {allGood
            ? <CheckCircle size={40} className="text-[#22C55E]" />
            : <AlertCircle size={40} className="text-[#EF4444]" />}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold font-display text-neutral-ink dark:text-slate-100">
            {allGood ? "Session parfaite !" : "Session terminée !"}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
            <span className="text-xs bg-[#C9E8F6] dark:bg-sky-900/40 text-[#1A7BAD] dark:text-sky-400 font-semibold px-2.5 py-1 rounded-full">
              {LEVELS.find((l) => l.key === activeLevel)?.label}
            </span>
            {filterCategory !== "all" && (
              <span className="text-xs bg-neutral-soft dark:bg-slate-700 text-neutral-muted dark:text-slate-300 font-semibold px-2.5 py-1 rounded-full">
                {filterCategory}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-6 text-center">
          <div><p className="text-2xl font-bold text-[#22C55E]">{correct}</p><p className="text-xs text-neutral-muted dark:text-slate-400">Correct</p></div>
          <div><p className="text-2xl font-bold text-[#EF4444]">{wrong}</p><p className="text-xs text-neutral-muted dark:text-slate-400">Faux</p></div>
          <div><p className="text-2xl font-bold text-neutral-muted dark:text-slate-400">{skipped}</p><p className="text-xs text-neutral-muted dark:text-slate-400">Passé</p></div>
        </div>
        <div className="text-4xl font-bold font-display text-[#5BAED6]">{pct}%</div>

        {wrongCards.length > 0 && (
          <div className="w-full bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800/40 p-4">
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={16} className="text-[#EF4444]" />
              <p className="text-sm font-bold text-[#EF4444]">
                {wrongCards.length} carte{wrongCards.length > 1 ? "s" : ""} à retravailler
              </p>
            </div>
            <div className="space-y-1.5 max-h-44 overflow-y-auto scrollbar-hide pr-1">
              {wrongCards.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 border border-red-100 dark:border-red-800/30">
                  <span className="text-sm font-semibold text-neutral-ink dark:text-slate-200 truncate">{c.english}</span>
                  <span className="text-xs text-neutral-muted dark:text-slate-400 shrink-0">{c.french}</span>
                </div>
              ))}
            </div>
            <button
              onClick={reviewWrongCards}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#EF4444] hover:bg-red-600 text-white text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <RefreshCw size={15} /> Réviser ces erreurs maintenant
            </button>
          </div>
        )}

        <Button variant="primary" size="lg" onClick={() => loadCards(filterCategory)} className="gap-2">
          <RefreshCw size={16} /> {allGood ? "Recommencer" : "Recommencer depuis le début"}
        </Button>
      </div>
    );
  }

  // ─── Rendu principal ──────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-8">

      {/* En-tête */}
      <div className="flex items-start justify-between mb-5 gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-neutral-ink dark:text-slate-100">Mode Étude</h1>
          <p className="text-sm text-neutral-muted dark:text-slate-400 mt-0.5">
            {total > 0 ? `${index + 1} / ${total} cartes` : "Aucune carte"}
            {filterCategory !== "all" && (
              <span className="ml-1.5 text-[#5BAED6] font-semibold">— {filterCategory}</span>
            )}
          </p>
        </div>
        <Link
          to="/smart-review"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-400 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors whitespace-nowrap shrink-0"
        >
          <Zap size={13} /> Révision Intelligente
        </Link>
      </div>

      {/* Sélecteur de niveau */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {LEVELS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveLevel(key)}
            className={[
              "px-4 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer whitespace-nowrap",
              activeLevel === key
                ? "bg-[#87CEEB] text-white"
                : "bg-neutral-soft dark:bg-slate-700 text-neutral-muted dark:text-slate-300 hover:bg-[#C9E8F6] dark:hover:bg-slate-600",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filtre catégorie */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 mb-2">
          <Tag size={12} className="text-neutral-muted dark:text-slate-400" />
          <span className="text-xs font-semibold text-neutral-muted dark:text-slate-400 uppercase tracking-wide">Catégorie</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleCategoryChange("all")}
            className={[
              "px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border",
              filterCategory === "all"
                ? "bg-neutral-ink dark:bg-slate-200 text-white dark:text-slate-900 border-neutral-ink dark:border-slate-200"
                : "bg-white dark:bg-slate-800 text-neutral-muted dark:text-slate-400 border-neutral-line dark:border-slate-600 hover:border-neutral-ink dark:hover:border-slate-400 hover:text-neutral-ink dark:hover:text-slate-200",
            ].join(" ")}
          >
            Toutes ({cardsByLevel(activeLevel).length})
          </button>
          {availableCategories.map((cat) => {
            const count = cardsByLevel(activeLevel).filter((c) => c.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
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
      </div>

      {/* Barre de progression */}
      <div className="w-full h-2 bg-neutral-soft dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-[#87CEEB] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* État vide */}
      {total === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <Tag size={32} className="text-neutral-muted dark:text-slate-500 opacity-40" />
          <p className="text-sm font-semibold text-neutral-ink dark:text-slate-300">Aucune carte dans cette catégorie</p>
          <button
            onClick={() => handleCategoryChange("all")}
            className="text-sm text-[#5BAED6] font-semibold hover:underline cursor-pointer"
          >
            Voir toutes les catégories
          </button>
        </div>
      )}

      {/* Carte 3D */}
      {current && <FlashCard3D key={current.id} card={current} />}

      {/* Boutons évaluation */}
      {total > 0 && (
        <>
          <div className="flex gap-3 mt-8 justify-center flex-wrap">
            <Button variant="wrong"   size="md" onClick={handleWrong}   className="gap-2 flex-1 max-w-[140px]">
              <XCircle size={18} /> Faux
            </Button>
            <Button variant="ghost"   size="md" onClick={handleSkip}    className="gap-2 flex-1 max-w-[140px] border border-neutral-line dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
              <SkipForward size={18} /> Passer
            </Button>
            <Button variant="correct" size="md" onClick={handleCorrect} className="gap-2 flex-1 max-w-[140px]">
              <CheckCircle size={18} /> Correct
            </Button>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => index > 0 && setIndex((i) => i - 1)}
              disabled={index === 0}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-soft dark:bg-slate-700 text-neutral-muted dark:text-slate-400 disabled:opacity-30 hover:bg-[#C9E8F6] dark:hover:bg-slate-600 transition-colors cursor-pointer"
              aria-label="Carte précédente"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => index < total - 1 && setIndex((i) => i + 1)}
              disabled={index === total - 1}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-soft dark:bg-slate-700 text-neutral-muted dark:text-slate-400 disabled:opacity-30 hover:bg-[#C9E8F6] dark:hover:bg-slate-600 transition-colors cursor-pointer"
              aria-label="Carte suivante"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
