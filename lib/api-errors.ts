import { NextResponse } from "next/server";

interface APIErrorOptions {
  timeoutMessage?: string;
  externalServiceMessage?: string;
  externalServiceStatus?: number;
  defaultMessage?: string;
}

export function handleAPIError(
  error: unknown,
  {
    timeoutMessage = "Request timed out. Please try again.",
    externalServiceMessage = "External service unavailable. Please try again later.",
    externalServiceStatus = 502,
    defaultMessage = "Failed to complete request",
  }: APIErrorOptions = {},
): NextResponse {
  if (error instanceof Error) {
    if (error.message.includes("timeout")) {
      return NextResponse.json(
        {
          success: false,
          error: timeoutMessage,
        },
        { status: 504 },
      );
    }

    if (error.message.includes("fetch") || error.message.includes("PDF")) {
      return NextResponse.json(
        {
          success: false,
          error: externalServiceMessage,
        },
        { status: externalServiceStatus },
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || defaultMessage },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { success: false, error: defaultMessage },
    { status: 500 },
  );
}
