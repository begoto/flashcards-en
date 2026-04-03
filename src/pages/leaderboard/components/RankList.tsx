import { Flame, BookOpen, Award } from "lucide-react";
import { AVATAR_COLORS } from "@/mocks/leaderboard";
import type { LeaderEntry } from "./Podium";

// ─────────────────────────────────────────────────────────────
// RankList — Liste des classés à partir du rang 4
// ─────────────────────────────────────────────────────────────

type SortKey = "streak" | "badges" | "cards";

interface Props {
  entries: LeaderEntry[];
  startRank: number;
  sortKey: SortKey;
  colorIndexFor: (id: string) => number;
}

function ScorePill({ entry, sortKey }: { entry: LeaderEntry; sortKey: SortKey }) {
  if (sortKey === "streak") {
    return (
      <span
        className={[
          "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0",
          entry.streak >= 14 ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" :
          entry.streak >= 7  ? "bg-amber-100  dark:bg-amber-900/30  text-amber-600  dark:text-amber-400"  :
                               "bg-neutral-100 dark:bg-slate-700    text-neutral-500 dark:text-slate-400",
        ].join(" ")}
      >
        <Flame size={11} />
        {entry.streak}j
      </span>
    );
  }
  if (sortKey === "badges") {
    return (
      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
        <Award size={11} />
        {entry.badgeCount}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
      <BookOpen size={11} />
      {entry.totalCards}
    </span>
  );
}

export function RankList({ entries, startRank, sortKey, colorIndexFor }: Props) {
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 mt-4">
      {entries.map((entry, i) => {
        const rank = startRank + i;
        const colorIdx = colorIndexFor(entry.id);

        return (
          <div
            key={entry.id}
            className={[
              "flex items-center gap-3 px-3 py-3 rounded-xl border transition-all",
              entry.isCurrentUser
                ? "bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/40 dark:to-cyan-950/40 border-sky-200 dark:border-sky-800"
                : "bg-white dark:bg-slate-800/60 border-neutral-100 dark:border-slate-700 hover:border-neutral-200 dark:hover:border-slate-600",
            ].join(" ")}
          >
            {/* Rang */}
            <div className="w-8 shrink-0 flex items-center justify-center">
              <span className="text-xs font-bold text-neutral-400 dark:text-slate-500 w-6 h-6 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-slate-700">
                {rank}
              </span>
            </div>

            {/* Avatar */}
            <div
              className={[
                "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 overflow-hidden",
                `bg-gradient-to-br ${AVATAR_COLORS[colorIdx % AVATAR_COLORS.length]}`,
              ].join(" ")}
            >
              {entry.avatar ? (
                <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
              ) : (
                entry.name.charAt(0).toUpperCase()
              )}
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p
                  className={[
                    "text-sm font-semibold truncate",
                    entry.isCurrentUser ? "text-sky-700 dark:text-sky-300" : "text-neutral-800 dark:text-slate-200",
                  ].join(" ")}
                >
                  {entry.name}
                </p>
                {entry.isCurrentUser && (
                  <span className="text-[9px] font-black bg-sky-400 text-white px-1.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    Vous
                  </span>
                )}
                {entry.isDemo && (
                  <span className="text-[9px] font-semibold bg-neutral-200 dark:bg-slate-600 text-neutral-400 dark:text-slate-400 px-1.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    démo
                  </span>
                )}
              </div>
              {/* Stats secondaires */}
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {sortKey !== "streak" && (
                  <span className="text-[10px] text-neutral-400 dark:text-slate-500 flex items-center gap-0.5">
                    <Flame size={9} className="shrink-0" />
                    {entry.streak}j
                  </span>
                )}
                {sortKey !== "badges" && entry.badgeCount > 0 && (
                  <span className="text-[10px] text-neutral-400 dark:text-slate-500">
                    🏅 {entry.badgeCount}
                  </span>
                )}
                {sortKey !== "cards" && (
                  <span className="text-[10px] text-neutral-400 dark:text-slate-500 flex items-center gap-0.5">
                    <BookOpen size={9} className="shrink-0" />
                    {entry.totalCards}
                  </span>
                )}
              </div>
            </div>

            {/* Score principal */}
            <ScorePill entry={entry} sortKey={sortKey} />
          </div>
        );
      })}
    </div>
  );
}
