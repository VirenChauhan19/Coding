# 🧑‍🏫 CodeMentor Academy

An interactive, gamified coding-education platform — your **personal AI coding teacher**.
Learn Python, JavaScript, HTML/CSS, C++, Java, and SQL from beginner to advanced with
lessons, an AI tutor, a live code playground, auto-graded quizzes, timed exams, and
**Final Boss** challenges. Earn XP, keep daily streaks, and unlock badges as you level up.

> Built as a polished MVP that can be expanded into a real product.

---

## ✨ Features

- **User dashboard** — enrolled courses, progress %, completed/upcoming lessons, recent
  quiz & exam scores, weak topics, and recommended practice.
- **6 language courses** — each with Beginner / Intermediate / Advanced lessons, code
  examples, summaries, practice problems, and a "what you should know before moving on"
  checklist.
- **AI tutor chat** — explains concepts, gives hints (not answers), breaks down errors, and
  suggests what to study next. Placeholder responses today, with a clean seam to plug in a
  real model (`src/lib/tutor.ts`).
- **Code playground** — syntax-highlighted editor, **Run** button, output panel, test-case
  runner, and beginner-friendly error explanations. JavaScript executes live in the browser;
  other languages are simulated (the backend is structured for a real Docker/sandbox runner).
- **Quizzes** — 6 question types (multiple choice, true/false, fill-in-the-blank, predict the
  output, debug the code, short answer), auto-graded with per-question explanations.
- **Exams** — 20–40 mixed-difficulty questions, **timed**, pass/fail, full review screen,
  retake, and saved history.
- **🎮 Gamification** — XP points, levels with titles, daily streaks, badges/achievements,
  confetti **level-up animations**, and a **🐉 Final Boss exam** for every language.
- **Progress tracking** — completed lessons, quiz/exam attempts, scores, time spent, weak
  topics, streaks, and badges.
- **Admin/content system** — content overview + a working "add lesson" form; quizzes/exams
  are seeded and easily extended.

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | **Next.js 14** (App Router) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** |
| Database | **SQLite** (swap to PostgreSQL in one line) |
| ORM | **Prisma** |
| Auth | Custom JWT sessions (`jose` + `bcryptjs`, HttpOnly cookies) |
| Editor | `react-simple-code-editor` + `prismjs` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### 1. Install dependencies
```bash
cd codementor-academy
npm install
```

### 2. Environment
A ready-to-use `.env` is included (SQLite + a dev auth secret). For production, change
`AUTH_SECRET` to a long random string.

### 3. Set up the database (generate client, create tables, seed content)
```bash
npm run setup
```
This runs `prisma generate`, `prisma db push`, and the seed script.

> Re-seed any time with `npm run db:reset` (wipes & repopulates).

### 4. Run the dev server
```bash
npm run dev
```
Open **http://localhost:3000**.

### 🔑 Demo accounts (password: `password123`)
| Role | Email |
|------|-------|
| Student | `student@codementor.dev` |
| Admin | `admin@codementor.dev` |

The student account comes pre-loaded with enrollments, progress, XP, a streak, and a badge
so the dashboard is populated immediately. The admin account unlocks the **Admin** page.

---

## 📁 Project Structure

```
codementor-academy/
├─ prisma/
│  ├─ schema.prisma            # All database models
│  ├─ seed.ts                  # Seed orchestrator
│  └─ seed-data/               # Course/lesson/quiz/exam content
│     ├─ python-lessons.ts     # 7 lessons + quizzes + practice
│     ├─ python-exams.ts       # Full exam + Final Boss
│     └─ other-courses.ts      # JS, HTML/CSS, C++, Java, SQL
├─ src/
│  ├─ app/
│  │  ├─ page.tsx              # Landing page
│  │  ├─ login / signup        # Auth pages
│  │  ├─ (app)/                # Authenticated shell (sidebar layout)
│  │  │  ├─ dashboard
│  │  │  ├─ courses, courses/[slug]
│  │  │  ├─ lessons/[id]
│  │  │  ├─ practice
│  │  │  ├─ quiz/[id]
│  │  │  ├─ exam/[id]
│  │  │  ├─ results/[attemptId]
│  │  │  ├─ profile
│  │  │  └─ admin
│  │  └─ api/                  # Auth, tutor, quiz, exam, lessons, admin
│  ├─ components/              # UI + feature components
│  ├─ lib/                     # auth, prisma, grading, codeRunner,
│  │                           # tutor, gamification, rewards, queries
│  └─ types/
└─ README.md
```

---

## 🔌 Extending the MVP

### Connect a real AI tutor
Open `src/lib/tutor.ts`, set `USE_REAL_AI = true`, and implement `callRealAI()`. A commented
Anthropic example and a `buildSystemPrompt()` helper are already provided. The UI and API
(`/api/tutor`) need no changes.

### Real code execution
`src/lib/codeRunner.ts` returns a typed `RunResult`. Replace `runCode()` with a `fetch` to a
backend endpoint that executes code in a Docker/secure sandbox — the UI stays identical.

### Add content
- **Lessons:** use the **Admin** page form, or add to `prisma/seed-data/*` and re-seed.
- **Quizzes/Exams:** add entries in the seed data (typed via `prisma/seed-data/types.ts`) and
  run `npm run db:reset`.

### Switch to PostgreSQL
In `prisma/schema.prisma` set `provider = "postgresql"`, update `DATABASE_URL`, then
`npm run db:push && npm run db:seed`.

---

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (generates Prisma client) |
| `npm run start` | Run the production build |
| `npm run setup` | Generate client + create DB + seed |
| `npm run db:seed` | Seed content |
| `npm run db:reset` | Wipe & re-seed the database |

---

## ⚠️ Notes & Disclaimers

- The in-browser JavaScript runner is an **educational sandbox**, not a security boundary —
  do not run untrusted code with it in production. Use a real sandbox service instead.
- Short-answer/debug questions are graded with keyword/normalized matching; tune the answer
  keys in the seed data for stricter grading.

Built with Next.js, TypeScript, Tailwind & Prisma. Happy learning! 🎓
