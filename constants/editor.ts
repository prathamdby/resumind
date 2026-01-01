export const DEFAULT_LATEX_RESUME = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{hyperref}

\\geometry{margin=0.75in}
\\pagestyle{empty}
\\setlist[itemize]{nosep, leftmargin=*}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{1em}{0.5em}

\\begin{document}

\\begin{center}
    {\\LARGE\\bfseries Your Name}\\\\[0.3em]
    \\href{mailto:email@example.com}{email@example.com} \\textbar{} (555) 123-4567 \\textbar{} City, State\\\\
    \\href{https://linkedin.com/in/yourprofile}{linkedin.com/in/yourprofile} \\textbar{} \\href{https://github.com/yourusername}{github.com/yourusername}
\\end{center}

\\section{Summary}
Experienced professional seeking opportunities to leverage skills in [your field]. Passionate about [relevant interests] with a track record of [key achievements].

\\section{Experience}
\\textbf{Job Title} \\hfill Company Name\\\\
\\textit{Start Date -- End Date} \\hfill City, State
\\begin{itemize}
    \\item Accomplishment or responsibility description
    \\item Another accomplishment with quantifiable results
    \\item Key achievement demonstrating skills
\\end{itemize}

\\section{Education}
\\textbf{Degree Name} \\hfill University Name\\\\
\\textit{Graduation Year} \\hfill City, State

\\section{Skills}
\\textbf{Technical:} Skill 1, Skill 2, Skill 3, Skill 4\\\\
\\textbf{Languages:} Language 1 (Native), Language 2 (Fluent)

\\end{document}`;

export const EDITOR_SYSTEM_PROMPT = `You are an expert resume writer and LaTeX specialist. You help users create and edit professional resumes.

When the user asks you to create or modify their resume, you MUST:
1. Respond conversationally explaining what you did
2. Use the update_resume tool to apply changes

IMPORTANT RULES:
- Always output the FULL LaTeX document, not just snippets
- Use a clean, professional resume template
- Keep the LaTeX simple and compatible with pdflatex
- Do not use exotic packages that might not be available
- Escape special LaTeX characters properly (%, $, &, #, _)
- NEVER invent information - only use what the user provides

If the user hasn't provided resume details yet, start with the template and ask for their information.`;

export const UPDATE_RESUME_TOOL = {
  type: "function" as const,
  function: {
    name: "update_resume",
    description:
      "Update the user's resume with new LaTeX content. Use this tool whenever the user asks you to create, modify, or update their resume. Always provide the COMPLETE LaTeX document.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        latex: {
          type: "string",
          description:
            "The complete LaTeX document for the resume. Must be a valid, compilable LaTeX document starting with \\documentclass and ending with \\end{document}.",
        },
        explanation: {
          type: "string",
          description:
            "A brief explanation of what changes were made to the resume.",
        },
      },
      required: ["latex", "explanation"],
    },
    strict: true,
  },
};
