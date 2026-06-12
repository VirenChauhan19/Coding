"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export interface RewardData {
  xpGained: number;
  totalXp: number;
  leveledUp: boolean;
  newLevel: number;
  streak: number;
  newBadges: { key: string; name: string; icon: string }[];
  title?: string;
  subtitle?: string;
}

/** Celebration modal shown after earning XP. Includes confetti + level-up glow. */
export function RewardModal({
  reward,
  onClose,
}: {
  reward: RewardData | null;
  onClose: () => void;
}) {
  if (!reward) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <Confetti />
      <div className="animate-pop-in relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div
          className={
            "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-4xl " +
            (reward.leveledUp
              ? "animate-level-glow bg-brand-100"
              : "bg-amber-100")
          }
        >
          {reward.leveledUp ? "🎉" : "⭐"}
        </div>

        {reward.leveledUp ? (
          <>
            <h2 className="text-2xl font-extrabold text-slate-900">Level Up!</h2>
            <p className="mt-1 text-slate-500">
              You reached <span className="font-bold text-brand-600">Level {reward.newLevel}</span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {reward.title ?? "Nice work!"}
            </h2>
            {reward.subtitle && (
              <p className="mt-1 text-slate-500">{reward.subtitle}</p>
            )}
          </>
        )}

        <div className="my-5 inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-5 py-3">
          <span className="text-2xl font-extrabold text-amber-600">
            +{reward.xpGained}
          </span>
          <span className="text-sm font-semibold text-amber-700">XP</span>
        </div>

        {reward.streak > 1 && (
          <p className="mb-2 text-sm font-medium text-slate-500">
            <span className="animate-flame inline-block">🔥</span> {reward.streak}-day streak!
          </p>
        )}

        {reward.newBadges.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              New badge{reward.newBadges.length > 1 ? "s" : ""} unlocked
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {reward.newBadges.map((b) => (
                <span
                  key={b.key}
                  className="animate-float-up inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700"
                >
                  <span className="text-lg">{b.icon}</span>
                  {b.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <Button onClick={onClose} variant="primary" size="lg" className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
}

/** Pure-CSS confetti burst. */
export function Confetti() {
  const [pieces, setPieces] = useState<
    { left: number; delay: number; color: string; rotate: number }[]
  >([]);

  useEffect(() => {
    const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"];
    setPieces(
      Array.from({ length: 60 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotate: Math.random() * 360,
      })),
    );
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 h-2.5 w-2.5 rounded-sm"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${1.8 + Math.random()}s linear ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
