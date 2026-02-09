import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { handleAPIError } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    return await withAuth(async ({ userId }) => {
      await prisma.$transaction([
        prisma.coverLetter.deleteMany({
          where: { userId },
        }),
        prisma.resume.deleteMany({
          where: { userId },
        }),
        prisma.rateLimit.deleteMany({
          where: {
            OR: [
              { key: { startsWith: `/api/import-job:${userId}` } },
              { key: { startsWith: `/api/analyze:${userId}` } },
            ],
          },
        }),
      ]);

      return NextResponse.json({ success: true });
    });
  } catch (error) {
    return handleAPIError(error, {
      defaultMessage: "Failed to delete data",
    });
  }
}
