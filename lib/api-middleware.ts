import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-server";
import { checkRateLimit } from "@/lib/rate-limit";

export interface AuthContext {
  userId: string;
}

export async function withAuth(
  handler: (context: AuthContext) => Promise<NextResponse>,
): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  return handler({ userId: session.user.id });
}

export async function withRateLimit(
  request: NextRequest,
  userId: string,
  route: string,
  handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
  const rateLimitResult = await checkRateLimit(request, userId, route);

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

  return handler();
}

export async function withAuthAndRateLimit(
  request: NextRequest,
  route: string,
  handler: (context: AuthContext) => Promise<NextResponse>,
): Promise<NextResponse> {
  return withAuth(async (context) => {
    return withRateLimit(request, context.userId, route, () =>
      handler(context),
    );
  });
}
