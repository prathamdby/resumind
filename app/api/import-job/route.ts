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
  const systemPrompt = `You are an expert job posting analyzer. Your task is to accurately extract structured information from job postings.

Your approach should follow this step-by-step process:
1. First, identify and locate the job title/position name
2. Then, identify the company name (may appear in headers, footers, or body text)
3. Finally, extract the complete job description (including responsibilities, requirements, qualifications, and benefits)

Extraction guidelines:
- companyName: Extract the exact company name. If multiple names appear, use the primary employer name. If unclear, use the most prominent company reference.
- jobTitle: Extract the exact job title/position name. This is typically in headers or prominent text near the beginning.
- jobDescription: Extract the FULL job description including all sections: overview, responsibilities, requirements, qualifications, benefits, and any other relevant details. Preserve formatting where meaningful (use line breaks for readability).

Return ONLY valid JSON matching this exact structure:
{
  "companyName": "string",
  "jobTitle": "string",
  "jobDescription": "string"
}

Critical: Return only valid JSON, no markdown formatting, no code blocks, no explanatory text.`;

  const userPrompt = `Let's think step by step to extract the job posting details accurately.

First, analyze the text structure:
- Where is the job title located?
- Where is the company name mentioned?
- What sections make up the job description?

Then extract the information following this plan:
1. Identify the job title from headers or prominent text
2. Identify the company name from context clues
3. Extract the complete job description including all relevant sections

Job posting text:
${content}

Now extract and return the structured JSON data.`;

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
