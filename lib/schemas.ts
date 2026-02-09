import { z } from "zod";

export const JobDataSchema = z.object({
  companyName: z.string().min(1, "Company name required").max(200),
  jobTitle: z.string().min(1, "Job title required").max(300),
  jobDescription: z.string().min(50, "Description too short").max(50000),
});

export type JobData = z.infer<typeof JobDataSchema>;

const TipSchema = z.object({
  type: z.enum(["good", "improve"]),
  tip: z.string(),
});

const DetailedTipSchema = TipSchema.extend({
  explanation: z.string(),
});

const LineImprovementSchema = z.object({
  section: z
    .string()
    .transform((val) => {
      const normalized = val.toLowerCase().trim();
      const allowed = ["summary", "experience", "education", "skills"];
      if (allowed.includes(normalized)) {
        return normalized;
      }
      return "other";
    })
    .pipe(z.enum(["summary", "experience", "education", "skills", "other"])),
  sectionTitle: z.string(),
  original: z.string(),
  suggested: z.string(),
  reason: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  category: z.enum(["quantify", "action-verb", "keyword", "clarity", "ats"]),
});

// Cover letter schemas -- AI output vs full persisted content

export const CoverLetterAISchema = z.object({
  recipientName: z.string().min(1).max(200),
  opening: z.string().min(20).max(600),
  bodyParagraphs: z.array(z.string().min(20).max(1000)).min(2).max(4),
  closing: z.string().min(10).max(400),
  signature: z.string().min(1).max(200),
});

export const CoverLetterContentSchema = z.object({
  header: z.object({
    fullName: z.string().min(1).max(200),
    title: z.string().min(1).max(300),
    email: z.string().email(),
    phone: z.string().min(1).max(50),
    location: z.string().min(1).max(200),
    linkedin: z.string().max(500).optional(),
  }),
  date: z.string().min(1),
  recipientName: z.string().min(1).max(200),
  opening: z.string().min(1).max(600),
  bodyParagraphs: z.array(z.string().min(1).max(1000)).min(1).max(4),
  closing: z.string().min(1).max(400),
  signature: z.string().min(1).max(200),
});

// Resume feedback schemas

export const FeedbackSchema = z.object({
  overallScore: z.number().min(0).max(100),
  ATS: z.object({
    score: z.number().min(0).max(100),
    tips: z.array(TipSchema).min(1),
  }),
  toneAndStyle: z.object({
    score: z.number().min(0).max(100),
    tips: z.array(DetailedTipSchema).min(1),
  }),
  content: z.object({
    score: z.number().min(0).max(100),
    tips: z.array(DetailedTipSchema).min(1),
  }),
  structure: z.object({
    score: z.number().min(0).max(100),
    tips: z.array(DetailedTipSchema).min(1),
  }),
  skills: z.object({
    score: z.number().min(0).max(100),
    tips: z.array(DetailedTipSchema).min(1),
  }),
  lineImprovements: z.array(LineImprovementSchema).min(8).max(15),
  coldOutreachMessage: z.string().min(50).max(500).optional(),
});
