import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardData, getRecommendedPractice } from "@/lib/queries";
import { getLevelInfo } from "@/lib/gamification";
import { Card, ProgressBar, Stat, Pill } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { StreakFlame } from "@/components/gamification/LevelBar";
import { formatDuration, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const user = (await getCurrentUser())!;
  const data = await getDashboardData(user.id);
  const recommended = await getRecommendedPractice(user.id);
  const level = getLevelInfo(user.xp);

  const examScores = data.recentExams;
  const quizAvg =
    data.recentQuizzes.length > 0
      ? Math.round(
          data.recentQuizzes.reduce((s, q) => s + q.percent, 0) /
            data.recentQuizzes.length,
        )
      : null;

  return (
    <div className="space-y-8">
      {/* Greeting + hero stats */}
      <div className="flex flex-col gap-5 rounded-3xl bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">
            Welcome back, {user.name.split(" ")[0]}! 👋
          </h1>
          <p className="mt-1 text-brand-100">
            Level {level.level} · {level.title} — keep the streak alive.
          </p>
          <div className="mt-3 max-w-xs">
            <div className="mb-1 flex justify-between text-xs text-brand-100">
              <span>{level.currentLevelXp}/{level.xpToNextLevel} XP</span>
              <span>Next: Level {level.level + 1}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${Math.round(level.progress * 100)}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl bg-white/10 px-5 py-3 text-center">
            <div className="text-2xl font-extrabold">{user.xp}</div>
            <div className="text-xs text-brand-100">Total XP</div>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-3 text-center">
            <div className="text-2xl font-extrabold">
              <StreakFlame count={user.streakCount} />
            </div>
            <div className="text-xs text-brand-100">Day streak</div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Lessons completed" value={data.completedLessonsTotal} icon="✅" accent="bg-emerald-50" />
        <Stat label="Enrolled courses" value={data.enrolledCourses.length} icon="📚" accent="bg-brand-50" />
        <Stat label="Avg quiz score" value={quizAvg === null ? "—" : `${quizAvg}%`} icon="🧠" accent="bg-amber-50" />
        <Stat label="Time learning" value={formatDuration(user.timeSpentSeconds)} icon="⏱️" accent="bg-sky-50" />
      </div>

      {/* Enrolled courses */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Your courses</h2>
          <Link href="/courses" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Browse all →
          </Link>
        </div>
        {data.enrolledCourses.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">You haven&apos;t enrolled in any courses yet.</p>
            <ButtonLink href="/courses" className="mt-4">Explore courses</ButtonLink>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {data.enrolledCourses.map((c) => (
              <Card key={c.id} className="p-5 transition hover:shadow-card-hover">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: `${c.color}1a` }}>
                    {c.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{c.title}</h3>
                    <p className="text-xs text-slate-400">{c.completed}/{c.total} lessons</p>
                  </div>
                  <span className="text-lg font-bold text-brand-600">{c.percent}%</span>
                </div>
                <ProgressBar value={c.percent} />
                <div className="mt-4">
                  <ButtonLink href={`/courses/${c.slug}`} variant="secondary" size="sm" className="w-full">
                    Continue learning
                  </ButtonLink>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming lessons */}
        <section>
          <h2 className="mb-3 text-lg font-bold text-slate-900">Up next</h2>
          <Card className="divide-y divide-slate-100">
            {data.upcomingLessons.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">All caught up! 🎉</p>
            ) : (
              data.upcomingLessons.map((l) => (
                <Link
                  key={l.id}
                  href={`/lessons/${l.id}`}
                  className="flex items-center gap-3 p-4 transition hover:bg-slate-50"
                >
                  <span className="text-xl">{l.courseIcon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">{l.title}</div>
                    <div className="text-xs text-slate-400">{l.courseTitle}</div>
                  </div>
                  <span className="text-slate-300">→</span>
                </Link>
              ))
            )}
          </Card>
        </section>

        {/* Weak topics + recommended practice */}
        <section>
          <h2 className="mb-3 text-lg font-bold text-slate-900">Focus areas</h2>
          <Card className="p-5">
            {data.weakTopics.length === 0 ? (
              <p className="text-sm text-slate-500">
                No weak spots detected yet — take a quiz to get personalized recommendations.
              </p>
            ) : (
              <div className="space-y-3">
                {data.weakTopics.map((t) => (
                  <div key={t.topic}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{t.topic}</span>
                      <span className="font-semibold text-rose-500">{t.accuracy}%</span>
                    </div>
                    <ProgressBar value={t.accuracy} barClassName="bg-gradient-to-r from-rose-400 to-rose-500" />
                  </div>
                ))}
              </div>
            )}
            {recommended.length > 0 && (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Recommended practice
                </p>
                <div className="space-y-2">
                  {recommended.map((p) => (
                    <Link
                      key={p.id}
                      href={`/practice?problem=${p.id}`}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm transition hover:bg-slate-100"
                    >
                      <span className="font-medium text-slate-700">{p.title}</span>
                      <Pill className="bg-white text-slate-500">{p.topic || "Practice"}</Pill>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </section>
      </div>

      {/* Scores + badges */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-bold text-slate-900">Recent results</h2>
          <Card className="divide-y divide-slate-100">
            {data.recentQuizzes.length === 0 && examScores.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">No quiz or exam attempts yet.</p>
            ) : (
              <>
                {examScores.map((e, i) => (
                  <div key={`e${i}`} className="flex items-center justify-between p-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{e.title}</div>
                      <div className="text-xs text-slate-400">Exam · {formatDate(e.date)}</div>
                    </div>
                    <Pill className={e.passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}>
                      {e.passed ? "Passed" : "Failed"} {Math.round((e.score / e.total) * 100)}%
                    </Pill>
                  </div>
                ))}
                {data.recentQuizzes.map((q, i) => (
                  <div key={`q${i}`} className="flex items-center justify-between p-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{q.title}</div>
                      <div className="text-xs text-slate-400">Quiz · {formatDate(q.date)}</div>
                    </div>
                    <Pill className="bg-brand-50 text-brand-700">{q.score}/{q.total} · {q.percent}%</Pill>
                  </div>
                ))}
              </>
            )}
          </Card>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-slate-900">Badges</h2>
          <Card className="p-5">
            {data.badges.length === 0 ? (
              <p className="text-sm text-slate-500">No badges yet — complete a lesson to earn your first!</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {data.badges.map((b) => (
                  <div
                    key={b.key}
                    title={b.description}
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <span className="text-2xl">{b.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{b.name}</div>
                      <div className="text-xs text-slate-400">{b.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}
