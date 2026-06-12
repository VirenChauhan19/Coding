import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { gradeAll } from "@/lib/grading";
import { grantRewards, awardBadge, recordTopicStats } from "@/lib/rewards";
import { XP_REWARDS } from "@/lib/gamification";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quizId, answers } = await req.json();
  if (!quizId || typeof answers !== "object") {
    return NextResponse.json({ error: "quizId and answers required" }, { status: 400 });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  const graded = gradeAll(quiz.questions, answers);

  // Persist the attempt.
  await prisma.quizAttempt.create({
    data: {
      userId: session.id,
      quizId,
      score: graded.score,
      total: graded.total,
      answers: JSON.stringify(graded.records),
    },
  });

  // Topic stats for weak-topic analysis.
  await recordTopicStats(
    session.id,
    quiz.questions.map((q) => ({
      topic: q.topic,
      correct: graded.records.find((r) => r.questionId === q.id)?.correct ?? false,
    })),
  );

  // XP: per-correct + perfect-score bonus.
  let xp = graded.score * XP_REWARDS.QUIZ_CORRECT;
  const perfect = graded.total > 0 && graded.score === graded.total;
  const quizWhiz = perfect ? await awardBadge(session.id, "quiz_whiz") : null;
  if (perfect) xp += XP_REWARDS.QUIZ_PERFECT_BONUS;

  const reward = await grantRewards(session.id, xp);
  if (quizWhiz) reward.newBadges = [quizWhiz, ...reward.newBadges];

  // Build review payload (include correct answers + explanations).
  const review = quiz.questions.map((q) => {
    const rec = graded.records.find((r) => r.questionId === q.id);
    return {
      id: q.id,
      correctAnswer: q.answer,
      explanation: q.explanation,
      studentAnswer: rec?.answer ?? "",
      correct: rec?.correct ?? false,
    };
  });

  return NextResponse.json({
    score: graded.score,
    total: graded.total,
    percent: graded.percent,
    perfect,
    review,
    reward,
  });
}
