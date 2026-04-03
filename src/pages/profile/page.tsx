import { useState, useRef } from "react";
import {
  User, Mail, Camera, LogOut, Save, Shield, Edit3,
  BookMarked, ArrowRight, Flame, Trophy, Star, TrendingUp,
  CalendarCheck, Brain, ClipboardCheck, Zap, Target, Settings,
} from "lucide-react";
import { Button } from "../../components/base/Button";
import { Input } from "../../components/base/Input";
import { Modal } from "../../components/base/Modal";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";import { BADGE_DEFINITIONS } from "../../mocks/badges";
import { ActivityHeatmap } from "./components/ActivityHeatmap";

// ─────────────────────────────────────────────────────────────
// Page Profil — Redesign complet avec onglets
// Aperçu | Badges | Statistiques
// ─────────────────────────────────────────────────────────────

type Tab = "overview" | "badges" | "stats";

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [tab, setTab]           = useState<Tab>("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [name, setName]         = useState(user?.name ?? "");
  const [nameError, setNameError] = useState("");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  const streak      = user?.streak ?? 0;
  const examScores  = user?.examScores ?? [];
  const quizScores  = user?.quizScores ?? [];
  const customCards = user?.customCards ?? [];
  const badges      = user?.badges ?? [];
  const challenges  = user?.dailyChallenges ?? [];

  const totalCardsStudied = (user?.cardStats ?? []).reduce((a, s) => a + s.correct + s.wrong, 0);
  const bestExam   = examScores.length ? Math.max(...examScores.map((s) => Math.round((s.score / s.total) * 100))) : null;
  const avgExam    = examScores.length ? Math.round(examScores.reduce((a, s) => a + (s.score / s.total) * 100, 0) / examScores.length) : null;
  const avgQuiz    = quizScores.length ? Math.round(quizScores.reduce((a, s) => a + (s.score / s.total) * 100, 0) / quizScores.length) : null;
  const perfectSessions = [
    ...examScores.filter((s) => s.score === s.total),
    ...quizScores.filter((s) => s.score === s.total),
  ].length;
  const challengesDone = challenges.filter((c) => c.completed).length;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onloadend = () => updateProfile({ avatar: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSaveName = () => {
    setNameError("");
    if (!name.trim()) { setNameError("Le nom ne peut pas être vide."); return; }
    setSaving(true);
    setTimeout(() => {
      updateProfile({ name: name.trim() });
      setSaving(false); setSaved(true);
      setEditOpen(false);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  const handleLogout = () => { logout(); navigate("/auth"); };

  // ── Avatar card (réutilisé en haut de chaque onglet) ──
  const AvatarCard = () => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-neutral-line dark:border-slate-700 p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#C9E8F6] to-[#87CEEB] flex items-center justify-center border-4 border-white ring-2 ring-[#87CEEB]/40">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={36} className="text-[#1A7BAD]" />
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1A7BAD] hover:bg-[#1568A0] flex items-center justify-center transition-colors cursor-pointer border-2 border-white shadow-sm"
            aria-label="Changer la photo de profil"
          >
            <Camera size={13} className="text-white" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>

        {/* Infos */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-neutral-ink dark:text-slate-100">{user?.name}</h2>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1">
            <Mail size={12} className="text-neutral-muted dark:text-slate-400" />
            <span className="text-sm text-neutral-muted dark:text-slate-400">{user?.email}</span>
          </div>
          {/* Streak pill */}
          <div className={[
            "inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full text-xs font-bold",
            streak >= 3 ? "bg-orange-100 text-orange-600" : "bg-neutral-100 text-neutral-500",
          ].join(" ")}>
            <Flame size={12} />
            {streak} jour{streak > 1 ? "s" : ""} de streak
          </div>
          {saved && <p className="text-xs text-green-600 mt-1.5 font-semibold">Profil mis à jour !</p>}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => { setName(user?.name ?? ""); setEditOpen(true); }} className="gap-1.5 whitespace-nowrap">
            <Edit3 size={13} /> Modifier
          </Button>
          <Link to="/settings" className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md border border-neutral-200 dark:border-slate-600 text-neutral-ink dark:text-slate-200 hover:bg-neutral-soft dark:hover:bg-slate-700 transition-colors whitespace-nowrap">
            <Settings size={13} /> Paramètres
          </Link>
          <Button variant="ghost" size="sm" onClick={() => setLogoutOpen(true)} className="gap-1.5 text-rose-500 hover:bg-rose-50 whitespace-nowrap">
            <LogOut size={13} /> Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 md:pb-10">
      <h1 className="text-2xl font-bold text-neutral-ink dark:text-slate-100 mb-5">Mon Profil</h1>

      {/* ─── Tabs ─── */}
      <div className="flex bg-neutral-100 dark:bg-slate-800 rounded-xl p-1 mb-6 gap-1">
        {([ 
          { key: "overview", label: "Aperçu",       icon: User },
          { key: "badges",   label: `Badges (${badges.length}/${BADGE_DEFINITIONS.length})`, icon: Trophy },
          { key: "stats",    label: "Statistiques", icon: TrendingUp },
        ] as { key: Tab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap",
              tab === key ? "bg-white dark:bg-slate-700 text-neutral-ink dark:text-slate-100 shadow-sm" : "text-neutral-muted dark:text-slate-400 hover:text-neutral-ink dark:hover:text-slate-200",
            ].join(" ")}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{key === "overview" ? "Aperçu" : key === "badges" ? "Badges" : "Stats"}</span>
          </button>
        ))}
      </div>

      {/* ─── Onglet Aperçu ─── */}
      {tab === "overview" && (
        <>
          <AvatarCard />

          {/* KPIs rapides */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Cartes étudiées", value: totalCardsStudied, icon: Brain,         color: "text-[#1A7BAD]",  bg: "bg-[#EDF7FD]" },
              { label: "Streak actuel",   value: `${streak}j`,       icon: Flame,         color: "text-orange-500", bg: "bg-orange-50" },
              { label: "Examens",         value: examScores.length,  icon: ClipboardCheck,color: "text-violet-600", bg: "bg-violet-50" },
              { label: "Défis complétés", value: challengesDone,     icon: Target,        color: "text-emerald-600",bg: "bg-emerald-50" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white dark:bg-slate-900 rounded-xl border border-neutral-line dark:border-slate-700 p-4 text-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${bg} mx-auto mb-2`}>
                  <Icon size={16} className={color} />
                </div>
                <p className="text-lg font-bold text-neutral-ink dark:text-slate-100">{value}</p>
                <p className="text-[11px] text-neutral-muted dark:text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Streak en détail */}
          <div className={[
            "flex items-center gap-4 rounded-2xl p-5 border mb-5",
            streak >= 7 ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 dark:border-orange-700/40"
            : streak >= 3 ? "bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-800/40"
            : "bg-white dark:bg-slate-900 border-neutral-line dark:border-slate-700",
          ].join(" ")}>
            <div className={["w-12 h-12 flex items-center justify-center rounded-2xl shrink-0 text-2xl",
              streak >= 7 ? "bg-orange-200" : streak >= 3 ? "bg-orange-100" : "bg-neutral-100"].join(" ")}>
              🔥
            </div>
            <div className="flex-1">
              <p className="font-bold text-neutral-ink dark:text-slate-100">{streak} jour{streak !== 1 ? "s" : ""} consécutifs</p>
              <p className="text-sm text-neutral-muted dark:text-slate-400 mt-0.5">
                {streak === 0  ? "Lancez une session aujourd'hui pour démarrer !"
                : streak < 3  ? "Continuez — 3 jours pour débloquer votre premier badge streak."
                : streak < 7  ? "Belle régularité ! Prochain cap : 7 jours."
                : streak < 14 ? "Superbe ! Prochain cap : 14 jours 💪"
                : streak < 30 ? "Impressionnant ! Prochain cap : 30 jours 🚀"
                : "Inarrêtable ! 🚀🔥"}
              </p>
              {/* Barre de paliers */}
              <div className="flex gap-1.5 mt-3">
                {[3, 7, 14, 30].map((milestone) => (
                  <div
                    key={milestone}
                    className={[
                      "flex-1 h-1.5 rounded-full transition-colors",
                      streak >= milestone ? "bg-orange-400" : "bg-neutral-200",
                    ].join(" ")}
                    title={`${milestone} jours`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {[3, 7, 14, 30].map((m) => (
                  <span key={m} className={["text-[9px] font-bold", streak >= m ? "text-orange-500" : "text-neutral-300"].join(" ")}>
                    {m}j
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { to: "/mycards",        icon: BookMarked, bg: "bg-[#C9E8F6]", ic: "text-[#1A7BAD]", label: "Mes cartes", sub: `${customCards.length} carte${customCards.length !== 1 ? "s" : ""} personnalisée${customCards.length !== 1 ? "s" : ""}` },
              { to: "/daily-challenge",icon: CalendarCheck, bg: "bg-emerald-100", ic: "text-emerald-700", label: "Défi du jour", sub: challengesDone > 0 ? `${challengesDone} défi${challengesDone > 1 ? "s" : ""} accompli${challengesDone > 1 ? "s" : ""}` : "5 cartes à compléter aujourd'hui" },
              { to: "/smart-review",   icon: Zap,         bg: "bg-amber-100",  ic: "text-amber-700", label: "Révision intelligente", sub: "Cartes les plus difficiles en priorité" },
            ].map(({ to, icon: Icon, bg, ic, label, sub }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-between bg-white rounded-xl border border-neutral-line p-4 hover:border-[#87CEEB] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${bg} shrink-0`}>
                    <Icon size={18} className={ic} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-ink">{label}</p>
                    <p className="text-xs text-neutral-muted">{sub}</p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-neutral-muted group-hover:text-[#1A7BAD] transition-colors" />
              </Link>
            ))}
          </div>

          {/* Sécurité */}
          <div className="bg-white rounded-2xl border border-neutral-line p-5 mt-5">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={15} className="text-neutral-muted" />
              <h3 className="text-sm font-bold text-neutral-ink">Stockage local</h3>
            </div>
            <p className="text-xs text-neutral-muted">
              Vos données sont sauvegardées localement dans votre navigateur. Elles persistent entre les sessions.
            </p>
          </div>
        </>
      )}

      {/* ─── Onglet Badges ─── */}
      {tab === "badges" && (
        <>
          <AvatarCard />

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-ink">
              Badges débloqués
            </h2>
            <span className="text-sm font-bold text-[#1A7BAD] bg-[#EDF7FD] px-3 py-1 rounded-full">
              {badges.length} / {BADGE_DEFINITIONS.length}
            </span>
          </div>

          {/* Barre globale */}
          <div className="bg-white rounded-xl border border-neutral-line p-4 mb-5">
            <div className="flex justify-between text-xs text-neutral-muted mb-1.5">
              <span>Progression</span>
              <span className="font-bold text-neutral-ink">
                {Math.round((badges.length / BADGE_DEFINITIONS.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700"
                style={{ width: `${(badges.length / BADGE_DEFINITIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Grille des badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BADGE_DEFINITIONS.map((def) => {
              const unlocked = badges.some((b) => b.id === def.id);
              const unlockedAt = badges.find((b) => b.id === def.id)?.unlockedAt;
              return (
                <div
                  key={def.id}
                  className={[
                    "rounded-2xl border p-4 transition-all",
                    unlocked
                      ? "bg-white border-neutral-200 hover:shadow-sm"
                      : "bg-neutral-50 border-dashed border-neutral-200 opacity-60",
                  ].join(" ")}
                  style={unlocked ? { backgroundColor: def.color } : undefined}
                >
                  {/* Emoji */}
                  <div className={[
                    "text-3xl mb-2 w-12 h-12 flex items-center justify-center rounded-xl",
                    unlocked ? "bg-white/60" : "bg-neutral-200/50",
                  ].join(" ")}>
                    {unlocked ? def.emoji : "🔒"}
                  </div>
                  <p className={`text-sm font-bold ${unlocked ? "text-neutral-800" : "text-neutral-400"}`}>
                    {def.label}
                  </p>
                  <p className={`text-xs mt-0.5 leading-tight ${unlocked ? "text-neutral-500" : "text-neutral-300"}`}>
                    {def.description}
                  </p>
                  {unlocked && unlockedAt && (
                    <p className="text-[10px] text-neutral-400 mt-2 font-semibold">
                      ✓ Débloqué {new Date(unlockedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ─── Onglet Statistiques ─── */}
      {tab === "stats" && (
        <>
          <AvatarCard />

          {/* Heatmap activité */}
          {user && <ActivityHeatmap user={user} />}

          {/* Stats globales */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {[
              { label: "Cartes étudiées",   value: totalCardsStudied,                         accent: "#1A7BAD" },
              { label: "Meilleur examen",   value: bestExam !== null ? `${bestExam}%` : "—",   accent: "#8B5CF6" },
              { label: "Score moyen exam",  value: avgExam  !== null ? `${avgExam}%`  : "—",   accent: "#1A7BAD" },
              { label: "Score moyen quiz",  value: avgQuiz  !== null ? `${avgQuiz}%`  : "—",   accent: "#22C55E" },
              { label: "Sessions parfaites",value: perfectSessions,                            accent: "#F59E0B" },
              { label: "Défis complétés",   value: challengesDone,                             accent: "#10B981" },
              { label: "Quiz complétés",    value: quizScores.length,                          accent: "#6366F1" },
              { label: "Examens passés",    value: examScores.length,                          accent: "#EC4899" },
              { label: "Cartes perso",      value: customCards.length,                         accent: "#0EA5E9" },
            ].map(({ label, value, accent }) => (
              <div key={label} className="bg-white rounded-xl border border-neutral-line p-4">
                <p className="text-xl font-bold" style={{ color: accent }}>{value}</p>
                <p className="text-xs text-neutral-muted mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Derniers examens */}
          {examScores.length > 0 && (
            <div className="bg-white rounded-2xl border border-neutral-line p-5 mb-5">
              <h3 className="text-sm font-bold text-neutral-ink mb-3 flex items-center gap-2">
                <ClipboardCheck size={15} className="text-neutral-muted" />
                Derniers examens
              </h3>
              <div className="flex flex-col gap-2">
                {examScores.slice(0, 5).map((s) => {
                  const pct = Math.round((s.score / s.total) * 100);
                  return (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className={[
                        "w-2 h-2 rounded-full shrink-0",
                        pct >= 80 ? "bg-green-400" : pct >= 50 ? "bg-amber-400" : "bg-rose-400",
                      ].join(" ")} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-xs text-neutral-muted">
                            {new Date(s.date).toLocaleDateString("fr-FR")} · {s.level === "beginner" ? "Débutant" : s.level === "intermediate" ? "Intermédiaire" : "Avancé"}
                          </span>
                          <span className={`text-xs font-bold ${pct >= 80 ? "text-green-600" : pct >= 50 ? "text-amber-600" : "text-rose-600"}`}>
                            {pct}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className={["h-full rounded-full", pct >= 80 ? "bg-green-400" : pct >= 50 ? "bg-amber-400" : "bg-rose-400"].join(" ")}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Derniers quiz */}
          {quizScores.length > 0 && (
            <div className="bg-white rounded-2xl border border-neutral-line p-5 mb-5">
              <h3 className="text-sm font-bold text-neutral-ink mb-3 flex items-center gap-2">
                <Brain size={15} className="text-neutral-muted" />
                Derniers quiz
              </h3>
              <div className="flex flex-col gap-2">
                {quizScores.slice(0, 5).map((s) => {
                  const pct = Math.round((s.score / s.total) * 100);
                  const rewardEmoji = s.reward === "gold" ? "🥇" : s.reward === "silver" ? "🥈" : s.reward === "bronze" ? "🥉" : s.reward === "star" ? "⭐" : "";
                  return (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className="text-base shrink-0">{rewardEmoji || <div className="w-2 h-2 rounded-full bg-neutral-300" />}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-xs text-neutral-muted">
                            {new Date(s.date).toLocaleDateString("fr-FR")} · {s.level === "beginner" ? "Débutant" : s.level === "intermediate" ? "Intermédiaire" : "Avancé"}
                          </span>
                          <span className={`text-xs font-bold ${pct >= 80 ? "text-green-600" : pct >= 50 ? "text-amber-600" : "text-rose-600"}`}>
                            {s.score}/{s.total}
                          </span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className={["h-full rounded-full", pct >= 80 ? "bg-green-400" : pct >= 50 ? "bg-amber-400" : "bg-rose-400"].join(" ")}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Historique défis */}
          {challenges.length > 0 && (
            <div className="bg-white rounded-2xl border border-neutral-line p-5">
              <h3 className="text-sm font-bold text-neutral-ink mb-3 flex items-center gap-2">
                <Star size={15} className="text-neutral-muted" />
                Défis du jour récents
              </h3>
              <div className="flex flex-col gap-2">
                {[...challenges].reverse().slice(0, 7).map((c) => {
                  const pct = Math.round((c.score / c.total) * 100);
                  return (
                    <div key={c.date} className="flex items-center justify-between py-1.5 border-b border-neutral-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{c.completed ? "✅" : "❌"}</span>
                        <span className="text-xs text-neutral-600 font-medium">
                          {new Date(c.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pct === 100 ? "bg-green-100 text-green-700" : pct >= 60 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-600"}`}>
                        {c.score}/{c.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {examScores.length === 0 && quizScores.length === 0 && challenges.length === 0 && (
            <div className="text-center py-16 text-neutral-muted">
              <div className="text-4xl mb-3">📊</div>
              <p className="font-semibold">Aucune statistique pour l'instant</p>
              <p className="text-sm mt-1">Commencez à étudier pour voir vos données ici !</p>
            </div>
          )}
        </>
      )}

      {/* ─── Modal Modifier le profil ─── */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Modifier le profil" maxWidth="sm">
        <div className="flex flex-col gap-4">
          <Input
            label="Prénom / Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom"
            error={nameError}
            icon={<User size={16} />}
          />
          <div>
            <label className="text-sm font-semibold text-neutral-ink">Photo de profil</label>
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-1.5 w-full flex items-center gap-2.5 px-4 py-3 rounded-lg border border-dashed border-[#87CEEB] hover:bg-[#E8F6FD] transition-colors cursor-pointer text-sm text-[#5BAED6] font-semibold"
            >
              <Camera size={16} />
              {user?.avatar ? "Changer la photo" : "Ajouter une photo"}
            </button>
          </div>
          <div className="flex gap-3 mt-1">
            <Button variant="secondary" fullWidth onClick={() => setEditOpen(false)}>Annuler</Button>
            <Button variant="primary" fullWidth loading={saving} onClick={handleSaveName} className="gap-1.5">
              <Save size={14} /> Sauvegarder
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── Modal Déconnexion ─── */}
      <Modal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} title="Se déconnecter" maxWidth="sm">
        <p className="text-sm text-neutral-muted mb-5">Voulez-vous vraiment vous déconnecter ?</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setLogoutOpen(false)}>Annuler</Button>
          <Button variant="wrong" fullWidth onClick={handleLogout} className="gap-1.5">
            <LogOut size={14} /> Déconnexion
          </Button>
        </div>
      </Modal>
    </div>
  );
}
