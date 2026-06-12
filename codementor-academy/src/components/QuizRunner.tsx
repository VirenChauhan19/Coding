"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { QuestionView, type QuestionDTO, type ReviewInfo } from "@/components/QuestionView";
import { RewardModal, type RewardData } from "@/components/gamification/RewardModal";

interface ReviewItem extends ReviewInfo {
  id: string;
}

interface SubmitResult {
  score: number;
  total: number;
  percent: number;
  perfect: boolean;
  review: ReviewItem[];
  reward: RewardData;
}

export function QuizRunner({
  quizId,
  quizTitle,
  questions,
  backHref,
}: {
  quizId: string;
  quizTitle: string;
  questions: QuestionDTO[];
  backHref: string;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [reward, setReward] = useState<RewardData | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const answeredCount = Object.values(answers).filter((a) => a?.trim()).length;

  async function submit() {
    setSubmitting(true);
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId, answers }),
    });
    const data: SubmitResult = await res.json();
    setResult(data);
    setReward(data.reward);
    setSubmitting(false);
    router.refresh();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---- Results / review view ----
  if (result) {
    const reviewMap = new Map(result.review.map((r) => [r.id, r]));
    return (
      <div className="space-y-5">
        <Card className="p-6 text-center">
          <div className="text-5xl">{result.percent >= 70 ? "🎉" : "📚"}</div>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
            {result.score}/{result.total} correct
          </h2>
          <p className="mt-1 text-slate-500">
            {result.percent}% · +{result.reward.xpGained} XP
            {result.perfect && " · Perfect score! 🏆"}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <ButtonLink href={backHref} variant="secondary">Back to lesson</ButtonLink>
            <Button onClick={() => { setResult(null); setAnswers({}); }} variant="primary">
              Retake quiz
            </Button>
          </div>
        </Card>

        <h3 className="text-lg font-bold text-slate-900">Review</h3>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const r = reviewMap.get(q.id);
            return (
              <QuestionView
                key={q.id}
                question={q}
                index={i}
                review={r}
              />
            );
          })}
        </div>

        <RewardModal reward={reward} onClose={() => setReward(null)} />
      </div>
    );
  }

  // ---- Answering view ----
  return (
    <div className="space-y-5">
      <Card className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{quizTitle}</h1>
          <p className="text-sm text-slate-400">
            {answeredCount}/{questions.length} answered
          </p>
        </div>
        <Button onClick={submit} disabled={submitting || answeredCount === 0} variant="success">
          {submitting ? "Grading…" : "Submit quiz"}
        </Button>
      </Card>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <QuestionView
            key={q.id}
            question={q}
            index={i}
            value={answers[q.id] ?? ""}
            onChange={(val) => setAnswers((a) => ({ ...a, [q.id]: val }))}
          />
        ))}
      </div>

      <Card className="flex items-center justify-between p-4">
        <span className="text-sm text-slate-400">{answeredCount}/{questions.length} answered</span>
        <Button onClick={submit} disabled={submitting || answeredCount === 0} variant="success">
          {submitting ? "Grading…" : "Submit quiz"}
        </Button>
      </Card>
    </div>
  );
}
