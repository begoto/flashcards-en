import { useMemo } from "react";
import { Trophy, Lock, Star } from "lucide-react";
import { BADGE_DEFINITIONS } from "../../../mocks/badges";
import type { UserBadge } from "../../../types";

interface Props {
  badges: UserBadge[];
}

export function BadgesSection({ badges }: Props) {
  const unlockedIds = useMemo(() => new Set(badges.map((b) => b.id)), [badges]);
  const unlocked    = BADGE_DEFINITIONS.filter((d) => unlockedIds.has(d.id));
  const locked      = BADGE_DEFINITIONS.filter((d) => !unlockedIds.has(d.id));
  const pct         = Math.round((unlocked.length / BADGE_DEFINITIONS.length) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-neutral-line dark:border-slate-700 overflow-hidden">

      {/* En-tête */}
      <div className="px-6 py-5 border-b border-neutral-line dark:border-slate-700 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center">
            <Trophy size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-ink dark:text-slate-100">Badges &amp; Trophées</h2>
            <p className="text-xs text-neutral-muted dark:text-slate-400">{unlocked.length} / {BADGE_DEFINITIONS.length} débloqués</p>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="flex items-center gap-3 min-w-[180px] flex-1 max-w-xs">
          <div className="flex-1 h-2 bg-neutral-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 shrink-0">{pct}%</span>
        </div>
      </div>

      <div className="p-6">

        {/* Badges débloqués */}
        {unlocked.length > 0 && (
          <div className="mb-6">
            <p className="text-[11px] font-bold text-neutral-muted dark:text-slate-500 uppercase tracking-widest mb-3">
              Débloqués ({unlocked.length})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {unlocked.map((def) => {
                const ub = badges.find((b) => b.id === def.id);
                return (
                  <div
                    key={def.id}
                    className="group flex flex-col items-center gap-2 rounded-2xl p-4 border border-transparent hover:scale-[1.03] transition-all duration-200 cursor-default"
                    style={{ backgroundColor: def.color }}
                  >
                    {/* Icône du badge — on garde l'emoji du badge car c'est décoratif et défini dans BADGE_DEFINITIONS */}
                    <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center text-2xl">
                      {def.emoji}
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-bold leading-tight ${def.textColor}`}>{def.label}</p>
                      <p className="text-[10px] text-neutral-600 mt-0.5 leading-tight">{def.description}</p>
                    </div>
                    {ub && (
                      <p className="text-[9px] text-neutral-500 font-semibold flex items-center gap-1">
                        <Star size={9} />
                        {new Date(ub.unlockedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Badges verrouillés */}
        {locked.length > 0 && (
          <div>
            <p className="text-[11px] font-bold text-neutral-muted dark:text-slate-500 uppercase tracking-widest mb-3">
              À débloquer ({locked.length})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {locked.map((def) => (
                <div
                  key={def.id}
                  className="flex flex-col items-center gap-2 rounded-2xl p-4 border border-dashed border-neutral-200 dark:border-slate-700 bg-neutral-50 dark:bg-slate-800/40 cursor-default opacity-70"
                >
                  <div className="w-12 h-12 bg-neutral-200 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <Lock size={18} className="text-neutral-400 dark:text-slate-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-neutral-400 dark:text-slate-500 leading-tight">{def.label}</p>
                    <p className="text-[10px] text-neutral-300 dark:text-slate-600 mt-0.5 leading-tight">{def.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aucun badge encore */}
        {unlocked.length === 0 && (
          <div className="text-center py-10">
            <div className="w-16 h-16 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 rounded-2xl mx-auto mb-3">
              <Trophy size={32} className="text-amber-500" />
            </div>
            <p className="text-sm font-bold text-neutral-ink dark:text-slate-200">Aucun badge pour l&apos;instant</p>
            <p className="text-xs text-neutral-muted dark:text-slate-400 mt-1">
              Complétez des sessions pour débloquer vos premiers trophées !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}