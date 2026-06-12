# 🚀 Deploying CodeMentor Academy

The code lives in a subfolder of this repo: **`codementor-academy/`**.

Local development uses **SQLite**. Serverless hosts (Vercel) have a read-only,
ephemeral filesystem, so for a live deployment you need a **hosted Postgres**
database. The steps below take ~10 minutes and use free tiers only.

---

## Option A — Vercel + Neon Postgres (recommended)

### 1. Create a free Postgres database (Neon)
1. Go to **https://neon.tech** → sign up (free).
2. Create a project → copy the **connection string** (looks like
   `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`).

### 2. Point Prisma at Postgres
In `codementor-academy/prisma/schema.prisma`, change the datasource provider:
```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```
Commit & push this change (or do it in step 4 after import — either works).

### 3. Create the tables and seed content (run once, from your machine)
```bash
cd codementor-academy
# Use the Neon URL for this one-off setup:
DATABASE_URL="postgresql://...neon..." npx prisma db push
DATABASE_URL="postgresql://...neon..." npx tsx prisma/seed.ts
```
On Windows PowerShell:
```powershell
$env:DATABASE_URL="postgresql://...neon..."; npx prisma db push
$env:DATABASE_URL="postgresql://...neon..."; npx tsx prisma/seed.ts
```

### 4. Import into Vercel
1. Go to **https://vercel.com** → **Add New… → Project** → import this GitHub repo
   (`VirenChauhan19/Coding`).
2. **Set "Root Directory" to `codementor-academy`** (important — the app is in a subfolder).
3. Add **Environment Variables**:
   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | your Neon connection string |
   | `AUTH_SECRET` | a long random string (`openssl rand -base64 32`) |
4. Click **Deploy**.

Vercel runs `npm run build` (which includes `prisma generate`). You'll get a
live URL like `https://your-project.vercel.app`.

> **Demo login:** `student@codementor.dev` / `password123`

---

## Option B — Railway (keeps SQLite, persistent disk)
1. Go to **https://railway.app** → New Project → Deploy from GitHub repo.
2. Set the service root/working directory to `codementor-academy`.
3. Add a **Volume** mounted at `/app/prisma` so `dev.db` persists.
4. Set env vars `AUTH_SECRET` (random) and `DATABASE_URL="file:./dev.db"`.
5. Set the start command to seed on first boot if needed:
   `npx prisma db push && npx tsx prisma/seed.ts && npm run start`.

---

## Notes
- The `.env` file is **gitignored** — never commit real secrets. Copy
  `.env.example` → `.env` locally.
- Re-deploying does **not** wipe a Postgres DB (only re-run the seed if you want
  to reset demo data).
- The in-browser JS code runner is an educational sandbox, not a security
  boundary — see `README.md`.
