import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle, XCircle, SkipForward, RefreshCw,
  ChevronLeft, ChevronRight, Zap, TrendingDown, ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FlashCard3D } from "../study/components/FlashCard3D";
import { Button } from "../../components/base/Button";
import { useFlashcards } from "../../context/FlashcardsContext";
import { useAuth } from "../../context/AuthContext";
import type { Flashcard, Level } from "../../types";

// ─────────────────────────────────────────────────────────────
// Page Révision Intelligente — Présente en priorité les cartes
// les plus souvent ratées, basé sur l'historique personnel.
// Affiche un indicateur de difficulté par carte.
// ─────────────────────────────────────────────────────────────

const LEVELS: { key: Level | "all"; label: string }[] = [
  { key: "all",          label: "Tous niveaux" },
  { key: "beginner",     label: "Débutant" },
  { key: "intermediate", label: "Intermédiaire" },
  { key: "advanced",     label: "Avancé" },
];

/** Retourne le label et la couleur de difficulté selon le taux d'échec */
function getDifficultyInfo(failRate: number, seen: boolean) {
  if (!seen) return { label: "Nouveau",    bg: "bg-[#C9E8F6] dark:bg-sky-900/30",        text: "text-[#1A7BAD] dark:text-sky-400",  bar: "#87CEEB" };
  if (failRate >= 0.65) return { label: "Difficile",   bg: "bg-red-100 dark:bg-red-900/30",         text: "text-[#EF4444] dark:text-red-400",   bar: "#EF4444" };
  if (failRate >= 0.35) return { label: "À revoir",    bg: "bg-amber-100 dark:bg-amber-900/30",      text: "text-amber-700 dark:text-amber-400",  bar: "#F59E0B" };
  return { label: "En progrès",  bg: "bg-green-100 dark:bg-green-900/30",      text: "text-[#22C55E] dark:text-green-400",  bar: "#22C55E" };
}

