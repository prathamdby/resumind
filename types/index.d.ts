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

interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  jobDescription?: string;
  // Remove: imagePath, resumePath (no files stored)
  feedback: Feedback | null; // null until backend exists
}

interface LineImprovement {
  section: "summary" | "experience" | "education" | "skills" | "other";
  sectionTitle: string;
  original: string;
  suggested: string;
  reason: string;
  priority: "high" | "medium" | "low";
  category: "quantify" | "action-verb" | "keyword" | "clarity" | "ats";
}

interface Feedback {
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
  lineImprovements?: LineImprovement[];
  coldOutreachMessage?: string;
}
