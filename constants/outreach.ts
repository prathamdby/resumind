import type {
  OutreachChannel,
  OutreachChannelConfig,
  OutreachTone,
  OutreachToneConfig,
} from "@/types";

export const OUTREACH_CHANNELS: OutreachChannelConfig[] = [
  {
    id: "linkedin-dm",
    name: "LinkedIn DM",
    description: "Short, punchy direct message for LinkedIn connections",
    wordRange: "50–100 words",
    accentColor: "sky",
  },
  {
    id: "cold-email",
    name: "Cold Email",
    description: "Professional email with subject line and structured body",
    wordRange: "150–250 words",
    accentColor: "slate",
  },
  {
    id: "networking",
    name: "Networking Request",
    description: "Warm introduction for informational interviews or referrals",
    wordRange: "80–120 words",
    accentColor: "emerald",
  },
  {
    id: "follow-up",
    name: "Follow-Up",
    description: "Brief nudge after an application or initial conversation",
    wordRange: "50–80 words",
    accentColor: "amber",
  },
];

export const OUTREACH_TONES: OutreachToneConfig[] = [
  {
    id: "bold",
    name: "Bold and Direct",
    description: "Confident opener, skip pleasantries, lead with value",
    directive:
      "Write with confidence. Skip filler greetings. Lead with the strongest value proposition immediately. Use short, punchy sentences.",
  },
  {
    id: "warm",
    name: "Warm and Conversational",
    description: "Friendly, genuine curiosity, human touch",
    directive:
      "Write warmly and conversationally. Show genuine curiosity about the recipient's work. Use natural language, like talking to a colleague you respect.",
  },
  {
    id: "professional",
    name: "Professional and Polished",
    description: "Structured, formal but not stiff",
    directive:
      "Write with polished professionalism. Clear structure, measured tone. Formal enough for C-suite but not robotic. Every sentence serves a purpose.",
  },
  {
    id: "curious",
    name: "Curious and Humble",
    description: "Question-led, learning mindset, authentic",
    directive:
      "Lead with genuine questions and a learning mindset. Show humility about what you don't know while grounding claims in real experience. Authentic and understated.",
  },
];

export const CHANNEL_TIPS: Record<OutreachChannel, string[]> = {
  "linkedin-dm": [
    "Reference a recent post or company announcement",
    "Keep under 100 words. DMs get skimmed on mobile",
    "Send Tuesday through Thursday, 9-11am recipient's timezone",
    "Personalize the connection request note too",
  ],
  "cold-email": [
    "Subject line: 6 words max, no clickbait",
    "First sentence must earn the second sentence",
    "One clear CTA. Don't give multiple options",
    "Follow up once after 3-5 business days",
  ],
  networking: [
    "Mention a mutual connection or shared interest",
    "Ask for 15 minutes, not an open-ended chat",
    "Be specific about what you want to learn",
    "Offer something in return when possible",
  ],
  "follow-up": [
    "Reference the specific role and date you applied",
    "Add new info: a recent project, article, or achievement",
    "Keep it under 80 words. Respect their inbox",
    "One follow-up is professional; three is persistent",
  ],
};

export const getOutreachSystemPrompt = () => {
  return `You are an expert outreach strategist who writes messages that get replies. You write like a skilled human networker, not a template engine.

Your approach:
1. Read the job context and candidate background carefully
2. Craft a message that feels personal and specific, never mass-produced
3. Match the requested tone while keeping it authentic
4. Every sentence must earn its place. No filler, no fluff

Hard constraints to avoid AI giveaways:
- Replace em-dashes ("—") with a period to start a new sentence, or a comma to continue
- Never output em-dashes
- Avoid repetitive sentence scaffolding and repeated openers
- Avoid corporate cliches, motivational fluff, and abstract claims without evidence
- Prefer concrete nouns, verbs, and role-specific details over generic adjectives
- Maintain a believable human cadence with controlled variation in sentence length
- Do not sound like a template. Every line must contain role-specific substance`;
};

