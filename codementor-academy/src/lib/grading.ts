import { normalizeAnswer } from "@/lib/utils";
import type { QuestionType } from "@/types";

export interface GradableQuestion {
  id: string;
  type: QuestionType | string;
  /**
   * The correct answer. Conventions:
   *  - MULTIPLE_CHOICE: exact option text
   *  - TRUE_FALSE: "true" | "false"
   *  - FILL_BLANK / CODE_OUTPUT / DEBUG: expected text; use "a|b" to allow alternatives
   *  - SHORT_ANSWER: pipe-separated keywords that should all appear
   */
  answer: string;
}

/**
 * Auto-grade a single answer. Returns whether it is correct.
 * Subjective types (SHORT_ANSWER) use keyword matching as a best-effort grade.
 */
export function gradeAnswer(
  question: GradableQuestion,
  studentAnswer: string,
): boolean {
  const given = normalizeAnswer(studentAnswer ?? "");
  const expected = question.answer ?? "";

  if (!given) return false;

  switch (question.type) {
    case "SHORT_ANSWER": {
      // All pipe-separated keywords must be present in the student's answer.
      const keywords = expected
        .split("|")
        .map((k) => normalizeAnswer(k))
        .filter(Boolean);
      if (keywords.length === 0) return false;
      return keywords.every((k) => given.includes(k));
    }
    case "FILL_BLANK":
    case "CODE_OUTPUT":
    case "DEBUG": {
      // Any pipe-separated alternative may match.
      const alternatives = expected.split("|").map((a) => normalizeAnswer(a));
      return alternatives.includes(given);
    }
    case "TRUE_FALSE":
    case "MULTIPLE_CHOICE":
    default:
      return normalizeAnswer(expected) === given;
  }
}

export interface GradedResult {
  score: number; // number correct
  total: number;
  percent: number;
  records: { questionId: string; answer: string; correct: boolean }[];
}

/** Grade a full set of answers keyed by question id. */
export function gradeAll(
  questions: GradableQuestion[],
  answers: Record<string, string>,
): GradedResult {
  const records = questions.map((q) => {
    const answer = answers[q.id] ?? "";
    return { questionId: q.id, answer, correct: gradeAnswer(q, answer) };
  });
  const score = records.filter((r) => r.correct).length;
  const total = questions.length;
  return {
    score,
    total,
    percent: total > 0 ? Math.round((score / total) * 100) : 0,
    records,
  };
}
