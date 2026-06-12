import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { QuizRunner } from "@/components/QuizRunner";
import { parseJSON } from "@/lib/utils";
import type { QuestionDTO } from "@/components/QuestionView";
import type { Difficulty } from "@/types";

export default async function QuizPage({ params }: { params: { id: string } }) {
  await getCurrentUser();

  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id },
    include: {
      questions: { orderBy: { order: "asc" } },
      lesson: { include: { course: true } },
    },
  });
  if (!quiz) notFound();

  const questions: QuestionDTO[] = quiz.questions.map((q) => ({
    id: q.id,
    type: q.type,
    prompt: q.prompt,
    code: q.code,
    options: parseJSON<string[]>(q.options, []),
    topic: q.topic,
    difficulty: q.difficulty as Difficulty,
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href={`/courses/${quiz.lesson.course.slug}`} className="hover:text-slate-600">
          {quiz.lesson.course.title}
        </Link>
        <span>/</span>
        <Link href={`/lessons/${quiz.lesson.id}`} className="hover:text-slate-600">
          {quiz.lesson.title}
        </Link>
        <span>/</span>
        <span className="text-slate-600">Quiz</span>
      </div>

      <QuizRunner
        quizId={quiz.id}
        quizTitle={quiz.title}
        questions={questions}
        backHref={`/lessons/${quiz.lesson.id}`}
      />
    </div>
  );
}
