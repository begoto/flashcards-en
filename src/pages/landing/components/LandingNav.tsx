import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

export function LandingNav() {
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Fonctionnalités" },
    { href: "#how", label: "Comment ça marche" },
    { href: "#badges", label: "Badges" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-sky-400 flex items-center justify-center">
            <i className="ri-stack-fill text-white text-sm" />
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">
            FlashLearn
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Basculer le mode sombre"
          >
            {isDark ? (
              <i className="ri-sun-line text-base" />
            ) : (
              <i className="ri-moon-line text-base" />
            )}
          </button>
          <Link
            to="/auth"
            className="hidden md:block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 transition-colors whitespace-nowrap cursor-pointer"
          >
            Se connecter
          </Link>
          <Link
            to="/auth"
            className="hidden md:block text-sm font-semibold bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Commencer gratuitement
          </Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <i className={`${mobileOpen ? "ri-close-line" : "ri-menu-line"} text-lg`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-slate-800">
            <Link
              to="/auth"
              className="flex-1 text-center text-sm border border-gray-200 dark:border-slate-700 rounded-lg py-2.5 text-gray-700 dark:text-gray-300 cursor-pointer whitespace-nowrap"
            >
              Se connecter
            </Link>
            <Link
              to="/auth"
              className="flex-1 text-center text-sm bg-sky-400 text-white rounded-lg py-2.5 font-semibold cursor-pointer whitespace-nowrap"
            >
              Commencer
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
