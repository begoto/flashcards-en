import type { UserProfile } from "../types";

// ─────────────────────────────────────────────────────────────
// Définitions statiques des badges / trophées
// condition() détermine si le badge est débloqué pour un profil
// ─────────────────────────────────────────────────────────────

export interface BadgeDefinition {
  id: string;
  label: string;
  description: string;
  emoji: string;
  color: string;        // Couleur de fond hex
  textColor: string;    // Couleur texte tailwind
  condition: (user: UserProfile) => boolean;
}

/** Nombre total de cartes étudiées (toutes sessions) */
const totalCardsStudied = (user: UserProfile): number =>
  (user.cardStats ?? []).reduce((acc, s) => acc + s.correct + s.wrong, 0);

/** Nombre d'examens à 100% */
const perfectExams = (user: UserProfile): number =>
  (user.examScores ?? []).filter((s) => s.score === s.total).length;

/** Nombre de quiz à 100% */
const perfectQuizzes = (user: UserProfile): number =>
  (user.quizScores ?? []).filter((s) => s.score === s.total).length;

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ── Premières fois ──
  {
    id: "first_study",
    label: "Premier pas",
    description: "Complétez votre première session d'étude",
    emoji: "🌱",
    color: "#F0FFF4",
    textColor: "text-green-700",
    condition: (u) => (u.cardStats ?? []).length > 0,
  },
  {
    id: "first_quiz",
    label: "Quiz rookie",
    description: "Complétez votre premier quiz",
    emoji: "🎯",
    color: "#EFF6FF",
    textColor: "text-blue-600",
    condition: (u) => (u.quizScores ?? []).length > 0,
  },
  {
    id: "first_exam",
    label: "Candidat",
    description: "Passez votre premier examen",
    emoji: "📝",
    color: "#FFF7ED",
    textColor: "text-orange-600",
    condition: (u) => (u.examScores ?? []).length > 0,
  },
  {
    id: "first_perfect_quiz",
    label: "Premier 100% !",
    description: "Obtenez un score parfait à un quiz",
    emoji: "⭐",
    color: "#FFFBEB",
    textColor: "text-yellow-600",
    condition: (u) => perfectQuizzes(u) >= 1,
  },
  {
    id: "first_perfect_exam",
    label: "Examen parfait",
    description: "Obtenez 100% à un examen",
    emoji: "🏆",
    color: "#FEF9C3",
    textColor: "text-yellow-700",
    condition: (u) => perfectExams(u) >= 1,
  },
  // ── Cartes étudiées ──
  {
    id: "cards_50",
    label: "Studieux",
    description: "Étudiez 50 cartes",
    emoji: "📚",
    color: "#F0F9FF",
    textColor: "text-sky-600",
    condition: (u) => totalCardsStudied(u) >= 50,
  },
  {
    id: "cards_100",
    label: "Centurion",
    description: "Étudiez 100 cartes",
    emoji: "💯",
    color: "#FFF1F2",
    textColor: "text-rose-600",
    condition: (u) => totalCardsStudied(u) >= 100,
  },
  {
    id: "cards_500",
    label: "Expert",
    description: "Étudiez 500 cartes",
    emoji: "🎓",
    color: "#FAF5FF",
    textColor: "text-purple-600",
    condition: (u) => totalCardsStudied(u) >= 500,
  },
  {
    id: "cards_1000",
    label: "Maître",
    description: "Étudiez 1000 cartes",
    emoji: "👑",
    color: "#FFFBEB",
    textColor: "text-amber-700",
    condition: (u) => totalCardsStudied(u) >= 1000,
  },
  // ── Streak ──
  {
    id: "streak_3",
    label: "Régulier",
    description: "3 jours de streak consécutifs",
    emoji: "🔥",
    color: "#FFF7ED",
    textColor: "text-orange-500",
    condition: (u) => (u.streak ?? 0) >= 3,
  },
  {
    id: "streak_7",
    label: "Une semaine !",
    description: "7 jours de streak consécutifs",
    emoji: "🌟",
    color: "#FEF3C7",
    textColor: "text-amber-600",
    condition: (u) => (u.streak ?? 0) >= 7,
  },
  {
    id: "streak_14",
    label: "2 semaines 💪",
    description: "14 jours de streak consécutifs",
    emoji: "⚡",
    color: "#FFF9C4",
    textColor: "text-yellow-600",
    condition: (u) => (u.streak ?? 0) >= 14,
  },
  {
    id: "streak_30",
    label: "Inarrêtable",
    description: "30 jours de streak consécutifs",
    emoji: "🚀",
    color: "#F5F3FF",
    textColor: "text-violet-600",
    condition: (u) => (u.streak ?? 0) >= 30,
  },
  // ── Défi du Jour ──
  {
    id: "first_daily_challenge",
    label: "Premier défi relevé !",
    description: "Complétez votre premier défi du jour",
    emoji: "🎯",
    color: "#ECFDF5",
    textColor: "text-emerald-700",
    condition: (u) => (u.dailyChallenges ?? []).some((d) => d.completed),
  },
  {
    id: "daily_challenge_3",
    label: "Habitué du défi",
    description: "Complétez 3 défis du jour",
    emoji: "📅",
    color: "#F0FDF4",
    textColor: "text-green-700",
    condition: (u) => (u.dailyChallenges ?? []).filter((d) => d.completed).length >= 3,
  },
  {
    id: "daily_challenge_7",
    label: "Défi hebdomadaire",
    description: "Complétez 7 défis du jour",
    emoji: "🗓️",
    color: "#FEFCE8",
    textColor: "text-yellow-700",
    condition: (u) => (u.dailyChallenges ?? []).filter((d) => d.completed).length >= 7,
  },
  {
    id: "daily_challenge_perfect",
    label: "Défi parfait",
    description: "Obtenez 5/5 à un défi du jour",
    emoji: "💫",
    color: "#FFF7ED",
    textColor: "text-orange-600",
    condition: (u) => (u.dailyChallenges ?? []).some((d) => d.completed && d.score === d.total && d.total > 0),
  },
  // ── Quantité quiz/examen ──
  {
    id: "quiz_10",
    label: "Quiz maniac",
    description: "Complétez 10 quiz",
    emoji: "🎮",
    color: "#ECFDF5",
    textColor: "text-emerald-600",
    condition: (u) => (u.quizScores ?? []).length >= 10,
  },
  {
    id: "exam_5",
    label: "Assidu",
    description: "Passez 5 examens",
    emoji: "📖",
    color: "#F0F9FF",
    textColor: "text-cyan-600",
    condition: (u) => (u.examScores ?? []).length >= 5,
  },
  {
    id: "perfect_x5",
    label: "Perfectionniste",
    description: "Obtenez 5 quiz ou examens parfaits",
    emoji: "💎",
    color: "#EFF6FF",
    textColor: "text-blue-700",
    condition: (u) => perfectQuizzes(u) + perfectExams(u) >= 5,
  },
];
