import Cerebras from "@cerebras/cerebras_cloud_sdk";

if (!process.env.CEREBRAS_API_KEY) {
  throw new Error("Missing required environment variable: CEREBRAS_API_KEY");
}

export const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

export const AI_CONFIG_BASE = {
  model: "gpt-oss-120b",
  temperature: 0.6,
  max_completion_tokens: 65536,
  top_p: 1,
  stream: false,
  response_format: { type: "json_object" as const },
} as const;

export function getAIConfig(reasoningLevel: "low" | "medium" | "high" = "low") {
  return {
    ...AI_CONFIG_BASE,
    reasoning_effort: reasoningLevel,
  };
}

export const AI_CONFIG = getAIConfig("low");
