import { useState, useMemo, useEffect, useCallback } from "react";
import {
  ArrowLeft, Check, X, ChevronRight, Flame,
  Trophy, RotateCcw, Target, CheckCircle, XCircle, Dumbbell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/base/Button";
import { useFlashcards } from "../../context/FlashcardsContext";
import { useAuth } from "../../context/AuthContext";
import { Confetti } from "../../components/feature/Confetti";
import type { Flashcard } from "../../types";

// Page du défi du jour — 5 cartes aléatoires déterministes par jour

type Phase = "intro" | "session" | "results";

export default function DailyChallengePage() {
  const navigate = useNavigate();
  const { getDailyChallengeCards } = useFlashcards();
  const { user, completeDailyChallenge, getTodayChallenge } = useAuth();

  const todayChallenge = getTodayChallenge();
  const cards = useMemo(() => getDailyChallengeCards(), [getDailyChallengeCards]);

  const [phase, setPhase]         = useState<Phase>(todayChallenge?.completed ? "results" : "intro");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped]     = useState(false);
  const [results, setResults]     = useState<boolean[]>(
    todayChallenge?.completed
      ? Array(todayChallenge.total).fill(false).map((_, i) => i < todayChallenge.score)
      : []
  );
  const [finalScore, setFinalScore] = useState(todayChallenge?.score ?? 0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Confetti automatique si déjà complété avec score parfait
  useEffect(() => {
    if (todayChallenge?.completed && todayChallenge.score === todayChallenge.total && todayChallenge.total > 0) {
      const t = setTimeout(() => setShowConfetti(true), 300);
      return () => clearTimeout(t);
    }
  }, [todayChallenge]);

  const currentCard: Flashcard | undefined = cards[cardIndex];
  const totalCards = cards.length;
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const todayStr = new Date().toISOString().split("T")[0];

  const handleAnswer = useCallback((correct: boolean) => {
    const newResults = [...results, correct];
    setResults(newResults);
    setFlipped(false);

    if (cardIndex + 1 >= totalCards) {
      const score = newResults.filter(Boolean).length;
      setFinalScore(score);
      completeDailyChallenge(cards.map((c) => c.id), score);
      setPhase("results");
      if (score === totalCards) {
        setTimeout(() => setShowConfetti(true), 400);
      }
    } else {
      setCardIndex((i) => i + 1);
    }
  }, [cardIndex, totalCards, results, cards, completeDailyChallenge]);

  const streak = user?.streak ?? 0;
  const pct = totalCards > 0 ? Math.round((finalScore / totalCards) * 100) : 0;

  // Icône selon le score — remplace les emojis 🏆 ✅ 💪
  const ResultIcon = pct === 100 ? Trophy : pct >= 60 ? CheckCircle : Dumbbell;
  const resultIconColor = pct === 100
    ? "text-amber-500"
    : pct >= 60 ? "text-emerald-500" : "text-rose-500";
  const resultBg = pct === 100
    ? "bg-amber-100"
    : pct >= 60 ? "bg-emerald-100" : "bg-rose-100";

  // ── Intro ──────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 pb-28 md:pb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-neutral-muted hover:text-neutral-ink transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} /> Retour
        </button>

        <div className="bg-white rounded-3xl border border-neutral-line p-8 text-center">
          {/* Icône — remplace l'emoji 🎯 */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center mx-auto mb-5">
            <Target size={40} className="text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-neutral-ink mb-2">Défi du Jour</h1>
          <p className="text-sm text-neutral-muted mb-1 capitalize">{today}</p>

          {/* Streak */}
          <div className={[
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold mt-2 mb-6",
            streak >= 3 ? "bg-orange-100 text-orange-600" : "bg-neutral-100 text-neutral-500",
          ].join(" ")}>
            <Flame size={14} />
            Streak actuel : {streak} jour{streak !== 1 ? "s" : ""}
          </div>

          <div className="bg-emerald-50 rounded-2xl p-5 mb-6 text-left">
            <h3 className="font-bold text-emerald-800 mb-3 text-sm">Comment ça marche ?</h3>
            <ul className="space-y-2">
              {[
                `${totalCards} cartes sélectionnées pour aujourd'hui`,
                "Retournez chaque carte pour voir la traduction",
                "Indiquez si vous connaissiez la réponse",
                "Complétez le défi pour maintenir votre streak !",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-emerald-700">
                  <div className="w-4 h-4 flex items-center justify-center rounded-full bg-emerald-200 text-emerald-700 shrink-0 mt-0.5">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Aperçu des cartes */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {cards.map((card) => (
              <span key={card.id} className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full font-medium">
                {card.english}
              </span>
            ))}
          </div>

          <Button variant="primary" fullWidth onClick={() => setPhase("session")} className="text-base py-3 gap-2">
            <Target size={16} />
            Commencer le défi
          </Button>
        </div>
      </div>
    );
  }

  // ── Session ────────────────────────────────────────────────
  if (phase === "session" && currentCard) {
    const progress = (cardIndex / totalCards) * 100;

    return (
      <div className="max-w-lg mx-auto px-4 py-6 pb-28 md:pb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-neutral-muted hover:text-neutral-ink transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Quitter
          </button>
          <span className="text-sm font-bold text-neutral-ink">
            {cardIndex + 1} / {totalCards}
          </span>
          {/* Indicateurs de progression — cercles colorés */}
          <div className="flex gap-1">
            {results.map((r, i) => (
              <div
                key={i}
                className={["w-2 h-2 rounded-full", r ? "bg-emerald-400" : "bg-rose-400"].join(" ")}
              />
            ))}
            {Array.from({ length: totalCards - results.length }).map((_, i) => (
              <div key={`empty-${i}`} className="w-2 h-2 rounded-full bg-neutral-200" />
            ))}
          </div>
        </div>

        {/* Barre de progression */}
        <div className="h-1.5 bg-neutral-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Carte */}
        <div
          onClick={() => setFlipped((f) => !f)}
          className={[
            "relative w-full rounded-3xl border cursor-pointer transition-all duration-300 select-none",
            "min-h-[220px] flex flex-col items-center justify-center p-8 text-center mb-5",
            flipped
              ? "bg-gradient-to-br from-[#EDF7FD] to-[#C9E8F6] border-[#87CEEB]"
              : "bg-white border-neutral-line hover:border-[#87CEEB]",
          ].join(" ")}
        >
          <div className="absolute top-4 left-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
              {currentCard.category}
            </span>
          </div>

          {!flipped ? (
            <>
              <p className="text-3xl font-bold text-neutral-ink mb-2">{currentCard.english}</p>
              <p className="text-sm text-neutral-muted font-mono">{currentCard.phonetic}</p>
              <div className="absolute bottom-4 flex items-center gap-1 text-xs text-neutral-300">
                <RotateCcw size={11} />
                <span>Toucher pour retourner</span>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-[#5BAED6] mb-3">Traduction</p>
              <p className="text-3xl font-bold text-[#1A7BAD] mb-3">{currentCard.french}</p>
              <p className="text-sm text-neutral-muted italic">"{currentCard.example}"</p>
              <p className="text-xs text-neutral-400 mt-1">"{currentCard.exampleFr}"</p>
            </>
          )}
        </div>

        {/* Boutons réponse */}
        {flipped && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleAnswer(false)}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-bold hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <X size={18} />
              Je ne savais pas
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Check size={18} />
              Je savais !
            </button>
          </div>
        )}

        {!flipped && (
          <p className="text-center text-sm text-neutral-muted">
            Appuyez sur la carte pour voir la traduction
          </p>
        )}
      </div>
    );
  }

  // ── Résultats ──────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto px-4 py-8 pb-28 md:pb-10">
      <Confetti active={showConfetti} />
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-neutral-muted hover:text-neutral-ink transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} /> Retour
      </button>

      <div className="bg-white rounded-3xl border border-neutral-line p-8 text-center">
        {/* Icône résultat — remplace les emojis 🏆 ✅ 💪 */}
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 ${resultBg}`}>
          <ResultIcon size={40} className={resultIconColor} />
        </div>

        <h2 className="text-2xl font-bold text-neutral-ink mb-1">
          {pct === 100 ? "Parfait !" : pct >= 60 ? "Bien joué !" : "Continue !"}
        </h2>
        <p className="text-sm text-neutral-muted mb-5 capitalize">
          {todayChallenge?.completed
            ? new Date(todayStr).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
            : today}
        </p>

        {/* Score */}
        <div className={[
          "rounded-2xl p-5 mb-5",
          pct === 100 ? "bg-amber-50" : pct >= 60 ? "bg-emerald-50" : "bg-rose-50",
        ].join(" ")}>
          <p className={[
            "text-5xl font-bold mb-1",
            pct === 100 ? "text-amber-600" : pct >= 60 ? "text-emerald-600" : "text-rose-500",
          ].join(" ")}>
            {finalScore}/{totalCards}
          </p>
          <p className={`text-sm font-semibold ${pct === 100 ? "text-amber-700" : pct >= 60 ? "text-emerald-700" : "text-rose-600"}`}>
            {pct}% de réussite
          </p>
        </div>

        {/* Streak */}
        <div className={[
          "flex items-center justify-center gap-2 rounded-xl py-3 px-4 mb-6",
          streak >= 3 ? "bg-orange-50" : "bg-neutral-50",
        ].join(" ")}>
          <Flame size={18} className={streak >= 3 ? "text-orange-500" : "text-neutral-400"} />
          <span className={`text-sm font-bold ${streak >= 3 ? "text-orange-600" : "text-neutral-600"}`}>
            Streak : {streak} jour{streak !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Résultats par carte */}
        <div className="flex flex-col gap-2 mb-6 text-left">
          {cards.map((card, i) => {
            const correct = results[i];
            return (
              <div
                key={card.id}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm",
                  correct === true  ? "bg-emerald-50 border-emerald-200" :
                  correct === false ? "bg-rose-50 border-rose-200" :
                  "bg-neutral-50 border-neutral-100",
                ].join(" ")}
              >
                <div className={[
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                  correct === true  ? "bg-emerald-200" :
                  correct === false ? "bg-rose-200" :
                  "bg-neutral-200",
                ].join(" ")}>
                  {/* Icônes à la place des emojis ✅ ❌ */}
                  {correct === true  && <Check size={12} className="text-emerald-700" strokeWidth={3} />}
                  {correct === false && <X size={12} className="text-rose-600" strokeWidth={3} />}
                  {correct === undefined && <span className="text-[10px] text-neutral-400">?</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-neutral-ink">{card.english}</span>
                  <span className="text-neutral-400 mx-1.5">→</span>
                  <span className="text-neutral-600">{card.french}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button variant="primary" fullWidth onClick={() => navigate("/dashboard")} className="gap-2">
            <Trophy size={15} />
            Voir le dashboard
          </Button>
          <Button variant="outline" fullWidth onClick={() => navigate("/study")} className="gap-2">
            <ChevronRight size={15} />
            Continuer à étudier
          </Button>
        </div>
      </div>
    </div>
  );
}