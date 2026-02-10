import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { handleAPIError } from "@/lib/api-errors";
import { CoverLetterContentSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    return await withAuth(async ({ userId }) => {
      const body = await request.json();
      const { content: partialContent, updatedAt } = body;

      if (!partialContent || !updatedAt) {
        return NextResponse.json(
          { success: false, error: "Missing content or updatedAt" },
          { status: 400 },
        );
      }

      const existing = await prisma.coverLetter.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return NextResponse.json(
          { success: false, error: "Cover letter not found" },
          { status: 404 },
        );
      }

      if (existing.updatedAt.toISOString() !== updatedAt) {
        return NextResponse.json(
          { success: false, error: "Content was modified elsewhere" },
          { status: 409 },
        );
      }

      const existingContentValidation = CoverLetterContentSchema.safeParse(
        existing.content,
      );
      if (!existingContentValidation.success) {
        return NextResponse.json(
          { success: false, error: "Stored content is invalid" },
          { status: 500 },
        );
      }

      const merged = {
        ...existingContentValidation.data,
        ...partialContent,
        header: {
          ...existingContentValidation.data.header,
          ...(partialContent.header || {}),
        },
      };

      const validation = CoverLetterContentSchema.safeParse(merged);
      if (!validation.success) {
        return NextResponse.json(
          { success: false, error: "Invalid content" },
          { status: 400 },
        );
      }

      const updated = await prisma.coverLetter.update({
        where: { id },
        data: { content: validation.data },
      });

      return NextResponse.json({
        success: true,
        updatedAt: updated.updatedAt.toISOString(),
      });
    });
  } catch (error) {
    return handleAPIError(error, {
      defaultMessage: "Failed to update cover letter",
    });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    return await withAuth(async ({ userId }) => {
      const existing = await prisma.coverLetter.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return NextResponse.json(
          { success: false, error: "Cover letter not found" },
          { status: 404 },
        );
      }

      await prisma.coverLetter.delete({ where: { id } });

      return NextResponse.json({ success: true });
    });
  } catch (error) {
    return handleAPIError(error, {
      defaultMessage: "Failed to delete cover letter",
    });
  }
}
