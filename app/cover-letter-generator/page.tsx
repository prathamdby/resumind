import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  Palette,
  ClipboardList,
  Pencil,
  Download,
  FileText,
  RefreshCw,
  UserRound,
  MessageSquareText,
  Ban,
  Link2,
  BarChart3,
  Briefcase,
  GraduationCap,
  Crown,
  Code,
  Flame,
  Leaf,
} from "lucide-react";
import ScrollReveal from "@/app/components/ScrollReveal";

/* ─── SEO Metadata ─── */

export const metadata: Metadata = {
  title:
    "AI Cover Letter Generator. Tailored Letters in Seconds | Resumind",
  description:
    "Generate tailored cover letters from 6 tone-matched templates. AI writes from your actual resume. No clichés, no AI giveaways. Free cover letter generator.",
  keywords: [
    "cover letter generator",
    "AI cover letter",
    "cover letter templates",
    "professional cover letter",
    "job application letter",
    "cover letter writer",
    "AI cover letter generator",
    "cover letter builder",
  ],
  openGraph: {
    title: "AI Cover Letter Generator. Tailored Letters in Seconds",
    description:
      "Six templates. Your real resume. Zero clichés. Generate a cover letter that sounds like you wrote it.",
    url: "/cover-letter-generator",
    siteName: "Resumind",
    type: "article",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Cover Letter Generator | Resumind",
    description:
      "Generate tailored cover letters from your resume. 6 templates. No AI slop.",
  },
  alternates: { canonical: "/cover-letter-generator" },
};

/* ─── JSON-LD Structured Data ─── */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Resumind Cover Letter Generator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "AI cover letter generator with 6 tone-matched templates. Generates tailored letters from your resume and job description in seconds.",
  featureList: [
    "6 Tone-Matched Templates",
    "Resume-Integrated Generation",
    "50+ Banned Cliché Phrases",
    "Section-by-Section Regeneration",
    "Live Preview Editor",
    "PDF Export",
    "Job Import from URL",
    "Auto-Save with Conflict Detection",
  ],
};

