import { AVATAR_COLORS } from "@/mocks/leaderboard";

// ─────────────────────────────────────────────────────────────
// Podium — top 3 classement visuel animé
// ─────────────────────────────────────────────────────────────

export interface LeaderEntry {
  id: string;
  name: string;
  avatar: string | null;
  streak: number;
  badgeCount: number;
  totalCards: number;
  isDemo?: boolean;
  isCurrentUser?: boolean;
}

type SortKey = "streak" | "badges" | "cards";

const MEDALS = ["🥇", "🥈", "🥉"];
const PODIUM_HEIGHTS = ["h-32", "h-24", "h-20"];
const PODIUM_ORDER   = [1, 0, 2]; // afficher: 2e, 1er, 3e

const PODIUM_GRADIENTS = [
  "from-amber-400 to-yellow-500",
  "from-slate-300 to-slate-400",
  "from-orange-400 to-amber-500",
];

interface Props {
  top3: LeaderEntry[];
  sortKey: SortKey;
  colorIndexFor: (id: string) => number;
}

function formatValue(entry: LeaderEntry, sortKey: SortKey): string {
  if (sortKey === "streak")  return `${entry.streak}j`;
  if (sortKey === "badges")  return `${entry.badgeCount} 🏅`;
  return `${entry.totalCards} cartes`;
}

export function Podium({ top3, sortKey, colorIndexFor }: Props) {
  if (top3.length === 0) return null;

  return (
    <div className="flex items-end justify-center gap-3 md:gap-6 px-4 pb-0 pt-6 md:pt-10">
      {PODIUM_ORDER.map((realIdx) => {
        const entry = top3[realIdx];
        if (!entry) return <div key={realIdx} className="flex-1 max-w-[110px]" />;
        const colorIdx = colorIndexFor(entry.id);
        const isFirst = realIdx === 0;

        return (
          <div key={entry.id} className="flex flex-col items-center flex-1 max-w-[130px]">
            {/* Badge médaille */}
            <span className="text-2xl md:text-3xl mb-1">{MEDALS[realIdx]}</span>

            {/* Avatar */}
            <div
              className={[
                "relative rounded-full flex items-center justify-center font-bold text-white shadow-md overflow-hidden",
                isFirst ? "w-16 h-16 text-xl ring-4 ring-amber-300 ring-offset-2 dark:ring-offset-slate-950" : "w-12 h-12 text-base",
                `bg-gradient-to-br ${AVATAR_COLORS[colorIdx % AVATAR_COLORS.length]}`,
              ].join(" ")}
            >
              {entry.avatar ? (
                <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
              ) : (
                entry.name.charAt(0).toUpperCase()
              )}
              {entry.isCurrentUser && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] font-black bg-sky-400 text-white px-1 rounded-full whitespace-nowrap">
                  Vous
                </span>
              )}
            </div>

            {/* Nom */}
            <p
              className={[
                "mt-2 text-center font-bold truncate max-w-full px-1",
                isFirst
                  ? "text-sm md:text-base text-neutral-800 dark:text-white"
                  : "text-xs md:text-sm text-neutral-600 dark:text-slate-300",
              ].join(" ")}
            >
              {entry.name}
            </p>

            {/* Score */}
            <p
              className={[
                "text-xs font-semibold mb-2",
                isFirst ? "text-amber-600 dark:text-amber-400" : "text-neutral-400 dark:text-slate-500",
              ].join(" ")}
            >
              {formatValue(entry, sortKey)}
            </p>

            {/* Colonne podium */}
            <div
              className={[
                "w-full rounded-t-xl flex items-center justify-center font-black text-white/80 text-lg transition-all duration-500",
                PODIUM_HEIGHTS[realIdx],
                `bg-gradient-to-b ${PODIUM_GRADIENTS[realIdx]}`,
              ].join(" ")}
            >
              {realIdx + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
}
