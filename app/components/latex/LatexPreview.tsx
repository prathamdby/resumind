"use client";

import { memo, useMemo } from "react";

interface LatexPreviewProps {
  latexCode: string;
}

function parseLatexToSections(code: string): { type: string; content: string }[] {
  if (!code.trim()) return [];

  const lines = code.split("\n");
  const sections: { type: string; content: string }[] = [];
  let inDocument = false;
  let currentSection = "";
  let currentContent: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("\\begin{document}")) {
      inDocument = true;
      continue;
    }
    if (trimmed.startsWith("\\end{document}")) {
      if (currentContent.length > 0) {
        sections.push({ type: currentSection || "content", content: currentContent.join("\n") });
      }
      break;
    }

    if (!inDocument) continue;

    const sectionMatch = trimmed.match(/^\\(?:section|cvsection)\{(.+?)\}/);
    if (sectionMatch) {
      if (currentContent.length > 0) {
        sections.push({ type: currentSection || "content", content: currentContent.join("\n") });
      }
      currentSection = sectionMatch[1];
      currentContent = [];
      continue;
    }

    if (trimmed.startsWith("%") || trimmed === "") continue;
    currentContent.push(line);
  }

  if (currentContent.length > 0) {
    sections.push({ type: currentSection || "content", content: currentContent.join("\n") });
  }

  if (sections.length === 0 && code.trim()) {
    sections.push({ type: "raw", content: code });
  }

  return sections;
}

function renderLatexLine(line: string): string {
  let result = line;

  result = result.replace(/\\textbf\{([^}]*)\}/g, "<strong>$1</strong>");
  result = result.replace(/\\textit\{([^}]*)\}/g, "<em>$1</em>");
  result = result.replace(/\\emph\{([^}]*)\}/g, "<em>$1</em>");
  result = result.replace(/\\underline\{([^}]*)\}/g, "<u>$1</u>");
  result = result.replace(/\\href\{([^}]*)\}\{([^}]*)\}/g, '<span class="text-indigo-600 underline">$2</span>');
  result = result.replace(/\\url\{([^}]*)\}/g, '<span class="text-indigo-600 underline">$1</span>');

  result = result.replace(/\\(?:cventry|cvevent)\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}/g,
    (_m, a, b, c, d) =>
      `<div class="mb-1"><strong>${a}</strong> <span class="text-slate-500">${b}</span></div><div class="text-sm text-slate-600">${c} ${d ? "| " + d : ""}</div>`);

  result = result.replace(/\\cvitem\{([^}]*)\}\{([^}]*)\}/g,
    '<div class="flex gap-3"><span class="font-medium text-slate-700 min-w-[80px]">$1</span><span>$2</span></div>');

  result = result.replace(/\\cvtag\{([^}]*)\}/g,
    '<span class="inline-block rounded-full border border-indigo-200 bg-indigo-50/60 px-2.5 py-0.5 text-xs font-medium text-indigo-700 mr-1.5 mb-1">$1</span>');

  result = result.replace(/\\cvskill\{([^}]*)\}\{([^}]*)\}/g,
    '<div class="flex justify-between"><span>$1</span><span class="text-slate-500">$2</span></div>');

  result = result.replace(/\\item\s*/g, "");
  result = result.replace(/\\\\$/g, "");
  result = result.replace(/\\\\(\s)/g, "$1");
  result = result.replace(/~~/g, " ");
  result = result.replace(/~/g, "&nbsp;");
  result = result.replace(/\\,/g, " ");
  result = result.replace(/\\&/g, "&amp;");
  result = result.replace(/\\%/g, "%");
  result = result.replace(/\\\$/g, "$");
  result = result.replace(/---/g, "\u2014");
  result = result.replace(/--/g, "\u2013");

  result = result.replace(/\\begin\{[^}]+\}/g, "");
  result = result.replace(/\\end\{[^}]+\}/g, "");
  result = result.replace(/\\[a-zA-Z]+\{([^}]*)\}/g, "$1");
  result = result.replace(/\\[a-zA-Z]+\*?\s*/g, "");

  return result.trim();
}

function LatexPreviewInner({ latexCode }: LatexPreviewProps) {
  const sections = useMemo(() => parseLatexToSections(latexCode), [latexCode]);

  if (!latexCode.trim()) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-500">Paste LaTeX code to see a preview</p>
          <p className="mt-1 text-xs text-slate-400">Supports moderncv, altacv, awesome-cv, and standard LaTeX</p>
        </div>
      </div>
    );
  }

  if (sections.length === 1 && sections[0].type === "raw") {
    return (
      <div className="latex-preview-content p-6">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 font-mono">
          {latexCode}
        </pre>
      </div>
    );
  }

  return (
    <div className="latex-preview-content space-y-5 p-6">
      {sections.map((section, idx) => {
        const lines = section.content
          .split("\n")
          .map((l) => renderLatexLine(l))
          .filter(Boolean);

        if (lines.length === 0) return null;

        const isItemized = section.content.includes("\\item");

        return (
          <div key={`${section.type}-${idx}`}>
            {section.type !== "content" && section.type !== "raw" && (
              <h3 className="mb-2.5 text-base font-semibold uppercase tracking-[0.15em] text-slate-800 border-b border-slate-200 pb-1.5">
                {section.type}
              </h3>
            )}
            {isItemized ? (
              <ul className="space-y-1.5 pl-4">
                {lines.map((html, i) => (
                  <li
                    key={i}
                    className="text-sm leading-relaxed text-slate-700 list-disc"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                ))}
              </ul>
            ) : (
              <div className="space-y-1.5">
                {lines.map((html, i) => (
                  <div
                    key={i}
                    className="text-sm leading-relaxed text-slate-700"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const LatexPreview = memo(LatexPreviewInner);
export default LatexPreview;
