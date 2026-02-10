import type {
  Feedback,
  CoverLetterContent,
  OutreachChannel,
  OutreachTone,
} from "@/types";

export async function analyzeResume(
  file: File,
  jobTitle: string,
  jobDescription: string,
  reasoningLevel: "low" | "medium" | "high",
  companyName?: string,
): Promise<{ resumeId: string; feedback: Feedback }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("jobTitle", jobTitle);
  formData.append("jobDescription", jobDescription);
  formData.append("reasoningLevel", reasoningLevel);
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

export async function importJobFromPdf(file: File): Promise<{
  companyName: string;
  jobTitle: string;
  jobDescription: string;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/import-job-pdf", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to import job details from PDF");
  }

  return result.data;
}

export async function generateCoverLetter(params: {
  templateId: string;
  jobTitle: string;
  companyName?: string;
  jobDescription?: string;
  resumeId?: string;
  header: CoverLetterContent["header"];
}): Promise<{ id: string; content: CoverLetterContent }> {
  const response = await fetch("/api/cover-letter/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to generate cover letter");
  }

  return { id: result.id, content: result.content };
}

export async function updateCoverLetter(
  id: string,
  content: Partial<CoverLetterContent>,
  updatedAt: string,
): Promise<{ updatedAt: string }> {
  const response = await fetch(`/api/cover-letter/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, updatedAt }),
  });

  const result = await response.json();

  if (response.status === 409) {
    throw new Error("CONFLICT");
  }

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to save cover letter");
  }

  return { updatedAt: result.updatedAt };
}

export async function regenerateSection(
  id: string,
  section: "opening" | "body" | "closing",
  feedback?: string,
): Promise<{ content: CoverLetterContent }> {
  const response = await fetch(`/api/cover-letter/${id}/regenerate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ section, feedback }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to regenerate section");
  }

  return { content: result.content };
}

export async function deleteCoverLetter(id: string): Promise<void> {
  const response = await fetch(`/api/cover-letter/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to delete cover letter");
  }
}

export async function generateOutreach(params: {
  channel: OutreachChannel;
  tone: OutreachTone;
  jobTitle: string;
  companyName?: string;
  recipientName?: string;
  jobDescription?: string;
  resumeId?: string;
  additionalContext?: string;
}): Promise<{ id: string }> {
  const response = await fetch("/api/outreach/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to generate outreach message");
  }

  return { id: result.id };
}

export async function deleteOutreach(id: string): Promise<void> {
  const response = await fetch(`/api/outreach/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to delete outreach message");
  }
}

export async function regenerateOutreach(
  id: string,
  userFeedback: string,
): Promise<{ content: string; subject?: string }> {
  const response = await fetch(`/api/outreach/${id}/regenerate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userFeedback }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to regenerate outreach message");
  }

  return { content: result.content, subject: result.subject };
}
