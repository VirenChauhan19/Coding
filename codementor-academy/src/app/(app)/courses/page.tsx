import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Card, ProgressBar, Pill } from "@/components/ui/Card";
import { EnrollButton } from "@/components/EnrollButton";

export default async function CoursesPage() {
  const user = (await getCurrentUser())!;

  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { lessons: true } },
      lessons: { select: { level: true } },
    },
  });

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    select: { courseId: true },
  });
  const enrolledSet = new Set(enrollments.map((e) => e.courseId));

  // Completed lesson count per course for progress display.
  const progressRows = await prisma.lessonProgress.findMany({
    where: { userId: user.id, completed: true },
    select: { lesson: { select: { courseId: true } } },
  });
  const completedByCourse = new Map<string, number>();
  for (const r of progressRows) {
    const id = r.lesson.courseId;
    completedByCourse.set(id, (completedByCourse.get(id) ?? 0) + 1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Course Catalog</h1>
        <p className="mt-1 text-slate-500">
          Pick a language and learn from beginner to advanced — then beat the Final Boss. 🐉
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => {
          const total = c._count.lessons;
          const completed = completedByCourse.get(c.id) ?? 0;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
          const levels = Array.from(new Set(c.lessons.map((l) => l.level)));
          const enrolled = enrolledSet.has(c.id);

          return (
            <Card key={c.id} className="flex flex-col p-5 transition hover:shadow-card-hover">
              <Link href={`/courses/${c.slug}`} className="flex-1">
                <div
                  className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                  style={{ background: `${c.color}1a` }}
                >
                  {c.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{c.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {levels.map((lv) => (
                    <Pill key={lv} className="bg-slate-100 text-slate-600">
                      {lv.charAt(0) + lv.slice(1).toLowerCase()}
                    </Pill>
                  ))}
                  <Pill className="bg-slate-100 text-slate-600">{total} lessons</Pill>
                </div>
              </Link>

              {enrolled && (
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-slate-400">
                    <span>{completed}/{total} done</span>
                    <span>{percent}%</span>
                  </div>
                  <ProgressBar value={percent} />
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <EnrollButton courseId={c.id} enrolled={enrolled} size="sm" className="flex-1" />
                <Link
                  href={`/courses/${c.slug}`}
                  className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  View
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
