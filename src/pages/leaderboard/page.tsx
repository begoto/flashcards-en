import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Trophy, Flame, Award, BookOpen, Eye, EyeOff,
  Share2, Ghost, Rocket, Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DEMO_PLAYERS, AVATAR_COLORS } from "@/mocks/leaderboard";
import type { UserProfile } from "@/types";
import type { LeaderEntry } from "./components/Podium";
import { Podium } from "./components/Podium";
import { RankList } from "./components/RankList";

// Page classement — streak, badges, cartes étudiées

type SortKey = "streak" | "badges" | "cards";

const TABS: { key: SortKey; label: string; icon: React.ReactNode }[] = [
  { key: "streak", label: "Streak",  icon: <Flame    size={14} /> },
  { key: "badges", label: "Badges",  icon: <Award    size={14} /> },
  { key: "cards",  label: "Cartes",  icon: <BookOpen size={14} /> },
];

const USERS_KEY = "flashcards_users";

function readRealUsers(): UserProfile[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}

export default function LeaderboardPage() {
  const { user: currentUser } = useAuth();
  const [sortKey, setSortKey]   = useState<SortKey>("streak");
  const [showDemo, setShowDemo] = useState(true);
  const [copied,   setCopied]   = useState(false);

  // Couleur d'avatar stable basée sur l'ID
  const colorIndexFor = useCallback((id: string): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
    return Math.abs(hash) % AVATAR_COLORS.length;
  }, []);

  // Fusionne joueurs réels + démo
  const allEntries = useMemo<LeaderEntry[]>(() => {
    const realUsers = readRealUsers();
    const real: LeaderEntry[] = realUsers.map((u) => ({
      id: u.id, name: u.name, avatar: u.avatar ?? null,
      streak: u.streak ?? 0,
      badgeCount: (u.badges ?? []).length,
      totalCards: (u.cardStats ?? []).reduce((acc, s) => acc + s.correct + s.wrong, 0),
      isDemo: false,
      isCurrentUser: u.id === currentUser?.id,
    }));

    const demoEntries: LeaderEntry[] = showDemo
      ? DEMO_PLAYERS.map((d) => ({
          id: d.id, name: d.name, avatar: null,
          streak: d.streak, badgeCount: d.badgeCount, totalCards: d.totalCards,
          isDemo: true, isCurrentUser: false,
        }))
      : [];

    return [...real, ...demoEntries];
  }, [showDemo, currentUser]);

  // Tri selon l'onglet actif
  const sorted = useMemo<LeaderEntry[]>(() => {
    const copy = [...allEntries];
    if (sortKey === "streak") return copy.sort((a, b) => b.streak - a.streak || b.totalCards - a.totalCards);
    if (sortKey === "badges") return copy.sort((a, b) => b.badgeCount - a.badgeCount || b.streak - a.streak);
    return copy.sort((a, b) => b.totalCards - a.totalCards || b.streak - a.streak);
  }, [allEntries, sortKey]);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const myRank = useMemo(
    () => sorted.findIndex((e) => e.isCurrentUser) + 1,
    [sorted]
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] dark:bg-slate-950">

      {/* En-tête hero */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-slate-950 border-b border-amber-100 dark:border-amber-900/20">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-0">

          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shrink-0">
                <Trophy size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                  Classement
                </h1>
                <p className="text-xs text-neutral-500 dark:text-slate-400">
                  Top joueurs de la communauté FlashLearn
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Bouton afficher/masquer démo */}
              <button
                onClick={() => setShowDemo((v) => !v)}
                title={showDemo ? "Masquer les joueurs démo" : "Afficher les joueurs démo"}
                className={[
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                  showDemo
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    : "bg-neutral-100 dark:bg-slate-700 text-neutral-500 dark:text-slate-400",
                ].join(" ")}
              >
                {showDemo ? <Eye size={13} /> : <EyeOff size={13} />}
                Démo
              </button>

              {/* Bouton partager */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-slate-700 text-neutral-600 dark:text-slate-300 hover:bg-neutral-200 dark:hover:bg-slate-600 transition-all cursor-pointer whitespace-nowrap"
              >
                <Share2 size={13} />
                {copied ? "Copié !" : "Partager"}
              </button>
            </div>
          </div>

          {/* Ma position */}
          {currentUser && myRank > 0 && (
            <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-amber-100 dark:border-amber-900/30 rounded-xl px-4 py-2.5 mb-5 w-fit">
              <Trophy size={14} className="text-amber-500" />
              <p className="text-xs text-neutral-600 dark:text-slate-300">
                Votre position :
                <span className="font-black text-amber-600 dark:text-amber-400 ml-1">
                  #{myRank}
                </span>
              </p>
            </div>
          )}

          {/* Onglets tri */}
          <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-neutral-200 dark:border-slate-700 rounded-xl p-1 w-fit mb-0">
            {TABS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setSortKey(key)}
                className={[
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                  sortKey === key
                    ? "bg-amber-400 text-white shadow-sm"
                    : "text-neutral-500 dark:text-slate-400 hover:text-neutral-700 dark:hover:text-slate-200",
                ].join(" ")}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          <Podium top3={top3} sortKey={sortKey} colorIndexFor={colorIndexFor} />
        </div>
      </div>

      {/* Liste du classement */}
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Note joueurs démo — Ghost remplace 👻 */}
        {showDemo && (
          <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30 rounded-xl px-4 py-3 mb-4">
            <Ghost size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Les joueurs marqués <strong>démo</strong> sont des exemples.
              Invitez vos amis pour les voir apparaître ici !
            </p>
          </div>
        )}

        {rest.length > 0 ? (
          <RankList entries={rest} startRank={4} sortKey={sortKey} colorIndexFor={colorIndexFor} />
        ) : (
          <div className="text-center py-8 text-neutral-400 dark:text-slate-500 text-sm">
            Pas assez de joueurs pour afficher la suite.
          </div>
        )}

        {/* Invitation amis — Rocket remplace 🚀 */}
        <div className="mt-8 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-100 dark:border-sky-900/30 rounded-2xl p-5 text-center">
          <div className="w-10 h-10 flex items-center justify-center bg-sky-100 dark:bg-sky-900/40 rounded-xl mx-auto mb-3">
            <Rocket size={20} className="text-sky-600 dark:text-sky-400" />
          </div>
          <h2 className="text-base font-black text-neutral-800 dark:text-white mb-1">
            Défiez vos amis !
          </h2>
          <p className="text-xs text-neutral-500 dark:text-slate-400 mb-4 max-w-xs mx-auto">
            Partagez FlashLearn avec vos amis et montez ensemble dans le classement.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-400 hover:bg-sky-500 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Share2 size={14} />
              {copied ? "Lien copié !" : "Copier le lien"}
            </button>
            {!currentUser && (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-600 text-neutral-700 dark:text-slate-200 rounded-xl text-sm font-bold hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Créer un compte
              </Link>
            )}
          </div>
        </div>

        {/* Stats globales */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Joueurs inscrits", value: sorted.filter((e) => !e.isDemo).length.toString(), icon: Users },
            { label: "Meilleur streak",  value: `${sorted[0]?.streak ?? 0}j`,                      icon: Flame },
            { label: "Cartes étudiées",  value: sorted.filter((e) => !e.isDemo).reduce((a, e) => a + e.totalCards, 0).toString(), icon: BookOpen },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white dark:bg-slate-800/60 border border-neutral-100 dark:border-slate-700 rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1">
                <Icon size={18} className="text-amber-500" />
              </div>
              <p className="text-lg font-black text-neutral-800 dark:text-white leading-none">{value}</p>
              <p className="text-[10px] text-neutral-400 dark:text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}