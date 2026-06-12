import React from "react";

// A deliberately small markdown renderer for our seeded lesson content.
// Supports: ## / ### headings, ```fenced code```, `inline code`, **bold**,
// "- " bullet lists, and paragraphs. Avoids a heavy dependency for the MVP.

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Split on `code` and **bold** while keeping delimiters.
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  const parts = text.split(regex);
  parts.forEach((part, i) => {
    if (!part) return;
    if (part.startsWith("`") && part.endsWith("`")) {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${i}`}
          className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.85em] font-medium text-brand-700"
        >
          {part.slice(1, -1)}
        </code>,
      );
    } else if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>,
      );
    } else {
      nodes.push(<React.Fragment key={`${keyPrefix}-t-${i}`}>{part}</React.Fragment>);
    }
  });
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let list: string[] = [];

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="my-3 ml-1 space-y-1.5">
        {list.map((item, idx) => (
          <li key={idx} className="flex gap-2 text-slate-600">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-400" />
            <span>{renderInline(item, `li-${blocks.length}-${idx}`)}</span>
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trimStart().startsWith("```")) {
      flushList();
      const lang = line.trim().replace(/`/g, "").trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push(
        <pre
          key={`pre-${blocks.length}`}
          className="my-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm leading-relaxed text-slate-100"
        >
          {lang && (
            <div className="mb-2 text-[10px] uppercase tracking-wider text-slate-400">
              {lang}
            </div>
          )}
          <code>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    if (line.startsWith("### ")) {
      flushList();
      blocks.push(
        <h3 key={`h3-${blocks.length}`} className="mt-5 mb-2 text-lg font-semibold text-slate-900">
          {renderInline(line.slice(4), `h3-${blocks.length}`)}
        </h3>,
      );
    } else if (line.startsWith("## ")) {
      flushList();
      blocks.push(
        <h2 key={`h2-${blocks.length}`} className="mt-6 mb-2 text-xl font-bold text-slate-900">
          {renderInline(line.slice(3), `h2-${blocks.length}`)}
        </h2>,
      );
    } else if (line.startsWith("- ")) {
      list.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      blocks.push(
        <p key={`p-${blocks.length}`} className="my-2 leading-relaxed text-slate-600">
          {renderInline(line, `p-${blocks.length}`)}
        </p>,
      );
    }
    i++;
  }
  flushList();

  return <div className="text-[15px]">{blocks}</div>;
}

/** A standalone code block with a copy-friendly mono style (server component). */
export function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
      {language && (
        <div className="mb-2 text-[10px] uppercase tracking-wider text-slate-400">
          {language}
        </div>
      )}
      <code>{code}</code>
    </pre>
  );
}
