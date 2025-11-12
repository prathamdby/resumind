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
Analyze this resume against the job description. Be thorough, specific, and honest. Low scores are acceptable if the resume is weak.

Job Title: ${jobTitle}
Job Description: ${jobDescription}
${companyName ? `Company: ${companyName}` : ""}

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
  return `You are a resume analysis expert. Return valid JSON (no markdown formatting, no code blocks) with this exact structure:

{
  "overallScore": number (0-100),
  "ATS": {
    "score": number (0-100),
    "tips": array of objects with "type" (string: "good" or "improve") and "tip" (string)
  },
  "toneAndStyle": {
    "score": number (0-100),
    "tips": array of objects with "type", "tip", and "explanation" (string)
  },
  "content": { same structure as toneAndStyle },
  "structure": { same structure as toneAndStyle },
  "skills": { same structure as toneAndStyle },
  "lineImprovements": optional array of objects with "section" (string: use "summary", "experience", "education", "skills", or "other" for any other section), "sectionTitle", "original", "suggested", "reason", "priority" (string: "high"/"medium"/"low"), "category" (string),
  "coldOutreachMessage": optional string
}

Be thorough and specific in your analysis.`;
};
