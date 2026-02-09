import type { Metadata } from "next";
import Link from "next/link";
import {
  Send,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  MessageSquare,
  Mail,
  Users,
  Reply,
  Zap,
  Target,
  Copy,
} from "lucide-react";
import ScrollReveal from "@/app/components/ScrollReveal";

/* ─── SEO Metadata ─── */

export const metadata: Metadata = {
  title:
    "AI Cold Outreach Generator — LinkedIn DMs, Emails & More | Resumind",
  description:
    "Generate personalized cold outreach messages for LinkedIn DMs, cold emails, networking requests, and follow-ups. Grounded in your resume, tuned to your tone. Free AI outreach generator.",
  keywords: [
    "cold outreach generator",
    "LinkedIn DM generator",
    "cold email writer",
    "networking message AI",
    "follow-up email generator",
    "job outreach message",
    "AI outreach tool",
    "personalized cold email",
  ],
  openGraph: {
    title: "AI Cold Outreach Generator — Messages That Get Replies",
    description:
      "4 channels. 4 tones. Your real resume. Generate outreach messages that sound human, not automated.",
    url: "/cold-outreach",
    siteName: "Resumind",
    type: "article",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Cold Outreach Generator | Resumind",
    description:
      "LinkedIn DMs, cold emails, networking, and follow-ups. Grounded in your resume. Zero AI slop.",
  },
  alternates: { canonical: "/cold-outreach" },
};

/* ─── JSON-LD Structured Data ─── */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Resumind Cold Outreach Generator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "AI cold outreach generator for LinkedIn DMs, cold emails, networking requests, and follow-ups. Personalized from your resume with 4 tone options.",
  featureList: [
    "LinkedIn DM Generation",
    "Cold Email with Subject Line",
    "Networking Request Messages",
    "Follow-Up Messages",
    "4 Tone Options",
    "Resume-Grounded Content",
    "Regeneration with Feedback",
    "Job Import from URL",
  ],
};

