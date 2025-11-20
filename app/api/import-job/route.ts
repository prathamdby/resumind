import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api-middleware";
import { handleAPIError } from "@/lib/api-errors";
import { extractJobData } from "@/lib/job-import";

const MAX_CONTENT_LENGTH = 15000;

function validateUrl(url: string): { valid: boolean; error?: string } {
  try {
    const urlObj = new URL(url);

    if (urlObj.protocol !== "https:") {
      return { valid: false, error: "Only HTTPS URLs are supported" };
    }

    const hostname = urlObj.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.16.")
    ) {
      return { valid: false, error: "Invalid URL" };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }
}

async function fetchPageContent(url: string): Promise<string> {
  const jinaUrl = `https://r.jina.ai/${url}`;

  const response = await fetch(jinaUrl, {
    headers: {
      "User-Agent": "ResumindJobFetcher/1.0",
      Accept: "text/plain",
    },
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch content: ${response.status}`);
  }

  const content = await response.text();
  if (!content || content.trim().length === 0) {
    throw new Error("No content found at the provided URL");
  }

  return content.slice(0, MAX_CONTENT_LENGTH);
}

export async function POST(request: NextRequest) {
  try {
    return await withAuthAndRateLimit(request, "/api/import-job", async () => {
      const body = await request.json();
      const { url } = body;

      if (!url || typeof url !== "string") {
        return NextResponse.json(
          { success: false, error: "URL is required" },
          { status: 400 },
        );
      }

      const urlValidation = validateUrl(url);
      if (!urlValidation.valid) {
        return NextResponse.json(
          { success: false, error: urlValidation.error || "Invalid URL" },
          { status: 400 },
        );
      }

      const pageContent = await fetchPageContent(url);
      const jobData = await extractJobData(pageContent);

      return NextResponse.json({
        success: true,
        data: jobData,
      });
    });
  } catch (error) {
    return handleAPIError(error, {
      timeoutMessage: "Request timed out. Please try again.",
      externalServiceMessage:
        "Failed to fetch job posting. Please check the URL.",
      defaultMessage: "Failed to process job posting",
    });
  }
}
