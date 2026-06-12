"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { RewardModal, type RewardData } from "@/components/gamification/RewardModal";

export function LessonComplete({
  lessonId,
  alreadyComplete,
  nextLessonId,
  courseSlug,
}: {
  lessonId: string;
  alreadyComplete: boolean;
  nextLessonId: string | null;
  courseSlug: string;
}) {
  const router = useRouter();
  const [done, setDone] = useState(alreadyComplete);
  const [loading, setLoading] = useState(false);
  const [reward, setReward] = useState<RewardData | null>(null);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [lessonId]);

  async function complete() {
    setLoading(true);
    const timeSpent = Math.round((Date.now() - startRef.current) / 1000);
    const res = await fetch("/api/lessons/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, timeSpent }),
    });
    const data = await res.json();
    setDone(true);
    setLoading(false);
    if (data.reward) {
      setReward({ ...data.reward, title: "Lesson complete!", subtitle: "Great work — XP earned." });
    }
    router.refresh();
  }

  function closeReward() {
    setReward(null);
    if (nextLessonId) router.push(`/lessons/${nextLessonId}`);
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {done ? (
          <span className="inline-flex items-center gap-2 font-semibold text-emerald-600">
            ✓ Lesson completed
          </span>
        ) : (
          <Button onClick={complete} variant="success" size="lg" disabled={loading}>
            {loading ? "Saving…" : "✓ Mark as complete (+50 XP)"}
          </Button>
        )}

        <div className="flex gap-2">
          <ButtonLink href={`/courses/${courseSlug}`} variant="ghost" size="sm">
            Back to course
          </ButtonLink>
          {nextLessonId && (
            <ButtonLink href={`/lessons/${nextLessonId}`} variant="secondary" size="sm">
              Next lesson →
            </ButtonLink>
          )}
        </div>
      </div>

      <RewardModal reward={reward} onClose={closeReward} />
    </>
  );
}
