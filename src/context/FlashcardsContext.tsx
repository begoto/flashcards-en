import {
  createContext, useContext, useState, useMemo, useCallback, type ReactNode,
} from "react";
import type { Flashcard, Level } from "../types";
import { DEMO_FLASHCARDS } from "../mocks/flashcards";
import { useAuth } from "./AuthContext";

// ─────────────────────────────────────────────────────────────
// FlashcardsContext — Cartes mémoire + révision intelligente
// ─────────────────────────────────────────────────────────────

interface FlashcardsContextValue {
  allCards: Flashcard[];
  cardsByLevel: (level: Level) => Flashcard[];
  shuffle: (cards: Flashcard[]) => Flashcard[];
  getWrongOptions: (card: Flashcard, count?: number) => string[];
  activeLevel: Level;
  setActiveLevel: (level: Level) => void;
  /**
   * Retourne les cartes triées par taux d'échec décroissant.
   * Ordre : très difficiles → moyennes → jamais vues → faciles
   */
  getSmartReviewCards: (level?: Level, limit?: number) => Flashcard[];
  /** Retourne les stats d'une carte donnée */
  getCardStat: (cardId: string) => { failRate: number; total: number; seen: boolean };
  /** Retourne les 5 cartes du défi du jour (identiques toute la journée, basé sur la date) */
  getDailyChallengeCards: () => Flashcard[];
}

const FlashcardsContext = createContext<FlashcardsContextValue | null>(null);

export function FlashcardsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activeLevel, setActiveLevel] = useState<Level>("beginner");

  const allCards = useMemo<Flashcard[]>(() => {
    const custom = user?.customCards ?? [];
    const ids    = new Set(DEMO_FLASHCARDS.map((c) => c.id));
    return [...DEMO_FLASHCARDS, ...custom.filter((c) => !ids.has(c.id))];
  }, [user?.customCards]);

  const cardsByLevel = useCallback(
    (level: Level): Flashcard[] => allCards.filter((c) => c.level === level),
    [allCards]
  );

  const shuffle = (cards: Flashcard[]): Flashcard[] => {
    const arr = [...cards];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const getWrongOptions = (card: Flashcard, count = 3): string[] => {
    let pool = allCards.filter((c) => c.id !== card.id && c.category === card.category);
    if (pool.length < count) pool = [...pool, ...allCards.filter((c) => c.id !== card.id && c.category !== card.category)];
    return shuffle(pool).slice(0, count).map((c) => c.french);
  };

  /** Construit le Map des stats une seule fois par render */
  const statMap = useMemo(
    () => new Map((user?.cardStats ?? []).map((s) => [s.cardId, s])),
    [user?.cardStats]
  );

  /**
   * Retourne les statistiques de performance d'une carte.
   * failRate = wrong / (correct + wrong), -1 si jamais vue.
   */
  const getCardStat = useCallback(
    (cardId: string) => {
      const stat  = statMap.get(cardId);
      const total = stat ? stat.correct + stat.wrong : 0;
      return {
        failRate: total > 0 ? stat!.wrong / total : -1,
        total,
        seen: total > 0,
      };
    },
    [statMap]
  );

  /**
   * Retourne les cartes triées pour la révision intelligente :
   * 1. Cartes les plus souvent ratées (failRate élevé) — en premier
   * 2. Cartes jamais vues (failRate = -1) — score neutre 0.45
   * 3. Cartes bien maîtrisées — en dernier
   */
  const getSmartReviewCards = useCallback(
    (level?: Level, limit = 25): Flashcard[] => {
      const pool = level ? cardsByLevel(level) : allCards;
      return [...pool]
        .map((card) => {
          const { failRate } = getCardStat(card.id);
          // Cartes jamais vues reçoivent un score neutre (moins prioritaires que les difficiles)
          const sortScore = failRate >= 0 ? failRate : 0.45;
          return { card, sortScore };
        })
        .sort((a, b) => b.sortScore - a.sortScore)
        .slice(0, limit)
        .map((x) => x.card);
    },
    [allCards, cardsByLevel, getCardStat]
  );

  /** Sélection déterministe de 5 cartes selon la date du jour */
  const getDailyChallengeCards = useCallback((): Flashcard[] => {
    const dateStr = new Date().toISOString().split("T")[0];
    // Seed simple basé sur la date : somme des char codes
    let seed = dateStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const seededRand = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 0xffffffff;
    };
    const pool = [...allCards];
    // Fisher-Yates avec seed déterministe
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(seededRand() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 5);
  }, [allCards]);

  return (
    <FlashcardsContext.Provider value={{
      allCards, cardsByLevel, shuffle, getWrongOptions,
      activeLevel, setActiveLevel, getSmartReviewCards, getCardStat,
      getDailyChallengeCards,
    }}>
      {children}
    </FlashcardsContext.Provider>
  );
}

export function useFlashcards(): FlashcardsContextValue {
  const ctx = useContext(FlashcardsContext);
  if (!ctx) throw new Error("useFlashcards must be inside <FlashcardsProvider>");
  return ctx;
}
