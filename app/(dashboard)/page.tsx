import Link from "next/link";
import ResumeCard from "@/app/components/ResumeCard";
import WipeDataButton from "@/app/components/WipeDataButton";
import { FileText, TrendingUp, Trophy } from "lucide-react";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import type { Feedback } from "@/types";

export default async function DashboardPage() {
  const session = await getServerSession();

  const resumes = await prisma.resume.findMany({
    where: { userId: session!.user.id },
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

  const scores = resumes
    .map((r) => (r.feedback as unknown as Feedback)?.overallScore)
    .filter((s): s is number => typeof s === "number");

  const stats = {
    resumeCount: resumes.length,
    avgScore:
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : null,
    bestScore: scores.length > 0 ? Math.max(...scores) : null,
  };

  const firstName = session!.user.name?.split(" ")[0];

  const statCards = [
    {
      label: "Resumes analyzed",
      value: stats.resumeCount,
      suffix: "",
      icon: FileText,
      color: "text-indigo-500",
    },
    {
      label: "Average score",
      value: stats.avgScore ?? "--",
      suffix: stats.avgScore !== null ? "/100" : "",
      icon: TrendingUp,
      color: "text-pink-500",
    },
    {
      label: "Best score",
      value: stats.bestScore ?? "--",
      suffix: stats.bestScore !== null ? "/100" : "",
      icon: Trophy,
      color: "text-amber-500",
    },
  ];

  const resumeList = resumes.map((r) => ({
    id: r.id,
    jobTitle: r.jobTitle,
    companyName: r.companyName,
  }));

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pt-12">
      {/* Greeting */}
      <header className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
            Welcome back{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="text-lg text-slate-500">
            {stats.resumeCount > 0
              ? `${stats.resumeCount} resume${stats.resumeCount !== 1 ? "s" : ""} analyzed`
              : "Start by uploading your first resume"}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/upload" className="primary-button">
            Analyze a new resume
          </Link>
          {resumes.length > 0 && (
            <Link
              href="#resumes"
              className="primary-button primary-button--ghost px-5 py-2.5 text-sm"
            >
              Review past analyses
            </Link>
          )}
        </div>
      </header>

      {/* Stats row */}
      <dl className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map(({ label, value, suffix, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-[var(--radius-card)] border border-white/30 bg-[var(--color-surface-muted)] p-5 shadow-[var(--shadow-surface)] backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
                {label}
              </dt>
            </div>
            <dd className="mt-3">
              <span className="text-3xl font-bold text-slate-900">{value}</span>
              {suffix && (
                <span className="ml-0.5 text-sm text-slate-400">{suffix}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {/* Resume grid */}
      <section id="resumes" className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Your analyses at a glance
          </h2>
          <p className="text-base text-slate-600 sm:text-lg">
            Revisit past submissions, monitor improvements, and dive back into
            detailed insights anytime.
          </p>
        </div>

        {resumes.length === 0 ? (
          <div className="flex flex-col items-center gap-6 rounded-[var(--radius-card)] border border-white/30 bg-[var(--color-surface-muted)] px-6 py-16 text-center shadow-[var(--shadow-surface)] backdrop-blur-md">
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
          <div className="grid gap-6 sm:grid-cols-2">
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
        )}
      </section>

      {/* Wipe data */}
      {resumes.length > 0 && (
        <div className="flex justify-center border-t border-slate-200/60 pt-10">
          <WipeDataButton resumes={resumeList} />
        </div>
      )}
    </section>
  );
}