const faqItems = [
  {
    question: "What is an AI cover letter generator?",
    answer:
      "An AI cover letter generator creates customized cover letters based on your resume and a specific job description. Resumind goes further. It offers 6 tone-matched templates, bans 50+ overused phrases, and uses only your real experience. The result reads like something you wrote on your best day.",
  },
  {
    question: "Will my cover letter sound like AI wrote it?",
    answer:
      "No. We explicitly ban phrases like \"I am writing to express,\" \"I believe I would be a great fit,\" and 50+ other AI giveaways. The generator also avoids em-dashes, semicolons, repetitive openings, and hedging language. Hiring managers see natural, specific writing, not template filler.",
  },
  {
    question: "How many templates are available?",
    answer:
      "Six templates across five categories: Modern Professional, Classic Formal, Bold Creative, Technical Deep-Dive, Executive Leadership, and Fresh Start. Each template has a distinct tone calibrated for its audience, from punchy and direct to strategic and authoritative.",
  },
  {
    question: "Can I edit the letter after it's generated?",
    answer:
      "Yes. The full editor lets you modify every section, opening, body paragraphs, and closing. You can also regenerate individual sections with optional feedback like \"make the opening more specific to the role.\" Changes auto-save with conflict detection.",
  },
  {
    question: "Does it use my actual resume?",
    answer:
      "If you link an existing resume analysis, the AI pulls your real achievements, skills, and metrics. It never invents experience, fabricates numbers, or adds skills you don't have. Every claim in the letter is grounded in your actual resume content.",
  },
  {
    question: "How long does generation take?",
    answer:
      "Most cover letters generate in 5–10 seconds. You pick a template, fill in job details (or import them from a URL), and the AI produces a complete letter with opening, 2–3 body paragraphs, and closing.",
  },
  {
    question: "Can I export to PDF?",
    answer:
      "Yes. One-click PDF export preserves your chosen template's formatting, accent colors, header layout, and typography. You can also copy the full letter to clipboard as plain text for pasting into application forms.",
  },
  {
    question: "Is there a word limit?",
    answer:
      "The generator targets under 350 words total, the sweet spot for cover letters. Body paragraphs are 3–5 sentences each. Long enough to be substantive, short enough to respect the reader's time.",
  },
  {
    question: "What makes this different from ChatGPT?",
    answer:
      "ChatGPT gives you one generic output with no structure. Resumind offers 6 templates with distinct tones, integrates your actual resume data, bans 50+ cliché phrases, provides a live-preview editor, lets you regenerate sections with feedback, and exports to PDF. It's a purpose-built tool, not a general chatbot.",
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

const templates = [
  {
    icon: Briefcase,
    name: "Modern Professional",
    category: "Professional",
    accent: "#4c57e9",
    tone: "Confident and direct. Short, punchy sentences that lead with impact instead of backstory. For roles where clarity beats formality.",
  },
  {
    icon: FileText,
    name: "Classic Formal",
    category: "Professional",
    accent: "#475569",
    tone: "Traditional and polished. Complete sentences, formal structure, and respect for the reader's time. The safe choice that never misses.",
  },
  {
    icon: Flame,
    name: "Bold Creative",
    category: "Creative",
    accent: "#e11d48",
    tone: "Energetic and personality-forward. Vivid language that lets passion come through without crossing into unprofessional. Built to be memorable.",
  },
  {
    icon: Code,
    name: "Technical Deep-Dive",
    category: "Technical",
    accent: "#0d9488",
    tone: "Precise and metrics-led. Opens with measurable outcomes and specific technologies. Quantifies wherever your resume supports it.",
  },
  {
    icon: Crown,
    name: "Executive Leadership",
    category: "Executive",
    accent: "#1e293b",
    tone: "Strategic authority. Focused on leadership impact, business outcomes, and vision. Measured, confident language befitting a senior leader.",
  },
  {
    icon: Leaf,
    name: "Fresh Start",
    category: "Entry-level",
    accent: "#059669",
    tone: "Genuine enthusiasm with a growth mindset. Emphasizes transferable skills, eagerness to learn, and relevant projects. Sincere, not desperate.",
  },
];

const processSteps = [
  {
    number: "01",
    icon: Palette,
    title: "Pick a template",
    description:
      "Choose from 6 tone-matched templates. Each one is calibrated for a different audience and writing style.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Add job details",
    description:
      "Paste the job description or import it from a URL. Optionally link an existing resume for richer context.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "AI generates your letter",
    description:
      "Opening, 2–3 body paragraphs, and closing, tailored to the role and written in your chosen tone. 5–10 seconds.",
  },
  {
    number: "04",
    icon: Pencil,
    title: "Edit, regenerate, and export",
    description:
      "Fine-tune any section. Regenerate with feedback. Switch templates. Export to PDF or copy to clipboard when ready.",
  },
];

const bannedPhrases = [
  "I am writing to express",
  "I believe I would be a great fit",
  "I would love the opportunity",
  "Please find attached",
  "I am confident that",
  "Thank you for your consideration",
  "I am excited to apply",
  "Passionate and driven professional",
];

const personas = [
  {
    icon: GraduationCap,
    title: "First-Time Applicants",
    description:
      "Staring at a blank page is the worst part of job hunting. Pick a template, add the job description, and get a letter that sounds like you, in seconds.",
  },
  {
    icon: Briefcase,
    title: "Experienced Professionals",
    description:
      "You have the experience. You just hate writing about it. The generator pulls from your real resume and structures it into a letter worth reading.",
  },
  {
    icon: RefreshCw,
    title: "Career Changers",
    description:
      "Reframing your story for a new industry is hard. The AI emphasizes transferable skills and maps your experience to what the new role actually needs.",
  },
];

/* ─── Section Components ─── */

function FeatureNav() {
  return (
    <header className="px-4 pt-4">
      <nav
        className="landing-nav"
        aria-label="Cover letter generator navigation"
      >
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
            href="#templates"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Templates
          </a>
          <a
            href="#how"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            How It Works
          </a>
          <a
            href="#voice"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Natural Voice
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

function GeneratorHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-24 sm:px-10 sm:pt-32 lg:px-16">
      <HeroBlobBackground />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="landing-eyebrow mb-8">
          <Mail className="mr-2 h-3.5 w-3.5" />
          Cover Letter Generator
        </div>

        <h1
          className="text-balance text-4xl font-bold leading-[1.08] text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl"
          style={{ animation: "landingFadeUp 0.8s ease-out both" }}
        >
          AI Cover Letter Generator That{" "}
          <span className="text-gradient">Sounds Like You Wrote It</span>
        </h1>

        <p
          className="mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl"
          style={{
            animation: "landingFadeUp 0.8s ease-out both",
            animationDelay: "150ms",
          }}
        >
          Pick a template. Paste the job description. Get a tailored cover
          letter in seconds, written from your real resume, with zero clichés
          and zero AI giveaways.
        </p>

        <div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          style={{
            animation: "landingFadeUp 0.8s ease-out both",
            animationDelay: "300ms",
          }}
        >
          <Link href="/auth" className="primary-button px-8 py-3.5 text-base">
            Generate a Cover Letter Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#templates"
            className="primary-button primary-button--ghost px-6 py-3 text-base"
          >
            See templates
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
            What You Get From Every Letter
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-slate-600">
            <p>
              Every cover letter is generated from one of six tone-matched
              templates, Modern Professional, Classic Formal, Bold Creative,
              Technical Deep-Dive, Executive Leadership, and Fresh Start. Each
              template produces a distinct voice calibrated for its audience, so
              a startup application never reads like a corporate one.
            </p>
            <p>
              The AI writes from your actual resume and the specific job
              description. It pulls real achievements, real skills, and real
              metrics. Nothing invented. Over 50 overused phrases are banned
              outright, including &ldquo;I am writing to express&rdquo; and
              &ldquo;I believe I would be a great fit.&rdquo; What you get reads
              like something you wrote on your best day.
            </p>
            <p>
              After generation, a full editor lets you tweak every section,
              opening, body paragraphs, and closing. You can regenerate any
              section with optional feedback, switch templates with one click,
              and export the final letter as a formatted PDF or copy it to
              clipboard. Everything auto-saves.
            </p>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

function TemplateShowcase() {
  return (
    <section id="templates" className="landing-section">
      <ScrollReveal className="flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <Palette className="mr-2 h-3.5 w-3.5" />
          Six Templates
        </div>
        <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          A Tone for Every Role
        </h2>
        <p className="max-w-xl text-lg text-slate-600">
          Each template produces a distinct voice. Pick the one that fits.
        </p>
      </ScrollReveal>

      <div className="bento-grid">
        {templates.map(({ icon: Icon, name, category, accent, tone }, i) => (
          <ScrollReveal key={name} delay={i * 80}>
            <div className="bento-cell h-full">
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                  style={{ background: accent }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className="shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    borderColor: `${accent}30`,
                    color: accent,
                    backgroundColor: `${accent}10`,
                  }}
                >
                  {category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{tone}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function GenerationProcess() {
  return (
    <section id="how" className="landing-section">
      <ScrollReveal className="flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <Sparkles className="mr-2 h-3.5 w-3.5" />
          How It Works
        </div>
        <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          Four Steps. Under 10 Seconds.
        </h2>
      </ScrollReveal>

      <div className="mx-auto w-full max-w-2xl">
        {processSteps.map(({ number, icon: Icon, title, description }, i) => (
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
              <div
                className={`${i === processSteps.length - 1 ? "pb-0" : "pb-10"}`}
              >
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
        ))}
      </div>
    </section>
  );
}

function PreviewShowcase() {
  return (
    <ScrollReveal>
      <section className="landing-section py-16! sm:py-20!">
        <div className="grid w-full items-center gap-10 text-left lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <div className="landing-eyebrow w-fit">
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Full Editor
            </div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Edit Everything. Regenerate Anything.
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">
              Every section is editable, opening, body paragraphs, and closing.
              Regenerate any section with optional feedback like &ldquo;make the
              opening more specific to the product role.&rdquo; Switch templates
              to change the visual style without losing your edits.
            </p>
            <div className="flex flex-col gap-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-indigo-500" />
                One-click PDF export with template formatting
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-indigo-500" />
                Regenerate sections with specific feedback
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                Auto-save with conflict detection
              </div>
            </div>
            <Link
              href="/auth"
              className="primary-button mt-2 w-fit px-6 py-3 text-sm"
            >
              Try the editor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mockup-frame">
            <div className="mockup-chrome">
              <div className="mockup-dot bg-rose-300" />
              <div className="mockup-dot bg-amber-300" />
              <div className="mockup-dot bg-emerald-300" />
              <div className="ml-3 flex-1 rounded-full bg-slate-100 py-2" />
            </div>
            <div className="flex min-h-[320px]">
              <div className="hidden w-28 shrink-0 space-y-2 border-r border-slate-100 bg-slate-50/50 p-3 sm:block">
                {[
                  { name: "Modern", color: "#4c57e9", active: true },
                  { name: "Classic", color: "#475569", active: false },
                  { name: "Creative", color: "#e11d48", active: false },
                  { name: "Technical", color: "#0d9488", active: false },
                  { name: "Executive", color: "#1e293b", active: false },
                  { name: "Fresh", color: "#059669", active: false },
                ].map(({ name, color, active }) => (
                  <div
                    key={name}
                    className={`rounded-lg border px-2 py-2 text-[10px] font-medium ${
                      active
                        ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                        : "border-slate-100 bg-white text-slate-500"
                    }`}
                  >
                    <div
                      className="mb-1.5 h-1 w-6 rounded-full"
                      style={{ background: color }}
                    />
                    {name}
                  </div>
                ))}
              </div>
              <div className="flex-1 p-4 sm:p-5">
                <div
                  className="mb-3 h-1 w-full rounded-full"
                  style={{ background: "#4c57e9" }}
                />
                <div className="flex items-baseline justify-between">
                  <div className="h-2.5 w-28 rounded-full bg-slate-200" />
                  <div className="h-2 w-16 rounded-full bg-slate-100" />
                </div>
                <div className="mt-1 flex gap-4">
                  <div className="h-2 w-24 rounded-full bg-slate-100" />
                  <div className="h-2 w-20 rounded-full bg-slate-100" />
                </div>
                <div className="mt-4 h-2 w-20 rounded-full bg-slate-100" />
                <div className="mt-1 h-2 w-32 rounded-full bg-slate-100" />
                <div className="mt-5 space-y-2">
                  <div className="h-2 w-full rounded-full bg-slate-100" />
                  <div className="h-2 w-11/12 rounded-full bg-slate-100" />
                  <div className="h-2 w-10/12 rounded-full bg-slate-100" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-2 w-full rounded-full bg-slate-100" />
                  <div className="h-2 w-9/12 rounded-full bg-slate-100" />
                  <div className="h-2 w-11/12 rounded-full bg-slate-100" />
                  <div className="h-2 w-7/12 rounded-full bg-slate-100" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-2 w-full rounded-full bg-slate-100" />
                  <div className="h-2 w-8/12 rounded-full bg-slate-100" />
                </div>
                <div className="mt-5 h-2 w-24 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

function NaturalVoice() {
  return (
    <section id="voice" className="landing-section">
      <ScrollReveal className="flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <Ban className="mr-2 h-3.5 w-3.5" />
          Natural Voice
        </div>
        <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          50+ Phrases We Ban So Your Letter Sounds Human
        </h2>
        <p className="max-w-xl text-lg text-slate-600">
          If a phrase screams &ldquo;AI wrote this,&rdquo; we block it before it
          reaches your letter.
        </p>
      </ScrollReveal>

      <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2">
        {bannedPhrases.map((phrase, i) => (
          <ScrollReveal key={phrase} delay={i * 60}>
            <div className="flex items-center gap-3 rounded-2xl border border-rose-100/60 bg-rose-50/40 px-4 py-3 backdrop-blur">
              <Ban className="h-4 w-4 shrink-0 text-rose-400" />
              <span className="text-sm text-rose-700/80 line-through">
                {phrase}
              </span>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={200}>
        <div className="mx-auto max-w-2xl text-left">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">
            What Goes In Instead
          </h3>
          <div className="space-y-3 text-sm leading-relaxed text-slate-600">
            <p>
              Concrete details from your resume. If you grew revenue, the letter
              says by how much. If you led a team, it says how many people and
              what they shipped. No filler adjectives. No hedging language.
            </p>
            <p>
              Sentence structure varies naturally. Short sentences after long
              ones, direct statements mixed with context. The AI also avoids
              em-dashes, semicolons, list-like rhythms, and repetitive openings
              that signal machine-generated text to experienced readers.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function ResumeIntegration() {
  return (
    <ScrollReveal>
      <section className="landing-section py-16! sm:py-20!">
        <div className="grid w-full items-center gap-10 text-left lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="mockup-frame">
              <div className="mockup-chrome">
                <div className="mockup-dot bg-rose-300" />
                <div className="mockup-dot bg-amber-300" />
                <div className="mockup-dot bg-emerald-300" />
                <div className="ml-3 flex-1 rounded-full bg-slate-100 py-2" />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 text-white">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Senior Product Designer
                      </p>
                      <p className="text-xs text-slate-500">
                        Score: 82/100 &middot; 10 rewrites
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Linked
                    </span>
                  </div>

                  <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Sparkles className="h-3 w-3 text-indigo-400" />
                      AI pulls from your resume:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Led 12-person team",
                        "Shipped 3 products",
                        "Figma + Framer",
                        "40% conversion lift",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-indigo-100 bg-white px-2.5 py-0.5 text-[10px] font-medium text-indigo-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                    <p className="text-xs leading-relaxed text-emerald-700/80">
                      &ldquo;At Acme I led a 12-person design team that shipped
                      3 products in 8 months, including a checkout redesign that
                      lifted conversion by 40%.&rdquo;
                    </p>
                    <p className="mt-1.5 text-[10px] font-medium text-emerald-600">
                      Generated from linked resume
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 flex flex-col gap-5 lg:order-2">
            <div className="landing-eyebrow w-fit">
              <Link2 className="mr-2 h-3.5 w-3.5" />
              Resume Integration
            </div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Your Resume Feeds Every Sentence
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">
              Link an existing resume analysis and the AI pulls your real
              achievements, skills, and metrics into the letter. No fabrication.
              No generic filler. Every claim is grounded in what you actually
              did.
            </p>
            <Link
              href="/resume-analyzer"
              className="primary-button mt-2 w-fit px-6 py-3 text-sm"
            >
              Learn about the analyzer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

function TargetAudience() {
  return (
    <section className="landing-section">
      <ScrollReveal className="flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <UserRound className="mr-2 h-3.5 w-3.5" />
          Who It&apos;s For
        </div>
        <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          For Everyone Who Hates Writing Cover Letters
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

function GeneratorFAQ() {
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

function GeneratorCTA() {
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
          Your Next Application Deserves More Than a Template
        </h2>
        <p className="max-w-lg text-lg text-indigo-200/90">
          Pick a tone. Add the job. Get a letter that sounds like you. It takes
          10 seconds.
        </p>
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-indigo-600 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.3)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_26px_55px_-20px_rgba(0,0,0,0.25)]"
        >
          Generate a Cover Letter Free
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

export default function CoverLetterGeneratorPage() {
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
      <GeneratorHero />
      <WhatYouGet />
      <TemplateShowcase />
      <GenerationProcess />
      <PreviewShowcase />
      <NaturalVoice />
      <ResumeIntegration />
      <TargetAudience />
      <GeneratorFAQ />
      <GeneratorCTA />
      <Footer />
    </main>
  );
}
