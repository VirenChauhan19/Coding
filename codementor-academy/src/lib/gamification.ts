// Gamification engine: XP, levels, streaks, and badges.
//
// Pure helpers (no DB) live here so they're usable on the client for
// animations and on the server for awarding rewards.

export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  QUIZ_CORRECT: 10,
  QUIZ_PERFECT_BONUS: 30,
  EXAM_PASS_BASE: 200,
  BOSS_BONUS: 300,
  DAILY_STREAK: 20,
} as const;

/**
 * Total XP required to *reach* a given level (1-indexed).
 * Level 1 = 0 XP, then each level costs a bit more (quadratic-ish curve).
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  // 100, 250, 450, 700, ... grows smoothly.
  return Math.round(50 * (level - 1) * level);
}

export interface LevelInfo {
  level: number;
  /** XP accumulated within the current level. */
  currentLevelXp: number;
  /** XP needed to fill the current level. */
  xpToNextLevel: number;
  /** 0..1 progress through the current level. */
  progress: number;
  title: string;
}

const LEVEL_TITLES = [
  "Code Novice",
  "Syntax Seeker",
  "Loop Wrangler",
  "Function Forger",
  "Bug Hunter",
  "Logic Architect",
  "Algorithm Adept",
  "Code Sage",
  "Master Mentor",
  "Grandmaster Coder",
];

export function getLevelInfo(xp: number): LevelInfo {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) {
    level += 1;
  }
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const currentLevelXp = xp - base;
  const xpToNextLevel = next - base;
  const title =
    LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] ?? "Coder";
  return {
    level,
    currentLevelXp,
    xpToNextLevel,
    progress: xpToNextLevel > 0 ? currentLevelXp / xpToNextLevel : 1,
    title,
  };
}

/** Did adding `gained` XP push the user across a level boundary? */
export function didLevelUp(prevXp: number, newXp: number): boolean {
  return getLevelInfo(newXp).level > getLevelInfo(prevXp).level;
}

// ---------------------------------------------------------------------------
// Streaks
// ---------------------------------------------------------------------------

function daysBetween(a: Date, b: Date): number {
  const da = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const db = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((db - da) / (24 * 60 * 60 * 1000));
}

/**
 * Compute the new streak given the last active date and "now".
 * - Same day: unchanged.
 * - Consecutive day: +1.
 * - Gap > 1 day (or first ever): reset to 1.
 */
export function computeStreak(
  lastActive: Date | null,
  current: number,
  now = new Date(),
): { streak: number; isNewDay: boolean } {
  if (!lastActive) return { streak: 1, isNewDay: true };
  const gap = daysBetween(lastActive, now);
  if (gap === 0) return { streak: Math.max(current, 1), isNewDay: false };
  if (gap === 1) return { streak: current + 1, isNewDay: true };
  return { streak: 1, isNewDay: true };
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

export interface BadgeDef {
  key: string;
  name: string;
  description: string;
  icon: string;
}

export const BADGE_DEFS: BadgeDef[] = [
  { key: "first_steps", name: "First Steps", description: "Complete your first lesson", icon: "👣" },
  { key: "quiz_whiz", name: "Quiz Whiz", description: "Score 100% on a quiz", icon: "🧠" },
  { key: "perfect_streak", name: "On Fire", description: "Reach a 3-day streak", icon: "🔥" },
  { key: "exam_ace", name: "Exam Ace", description: "Pass an exam", icon: "🎓" },
  { key: "boss_slayer", name: "Boss Slayer", description: "Defeat a Final Boss exam", icon: "🐉" },
  { key: "level_5", name: "Rising Star", description: "Reach level 5", icon: "⭐" },
  { key: "polyglot", name: "Polyglot", description: "Enroll in 3 languages", icon: "🌍" },
  { key: "century", name: "Century", description: "Earn 1000 total XP", icon: "💯" },
];

export function getBadgeDef(key: string): BadgeDef | undefined {
  return BADGE_DEFS.find((b) => b.key === key);
}
