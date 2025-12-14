import { LlamaParseReader } from "@llamaindex/cloud/reader";

const PARSE_TIMEOUT = 120000;

export async function parsePDF(filePath: string): Promise<string> {
  const LLAMA_CLOUD_API_KEY = process.env.LLAMA_CLOUD_API_KEY;

  if (!LLAMA_CLOUD_API_KEY) {
    throw new Error("LLAMA_CLOUD_API_KEY is not configured");
  }

  try {
    const reader = new LlamaParseReader({
      apiKey: LLAMA_CLOUD_API_KEY,
      resultType: "markdown",
      verbose: false,
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("PDF parsing timeout")), PARSE_TIMEOUT);
    });

    const parsePromise = reader.loadData(filePath);

    const documents = (await Promise.race([
      parsePromise,
      timeoutPromise,
    ])) as Array<{ text: string }>;

    if (!documents || documents.length === 0) {
      throw new Error("No content extracted from PDF");
    }

    const markdown = documents.map((doc) => doc.text).join("\n\n");

    if (!markdown || markdown.trim().length === 0) {
      throw new Error("PDF parsing returned empty content");
    }

    return markdown;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        throw new Error("PDF parsing timed out. Please try again.");
      }
      if (error.message.includes("API key")) {
        throw new Error("PDF parsing service configuration error");
      }
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
    throw new Error("PDF parsing failed with unknown error");
  }
}
