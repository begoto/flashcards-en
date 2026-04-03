import { useMemo } from "react";
import { Trophy, Flame, BookOpen, Users, ChevronRight, Award } from "lucide-react";
import { Link } from "react-router-dom";
import type { UserProfile } from "../../../types";

interface LeaderEntry {
  id: string;
  name: string;
  avatar: string | null;
  streak: number;
  totalCards: number;
  badgeCount: number;
}

interface Props {
  currentUserId: string | undefined;
}

const USERS_KEY = "flashcards_users";

const MEDAL_STYLES = [
  { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-600 dark:text-amber-400", label: "1" },
  { bg: "bg-slate-200 dark:bg-slate-700", text: "text-slate-500 dark:text-slate-300", label: "2" },
  { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", label: "3" },
];

export function LeaderboardSection({ currentUserId }: Props) {
  const leaderboard = useMemo<LeaderEntry[]>(() => {
    try {
      const all: UserProfile[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      return all
        .map((u) => ({
          id: u.id,
          name: u.name,
          avatar: u.avatar ?? null,
          streak: u.streak ?? 0,
          totalCards: (u.cardStats ?? []).reduce((acc, s) => acc + s.correct + s.wrong, 0),
          badgeCount: (u.badges ?? []).length,
        }))
        .sort((a, b) => b.streak - a.streak || b.totalCards - a.totalCards)
        .slice(0, 5);
    } catch {
      return [];
    }
  }, [currentUserId]);

  if (leaderboard.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-neutral-line dark:border-slate-700 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-neutral-line dark:border-slate-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center">
            <Trophy size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-ink dark:text-slate-100">Classement</h2>
            <p className="text-xs text-neutral-muted dark:text-slate-400">
              <Users size={10} className="inline mr-1" />
              {leaderboard.length} joueur{leaderboard.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Link
          to="/leaderboard"
          className="flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline whitespace-nowrap"
        >
          Voir tout <ChevronRight size={12} />
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-neutral-line dark:divide-slate-800">
        {leaderboard.map((entry, i) => {
          const isMe = entry.id === currentUserId;
          return (
            <div
              key={entry.id}
              className={[
                "flex items-center gap-4 px-6 py-4 transition-colors",
                isMe
                  ? "bg-sky-50 dark:bg-sky-950/30"
                  : "hover:bg-neutral-50 dark:hover:bg-slate-800/50",
              ].join(" ")}
            >
              {/* Rank */}
              <div className="w-8 text-center shrink-0">
                {MEDAL_STYLES[i] ? (
                  <div className={["w-7 h-7 flex items-center justify-center rounded-full text-xs font-extrabold mx-auto", MEDAL_STYLES[i].bg, MEDAL_STYLES[i].text].join(" ")}>
                    {MEDAL_STYLES[i].label}
                  </div>
                ) : (
                  <span className="text-xs font-bold text-neutral-400 dark:text-slate-500 w-6 h-6 flex items-center justify-center bg-neutral-100 dark:bg-slate-800 rounded-full mx-auto">
                    {i + 1}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div
                className={[
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden",
                  isMe
                    ? "bg-gradient-to-br from-sky-200 to-sky-400 dark:from-sky-700 dark:to-sky-500 text-white ring-2 ring-sky-400/50"
                    : "bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-slate-600 dark:to-slate-500 text-neutral-600 dark:text-slate-300",
                ].join(" ")}
              >
                {entry.avatar ? (
                  <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                ) : (
                  entry.name.charAt(0).toUpperCase()
                )}
              </div>

              {/* Name + sub */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className={["text-sm font-bold truncate", isMe ? "text-sky-700 dark:text-sky-400" : "text-neutral-ink dark:text-slate-200"].join(" ")}>
                    {entry.name}
                  </p>
                  {isMe && (
                    <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/40 px-1.5 py-0.5 rounded-full">
                      Moi
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-neutral-muted dark:text-slate-500 flex items-center gap-0.5">
                    <BookOpen size={9} />
                    {entry.totalCards}
                  </span>
                  {entry.badgeCount > 0 && (
                    <span className="text-[10px] text-neutral-muted dark:text-slate-500 flex items-center gap-0.5">
                      <Award size={9} /> {entry.badgeCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Streak */}
              <div className={[
                "flex items-center gap-1 px-2.5 py-1.5 rounded-full shrink-0 text-xs font-bold",
                entry.streak >= 7  ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                : entry.streak >= 3 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                : "bg-neutral-100 dark:bg-slate-800 text-neutral-500 dark:text-slate-400",
              ].join(" ")}>
                <Flame size={11} />
                {entry.streak}j
              </div>
            </div>
          );
        })}
      </div>

      {leaderboard.length === 1 && (
        <div className="px-6 py-4 border-t border-neutral-line dark:border-slate-700">
          <p className="text-xs text-neutral-muted dark:text-slate-500 text-center flex items-center justify-center gap-1.5">
            <i className="ri-user-add-line" />
            Invitez des amis pour voir le classement complet !
          </p>
        </div>
      )}
    </div>
  );
}
