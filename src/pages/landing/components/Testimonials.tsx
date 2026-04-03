const TESTIMONIALS = [
  {
    name: "Sophie Marchand",
    role: "Étudiante en licence d'anglais",
    avatar: "https://readdy.ai/api/search-image?query=young%20french%20woman%20student%20smiling%20portrait%2C%20natural%20soft%20light%2C%20clean%20white%20background%2C%20casual%20style%2C%20confident%20expression%2C%20professional%20headshot%20photography%2C%2025%20years%20old&width=120&height=120&seq=avatar-sophie-001&orientation=squarish",
    quote: "En 3 semaines j'ai augmenté mon score au TOEIC de 120 points. Les flashcards avec la révision intelligente sont vraiment efficaces, ça cible exactement les mots que je n'arrive pas à retenir.",
    stats: { streak: 21, cards: 340, badge: "Expert" },
    stars: 5,
    highlight: "text-sky-600",
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-200 dark:border-sky-800/40",
  },
  {
    name: "Thomas Leroy",
    role: "Développeur web — préparation entretiens",
    avatar: "https://readdy.ai/api/search-image?query=young%20french%20man%20professional%20smiling%20portrait%2C%20natural%20light%2C%20clean%20neutral%20background%2C%20smart%20casual%20style%2C%20approachable%20expression%2C%20headshot%20photography%2C%2030%20years%20old&width=120&height=120&seq=avatar-thomas-002&orientation=squarish",
    quote: "J'avais besoin d'améliorer mon anglais technique rapidement pour des entretiens. Le mode Examen m'a permis de simuler des conditions réelles. Je recommande à tous mes collègues devs !",
    stats: { streak: 14, cards: 512, badge: "Inarrêtable" },
    stars: 5,
    highlight: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800/40",
  },
  {
    name: "Amira Benali",
    role: "Professeure de collège",
    avatar: "https://readdy.ai/api/search-image?query=french%20north%20african%20woman%20teacher%20smiling%20portrait%2C%20warm%20natural%20light%2C%20clean%20background%2C%20professional%20style%2C%20kind%20approachable%20expression%2C%20headshot%20photography%2C%2035%20years%20old&width=120&height=120&seq=avatar-amira-003&orientation=squarish",
    quote: "J'utilise FlashCards EN avec mes élèves de 4e. Le défi quotidien les motive énormément — ils adorent comparer leurs streaks. Le dashboard m'aide à voir qui progresse vraiment.",
    stats: { streak: 45, cards: 890, badge: "Maître" },
    stars: 5,
    highlight: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800/40",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <i
          key={i}
          className={["ri-star-fill text-sm", i < n ? "text-amber-400" : "text-gray-200 dark:text-slate-700"].join(" ")}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-slate-50/60 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-sm font-semibold text-sky-500 uppercase tracking-widest">
            Témoignages
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3 tracking-tight">
            Ils progressent chaque jour
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-base leading-relaxed">
            Des apprenants de tous horizons utilisent FlashCards EN pour atteindre leurs objectifs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className={[
                "flex flex-col rounded-2xl border p-6 gap-5 transition-all duration-200 hover:scale-[1.01]",
                t.bg, t.border,
              ].join(" ")}
            >
              {/* Quote mark */}
              <i className="ri-double-quotes-l text-4xl text-gray-200 dark:text-slate-700 leading-none -mb-2" />

              {/* Review text */}
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Stars */}
              <Stars n={t.stars} />

              {/* Divider */}
              <div className="w-full h-px bg-gray-200 dark:bg-slate-700" />

              {/* Author row */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-slate-800">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{t.name}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 truncate">{t.role}</p>
                </div>
              </div>

              {/* Stats badges */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 bg-white/70 dark:bg-slate-800/60 border border-white dark:border-slate-700 rounded-full px-2.5 py-1">
                  <i className="ri-fire-line text-orange-500 text-xs" />
                  <span className="text-[11px] font-bold text-gray-600 dark:text-slate-300">{t.stats.streak} jours streak</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/70 dark:bg-slate-800/60 border border-white dark:border-slate-700 rounded-full px-2.5 py-1">
                  <i className="ri-book-open-line text-sky-500 text-xs" />
                  <span className="text-[11px] font-bold text-gray-600 dark:text-slate-300">{t.stats.cards} cartes</span>
                </div>
                <div className={["flex items-center gap-1.5 bg-white/70 dark:bg-slate-800/60 border border-white dark:border-slate-700 rounded-full px-2.5 py-1"].join(" ")}>
                  <i className="ri-award-line text-amber-500 text-xs" />
                  <span className={["text-[11px] font-bold", t.highlight].join(" ")}>{t.stats.badge}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom social proof bar */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-center">
          {[
            { icon: "ri-user-star-line", value: "2 400+",  label: "apprenants actifs",   color: "text-sky-500"     },
            { icon: "ri-stack-line",     value: "500+",     label: "flashcards dispo",    color: "text-emerald-500" },
            { icon: "ri-fire-line",      value: "7 jours",  label: "streak moyen",        color: "text-orange-500"  },
            { icon: "ri-trophy-line",    value: "20+",      label: "badges à débloquer",  color: "text-amber-500"   },
          ].map(({ icon, value, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className={["w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl", color].join(" ")}>
                <i className={`${icon} text-lg`} />
              </div>
              <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">{value}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">{label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
