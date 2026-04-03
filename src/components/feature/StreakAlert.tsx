import { useState, useMemo } from "react";
import { Flame, X, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ─────────────────────────────────────────────────────────────
// StreakAlert — Bannière d'alerte affichée quand le streak
// risque d'être brisé (dernier jour actif = hier, pas encore
// pratiqué aujourd'hui). Dismissible pour la session courante.
// ─────────────────────────────────────────────────────────────

export function StreakAlert() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  /**
   * Le streak est "à risque" quand :
   * - L'utilisateur a un streak > 0
   * - Il n'a PAS encore pratiqué aujourd'hui
   * - Sa dernière activité était exactement hier (streak intact mais en danger)
   */
  const isAtRisk = useMemo(() => {
    if (!user || (user.streak ?? 0) === 0) return false;
    const today = new Date().toISOString().split("T")[0];
    if (user.lastActiveDate === today) return false;         // Déjà pratiqué aujourd'hui
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return user.lastActiveDate === yesterday.toISOString().split("T")[0];
  }, [user]);

  if (!isAtRisk || dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 px-4 py-3 flex items-center justify-between gap-3 animate-pulse-once">
      {/* Contenu gauche : icône + message */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/25 shrink-0">
          <Flame size={16} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-tight">
            Votre streak de {user?.streak} jour{(user?.streak ?? 0) > 1 ? "s" : ""} est en danger !
          </p>
          <p className="text-xs text-white/80 hidden sm:block">
            Pratiquez au moins une session aujourd'hui pour maintenir votre série.
          </p>
        </div>
      </div>

      {/* Actions droite */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          to="/study"
          className="flex items-center gap-1.5 text-xs font-bold bg-white text-orange-500 hover:bg-orange-50 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
        >
          <BookOpen size={13} />
          Pratiquer
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 transition-colors cursor-pointer text-white"
          aria-label="Fermer l'alerte streak"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
