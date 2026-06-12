import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Card, ProgressBar, Pill } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { EnrollButton } from "@/components/EnrollButton";
import { LEVEL_LABELS, LEVEL_ORDER, LEVEL_BADGE_CLASSES } from "@/lib/utils";
import type { Level } from "@/types";

export default async function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = (await getCurrentUser())!;

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: { _count: { select: { quizzes: true, practiceProblems: true } } },
      },
      exams: { orderBy: { isBoss: "asc" } },
    },
  });
  if (!course) notFound();

  const enrolled = !!(await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
  }));

  const completed = await prisma.lessonProgress.findMany({
    where: { userId: user.id, completed: true, lesson: { courseId: course.id } },
    select: { lessonId: true },
  });
  const completedSet = new Set(completed.map((c) => c.lessonId));
  const percent =
    course.lessons.length > 0
      ? Math.round((completedSet.size / course.lessons.length) * 100)
      : 0;

  const byLevel = LEVEL_ORDER.map((level) => ({
    level,
    lessons: course.lessons.filter((l) => l.level === level),
  })).filter((g) => g.lessons.length > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center" style={{ background: `${course.color}14` }}>
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl text-5xl" style={{ background: `${course.color}26` }}>
          {course.icon}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-slate-900">{course.title}</h1>
          <p className="mt-1 text-slate-600">{course.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Pill className="bg-white text-slate-600">{course.lessons.length} lessons</Pill>
            <Pill className="bg-white text-slate-600">{course.exams.length} exams</Pill>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-2">
          <EnrollButton courseId={course.id} enrolled={enrolled} size="lg" />
          {course.lessons[0] && (
            <ButtonLink href={`/lessons/${course.lessons[0].id}`} variant="secondary" size="sm">
              Start first lesson
            </ButtonLink>
          )}
        </div>
      </div>

      {enrolled && (
        <Card className="p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700">Your progress</span>
            <span className="font-bold text-brand-600">{percent}% complete</span>
          </div>
          <ProgressBar value={percent} />
        </Card>
      )}

      {/* Lessons by level */}
      {byLevel.map((group) => (
        <section key={group.level}>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">{LEVEL_LABELS[group.level as Level]}</h2>
            <Pill className={LEVEL_BADGE_CLASSES[group.level as Level]}>
              {group.lessons.length} lessons
            </Pill>
          </div>
          <Card className="divide-y divide-slate-100">
            {group.lessons.map((lesson, idx) => {
              const done = completedSet.has(lesson.id);
              return (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.id}`}
                  className="flex items-center gap-4 p-4 transition hover:bg-slate-50"
                >
                  <div
                    className={
                      "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold " +
                      (done ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500")
                    }
                  >
                    {done ? "✓" : idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{lesson.title}</div>
                    <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-slate-400">
                      <span>⏱️ {lesson.estMinutes} min</span>
                      {lesson._count.quizzes > 0 && <span>📝 {lesson._count.quizzes} quiz</span>}
                      {lesson._count.practiceProblems > 0 && <span>💻 {lesson._count.practiceProblems} practice</span>}
                    </div>
                  </div>
                  <span className="text-slate-300">→</span>
                </Link>
              );
            })}
          </Card>
        </section>
      ))}

      {/* Exams */}
      {course.exams.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-slate-900">Exams</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {course.exams.map((exam) => (
              <Card
                key={exam.id}
                className={
                  "p-5 " +
                  (exam.isBoss
                    ? "border-2 border-rose-300 bg-gradient-to-br from-rose-50 to-amber-50"
                    : "")
                }
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{exam.title}</h3>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                      <Pill className="bg-white text-slate-600">⏱️ {exam.durationMinutes} min</Pill>
                      <Pill className="bg-white text-slate-600">Pass: {exam.passingScore}%</Pill>
                      <Pill className="bg-amber-100 text-amber-700">+{exam.xpReward} XP</Pill>
                    </div>
                  </div>
                  {exam.isBoss && <span className="text-3xl">🐉</span>}
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  {exam.isBoss
                    ? "The ultimate test. Beat it to earn the Boss Slayer badge."
                    : "A timed exam covering the whole level. Good luck!"}
                </p>
                <ButtonLink
                  href={`/exam/${exam.id}`}
                  variant={exam.isBoss ? "danger" : "primary"}
                  className="mt-4 w-full"
                >
                  {exam.isBoss ? "⚔️ Challenge the Boss" : "Start exam"}
                </ButtonLink>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
