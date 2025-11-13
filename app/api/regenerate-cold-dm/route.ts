import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-server";
import { checkRateLimit } from "@/lib/rate-limit";
import { cerebras, getAIConfig } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import type { Feedback } from "@/types";

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

  const aiPromise = cerebras.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    ...getAIConfig("low"),
    response_format: { type: "text" },
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

  return contentText.trim();
}

export async function POST(request: NextRequest) {
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
      "/api/regenerate-cold-dm",
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

    if (!resume || resume.userId !== session.user.id) {
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

    const feedback = resume.feedback as unknown as Feedback;

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

    const updatedFeedback: Feedback = {
      ...feedback,
      coldOutreachMessage: newColdDM,
    };

    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        feedback: updatedFeedback as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      success: true,
      coldOutreachMessage: newColdDM,
    });
  } catch (error) {
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
    }

    return NextResponse.json(
      { success: false, error: "Failed to regenerate cold DM" },
      { status: 500 },
    );
  }
}
