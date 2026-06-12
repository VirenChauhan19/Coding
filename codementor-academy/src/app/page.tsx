import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { getSession } from "@/lib/auth";

const COURSES = [
  { icon: "🐍", name: "Python", color: "bg-blue-50" },
  { icon: "🟨", name: "JavaScript", color: "bg-yellow-50" },
  { icon: "🎨", name: "HTML/CSS", color: "bg-orange-50" },
  { icon: "⚙️", name: "C++", color: "bg-sky-50" },
  { icon: "☕", name: "Java", color: "bg-amber-50" },
  { icon: "🗄️", name: "SQL", color: "bg-teal-50" },
];

const FEATURES = [
  { icon: "🎓", title: "Structured Courses", desc: "Beginner to advanced paths with lessons, examples, and projects." },
  { icon: "🤖", title: "AI Tutor", desc: "Ask questions and get hints, line-by-line explanations, and next steps." },
  { icon: "💻", title: "Code Playground", desc: "Write and run code with instant output, test cases, and error help." },
  { icon: "📝", title: "Quizzes & Exams", desc: "Auto-graded quizzes and timed exams with full review screens." },
  { icon: "🔥", title: "Streaks & XP", desc: "Earn XP, keep daily streaks, and unlock badges as you level up." },
  { icon: "🐉", title: "Final Boss Exams", desc: "Defeat a boss exam for each language to prove your mastery." },
];

export default async function LandingPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brand-50/40">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
          <span className="text-2xl">🧑‍🏫</span> CodeMentor
        </Link>
        <nav className="flex items-center gap-3">
          {session ? (
            <ButtonLink href="/dashboard" variant="primary">Go to Dashboard</ButtonLink>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost">Log in</ButtonLink>
              <ButtonLink href="/signup" variant="primary">Get started</ButtonLink>
            </>
          )}
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-20 text-center">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-700 shadow-card">
          <span>🚀</span> Learn coding the way a great teacher would teach you
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl">
          Your personal{" "}
          <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
            coding teacher
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          Master Python, JavaScript, C++, Java, SQL and more — with lessons, an AI tutor,
          a live code playground, quizzes, and boss-level exams. Level up like a game.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={session ? "/dashboard" : "/signup"} variant="primary" size="lg">
            Start learning free
          </ButtonLink>
          <ButtonLink href="/courses" variant="secondary" size="lg">
            Browse courses
          </ButtonLink>
        </div>

        {/* Course chips */}
        <div className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          {COURSES.map((c) => (
            <div
              key={c.name}
              className={`flex items-center gap-2 rounded-2xl ${c.color} px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-card`}
            >
              <span className="text-xl">{c.icon}</span>
              {c.name}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-center text-3xl font-bold text-slate-900">
          Everything you need to actually learn
        </h2>
        <p className="mt-2 text-center text-slate-500">
          Duolingo&apos;s motivation × LeetCode&apos;s practice × a real classroom.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:shadow-card-hover">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-14 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold">Ready to write your first line of code?</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Join CodeMentor Academy and start your journey from beginner to confident coder.
          </p>
          <div className="mt-7">
            <ButtonLink href={session ? "/dashboard" : "/signup"} variant="success" size="lg">
              Get started — it&apos;s free
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-brand-200">
            Demo login: student@codementor.dev · password123
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        CodeMentor Academy — an educational MVP. Built with Next.js, TypeScript, Tailwind &amp; Prisma.
      </footer>
    </div>
  );
}
