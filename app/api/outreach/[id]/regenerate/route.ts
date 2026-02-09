import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api-middleware";
import { handleAPIError } from "@/lib/api-errors";
import { makeAIRequest } from "@/lib/ai-helpers";
import {
  OutreachRegenerateSchema,
  OutreachEmailResponseSchema,
} from "@/lib/schemas";
import {
  OUTREACH_CHANNELS,
  OUTREACH_TONES,
  getOutreachSystemPrompt,
  prepareOutreachRegenerationInstructions,
} from "@/constants/outreach";
import { prisma } from "@/lib/prisma";
import type { OutreachGenerationContext } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    return await withAuthAndRateLimit(
      request,
      "/api/outreach/regenerate",
      async ({ userId }) => {
        const { id } = await params;
        const body = await request.json();
        const validation = OutreachRegenerateSchema.safeParse(body);

        if (!validation.success) {
          return NextResponse.json(
            { success: false, error: "Feedback must be 10-500 characters" },
            { status: 400 },
          );
        }

        const { userFeedback } = validation.data;

        const outreach = await prisma.outreach.findFirst({
          where: { id, userId },
        });

        if (!outreach) {
          return NextResponse.json(
            { success: false, error: "Outreach message not found" },
            { status: 404 },
          );
        }

        const context =
          (outreach.context as unknown as OutreachGenerationContext) || {};
        const channelConfig = OUTREACH_CHANNELS.find(
          (c) => c.id === outreach.channel,
        );
        const toneConfig = OUTREACH_TONES.find((t) => t.id === outreach.tone);

        if (!channelConfig || !toneConfig) {
          return NextResponse.json(
            { success: false, error: "Invalid channel or tone configuration" },
            { status: 500 },
          );
        }

        const systemPrompt = getOutreachSystemPrompt();
        const userPrompt = prepareOutreachRegenerationInstructions({
          channel: channelConfig,
          tone: toneConfig,
          currentContent: outreach.content,
          currentSubject: outreach.subject || undefined,
          userFeedback,
          jobTitle: outreach.jobTitle,
          companyName: outreach.companyName || undefined,
          recipientName: outreach.recipientName || undefined,
          jobDescription: context.jobDescription,
          resumeMarkdown: context.resumeMarkdown,
        });

        const isEmail = outreach.channel === "cold-email";
        let newContent: string;
        let newSubject: string | undefined;

        if (isEmail) {
          const aiResponse = await makeAIRequest<{
            subject: string;
            body: string;
          }>({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            reasoningLevel: "low",
            responseFormat: { type: "json_object" },
          });

          const emailValidation =
            OutreachEmailResponseSchema.safeParse(aiResponse);
          if (!emailValidation.success) {
            return NextResponse.json(
              { success: false, error: "AI returned malformed response" },
              { status: 500 },
            );
          }

          newSubject = emailValidation.data.subject;
          newContent = emailValidation.data.body;
        } else {
          newContent = await makeAIRequest<string>({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            reasoningLevel: "low",
            responseFormat: { type: "text" },
          });

          newContent = newContent.trim();

          if (newContent.length < 20 || newContent.length > 2000) {
            return NextResponse.json(
              { success: false, error: "AI response out of expected range" },
              { status: 500 },
            );
          }
        }

        await prisma.outreach.update({
          where: { id },
          data: {
            content: newContent,
            subject: newSubject || outreach.subject,
          },
        });

        return NextResponse.json({
          success: true,
          content: newContent,
          subject: newSubject,
        });
      },
    );
  } catch (error) {
    return handleAPIError(error, {
      defaultMessage: "Failed to regenerate outreach message",
    });
  }
}
