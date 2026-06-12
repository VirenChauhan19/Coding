import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PracticeWorkspace, type PracticeProblemDTO } from "@/components/PracticeWorkspace";
import { parseJSON } from "@/lib/utils";
import type { Difficulty, TestCase } from "@/types";

export default async function PracticePage({
  searchParams,
}: {
  searchParams: { problem?: string };
}) {
  await getCurrentUser();

  const problems = await prisma.practiceProblem.findMany({
    orderBy: [{ topic: "asc" }, { order: "asc" }],
  });

  const dtos: PracticeProblemDTO[] = problems.map((p) => ({
    id: p.id,
    title: p.title,
    prompt: p.prompt,
    language: p.language,
    starterCode: p.starterCode,
    solution: p.solution,
    difficulty: p.difficulty as Difficulty,
    topic: p.topic,
    testCases: parseJSON<TestCase[]>(p.testCases, []),
  }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Code Playground 💻</h1>
        <p className="mt-1 text-slate-500">
          Write code, run it instantly, and check your solution against test cases.
          JavaScript runs live in your browser.
        </p>
      </div>

      {dtos.length === 0 ? (
        <p className="text-slate-500">No practice problems available yet.</p>
      ) : (
        <PracticeWorkspace problems={dtos} initialId={searchParams.problem} />
      )}
    </div>
  );
}
