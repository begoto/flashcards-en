import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from "react";
import { 
  auth, db 
} from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove,
} from "firebase/firestore";
import { BADGE_DEFINITIONS } from "../mocks/badges";
import type {
  UserProfile, ExamScore, QuizScore,
  Flashcard, CardStat, UserBadge, DailyChallenge, Level, Category,
} from "../types";

// ─── Types ──────────────────────────────────────────────────────────
interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  newlyUnlockedBadges: UserBadge[];
  clearNewBadges: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Pick<UserProfile, "name" | "avatar">>) => Promise<void>;
  addExamScore: (score: Omit<ExamScore, "id">) => Promise<void>;
  addQuizScore: (score: Omit<QuizScore, "id">) => Promise<void>;
  addCustomCard: (card: Flashcard) => Promise<void>;
  updateCustomCard: (card: Flashcard) => Promise<void>;
  deleteCustomCard: (cardId: string) => Promise<void>;
  updateCardStats: (results: Array<{ cardId: string; correct: boolean }>) => Promise<void>;
  completeDailyChallenge: (cardIds: string[], score: number) => Promise<void>;
  getTodayChallenge: () => DailyChallenge | null;
  resetUserData: (what: Array<"examScores" | "quizScores" | "cardStats" | "badges" | "dailyChallenges">) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const today = () => new Date().toISOString().split("T")[0];

