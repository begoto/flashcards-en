import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Brain,
  ClipboardCheck,
  BarChart3,
  User,
  LogOut,
  ChevronDown,
  BookMarked,
  Zap,
  CalendarCheck,
  Sun,
  Moon,
  Settings,
  Trophy,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const NAV_ITEMS = [
  { label: "Dashboard",    path: "/dashboard",        icon: BarChart3,      color: null },
  { label: "Étudier",      path: "/study",            icon: BookOpen,       color: null },
  { label: "Quiz",         path: "/quiz",             icon: Brain,          color: null },
  { label: "Examen",       path: "/exam",             icon: ClipboardCheck, color: null },
  { label: "Mes Cartes",   path: "/mycards",          icon: BookMarked,     color: null },
  { label: "Révision",     path: "/smart-review",     icon: Zap,            color: "amber" },
  { label: "Défi du jour", path: "/daily-challenge",  icon: CalendarCheck,  color: "emerald" },
  { label: "Classement",   path: "/leaderboard",      icon: Trophy,         color: "gold" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
    setDropdownOpen(false);
  };

  return (
    <header
      className={[
        "hidden md:flex sticky top-0 z-40 w-full h-16",
        "bg-white dark:bg-slate-900 border-b border-neutral-line dark:border-slate-700",
        "items-center justify-between px-6 transition-all duration-200",
        scrolled ? "shadow-sm" : "",
      ].join(" ")}
    >
      {/* Logo */}
      <NavLink to="/study" className="flex items-center gap-2.5 shrink-0">
        <img
          src="https://public.readdy.ai/ai/img_res/dc3c08c6-47d6-4bc0-95c2-a64c6fefc6d3.png"
          alt="FlashCards EN Logo"
          className="h-9 w-auto object-contain"
        />
      </NavLink>

      <nav className="flex items-center gap-0.5">
        {NAV_ITEMS.map(({ label, path, icon: Icon, color }) => {
          const isAmber   = color === "amber";
          const isEmerald = color === "emerald";
          const isGold    = color === "gold";
          return (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                [
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 whitespace-nowrap",
                  isActive && isAmber
                    ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
                    : isActive && isEmerald
                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                    : isActive && isGold
                    ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400"
                    : isActive
                    ? "bg-[#C9E8F6] dark:bg-sky-900/40 text-[#1A7BAD] dark:text-sky-400"
                    : isAmber
                    ? "text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    : isEmerald
                    ? "text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    : isGold
                    ? "text-yellow-600 dark:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    : "text-neutral-muted dark:text-slate-400 hover:bg-neutral-soft dark:hover:bg-slate-800 hover:text-neutral-ink dark:hover:text-slate-200",
                ].join(" ")
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          );
        })}
      </nav>

      {/* Droite : toggle dark + profil */}
      <div className="flex items-center gap-2">
        {/* Toggle Dark Mode */}
        <button
          onClick={toggleTheme}
          className={[
            "w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer",
            isDark
              ? "bg-slate-700 text-yellow-400 hover:bg-slate-600"
              : "bg-neutral-soft text-neutral-muted hover:bg-[#C9E8F6] hover:text-[#1A7BAD]",
          ].join(" ")}
          aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
          title={isDark ? "Mode clair" : "Mode sombre"}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Profil utilisateur */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-neutral-soft dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Menu profil"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#C9E8F6] dark:bg-sky-900 flex items-center justify-center shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-[#1A7BAD] dark:text-sky-400" />
              )}
            </div>
            <span className="text-sm font-semibold text-neutral-ink dark:text-slate-200 max-w-[120px] truncate">
              {user?.name ?? "Utilisateur"}
            </span>
            <ChevronDown size={14} className="text-neutral-muted dark:text-slate-400" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 border border-neutral-line dark:border-slate-700 rounded-xl z-20 overflow-hidden shadow-lg">
                <NavLink
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-neutral-ink dark:text-slate-200 hover:bg-neutral-soft dark:hover:bg-slate-700 transition-colors"
                >
                  <User size={16} className="text-neutral-muted dark:text-slate-400" />
                  Mon profil
                </NavLink>
                <NavLink
                  to="/leaderboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-neutral-ink dark:text-slate-200 hover:bg-neutral-soft dark:hover:bg-slate-700 transition-colors"
                >
                  <Trophy size={16} className="text-amber-500" />
                  Classement
                </NavLink>
                <NavLink
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-neutral-ink dark:text-slate-200 hover:bg-neutral-soft dark:hover:bg-slate-700 transition-colors"
                >
                  <Settings size={16} className="text-neutral-muted dark:text-slate-400" />
                  Paramètres
                </NavLink>
                {/* Dark mode toggle dans le menu aussi */}
                <button
                  onClick={() => { toggleTheme(); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-neutral-ink dark:text-slate-200 hover:bg-neutral-soft dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {isDark
                    ? <Sun size={16} className="text-yellow-500" />
                    : <Moon size={16} className="text-slate-500" />
                  }
                  {isDark ? "Mode clair" : "Mode sombre"}
                </button>
                <div className="border-t border-neutral-line dark:border-slate-700" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
