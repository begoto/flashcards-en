import { Navigate, Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/feature/Navbar";
import { MobileNav } from "../components/feature/MobileNav";
import { StreakAlert } from "../components/feature/StreakAlert";
import { NavProgressBar } from "../components/feature/NavProgressBar";
import { PageTransition } from "../components/feature/PageTransition";
import NotFound from "../pages/NotFound";
import AuthPage from "../pages/auth/page";
import StudyPage from "../pages/study/page";
import QuizPage from "../pages/quiz/page";
import ExamPage from "../pages/exam/page";
import DashboardPage from "../pages/dashboard/page";
import ProfilePage from "../pages/profile/page";
import MyCardsPage from "../pages/mycards/page";
import SmartReviewPage from "../pages/smart-review/page";
import DailyChallengePage from "../pages/daily-challenge/page";
import SettingsPage from "../pages/settings/page";
import LandingPage from "../pages/landing/page";
import LeaderboardPage from "../pages/leaderboard/page";

// ─── Layout protégé avec Navbar ───────────────────────────
function ProtectedLayout() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-[#87CEEB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/" replace />;
  return (
    <div className="min-h-screen bg-[#F8FBFF] dark:bg-slate-950 font-sans">
      <NavProgressBar />
      <Navbar />
      <StreakAlert />
      <main className="md:py-6">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <MobileNav />
    </div>
  );
}

// ─── Route racine — landing pour visiteurs, dashboard pour connectés ─
function RootRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-[#87CEEB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
}

const routes: RouteObject[] = [
  { path: "/", element: <RootRoute /> },
  { path: "/auth", element: <AuthPage /> },
  {
    element: <ProtectedLayout />,
    children: [
      { path: "/study",           element: <StudyPage /> },
      { path: "/quiz",            element: <QuizPage /> },
      { path: "/exam",            element: <ExamPage /> },
      { path: "/dashboard",       element: <DashboardPage /> },
      { path: "/mycards",         element: <MyCardsPage /> },
      { path: "/profile",         element: <ProfilePage /> },
      { path: "/settings",        element: <SettingsPage /> },
      { path: "/smart-review",    element: <SmartReviewPage /> },
      { path: "/daily-challenge", element: <DailyChallengePage /> },
      { path: "/leaderboard",     element: <LeaderboardPage /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];

export default routes;
