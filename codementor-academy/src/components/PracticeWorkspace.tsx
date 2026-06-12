"use client";

import { useMemo, useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Card";
import { runCode, runTests, type RunResult, type TestOutcome } from "@/lib/codeRunner";
import { DIFFICULTY_BADGE_CLASSES } from "@/lib/utils";
import type { Difficulty, TestCase } from "@/types";

export interface PracticeProblemDTO {
  id: string;
  title: string;
  prompt: string;
  language: string;
  starterCode: string;
  solution: string;
  difficulty: Difficulty;
  topic: string;
  testCases: TestCase[];
}

export function PracticeWorkspace({
  problems,
  initialId,
}: {
  problems: PracticeProblemDTO[];
  initialId?: string;
}) {
  const [selectedId, setSelectedId] = useState(
    initialId && problems.some((p) => p.id === initialId) ? initialId : problems[0]?.id,
  );
  const selected = useMemo(
    () => problems.find((p) => p.id === selectedId) ?? problems[0],
    [problems, selectedId],
  );

  const [code, setCode] = useState(selected?.starterCode ?? "");
  const [result, setResult] = useState<RunResult | null>(null);
  const [tests, setTests] = useState<TestOutcome[] | null>(null);
  const [tab, setTab] = useState<"output" | "tests">("output");
  const [running, setRunning] = useState(false);

  function selectProblem(id: string) {
    const p = problems.find((x) => x.id === id);
    setSelectedId(id);
    setCode(p?.starterCode ?? "");
    setResult(null);
    setTests(null);
    setTab("output");
  }

  async function handleRun() {
    if (!selected) return;
    setRunning(true);
    setTab("output");
    const res = await runCode(selected.language, code);
    setResult(res);
    setRunning(false);
  }

  async function handleTests() {
    if (!selected) return;
    setRunning(true);
    setTab("tests");
    const outcomes = await runTests(selected.language, code, selected.testCases);
    setTests(outcomes);
    setRunning(false);
  }

  if (!selected) {
    return <p className="text-slate-500">No practice problems available yet.</p>;
  }

  const passedCount = tests?.filter((t) => t.passed).length ?? 0;

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      {/* Problem list + prompt */}
      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Problem
          </label>
          <select
            value={selected.id}
            onChange={(e) => selectProblem(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
          >
            {problems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} {p.topic ? `· ${p.topic}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">{selected.title}</h2>
            <Pill className={DIFFICULTY_BADGE_CLASSES[selected.difficulty]}>
              {selected.difficulty}
            </Pill>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">{selected.prompt}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill className="bg-slate-100 text-slate-600">{selected.language}</Pill>
            {selected.topic && <Pill className="bg-slate-100 text-slate-600">{selected.topic}</Pill>}
          </div>

          {selected.testCases.length > 0 && (
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Test cases
              </p>
              <ul className="space-y-1 text-xs text-slate-500">
                {selected.testCases.map((tc, i) => (
                  <li key={i} className="rounded-lg bg-slate-50 px-2.5 py-1.5 font-mono">
                    {tc.description || `${tc.input} → ${tc.expected}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Editor + output */}
      <div className="space-y-4 lg:col-span-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Editor — {selected.language}
            </span>
            <button
              onClick={() => setCode(selected.starterCode)}
              className="text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              ↺ Reset
            </button>
          </div>
          <CodeEditor value={code} onChange={setCode} language={selected.language} />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={handleRun} disabled={running} variant="success">
              ▶ Run
            </Button>
            {selected.testCases.length > 0 && (
              <Button onClick={handleTests} disabled={running} variant="primary">
                ✓ Run Tests
              </Button>
            )}
            {selected.solution && (
              <Button
                onClick={() => setCode(selected.solution)}
                variant="ghost"
                className="ml-auto"
              >
                💡 Show solution
              </Button>
            )}
          </div>
        </div>

        {/* Output / Tests panel */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="flex border-b border-slate-100">
            <TabBtn active={tab === "output"} onClick={() => setTab("output")}>
              Output
            </TabBtn>
            <TabBtn active={tab === "tests"} onClick={() => setTab("tests")}>
              Test Cases {tests && `(${passedCount}/${tests.length})`}
            </TabBtn>
          </div>

          <div className="p-4">
            {running && <p className="text-sm text-slate-400">Running…</p>}

            {!running && tab === "output" && (
              <>
                {result ? (
                  <>
                    <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
                      {result.output || "(no output)"}
                    </pre>
                    {result.error && (
                      <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
                        <div className="text-xs font-bold text-rose-700">⚠ {result.error}</div>
                        {result.errorExplanation && (
                          <p className="mt-1 text-xs text-rose-600">
                            <span className="font-semibold">What it means: </span>
                            {result.errorExplanation}
                          </p>
                        )}
                      </div>
                    )}
                    <p className="mt-2 text-[11px] text-slate-400">
                      Finished in {result.durationMs}ms
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-400">
                    Click <span className="font-semibold">Run</span> to execute your code.
                  </p>
                )}
              </>
            )}

            {!running && tab === "tests" && (
              <>
                {tests ? (
                  <div className="space-y-2">
                    {tests.map((t, i) => (
                      <div
                        key={i}
                        className={
                          "flex items-start justify-between rounded-lg border p-3 text-xs " +
                          (t.passed
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-rose-200 bg-rose-50")
                        }
                      >
                        <div>
                          <div className="font-semibold text-slate-700">
                            {t.passed ? "✓" : "✕"} {t.description}
                          </div>
                          {!t.passed && (
                            <div className="mt-1 font-mono text-slate-500">
                              expected <b>{t.expected}</b>, got <b>{t.received}</b>
                            </div>
                          )}
                        </div>
                        <Pill className={t.passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}>
                          {t.passed ? "Pass" : "Fail"}
                        </Pill>
                      </div>
                    ))}
                    {passedCount === tests.length && (
                      <div className="rounded-lg bg-emerald-100 p-3 text-center text-sm font-bold text-emerald-700">
                        🎉 All tests passed! Nicely done.
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    Click <span className="font-semibold">Run Tests</span> to check your solution.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "px-4 py-2.5 text-sm font-semibold transition-colors " +
        (active ? "border-b-2 border-brand-600 text-brand-700" : "text-slate-400 hover:text-slate-600")
      }
    >
      {children}
    </button>
  );
}
