export interface CompileResult {
  success: boolean;
  pdfUrl?: string;
  error?: string;
  fallback?: boolean;
}

export function validateLatex(latex: string): {
  valid: boolean;
  error?: string;
} {
  if (!latex.includes("\\documentclass")) {
    return { valid: false, error: "Missing \\documentclass" };
  }
  if (
    !latex.includes("\\begin{document}") ||
    !latex.includes("\\end{document}")
  ) {
    return { valid: false, error: "Missing document environment" };
  }
  return { valid: true };
}

export async function compileLatex(latex: string): Promise<CompileResult> {
  const validation = validateLatex(latex);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const response = await fetch("/api/editor/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latex }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || "Compilation failed",
        fallback: error.fallback,
      };
    }

    const blob = await response.blob();
    const pdfUrl = URL.createObjectURL(blob);

    return { success: true, pdfUrl };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Compilation failed",
    };
  }
}

export function extractLatexFromResponse(response: string): string | null {
  const match = response.match(/```latex\n([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}
