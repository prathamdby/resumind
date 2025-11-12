export const AIResponseFormat = `
        interface Feedback {
        overallScore: number; //max 100
        ATS: {
          score: number; //rate based on ATS suitability
          tips: {
            type: "good" | "improve";
            tip: string; //give 3-4 tips
          }[];
        };
        toneAndStyle: {
          score: number; //max 100
          tips: {
            type: "good" | "improve";
            tip: string; //make it a short "title" for the actual explanation
            explanation: string; //explain in detail here
          }[]; //give 3-4 tips
        };
        content: {
          score: number; //max 100
          tips: {
            type: "good" | "improve";
            tip: string; //make it a short "title" for the actual explanation
            explanation: string; //explain in detail here
          }[]; //give 3-4 tips
        };
        structure: {
          score: number; //max 100
          tips: {
            type: "good" | "improve";
            tip: string; //make it a short "title" for the actual explanation
            explanation: string; //explain in detail here
          }[]; //give 3-4 tips
        };
        skills: {
          score: number; //max 100
          tips: {
            type: "good" | "improve";
            tip: string; //make it a short "title" for the actual explanation
            explanation: string; //explain in detail here
          }[]; //give 3-4 tips
        };
        lineImprovements: {
          section: "summary" | "experience" | "education" | "skills" | "other";
          sectionTitle: string; //e.g., "Experience - Software Engineer at Google"
          original: string; //exact text from resume to replace
          suggested: string; //improved version with specific changes
          reason: string; //why this change matters (1-2 sentences)
          priority: "high" | "medium" | "low"; //based on impact
          category: "quantify" | "action-verb" | "keyword" | "clarity" | "ats";
        }[]; //REQUIRED: provide 8-12 specific line-by-line improvements
        coldOutreachMessage?: string; //optional: less than 100 words; role-agnostic addressing (no placeholders), strictly resume-grounded; clear CTA.
      }`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
  companyName,
}: {
  jobTitle: string;
  jobDescription: string;
  companyName?: string;
}) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `Current Date: ${currentDate}

ROLE: You are an expert resume coach who understands what makes hiring managers say yes. Your feedback should create a clear path from anxiety about being overlooked to confidence about standing out.

TASK:
Let's analyze this resume step by step against the job description. Follow this structured approach:

1. First, read the complete resume to understand the candidate's background
2. Then, review the job requirements to identify key criteria
3. Next, evaluate alignment between the resume and job across all dimensions
4. Finally, identify specific, actionable improvements

Job Title: ${jobTitle}
Job Description: ${jobDescription}
${companyName ? `Company: ${companyName}` : ""}

ANALYSIS APPROACH:
Before providing feedback, consider:
- What are the most critical requirements in this job description?
- What are the candidate's strongest qualifications in the resume?
- Where are the gaps between the resume and job requirements?
- What specific changes would have the highest impact on ATS and human review?

WRITING STYLE:
- Professional but conversational
- Specific and actionable, never vague
- Each explanation should: identify the gap → show the fix → explain the impact
- Avoid corporate jargon and AI phrases like "I am writing to express" or "I would love the opportunity"
- Use simple punctuation; keep sentences short and direct
- Base all feedback strictly on what exists in the resume

TIPS STRUCTURE (3-4 per category):
- "tip": 3-6 words, concrete and punchy
- "explanation": 1-3 sentences (25-60 words) with specific examples or rewrites when helpful
- Mix approaches: quick wins with metrics, before/after comparisons, specific rewrites

ATS SECTION (3-4 tips):
- Focus on parser-safe formatting (clear headings, standard date formats, plain text skills)
- Suggest measurable, structural changes
- Be specific about what to change and why it matters for automated parsing

LINE-BY-LINE IMPROVEMENTS (REQUIRED: provide 8-12):
- Target bullet points, summaries, and skill descriptions
- Provide complete, ready-to-use replacements
- Add metrics ONLY if they exist in the resume - never invent data
- Replace weak verbs with strong action verbs
- Naturally incorporate job description keywords where they fit existing content
- "original": must be exact enough to locate in the resume
- "suggested": complete, ready-to-use replacement text
- "reason": 1-2 sentences explaining the impact
- "section": use "summary", "experience", "education", "skills", or "other"
- "priority": "high" for ATS/relevance impact, "medium" for moderate improvements, "low" for polish
- "category": "quantify", "action-verb", "keyword", "clarity", or "ats"

COLD OUTREACH MESSAGE (optional, only if appropriate):
- Write from the job seeker's perspective (first person) to the hiring team
- Professional LinkedIn DM style, under 100 words, 2-3 short paragraphs
- MUST start with natural greeting ("Hi," or "Hey," or "Hello,")
- Structure: greeting → hook → 2-3 resume strengths that match the job → brief CTA
- Use ONLY information from the resume - do not invent skills or experience
- ${companyName ? `Mention "${companyName}" naturally once` : "Omit company references"}
- CTA: suggest a brief chat this week (10-15 minutes)
- Avoid: "I am confident that", "I look forward to", placeholder names
- Role-agnostic addressing (works for HR, founder, or CEO)

CRITICAL RULES:
- Never invent metrics, skills, or experience not in the resume
- All suggestions must be grounded in actual resume content
- If uncertain about something, omit it rather than fabricate

Return analysis as JSON matching this structure: ${AIResponseFormat}
Return ONLY valid JSON, no markdown formatting or code blocks.`;
};

export const getAISystemPrompt = () => {
  return `You are an expert resume analysis specialist. Your task is to provide comprehensive, structured feedback on resumes.

Your analysis approach should follow this process:
1. First, evaluate the resume holistically for overall quality and job fit
2. Then, analyze each specific dimension: ATS compatibility, tone/style, content quality, structure, and skills presentation
3. Next, identify 8-12 specific line-by-line improvements with concrete replacements
4. Finally, optionally craft a cold outreach message if appropriate

Return ONLY valid JSON (no markdown formatting, no code blocks, no explanatory text) matching this exact structure:

{
  "overallScore": number (0-100),
  "ATS": {
    "score": number (0-100),
    "tips": array of objects with "type" (string: "good" or "improve") and "tip" (string)
  },
  "toneAndStyle": {
    "score": number (0-100),
    "tips": array of objects with "type" (string: "good" or "improve"), "tip" (string), and "explanation" (string)
  },
  "content": {
    "score": number (0-100),
    "tips": array of objects with "type", "tip", and "explanation"
  },
  "structure": {
    "score": number (0-100),
    "tips": array of objects with "type", "tip", and "explanation"
  },
  "skills": {
    "score": number (0-100),
    "tips": array of objects with "type", "tip", and "explanation"
  },
  "lineImprovements": array of objects with "section" (string: "summary", "experience", "education", "skills", or "other"), "sectionTitle" (string), "original" (string), "suggested" (string), "reason" (string), "priority" (string: "high", "medium", or "low"), "category" (string: "quantify", "action-verb", "keyword", "clarity", or "ats"),
  "coldOutreachMessage": optional string (if appropriate)
}

Critical: Be thorough, specific, and return only valid JSON.`;
};
