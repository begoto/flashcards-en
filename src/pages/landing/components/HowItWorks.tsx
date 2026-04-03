const steps = [
  {
    number: "01",
    icon: "ri-user-add-line",
    title: "Créez votre compte",
    description:
      "Inscription gratuite et instantanée. Aucune carte bancaire requise. Votre progression est sauvegardée localement.",
    color: "bg-sky-50 dark:bg-sky-950/30",
    iconColor: "text-sky-500",
  },
  {
    number: "02",
    icon: "ri-book-open-line",
    title: "Choisissez votre mode",
    description:
      "Étude libre, Quiz, Examen chronométré, Révision intelligente ou Défi du jour. Six façons d'apprendre selon votre humeur.",
    color: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-500",
  },
  {
    number: "03",
    icon: "ri-line-chart-line",
    title: "Progressez et gagnez des badges",
    description:
      "Suivez vos stats en détail, maintenez votre streak quotidien et débloquez plus de 20 badges au fil de votre progression.",
    color: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-500",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="py-24 bg-slate-50/60 dark:bg-slate-900/40"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-sm font-semibold text-sky-500 uppercase tracking-widest">
            Comment ça marche
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3 tracking-tight">
            Commencez en 3 étapes
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-base">
            Pas de configuration complexe. Créez un compte et vous êtes prêt à apprendre.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gray-200 dark:bg-slate-700" />

          {steps.map((step, i) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              {/* Number + icon */}
              <div className="relative mb-6">
                <div
                  className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center`}
                >
                  <i className={`${step.icon} text-3xl ${step.iconColor}`} />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
