import { Link } from "react-router-dom";

export function CtaSection() {
  return (
    <section className="py-24 bg-slate-50/60 dark:bg-slate-900/40">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Card */}
        <div className="bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl p-12 md:p-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Prêt à apprendre plus efficacement ?
            </h2>
            <p className="text-sky-100 mt-4 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Rejoignez FlashLearn gratuitement et commencez à étudier dès maintenant.
              Aucune carte bancaire, aucun engagement.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth"
                className="bg-white text-sky-500 font-bold px-8 py-3.5 rounded-lg hover:bg-sky-50 transition-colors whitespace-nowrap cursor-pointer text-base"
              >
                Créer mon compte gratuit
              </Link>
              <Link
                to="/auth"
                className="text-white/90 hover:text-white font-medium px-8 py-3.5 rounded-lg border border-white/30 hover:bg-white/10 transition-colors whitespace-nowrap cursor-pointer text-base"
              >
                Se connecter →
              </Link>
            </div>
            <p className="text-sky-100/70 text-xs mt-6">
              Gratuit pour toujours · Données stockées localement · Aucune inscription email obligatoire
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
