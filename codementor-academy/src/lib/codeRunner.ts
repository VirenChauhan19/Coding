// Client-side code runner for the practice area.
//
// - JavaScript runs sandboxed in the browser via a captured-console Function.
// - Other languages are "simulated" (we can't safely run them in-browser),
//   returning a friendly note. The interface is designed so a backend
//   execution service (Docker / secure sandbox) can be swapped in later by
//   replacing `runCode` with an API call — the return shape stays the same.

export interface RunResult {
  ok: boolean;
  output: string;
  error?: string;
  /** Human-friendly explanation of an error, if any. */
  errorExplanation?: string;
  durationMs: number;
}

export interface TestOutcome {
  description: string;
  passed: boolean;
  expected: string;
  received: string;
}

/**
 * Run code and capture output. For JS, executes in a sandboxed function with a
 * patched console. For everything else, returns a simulated message.
 */
export async function runCode(
  language: string,
  code: string,
): Promise<RunResult> {
  const start = performance.now();
  const lang = language.toLowerCase();

  if (lang === "javascript" || lang === "js" || lang === "node") {
    return runJavaScript(code, start);
  }

  // Simulated execution for non-JS languages.
  return {
    ok: true,
    output:
      `▶ Simulated ${language} runner\n` +
      `─────────────────────────────\n` +
      `Real execution for ${language} runs in a secure server sandbox\n` +
      `(coming soon). For now, JavaScript runs live in your browser.\n\n` +
      `Your code (${code.split("\n").length} lines) looks ready to submit.`,
    durationMs: Math.round(performance.now() - start),
  };
}

function runJavaScript(code: string, start: number): RunResult {
  const logs: string[] = [];
  const sandboxConsole = {
    log: (...args: unknown[]) => logs.push(args.map(format).join(" ")),
    error: (...args: unknown[]) => logs.push(args.map(format).join(" ")),
    warn: (...args: unknown[]) => logs.push(args.map(format).join(" ")),
    info: (...args: unknown[]) => logs.push(args.map(format).join(" ")),
  };

  try {
    // Block obvious environment access. This is a best-effort guard for an
    // educational sandbox — NOT a security boundary for untrusted code.
    const blocked = /\b(window|document|fetch|XMLHttpRequest|localStorage|process|require|import)\b/;
    if (blocked.test(code)) {
      return {
        ok: false,
        output: logs.join("\n"),
        error: "Blocked: access to browser/environment APIs is not allowed here.",
        errorExplanation:
          "This sandbox only runs plain JavaScript logic. Avoid DOM, network, or environment APIs.",
        durationMs: Math.round(performance.now() - start),
      };
    }

    // eslint-disable-next-line no-new-func
    const fn = new Function("console", `"use strict";\n${code}`);
    const result = fn(sandboxConsole);
    if (result !== undefined) logs.push(format(result));

    return {
      ok: true,
      output: logs.join("\n") || "(no output — try console.log(...) to print)",
      durationMs: Math.round(performance.now() - start),
    };
  } catch (err) {
    const e = err as Error;
    return {
      ok: false,
      output: logs.join("\n"),
      error: `${e.name}: ${e.message}`,
      errorExplanation: explainError(e),
      durationMs: Math.round(performance.now() - start),
    };
  }
}

/** Run code against test cases by comparing trimmed console output. */
export async function runTests(
  language: string,
  code: string,
  testCases: { input: string; expected: string; description?: string }[],
): Promise<TestOutcome[]> {
  const outcomes: TestOutcome[] = [];
  for (const tc of testCases) {
    // The harness appends the test's input expression and logs its result.
    const harness = `${code}\n;console.log(String(${tc.input}));`;
    const result = await runCode(language, harness);
    const received = (result.output ?? "").trim().split("\n").pop() ?? "";
    outcomes.push({
      description: tc.description || `${tc.input} → ${tc.expected}`,
      expected: tc.expected,
      received: result.ok ? received : result.error ?? "error",
      passed: result.ok && received.trim() === tc.expected.trim(),
    });
  }
  return outcomes;
}

function format(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/** Turn common runtime errors into beginner-friendly explanations. */
export function explainError(e: Error): string {
  const msg = e.message.toLowerCase();
  if (e.name === "SyntaxError")
    return "There's a typo in your syntax — check for missing brackets, quotes, or commas.";
  if (msg.includes("is not defined"))
    return "You used a variable or function before defining it (or misspelled its name).";
  if (msg.includes("is not a function"))
    return "You're calling something that isn't a function — check the value's type.";
  if (msg.includes("cannot read") || msg.includes("undefined"))
    return "You're reading a property of something that is undefined/null. Verify the value exists first.";
  if (msg.includes("maximum call stack"))
    return "Infinite recursion — a function keeps calling itself without a stopping condition.";
  return "Read the error message carefully and check the line it points to.";
}
