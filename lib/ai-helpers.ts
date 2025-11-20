import { cerebras, getAIConfig } from "@/lib/ai";
import type { ReasoningLevel } from "@/app/components/ReasoningToggle";
import type { ChatCompletionCreateParams } from "@cerebras/cerebras_cloud_sdk/resources/chat/completions";

type Message =
  | ChatCompletionCreateParams.SystemMessageRequest
  | ChatCompletionCreateParams.UserMessageRequest
  | ChatCompletionCreateParams.AssistantMessageRequest;

interface AIRequestOptions {
  messages: Message[];
  reasoningLevel?: ReasoningLevel;
  responseFormat?: { type: "json_object" | "text" };
  timeout?: number;
}

export async function makeAIRequest<T = string>(
  options: AIRequestOptions,
): Promise<T> {
  const {
    messages,
    reasoningLevel = "low",
    responseFormat = { type: "json_object" },
    timeout = 25000,
  } = options;

  const aiPromise = cerebras.chat.completions.create({
    messages,
    ...getAIConfig(reasoningLevel),
    response_format: responseFormat,
  });

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("AI timeout")), timeout),
  );

  const completion = await Promise.race([aiPromise, timeoutPromise]);
  const contentText = (
    completion as { choices?: Array<{ message?: { content?: string } }> }
  ).choices?.[0]?.message?.content;

  if (!contentText || typeof contentText !== "string") {
    throw new Error("No AI response");
  }

  if (responseFormat.type === "json_object") {
    return JSON.parse(contentText) as T;
  }

  return contentText as T;
}
