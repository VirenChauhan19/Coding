import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ExamRunner } from "@/components/ExamRunner";
import { parseJSON } from "@/lib/utils";
import type { QuestionDTO } from "@/components/QuestionView";
import type { Difficulty } from "@/types";

export default async function ExamPage({ params }: { params: { id: string } }) {
  await getCurrentUser();

  const exam = await prisma.exam.findUnique({
    where: { id: params.id },
    include: {
      questions: { orderBy: { order: "asc" } },
      course: true,
    },
  });
  if (!exam) notFound();

  const questions: QuestionDTO[] = exam.questions.map((q) => ({
    id: q.id,
    type: q.type,
    prompt: q.prompt,
    code: q.code,
    options: parseJSON<string[]>(q.options, []),
    topic: q.topic,
    difficulty: q.difficulty as Difficulty,
  }));

  return (
    <ExamRunner
      examId={exam.id}
      title={exam.title}
      durationMinutes={exam.durationMinutes}
      passingScore={exam.passingScore}
      isBoss={exam.isBoss}
      questions={questions}
      courseSlug={exam.course.slug}
    />
  );
}
