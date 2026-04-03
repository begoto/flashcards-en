import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "Application",
    links: [
      { label: "Mode Étude", href: "/auth" },
      { label: "Quiz", href: "/auth" },
      { label: "Mode Examen", href: "/auth" },
      { label: "Révision intelligente", href: "/auth" },
      { label: "Défi du jour", href: "/auth" },
    ],
  },
  {
    title: "Fonctionnalités",
    links: [
      { label: "Flashcards", href: "#features" },
      { label: "Statistiques", href: "#features" },
      { label: "Badges", href: "#badges" },
      { label: "Streak", href: "#badges" },
      { label: "Mes cartes", href: "/auth" },
    ],
  },
  {
    title: "Commencer",
    links: [
      { label: "Créer un compte", href: "/auth" },
      { label: "Se connecter", href: "/auth" },
      { label: "Comment ça marche", href: "#how" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="bg-gray-900 dark:bg-slate-950 border-t border-gray-800 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky-400 flex items-center justify-center">
                <i className="ri-stack-fill text-white text-sm" />
              </div>
              <span className="font-bold text-white text-lg">FlashLearn</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              La méthode flashcard pour apprendre plus vite, retenir plus longtemps.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                        rel="nofollow"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                        rel="nofollow"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} FlashLearn. Tous droits réservés.
          </p>
          <p className="text-xs text-gray-600">
            Application entièrement gratuite · Données 100% locales
          </p>
        </div>
      </div>
    </footer>
  );
}
