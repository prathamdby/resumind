import type { Metadata } from "next";
import Link from "next/link";
import {
  FileSearch,
  ScanSearch,
  Pencil,
  Mail,
  MessageSquare,
  Link as LinkIcon,
  Upload,
  Sparkles,
  TrendingUp,
  Star,
  ChevronDown,
  Zap,
  Timer,
  BarChart3,
  ArrowRight,
  Users,
  Target,
} from "lucide-react";
import ScrollReveal from "@/app/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Resumind — AI Resume Analyzer & Cover Letter Generator",
  description:
    "Get your resume scored across 5 dimensions, rewritten line-by-line, and optimized for ATS in under 60 seconds. Free AI-powered resume feedback.",
  openGraph: {
    title: "Resumind — AI Resume Analyzer & Cover Letter Generator",
    description:
      "Score, rewrite, and optimize your resume with AI. Land more interviews.",
    url: "/",
    siteName: "Resumind",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resumind — AI Resume Analyzer",
    description:
      "Score, rewrite, and optimize your resume with AI. Land more interviews.",
  },
  alternates: { canonical: "/" },
};

function LandingNav() {
  return (
    <header className="px-4 pt-4">
      <nav className="landing-nav" aria-label="Landing navigation">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Resumind home"
        >
          <img
            src="/favicon.ico"
            alt="Resumind logo"
            className="h-10 w-10 rounded-full"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-xs font-semibold uppercase tracking-[0.38em] text-slate-500">
              Resumind
            </span>
            <span className="hidden text-sm font-medium text-slate-900 sm:block">
              AI resume insights
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex" role="navigation">
          <a
            href="#features"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Features
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

        <div className="flex items-center gap-3">
          <Link
            href="/auth"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline-flex"
          >
            Sign In
          </Link>
          <Link href="/auth" className="primary-button px-5 py-2.5 text-sm">
            Get Started
          </Link>
        </div>
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
            "radial-gradient(ellipse at 40% 50%, rgba(111, 122, 255, 0.2), rgba(76, 87, 233, 0.08) 60%, transparent 80%)",
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
            "radial-gradient(ellipse at 60% 40%, rgba(250, 113, 133, 0.18), rgba(244, 63, 94, 0.06) 60%, transparent 80%)",
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
            "radial-gradient(ellipse at 50% 60%, rgba(251, 191, 146, 0.15), rgba(251, 146, 60, 0.05) 60%, transparent 80%)",
          animation: "blobMorph3 25s ease-in-out infinite",
          willChange: "transform, border-radius",
        }}
      />
    </>
  );
}

