"use client";

import Editor from "react-simple-code-editor";
import Prism from "prismjs";
// Language grammars (order matters — dependents come after their base).
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-markup"; // html
import "prismjs/components/prism-css";
import "prismjs/themes/prism-tomorrow.css";

const LANG_MAP: Record<string, string> = {
  javascript: "javascript",
  js: "javascript",
  python: "python",
  java: "java",
  "c++": "cpp",
  cpp: "cpp",
  sql: "sql",
  "html/css": "markup",
  html: "markup",
  css: "css",
};

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  readOnly = false,
}: {
  value: string;
  onChange: (code: string) => void;
  language?: string;
  readOnly?: boolean;
}) {
  const grammarKey = LANG_MAP[language.toLowerCase()] ?? "javascript";

  return (
    <div className="overflow-auto rounded-xl bg-[#2d2d2d] text-sm" style={{ maxHeight: 460 }}>
      <Editor
        value={value}
        onValueChange={readOnly ? () => {} : onChange}
        highlight={(code) =>
          Prism.highlight(
            code,
            Prism.languages[grammarKey] ?? Prism.languages.javascript,
            grammarKey,
          )
        }
        padding={16}
        readOnly={readOnly}
        textareaClassName="focus:outline-none"
        className="font-mono"
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 13.5,
          lineHeight: 1.6,
          color: "#f8f8f2",
          minHeight: 240,
        }}
      />
    </div>
  );
}
