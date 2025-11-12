import { z } from "zod";

export const JobDataSchema = z.object({
  companyName: z.string().min(1, "Company name required").max(200),
  jobTitle: z.string().min(1, "Job title required").max(300),
  jobDescription: z.string().min(50, "Description too short").max(50000),
});

export type JobData = z.infer<typeof JobDataSchema>;
