import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-server";
import { checkRateLimit } from "@/lib/rate-limit";
import { extractJobData } from "@/lib/job-import";
import { parsePDF } from "@/lib/pdf-parser";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const MAX_CONTENT_LENGTH = 15000;

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
      "/api/import-job",
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

    if (!file) {
      return NextResponse.json(
        { success: false, error: "PDF file is required" },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Only PDF files are supported" },
        { status: 400 },
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File size must be under 10 MB" },
        { status: 400 },
      );
    }

    tempFilePath = join(
      tmpdir(),
      `job-description-${session.user.id}-${Date.now()}.pdf`,
    );
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      await writeFile(tempFilePath, buffer);

      const markdown = await parsePDF(tempFilePath);
      const truncatedMarkdown = markdown.slice(0, MAX_CONTENT_LENGTH);

      if (truncatedMarkdown.length < 50) {
        return NextResponse.json(
          {
            success: false,
            error:
              "PDF contains too little text. Please use a more detailed job description.",
          },
          { status: 400 },
        );
      }

      const jobData = await extractJobData(truncatedMarkdown);

      return NextResponse.json({
        success: true,
        data: jobData,
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

      if (error.message.includes("parsing")) {
        return NextResponse.json(
          {
            success: false,
            error: "PDF parsing service unavailable. Please try again later.",
          },
          { status: 502 },
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to process job description PDF" },
      { status: 500 },
    );
  }
}
