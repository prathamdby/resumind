import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api-middleware";
import { handleAPIError } from "@/lib/api-errors";
import { makeAIRequest } from "@/lib/ai-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { FeedbackSchema } from "@/lib/schemas";

const RegenerateColdDMSchema = z.object({
  resumeId: z.string(),
  userFeedback: z.string().trim().min(10).max(500),
});

async function regenerateColdDM(
  resumeMarkdown: string,
  jobTitle: string,
  jobDescription: string,
  currentColdDM: string,
  userFeedback: string,
  companyName?: string,
): Promise<string> {
  const systemPrompt = `You are an expert resume coach specializing in crafting personalized cold outreach messages. Your task is to regenerate a LinkedIn cold DM based on user feedback.`;

  const userPrompt = `I need you to regenerate a cold outreach message based on specific user feedback.

Job Title: ${jobTitle}
Job Description: ${jobDescription}
${companyName ? `Company: ${companyName}` : ""}

Resume (markdown format):
${resumeMarkdown}

Current Cold DM:
${currentColdDM}

User Feedback:
${userFeedback}

COLD OUTREACH GUIDELINES:
- Write from the job seeker's perspective (first person) to the hiring team
- Professional LinkedIn DM style, under 100 words, 2-3 short paragraphs
- MUST start with natural greeting ("Hi," or "Hey," or "Hello,")
- Structure: greeting → hook → 2-3 resume strengths that match the job → brief CTA
- Use ONLY information from the resume - do not invent skills or experience
- ${companyName ? `Mention "${companyName}" naturally once` : "Omit company references"}
- CTA: suggest a brief chat this week (10-15 minutes)
- Avoid: "I am confident that", "I look forward to", placeholder names
- Role-agnostic addressing (works for HR, founder, or CEO)
- Avoid corporate jargon and AI phrases like "I am writing to express" or "I would love the opportunity"

Apply the user's feedback to improve the message. Return ONLY the regenerated cold DM text, no JSON formatting, no markdown code blocks, no explanatory text.`;

  const content = await makeAIRequest<string>({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    reasoningLevel: "low",
    responseFormat: { type: "text" },
  });

  return content.trim();
}

export async function POST(request: NextRequest) {
  try {
    return await withAuthAndRateLimit(
      request,
      "/api/regenerate-cold-dm",
      async ({ userId }) => {
        const body = await request.json();
        const validation = RegenerateColdDMSchema.safeParse(body);

        if (!validation.success) {
          return NextResponse.json(
            { success: false, error: "Invalid request data" },
            { status: 400 },
          );
        }

        const { resumeId, userFeedback } = validation.data;

        const resume = await prisma.resume.findUnique({
          where: { id: resumeId },
          select: {
            id: true,
            userId: true,
            jobTitle: true,
            companyName: true,
            jobDescription: true,
            resumeMarkdown: true,
            feedback: true,
          },
        });

        if (!resume || resume.userId !== userId) {
          return NextResponse.json(
            { success: false, error: "Resume not found" },
            { status: 404 },
          );
        }

        if (!resume.resumeMarkdown) {
          return NextResponse.json(
            {
              success: false,
              error: "Resume markdown not available for regeneration",
            },
            { status: 400 },
          );
        }

        const feedbackResult = FeedbackSchema.safeParse(resume.feedback);
        if (!feedbackResult.success) {
          return NextResponse.json(
            { success: false, error: "Stored feedback is invalid" },
            { status: 500 },
          );
        }
        const feedback = feedbackResult.data;

        if (!feedback.coldOutreachMessage) {
          return NextResponse.json(
            { success: false, error: "No cold DM exists to regenerate" },
            { status: 400 },
          );
        }

        const newColdDM = await regenerateColdDM(
          resume.resumeMarkdown,
          resume.jobTitle,
          resume.jobDescription,
          feedback.coldOutreachMessage,
          userFeedback,
          resume.companyName || undefined,
        );

        const updatedFeedback = {
          ...feedback,
          coldOutreachMessage: newColdDM,
        };

        await prisma.resume.update({
          where: { id: resumeId },
          data: {
            feedback: updatedFeedback,
          },
        });

        return NextResponse.json({
          success: true,
          coldOutreachMessage: newColdDM,
        });
      },
    );
  } catch (error) {
    return handleAPIError(error, {
      defaultMessage: "Failed to regenerate cold DM",
    });
  }
}
