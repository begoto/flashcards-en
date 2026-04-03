interface Feature {
  emoji: string;
  title: string;
  description: string;
  color: string;
  darkColor: string;
  accent: string;
}

const features: Feature[] = [
  {
    emoji: "🃏",
    title: "Flashcards",
    description:
      "Étudiez avec des cartes recto-verso. Retournez la carte, évaluez-vous et marquez les cartes à revoir.",
    color: "bg-sky-50",
    darkColor: "dark:bg-sky-950/30",
    accent: "text-sky-600",
  },
  {
    emoji: "🎯",
    title: "Quiz",
    description:
      "Testez vos connaissances avec des questions à choix multiples et suivez votre score en temps réel.",
    color: "bg-emerald-50",
    darkColor: "dark:bg-emerald-950/30",
    accent: "text-emerald-600",
  },
  {
    emoji: "📝",
    title: "Mode Examen",
    description:
      "Simulez les conditions d'examen avec un chronomètre. Préparez-vous dans les vraies conditions.",
    color: "bg-amber-50",
    darkColor: "dark:bg-amber-950/30",
    accent: "text-amber-600",
  },
  {
    emoji: "🧠",
    title: "Révision intelligente",
    description:
      "Algorithme de répétition espacée qui vous présente les cartes les plus difficiles en priorité.",
    color: "bg-violet-50",
    darkColor: "dark:bg-violet-950/30",
    accent: "text-violet-600",
  },
  {
    emoji: "☀️",
    title: "Défi du jour",
    description:
      "Un nouveau défi chaque matin avec une sélection de cartes. Maintenez votre streak et progressez chaque jour.",
    color: "bg-rose-50",
    darkColor: "dark:bg-rose-950/30",
    accent: "text-rose-500",
  },
  {
    emoji: "📊",
    title: "Statistiques",
    description:
      "Tableau de bord complet avec vos scores, maîtrise par carte, historique et comparaisons. Visualisez vos progrès.",
    color: "bg-indigo-50",
    darkColor: "dark:bg-indigo-950/30",
    accent: "text-indigo-600",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 bg-white dark:bg-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-sky-500 uppercase tracking-widest">
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3 tracking-tight">
            Tout ce qu&apos;il faut pour apprendre efficacement
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-base leading-relaxed">
            Six modes complémentaires pour s&apos;adapter à chaque moment d&apos;apprentissage,
            du révision rapide à la préparation intensive.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-gray-200 dark:hover:border-slate-700 transition-all duration-200"
            >
              <div
                className={`w-12 h-12 rounded-xl ${f.color} ${f.darkColor} flex items-center justify-center text-2xl mb-5`}
              >
                {f.emoji}
              </div>
              <h3 className={`text-base font-semibold ${f.accent} mb-2`}>
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
