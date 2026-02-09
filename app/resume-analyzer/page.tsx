import type { Metadata } from "next";
import Link from "next/link";
import {
  FileSearch,
  ScanSearch,
  Pencil,
  BarChart3,
  MessageSquareText,
  Sparkles,
  Upload,
  ClipboardList,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Briefcase,
  RefreshCw,
  UserRound,
  Shield,
  Zap,
  Target,
  Type,
  Search,
  ListChecks,
  Hash,
  SpellCheck,
} from "lucide-react";
import ScrollReveal from "@/app/components/ScrollReveal";

/* ─── SEO Metadata ─── */

export const metadata: Metadata = {
  title:
    "AI Resume Analyzer — Score, Rewrite & Optimize Your Resume | Resumind",
  description:
    "Get your resume scored across 5 dimensions, rewritten line-by-line, and optimized for ATS in under 60 seconds. Free AI-powered resume analysis.",
  keywords: [
    "resume analyzer",
    "AI resume review",
    "ATS score checker",
    "resume optimization",
    "resume feedback",
    "resume scorer",
    "ATS resume checker",
    "line-by-line resume rewrite",
  ],
  openGraph: {
    title: "AI Resume Analyzer — Score, Rewrite & Optimize Your Resume",
    description:
      "Five scoring dimensions. Line-by-line rewrites. ATS optimization. All in under 60 seconds.",
    url: "/resume-analyzer",
    siteName: "Resumind",
    type: "article",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Resume Analyzer | Resumind",
    description:
      "Score, rewrite, and optimize your resume with AI. Land more interviews.",
  },
  alternates: { canonical: "/resume-analyzer" },
};

/* ─── JSON-LD Structured Data ─── */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Resumind Resume Analyzer",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "AI-powered resume analyzer that scores your resume across 5 dimensions, provides 8–12 line-by-line rewrites, and optimizes for ATS compatibility.",
  featureList: [
    "ATS Compatibility Score",
    "Content Quality Score",
    "Structure Score",
    "Tone & Style Score",
    "Skills Presentation Score",
    "Line-by-Line Rewrites",
    "Cold Outreach Message Generator",
    "Job Description Matching",
  ],
};

