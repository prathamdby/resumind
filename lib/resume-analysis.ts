import { makeAIRequest } from "@/lib/ai-helpers";
import { getAISystemPrompt, prepareInstructions } from "@/constants";
import type { Feedback } from "@/types";
import type { ReasoningLevel } from "@/app/components/ReasoningToggle";

export const MAX_MARKDOWN_LENGTH = 15000;
const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || "http://localhost:8000";

export async function convertPdfToMarkdown(
  fileBuffer: Buffer,
): Promise<{ markdown: string; previewImage: string | null }> {
  const formData = new FormData();
  const file = new File([new Uint8Array(fileBuffer)], "resume.pdf", {
    type: "application/pdf",
  });
  formData.append("file", file);
  formData.append("extract_preview", "true");

  const response = await fetch(`${PDF_SERVICE_URL}/convert`, {
    method: "POST",
    body: formData,
    signal: AbortSignal.timeout(25000),
  });

  if (!response.ok) {
    throw new Error("PDF conversion failed");
  }

  const result = await response.json();
  const markdown = result.markdown || "";

  let previewImage: string | null = null;
  if (result.preview_image && typeof result.preview_image === "string") {
    if (
      result.preview_image.startsWith("data:image/") &&
      result.preview_image.length <= 5_000_000
    ) {
      previewImage = result.preview_image;
    }
  }

  return {
    markdown: markdown.slice(0, MAX_MARKDOWN_LENGTH),
    previewImage,
  };
}

export async function analyzeResumeWithAI(
  markdown: string,
  jobTitle: string,
  jobDescription: string,
  reasoningLevel: ReasoningLevel,
  companyName?: string,
): Promise<Feedback> {
  const systemPrompt = getAISystemPrompt();
  const userPrompt =
    prepareInstructions({ jobTitle, jobDescription, companyName }) +
    `\n\nResume:\n${markdown}`;

  return makeAIRequest<Feedback>({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    reasoningLevel,
  });
}
