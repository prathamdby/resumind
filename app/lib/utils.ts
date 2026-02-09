import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CoverLetterContent, CoverLetterTemplate } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a byte value into a human-readable string with appropriate units.
 *
 * @param bytes - The number of bytes to format
 * @returns A formatted string with the size and appropriate unit (Bytes, KB, MB, GB)
 *
 * @example
 * formatSize(1024) // "1 KB"
 * formatSize(1536) // "1.5 KB"
 * formatSize(0) // "0 Bytes"
 */
export const formatSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Generates a random UUID using the Web Crypto API.
 *
 * @returns A randomly generated UUID string in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 *
 * @example
 * generateUUID() // "550e8400-e29b-41d4-a716-446655440000"
 */
export const generateUUID = () => crypto.randomUUID();

export async function exportCoverLetterPDF(
  content: CoverLetterContent,
  template: CoverLetterTemplate,
  filename: string,
) {
  try {
    const [{ pdf }, { default: CoverLetterPDFDocument }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("@/app/components/cover-letter/CoverLetterPDFDocument"),
    ]);

    const blob = await pdf(CoverLetterPDFDocument({ content, template })).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("[PDF_EXPORT] Failed to export cover letter PDF", {
      filename,
      error,
    });
    throw error;
  }
}

export function coverLetterToPlainText(content: {
  header: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
  };
  date: string;
  recipientName: string;
  opening: string;
  bodyParagraphs: string[];
  closing: string;
  signature: string;
}): string {
  const { header, date, recipientName, opening, bodyParagraphs, closing, signature } =
    content;

  const contactLine = [header.email, header.phone, header.location]
    .filter(Boolean)
    .join(" | ");

  const lines = [
    header.fullName,
    header.title,
    contactLine,
    header.linkedin ? header.linkedin : "",
    "",
    date,
    "",
    `Dear ${recipientName},`,
    "",
    opening,
    "",
    ...bodyParagraphs.flatMap((p) => [p, ""]),
    closing,
    "",
    "Sincerely,",
    signature,
  ].filter((line, i, arr) => !(line === "" && arr[i - 1] === ""));

  return lines.join("\n");
}
