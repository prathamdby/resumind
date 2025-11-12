import type { Feedback } from "@/types";

export async function analyzeResume(
  file: File,
  jobTitle: string,
  jobDescription: string,
  companyName?: string,
): Promise<Feedback> {
  throw new Error("Backend not implemented yet.");
}

const looksLikeNavOrAuthGarbage = (text: string): boolean => {
  const badPhrases = [
    "Skip to main content",
    "Expand search",
    "Sign in",
    "Join now",
    "Welcome back",
    "Forgot password?",
    "By clicking Continue",
    "Agree & Join LinkedIn",
    "Language",
    "Similar jobs",
    "People also viewed",
    "Similar Searches",
    "Explore collaborative articles",
    "More searches",
    "Get notified",
    "Set alert",
  ];
  const badHits = badPhrases.reduce(
    (n, p) => n + (text.includes(p) ? 1 : 0),
    0,
  );
  const hasJDSignals =
    /(Role Overview|About the job|Job description|Responsibilities|Requirements|Qualifications)/i.test(
      text,
    );
  return badHits >= 3 && !hasJDSignals;
};

const fetchPageContent = async (rawUrl: string): Promise<string> => {
  let targetUrl: URL;

  try {
    targetUrl = new URL(rawUrl);
  } catch {
    throw new Error("Please enter a valid job posting URL.");
  }

  const jinaPrefix =
    targetUrl.protocol === "https:"
      ? "https://r.jina.ai/https://"
      : "https://r.jina.ai/http://";
  const jinaUrl = `${jinaPrefix}${targetUrl.host}${targetUrl.pathname}${targetUrl.search}`;

  const isLinkedIn = /(^|\.)linkedin\.com$/i.test(targetUrl.hostname);
  const fetchTargets: string[] = isLinkedIn
    ? [jinaUrl, targetUrl.toString()]
    : [targetUrl.toString(), jinaUrl];

  let lastError: Error | null = null;

  for (const attemptUrl of fetchTargets) {
    try {
      const isJina = attemptUrl.startsWith("https://r.jina.ai/");
      const response = await fetch(attemptUrl, {
        headers: {
          "User-Agent": "ResumindJobFetcher/1.0",
          Accept: isJina
            ? "text/plain"
            : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      if (!response.ok) {
        lastError = new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`,
        );
        continue;
      }

      const html = await response.text();
      if (!html) {
        lastError = new Error("The response did not contain any content.");
        continue;
      }

      if (typeof window === "undefined" || typeof DOMParser === "undefined") {
        lastError = new Error(
          "Job importing is only available in the browser.",
        );
        continue;
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      if (!doc?.body) {
        lastError = new Error("Could not parse the job posting HTML.");
        continue;
      }

      const elementsToRemove = doc.querySelectorAll(
        "script, style, noscript, iframe, svg, canvas, header nav, footer, aside",
      );
      elementsToRemove.forEach((el) => el.remove());

      const textContent = doc.body.innerText || doc.body.textContent || "";
      const cleaned = textContent
        .replace(/\u00a0/g, " ")
        .replace(/\s+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      if (cleaned.length > 0) {
        if (looksLikeNavOrAuthGarbage(cleaned)) {
          lastError = new Error(
            "Unreadable page content; trying alternative source.",
          );
          continue;
        }
        const maxLength = 20000;
        return cleaned.length > maxLength
          ? cleaned.slice(0, maxLength)
          : cleaned;
      }

      lastError = new Error("The page did not contain readable content.");
    } catch (attemptError) {
      lastError =
        attemptError instanceof Error
          ? attemptError
          : new Error(
              "Failed to fetch the job posting due to a network error.",
            );
    }
  }

  throw lastError ||
    new Error(
      "Unable to fetch the job posting. Please copy and paste the job details manually.",
    );
};

const extractMessageText = (content: unknown): string => {
  if (!content) return "";

  let text = "";

  if (typeof content === "string") {
    text = content.trim();
  } else if (Array.isArray(content)) {
    const parts: string[] = [];

    for (const item of content) {
      if (!item) continue;

      if (typeof item === "string") {
        parts.push(item);
        continue;
      }

      if (
        typeof item === "object" &&
        "text" in item &&
        typeof item.text === "string"
      ) {
        parts.push(item.text);
      }
    }

    text = parts.join("").trim();
  }

  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");

  return text.trim();
};

const normalizeExtractedField = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

export async function importJobFromUrl(url: string): Promise<{
  companyName: string;
  jobTitle: string;
  jobDescription: string;
}> {
  const pageContent = await fetchPageContent(url);

  if (!pageContent) {
    throw new Error("No content found at the provided URL");
  }

  const lines = pageContent
    .split("\n")
    .filter((line) => line.trim().length > 0);

  let jobTitle = "";
  const titleKeywords = [
    "engineer",
    "developer",
    "designer",
    "manager",
    "analyst",
    "specialist",
  ];
  for (const line of lines.slice(0, 10)) {
    if (titleKeywords.some((keyword) => line.toLowerCase().includes(keyword))) {
      jobTitle = line.trim();
      break;
    }
  }
  if (!jobTitle && lines.length > 0) {
    jobTitle = lines[0].trim();
  }

  const jobDescription = pageContent;

  let companyName = "";
  try {
    const urlObj = new URL(url);
    companyName = urlObj.hostname.split(".")[0];
    companyName = companyName.charAt(0).toUpperCase() + companyName.slice(1);
  } catch {
    if (lines.length > 0) {
      companyName = lines[0].split(" ")[0];
    }
  }

  return {
    companyName: companyName || "",
    jobTitle: jobTitle || "",
    jobDescription: jobDescription || "",
  };
}
