import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import ResumeCard from "@/app/components/ResumeCard";
import WipeDataButton from "@/app/components/WipeDataButton";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import type { Feedback } from "@/types";
import {
  TrendingUp,
  Layers,
  Sparkles,
  ShieldCheck,
  ScanSearch,
  Zap,
  FileText,
  CheckCircle2,
  History,
  Lock,
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession();
  if (!session) {
    redirect("/auth");
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      jobTitle: true,
      companyName: true,
      createdAt: true,
      feedback: true,
      previewImage: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="relative overflow-hidden pt-24">
      <div className="hero-decor" aria-hidden="true" />
      <Navbar />

      <section className="page-shell relative gap-20">
        {/* Glow Effect for Hero */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 opacity-40 mix-blend-multiply blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(250, 113, 133, 0.4) 0%, rgba(111, 122, 255, 0.2) 50%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* High-Fidelity Hero */}
        <header className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-600 backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              <span>AI-Powered Analysis</span>
            </div>

            <h1 className="headline mt-6 text-balance">
              Transform your resume into an interview magnet
            </h1>
            <p className="subheadline mt-6 max-w-2xl text-balance lg:mx-0">
              Get instant, actionable feedback tailored to your target role. Our
              deep-scan engine identifies gaps, improves phrasing, and boosts ATS
              compatibility.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/upload" className="primary-button">
                Analyze a new resume
              </Link>
              <Link
                href="#resumes"
                className="primary-button primary-button--ghost"
              >
                Review history
              </Link>
            </div>

            {/* Trust Strip (Mobile/Desktop) */}
            <div className="mt-12 grid w-full grid-cols-1 gap-6 border-t border-slate-200/40 pt-8 sm:grid-cols-3 lg:gap-8">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <TrendingUp className="size-5" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-slate-900">+18 pts</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Avg. Uplift
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <Layers className="size-5" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-slate-900">Unlimited</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Iterations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-slate-900">Instant</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Guidance
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Graphic (Tilted Card Stack) */}
          <div className="relative isolate hidden lg:block">
            <div className="absolute inset-0 translate-y-4 rotate-6 rounded-3xl bg-indigo-500/5 blur-2xl" />
            <div className="relative rotate-3 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_30px_60px_-12px_rgba(50,50,93,0.15)] backdrop-blur-xl transition duration-500 hover:rotate-0 hover:shadow-[0_40px_70px_-12px_rgba(50,50,93,0.2)]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <div className="h-2.5 w-24 rounded-full bg-slate-200" />
                    <div className="mt-1.5 h-2 w-16 rounded-full bg-slate-100" />
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-700">
                  <TrendingUp className="size-3.5" />
                  92%
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200" />
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="h-2 w-3/4 rounded-full bg-slate-200" />
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <ScanSearch className="size-4" />
                  </div>
                  <div className="h-2 w-5/6 rounded-full bg-slate-200" />
                </div>
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                  <Zap className="size-5 fill-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Actionable
                  </p>
                  <p className="text-xs text-slate-500">Real-time fixes</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Feature Bento Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Feature 1: Deep Analysis (Large) */}
          <div className="surface-card group relative col-span-1 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg md:col-span-2">
            <div className="absolute -right-12 -top-12 size-48 rounded-full bg-indigo-500/5 transition-transform duration-500 group-hover:scale-125" />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div>
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <ScanSearch className="size-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Deep Contextual Analysis
                </h3>
                <p className="mt-2 max-w-md text-slate-600">
                  We do not just check for keywords. Resumind understands the
                  nuance of your target role and suggests improvements that human
                  recruiters actually care about.
                </p>
              </div>
              {/* Mock UI Bars */}
              <div className="flex gap-2 opacity-60 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0">
                <div className="h-1.5 w-full rounded-full bg-indigo-500/20">
                  <div className="h-full w-3/4 rounded-full bg-indigo-500" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-emerald-500/20">
                  <div className="h-full w-1/2 rounded-full bg-emerald-500" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-amber-500/20">
                  <div className="h-full w-5/6 rounded-full bg-amber-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Privacy (Tall) */}
          <div className="surface-card group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute -bottom-8 -right-8 size-32 rounded-full bg-emerald-500/5 transition-transform duration-500 group-hover:scale-150" />
            <div className="relative flex h-full flex-col gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="size-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Zero Retention
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Your data is yours. Wipe your entire analysis history with one
                  click. We prioritize your privacy above all else.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3: Visual History (Wide) */}
          <div className="surface-card group relative col-span-1 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg md:col-span-3">
            <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">
              <div className="flex flex-col justify-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Layers className="size-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Visual Version Control
                </h3>
                <p className="mt-2 text-slate-600">
                  See your resume evolve over time. Track which changes led to
                  better scores and never lose a winning iteration.
                </p>
              </div>
              {/* Mock History Strip */}
              <div className="relative flex items-center gap-4 overflow-hidden rounded-xl bg-slate-50/50 p-4 ring-1 ring-slate-200/50">
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 w-20 shrink-0 rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition-transform hover:-translate-y-1"
                  >
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full rounded-full bg-slate-100" />
                      <div className="h-1.5 w-3/4 rounded-full bg-slate-100" />
                      <div className="h-1.5 w-5/6 rounded-full bg-slate-100" />
                    </div>
                  </div>
                ))}
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <TrendingUp className="size-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resume List */}
        <section id="resumes" className="section-shell relative z-10 gap-10">
          {/* Background Decor for Section */}
          <div
            className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[500px] w-full -translate-x-1/2 opacity-20 blur-[100px]"
            style={{
              background:
                "radial-gradient(circle at bottom, rgba(79, 70, 229, 0.15) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          {resumes.length === 0 ? (
            // Empty State with "Ghost Grid" Background
            <div className="relative isolate mx-auto w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-12 text-center shadow-xl backdrop-blur-md">
              {/* Ghost Grid Pattern */}
              <div
                className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
                aria-hidden="true"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-white via-white/50 to-transparent" />

              <div className="flex flex-col items-center gap-6">
                <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-white shadow-sm">
                  <FileText className="size-8 text-indigo-500/80" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">
                    Ready to analyze your first resume?
                  </h3>
                  <p className="mt-3 max-w-lg text-slate-600">
                    Upload your PDF and paste the job description. We will handle
                    the heavy lifting to get you noticed.
                  </p>
                </div>
                <Link
                  href="/upload"
                  className="primary-button mt-2 shadow-indigo-200/50"
                >
                  Start Analysis
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Active Header */}
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-indigo-600">
                    <History className="size-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      History
                    </span>
                  </div>
                  <h2 className="headline text-3xl">Your analysis archive</h2>
                </div>
                <div className="hidden rounded-full border border-slate-200 bg-white/50 px-4 py-1 text-xs font-medium text-slate-500 backdrop-blur md:block">
                  {resumes.length} saved
                </div>
              </div>

              {/* Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {resumes.map((resume) => {
                  const feedback = resume.feedback as unknown as Feedback;
                  return (
                    <ResumeCard
                      key={resume.id}
                      resume={{
                        id: resume.id,
                        companyName: resume.companyName || undefined,
                        jobTitle: resume.jobTitle,
                        jobDescription: "",
                        feedback,
                        previewImage: resume.previewImage || undefined,
                      }}
                    />
                  );
                })}
              </div>

              {/* Privacy Station (Footer) */}
              <div className="mt-16 rounded-3xl border border-rose-100/50 bg-rose-50/30 p-8 backdrop-blur-sm">
                <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
                  <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                    <div className="flex size-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                      <Lock className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Privacy Control
                      </h3>
                      <p className="text-sm text-slate-500">
                        Permanently delete all data. This action is
                        irreversible.
                      </p>
                    </div>
                  </div>
                  <div className="w-full md:w-auto">
                    <WipeDataButton
                      resumes={resumes.map((r) => ({
                        id: r.id,
                        jobTitle: r.jobTitle,
                        companyName: r.companyName,
                      }))}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}
