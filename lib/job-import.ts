import { cerebras, AI_CONFIG } from "@/lib/ai";
import { JobDataSchema } from "@/lib/schemas";

const AI_TIMEOUT_MS = 30000;

export async function extractJobData(content: string): Promise<{
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
    setTimeout(() => reject(new Error("AI request timeout")), AI_TIMEOUT_MS),
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
