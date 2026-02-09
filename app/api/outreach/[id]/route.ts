import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { handleAPIError } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    return await withAuth(async ({ userId }) => {
      const { id } = await params;

      const outreach = await prisma.outreach.findFirst({
        where: { id, userId },
        select: { id: true },
      });

      if (!outreach) {
        return NextResponse.json(
          { success: false, error: "Outreach message not found" },
          { status: 404 },
        );
      }

      await prisma.outreach.delete({ where: { id } });

      return NextResponse.json({ success: true });
    });
  } catch (error) {
    return handleAPIError(error, {
      defaultMessage: "Failed to delete outreach message",
    });
  }
}
