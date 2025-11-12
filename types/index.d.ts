interface Job {
  title: string;
  description: string;
  location: string;
  requiredSkills: string[];
}

interface Resume {
  id: string;
  user_id: string;
  company_name?: string;
  job_title?: string;
  job_description?: string;
  text_content: string;
  feedback: Feedback | null;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  updated_at: string;
  companyName?: string;
  jobTitle?: string;
  jobDescription?: string;
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
