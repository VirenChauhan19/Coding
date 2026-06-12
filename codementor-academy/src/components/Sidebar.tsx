"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LevelBar, StreakFlame } from "@/components/gamification/LevelBar";

interface SidebarUser {
  name: string;
  email: string;
  role: string;
  xp: number;
  streakCount: number;
}

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/courses", label: "Courses", icon: "📚" },
  { href: "/practice", label: "Practice", icon: "💻" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const nav = [...NAV];
  if (user.role === "ADMIN") {
    nav.push({ href: "/admin", label: "Admin", icon: "⚙️" });
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 font-extrabold text-slate-900">
          <span className="text-xl">🧑‍🏫</span> CodeMentor
        </Link>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <aside
        className={cn(
          "flex w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white",
          "fixed inset-y-0 left-0 z-40 transform transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="hidden items-center gap-2 px-6 py-5 text-lg font-extrabold text-slate-900 lg:flex">
          <span className="text-2xl">🧑‍🏫</span> CodeMentor
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User panel */}
        <div className="border-t border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{user.name}</div>
                <div className="truncate text-xs text-slate-400">{user.email}</div>
              </div>
            </div>
            <StreakFlame count={user.streakCount} size="sm" />
          </div>
          <LevelBar xp={user.xp} className="mb-3" />
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-rose-600"
          >
            <span>🚪</span> Log out
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
