import type { Session, User } from "better-auth/types";

declare global {
  interface BetterAuthSession extends Session {}
  interface BetterAuthUser extends User {}
}

export type { Session, User };

interface Job {
  title: string;
  description: string;
  location: string;
  requiredSkills: string[];
}

export interface Feedback {
  overallScore: number;
  ATS: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };
  toneAndStyle: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  content: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  structure: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  skills: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  lineImprovements: LineImprovement[];
  coldOutreachMessage?: string;
}

export interface LineImprovement {
  section: "summary" | "experience" | "education" | "skills" | "other";
  sectionTitle: string;
  original: string;
  suggested: string;
  reason: string;
  priority: "high" | "medium" | "low";
  category: "quantify" | "action-verb" | "keyword" | "clarity" | "ats";
}

export interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  jobDescription?: string;
  resumeMarkdown?: string;
  feedback: Feedback | null;
  previewImage?: string;
}

export interface CoverLetterContent {
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
}

export interface CoverLetterAIResponse {
  recipientName: string;
  opening: string;
  bodyParagraphs: string[];
  closing: string;
  signature: string;
}

export type CoverLetterTemplateCategory =
  | "professional"
  | "creative"
  | "technical"
  | "executive"
  | "entry-level"
  | "startup";

export type AccentBarVariant = "top-bar" | "left-bar" | "underline";

export interface CoverLetterTemplate {
  id: string;
  name: string;
  description: string;
  category: CoverLetterTemplateCategory;
  tone: string;
  accentColor: string;
  accentGradient: string;
  headerLayout: "horizontal" | "stacked";
  fontWeight: "normal" | "bold";
  accentBarVariant: AccentBarVariant;
}

export interface CoverLetter {
  id: string;
  templateId: string;
  jobTitle: string;
  companyName?: string;
  jobDescription?: string;
  content: CoverLetterContent;
  resumeId?: string;
  createdAt: string;
  updatedAt: string;
}

// Outreach types

export type OutreachChannel =
  | "linkedin-dm"
  | "cold-email"
  | "networking"
  | "follow-up";

export type OutreachTone = "bold" | "warm" | "professional" | "curious";

export interface OutreachChannelConfig {
  id: OutreachChannel;
  name: string;
  description: string;
  wordRange: string;
  accentColor: string;
}

export interface OutreachToneConfig {
  id: OutreachTone;
  name: string;
  description: string;
  directive: string;
}

export interface OutreachGenerationContext {
  channel: OutreachChannel;
  tone: OutreachTone;
  jobDescription?: string;
  additionalContext?: string;
  resumeMarkdown?: string;
}

export interface Outreach {
  id: string;
  channel: OutreachChannel;
  tone: OutreachTone;
  jobTitle: string;
  companyName?: string;
  recipientName?: string;
  subject?: string;
  content: string;
  resumeId?: string;
  createdAt: string;
  updatedAt: string;
}
