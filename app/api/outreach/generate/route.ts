import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api-middleware";
import { handleAPIError } from "@/lib/api-errors";
import { makeAIRequest } from "@/lib/ai-helpers";
import {
  OutreachGenerateSchema,
  OutreachEmailResponseSchema,
} from "@/lib/schemas";
import {
  OUTREACH_CHANNELS,
  OUTREACH_TONES,
  getOutreachSystemPrompt,
  prepareOutreachInstructions,
} from "@/constants/outreach";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { OutreachGenerationContext } from "@/types";

export async function POST(request: NextRequest) {
  return await withAuthAndRateLimit(
    request,
    "/api/outreach/generate",
    async ({ userId }) => {
      try {
        const body = await request.json();
        const validation = OutreachGenerateSchema.safeParse(body);

        if (!validation.success) {
          return NextResponse.json(
            { success: false, error: "Invalid request data" },
            { status: 400 },
          );
        }

        const {
          channel,
          tone,
          jobTitle,
          companyName,
          recipientName,
          jobDescription,
          resumeId,
          additionalContext,
        } = validation.data;

        const channelConfig = OUTREACH_CHANNELS.find((c) => c.id === channel);
        const toneConfig = OUTREACH_TONES.find((t) => t.id === tone);

        if (!channelConfig || !toneConfig) {
          return NextResponse.json(
            { success: false, error: "Invalid channel or tone" },
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

        const systemPrompt = getOutreachSystemPrompt();
        const userPrompt = prepareOutreachInstructions({
          channel: channelConfig,
          tone: toneConfig,
          jobTitle,
          companyName: companyName || undefined,
          recipientName: recipientName || undefined,
          jobDescription: jobDescription || undefined,
          resumeMarkdown,
          additionalContext: additionalContext || undefined,
        });

        const isEmail = channel === "cold-email";
        let content: string;
        let subject: string | undefined;

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

          subject = emailValidation.data.subject;
          content = emailValidation.data.body;
        } else {
          content = await makeAIRequest<string>({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            reasoningLevel: "low",
            responseFormat: { type: "text" },
          });

          content = content.trim();

          if (content.length < 20 || content.length > 2000) {
            return NextResponse.json(
              { success: false, error: "AI response out of expected range" },
              { status: 500 },
            );
          }
        }

        const generationContext: OutreachGenerationContext = {
          channel,
          tone,
          jobDescription: jobDescription || undefined,
          additionalContext: additionalContext || undefined,
          resumeMarkdown,
        };

        const outreach = await prisma.outreach.create({
          data: {
            userId,
            channel,
            tone,
            jobTitle,
            companyName: companyName || null,
            recipientName: recipientName || null,
            subject: subject || null,
            content,
            context: generationContext as unknown as Prisma.InputJsonValue,
            resumeId: resumeId || null,
          },
        });

        return NextResponse.json({ success: true, id: outreach.id });
      } catch (error) {
        return handleAPIError(error, {
          defaultMessage: "Failed to generate outreach message",
        });
      }
    },
  );
}
