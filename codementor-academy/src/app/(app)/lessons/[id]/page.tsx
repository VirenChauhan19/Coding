import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Card, Pill } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { Markdown, CodeBlock } from "@/components/ui/Markdown";
import { TutorChat } from "@/components/TutorChat";
import { LessonComplete } from "@/components/LessonComplete";
import { parseJSON, LEVEL_LABELS, LEVEL_BADGE_CLASSES } from "@/lib/utils";
import type { Level } from "@/types";

export default async function LessonPage({ params }: { params: { id: string } }) {
  const user = (await getCurrentUser())!;

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.id },
    include: {
      course: true,
      quizzes: { orderBy: { order: "asc" } },
      practiceProblems: { orderBy: { order: "asc" } },
    },
  });
  if (!lesson) notFound();

  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
  });

  // Sibling lessons for prev/next navigation.
  const siblings = await prisma.lesson.findMany({
    where: { courseId: lesson.courseId },
    orderBy: { order: "asc" },
    select: { id: true, title: true, order: true },
  });
  const idx = siblings.findIndex((s) => s.id === lesson.id);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const checklist = parseJSON<string[]>(lesson.prerequisites, []);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/courses" className="hover:text-slate-600">Courses</Link>
        <span>/</span>
        <Link href={`/courses/${lesson.course.slug}`} className="hover:text-slate-600">
          {lesson.course.title}
        </Link>
        <span>/</span>
        <span className="text-slate-600">{lesson.title}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lesson content */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Pill className={LEVEL_BADGE_CLASSES[lesson.level as Level]}>
                {LEVEL_LABELS[lesson.level as Level]}
              </Pill>
              <Pill className="bg-slate-100 text-slate-600">⏱️ {lesson.estMinutes} min</Pill>
              <span className="text-sm text-slate-400">Lesson {idx + 1} of {siblings.length}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">{lesson.title}</h1>

            <div className="mt-4">
              <Markdown content={lesson.content} />
            </div>

            {lesson.codeExample && (
              <div className="mt-6">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-400">
                  Code Example
                </h3>
                <CodeBlock code={lesson.codeExample} language={lesson.course.language} />
              </div>
            )}

            {lesson.summary && (
              <div className="mt-6 rounded-2xl bg-brand-50 p-4">
                <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-brand-700">
                  📌 Topic Summary
                </h3>
                <p className="text-sm text-brand-900/80">{lesson.summary}</p>
              </div>
            )}

            {checklist.length > 0 && (
              <div className="mt-6 rounded-2xl border border-slate-200 p-4">
                <h3 className="mb-3 text-sm font-bold text-slate-900">
                  ✅ What you should know before moving on
                </h3>
                <ul className="space-y-2">
                  {checklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 border-emerald-400 text-xs text-emerald-500">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Quizzes & practice */}
          {(lesson.quizzes.length > 0 || lesson.practiceProblems.length > 0) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {lesson.quizzes.length > 0 && (
                <Card className="p-5">
                  <h3 className="flex items-center gap-2 font-bold text-slate-900">📝 Quiz</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Check your understanding and earn XP.
                  </p>
                  <div className="mt-3 space-y-2">
                    {lesson.quizzes.map((q) => (
                      <ButtonLink key={q.id} href={`/quiz/${q.id}`} variant="primary" size="sm" className="w-full">
                        Take: {q.title}
                      </ButtonLink>
                    ))}
                  </div>
                </Card>
              )}
              {lesson.practiceProblems.length > 0 && (
                <Card className="p-5">
                  <h3 className="flex items-center gap-2 font-bold text-slate-900">💻 Practice</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Apply what you learned in the code editor.
                  </p>
                  <div className="mt-3 space-y-2">
                    {lesson.practiceProblems.map((p) => (
                      <ButtonLink key={p.id} href={`/practice?problem=${p.id}`} variant="secondary" size="sm" className="w-full">
                        {p.title}
                      </ButtonLink>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Complete + nav */}
          <Card className="p-5">
            <LessonComplete
              lessonId={lesson.id}
              alreadyComplete={progress?.completed ?? false}
              nextLessonId={next?.id ?? null}
              courseSlug={lesson.course.slug}
            />
            {prev && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <ButtonLink href={`/lessons/${prev.id}`} variant="ghost" size="sm">
                  ← {prev.title}
                </ButtonLink>
              </div>
            )}
          </Card>
        </div>

        {/* Tutor sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <TutorChat
              lessonTitle={lesson.title}
              language={lesson.course.language}
              level={lesson.level}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
