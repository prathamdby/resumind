import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-server";
import { checkRateLimit } from "@/lib/rate-limit";
import { cerebras, getAIConfig } from "@/lib/ai";
import { FeedbackSchema } from "@/lib/schemas";
import { getAISystemPrompt, prepareInstructions } from "@/constants";
import { prisma } from "@/lib/prisma";
import { writeFile, unlink, readFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import type { Feedback } from "@/types";
import type { ReasoningLevel } from "@/app/components/ReasoningToggle";

const MAX_MARKDOWN_LENGTH = 15000;
const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || "http://localhost:8000";

async function convertPdfToMarkdown(
  filePath: string,
): Promise<{ markdown: string; previewImage: string | null }> {
  const fileBuffer = await readFile(filePath);

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

  const aiPromise = cerebras.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    ...getAIConfig(reasoningLevel),
  });

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("AI timeout")), 25000),
  );

  const completion = await Promise.race([aiPromise, timeoutPromise]);
  const contentText = (
    completion as { choices?: Array<{ message?: { content?: string } }> }
  ).choices?.[0]?.message?.content;

  if (!contentText || typeof contentText !== "string") {
    throw new Error("No AI response");
  }

  return JSON.parse(contentText);
}

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const rateLimitResult = await checkRateLimit(
      request,
      session.user.id,
      "/api/analyze",
    );

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfter || 60),
          },
        },
      );
    }

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

    try {
      await fetch(`${PDF_SERVICE_URL}/health`, {
        signal: AbortSignal.timeout(2000),
      });
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "PDF service unavailable. Please try again later.",
        },
        { status: 502 },
      );
    }

    tempFilePath = join(
      tmpdir(),
      `resume-${session.user.id}-${Date.now()}.pdf`,
    );
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      await writeFile(tempFilePath, buffer);

      const { markdown, previewImage } =
        await convertPdfToMarkdown(tempFilePath);
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
          userId: session.user.id,
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
    } finally {
      if (tempFilePath) {
        await unlink(tempFilePath).catch(() => {});
      }
    }
  } catch (error) {
    if (tempFilePath) {
      await unlink(tempFilePath).catch(() => {});
    }

    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        return NextResponse.json(
          {
            success: false,
            error: "Request timed out. Please try again.",
          },
          { status: 504 },
        );
      }

      if (error.message.includes("fetch") || error.message.includes("PDF")) {
        return NextResponse.json(
          {
            success: false,
            error: "PDF service unavailable. Please try again later.",
          },
          { status: 502 },
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to analyze resume" },
      { status: 500 },
    );
  }
}
