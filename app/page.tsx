import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import ResumeCard from "@/app/components/ResumeCard";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import type { Feedback } from "@/types";

const heroInsights = [
  {
    label: "Average ATS uplift",
    value: "+18 pts",
    description: "after applying tailored feedback",
  },
  {
    label: "Resume variants tracked",
    value: "Unlimited",
    description: "keep every iteration organized",
  },
  {
    label: "Guided improvements",
    value: "Step-by-step",
    description: "actionable suggestions per category",
  },
];

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
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="relative overflow-hidden pt-12">
      <div className="hero-decor" aria-hidden="true" />
      <Navbar />

      <section className="page-shell gap-20">
        <header className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:items-start lg:gap-16">
          <div className="flex flex-col gap-8">
            <span className="section-eyebrow">
              Confidence for every application
            </span>
            <h1 className="headline">
              Track your resume performance and land the interview sooner
            </h1>
            <p className="subheadline">
              Resumind analyzes each submission, highlights what is working, and
              gives you the playbook to tailor your next iteration in minutes.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/upload" className="primary-button">
                Analyze a new resume
              </Link>
              <Link
                href="#resumes"
                className="primary-button primary-button--ghost px-5 py-2.5 text-sm"
              >
                Review past analyses
              </Link>
            </div>
          </div>

          <aside
            className="surface-card space-y-6 self-start"
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">
                  Spotlight
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  Your next role
                </p>
                <p className="text-sm text-slate-500">
                  Run an analysis to see tailored advice
                </p>
              </div>
            </div>

            <div className="grid gap-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-indigo-100/70 bg-indigo-50/40 px-4 py-3">
                <p className="font-semibold text-indigo-700">
                  Actionable feedback
                </p>
                <p className="mt-1 text-slate-600">
                  Every category comes with ready-to-apply guidance pulled from
                  ATS-friendly best practices.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3">
                <p className="font-semibold text-slate-800">
                  Visual resume preview
                </p>
                <p className="mt-1 text-slate-600">
                  Compare versions side-by-side and link directly to the source
                  PDF stored in Puter.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3">
                <p className="font-semibold text-slate-800">Secure storage</p>
                <p className="mt-1 text-slate-600">
                  Your resumes stay private; delete any analysis instantly from
                  the Wipe workspace.
                </p>
              </div>
            </div>
          </aside>

          <dl className="grid w-full grid-cols-1 items-stretch gap-6 pt-8 sm:grid-cols-3 lg:col-span-2">
            {heroInsights.map((insight) => (
              <div
                key={insight.label}
                className="surface-card surface-card--tight h-full text-left"
              >
                <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
                  {insight.label}
                </dt>
                <dd className="mt-3 text-2xl font-semibold text-slate-900">
                  {insight.value}
                </dd>
                <p className="text-sm text-slate-500">{insight.description}</p>
              </div>
            ))}
          </dl>
        </header>

        <section id="resumes" className="section-shell gap-10">
          <div className="section-heading">
            <div className="flex flex-col gap-3 text-left">
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Your analyses at a glance
              </h2>
              <p className="text-base text-slate-600 sm:text-lg">
                Revisit past submissions, monitor improvements, and dive back
                into detailed insights anytime.
              </p>
            </div>
          </div>

          {resumes.length === 0 ? (
            <div className="surface-card surface-card--tight mx-auto flex w-full max-w-3xl flex-col items-center gap-6 py-16 text-center">
              <div className="rounded-2xl bg-gradient-to-r from-indigo-100/80 to-pink-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-indigo-600">
                Getting started
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                No analyses yet. Your first upload unlocks personalized insights
              </h3>
              <p className="max-w-xl text-slate-600">
                Drag in a PDF resume, share the role you are focused on, and
                Resumind will return actionable guidance within seconds.
              </p>
              <Link href="/upload" className="primary-button px-5 py-3 text-sm">
                Upload your first resume
              </Link>
            </div>
          ) : (
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
                    }}
                  />
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
