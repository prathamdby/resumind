import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth-server";
import { checkRateLimit } from "@/lib/rate-limit";
import { cerebras } from "@/lib/ai";
import { validateLatex } from "@/lib/latex-compiler";
import { EDITOR_SYSTEM_PROMPT, UPDATE_RESUME_TOOL } from "@/constants/editor";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rateLimitResult = await checkRateLimit(
    request,
    session.user.id,
    "/api/editor/chat"
  );

  if (!rateLimitResult.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { messages, currentLatex } = (await request.json()) as {
      messages: ChatMessage[];
      currentLatex: string;
    };

    const systemMessage = `${EDITOR_SYSTEM_PROMPT}

Current resume LaTeX:
\`\`\`latex
${currentLatex}
\`\`\`

IMPORTANT: When the user asks you to modify their resume, you MUST use the update_resume tool to make changes. Do not just describe the changes - actually use the tool to apply them.`;

    const response = await cerebras.chat.completions.create({
      model: "zai-glm-4.6",
      messages: [
        { role: "system", content: systemMessage },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      tools: [UPDATE_RESUME_TOOL],
      tool_choice: "auto",
      stream: true,
      temperature: 0.6,
      max_completion_tokens: 50000,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          let toolCallName = "";
          let toolCallArgs = "";
          let hasToolCall = false;

          for await (const chunk of response) {
            const delta = (
              chunk as {
                choices?: Array<{
                  delta?: {
                    content?: string;
                    tool_calls?: Array<{
                      function?: { name?: string; arguments?: string };
                    }>;
                  };
                }>;
              }
            ).choices?.[0]?.delta;

            if (delta?.content) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ content: delta.content })}\n\n`
                )
              );
            }

            if (delta?.tool_calls?.length) {
              hasToolCall = true;
              const toolCall = delta.tool_calls[0];
              if (toolCall.function?.name) {
                toolCallName = toolCall.function.name;
              }
              if (toolCall.function?.arguments) {
                toolCallArgs += toolCall.function.arguments;
              }
            }
          }

          if (hasToolCall && toolCallName === "update_resume") {
            const trimmedArgs = toolCallArgs.trim();
            if (!trimmedArgs.startsWith("{") || !trimmedArgs.endsWith("}")) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    error: "AI returned incomplete response. Please try again.",
                  })}\n\n`
                )
              );
            } else {
              try {
                const args = JSON.parse(toolCallArgs);

                const validation = validateLatex(args.latex || "");
                if (!validation.valid) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        error: `AI returned invalid LaTeX document: ${validation.error}`,
                      })}\n\n`
                    )
                  );
                } else {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        tool_call: {
                          name: toolCallName,
                          latex: args.latex,
                          explanation: args.explanation,
                        },
                      })}\n\n`
                    )
                  );

                  if (args.explanation) {
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({
                          content: args.explanation,
                        })}\n\n`
                      )
                    );
                  }
                }
              } catch {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      error: "Failed to parse AI response. Please try again.",
                    })}\n\n`
                  )
                );
              }
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream error occurred" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    const errorStatus = (error as { status?: number })?.status;
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process chat request";

    if (
      errorStatus === 429 ||
      errorMessage.includes("429") ||
      errorMessage.includes("limit exceeded")
    ) {
      return new Response(
        JSON.stringify({
          error:
            "AI service rate limit exceeded. Please wait a moment and try again.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