const faqItems = [
  {
    question: "What channels does the outreach generator support?",
    answer:
      "Four channels: LinkedIn DMs (50-100 words), Cold Emails with subject line (150-250 words), Networking Requests (80-120 words), and Follow-Ups (50-80 words). Each channel has tailored length constraints and formatting.",
  },
  {
    question: "Will the messages sound like AI wrote them?",
    answer:
      "No. We ban phrases like \"I am confident that,\" \"I look forward to,\" and dozens of other AI giveaways. The generator avoids em-dashes, repetitive openings, and corporate jargon. Hiring managers see natural, specific writing.",
  },
  {
    question: "How does tone customization work?",
    answer:
      "Choose from four tones: Bold and Direct (confident, skip pleasantries), Warm and Conversational (friendly, genuine curiosity), Professional and Polished (structured, formal but not stiff), or Curious and Humble (question-led, learning mindset).",
  },
  {
    question: "Does it use my actual resume?",
    answer:
      "If you link an existing resume analysis, the AI pulls your real achievements, skills, and metrics. It never invents experience or fabricates numbers. Every claim in the message is grounded in your actual resume content.",
  },
  {
    question: "Can I edit the message after generation?",
    answer:
      "Yes. You can copy the message directly, or regenerate it with specific feedback like \"make it shorter\" or \"emphasize my backend experience.\" The regeneration uses your original context for consistency.",
  },
  {
    question: "How long does generation take?",
    answer:
      "Most messages generate in 5-10 seconds. Pick a channel and tone, add job details, and the AI produces a ready-to-send message tailored to your target role.",
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

const channels = [
  {
    icon: MessageSquare,
    name: "LinkedIn DM",
    wordRange: "50–100 words",
    accent: "#0ea5e9",
    description:
      "Short, punchy direct message for LinkedIn connections. Opens with a hook, leads with value, closes with a clear ask.",
  },
  {
    icon: Mail,
    name: "Cold Email",
    wordRange: "150–250 words",
    accent: "#64748b",
    description:
      "Professional email with AI-generated subject line and structured body. Subject lines capped at 6 words. One clear CTA.",
  },
  {
    icon: Users,
    name: "Networking Request",
    wordRange: "80–120 words",
    accent: "#10b981",
    description:
      "Warm introduction for informational interviews or referrals. Specific about what you want to learn, respectful of their time.",
  },
  {
    icon: Reply,
    name: "Follow-Up",
    wordRange: "50–80 words",
    accent: "#f59e0b",
    description:
      "Brief nudge after an application or initial conversation. References the specific role and adds new info to re-engage.",
  },
];

const processSteps = [
  {
    number: "01",
    icon: Target,
    title: "Pick channel and tone",
    description:
      "Choose from 4 message types and 4 writing styles. Each combination produces a distinct voice calibrated for the situation.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Add context",
    description:
      "Job title, company, recipient name, and optionally the full job description. Import details from a URL or paste them in.",
  },
  {
    number: "03",
    icon: Zap,
    title: "AI generates your message",
    description:
      "Grounded in your resume, tuned to your tone. LinkedIn DMs in 5 seconds. Cold emails with subject lines in 8.",
  },
  {
    number: "04",
    icon: Copy,
    title: "Copy, refine, send",
    description:
      "Copy to clipboard. Or regenerate with feedback like \"make it shorter\" or \"emphasize my leadership experience.\"",
  },
];

/* ─── Section Components ─── */

function FeatureNav() {
  return (
    <header className="px-4 pt-4">
      <nav
        className="landing-nav"
        aria-label="Cold outreach generator navigation"
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
            href="#channels"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Channels
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

function OutreachHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-24 sm:px-10 sm:pt-32 lg:px-16">
      {/* Blob background */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: "55%",
          height: "60%",
          top: "5%",
          left: "-8%",
          background:
            "radial-gradient(ellipse at 40% 50%, rgba(16, 185, 129, 0.15), rgba(6, 95, 70, 0.05) 60%, transparent 80%)",
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
            "radial-gradient(ellipse at 60% 40%, rgba(14, 165, 233, 0.15), rgba(2, 132, 199, 0.05) 60%, transparent 80%)",
          animation: "blobMorph2 22s ease-in-out infinite",
          willChange: "transform, border-radius",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="landing-eyebrow mb-8">
          <Send className="mr-2 h-3.5 w-3.5" />
          AI-Powered Outreach
        </div>

        <h1
          className="text-balance text-4xl font-bold leading-[1.08] text-slate-900 sm:text-5xl lg:text-6xl"
          style={{ animation: "landingFadeUp 0.8s ease-out both" }}
        >
          Cold messages that{" "}
          <span className="text-gradient">actually get replies.</span>
        </h1>

        <p
          className="mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl"
          style={{
            animation: "landingFadeUp 0.8s ease-out both",
            animationDelay: "150ms",
          }}
        >
          LinkedIn DMs, cold emails, networking requests, and follow-ups.
          Each grounded in your resume. Each tuned to your chosen tone.
        </p>

        <div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          style={{
            animation: "landingFadeUp 0.8s ease-out both",
            animationDelay: "300ms",
          }}
        >
          <Link href="/auth" className="primary-button px-8 py-3.5 text-base">
            Start Composing Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#channels"
            className="primary-button primary-button--ghost px-6 py-3 text-base"
          >
            See channels
          </a>
        </div>
      </div>
    </section>
  );
}

function ChannelShowcase() {
  return (
    <section id="channels" className="landing-section">
      <ScrollReveal className="flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <MessageSquare className="mr-2 h-3.5 w-3.5" />
          4 Channels
        </div>
        <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          One tool. Every outreach scenario.
        </h2>
        <p className="max-w-xl text-lg text-slate-600">
          Pick the channel that fits the situation. Word ranges, formatting,
          and AI instructions are all pre-tuned.
        </p>
      </ScrollReveal>

      <div className="bento-grid">
        {channels.map(({ icon: Icon, name, wordRange, accent, description }, i) => (
          <ScrollReveal key={name} delay={i * 80}>
            <div className="bento-cell h-full">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm"
                style={{ background: accent }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  {name}
                </h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                  {wordRange}
                </span>
              </div>
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

function OutreachProcess() {
  return (
    <section id="how" className="landing-section">
      <ScrollReveal className="flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <Target className="mr-2 h-3.5 w-3.5" />
          How It Works
        </div>
        <h2 className="text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          Four steps. Ready to send.
        </h2>
      </ScrollReveal>

      <div className="relative flex w-full flex-col gap-6 lg:flex-row lg:gap-5">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-0 hidden h-px bg-linear-to-r from-transparent via-indigo-200 to-transparent lg:block" />

        {processSteps.map(({ number, icon: Icon, title, description }, i) => (
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

function MockupSection() {
  return (
    <ScrollReveal>
      <div className="landing-section py-16! sm:py-20!">
        <div className="grid w-full items-center gap-10 text-left lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <div className="landing-eyebrow w-fit">
              <Zap className="mr-2 h-3.5 w-3.5" />
              Resume-Grounded
            </div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Your real experience. Their inbox.
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">
              Every claim in the message comes from your resume. No invented
              achievements. No generic filler. The AI maps your strongest
              qualifications to the target role automatically.
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
            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-600">
                  <MessageSquare className="h-3 w-3" />
                  LinkedIn DM
                </span>
                <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600">
                  Bold and Direct
                </span>
              </div>
              <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-sky-50/40 to-white p-4">
                <div className="space-y-2.5 text-xs leading-relaxed text-slate-700">
                  <p>Hi,</p>
                  <p>
                    Your team&apos;s work on real-time recommendations caught
                    my eye. I built a similar pipeline at Scale AI that handles
                    2M events per day with sub-50ms latency.
                  </p>
                  <p>
                    Would love 10 minutes this week to chat about the Senior
                    Backend role. Happy to share how I approached the caching
                    layer.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-medium text-slate-400">
                  Generated from resume context
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

function OutreachFAQ() {
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

function OutreachCTA() {
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
          Stop sending messages into the void
        </h2>
        <p className="max-w-lg text-lg text-indigo-200/90">
          Compose outreach that sounds like you. Grounded in your resume. Tuned
          to your tone. Ready in seconds.
        </p>
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-indigo-600 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.3)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_26px_55px_-20px_rgba(0,0,0,0.25)]"
        >
          Start Composing Free
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

/* ─── Page ─── */

export default function ColdOutreachPage() {
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
      <OutreachHero />
      <ChannelShowcase />
      <OutreachProcess />
      <MockupSection />
      <OutreachFAQ />
      <OutreachCTA />
      <Footer />
    </main>
  );
}
