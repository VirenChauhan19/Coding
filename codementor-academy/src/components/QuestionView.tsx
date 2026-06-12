"use client";

import { Pill } from "@/components/ui/Card";
import { QUESTION_TYPE_LABELS, DIFFICULTY_BADGE_CLASSES, cn } from "@/lib/utils";
import type { Difficulty } from "@/types";

export interface QuestionDTO {
  id: string;
  type: string;
  prompt: string;
  code: string;
  options: string[];
  topic: string;
  difficulty: Difficulty;
}

export interface ReviewInfo {
  correctAnswer: string;
  explanation: string;
  studentAnswer: string;
  correct: boolean;
}

/**
 * Renders one question's input. In "answer" mode it's interactive; in "review"
 * mode it shows the student's answer, correctness, and the explanation.
 */
export function QuestionView({
  question,
  index,
  value,
  onChange,
  review,
}: {
  question: QuestionDTO;
  index: number;
  value?: string;
  onChange?: (val: string) => void;
  review?: ReviewInfo;
}) {
  const isReview = !!review;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
          {index + 1}
        </span>
        <Pill className="bg-slate-100 text-slate-600">{QUESTION_TYPE_LABELS[question.type] ?? question.type}</Pill>
        {question.topic && <Pill className="bg-slate-100 text-slate-500">{question.topic}</Pill>}
        <Pill className={DIFFICULTY_BADGE_CLASSES[question.difficulty]}>{question.difficulty}</Pill>
        {isReview && (
          <Pill className={review!.correct ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}>
            {review!.correct ? "✓ Correct" : "✕ Incorrect"}
          </Pill>
        )}
      </div>

      <p className="font-semibold text-slate-900">{question.prompt}</p>

      {question.code && (
        <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs leading-relaxed text-slate-100">
          <code>{question.code}</code>
        </pre>
      )}

      <div className="mt-4">
        <AnswerInput
          question={question}
          value={value ?? review?.studentAnswer ?? ""}
          onChange={onChange}
          disabled={isReview}
          review={review}
        />
      </div>

      {isReview && (
        <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
          {!review!.correct && (
            <p>
              <span className="font-semibold text-slate-500">Correct answer: </span>
              <span className="font-mono text-emerald-700">
                {review!.correctAnswer.split("|")[0]}
              </span>
            </p>
          )}
          <p className="rounded-lg bg-brand-50 p-3 text-brand-900/80">
            <span className="font-semibold text-brand-700">💡 Explanation: </span>
            {review!.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

function AnswerInput({
  question,
  value,
  onChange,
  disabled,
  review,
}: {
  question: QuestionDTO;
  value: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
  review?: ReviewInfo;
}) {
  const choices =
    question.type === "TRUE_FALSE" ? ["true", "false"] : question.options;

  if (question.type === "MULTIPLE_CHOICE" || question.type === "TRUE_FALSE") {
    return (
      <div className="space-y-2">
        {choices.map((opt) => {
          const selected = value === opt;
          const isCorrectOpt = review && review.correctAnswer.split("|").includes(opt);
          const isWrongSelected = review && selected && !review.correct;
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => onChange?.(opt)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                !review && selected && "border-brand-500 bg-brand-50",
                !review && !selected && "border-slate-200 hover:bg-slate-50",
                isCorrectOpt && "border-emerald-400 bg-emerald-50",
                isWrongSelected && "border-rose-400 bg-rose-50",
                review && !isCorrectOpt && !isWrongSelected && "border-slate-200 opacity-70",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs",
                  selected ? "border-brand-500 text-brand-600" : "border-slate-300",
                )}
              >
                {selected ? "●" : ""}
              </span>
              <span className="capitalize">{opt}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Free-text style: FILL_BLANK, CODE_OUTPUT, DEBUG, SHORT_ANSWER
  const isLong = question.type === "SHORT_ANSWER";
  return isLong ? (
    <textarea
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      rows={3}
      placeholder="Type your answer…"
      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
    />
  ) : (
    <input
      type="text"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder="Type your answer…"
      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-mono text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
    />
  );
}