export const prepareOutreachInstructions = ({
  channel,
  tone,
  jobTitle,
  companyName,
  recipientName,
  jobDescription,
  resumeMarkdown,
  additionalContext,
}: {
  channel: OutreachChannelConfig;
  tone: OutreachToneConfig;
  jobTitle: string;
  companyName?: string;
  recipientName?: string;
  jobDescription?: string;
  resumeMarkdown?: string;
  additionalContext?: string;
}) => {
  const hasResume = Boolean(resumeMarkdown?.trim());
  const isEmail = channel.id === "cold-email";

  const formatInstructions = isEmail
    ? `Return ONLY valid JSON matching this exact structure (no markdown, no code blocks):
{ "subject": "short subject line, 6 words max", "body": "the email body text" }`
    : `Return ONLY the plain text message. No JSON, no markdown formatting, no code blocks, no explanatory text.`;

  return `TASK: Write a ${channel.name} for a job seeker reaching out about a role.

CHANNEL: ${channel.name} (${channel.wordRange})
TONE: ${tone.name} -- ${tone.directive}

Job Title: ${jobTitle}
${companyName ? `Company: ${companyName}` : ""}
${recipientName ? `Recipient: ${recipientName}` : ""}
${jobDescription ? `Job Description:\n${jobDescription}` : "No job description provided. Write a general-purpose message for this role."}

${hasResume ? `CANDIDATE RESUME:\n${resumeMarkdown}\n\nUse specific details, skills, and experience from this resume. Never invent achievements or metrics not present in the resume.` : "No resume provided. Write plausible but clearly generic content."}

${additionalContext ? `ADDITIONAL CONTEXT FROM CANDIDATE:\n${additionalContext}` : ""}

MESSAGE GUIDELINES:
- Write from the job seeker's perspective (first person) to the hiring team
- ${channel.wordRange}, 2-3 short paragraphs
- MUST start with a natural greeting ("Hi," or "Hey," or "Hello,")
- Structure: greeting, hook, 2-3 resume strengths that match the job, brief CTA
- Use ONLY information from the resume. Do not invent skills or experience
- ${companyName ? `Mention "${companyName}" naturally once` : "Omit company references"}
- ${recipientName ? `Address "${recipientName}" by name` : "Role-agnostic addressing (works for HR, founder, or CEO)"}
- CTA: suggest a brief chat this week (10-15 minutes)
- Avoid: "I am confident that", "I look forward to", placeholder names, "I would love the opportunity"
- Avoid corporate jargon and AI cliches

${formatInstructions}`;
};

export const prepareOutreachRegenerationInstructions = ({
  channel,
  tone,
  currentContent,
  currentSubject,
  userFeedback,
  jobTitle,
  companyName,
  recipientName,
  jobDescription,
  resumeMarkdown,
}: {
  channel: OutreachChannelConfig;
  tone: OutreachToneConfig;
  currentContent: string;
  currentSubject?: string;
  userFeedback: string;
  jobTitle: string;
  companyName?: string;
  recipientName?: string;
  jobDescription?: string;
  resumeMarkdown?: string;
}) => {
  const isEmail = channel.id === "cold-email";

  const currentMessage = isEmail && currentSubject
    ? `Current Subject: ${currentSubject}\nCurrent Body:\n${currentContent}`
    : `Current Message:\n${currentContent}`;

  const formatInstructions = isEmail
    ? `Return ONLY valid JSON matching this exact structure (no markdown, no code blocks):
{ "subject": "short subject line, 6 words max", "body": "the email body text" }`
    : `Return ONLY the plain text message. No JSON, no markdown formatting, no code blocks, no explanatory text.`;

  return `TASK: Regenerate a ${channel.name} based on user feedback.

CHANNEL: ${channel.name} (${channel.wordRange})
TONE: ${tone.name} -- ${tone.directive}

Job Title: ${jobTitle}
${companyName ? `Company: ${companyName}` : ""}
${recipientName ? `Recipient: ${recipientName}` : ""}
${jobDescription ? `Job Description:\n${jobDescription}` : ""}

${resumeMarkdown ? `CANDIDATE RESUME:\n${resumeMarkdown}` : ""}

${currentMessage}

USER FEEDBACK:
${userFeedback}

Apply the user's feedback to improve the message. Keep all original guidelines (tone, word range, resume-grounding, no AI cliches).

${formatInstructions}`;
};
