import { useCallback, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// useAudio — Prononciation via Web Speech API (SpeechSynthesis)
// Simule l'audio de Duolingo en utilisant une voix anglaise native.
// ─────────────────────────────────────────────────────────────

interface UseAudioReturn {
  /** Prononce un texte en anglais américain */
  speak: (text: string, rate?: number) => void;
  /** Arrête la prononciation en cours */
  stop: () => void;
  /** Vérifie si le navigateur supporte la synthèse vocale */
  isSupported: boolean;
}

export function useAudio(): UseAudioReturn {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  /**
   * Prononce `text` en anglais US.
   * Sélectionne une voix anglaise native si disponible.
   */
  const speak = useCallback(
    (text: string, rate = 0.9) => {
      if (!isSupported) return;

      // Annuler toute prononciation précédente
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Sélectionner une voix anglaise de haute qualité si disponible
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang === "en-US" &&
          (v.name.includes("Google") || v.name.includes("Alex") || v.name.includes("Samantha"))
      );
      if (preferred) utterance.voice = preferred;

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  const stop = useCallback(() => {
    if (isSupported) window.speechSynthesis.cancel();
  }, [isSupported]);

  return { speak, stop, isSupported };
}
