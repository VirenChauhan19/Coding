import { getLevelInfo } from "@/lib/gamification";
import { cn } from "@/lib/utils";

/** Compact XP/level indicator (used in the sidebar and profile). */
export function LevelBar({ xp, className }: { xp: number; className?: string }) {
  const info = getLevelInfo(xp);
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-600 text-[11px] font-bold text-white">
            {info.level}
          </span>
          {info.title}
        </span>
        <span className="font-medium text-slate-400">
          {info.currentLevelXp}/{info.xpToNextLevel} XP
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="bar-fill h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
          style={{ width: `${Math.round(info.progress * 100)}%` }}
        />
      </div>
    </div>
  );
}

export function StreakFlame({
  count,
  size = "md",
}: {
  count: number;
  size?: "sm" | "md";
}) {
  const active = count > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-bold",
        size === "sm" ? "text-sm" : "text-base",
        active ? "text-amber-600" : "text-slate-400",
      )}
      title={`${count}-day streak`}
    >
      <span className={active ? "animate-flame" : ""}>🔥</span>
      {count}
    </span>
  );
}
