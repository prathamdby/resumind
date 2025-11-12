import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    const resume = await prisma.resume.findUnique({
      where: { id },
      select: {
        userId: true,
        previewImage: true,
      },
    });

    if (!resume || resume.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Resume not found" },
        { status: 404 },
      );
    }

    if (!resume.previewImage) {
      return NextResponse.json(
        { success: false, error: "Preview not available" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        previewImage: resume.previewImage,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=86400",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch preview" },
      { status: 500 },
    );
  }
}
