import { useMemo } from "react";
import type { UserProfile } from "../../../types";

// ─────────────────────────────────────────────────────────────
// ActivityHeatmap — GitHub-style calendar (90 derniers jours)
// ─────────────────────────────────────────────────────────────

interface DayCell {
  date: string | null;
  count: number;
  isToday: boolean;
  inRange: boolean;
}

interface Props {
  user: UserProfile;
}

const DOW_LABELS = ["L", "", "M", "", "V", "", "D"];

function buildActivityMap(user: UserProfile): Map<string, number> {
  const map = new Map<string, number>();
  const add = (rawDate: string, val: number) => {
    const d = rawDate.split("T")[0];
    map.set(d, (map.get(d) ?? 0) + val);
  };
  (user.examScores ?? []).forEach((s) => add(s.date, 3));
  (user.quizScores ?? []).forEach((s) => add(s.date, 2));
  (user.dailyChallenges ?? []).filter((c) => c.completed).forEach((c) => add(c.date, 3));
  (user.cardStats ?? []).forEach((s) => add(s.lastSeen, 1));
  return map;
}

function getCellColor(count: number): string {
  if (count === 0) return "#F3F4F6";
  if (count <= 2)  return "#BBF7D0";
  if (count <= 5)  return "#4ADE80";
  return "#16A34A";
}

function getCellTitle(date: string | null, count: number, isToday: boolean): string {
  if (!date) return "";
  const label = new Date(date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
  if (isToday) return `Aujourd'hui · ${count} activité${count > 1 ? "s" : ""}`;
  if (count === 0) return `${label} · Inactif`;
  return `${label} · ${count} activité${count > 1 ? "s" : ""}`;
}

export function ActivityHeatmap({ user }: Props) {
  const activityMap = useMemo(() => buildActivityMap(user), [user]);

  // Build the grid: weeks as columns, day-of-week as rows (Mon=0 … Sun=6)
  const grid = useMemo<DayCell[][]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];

    // Collect 91 days (today included)
    const days: DayCell[] = [];
    for (let i = 90; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      days.push({ date: ds, count: activityMap.get(ds) ?? 0, isToday: ds === todayStr, inRange: true });
    }

    // Pad the start so the first day aligns to Monday
    const firstDow = new Date(days[0].date!).getDay(); // 0=Sun
    const padCount = (firstDow + 6) % 7; // Mon=0 offset
    const padded: DayCell[] = [
      ...Array.from({ length: padCount }, () => ({ date: null, count: 0, isToday: false, inRange: false })),
      ...days,
    ];

    // Group into columns of 7 (each column = 1 week)
    const cols: DayCell[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
      const col = padded.slice(i, i + 7);
      while (col.length < 7) col.push({ date: null, count: 0, isToday: false, inRange: false });
      cols.push(col);
    }
    return cols;
  }, [activityMap]);

  const activeDays  = useMemo(() => [...activityMap.keys()].length, [activityMap]);
  const totalEvents = useMemo(() => [...activityMap.values()].reduce((a, v) => a + v, 0), [activityMap]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-line p-5 mb-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-neutral-ink">Activité — 90 derniers jours</h3>
          <p className="text-[11px] text-neutral-muted mt-0.5">
            {activeDays} jour{activeDays !== 1 ? "s" : ""} actif{activeDays !== 1 ? "s" : ""} · {totalEvents} action{totalEvents !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-neutral-400">Moins</span>
          {["#F3F4F6", "#BBF7D0", "#4ADE80", "#16A34A"].map((c) => (
            <div key={c} className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: c }} />
          ))}
          <span className="text-[10px] text-neutral-400">Plus</span>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="flex gap-0.5 min-w-fit">
          {/* Day-of-week labels */}
          <div className="flex flex-col gap-0.5 mr-1.5 shrink-0">
            {DOW_LABELS.map((label, i) => (
              <div
                key={i}
                style={{ width: 13, height: 13 }}
                className="flex items-center justify-end"
              >
                {label && <span className="text-[9px] text-neutral-400 leading-none">{label}</span>}
              </div>
            ))}
          </div>

          {/* Columns (weeks) */}
          {grid.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-0.5">
              {col.map((cell, ri) => {
                if (!cell.inRange || !cell.date) {
                  return <div key={ri} style={{ width: 13, height: 13 }} />;
                }
                return (
                  <div
                    key={ri}
                    title={getCellTitle(cell.date, cell.count, cell.isToday)}
                    style={{
                      width: 13,
                      height: 13,
                      backgroundColor: getCellColor(cell.count),
                      borderRadius: 2,
                      outline: cell.isToday ? "1.5px solid #1A7BAD" : undefined,
                      outlineOffset: cell.isToday ? "1px" : undefined,
                      cursor: "default",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Month labels — computed dynamically */}
      <MonthLabels grid={grid} />
    </div>
  );
}

// Lightweight month name labels below the heatmap
function MonthLabels({ grid }: { grid: DayCell[][] }) {
  const labels = useMemo(() => {
    const seen = new Set<string>();
    return grid.map((col) => {
      const firstReal = col.find((c) => c.inRange && c.date);
      if (!firstReal?.date) return null;
      const month = firstReal.date.slice(0, 7); // "YYYY-MM"
      if (seen.has(month)) return null;
      seen.add(month);
      return new Date(firstReal.date).toLocaleDateString("fr-FR", { month: "short" });
    });
  }, [grid]);

  return (
    <div className="flex gap-0.5 mt-1.5 ml-[22px]">
      {labels.map((label, ci) => (
        <div key={ci} style={{ width: 13 }} className="overflow-visible">
          {label && (
            <span className="text-[9px] text-neutral-400 whitespace-nowrap">{label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
