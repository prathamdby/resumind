import Cerebras from "@cerebras/cerebras_cloud_sdk";

if (!process.env.CEREBRAS_API_KEY) {
  throw new Error("Missing required environment variable: CEREBRAS_API_KEY");
}

export const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

export const AI_CONFIG = {
  model: "gpt-oss-120b",
  temperature: 0.6,
  max_completion_tokens: 65536,
  top_p: 1,
  reasoning_effort: "low" as const,
  stream: false,
  response_format: { type: "json_object" as const },
} as const;
