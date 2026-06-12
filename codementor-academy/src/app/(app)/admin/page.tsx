import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Card, Stat, Pill } from "@/components/ui/Card";
import { AdminLessonForm } from "@/components/AdminLessonForm";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { lessons: true, exams: true } },
    },
  });

  const [lessonTotal, questionTotal, practiceTotal, userTotal] = await Promise.all([
    prisma.lesson.count(),
    prisma.question.count(),
    prisma.practiceProblem.count(),
    prisma.user.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Admin · Content Management</h1>
        <p className="mt-1 text-slate-500">
          Overview of all content. Add new lessons below — quizzes, exams and more are
          managed via the seed file (<code className="rounded bg-slate-100 px-1">prisma/seed-data</code>)
          for now and easily extended.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat label="Courses" value={courses.length} icon="📚" accent="bg-brand-50" />
        <Stat label="Lessons" value={lessonTotal} icon="📖" accent="bg-emerald-50" />
        <Stat label="Questions" value={questionTotal} icon="❓" accent="bg-amber-50" />
        <Stat label="Practice" value={practiceTotal} icon="💻" accent="bg-sky-50" />
        <Stat label="Users" value={userTotal} icon="👥" accent="bg-rose-50" />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">Courses</h2>
        <Card className="divide-y divide-slate-100">
          {courses.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <div className="font-semibold text-slate-900">{c.title}</div>
                  <div className="text-xs text-slate-400">/{c.slug}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Pill className="bg-slate-100 text-slate-600">{c._count.lessons} lessons</Pill>
                <Pill className="bg-slate-100 text-slate-600">{c._count.exams} exams</Pill>
              </div>
            </div>
          ))}
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">Add a new lesson</h2>
        <Card className="p-6">
          <AdminLessonForm courses={courses.map((c) => ({ id: c.id, title: c.title }))} />
        </Card>
      </section>
    </div>
  );
}
