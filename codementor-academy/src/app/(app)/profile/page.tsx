import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getLevelInfo, BADGE_DEFS } from "@/lib/gamification";
import { Card, Stat, Pill, ProgressBar } from "@/components/ui/Card";
import { StreakFlame } from "@/components/gamification/LevelBar";
import { courseProgress } from "@/lib/queries";
import { formatDuration, formatDate } from "@/lib/utils";

export default async function ProfilePage() {
  const user = (await getCurrentUser())!;
  const level = getLevelInfo(user.xp);

  const [lessonCount, quizCount, examAttempts, enrollments, earnedBadges, topicStats] =
    await Promise.all([
      prisma.lessonProgress.count({ where: { userId: user.id, completed: true } }),
      prisma.quizAttempt.count({ where: { userId: user.id } }),
      prisma.examAttempt.findMany({
        where: { userId: user.id },
        include: { exam: { include: { course: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.enrollment.findMany({
        where: { userId: user.id },
        include: { course: true },
        orderBy: { course: { order: "asc" } },
      }),
      prisma.userBadge.findMany({ where: { userId: user.id }, include: { badge: true } }),
      prisma.topicStat.findMany({ where: { userId: user.id, total: { gt: 0 } } }),
    ]);

  const earnedKeys = new Set(earnedBadges.map((b) => b.badge.key));

  const courseProgressList = await Promise.all(
    enrollments.map(async (e) => ({
      course: e.course,
      ...(await courseProgress(user.id, e.courseId)),
    })),
  );

  const mastery = topicStats
    .map((t) => ({ topic: t.topic, accuracy: Math.round((t.correct / t.total) * 100) }))
    .sort((a, b) => b.accuracy - a.accuracy);

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-100 text-3xl font-bold text-brand-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
            <p className="text-slate-400">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Pill className="bg-brand-600 text-white">Lvl {level.level} · {level.title}</Pill>
              <StreakFlame count={user.streakCount} size="sm" />
              <Pill className="bg-amber-100 text-amber-700">{user.xp} XP</Pill>
            </div>
            <div className="mt-3 max-w-sm">
              <div className="mb-1 flex justify-between text-xs text-slate-400">
                <span>{level.currentLevelXp}/{level.xpToNextLevel} XP to level {level.level + 1}</span>
              </div>
              <ProgressBar value={Math.round(level.progress * 100)} barClassName="bg-gradient-to-r from-amber-400 to-amber-500" />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Lessons completed" value={lessonCount} icon="✅" accent="bg-emerald-50" />
        <Stat label="Quizzes taken" value={quizCount} icon="🧠" accent="bg-brand-50" />
        <Stat label="Exams taken" value={examAttempts.length} icon="🎓" accent="bg-amber-50" />
        <Stat label="Time learning" value={formatDuration(user.timeSpentSeconds)} icon="⏱️" accent="bg-sky-50" />
      </div>

      {/* Badges */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">
          Achievements <span className="text-sm font-normal text-slate-400">({earnedKeys.size}/{BADGE_DEFS.length})</span>
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BADGE_DEFS.map((b) => {
            const earned = earnedKeys.has(b.key);
            return (
              <div
                key={b.key}
                className={
                  "rounded-2xl border p-4 text-center " +
                  (earned ? "border-brand-200 bg-brand-50" : "border-slate-200 bg-slate-50 opacity-60")
                }
              >
                <div className={"text-3xl " + (earned ? "" : "grayscale")}>{b.icon}</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{b.name}</div>
                <div className="text-xs text-slate-400">{b.description}</div>
                {!earned && <div className="mt-1 text-[10px] font-semibold uppercase text-slate-400">Locked</div>}
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Course progress */}
        <section>
          <h2 className="mb-3 text-lg font-bold text-slate-900">Course progress</h2>
          <Card className="space-y-4 p-5">
            {courseProgressList.length === 0 ? (
              <p className="text-sm text-slate-500">No enrolled courses yet.</p>
            ) : (
              courseProgressList.map((c) => (
                <div key={c.course.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <span>{c.course.icon}</span> {c.course.title}
                    </span>
                    <span className="text-slate-400">{c.percent}%</span>
                  </div>
                  <ProgressBar value={c.percent} />
                </div>
              ))
            )}
          </Card>
        </section>

        {/* Topic mastery */}
        <section>
          <h2 className="mb-3 text-lg font-bold text-slate-900">Topic mastery</h2>
          <Card className="space-y-3 p-5">
            {mastery.length === 0 ? (
              <p className="text-sm text-slate-500">Take a quiz to start tracking topic mastery.</p>
            ) : (
              mastery.map((m) => (
                <div key={m.topic}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{m.topic}</span>
                    <span className={m.accuracy >= 70 ? "text-emerald-600" : "text-rose-500"}>
                      {m.accuracy}%
                    </span>
                  </div>
                  <ProgressBar
                    value={m.accuracy}
                    barClassName={m.accuracy >= 70 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-rose-400 to-rose-500"}
                  />
                </div>
              ))
            )}
          </Card>
        </section>
      </div>

      {/* Exam history */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-900">Exam history</h2>
        <Card className="divide-y divide-slate-100">
          {examAttempts.length === 0 ? (
            <p className="p-5 text-sm text-slate-500">No exam attempts yet.</p>
          ) : (
            examAttempts.map((a) => (
              <Link
                key={a.id}
                href={`/results/${a.id}`}
                className="flex items-center justify-between p-4 transition hover:bg-slate-50"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">{a.exam.title}</div>
                  <div className="text-xs text-slate-400">
                    {a.exam.course.title} · {formatDate(a.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill className="bg-slate-100 text-slate-600">
                    {Math.round((a.score / a.total) * 100)}%
                  </Pill>
                  <Pill className={a.passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}>
                    {a.passed ? "Passed" : "Failed"}
                  </Pill>
                </div>
              </Link>
            ))
          )}
        </Card>
      </section>
    </div>
  );
}
