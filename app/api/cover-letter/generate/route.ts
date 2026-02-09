import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api-middleware";
import { handleAPIError } from "@/lib/api-errors";
import { makeAIRequest } from "@/lib/ai-helpers";
import { CoverLetterAISchema, CoverLetterContentSchema } from "@/lib/schemas";
import {
  getCoverLetterSystemPrompt,
  prepareCoverLetterInstructions,
} from "@/constants";
import { getTemplateById } from "@/constants/cover-letter-templates";
import { prisma } from "@/lib/prisma";
import type { CoverLetterAIResponse, CoverLetterContent } from "@/types";

export async function POST(request: NextRequest) {
  return await withAuthAndRateLimit(
    request,
    "/api/cover-letter/generate",
    async ({ userId }) => {
      try {
        const body = await request.json();
        const { templateId, jobTitle, companyName, jobDescription, resumeId, header } = body;

        if (!templateId || !jobTitle || !header) {
          return NextResponse.json(
            { success: false, error: "Missing required fields" },
            { status: 400 },
          );
        }

        const template = getTemplateById(templateId);
        if (!template) {
          return NextResponse.json(
            { success: false, error: "Unknown template" },
            { status: 400 },
          );
        }

        let resumeMarkdown: string | undefined;
        if (resumeId) {
          const resume = await prisma.resume.findFirst({
            where: { id: resumeId, userId },
            select: { resumeMarkdown: true },
          });
          if (resume?.resumeMarkdown) {
            resumeMarkdown = resume.resumeMarkdown;
          }
        }

        const systemPrompt = getCoverLetterSystemPrompt();
        const userPrompt = prepareCoverLetterInstructions({
          jobTitle,
          companyName: companyName || undefined,
          jobDescription: jobDescription || undefined,
          templateTone: template.tone,
          resumeMarkdown,
        });

        const aiResponse = await makeAIRequest<CoverLetterAIResponse>({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        });

        const aiValidation = CoverLetterAISchema.safeParse(aiResponse);
        if (!aiValidation.success) {
          return NextResponse.json(
            { success: false, error: "AI returned malformed response" },
            { status: 500 },
          );
        }

        const today = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const fullContent: CoverLetterContent = {
          header,
          date: today,
          ...aiValidation.data,
        };

        const contentValidation = CoverLetterContentSchema.safeParse(fullContent);
        if (!contentValidation.success) {
          return NextResponse.json(
            { success: false, error: "Generated content failed validation" },
            { status: 500 },
          );
        }

        const coverLetter = await prisma.coverLetter.create({
          data: {
            userId,
            templateId,
            jobTitle,
            companyName: companyName || null,
            jobDescription: jobDescription || null,
            content: contentValidation.data,
            resumeId: resumeId || null,
          },
        });

        return NextResponse.json({
          success: true,
          id: coverLetter.id,
          content: contentValidation.data,
        });
      } catch (error) {
        return handleAPIError(error, {
          defaultMessage: "Failed to generate cover letter",
        });
      }
    },
  );
}
