export interface DemoPlayer {
  id: string;
  name: string;
  avatar: null;
  streak: number;
  badgeCount: number;
  totalCards: number;
  isDemo: true;
}

export const DEMO_PLAYERS: DemoPlayer[] = [
  { id: "demo_1", name: "Sarah M.",   avatar: null, streak: 47, badgeCount: 16, totalCards: 1342, isDemo: true },
  { id: "demo_2", name: "Lucas B.",   avatar: null, streak: 32, badgeCount: 13, totalCards: 987,  isDemo: true },
  { id: "demo_3", name: "Emma K.",    avatar: null, streak: 24, badgeCount: 10, totalCards: 814,  isDemo: true },
  { id: "demo_4", name: "Thomas R.",  avatar: null, streak: 18, badgeCount: 8,  totalCards: 631,  isDemo: true },
  { id: "demo_5", name: "Léa P.",     avatar: null, streak: 14, badgeCount: 7,  totalCards: 502,  isDemo: true },
  { id: "demo_6", name: "Noah V.",    avatar: null, streak: 10, badgeCount: 5,  totalCards: 347,  isDemo: true },
  { id: "demo_7", name: "Jade F.",    avatar: null, streak: 7,  badgeCount: 4,  totalCards: 225,  isDemo: true },
  { id: "demo_8", name: "Hugo D.",    avatar: null, streak: 5,  badgeCount: 3,  totalCards: 168,  isDemo: true },
  { id: "demo_9", name: "Inès C.",    avatar: null, streak: 3,  badgeCount: 2,  totalCards: 92,   isDemo: true },
  { id: "demo_10", name: "Ethan L.", avatar: null, streak: 2,  badgeCount: 1,  totalCards: 55,   isDemo: true },
];

export const AVATAR_COLORS: string[] = [
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-teal-400 to-emerald-500",
  "from-sky-400 to-cyan-500",
  "from-indigo-400 to-blue-500",
  "from-lime-400 to-green-500",
  "from-fuchsia-400 to-pink-500",
  "from-orange-400 to-red-500",
  "from-cyan-400 to-sky-500",
];
