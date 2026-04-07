import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api-middleware";
import { handleAPIError } from "@/lib/api-errors";
import { makeAIRequest } from "@/lib/ai-helpers";
import { LatexImproveRequestSchema, LatexImproveResponseSchema } from "@/lib/schemas";
import {
  LATEX_IMPROVE_SYSTEM_PROMPT,
  prepareLatexImprovePrompt,
} from "@/constants/latex";

interface LatexImproveAIResponse {
  improvedLatex: string;
  changesApplied: number;
  sectionsModified: string[];
}

export async function POST(request: NextRequest) {
  return await withAuthAndRateLimit(
    request,
    "/api/latex/improve",
    async () => {
      const body = await request.json();
      const parseResult = LatexImproveRequestSchema.safeParse(body);

      if (!parseResult.success) {
        return NextResponse.json(
          { success: false, error: "Invalid request", details: parseResult.error.flatten() },
          { status: 400 },
        );
      }

      const { latexCode, lineImprovements, jobTitle, companyName } = parseResult.data;

      const userPrompt = prepareLatexImprovePrompt({
        latexCode,
        lineImprovements,
        jobTitle,
        companyName: companyName || undefined,
      });

      const aiResponse = await makeAIRequest<LatexImproveAIResponse>({
        messages: [
          { role: "system", content: LATEX_IMPROVE_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        reasoningLevel: "low",
        timeout: 30000,
      });

      const validation = LatexImproveResponseSchema.safeParse(aiResponse);
      if (!validation.success) {
        return NextResponse.json(
          { success: false, error: "AI returned malformed response" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        ...validation.data,
      });
    },
  );
}
