import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api-middleware";
import { handleAPIError } from "@/lib/api-errors";
import { makeAIRequest } from "@/lib/ai-helpers";
import { FeedbackSchema } from "@/lib/schemas";
import { getAISystemPrompt, prepareInstructions } from "@/constants";
import { prisma } from "@/lib/prisma";
import type { Feedback } from "@/types";
import type { ReasoningLevel } from "@/app/components/ReasoningToggle";

const MAX_MARKDOWN_LENGTH = 15000;
const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || "http://localhost:8000";

async function convertPdfToMarkdown(
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

async function analyzeWithAI(
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

export async function POST(request: NextRequest) {
  return await withAuthAndRateLimit(
    request,
    "/api/analyze",
    async ({ userId }) => {
      try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const jobTitle = formData.get("jobTitle") as string | null;
        const jobDescription = formData.get("jobDescription") as string | null;
        const companyName = formData.get("companyName") as string | null;
        const reasoningLevel =
          (formData.get("reasoningLevel") as ReasoningLevel) || "low";

        if (!file || !jobTitle || !jobDescription) {
          return NextResponse.json(
            { success: false, error: "Missing required fields" },
            { status: 400 },
          );
        }

        if (file.type !== "application/pdf") {
          return NextResponse.json(
            { success: false, error: "Only PDF files are supported" },
            { status: 400 },
          );
        }

        if (file.size > 20 * 1024 * 1024) {
          return NextResponse.json(
            { success: false, error: "File size must be under 20 MB" },
            { status: 400 },
          );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const { markdown, previewImage } =
          await convertPdfToMarkdown(buffer);
        if (markdown.length >= MAX_MARKDOWN_LENGTH) {
          return NextResponse.json(
            {
              success: false,
              error: "Resume too detailed. Please use a simpler format.",
            },
            { status: 400 },
          );
        }

        const feedback = await analyzeWithAI(
          markdown,
          jobTitle,
          jobDescription,
          reasoningLevel,
          companyName || undefined,
        );

        const validation = FeedbackSchema.safeParse(feedback);
        if (!validation.success) {
          return NextResponse.json(
            { success: false, error: "AI returned malformed response" },
            { status: 500 },
          );
        }

        const resume = await prisma.resume.create({
          data: {
            userId,
            jobTitle,
            jobDescription,
            companyName: companyName || null,
            resumeMarkdown: markdown,
            feedback: validation.data,
            previewImage,
          },
        });

        return NextResponse.json({
          success: true,
          resumeId: resume.id,
          feedback: validation.data,
        });
      } catch (error) {
        return handleAPIError(error, {
          externalServiceMessage:
            "PDF service unavailable. Please try again later.",
          defaultMessage: "Failed to analyze resume",
        });
      }
    },
  );
}