const faqItems = [
  {
    question: "What is an AI resume analyzer?",
    answer:
      "An AI resume analyzer is a tool that uses artificial intelligence to evaluate your resume against job requirements. Resumind scores your resume across five dimensions — ATS compatibility, content quality, structure, tone, and skills presentation — and provides specific, actionable feedback to improve it.",
  },
  {
    question: "How does the ATS score work?",
    answer:
      "The ATS score simulates how major applicant tracking systems parse your resume. It evaluates formatting, keyword density, date formats, section headers, and structural compatibility with automated screening. A score of 80 or above means your resume is likely to pass most ATS filters.",
  },
  {
    question: "Are the line-by-line rewrites accurate?",
    answer:
      "Every rewrite is grounded in your actual resume content. The AI never invents metrics, skills, or experience. Each suggestion replaces weak phrasing with stronger alternatives using your real qualifications, and is tagged by priority and category so you know exactly why the change matters.",
  },
  {
    question: "How long does the analysis take?",
    answer:
      "Most analyses complete in under 60 seconds. You upload a PDF, paste the job description, and receive a full scored report with line-by-line rewrites almost immediately.",
  },
  {
    question: "Is my resume data stored?",
    answer:
      "Your resume is processed in memory during analysis. We store the analysis results (scores, feedback, rewrites) so you can revisit them, but the original PDF is deleted immediately after processing. We use encrypted connections and never share data with third parties.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "Resumind accepts PDF files up to 20MB. PDF is the industry standard for resume submissions because it preserves formatting across devices and ATS systems.",
  },
  {
    question: "How many times can I analyze my resume?",
    answer:
      "You can analyze as many resumes as you need. Rate limits exist to maintain quality — 2 analyses per minute — but there is no hard cap on total usage. Most users re-analyze after each round of edits to track their score improvement.",
  },
  {
    question: "What makes this different from other resume tools?",
    answer:
      "Most resume tools offer generic advice or template-based fixes. Resumind analyzes your resume against the specific job you are applying for, scores five distinct dimensions, and gives you ready-to-paste line rewrites with before/after diffs. Every suggestion is prioritized and categorized so you focus on what matters most.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

/* ─── Data Arrays ─── */

const scoringDimensions = [
  {
    icon: ScanSearch,
    title: "ATS Compatibility",
    gradient: "from-violet-500 to-indigo-500",
    description:
      "Measures how well automated tracking systems can parse and interpret your resume. A low ATS score means recruiters may never see your application.",
    checks: [
      "Parser-safe formatting and section headers",
      "Standard date formats and chronological ordering",
      "Plain-text skill extraction compatibility",
      "Keyword density matched to job requirements",
    ],
  },
  {
    icon: FileSearch,
    title: "Content Quality",
    gradient: "from-indigo-500 to-blue-500",
    description:
      "Evaluates how well your resume content aligns with the target job. Looks for specificity, quantified impact, and relevant experience.",
    checks: [
      "Alignment between resume and job requirements",
      "Quantified achievements with real metrics",
      "Specificity over vague generalizations",
      "Evidence of impact in each role",
    ],
  },
  {
    icon: ListChecks,
    title: "Structure",
    gradient: "from-emerald-500 to-teal-500",
    description:
      "Assesses the organization and readability of your resume. A strong structure guides the reader through your experience logically.",
    checks: [
      "Logical section ordering and flow",
      "Consistent formatting across entries",
      "Appropriate length and white space",
      "Clear hierarchy of information",
    ],
  },
  {
    icon: MessageSquareText,
    title: "Tone & Style",
    gradient: "from-pink-500 to-rose-500",
    description:
      "Analyzes your writing voice for professionalism and clarity. Flags corporate jargon, passive constructions, and overused filler phrases.",
    checks: [
      "Professional but natural voice",
      "Active voice and strong verb usage",
      "No corporate jargon or buzzwords",
      "Consistent tense and point of view",
    ],
  },
  {
    icon: Sparkles,
    title: "Skills Presentation",
    gradient: "from-amber-500 to-orange-500",
    description:
      "Reviews how your skills are displayed and whether they match what the job description asks for. Identifies missing keywords and misaligned emphasis.",
    checks: [
      "Skill-to-requirement keyword matching",
      "Technical vs. soft skill balance",
      "Skills integrated into experience bullets",
      "Missing high-value keywords flagged",
    ],
  },
];

const processSteps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload your resume",
    description:
      "Drop a PDF file. We accept resumes up to 20MB with any formatting or layout.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Add the job description",
    description:
      "Paste the job listing or import it from a URL. The AI needs the target role to give relevant feedback.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "AI analyzes everything",
    description:
      "Five dimensions scored 0–100. Line-by-line rewrites generated. Cold outreach message drafted. All in under 60 seconds.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Apply and re-analyze",
    description:
      "Copy the rewrites, update your resume, and re-upload. Watch your scores climb with each iteration.",
  },
];

const priorities = [
  {
    level: "HIGH",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    dotColor: "bg-rose-500",
    meaning: "Directly impacts ATS pass-through or recruiter first impression",
    example: "Replace passive 'Responsible for' with action verb + metric",
  },
  {
    level: "MEDIUM",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
    meaning: "Moderate improvement to clarity, relevance, or keyword density",
    example: "Add a quantified result to a bullet that currently lacks metrics",
  },
  {
    level: "LOW",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    meaning: "Polish and refinement — good resume becomes great",
    example: "Tighten a wordy sentence from 25 words to 15",
  },
];

const categories = [
  {
    icon: Hash,
    name: "Quantify",
    description: "Add metrics and numbers to vague achievements",
  },
  {
    icon: Zap,
    name: "Action Verb",
    description: "Replace weak verbs with strong, specific alternatives",
  },
  {
    icon: Search,
    name: "Keyword",
    description: "Incorporate missing terms from the job description",
  },
  {
    icon: SpellCheck,
    name: "Clarity",
    description: "Simplify complex sentences and remove filler",
  },
  {
    icon: Target,
    name: "ATS",
    description: "Restructure for better automated parsing",
  },
];

