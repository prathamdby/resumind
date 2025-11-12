import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await prisma.$transaction([
      prisma.resume.deleteMany({
        where: { userId: session.user.id },
      }),
      prisma.rateLimit.deleteMany({
        where: {
          OR: [
            { key: { startsWith: `/api/import-job:${session.user.id}` } },
            { key: { startsWith: `/api/analyze:${session.user.id}` } },
          ],
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete data" },
      { status: 500 },
    );
  }
}
