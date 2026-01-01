import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { handleAPIError } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    return await withAuth(async ({ userId }) => {
      const { id } = await params;

      const resume = await prisma.resume.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!resume || resume.userId !== userId) {
        return NextResponse.json(
          { success: false, error: "Resume not found" },
          { status: 404 },
        );
      }

      await prisma.resume.delete({ where: { id } });

      return NextResponse.json({ success: true });
    });
  } catch (error) {
    return handleAPIError(error, {
      defaultMessage: "Failed to delete resume",
    });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    return await withAuth(async ({ userId }) => {
      const { id } = await params;
      const { latexContent } = await request.json();

      const resume = await prisma.resume.findFirst({
        where: { id, userId },
      });

      if (!resume) {
        return NextResponse.json(
          { success: false, error: "Resume not found" },
          { status: 404 },
        );
      }

      await prisma.resume.update({
        where: { id },
        data: { latexContent },
      });

      return NextResponse.json({ success: true });
    });
  } catch (error) {
    return handleAPIError(error, {
      defaultMessage: "Failed to save resume",
    });
  }
}
