import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { grantRewards, awardBadge } from "@/lib/rewards";
import { XP_REWARDS } from "@/lib/gamification";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonId, timeSpent } = await req.json();
  if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: session.id, lessonId } },
  });

  // Already completed → no double XP.
  if (existing?.completed) {
    return NextResponse.json({ alreadyComplete: true, reward: null });
  }

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.id, lessonId } },
    update: { completed: true, completedAt: new Date(), timeSpent: timeSpent ?? 0 },
    create: {
      userId: session.id,
      lessonId,
      completed: true,
      completedAt: new Date(),
      timeSpent: timeSpent ?? 0,
    },
  });

  // Track total learning time.
  if (timeSpent && timeSpent > 0) {
    await prisma.user.update({
      where: { id: session.id },
      data: { timeSpentSeconds: { increment: Math.min(timeSpent, 3600) } },
    });
  }

  // First-ever completed lesson → First Steps badge.
  const completedCount = await prisma.lessonProgress.count({
    where: { userId: session.id, completed: true },
  });
  const firstSteps =
    completedCount === 1 ? await awardBadge(session.id, "first_steps") : null;

  const reward = await grantRewards(session.id, XP_REWARDS.LESSON_COMPLETE);
  if (firstSteps) reward.newBadges = [firstSteps, ...reward.newBadges];
  return NextResponse.json({ alreadyComplete: false, reward });
}