function HeroMockup() {
  return (
    <div
      className="mockup-frame relative mx-auto mt-12 w-full max-w-2xl sm:mt-16"
      style={{ animation: "floatMockup 6s ease-in-out infinite" }}
    >
      <div className="mockup-chrome">
        <div className="mockup-dot bg-rose-300" />
        <div className="mockup-dot bg-amber-300" />
        <div className="mockup-dot bg-emerald-300" />
        <div className="ml-3 h-5 flex-1 rounded-full bg-slate-100" />
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center sm:h-32 sm:w-32">
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
                  stroke="url(#scoreGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${0.82 * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                />
                <defs>
                  <linearGradient
                    id="scoreGradient"
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

            <div className="flex flex-1 flex-wrap gap-2">
              {[
                {
                  label: "ATS",
                  score: 78,
                  color: "bg-amber-100/80 text-amber-700",
                },
                {
                  label: "Content",
                  score: 85,
                  color: "bg-emerald-100/80 text-emerald-700",
                },
                {
                  label: "Structure",
                  score: 80,
                  color: "bg-emerald-100/80 text-emerald-700",
                },
                {
                  label: "Skills",
                  score: 84,
                  color: "bg-emerald-100/80 text-emerald-700",
                },
                {
                  label: "Tone",
                  score: 79,
                  color: "bg-amber-100/80 text-amber-700",
                },
              ].map(({ label, score, color }) => (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${color}`}
                >
                  {label}
                  <span className="font-bold">{score}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Strong action verbs
                </p>
                <p className="mt-0.5 text-xs text-emerald-700/80">
                  Your bullet points lead with impactful verbs like
                  &ldquo;orchestrated&rdquo; and &ldquo;shipped&rdquo;
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-3.5 py-2">
              <Pencil className="h-3.5 w-3.5 text-indigo-500" />
              <span className="text-xs font-medium text-slate-600">
                Line improvement
              </span>
              <span className="ml-auto rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                HIGH
              </span>
            </div>
            <div className="bg-rose-50/60 px-3.5 py-2.5">
              <p className="font-mono text-xs text-rose-700/80">
                <span className="mr-2 text-rose-400">−</span>
                Responsible for managing the engineering team
              </p>
            </div>
            <div className="bg-emerald-50/60 px-3.5 py-2.5">
              <p className="font-mono text-xs text-emerald-700/80">
                <span className="mr-2 text-emerald-400">+</span>
                Led a 12-person engineering team that shipped 3 products in 8
                months
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-24 sm:px-10 sm:pt-32 lg:px-16">
      <HeroBlobBackground />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="landing-eyebrow mb-8">
          <Sparkles className="mr-2 h-3.5 w-3.5" />
          AI-Powered Resume Intelligence
        </div>

        <h1
          className="text-balance text-4xl font-bold leading-[1.08] text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl"
          style={{
            animation: "landingFadeUp 0.8s ease-out both",
          }}
        >
          Your resume is losing you interviews.{" "}
          <span className="text-gradient">We fix that in 60 seconds.</span>
        </h1>

        <p
          className="mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl"
          style={{
            animation: "landingFadeUp 0.8s ease-out both",
            animationDelay: "150ms",
          }}
        >
          AI analysis that scores, rewrites, and optimizes your resume for the
          exact job you want. No guesswork. No generic advice.
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

        <div
          style={{
            animation: "landingScaleIn 1s ease-out both",
            animationDelay: "500ms",
          }}
        >
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}

const trustStats = [
  { value: "10,000+", label: "Resumes Analyzed", icon: Users },
  { value: "87pts", label: "Avg Score Jump", icon: TrendingUp },
  { value: "<60s", label: "Per Analysis", icon: Timer },
];

function TrustBar() {
  return (
    <ScrollReveal>
      <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 pb-8 sm:px-10">
        <div className="flex w-full flex-col items-center justify-center gap-4 rounded-full border border-white/40 bg-white/80 px-6 py-4 shadow-(--shadow-surface) backdrop-blur-md sm:flex-row sm:gap-8 md:gap-12">
          {trustStats.map(({ value, label, icon: Icon }, i) => (
            <div key={label} className="flex items-center gap-3">
              {i > 0 && (
                <div className="hidden h-8 w-px bg-slate-200/60 sm:block" />
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-slate-900 sm:text-xl">
                    {value}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}

const features = [
  {
    icon: FileSearch,
    title: "AI Resume Analysis",
    description:
      "Upload a PDF. Get scored across 5 dimensions in under 60 seconds. No templates, no fluff.",
    gradient: "from-indigo-500 to-blue-500",
    href: "/resume-analyzer",
  },
  {
    icon: ScanSearch,
    title: "ATS Optimization",
    description:
      "See what automated parsers see. Hit 80+ to land in the recruiter's yes pile.",
    gradient: "from-violet-500 to-indigo-500",
  },
  {
    icon: Pencil,
    title: "Line-by-Line Rewrites",
    description:
      "Before/after diffs for every bullet. Copy one. Copy all. Your resume, upgraded.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Mail,
    title: "Cover Letter Generator",
    description:
      "Pick a tone. Import the job listing. Get a letter that sounds like you wrote it.",
    gradient: "from-amber-500 to-orange-500",
    href: "/cover-letter-generator",
  },
  {
    icon: MessageSquare,
    title: "Cold Outreach DMs",
    description:
      "LinkedIn messages built from your actual resume. Specific. Grounded. Not cringe.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: LinkIcon,
    title: "Smart Job Import",
    description:
      "Paste a URL or drop a PDF. Company, title, requirements \u2014 extracted in seconds.",
    gradient: "from-cyan-500 to-blue-500",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="landing-section">
      <ScrollReveal className="flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <Zap className="mr-2 h-3.5 w-3.5" />
          Features
        </div>
        <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          Everything you need to land the interview
        </h2>
        <p className="max-w-xl text-lg text-slate-600">
          Six tools that turn resume anxiety into interview confidence.
        </p>
      </ScrollReveal>

      <div className="bento-grid">
        {features.map(({ icon: Icon, title, description, gradient, href }, i) => {
          const card = (
            <div className="bento-cell h-full">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${gradient} text-white shadow-sm`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {description}
              </p>
              {href && (
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-indigo-500">
                  Learn more <ArrowRight className="h-3 w-3" />
                </span>
              )}
            </div>
          );

          return (
            <ScrollReveal key={title} delay={i * 80}>
              {href ? (
                <Link href={href} className="block h-full no-underline">
                  {card}
                </Link>
              ) : (
                card
              )}
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload",
    description:
      "Drop your resume PDF and paste the job description. That's it.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Analyze",
    description:
      "AI evaluates ATS fit, tone, content quality, structure, and skills match. Scores everything 0\u2013100.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Improve",
    description:
      "Get 8\u201312 ready-to-paste rewrites. Apply them. Re-analyze. Watch your score climb.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="landing-section">
      <ScrollReveal className="flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <Target className="mr-2 h-3.5 w-3.5" />
          How It Works
        </div>
        <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          Three steps. Zero guesswork.
        </h2>
      </ScrollReveal>

      <div className="relative flex w-full flex-col gap-6 lg:flex-row lg:gap-5">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-0 hidden h-px bg-linear-to-r from-transparent via-indigo-200 to-transparent lg:block" />

        {steps.map(({ number, icon: Icon, title, description }, i) => (
          <ScrollReveal key={number} delay={i * 120} className="flex-1">
            <div className="step-card relative z-10 h-full">
              <span className="bg-linear-to-r from-[#AB8C95] via-[#000000] to-[#8E97C5] bg-clip-text text-4xl font-bold text-transparent">
                {number}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-indigo-100 to-pink-100 text-indigo-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
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

function ShowcaseScoreDashboard() {
  return (
    <ScrollReveal>
      <div className="landing-section py-16! sm:py-20!">
        <div className="grid w-full items-center gap-10 text-left lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <div className="landing-eyebrow w-fit">
              <BarChart3 className="mr-2 h-3.5 w-3.5" />
              Instant Feedback
            </div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Know exactly where you stand
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">
              Five scoring dimensions. One overall score. Zero ambiguity about
              what to fix first. Every tip is specific, actionable, and grounded
              in what your resume actually says.
            </p>
            <Link
              href="/auth"
              className="primary-button mt-2 w-fit px-6 py-3 text-sm"
            >
              Try it free
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
            <div className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg
                    viewBox="0 0 120 120"
                    className="h-full w-full -rotate-90"
                  >
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
                      stroke="url(#sg2)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${0.82 * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                    />
                    <defs>
                      <linearGradient
                        id="sg2"
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
                    <span className="text-2xl font-bold text-slate-900">
                      82
                    </span>
                    <span className="text-[10px] text-slate-500">/100</span>
                  </div>
                </div>
                <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3">
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
                      label: "Skills",
                      score: 84,
                      bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
                    },
                    {
                      label: "Tone",
                      score: 79,
                      bg: "bg-amber-50 text-amber-700 border-amber-100",
                    },
                  ].map(({ label, score, bg }) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 ${bg}`}
                    >
                      <span className="text-xs font-medium">{label}</span>
                      <span className="text-sm font-bold">{score}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  {
                    type: "good",
                    text: "Strong quantified achievements in experience section",
                  },
                  {
                    type: "improve",
                    text: "Add 2-3 more keywords from job description to skills",
                  },
                ].map(({ type, text }) => (
                  <div
                    key={text}
                    className={`flex items-start gap-2 rounded-lg p-2.5 ${
                      type === "good"
                        ? "bg-emerald-50/60 text-emerald-700"
                        : "bg-amber-50/60 text-amber-700"
                    }`}
                  >
                    <span className="mt-0.5 text-xs font-bold uppercase">
                      {type === "good" ? "✓" : "→"}
                    </span>
                    <span className="text-xs">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

function ShowcaseDiffView() {
  return (
    <ScrollReveal>
      <div className="landing-section py-16! sm:py-20!">
        <div className="grid w-full items-center gap-10 text-left lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
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
                      <span className="mr-2 text-rose-400">−</span>
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
                      <span className="mr-2 text-rose-400">−</span>
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
              </div>
            </div>
          </div>

          <div className="order-1 flex flex-col gap-5 lg:order-2">
            <div className="landing-eyebrow w-fit">
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Surgical Precision
            </div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Before and after. Every line.
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">
              See the exact words to change. Copy the rewrite. One click. Each
              suggestion is tagged by priority and category so you know where to
              focus first.
            </p>
            <Link
              href="/auth"
              className="primary-button mt-2 w-fit px-6 py-3 text-sm"
            >
              See your rewrites
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

function ShowcaseCoverLetters() {
  return (
    <ScrollReveal>
      <div className="landing-section py-16! sm:py-20!">
        <div className="grid w-full items-center gap-10 text-left lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <div className="landing-eyebrow w-fit">
              <Mail className="mr-2 h-3.5 w-3.5" />
              Cover Letters
            </div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Letters that sound human
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">
              Choose a template. Import job details. Get a cover letter in
              minutes, not hours. Every letter bans 50+ overused phrases and
              uses your real experience.
            </p>
            <Link
              href="/auth"
              className="primary-button mt-2 w-fit px-6 py-3 text-sm"
            >
              Generate a letter
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
            <div className="flex min-h-[280px]">
              <div className="hidden w-32 shrink-0 space-y-2 border-r border-slate-100 bg-slate-50/50 p-3 sm:block">
                {["Professional", "Creative", "Technical", "Executive"].map(
                  (name, i) => (
                    <div
                      key={name}
                      className={`rounded-lg border px-2.5 py-2 text-[10px] font-medium ${
                        i === 0
                          ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                          : "border-slate-100 bg-white text-slate-500"
                      }`}
                    >
                      {name}
                    </div>
                  ),
                )}
              </div>
              <div className="flex-1 space-y-3 p-4 sm:p-5">
                <div className="h-2 w-24 rounded-full bg-indigo-100" />
                <div className="h-2 w-16 rounded-full bg-slate-100" />
                <div className="mt-4 space-y-2">
                  <div className="h-2 w-full rounded-full bg-slate-100" />
                  <div className="h-2 w-11/12 rounded-full bg-slate-100" />
                  <div className="h-2 w-10/12 rounded-full bg-slate-100" />
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-full rounded-full bg-slate-100" />
                  <div className="h-2 w-9/12 rounded-full bg-slate-100" />
                  <div className="h-2 w-11/12 rounded-full bg-slate-100" />
                  <div className="h-2 w-7/12 rounded-full bg-slate-100" />
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-full rounded-full bg-slate-100" />
                  <div className="h-2 w-8/12 rounded-full bg-slate-100" />
                </div>
                <div className="mt-4 h-2 w-20 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

const impactStats = [
  { value: "<60s", label: "Average analysis time" },
  { value: "8\u201312", label: "Rewrites per resume" },
  { value: "5", label: "Scoring dimensions" },
];

function StatsBand() {
  return (
    <ScrollReveal>
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-20">
        <div className="flex flex-col items-center justify-center gap-10 rounded-card border border-white/40 bg-white/90 px-8 py-12 shadow-(--shadow-surface) backdrop-blur-md sm:flex-row sm:gap-0 sm:divide-x sm:divide-slate-200/60 sm:py-14">
          {impactStats.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-1 flex-col items-center gap-2 px-6"
            >
              <span className="stat-number bg-linear-to-r from-[#AB8C95] via-[#000000] to-[#8E97C5] bg-clip-text text-transparent">
                {value}
              </span>
              <span className="text-sm font-medium text-slate-500">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}

const testimonials = [
  {
    quote:
      "I\u2019d been sending the same resume for months. Resumind showed me my ATS score was 34. After applying the rewrites, I hit 89 and got three callbacks in a week.",
    name: "S. Mitchell",
    title: "Product Designer",
    initials: "SM",
  },
  {
    quote:
      "The line-by-line diffs are addictive. I copied every suggestion, re-uploaded, and watched my score jump 22 points. Best 60 seconds I\u2019ve ever spent.",
    name: "A. Kumar",
    title: "Software Engineer",
    initials: "AK",
  },
  {
    quote:
      "I used the cover letter generator for a startup role. The hiring manager literally said \u2018your letter stood out.\u2019 That\u2019s never happened before.",
    name: "R. Patel",
    title: "Marketing Manager",
    initials: "RP",
  },
];

function Testimonials() {
  return (
    <section className="landing-section">
      <ScrollReveal className="flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <Star className="mr-2 h-3.5 w-3.5" />
          Wall of Love
        </div>
        <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          Job seekers who stopped guessing
        </h2>
      </ScrollReveal>

      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map(({ quote, name, title, initials }, i) => (
          <ScrollReveal key={name} delay={i * 100}>
            <div className="testimonial-card h-full">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-slate-700">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-400 to-pink-400 text-sm font-semibold text-white">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-500">{title}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

const faqItems = [
  {
    question: "Is my resume data safe?",
    answer:
      "Your resume is processed in memory and never stored beyond the analysis. We use encrypted connections and don\u2019t share data with third parties.",
  },
  {
    question: "How accurate is the ATS score?",
    answer:
      "We simulate how major applicant tracking systems parse resumes. The score reflects formatting, keyword density, and structural compatibility with automated screening tools.",
  },
  {
    question: "Can I analyze the same resume multiple times?",
    answer:
      "Yes. Upload after each round of edits to track your score improvement over time. Most users see a 15\u201325 point jump after applying the first round of rewrites.",
  },
  {
    question: "What makes the cover letters sound human?",
    answer:
      "We ban 50+ overused phrases like \u201CI am writing to express\u201D and enforce varied sentence structure, concrete details from your resume, and natural cadence. No template fluff.",
  },
  {
    question: "Is there a limit on analyses?",
    answer:
      "Rate limits exist to maintain quality \u2014 2 analyses per minute. There\u2019s no hard cap on total usage. Analyze as many resumes as you need.",
  },
];

function FAQ() {
  return (
    <section id="faq" className="landing-section">
      <ScrollReveal className="flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <MessageSquare className="mr-2 h-3.5 w-3.5" />
          Questions
        </div>
        <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          Your questions, answered
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

function FinalCTA() {
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
          Your next interview starts with a better resume
        </h2>
        <p className="max-w-lg text-lg text-indigo-200/90">
          Stop sending resumes into the void. Get scored, get rewritten, get
          hired.
        </p>
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-indigo-600 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.3)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_26px_55px_-20px_rgba(0,0,0,0.25)]"
        >
          Get Started Free
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

export default function LandingPage() {
  return (
    <main>
      <LandingNav />
      <HeroSection />
      <TrustBar />
      <FeaturesSection />
      <HowItWorks />
      <ShowcaseScoreDashboard />
      <ShowcaseDiffView />
      <ShowcaseCoverLetters />
      <StatsBand />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