const personas = [
  {
    icon: Briefcase,
    title: "Active Job Seekers",
    description:
      "Sending 50+ applications with few callbacks. Your resume might be getting filtered out by ATS before a human ever reads it.",
  },
  {
    icon: RefreshCw,
    title: "Career Changers",
    description:
      "Pivoting to a new industry and need to reframe existing experience. The analyzer highlights what to emphasize and what to restructure.",
  },
  {
    icon: UserRound,
    title: "Senior Professionals",
    description:
      "Your resume has grown stale over the years. Get fresh, targeted feedback that matches how hiring has evolved.",
  },
];

/* ─── Section Components ─── */

function FeatureNav() {
  return (
    <header className="px-4 pt-4">
      <nav className="landing-nav" aria-label="Resume analyzer navigation">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex" role="navigation">
          <a
            href="#scoring"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Scoring
          </a>
          <a
            href="#rewrites"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Rewrites
          </a>
          <a
            href="#how"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            FAQ
          </a>
        </div>

        <Link href="/auth" className="primary-button px-5 py-2.5 text-sm">
          Get Started
        </Link>
      </nav>
    </header>
  );
}

function HeroBlobBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute"
        style={{
          width: "55%",
          height: "60%",
          top: "5%",
          left: "-8%",
          background:
            "radial-gradient(ellipse at 40% 50%, rgba(111, 122, 255, 0.18), rgba(76, 87, 233, 0.06) 60%, transparent 80%)",
          animation: "blobMorph1 18s ease-in-out infinite",
          willChange: "transform, border-radius",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: "45%",
          height: "50%",
          top: "10%",
          right: "-5%",
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(250, 113, 133, 0.15), rgba(244, 63, 94, 0.05) 60%, transparent 80%)",
          animation: "blobMorph2 22s ease-in-out infinite",
          willChange: "transform, border-radius",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: "40%",
          height: "45%",
          bottom: "0%",
          left: "20%",
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(251, 191, 146, 0.12), rgba(251, 146, 60, 0.04) 60%, transparent 80%)",
          animation: "blobMorph3 25s ease-in-out infinite",
          willChange: "transform, border-radius",
        }}
      />
    </>
  );
}

function AnalyzerHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-24 sm:px-10 sm:pt-32 lg:px-16">
      <HeroBlobBackground />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="landing-eyebrow mb-8">
          <BarChart3 className="mr-2 h-3.5 w-3.5" />
          Resume Analyzer
        </div>

        <h1
          className="text-balance text-4xl font-bold leading-[1.08] text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl"
          style={{ animation: "landingFadeUp 0.8s ease-out both" }}
        >
          AI Resume Analyzer That Scores, Rewrites, and{" "}
          <span className="text-gradient">Gets You Interviews</span>
        </h1>

        <p
          className="mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl"
          style={{
            animation: "landingFadeUp 0.8s ease-out both",
            animationDelay: "150ms",
          }}
        >
          Upload your resume and a job description. Get scored across five
          dimensions, receive 8–12 line-by-line rewrites, and see exactly what
          to fix — all in under 60 seconds.
        </p>

        <div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          style={{
            animation: "landingFadeUp 0.8s ease-out both",
            animationDelay: "300ms",
          }}
        >
          <Link href="/auth" className="primary-button px-8 py-3.5 text-base">
            Analyze Your Resume Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how"
            className="primary-button primary-button--ghost px-6 py-3 text-base"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}

