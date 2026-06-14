import type { LineImprovement } from "@/types";

export const LATEX_IMPROVE_SYSTEM_PROMPT = `You are an expert LaTeX resume editor specializing in ATS-optimized resumes. Your task is to transform resume LaTeX code by applying specific text improvements while preserving the LaTeX structure, macros, and document integrity.

## Core Rules:
1. PRESERVE ALL LATEX COMMANDS. Never modify \\section{}, \\cventry{}, \\begin{}, \\end{}, etc.
2. ONLY MODIFY CONTENT TEXT. Change the text inside braces, not the structure.
3. MAINTAIN DOCUMENT FLOW. Keep sections in the same order.
4. PRESERVE MACROS. Keep custom commands (\\cvitem, \\cvtag, etc.) intact.
5. NO INVENTED CONTENT. Only use information present in the original.
6. ESCAPE SPECIAL CHARACTERS. Ensure \\&, \\%, \\$ are preserved correctly.

## Common Resume LaTeX Patterns:
- moderncv: \\section{}, \\cventry{date}{title}{company}{location}{description}{}, \\cvitem{label}{content}
- altacv: \\cvsection{}, \\cvevent{title}{date}{location}{description}, \\cvtag{skill}
- awesome-cv: \\cvsection{}, \\cventry{}{}{}{}{}{}, \\cvskill{skill}{level}
- Standard LaTeX: \\section{}, \\textbf{}, \\textit{}, \\begin{itemize}...\\end{itemize}

## Improvement Categories:
1. QUANTIFY. Add metrics and numbers where they exist in original.
2. ACTION VERBS. Replace weak verbs with strong ones.
3. KEYWORD OPTIMIZATION. Include job-relevant keywords naturally.
4. CLARITY. Remove fluff, improve conciseness.
5. ATS OPTIMIZATION. Ensure parser-friendly formatting.

## Output Format:
Return ONLY a JSON object with this structure:
{
  "improvedLatex": "\\\\documentclass...",
  "changesApplied": 8,
  "sectionsModified": ["Summary", "Experience", "Skills"]
}

NO markdown, NO explanations, ONLY valid JSON.`;

export const LatexImproveResponseFormat = `
interface LatexImproveResponse {
  improvedLatex: string;
  changesApplied: number;
  sectionsModified: string[];
}`;

export function prepareLatexImprovePrompt({
  latexCode,
  lineImprovements,
  jobTitle,
  companyName,
}: {
  latexCode: string;
  lineImprovements: LineImprovement[];
  jobTitle: string;
  companyName?: string;
}): string {
  const grouped = lineImprovements.reduce(
    (acc, imp) => {
      const key = imp.section;
      if (!acc[key]) acc[key] = [];
      acc[key].push(imp);
      return acc;
    },
    {} as Record<string, LineImprovement[]>,
  );

  const improvementsText = Object.entries(grouped)
    .map(([section, items]) => {
      const itemsText = items
        .map(
          (imp, i) =>
            `  ${i + 1}. [${imp.priority.toUpperCase()}] ${imp.sectionTitle}
     Original: "${imp.original}"
     Suggested: "${imp.suggested}"
     Reason: ${imp.reason}`,
        )
        .join("\n");
      return `[${section.toUpperCase()}]\n${itemsText}`;
    })
    .join("\n\n");

  return `Transform the following LaTeX resume code by applying the suggested improvements.

## Job Context:
- Position: ${jobTitle}
${companyName ? `- Target Company: ${companyName}` : ""}

## IMPROVEMENTS TO APPLY:
${improvementsText}

## ORIGINAL LATEX CODE:
\`\`\`latex
${latexCode}
\`\`\`

## TRANSFORMATION INSTRUCTIONS:
1. Apply each suggested improvement to the corresponding section
2. Preserve ALL LaTeX commands, environments, and macros exactly
3. Only change the CONTENT text, not the structure
4. Maintain the same overall document organization
5. Ensure the LaTeX remains compilable
6. Keep escaped characters properly escaped (\\&, \\%, \\$)

## OUTPUT:
Return ONLY valid JSON matching this structure: ${LatexImproveResponseFormat}
Return ONLY valid JSON, no markdown formatting or code blocks.`;
}
