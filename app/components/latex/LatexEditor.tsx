"use client";

import { memo } from "react";
import Editor from "react-simple-code-editor";
import { highlightLatex } from "./latex-prism-grammar";

interface LatexEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const PLACEHOLDER = `% Paste your LaTeX resume code here
\\documentclass[11pt]{article}
\\begin{document}

\\section{Experience}
\\textbf{Software Engineer} -- Acme Corp \\\\
Built distributed systems serving 10M users.

\\end{document}`;

function LatexEditorInner({ value, onChange, readOnly }: LatexEditorProps) {
  return (
    <div className="latex-editor-wrap">
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={highlightLatex}
        padding={20}
        placeholder={PLACEHOLDER}
        readOnly={readOnly}
        textareaClassName="latex-editor-textarea"
        className="latex-editor"
        style={{
          fontFamily: "'Fira Code', 'JetBrains Mono', 'SF Mono', monospace",
          fontSize: 13,
          lineHeight: 1.7,
          minHeight: "100%",
        }}
      />
    </div>
  );
}

const LatexEditor = memo(LatexEditorInner);
export default LatexEditor;
