import { NavLink } from "react-router-dom";
import { BookOpen, Brain, ClipboardCheck, BarChart3, User, BookMarked, Zap, CalendarCheck, Trophy } from "lucide-react";

const NAV_ITEMS = [
  { label: "Stats",      path: "/dashboard",        icon: BarChart3,      accent: "none"    },
  { label: "Étudier",    path: "/study",           icon: BookOpen,       accent: "none"    },
  { label: "Quiz",       path: "/quiz",             icon: Brain,          accent: "none"    },
  { label: "Examen",     path: "/exam",             icon: ClipboardCheck, accent: "none"    },
  { label: "Cartes",     path: "/mycards",          icon: BookMarked,     accent: "none"    },
  { label: "Révision",   path: "/smart-review",     icon: Zap,            accent: "amber"   },
  { label: "Défi",       path: "/daily-challenge",  icon: CalendarCheck,  accent: "emerald" },
  { label: "Classement", path: "/leaderboard",      icon: Trophy,         accent: "gold"    },
  { label: "Profil",     path: "/profile",          icon: User,           accent: "none"    },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-neutral-line dark:border-slate-700 safe-bottom">
      <div className="flex items-center overflow-x-auto scrollbar-hide h-16 px-1 gap-0.5">
        {NAV_ITEMS.map(({ label, path, icon: Icon, accent }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              [
                "flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition-all duration-150 shrink-0 w-[calc(100vw/6)]",
                isActive
                  ? accent === "amber"   ? "text-amber-600 dark:text-amber-400"
                  : accent === "emerald" ? "text-emerald-600 dark:text-emerald-400"
                  : accent === "gold"    ? "text-yellow-600 dark:text-yellow-400"
                  : "text-[#5BAED6] dark:text-sky-400"
                  : accent === "amber"   ? "text-amber-500 dark:text-amber-500"
                  : accent === "emerald" ? "text-emerald-500 dark:text-emerald-500"
                  : accent === "gold"    ? "text-yellow-500 dark:text-yellow-500"
                  : "text-neutral-muted dark:text-slate-500",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <div className={[
                  "w-9 h-9 flex items-center justify-center rounded-xl transition-colors",
                  isActive
                    ? accent === "amber"   ? "bg-amber-100 dark:bg-amber-900/40"
                    : accent === "emerald" ? "bg-emerald-100 dark:bg-emerald-900/40"
                    : accent === "gold"    ? "bg-yellow-100 dark:bg-yellow-900/40"
                    : "bg-[#C9E8F6] dark:bg-sky-900/40"
                    : "",
                ].join(" ")}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className="text-[9px] font-semibold whitespace-nowrap">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
