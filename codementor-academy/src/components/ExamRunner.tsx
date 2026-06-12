"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { QuestionView, type QuestionDTO } from "@/components/QuestionView";
import { RewardModal, type RewardData } from "@/components/gamification/RewardModal";

interface ExamResult {
  attemptId: string;
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  passingScore: number;
  isBoss: boolean;
  reward: RewardData;
}

export function ExamRunner({
  examId,
  title,
  durationMinutes,
  passingScore,
  isBoss,
  questions,
  courseSlug,
}: {
  examId: string;
  title: string;
  durationMinutes: number;
  passingScore: number;
  isBoss: boolean;
  questions: QuestionDTO[];
  courseSlug: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "active" | "done">("intro");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [reward, setReward] = useState<RewardData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const startRef = useRef<number>(0);
  const submittedRef = useRef(false);

  const submit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    const durationSeconds = Math.round((Date.now() - startRef.current) / 1000);
    const res = await fetch("/api/exam/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examId, answers, durationSeconds }),
    });
    const data: ExamResult = await res.json();
    setResult(data);
    setReward(data.reward);
    setPhase("done");
    setSubmitting(false);
    router.refresh();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [answers, examId, router]);

  // Countdown timer.
  useEffect(() => {
    if (phase !== "active") return;
    if (timeLeft <= 0) {
      submit();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, submit]);

  function start() {
    startRef.current = Date.now();
    setPhase("active");
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const answeredCount = Object.values(answers).filter((a) => a?.trim()).length;
  const lowTime = timeLeft <= 60;

  // ---- Intro ----
  if (phase === "intro") {
    return (
      <Card className={"p-8 text-center " + (isBoss ? "border-2 border-rose-300" : "")}>
        <div className="text-5xl">{isBoss ? "🐉" : "📝"}</div>
        <h1 className="mt-3 text-2xl font-extrabold text-slate-900">{title}</h1>
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
          <span className="rounded-lg bg-slate-100 px-3 py-1.5">📋 {questions.length} questions</span>
          <span className="rounded-lg bg-slate-100 px-3 py-1.5">⏱️ {durationMinutes} minutes</span>
          <span className="rounded-lg bg-slate-100 px-3 py-1.5">🎯 Pass: {passingScore}%</span>
        </div>
        <p className="mx-auto mt-4 max-w-md text-sm text-slate-500">
          The timer starts when you begin. The exam auto-submits when time runs out.
          {isBoss && " Beat it to earn the Boss Slayer badge! ⚔️"}
        </p>
        <div className="mt-6">
          <Button onClick={start} variant={isBoss ? "danger" : "primary"} size="lg">
            {isBoss ? "⚔️ Begin the battle" : "Start exam"}
          </Button>
        </div>
      </Card>
    );
  }

  // ---- Done / summary ----
  if (phase === "done" && result) {
    return (
      <div className="space-y-5">
        <Card className="p-8 text-center">
          <div className="text-5xl">{result.passed ? "🏆" : "💪"}</div>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
            {result.passed ? "You passed!" : "Not quite — keep going!"}
          </h2>
          <p className="mt-1 text-lg font-semibold text-slate-700">
            {result.score}/{result.total} · {result.percent}%
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Passing score: {result.passingScore}%
            {result.passed && ` · +${result.reward.xpGained} XP`}
          </p>
          {result.isBoss && result.passed && (
            <p className="mt-2 font-bold text-rose-600">🐉 Boss defeated!</p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <ButtonLink href={`/results/${result.attemptId}`} variant="primary">
              Review answers
            </ButtonLink>
            <ButtonLink href={`/courses/${courseSlug}`} variant="secondary">
              Back to course
            </ButtonLink>
            <Button
              onClick={() => {
                submittedRef.current = false;
                setAnswers({});
                setResult(null);
                setTimeLeft(durationMinutes * 60);
                setPhase("intro");
              }}
              variant="ghost"
            >
              Retake
            </Button>
          </div>
        </Card>
        <RewardModal reward={reward} onClose={() => setReward(null)} />
      </div>
    );
  }

  // ---- Active exam ----
  return (
    <div className="space-y-5">
      {/* Sticky timer bar */}
      <div className="sticky top-0 z-20 -mx-1 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 px-5 py-3 shadow-card backdrop-blur">
        <div>
          <h1 className="font-bold text-slate-900">{title}</h1>
          <p className="text-xs text-slate-400">{answeredCount}/{questions.length} answered</p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={
              "rounded-xl px-4 py-2 font-mono text-lg font-bold " +
              (lowTime ? "animate-pulse bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-700")
            }
          >
            {mins}:{secs.toString().padStart(2, "0")}
          </div>
          <Button onClick={submit} disabled={submitting} variant="success">
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        </div>
      </div>

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
        <Button onClick={submit} disabled={submitting} variant="success">
          {submitting ? "Submitting…" : "Submit exam"}
        </Button>
      </Card>
    </div>
  );
}
