"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface Message {
  role: "user" | "tutor";
  content: string;
  suggestions?: string[];
}

const STARTERS = [
  "Explain this lesson simply",
  "Give me a hint",
  "What should I study next?",
];

export function TutorChat({
  lessonTitle,
  language,
  level,
}: {
  lessonTitle: string;
  language: string;
  level: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "tutor",
      content: `Hi! I'm your CodeMentor tutor 🧑‍🏫 Ask me anything about **${lessonTitle}** — I'll explain concepts, give hints, or break down errors.`,
      suggestions: STARTERS,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          context: { lessonTitle, language, level },
          history,
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "tutor", content: data.reply ?? "Sorry, try again.", suggestions: data.suggestions },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "tutor", content: "I had trouble responding — please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[520px] flex-col rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <span className="text-xl">🧑‍🏫</span>
        <div>
          <div className="text-sm font-bold text-slate-900">AI Tutor</div>
          <div className="text-xs text-slate-400">Always here to help</div>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm " +
                (m.role === "user"
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-700")
              }
            >
              <TutorText content={m.content} />
              {m.suggestions && m.suggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-brand-700 shadow-sm hover:bg-brand-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-400">
              <span className="inline-flex gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce [animation-delay:0.15s]">●</span>
                <span className="animate-bounce [animation-delay:0.3s]">●</span>
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2 border-t border-slate-100 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your tutor…"
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}

/** Renders **bold** inside tutor messages; keeps line breaks. */
function TutorText({ content }: { content: string }) {
  return (
    <div className="space-y-1 whitespace-pre-wrap leading-relaxed">
      {content.split("\n").map((line, i) => (
        <span key={i} className="block">
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j}>{part.slice(2, -2)}</strong>
            ) : (
              <span key={j}>{part}</span>
            ),
          )}
        </span>
      ))}
    </div>
  );
}
