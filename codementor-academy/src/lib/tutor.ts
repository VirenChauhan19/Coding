// AI Tutor service.
//
// This module exposes a single `getTutorResponse` function. Today it returns
// rule-based placeholder responses so the UX works end-to-end. To connect a
// real model later, implement `callRealAI` and flip USE_REAL_AI (or branch on
// process.env.AI_PROVIDER). The function signature stays the same, so nothing
// in the UI needs to change.

export interface TutorContext {
  lessonTitle?: string;
  language?: string;
  level?: string;
  /** Optional code the student is asking about. */
  code?: string;
}

export interface TutorRequest {
  question: string;
  context?: TutorContext;
  history?: { role: "user" | "tutor"; content: string }[];
}

export interface TutorResponse {
  reply: string;
  /** What the tutor suggests studying next. */
  suggestions?: string[];
}

const USE_REAL_AI = false;

/**
 * Public entry point. Swap the implementation without touching callers.
 */
export async function getTutorResponse(
  req: TutorRequest,
): Promise<TutorResponse> {
  if (USE_REAL_AI) {
    return callRealAI(req);
  }
  return placeholderResponse(req);
}

/**
 * Placeholder: connect your AI provider here later.
 *
 * Example (Anthropic):
 *   const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
 *   const msg = await client.messages.create({
 *     model: "claude-opus-4-8",
 *     max_tokens: 1024,
 *     system: buildSystemPrompt(req.context),
 *     messages: toProviderMessages(req),
 *   });
 *   return { reply: msg.content[0].text };
 */
async function callRealAI(req: TutorRequest): Promise<TutorResponse> {
  // Intentionally falls back until a provider is wired in.
  return placeholderResponse(req);
}

/** Build a system prompt — reused by the real implementation later. */
export function buildSystemPrompt(ctx?: TutorContext): string {
  const lesson = ctx?.lessonTitle ? ` on the lesson "${ctx.lessonTitle}"` : "";
  const lang = ctx?.language ? ` for ${ctx.language}` : "";
  return [
    `You are CodeMentor, a patient, encouraging coding tutor${lang}.`,
    `The student is currently working${lesson}.`,
    "Explain concepts simply with small examples.",
    "When the student is stuck, give hints first — do not immediately give the full answer.",
    "When asked about errors, break them down line by line.",
    "Always end by suggesting what to study or try next.",
  ].join(" ");
}

// ---------------------------------------------------------------------------
// Rule-based placeholder brain
// ---------------------------------------------------------------------------

function placeholderResponse(req: TutorRequest): TutorResponse {
  const q = req.question.toLowerCase();
  const topic = req.context?.lessonTitle ?? "this topic";
  const lang = req.context?.language ?? "code";

  // Error / debugging intent
  if (/error|bug|not work|won.?t run|exception|traceback|fix/.test(q)) {
    return {
      reply: [
        `Let's debug this together — I won't just hand you the fix. 🧭`,
        "",
        "Walk through it step by step:",
        "1. **Read the error message bottom-up.** The last line usually names the error type; the line above points to *where* it happened.",
        "2. **Check the exact line.** Look for typos, missing colons/brackets, or a variable used before it's defined.",
        "3. **Print to inspect.** Add a quick print/console.log just before the failing line to see the real values.",
        "",
        req.context?.code
          ? "Looking at your code, scan for mismatched indentation and unclosed brackets first — those cause most beginner errors."
          : "Paste the exact error text and I'll point you to the likely cause.",
      ].join("\n"),
      suggestions: [
        "Try the 'Error explanation' panel in the practice area",
        `Review the ${topic} summary section`,
      ],
    };
  }

  // "Explain line by line"
  if (/line by line|explain (this|the) code|what does this do|walk me through/.test(q)) {
    return {
      reply: [
        `Sure — here's how I read ${lang} line by line: 🔍`,
        "",
        "- **Top to bottom**: most code runs in order, so trace it like a recipe.",
        "- **Each line does one job**: name what it *creates*, *changes*, or *decides*.",
        "- **Watch indentation/blocks**: indented lines belong to the loop, function, or `if` above them.",
        "",
        req.context?.code
          ? "Drop the specific snippet here and I'll annotate each line and the value it produces."
          : `Share the snippet from "${topic}" and I'll annotate it.`,
      ].join("\n"),
      suggestions: ["Run the code example in the practice area and watch the output change"],
    };
  }

  // "Give me a hint"
  if (/hint|stuck|help me|how do i start|where do i begin/.test(q)) {
    return {
      reply: [
        "Here's a nudge rather than the full solution 😊",
        "",
        `1. Restate the goal of this exercise in your own words.`,
        `2. Identify the **inputs** and the **output** you need.`,
        `3. Write the steps in plain English first, then translate one step into ${lang}.`,
        "",
        "Start with just the first step — get *something* running, then build up.",
      ].join("\n"),
      suggestions: [`Re-read the "${topic}" code example`, "Try writing pseudocode first"],
    };
  }

  // "What next"
  if (/what.?s next|study next|after this|move on|next lesson|what should i learn/.test(q)) {
    return {
      reply: [
        `Great progress on ${topic}! Here's a good path forward: 🚀`,
        "",
        "1. Make sure you can explain it without looking.",
        "2. Take the lesson quiz to confirm it stuck.",
        "3. Try a practice problem that combines it with what you already know.",
        "",
        "Once the quiz feels easy, you're ready for the next lesson.",
      ].join("\n"),
      suggestions: ["Take the lesson quiz", "Attempt the next practice problem"],
    };
  }

  // Default: concept explanation
  return {
    reply: [
      `Good question about ${topic}! Here's the simple version: 💡`,
      "",
      `Think of it as a building block in ${lang}. The key ideas are:`,
      "- **What it is** — a tool to solve a specific kind of problem.",
      "- **When to use it** — look for the pattern it's designed for.",
      "- **How to use it** — start from the code example, change one thing, and observe the result.",
      "",
      "The fastest way to understand it is to experiment: tweak the example in the practice area and watch what changes.",
    ].join("\n"),
    suggestions: [
      `Read the "${topic}" summary`,
      "Experiment with the code example",
      "Take the quiz when you feel ready",
    ],
  };
}
