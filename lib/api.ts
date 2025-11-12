import type { Feedback } from "@/types";

export async function analyzeResume(
  file: File,
  jobTitle: string,
  jobDescription: string,
  companyName?: string,
): Promise<Feedback> {
  throw new Error("Backend not implemented yet.");
}

export async function importJobFromUrl(url: string): Promise<{
  companyName: string;
  jobTitle: string;
  jobDescription: string;
}> {
  const response = await fetch("/api/import-job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const result = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to import job details");
  }

  return result.data;
}