export default function SmartReviewPage() {
  const { getSmartReviewCards, getCardStat, shuffle } = useFlashcards();
  const { updateCardStats } = useAuth();

  const [selectedLevel, setSelectedLevel] = useState<Level | "all">("all");
  const [cards, setCards]     = useState<Flashcard[]>([]);
  const [index, setIndex]     = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong]     = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [done, setDone]       = useState(false);
  /** Snapshot des stats AVANT la session (pour calculer les améliorations) */
  const [initialStats] = useState(() => new Map<string, { wrong: number; total: number }>());

  /** Charge les cartes selon le niveau sélectionné */
  const loadCards = (level: Level | "all" = selectedLevel) => {
    const raw = level === "all"
      ? getSmartReviewCards(undefined, 25)
      : getSmartReviewCards(level, 25);
    setCards(raw);
    setIndex(0); setCorrect(0); setWrong(0); setSkipped(0); setDone(false);
    // Sauvegarde les stats initiales pour mesurer les progrès en fin de session
    raw.forEach((card) => {
      const stat = getCardStat(card.id);
      initialStats.set(card.id, { wrong: stat.failRate >= 0 ? Math.round(stat.failRate * stat.total) : 0, total: stat.total });
    });
  };

  useEffect(() => { loadCards(); /* eslint-disable-next-line */ }, []);

  const current = cards[index];
  const total   = cards.length;
  const progress = total > 0 ? (index / total) * 100 : 0;
  const currentStat = current ? getCardStat(current.id) : null;
  const diffInfo    = currentStat ? getDifficultyInfo(currentStat.failRate, currentStat.seen) : null;

  const next = () => { if (index + 1 >= total) setDone(true); else setIndex((i) => i + 1); };

  const handleCorrect = () => { updateCardStats([{ cardId: current.id, correct: true }]);  setCorrect((c) => c + 1); next(); };
  const handleWrong   = () => { updateCardStats([{ cardId: current.id, correct: false }]); setWrong((w)   => w + 1); next(); };
  const handleSkip    = () => { setSkipped((s) => s + 1); next(); };

  const handleLevelChange = (level: Level | "all") => {
    setSelectedLevel(level);
    loadCards(level);
  };

  // ─── Écran de résultats ───────────────────────────────────
  if (done) {
    const pct  = total > 0 ? Math.round((correct / total) * 100) : 0;
    const improved = cards.filter((c) => {
      const stat    = getCardStat(c.id);
      const initial = initialStats.get(c.id);
      if (!initial || initial.total === 0) return false;
      const prevRate = initial.total > 0 ? initial.wrong / initial.total : 0;
      return stat.seen && stat.failRate < prevRate;
    }).length;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 py-8 max-w-lg mx-auto">
        {/* Icône résultat */}
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-amber-50 border-2 border-amber-200">
          <Zap size={36} className="text-amber-500" />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold font-display text-neutral-ink">Révision terminée !</h2>
          <p className="text-sm text-neutral-muted mt-1">
            {selectedLevel === "all" ? "Tous niveaux" : LEVELS.find((l) => l.key === selectedLevel)?.label}
          </p>
        </div>

        {/* Scores */}
        <div className="flex gap-6 text-center">
          <div><p className="text-2xl font-bold text-[#22C55E]">{correct}</p><p className="text-xs text-neutral-muted">Correct</p></div>
          <div><p className="text-2xl font-bold text-[#EF4444]">{wrong}</p><p className="text-xs text-neutral-muted">Faux</p></div>
          <div><p className="text-2xl font-bold text-neutral-muted">{skipped}</p><p className="text-xs text-neutral-muted">Passé</p></div>
        </div>

        <div className="text-4xl font-bold font-display text-amber-500">{pct}%</div>

        {/* Améliorations détectées */}
        {improved > 0 && (
          <div className="w-full bg-green-50 rounded-xl border border-green-200 p-4 text-center">
            <p className="text-sm font-bold text-[#22C55E]">
              {improved} carte{improved > 1 ? "s" : ""} améliorée{improved > 1 ? "s" : ""} !
            </p>
            <p className="text-xs text-neutral-muted mt-0.5">Votre taux d'échec a diminué sur ces cartes.</p>
          </div>
        )}

        <div className="flex gap-3 w-full max-w-xs">
          <Button variant="secondary" size="md" fullWidth onClick={() => loadCards(selectedLevel)} className="gap-2">
            <RefreshCw size={15} /> Recommencer
          </Button>
          <Link to="/study" className="flex-1">
            <Button variant="primary" size="md" fullWidth className="gap-2 w-full">
              Mode Étude
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Rendu principal ─────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-8">

      {/* En-tête */}
      <div className="flex items-center gap-3 mb-1">
        <Link to="/study" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-soft transition-colors text-neutral-muted cursor-pointer">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-neutral-ink">Révision Intelligente</h1>
            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full whitespace-nowrap">IA</span>
          </div>
          <p className="text-sm text-neutral-muted">
            {total > 0 ? `Carte ${index + 1} / ${total}` : "Aucune carte"}
            {" · "}Triées par difficulté personnelle
          </p>
        </div>
      </div>

      {/* Sélecteur de niveau */}
      <div className="flex gap-2 mt-4 mb-5 flex-wrap">
        {LEVELS.map(({ key, label }) => (
          <button key={key} onClick={() => handleLevelChange(key as Level | "all")}
            className={["px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border",
              selectedLevel === key
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white dark:bg-slate-800 text-neutral-muted border-neutral-line hover:border-amber-400 hover:text-amber-600"].join(" ")}
          >{label}</button>
        ))}
      </div>

      {/* Barre de progression */}
      <div className="w-full h-2 bg-neutral-soft rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* ─── Indicateur de difficulté ─── */}
      {current && diffInfo && (
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${diffInfo.bg} ${diffInfo.text}`}>
              {diffInfo.label}
            </span>
            {currentStat && currentStat.seen && currentStat.total > 0 && (
              <span className="text-xs text-neutral-muted">
                Raté {Math.round(currentStat.failRate * currentStat.total)}/{currentStat.total} fois
              </span>
            )}
          </div>
          {/* Mini barre de difficulté */}
          <div className="flex items-center gap-1.5">
            <div className="w-20 h-1.5 bg-neutral-soft rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${currentStat?.seen ? Math.round(currentStat.failRate * 100) : 50}%`,
                  backgroundColor: diffInfo.bar,
                }}
              />
            </div>
            <TrendingDown size={13} className="text-neutral-muted" />
          </div>
        </div>
      )}

      {/* État vide */}
      {total === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <Zap size={32} className="text-neutral-muted opacity-40" />
          <p className="text-sm font-semibold text-neutral-ink">Aucune carte disponible pour ce niveau</p>
          <button onClick={() => handleLevelChange("all")} className="text-sm text-amber-600 font-semibold hover:underline cursor-pointer">
            Voir tous les niveaux
          </button>
        </div>
      )}

      {/* Carte 3D */}
      {current && <FlashCard3D key={current.id} card={current} />}

      {/* Boutons évaluation + navigation */}
      {total > 0 && (
        <>
          <div className="flex gap-3 mt-8 justify-center flex-wrap">
            <Button variant="wrong"   size="md" onClick={handleWrong}   className="gap-2 flex-1 max-w-[140px]"><XCircle    size={18} /> Faux</Button>
            <Button variant="ghost"   size="md" onClick={handleSkip}    className="gap-2 flex-1 max-w-[140px] border border-neutral-line"><SkipForward size={18} /> Passer</Button>
            <Button variant="correct" size="md" onClick={handleCorrect} className="gap-2 flex-1 max-w-[140px]"><CheckCircle size={18} /> Correct</Button>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button onClick={() => index > 0 && setIndex((i) => i - 1)} disabled={index === 0}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-soft text-neutral-muted disabled:opacity-30 hover:bg-amber-100 transition-colors cursor-pointer">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => index < total - 1 && setIndex((i) => i + 1)} disabled={index === total - 1}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-soft text-neutral-muted disabled:opacity-30 hover:bg-amber-100 transition-colors cursor-pointer">
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
