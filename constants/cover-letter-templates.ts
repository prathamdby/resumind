import type { CoverLetterTemplate } from "@/types";

export const COVER_LETTER_TEMPLATES: CoverLetterTemplate[] = [
  {
    id: "modern-professional",
    name: "Modern Professional",
    description:
      "Clean lines, confident tone. Best for corporate and mid-level roles.",
    category: "professional",
    tone: "Write with confident, direct language. Favor short punchy sentences over long complex ones. Lead with impact, not backstory.",
    accentColor: "#4c57e9",
    accentGradient: "linear-gradient(135deg, #6f7aff 0%, #4c57e9 100%)",
    headerLayout: "horizontal",
    fontWeight: "bold",
    accentBarVariant: "top-bar",
  },
  {
    id: "classic-formal",
    name: "Classic Formal",
    description:
      "Traditional letter format with a polished, conservative feel.",
    category: "professional",
    tone: "Write in a traditional, polished tone. Use complete sentences and formal structure. Show respect for the reader's time while demonstrating thoroughness.",
    accentColor: "#475569",
    accentGradient: "linear-gradient(135deg, #64748b 0%, #334155 100%)",
    headerLayout: "stacked",
    fontWeight: "normal",
    accentBarVariant: "left-bar",
  },
  {
    id: "bold-creative",
    name: "Bold Creative",
    description:
      "Energetic and personality-driven. Great for design, marketing, and media roles.",
    category: "creative",
    tone: "Write with energy and personality. Show enthusiasm without being unprofessional. Use vivid language and let the candidate's passion come through. Be memorable.",
    accentColor: "#e11d48",
    accentGradient: "linear-gradient(135deg, #fb7185 0%, #e11d48 100%)",
    headerLayout: "horizontal",
    fontWeight: "bold",
    accentBarVariant: "top-bar",
  },
  {
    id: "technical-deep-dive",
    name: "Technical Deep-Dive",
    description:
      "Precise and metric-heavy. Ideal for engineering, data, and technical roles.",
    category: "technical",
    tone: "Write with precision and technical credibility. Lead with measurable outcomes and specific technologies. Be concise. Quantify wherever the resume supports it.",
    accentColor: "#0d9488",
    accentGradient: "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)",
    headerLayout: "stacked",
    fontWeight: "normal",
    accentBarVariant: "left-bar",
  },
  {
    id: "executive-leadership",
    name: "Executive Leadership",
    description:
      "Strategic and authoritative. Built for director, VP, and C-level applications.",
    category: "executive",
    tone: "Write with strategic authority. Focus on leadership impact, business outcomes, and vision. Use measured, confident language befitting a senior leader. No filler.",
    accentColor: "#1e293b",
    accentGradient: "linear-gradient(135deg, #334155 0%, #0f172a 100%)",
    headerLayout: "horizontal",
    fontWeight: "bold",
    accentBarVariant: "top-bar",
  },
  {
    id: "fresh-start",
    name: "Fresh Start",
    description:
      "Enthusiastic and growth-minded. Perfect for recent graduates and career changers.",
    category: "entry-level",
    tone: "Write with genuine enthusiasm and a growth mindset. Emphasize transferable skills, eagerness to learn, and relevant coursework or projects. Be sincere, not desperate.",
    accentColor: "#059669",
    accentGradient: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
    headerLayout: "horizontal",
    fontWeight: "normal",
    accentBarVariant: "underline",
  },
];

export const TEMPLATE_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "professional", label: "Professional" },
  { id: "creative", label: "Creative" },
  { id: "technical", label: "Technical" },
  { id: "executive", label: "Executive" },
  { id: "entry-level", label: "Entry Level" },
] as const;

export function getTemplateById(
  id: string,
): CoverLetterTemplate | undefined {
  return COVER_LETTER_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByCategory(
  category: string,
): CoverLetterTemplate[] {
  if (category === "all") return COVER_LETTER_TEMPLATES;
  return COVER_LETTER_TEMPLATES.filter((t) => t.category === category);
}
