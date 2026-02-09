import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api-middleware";
import { handleAPIError } from "@/lib/api-errors";
import { makeAIRequest } from "@/lib/ai-helpers";
import { CoverLetterContentSchema } from "@/lib/schemas";
import { getTemplateById } from "@/constants/cover-letter-templates";
import { prisma } from "@/lib/prisma";
import type { CoverLetterContent } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return await withAuthAndRateLimit(
    request,
    "/api/cover-letter/regenerate",
    async ({ userId }) => {
      try {
        const body = await request.json();
        const { section, feedback } = body;

        if (!section || !["opening", "body", "closing"].includes(section)) {
          return NextResponse.json(
            { success: false, error: "Invalid section" },
            { status: 400 },
          );
        }

        const coverLetter = await prisma.coverLetter.findFirst({
          where: { id, userId },
        });

        if (!coverLetter) {
          return NextResponse.json(
            { success: false, error: "Cover letter not found" },
            { status: 404 },
          );
        }

        const content = coverLetter.content as unknown as CoverLetterContent;
        const template = getTemplateById(coverLetter.templateId);
        const toneLine = template
          ? `Tone: ${template.tone}`
          : "Tone: Professional and direct.";

        let currentText: string;
        if (section === "body") {
          currentText = content.bodyParagraphs.join("\n\n");
        } else if (section === "opening") {
          currentText = content.opening;
        } else {
          currentText = content.closing;
        }

        const sectionLabel =
          section === "body" ? "body paragraphs" : section;

        const prompt = `Rewrite the ${sectionLabel} of this cover letter.

Current version:
${currentText}

Context:
- Job Title: ${coverLetter.jobTitle}
${coverLetter.companyName ? `- Company: ${coverLetter.companyName}` : ""}
- ${toneLine}
${feedback ? `\nUser feedback: ${feedback}` : ""}

Rules:
- Return ONLY the rewritten text, no JSON, no markdown formatting
- Keep the same approximate length unless the user asked for shorter/longer
- Maintain the established tone
${section === "body" ? "- Separate paragraphs with a double newline (\\n\\n)" : ""}
- Do not include greetings or signatures -- just the ${sectionLabel} content`;

        const rewritten = await makeAIRequest<string>({
          messages: [
            {
              role: "system",
              content:
                "You rewrite cover letter sections. Return ONLY the rewritten text. No JSON. No markdown. No explanations.",
            },
            { role: "user", content: prompt },
          ],
          responseFormat: { type: "text" },
        });

        const updatedContent = { ...content };

        if (section === "body") {
          updatedContent.bodyParagraphs = rewritten
            .split(/\n\n+/)
            .map((p) => p.trim())
            .filter(Boolean);
        } else if (section === "opening") {
          updatedContent.opening = rewritten.trim();
        } else {
          updatedContent.closing = rewritten.trim();
        }

        const validation = CoverLetterContentSchema.safeParse(updatedContent);
        if (!validation.success) {
          return NextResponse.json(
            { success: false, error: "Regenerated content failed validation" },
            { status: 500 },
          );
        }

        await prisma.coverLetter.update({
          where: { id },
          data: { content: validation.data },
        });

        return NextResponse.json({
          success: true,
          content: validation.data,
        });
      } catch (error) {
        return handleAPIError(error, {
          defaultMessage: "Failed to regenerate section",
        });
      }
    },
  );
}
