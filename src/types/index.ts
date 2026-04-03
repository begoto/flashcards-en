// ─────────────────────────────────────────────
// Types globaux de l'application FlashCards EN
// ─────────────────────────────────────────────

/** Niveau d'apprentissage */
export type Level = "beginner" | "intermediate" | "advanced";

/** Catégorie d'une carte */
export type Category =
  | "Greetings"
  | "Animals"
  | "Food & Drink"
  | "Colors"
  | "Numbers"
  | "Family"
  | "Body Parts"
  | "Verbs"
  | "Adjectives"
  | "Travel"
  | "Work"
  | "Technology"
  | "Nature"
  | "Phrases"
  | "Idioms"
  | "Advanced";

/** Carte mémoire (flashcard) */
export interface Flashcard {
  id: string;
  english: string;         // Mot/expression en anglais
  french: string;          // Traduction en français
  phonetic: string;        // Prononciation phonétique
  level: Level;
  category: Category;
  example: string;         // Exemple en anglais
  exampleFr: string;       // Traduction de l'exemple
}

/** Score d'un examen */
export interface ExamScore {
  id: string;
  date: string;            // ISO 8601
  score: number;           // Nombre de bonnes réponses
  total: number;           // Nombre total de questions
  level: Level;
  durationSeconds: number; // Durée utilisée (secondes)
}

/** Score d'un quiz */
export interface QuizScore {
  id: string;
  date: string;
  score: number;
  total: number;
  level: Level;
  reward: "none" | "bronze" | "silver" | "gold" | "star";
}

/** Statistique de performance par carte (révision intelligente) */
export interface CardStat {
  cardId: string;
  correct: number;  // Nombre de fois répondu correctement
  wrong: number;    // Nombre de fois répondu incorrectement
  lastSeen: string; // Date YYYY-MM-DD de la dernière révision
}

/** Profil utilisateur */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;         // base64 ou URL
  examScores: ExamScore[];
  quizScores: QuizScore[];
  customCards: Flashcard[];
  streak: number;                // Jours consécutifs d'activité
  lastActiveDate: string | null; // Date YYYY-MM-DD de la dernière activité
  cardStats: CardStat[];         // Performances par carte (révision intelligente)
  badges: UserBadge[];           // Badges/Trophées débloqués
  dailyChallenges: DailyChallenge[]; // Historique des défis du jour
}

/** Direction du quiz */
export type QuizDirection = "fr-en" | "en-fr";

/** Résultat d'une question quiz */
export interface QuizAnswer {
  cardId: string;
  correct: boolean;
  timeLeft: number;
}

/** Badge/Trophée débloqué */
export interface UserBadge {
  id: string;           // Identifiant du badge (ex: "streak_7")
  unlockedAt: string;   // ISO 8601
}

/** Résultat d'un défi du jour */
export interface DailyChallenge {
  date: string;         // YYYY-MM-DD
  cardIds: string[];    // Les 5 cartes du défi
  completed: boolean;
  score: number;        // Bonnes réponses
  total: number;        // Toujours 5
}