function WhatYouGet() {
  return (
    <ScrollReveal>
      <section className="landing-section py-16! sm:py-20!">
        <div className="mx-auto max-w-3xl text-left">
          <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
            What You Get From Every Analysis
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-slate-600">
            <p>
              Every resume analysis produces a comprehensive report built around
              five scoring dimensions: ATS compatibility, content quality,
              structure, tone and style, and skills presentation. Each dimension
              is scored from 0 to 100, giving you a clear picture of where you
              stand and where to improve.
            </p>
            <p>
              Beyond scores, you receive 8–12 line-by-line rewrites — specific
              before-and-after suggestions you can copy directly into your
              resume. Each rewrite is tagged by priority (high, medium, low) and
              category (quantify, action verb, keyword, clarity, ATS) so you
              know exactly why the change matters and where to focus first.
            </p>
            <p>
              You also get a cold outreach message — a LinkedIn DM drafted from
              your actual resume content, ready to send to hiring managers. No
              generic templates. Every piece of feedback is grounded in what your
              resume actually says and what the target job actually requires.
            </p>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

function ScoreGaugeMockup() {
  return (
    <div className="mockup-frame">
      <div className="mockup-chrome">
        <div className="mockup-dot bg-rose-300" />
        <div className="mockup-dot bg-amber-300" />
        <div className="mockup-dot bg-emerald-300" />
        <div className="ml-3 flex-1 rounded-full bg-slate-100 py-2" />
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex flex-col items-center gap-5">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="rgba(99,102,241,0.1)"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#sgAnalyzer)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${0.82 * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
              />
              <defs>
                <linearGradient
                  id="sgAnalyzer"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-slate-900">82</span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              {
                label: "ATS",
                score: 78,
                bg: "bg-amber-50 text-amber-700 border-amber-100",
              },
              {
                label: "Content",
                score: 85,
                bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
              },
              {
                label: "Structure",
                score: 80,
                bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
              },
              {
                label: "Tone",
                score: 79,
                bg: "bg-amber-50 text-amber-700 border-amber-100",
              },
              {
                label: "Skills",
                score: 84,
                bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
              },
            ].map(({ label, score, bg }) => (
              <div
                key={label}
                className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 ${bg}`}
              >
                <span className="text-xs font-medium">{label}</span>
                <span className="text-sm font-bold">{score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoringDimensions() {
  return (
    <section id="scoring" className="landing-section">
      <ScrollReveal className="flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <BarChart3 className="mr-2 h-3.5 w-3.5" />
          Five Dimensions
        </div>
        <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          Scored Across Every Angle That Matters
        </h2>
        <p className="max-w-xl text-lg text-slate-600">
          Each dimension is scored 0–100 with specific tips and explanations.
        </p>
      </ScrollReveal>

      <div className="grid w-full items-start gap-10 text-left lg:grid-cols-2 lg:gap-14">
        <ScrollReveal>
          <ScoreGaugeMockup />
        </ScrollReveal>

        <div className="flex flex-col gap-5">
          {scoringDimensions.map(
            ({ icon: Icon, title, gradient, description, checks }, i) => (
              <ScrollReveal key={title} delay={i * 80}>
                <div className="flex gap-4 rounded-2xl border border-white/40 bg-white/90 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${gradient} text-white shadow-sm`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-slate-900">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {description}
                    </p>
                    <ul className="mt-2.5 space-y-1">
                      {checks.map((check) => (
                        <li
                          key={check}
                          className="flex items-start gap-2 text-xs text-slate-500"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                          {check}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function RewriteShowcase() {
  return (
    <section id="rewrites" className="landing-section">
      <div className="grid w-full items-center gap-10 text-left lg:grid-cols-2 lg:gap-16">
        <ScrollReveal className="flex flex-col gap-5">
          <div className="landing-eyebrow w-fit">
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Line-by-Line Rewrites
          </div>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Before and After. Every Line. One Click to Copy.
          </h2>
          <p className="text-lg leading-relaxed text-slate-600">
            Every analysis produces 8–12 targeted rewrites. Each one shows the
            exact text to replace, the improved version, and a short explanation
            of why the change matters. Tagged by priority and category so you
            know where to focus.
          </p>
          <Link
            href="/auth"
            className="primary-button mt-2 w-fit px-6 py-3 text-sm"
          >
            See your rewrites
            <ArrowRight className="h-4 w-4" />
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="mockup-frame">
            <div className="mockup-chrome">
              <div className="mockup-dot bg-rose-300" />
              <div className="mockup-dot bg-amber-300" />
              <div className="mockup-dot bg-emerald-300" />
              <div className="ml-3 flex-1 rounded-full bg-slate-100 py-2" />
            </div>
            <div className="space-y-3 p-5 sm:p-6">
              <div className="overflow-hidden rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-3.5 py-2">
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                    HIGH
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    Action Verb
                  </span>
                </div>
                <div className="bg-rose-50/60 px-3.5 py-2.5">
                  <p className="font-mono text-xs text-rose-700/80">
                    <span className="mr-2 text-rose-400">&minus;</span>
                    Was responsible for overseeing the product roadmap
                  </p>
                </div>
                <div className="bg-emerald-50/60 px-3.5 py-2.5">
                  <p className="font-mono text-xs text-emerald-700/80">
                    <span className="mr-2 text-emerald-400">+</span>
                    Drove the product roadmap across 4 squads, shipping 12
                    features in Q3
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-3.5 py-2">
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                    MED
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    Quantify
                  </span>
                </div>
                <div className="bg-rose-50/60 px-3.5 py-2.5">
                  <p className="font-mono text-xs text-rose-700/80">
                    <span className="mr-2 text-rose-400">&minus;</span>
                    Improved the onboarding process significantly
                  </p>
                </div>
                <div className="bg-emerald-50/60 px-3.5 py-2.5">
                  <p className="font-mono text-xs text-emerald-700/80">
                    <span className="mr-2 text-emerald-400">+</span>
                    Redesigned onboarding flow, cutting time-to-value from 14
                    days to 3
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-3.5 py-2">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                    LOW
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    Clarity
                  </span>
                </div>
                <div className="bg-rose-50/60 px-3.5 py-2.5">
                  <p className="font-mono text-xs text-rose-700/80">
                    <span className="mr-2 text-rose-400">&minus;</span>
                    Utilized various methodologies to optimize workflows
                  </p>
                </div>
                <div className="bg-emerald-50/60 px-3.5 py-2.5">
                  <p className="font-mono text-xs text-emerald-700/80">
                    <span className="mr-2 text-emerald-400">+</span>
                    Automated 3 manual workflows, saving the team 8 hours per
                    week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function AnalysisProcess() {
  return (
    <section id="how" className="landing-section">
      <ScrollReveal className="flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <Sparkles className="mr-2 h-3.5 w-3.5" />
          How It Works
        </div>
        <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          Four Steps. Under 60 Seconds.
        </h2>
      </ScrollReveal>

      <div className="mx-auto w-full max-w-2xl">
        {processSteps.map(
          ({ number, icon: Icon, title, description }, i) => (
            <ScrollReveal key={number} delay={i * 100}>
              <div className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/90 shadow-sm backdrop-blur">
                    <Icon className="h-5 w-5 text-indigo-500" />
                  </div>
                  {i < processSteps.length - 1 && (
                    <div className="my-1 w-px flex-1 bg-linear-to-b from-indigo-200 to-pink-200" />
                  )}
                </div>
                <div className={`pb-10 ${i === processSteps.length - 1 ? "pb-0" : ""}`}>
                  <span className="text-gradient text-sm font-bold">
                    Step {number}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ),
        )}
      </div>
    </section>
  );
}

function PrioritySystem() {
  return (
    <section className="landing-section">
      <ScrollReveal className="flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <Shield className="mr-2 h-3.5 w-3.5" />
          Priority System
        </div>
        <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          Every Suggestion Is Ranked and Categorized
        </h2>
        <p className="max-w-xl text-lg text-slate-600">
          So you know what to fix first and why it matters.
        </p>
      </ScrollReveal>

      <div className="w-full max-w-3xl text-left">
        <ScrollReveal>
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Priority Levels
          </h3>
          <div className="flex flex-col gap-3">
            {priorities.map(({ level, color, dotColor, meaning, example }) => (
              <div
                key={level}
                className="flex flex-col gap-2 rounded-2xl border border-white/40 bg-white/90 p-5 backdrop-blur sm:flex-row sm:items-start sm:gap-5"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotColor}`} />
                  <span
                    className={`inline-flex rounded-full border px-3 py-0.5 text-xs font-bold ${color}`}
                  >
                    {level}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    {meaning}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Example: {example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h3 className="mb-4 mt-10 text-lg font-semibold text-slate-900">
            Rewrite Categories
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ icon: Icon, name, description }) => (
              <div
                key={name}
                className="flex items-start gap-3 rounded-2xl border border-white/40 bg-white/90 p-4 backdrop-blur"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function TargetAudience() {
  return (
    <section className="landing-section">
      <ScrollReveal className="flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <Type className="mr-2 h-3.5 w-3.5" />
          Who It&apos;s For
        </div>
        <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          Built for People Who Are Done Guessing
        </h2>
      </ScrollReveal>

      <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {personas.map(({ icon: Icon, title, description }, i) => (
          <ScrollReveal key={title} delay={i * 80}>
            <div className="bento-cell h-full">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-100 to-pink-100 text-indigo-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function AnalyzerFAQ() {
  return (
    <section id="faq" className="landing-section">
      <ScrollReveal className="flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <MessageSquareText className="mr-2 h-3.5 w-3.5" />
          Questions
        </div>
        <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          Frequently Asked Questions
        </h2>
      </ScrollReveal>

      <div className="flex w-full max-w-2xl flex-col gap-3">
        {faqItems.map(({ question, answer }, i) => (
          <ScrollReveal key={question} delay={i * 60}>
            <details className="faq-item">
              <summary>
                <span className="flex items-center justify-between gap-4">
                  {question}
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 [[open]>&]:rotate-180" />
                </span>
              </summary>
              <p className="faq-answer">{answer}</p>
            </details>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function AnalyzerCTA() {
  return (
    <section
      className="landing-cta"
      style={{
        background:
          "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #3730a3 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute"
        style={{
          width: "60%",
          height: "65%",
          top: "5%",
          left: "-10%",
          background:
            "radial-gradient(ellipse at 40% 50%, rgba(111, 122, 255, 0.4), rgba(76, 87, 233, 0.15) 60%, transparent 80%)",
          animation: "blobMorph1 18s ease-in-out infinite",
          willChange: "transform, border-radius",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: "50%",
          height: "55%",
          top: "10%",
          right: "-8%",
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(250, 113, 133, 0.3), rgba(244, 63, 94, 0.1) 60%, transparent 80%)",
          animation: "blobMorph2 22s ease-in-out infinite",
          willChange: "transform, border-radius",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.3,
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <h2
          className="text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          style={{ textShadow: "0 2px 30px rgba(0, 0, 0, 0.15)" }}
        >
          Stop Guessing. Start Scoring.
        </h2>
        <p className="max-w-lg text-lg text-indigo-200/90">
          Upload your resume, get your score, apply the rewrites. Your next
          interview is one analysis away.
        </p>
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-indigo-600 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.3)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_26px_55px_-20px_rgba(0,0,0,0.25)]"
        >
          Analyze Your Resume Free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col items-center gap-4 border-t border-slate-200/50 px-6 py-10">
      <div className="flex items-center gap-2.5">
        <img
          src="/favicon.ico"
          alt="Resumind"
          className="h-7 w-7 rounded-full"
        />
        <span className="text-sm font-semibold text-slate-700">Resumind</span>
      </div>
      <p className="text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Resumind
      </p>
    </footer>
  );
}

/* ─── Page Export ─── */

export default function ResumeAnalyzerPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <FeatureNav />
      <AnalyzerHero />
      <WhatYouGet />
      <ScoringDimensions />
      <RewriteShowcase />
      <AnalysisProcess />
      <PrioritySystem />
      <TargetAudience />
      <AnalyzerFAQ />
      <AnalyzerCTA />
      <Footer />
    </main>
  );
}
