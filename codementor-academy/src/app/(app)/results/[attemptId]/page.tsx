import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Card, Pill } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { QuestionView, type QuestionDTO } from "@/components/QuestionView";
import { parseJSON, formatDate, formatDuration } from "@/lib/utils";
import type { AnswerRecord, Difficulty } from "@/types";

export default async function ResultsPage({
  params,
}: {
  params: { attemptId: string };
}) {
  const user = (await getCurrentUser())!;

  const attempt = await prisma.examAttempt.findUnique({
    where: { id: params.attemptId },
    include: {
      exam: {
        include: {
          course: true,
          questions: { orderBy: { order: "asc" } },
        },
      },
    },
  });
  if (!attempt) notFound();
  // Authorization: users can only view their own results.
  if (attempt.userId !== user.id) redirect("/dashboard");

  const records = parseJSON<AnswerRecord[]>(attempt.answers, []);
  const recordMap = new Map(records.map((r) => [r.questionId, r]));
  const percent = attempt.total > 0 ? Math.round((attempt.score / attempt.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              {attempt.exam.course.title} · {attempt.exam.isBoss ? "Final Boss" : "Exam"}
            </div>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-900">{attempt.exam.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <Pill className={attempt.passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}>
                {attempt.passed ? "✓ Passed" : "✕ Failed"}
              </Pill>
              <Pill className="bg-slate-100 text-slate-600">{attempt.score}/{attempt.total} · {percent}%</Pill>
              <Pill className="bg-slate-100 text-slate-600">⏱️ {formatDuration(attempt.durationSeconds)}</Pill>
              <Pill className="bg-slate-100 text-slate-600">{formatDate(attempt.createdAt)}</Pill>
            </div>
          </div>
          <div className="flex gap-2">
            <ButtonLink href={`/exam/${attempt.examId}`} variant="primary">Retake exam</ButtonLink>
            <ButtonLink href={`/courses/${attempt.exam.course.slug}`} variant="secondary">
              Back to course
            </ButtonLink>
          </div>
        </div>
      </Card>

      <h2 className="text-lg font-bold text-slate-900">Answer review</h2>
      <div className="space-y-4">
        {attempt.exam.questions.map((q, i) => {
          const rec = recordMap.get(q.id);
          const dto: QuestionDTO = {
            id: q.id,
            type: q.type,
            prompt: q.prompt,
            code: q.code,
            options: parseJSON<string[]>(q.options, []),
            topic: q.topic,
            difficulty: q.difficulty as Difficulty,
          };
          return (
            <QuestionView
              key={q.id}
              question={dto}
              index={i}
              review={{
                correctAnswer: q.answer,
                explanation: q.explanation,
                studentAnswer: rec?.answer ?? "",
                correct: rec?.correct ?? false,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
