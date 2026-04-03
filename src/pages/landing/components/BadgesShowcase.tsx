import { Flame } from "lucide-react";

interface BadgePreview {
  emoji: string;
  label: string;
  description: string;
  color: string;
  textColor: string;
}

const badgePreviews: BadgePreview[] = [
  { emoji: "🌱", label: "Premier pas",     description: "Première session d'étude",  color: "#F0FFF4", textColor: "text-green-700"  },
  { emoji: "🔥", label: "Régulier",        description: "3 jours de streak",         color: "#FFF7ED", textColor: "text-orange-500" },
  { emoji: "⭐", label: "Premier 100% !",  description: "Score parfait en quiz",     color: "#FFFBEB", textColor: "text-yellow-600" },
  { emoji: "🏆", label: "Examen parfait",  description: "100% à un examen",          color: "#FEF9C3", textColor: "text-yellow-700" },
  { emoji: "📚", label: "Studieux",        description: "50 cartes étudiées",        color: "#F0F9FF", textColor: "text-sky-600"    },
  { emoji: "💯", label: "Centurion",       description: "100 cartes étudiées",       color: "#FFF1F2", textColor: "text-rose-600"   },
  { emoji: "🌟", label: "Une semaine !",   description: "7 jours de streak",         color: "#FEF3C7", textColor: "text-amber-600"  },
  { emoji: "🎓", label: "Expert",          description: "500 cartes étudiées",       color: "#FAF5FF", textColor: "text-violet-600" },
  { emoji: "🚀", label: "Inarrêtable",     description: "30 jours de streak",        color: "#F5F3FF", textColor: "text-violet-600" },
  { emoji: "👑", label: "Maître",          description: "1000 cartes étudiées",      color: "#FFFBEB", textColor: "text-amber-700"  },
  { emoji: "💎", label: "Perfectionniste", description: "5 résultats parfaits",      color: "#EFF6FF", textColor: "text-sky-700"    },
  { emoji: "💫", label: "Défi parfait",    description: "5/5 au défi du jour",       color: "#FFF7ED", textColor: "text-orange-600" },
];

export function BadgesShowcase() {
  return (
    <section id="badges" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-sm font-semibold text-sky-500 uppercase tracking-widest">
            Gamification
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3 tracking-tight">
            Débloquez plus de 20 badges
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-base leading-relaxed">
            Chaque action compte. Étudiez régulièrement, obtenez des scores parfaits et maintenez
            votre streak pour collecter des badges uniques.
          </p>
        </div>

        {/* Badges grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {badgePreviews.map((badge) => (
            <div
              key={badge.label}
              className="group flex flex-col items-center text-center p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gray-200 dark:hover:border-slate-700 transition-all duration-200 cursor-default"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3"
                style={{ backgroundColor: badge.color }}
              >
                {badge.emoji}
              </div>
              <div className={`text-xs font-semibold ${badge.textColor} mb-1`}>
                {badge.label}
              </div>
              <div className="text-xs text-gray-400 leading-tight">
                {badge.description}
              </div>
            </div>
          ))}
        </div>

        {/* Streak teaser */}
        <div className="mt-14 max-w-2xl mx-auto bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-100 dark:border-amber-900/40 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 flex items-center justify-center bg-orange-100 dark:bg-orange-900/40 rounded-2xl mx-auto mb-4">
            <Flame size={36} className="text-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Gardez votre streak vivant
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Connectez-vous et étudiez chaque jour pour maintenir votre streak.
            Plus il monte, plus les badges rares se débloquent. Ne brisez pas la chaîne !
          </p>
        </div>
      </div>
    </section>
  );
}
