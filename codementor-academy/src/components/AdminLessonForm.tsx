"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AdminLessonForm({
  courses,
}: {
  courses: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [content, setContent] = useState("");
  const [codeExample, setCodeExample] = useState("");
  const [summary, setSummary] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, title, level, content, codeExample, summary, prerequisites }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ ok: true, text: "Lesson created ✓" });
      setTitle("");
      setContent("");
      setCodeExample("");
      setSummary("");
      setPrerequisites("");
      router.refresh();
    } else {
      setMsg({ ok: false, text: data.error ?? "Failed to create lesson." });
    }
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Course">
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className={input}>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </Field>
        <Field label="Level">
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={input}>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </Field>
      </div>

      <Field label="Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} placeholder="e.g. Recursion Basics" required />
      </Field>

      <Field label="Content (Markdown: ## headings, ```code```, **bold**, - lists)">
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className={input} placeholder="## What is recursion?..." required />
      </Field>

      <Field label="Code example (optional)">
        <textarea value={codeExample} onChange={(e) => setCodeExample(e.target.value)} rows={3} className={`${input} font-mono`} />
      </Field>

      <Field label="Summary (optional)">
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className={input} />
      </Field>

      <Field label="Checklist — one item per line (optional)">
        <textarea value={prerequisites} onChange={(e) => setPrerequisites(e.target.value)} rows={3} className={input} placeholder={"You can write a recursive function\nYou understand base cases"} />
      </Field>

      {msg && (
        <div className={`rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
          {msg.text}
        </div>
      )}

      <Button type="submit" disabled={saving} variant="primary">
        {saving ? "Saving…" : "Create lesson"}
      </Button>
    </form>
  );
}

const input =
  "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
