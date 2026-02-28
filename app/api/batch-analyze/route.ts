import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api-middleware";
import { FeedbackSchema, BatchAnalyzeInputSchema } from "@/lib/schemas";
import {
  convertPdfToMarkdown,
  analyzeResumeWithAI,
  MAX_MARKDOWN_LENGTH,
} from "@/lib/resume-analysis";
import { prisma } from "@/lib/prisma";
import type { BatchJobEntry } from "@/types";

export const maxDuration = 300;

const CONCURRENCY = 3;

class Semaphore {
  private permits: number;
  private waiters: (() => void)[] = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return;
    }
    return new Promise<void>((resolve) => {
      this.waiters.push(resolve);
    });
  }

  release(): void {
    const waiter = this.waiters.shift();
    if (waiter) {
      waiter();
    } else {
      this.permits++;
    }
  }
}

export async function POST(request: NextRequest) {
  return await withAuthAndRateLimit(
    request,
    "/api/batch-analyze",
    async ({ userId }) => {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const jobsRaw = formData.get("jobs") as string | null;

      if (!file || !jobsRaw) {
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

      let jobs: BatchJobEntry[];
      try {
        const parsed = JSON.parse(jobsRaw);
        const validation = BatchAnalyzeInputSchema.safeParse({ jobs: parsed });
        if (!validation.success) {
          return NextResponse.json(
            {
              success: false,
              error: validation.error.issues[0]?.message || "Invalid job data",
            },
            { status: 400 },
          );
        }
        jobs = validation.data.jobs;
      } catch {
        return NextResponse.json(
          { success: false, error: "Invalid jobs format" },
          { status: 400 },
        );
      }

      let markdown: string;
      let previewImage: string | null;
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await convertPdfToMarkdown(buffer);
        markdown = result.markdown;
        previewImage = result.previewImage;
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: "PDF service unavailable. Please try again later.",
          },
          { status: 502 },
        );
      }

      if (markdown.length >= MAX_MARKDOWN_LENGTH) {
        return NextResponse.json(
          {
            success: false,
            error: "Resume too detailed. Please use a simpler format.",
          },
          { status: 400 },
        );
      }

      const batch = await prisma.batchAnalysis.create({
        data: {
          userId,
          totalJobs: jobs.length,
          status: "processing",
        },
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          function send(data: Record<string, unknown>) {
            controller.enqueue(
              encoder.encode(JSON.stringify(data) + "\n"),
            );
          }

          send({
            type: "init",
            batchId: batch.id,
            totalJobs: jobs.length,
          });

          let completed = 0;
          let failed = 0;
          const sem = new Semaphore(CONCURRENCY);

          const promises = jobs.map(async (job, index) => {
            await sem.acquire();
            try {
              const feedback = await analyzeResumeWithAI(
                markdown,
                job.jobTitle,
                job.jobDescription,
                "low",
                job.companyName,
              );

              const validation = FeedbackSchema.safeParse(feedback);
              if (!validation.success) {
                throw new Error("AI returned malformed response");
              }

              const resume = await prisma.resume.create({
                data: {
                  userId,
                  batchId: batch.id,
                  jobTitle: job.jobTitle,
                  jobDescription: job.jobDescription,
                  companyName: job.companyName || null,
                  resumeMarkdown: markdown,
                  feedback: validation.data,
                  previewImage,
                },
              });

              completed++;
              send({
                type: "progress",
                jobIndex: index,
                status: "success",
                resumeId: resume.id,
                jobTitle: job.jobTitle,
                companyName: job.companyName,
                overallScore: validation.data.overallScore,
              });
            } catch (error) {
              failed++;
              send({
                type: "progress",
                jobIndex: index,
                status: "error",
                jobTitle: job.jobTitle,
                companyName: job.companyName,
                error:
                  error instanceof Error
                    ? error.message
                    : "Analysis failed",
              });
            } finally {
              sem.release();
            }
          });

          await Promise.all(promises);

          const finalStatus =
            failed === jobs.length
              ? "failed"
              : failed > 0
                ? "partial"
                : "completed";

          await prisma.batchAnalysis.update({
            where: { id: batch.id },
            data: {
              completedJobs: completed,
              failedJobs: failed,
              status: finalStatus,
            },
          });

          send({
            type: "complete",
            batchId: batch.id,
            completed,
            failed,
            status: finalStatus,
          });

          controller.close();
        },
      });

      return new NextResponse(stream, {
        headers: {
          "Content-Type": "application/x-ndjson",
          "Transfer-Encoding": "chunked",
          "Cache-Control": "no-cache",
        },
      });
    },
  );
}