// Génère un ID unique
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// ─── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newlyUnlockedBadges, setNewly] = useState<UserBadge[]>([]);

  // Charge toutes les données d'un utilisateur depuis Firestore
  const loadUserData = useCallback(async (firebaseUser: FirebaseUser): Promise<UserProfile | null> => {
    const userId = firebaseUser.uid;
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    // Si le document n'existe pas, on le crée
    if (!userSnap.exists()) {
      const newProfile: UserProfile = {
        id: userId,
        name: firebaseUser.displayName || "",
        email: firebaseUser.email || "",
        avatar: null,
        streak: 0,
        lastActiveDate: null,
        examScores: [],
        quizScores: [],
        customCards: [],
        cardStats: [],
        badges: [],
        dailyChallenges: [],
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }

    const data = userSnap.data() as UserProfile;
    const td = today();
    let streak = data.streak;
    let lastActiveDate = data.lastActiveDate;

    // Mise à jour du streak
    if (lastActiveDate !== td) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split("T")[0];
      if (lastActiveDate === yStr) {
        streak = (streak || 0) + 1;
      } else {
        streak = 1;
      }
      lastActiveDate = td;
      await updateDoc(userRef, { streak, lastActiveDate });
    }

    return {
      ...data,
      id: userId,
      email: firebaseUser.email || data.email,
      streak: streak || 0,
      lastActiveDate: lastActiveDate || null,
      examScores: data.examScores || [],
      quizScores: data.quizScores || [],
      customCards: data.customCards || [],
      cardStats: data.cardStats || [],
      badges: data.badges || [],
      dailyChallenges: data.dailyChallenges || [],
    };
  }, []);

  // Écoute les changements d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await loadUserData(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [loadUserData]);

  const clearNewBadges = useCallback(() => setNewly([]), []);

  // Vérifie et sauvegarde les nouveaux badges
  const checkAndSaveBadges = useCallback(async (updatedUser: UserProfile) => {
    const existing = new Set((updatedUser.badges ?? []).map((b) => b.id));
    const newBadges: UserBadge[] = [];
    const now = new Date().toISOString();
    
    BADGE_DEFINITIONS.forEach((def) => {
      if (!existing.has(def.id) && def.condition(updatedUser)) {
        newBadges.push({ id: def.id, unlockedAt: now });
      }
    });

    if (newBadges.length > 0) {
      const userRef = doc(db, "users", updatedUser.id);
      const allBadges = [...(updatedUser.badges ?? []), ...newBadges];
      await updateDoc(userRef, { badges: allBadges });
      setUser({ ...updatedUser, badges: allBadges });
      setNewly((prev) => [...prev, ...newBadges]);
    }
  }, []);

  // ─── Connexion ──────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  // ─── Inscription ────────────────────────────────────────
  const register = useCallback(async (name: string, email: string, password: string) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    // Création du profil utilisateur
    const userRef = doc(db, "users", firebaseUser.uid);
    const newProfile: UserProfile = {
      id: firebaseUser.uid,
      name,
      email,
      avatar: null,
      streak: 0,
      lastActiveDate: null,
      examScores: [],
      quizScores: [],
      customCards: [],
      cardStats: [],
      badges: [],
      dailyChallenges: [],
    };
    await setDoc(userRef, newProfile);
  }, []);

  // ─── Déconnexion ────────────────────────────────────────
  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  // ─── Modifier le profil ─────────────────────────────────
  const updateProfile = useCallback(async (data: Partial<Pick<UserProfile, "name" | "avatar">>) => {
    if (!user) return;
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, data);
    setUser({ ...user, ...data });
  }, [user]);

  // ─── Ajouter un score d'examen ──────────────────────────
  const addExamScore = useCallback(async (score: Omit<ExamScore, "id">) => {
    if (!user) return;
    const newScore: ExamScore = { ...score, id: generateId() };
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, {
      examScores: arrayUnion(newScore),
    });
    const updatedUser = { ...user, examScores: [newScore, ...user.examScores] };
    setUser(updatedUser);
    await checkAndSaveBadges(updatedUser);
  }, [user, checkAndSaveBadges]);

  // ─── Ajouter un score de quiz ───────────────────────────
  const addQuizScore = useCallback(async (score: Omit<QuizScore, "id">) => {
    if (!user) return;
    const newScore: QuizScore = { ...score, id: generateId() };
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, {
      quizScores: arrayUnion(newScore),
    });
    const updatedUser = { ...user, quizScores: [newScore, ...user.quizScores] };
    setUser(updatedUser);
    await checkAndSaveBadges(updatedUser);
  }, [user, checkAndSaveBadges]);

  // ─── Cartes personnalisées ──────────────────────────────
  const addCustomCard = useCallback(async (card: Flashcard) => {
    if (!user) return;
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, {
      customCards: arrayUnion(card),
    });
    setUser({ ...user, customCards: [...user.customCards, card] });
  }, [user]);

  const updateCustomCard = useCallback(async (card: Flashcard) => {
    if (!user) return;
    const userRef = doc(db, "users", user.id);
    const updatedCards = user.customCards.map((c) => c.id === card.id ? card : c);
    await updateDoc(userRef, { customCards: updatedCards });
    setUser({ ...user, customCards: updatedCards });
  }, [user]);

  const deleteCustomCard = useCallback(async (cardId: string) => {
    if (!user) return;
    const userRef = doc(db, "users", user.id);
    const cardToDelete = user.customCards.find((c) => c.id === cardId);
    if (cardToDelete) {
      await updateDoc(userRef, {
        customCards: arrayRemove(cardToDelete),
      });
    }
    setUser({ ...user, customCards: user.customCards.filter((c) => c.id !== cardId) });
  }, [user]);

  // ─── Statistiques des cartes ────────────────────────────
  const updateCardStats = useCallback(async (results: Array<{ cardId: string; correct: boolean }>) => {
    if (!user) return;
    const td = today();
    const statsMap = new Map<string, CardStat>(
      (user.cardStats ?? []).map((s) => [s.cardId, { ...s }])
    );

    for (const { cardId, correct } of results) {
      const existing = statsMap.get(cardId) ?? { cardId, correct: 0, wrong: 0, lastSeen: td };
      statsMap.set(cardId, {
        ...existing,
        correct: existing.correct + (correct ? 1 : 0),
        wrong: existing.wrong + (correct ? 0 : 1),
        lastSeen: td,
      });
    }

    const updatedStats = Array.from(statsMap.values());
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, { cardStats: updatedStats });
    
    const updatedUser = { ...user, cardStats: updatedStats };
    setUser(updatedUser);
    await checkAndSaveBadges(updatedUser);
  }, [user, checkAndSaveBadges]);

  // ─── Défi du jour ───────────────────────────────────────
  const completeDailyChallenge = useCallback(async (cardIds: string[], score: number) => {
    if (!user) return;
    const td = today();
    const challenge: DailyChallenge = {
      date: td,
      cardIds,
      completed: true,
      score,
      total: cardIds.length,
    };

    const existing = (user.dailyChallenges ?? []).filter((d) => d.date !== td);
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, {
      dailyChallenges: [...existing, challenge],
    });

    const updatedUser = { ...user, dailyChallenges: [...existing, challenge] };
    setUser(updatedUser);
    await checkAndSaveBadges(updatedUser);
  }, [user, checkAndSaveBadges]);

  const getTodayChallenge = useCallback((): DailyChallenge | null => {
    if (!user) return null;
    return (user.dailyChallenges ?? []).find((d) => d.date === today()) ?? null;
  }, [user]);

  // ─── Réinitialiser des données ──────────────────────────
  const resetUserData = useCallback(async (
    what: Array<"examScores" | "quizScores" | "cardStats" | "badges" | "dailyChallenges">
  ) => {
    if (!user) return;
    const userRef = doc(db, "users", user.id);
    const updates: Partial<UserProfile> = {};
    
    if (what.includes("examScores")) updates.examScores = [];
    if (what.includes("quizScores")) updates.quizScores = [];
    if (what.includes("cardStats")) updates.cardStats = [];
    if (what.includes("badges")) updates.badges = [];
    if (what.includes("dailyChallenges")) updates.dailyChallenges = [];
    
    await updateDoc(userRef, updates as any);
    setUser({ ...user, ...updates });
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user, isLoading, newlyUnlockedBadges, clearNewBadges,
      login, register, logout, updateProfile,
      addExamScore, addQuizScore,
      addCustomCard, updateCustomCard, deleteCustomCard,
      updateCardStats, completeDailyChallenge, getTodayChallenge,
      resetUserData,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return ctx;
}