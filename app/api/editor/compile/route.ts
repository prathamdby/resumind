import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api-middleware";
import { validateLatex } from "@/lib/latex-compiler";

export const runtime = "nodejs";
export const maxDuration = 30;

const LATEX_ONLINE_URL = "https://latexonline.cc/compile";

export async function POST(request: NextRequest) {
  return await withAuthAndRateLimit(
    request,
    "/api/editor/compile",
    async () => {
      try {
        const { latex } = await request.json();

        if (!latex || typeof latex !== "string") {
          return NextResponse.json(
            { error: "LaTeX content required" },
            { status: 400 },
          );
        }

        const validation = validateLatex(latex);
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error },
            { status: 400 },
          );
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        try {
          const compileResponse = await fetch(
            `${LATEX_ONLINE_URL}?text=${encodeURIComponent(latex)}&command=pdflatex`,
            {
              method: "GET",
              signal: controller.signal,
            },
          );

          clearTimeout(timeout);

          if (!compileResponse.ok) {
            const errorText = await compileResponse.text();
            return NextResponse.json(
              { error: "LaTeX compilation failed", details: errorText },
              { status: 422 },
            );
          }

          const pdfBuffer = await compileResponse.arrayBuffer();

          return new NextResponse(pdfBuffer, {
            headers: {
              "Content-Type": "application/pdf",
              "Cache-Control": "no-cache",
            },
          });
        } catch (error) {
          clearTimeout(timeout);

          if (error instanceof Error && error.name === "AbortError") {
            return NextResponse.json(
              { error: "Compilation timed out", fallback: true },
              { status: 503 },
            );
          }

          return NextResponse.json(
            { error: "Compilation temporarily unavailable", fallback: true },
            { status: 503 },
          );
        }
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to compile LaTeX document" },
          { status: 500 },
        );
      }
    },
  );
}
