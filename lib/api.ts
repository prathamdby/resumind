import type { Feedback } from "@/types";

export async function analyzeResume(
  file: File,
  jobTitle: string,
  jobDescription: string,
  companyName?: string,
): Promise<{ resumeId: string; feedback: Feedback }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("jobTitle", jobTitle);
  formData.append("jobDescription", jobDescription);
  if (companyName) formData.append("companyName", companyName);

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to analyze resume");
  }

  return { resumeId: result.resumeId, feedback: result.feedback };
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
