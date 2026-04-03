import { useState, useCallback } from "react";
import { Volume2 } from "lucide-react";
import type { Flashcard } from "../../../types";
import { useAudio } from "../../../hooks/useAudio";

// Carte mémoire avec retournement 3D
// Recto : mot anglais + phonétique
// Verso : traduction française + exemple

interface FlashCard3DProps {
  card: Flashcard;
}

export function FlashCard3D({ card }: FlashCard3DProps) {
  const [flipped, setFlipped] = useState(false);
  const { speak, isSupported } = useAudio();

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(card.english);
  };

  const handleFlip = useCallback(() => setFlipped((v) => !v), []);

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ height: "260px", perspective: "1200px" }} // réduit de 360px à 260px
      onClick={handleFlip}
      aria-label={`Carte : ${card.english}. Cliquez pour retourner.`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleFlip()}
    >
      {/* Conteneur qui tourne */}
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ── RECTO (Anglais) ── */}
        <div
          className="absolute inset-0 bg-white dark:bg-slate-800 border-2 border-[#C9E8F6] dark:border-slate-600 rounded-2xl flex flex-col items-center justify-center p-6 select-none shadow-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Catégorie */}
          <span className="text-xs font-bold text-[#87CEEB] dark:text-sky-400 uppercase tracking-widest mb-3 px-3 py-1 bg-[#EBF7FD] dark:bg-sky-900/30 rounded-full">
            {card.category}
          </span>

          {/* Mot anglais — réduit de text-5xl à text-3xl */}
          <h2 className="text-3xl font-bold font-display text-neutral-ink dark:text-slate-100 text-center leading-tight">
            {card.english}
          </h2>

          {/* Phonétique — réduit de text-xl à text-base */}
          {card.phonetic && (
            <p className="text-base text-neutral-muted dark:text-slate-400 mt-2 font-mono tracking-wide">
              {card.phonetic}
            </p>
          )}

          {/* Niveau */}
          <div className="mt-3 flex items-center gap-2">
            {card.level === "beginner" && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700/40">
                Débutant
              </span>
            )}
            {card.level === "intermediate" && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EBF7FD] dark:bg-sky-900/30 text-[#1A7BAD] dark:text-sky-400 border border-[#C9E8F6] dark:border-sky-700/40">
                Intermédiaire
              </span>
            )}
            {card.level === "advanced" && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-700/40">
                Avancé
              </span>
            )}
          </div>

          {/* Bouton audio — réduit de mt-5 à mt-3 */}
          {isSupported && (
            <button
              onClick={handleSpeak}
              className="mt-3 w-9 h-9 flex items-center justify-center rounded-full bg-[#C9E8F6] dark:bg-sky-900/40 hover:bg-[#87CEEB] dark:hover:bg-sky-700/50 transition-colors cursor-pointer"
              aria-label="Prononcer le mot"
            >
              <Volume2 size={16} className="text-[#1A7BAD] dark:text-sky-400" />
            </button>
          )}

          <p className="absolute bottom-3 text-xs text-neutral-muted dark:text-slate-500">
            Cliquez pour voir la traduction
          </p>
        </div>

        {/* ── VERSO (Français) ── */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#87CEEB] to-[#4a9fc2] dark:from-slate-700 dark:to-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 select-none"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="text-xs font-bold text-white/70 dark:text-sky-400/80 uppercase tracking-widest mb-3">
            Traduction
          </span>

          {/* Traduction — réduit de text-5xl à text-3xl */}
          <h2 className="text-3xl font-bold font-display text-white dark:text-slate-100 text-center leading-tight">
            {card.french}
          </h2>

          <div className="w-12 h-0.5 bg-white/40 dark:bg-slate-500 my-3 rounded-full" />

          {/* Exemple en anglais */}
          {card.example && (
            <p className="text-sm text-white/90 dark:text-slate-300 text-center italic leading-relaxed max-w-xs line-clamp-2">
              &quot;{card.example}&quot;
            </p>
          )}

          {/* Traduction de l'exemple */}
          {card.exampleFr && (
            <p className="text-xs text-white/70 dark:text-slate-400 text-center mt-1 max-w-xs line-clamp-1">
              {card.exampleFr}
            </p>
          )}

          <p className="absolute bottom-3 text-xs text-white/60 dark:text-slate-500">
            Cliquez pour retourner
          </p>
        </div>
      </div>
    </div>
  );
}