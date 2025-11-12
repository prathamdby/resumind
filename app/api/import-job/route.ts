import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-server";
import { checkRateLimit } from "@/lib/rate-limit";
import { cerebras, AI_CONFIG } from "@/lib/ai";
import { JobDataSchema } from "@/lib/schemas";

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

async function extractJobData(content: string): Promise<{
  companyName: string;
  jobTitle: string;
  jobDescription: string;
}> {
  const systemPrompt = `You are a job posting analyzer. Extract structured data from the provided text and return valid JSON with exactly these fields:
- companyName: string (company name, required)
- jobTitle: string (job title/position, required)
- jobDescription: string (full job description, minimum 50 characters, required)

Return only valid JSON, no markdown formatting, no code blocks.`;

  const userPrompt = `Extract the job posting details from the following text:\n\n${content}`;

  const aiPromise = cerebras.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    ...AI_CONFIG,
  });

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("AI request timeout")), 30000),
  );

  const completion = await Promise.race([aiPromise, timeoutPromise]);
  const contentText = (
    completion as { choices?: Array<{ message?: { content?: string } }> }
  ).choices?.[0]?.message?.content;

  if (!contentText || typeof contentText !== "string") {
    throw new Error("No response from AI");
  }

  let parsed: unknown;
  try {
    const cleaned = contentText
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Invalid JSON response from AI");
  }

  const validation = JobDataSchema.safeParse(parsed);
  if (!validation.success) {
    throw new Error("AI response validation failed");
  }

  return validation.data;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const rateLimitResult = await checkRateLimit(
      request,
      session.user.id,
      "/api/import-job",
    );

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
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        return NextResponse.json(
          { success: false, error: "Request timed out. Please try again." },
          { status: 504 },
        );
      }

      if (error.message.includes("fetch")) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to fetch job posting. Please check the URL.",
          },
          { status: 502 },
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to process job posting" },
      { status: 500 },
    );
  }
}
