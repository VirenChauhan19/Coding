import "server-only";
import { prisma } from "@/lib/prisma";

/** Percentage of a course's lessons the user has completed. */
export async function courseProgress(
  userId: string,
  courseId: string,
): Promise<{ completed: number; total: number; percent: number }> {
  const total = await prisma.lesson.count({ where: { courseId } });
  const completed = await prisma.lessonProgress.count({
    where: { userId, completed: true, lesson: { courseId } },
  });
  return {
    completed,
    total,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export interface DashboardData {
  enrolledCourses: {
    id: string;
    slug: string;
    title: string;
    icon: string;
    color: string;
    percent: number;
    completed: number;
    total: number;
  }[];
  completedLessonsTotal: number;
  upcomingLessons: { id: string; title: string; courseTitle: string; courseIcon: string }[];
  recentQuizzes: { title: string; score: number; total: number; percent: number; date: Date }[];
  recentExams: { title: string; score: number; total: number; passed: boolean; date: Date }[];
  weakTopics: { topic: string; accuracy: number; correct: number; total: number }[];
  badges: { key: string; name: string; icon: string; description: string }[];
}

/** Aggregate everything the dashboard needs in one place. */
export async function getDashboardData(userId: string): Promise<DashboardData> {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { course: { order: "asc" } },
  });

  const enrolledCourses = [];
  for (const e of enrollments) {
    const prog = await courseProgress(userId, e.courseId);
    enrolledCourses.push({
      id: e.course.id,
      slug: e.course.slug,
      title: e.course.title,
      icon: e.course.icon,
      color: e.course.color,
      percent: prog.percent,
      completed: prog.completed,
      total: prog.total,
    });
  }

  const completedLessonsTotal = await prisma.lessonProgress.count({
    where: { userId, completed: true },
  });

  // Next not-yet-completed lessons across enrolled courses.
  const completedIds = (
    await prisma.lessonProgress.findMany({
      where: { userId, completed: true },
      select: { lessonId: true },
    })
  ).map((p) => p.lessonId);

  const upcoming = await prisma.lesson.findMany({
    where: {
      courseId: { in: enrollments.map((e) => e.courseId) },
      id: { notIn: completedIds },
    },
    include: { course: true },
    orderBy: [{ course: { order: "asc" } }, { order: "asc" }],
    take: 4,
  });

  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: { quiz: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const examAttempts = await prisma.examAttempt.findMany({
    where: { userId },
    include: { exam: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const topicStats = await prisma.topicStat.findMany({
    where: { userId, total: { gt: 0 } },
  });
  const weakTopics = topicStats
    .map((t) => ({
      topic: t.topic,
      correct: t.correct,
      total: t.total,
      accuracy: Math.round((t.correct / t.total) * 100),
    }))
    .filter((t) => t.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
    orderBy: { earnedAt: "desc" },
  });

  return {
    enrolledCourses,
    completedLessonsTotal,
    upcomingLessons: upcoming.map((l) => ({
      id: l.id,
      title: l.title,
      courseTitle: l.course.title,
      courseIcon: l.course.icon,
    })),
    recentQuizzes: quizAttempts.map((a) => ({
      title: a.quiz.title,
      score: a.score,
      total: a.total,
      percent: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
      date: a.createdAt,
    })),
    recentExams: examAttempts.map((a) => ({
      title: a.exam.title,
      score: a.score,
      total: a.total,
      passed: a.passed,
      date: a.createdAt,
    })),
    weakTopics,
    badges: userBadges.map((ub) => ({
      key: ub.badge.key,
      name: ub.badge.name,
      icon: ub.badge.icon,
      description: ub.badge.description,
    })),
  };
}

/** Recommend practice problems that target the user's weakest topics. */
export async function getRecommendedPractice(userId: string, limit = 3) {
  const weak = (
    await prisma.topicStat.findMany({ where: { userId, total: { gt: 0 } } })
  )
    .filter((t) => t.correct / t.total < 0.7)
    .map((t) => t.topic);

  const where = weak.length > 0 ? { topic: { in: weak } } : {};
  const problems = await prisma.practiceProblem.findMany({
    where,
    take: limit,
    orderBy: { difficulty: "asc" },
  });

  // Fall back to any problems if no weak-topic matches found.
  if (problems.length === 0) {
    return prisma.practiceProblem.findMany({ take: limit });
  }
  return problems;
}
