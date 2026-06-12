import "server-only";
import { prisma } from "@/lib/prisma";
import {
  BADGE_DEFS,
  computeStreak,
  didLevelUp,
  getLevelInfo,
} from "@/lib/gamification";

export interface RewardOutcome {
  xpGained: number;
  totalXp: number;
  leveledUp: boolean;
  newLevel: number;
  streak: number;
  newBadges: { key: string; name: string; icon: string }[];
}

/**
 * Central place to grant XP, update the daily streak, and (re)evaluate badges.
 * Call this after a lesson completion, quiz, or exam.
 */
export async function grantRewards(
  userId: string,
  xpGained: number,
): Promise<RewardOutcome> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { enrollments: true, badges: true },
  });
  if (!user) {
    return {
      xpGained: 0,
      totalXp: 0,
      leveledUp: false,
      newLevel: 1,
      streak: 0,
      newBadges: [],
    };
  }

  const prevXp = user.xp;
  const newXp = prevXp + xpGained;
  const { streak, isNewDay } = computeStreak(
    user.lastActiveDate,
    user.streakCount,
  );

  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXp,
      streakCount: streak,
      lastActiveDate: new Date(),
    },
  });

  const newBadges = await evaluateBadges(userId, {
    xp: newXp,
    streak,
    enrollmentCount: user.enrollments.length,
    ownedBadgeKeys: new Set(
      (await prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true },
      })).map((ub) => ub.badge.key),
    ),
  });

  return {
    xpGained,
    totalXp: newXp,
    leveledUp: didLevelUp(prevXp, newXp),
    newLevel: getLevelInfo(newXp).level,
    streak,
    newBadges,
  };
}

export interface AwardedBadge {
  key: string;
  name: string;
  icon: string;
}

/**
 * Award a specific badge by key if not already earned.
 * Returns the badge if newly granted, or null if it was already owned/unknown.
 */
export async function awardBadge(
  userId: string,
  key: string,
): Promise<AwardedBadge | null> {
  const def = BADGE_DEFS.find((b) => b.key === key);
  if (!def) return null;

  const badge = await prisma.badge.upsert({
    where: { key: def.key },
    update: {},
    create: def,
  });

  try {
    await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
    return { key: def.key, name: def.name, icon: def.icon };
  } catch {
    // Unique constraint => already owned.
    return null;
  }
}

interface BadgeContext {
  xp: number;
  streak: number;
  enrollmentCount: number;
  ownedBadgeKeys: Set<string>;
}

/** Evaluate threshold-based badges and award any newly earned. */
async function evaluateBadges(
  userId: string,
  ctx: BadgeContext,
): Promise<{ key: string; name: string; icon: string }[]> {
  const toAward: string[] = [];
  const level = getLevelInfo(ctx.xp).level;

  if (ctx.streak >= 3) toAward.push("perfect_streak");
  if (level >= 5) toAward.push("level_5");
  if (ctx.enrollmentCount >= 3) toAward.push("polyglot");
  if (ctx.xp >= 1000) toAward.push("century");

  const granted: AwardedBadge[] = [];
  for (const key of toAward) {
    if (ctx.ownedBadgeKeys.has(key)) continue;
    const badge = await awardBadge(userId, key);
    if (badge) granted.push(badge);
  }
  return granted;
}

/** Update per-topic stats from a set of graded answers (for weak-topic analysis). */
export async function recordTopicStats(
  userId: string,
  results: { topic: string; correct: boolean }[],
): Promise<void> {
  const byTopic = new Map<string, { correct: number; total: number }>();
  for (const r of results) {
    const topic = r.topic?.trim();
    if (!topic) continue;
    const entry = byTopic.get(topic) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (r.correct) entry.correct += 1;
    byTopic.set(topic, entry);
  }

  for (const [topic, { correct, total }] of byTopic) {
    const existing = await prisma.topicStat.findUnique({
      where: { userId_topic: { userId, topic } },
    });
    if (existing) {
      await prisma.topicStat.update({
        where: { id: existing.id },
        data: { correct: existing.correct + correct, total: existing.total + total },
      });
    } else {
      await prisma.topicStat.create({
        data: { userId, topic, correct, total },
      });
    }
  }
}
