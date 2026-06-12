import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { gradeAll } from "@/lib/grading";
import { grantRewards, awardBadge, recordTopicStats } from "@/lib/rewards";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { examId, answers, durationSeconds } = await req.json();
  if (!examId || typeof answers !== "object") {
    return NextResponse.json({ error: "examId and answers required" }, { status: 400 });
  }

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

  const graded = gradeAll(exam.questions, answers);
  const passed = graded.percent >= exam.passingScore;

  const attempt = await prisma.examAttempt.create({
    data: {
      userId: session.id,
      examId,
      score: graded.score,
      total: graded.total,
      passed,
      durationSeconds: Math.min(Math.max(durationSeconds ?? 0, 0), 60 * 60 * 4),
      answers: JSON.stringify(graded.records),
    },
  });

  await recordTopicStats(
    session.id,
    exam.questions.map((q) => ({
      topic: q.topic,
      correct: graded.records.find((r) => r.questionId === q.id)?.correct ?? false,
    })),
  );

  // XP only on a pass; boss exams give a big bonus + special badges.
  let reward;
  if (passed) {
    const aceBadge = await awardBadge(session.id, "exam_ace");
    const bossBadge = exam.isBoss ? await awardBadge(session.id, "boss_slayer") : null;
    reward = await grantRewards(session.id, exam.xpReward);
    const earned = [bossBadge, aceBadge].filter(Boolean) as NonNullable<typeof aceBadge>[];
    if (earned.length) reward.newBadges = [...earned, ...reward.newBadges];
  } else {
    // Still update streak/activity even on a fail (0 XP).
    reward = await grantRewards(session.id, 0);
  }

  return NextResponse.json({
    attemptId: attempt.id,
    score: graded.score,
    total: graded.total,
    percent: graded.percent,
    passed,
    passingScore: exam.passingScore,
    isBoss: exam.isBoss,
    reward,
  });
}
