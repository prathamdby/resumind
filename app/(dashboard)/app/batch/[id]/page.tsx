import Link from "next/link";
import { redirect } from "next/navigation";
import ResumeCard from "@/app/components/ResumeCard";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { FeedbackSchema } from "@/lib/schemas";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Trophy,
  Layers,
} from "lucide-react";

export default async function BatchResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [session, { id }] = await Promise.all([getServerSession(), params]);
  if (!session) {
    redirect("/auth");
  }

  const batch = await prisma.batchAnalysis.findUnique({
    where: { id },
    include: {
      resumes: {
        select: {
          id: true,
          jobTitle: true,
          companyName: true,
          feedback: true,
          previewImage: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!batch || batch.userId !== session.user.id) {
    redirect("/app");
  }

  const resumesWithFeedback = batch.resumes.flatMap((resume) => {
    const parsed = FeedbackSchema.safeParse(resume.feedback);
    if (!parsed.success) return [];
    return [{ ...resume, parsedFeedback: parsed.data }];
  });

  const scores = resumesWithFeedback.map(
    (r) => r.parsedFeedback.overallScore,
  );
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;
  const bestScore = scores.length > 0 ? Math.max(...scores) : null;
  const bestResume = resumesWithFeedback.find(
    (r) => r.parsedFeedback.overallScore === bestScore,
  );

  const statusLabel =
    batch.status === "completed"
      ? "All jobs analyzed"
      : batch.status === "partial"
        ? `${batch.completedJobs} of ${batch.totalJobs} succeeded`
        : batch.status === "failed"
          ? "All jobs failed"
          : "Processing";

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pt-12">
      <header className="flex flex-col gap-6">
        <Link href="/app" className="back-button w-fit">
          <ArrowLeft className="h-3 w-3" />
          <span>Back to dashboard</span>
        </Link>
        <div className="flex flex-col gap-2">
          <span className="section-eyebrow w-fit">Batch analysis</span>
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
            Batch results
          </h1>
          <p className="text-base text-slate-600">
            {statusLabel} &middot; Analyzed on{" "}
            {new Date(batch.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </header>

      <dl className="grid w-full grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-[var(--radius-card)] border border-white/30 bg-[var(--color-surface-muted)] p-5 shadow-[var(--shadow-surface)] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-500" />
            <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
              Total jobs
            </dt>
          </div>
          <dd className="mt-3">
            <span className="text-3xl font-bold text-slate-900">
              {batch.totalJobs}
            </span>
          </dd>
        </div>
        <div className="rounded-[var(--radius-card)] border border-white/30 bg-[var(--color-surface-muted)] p-5 shadow-[var(--shadow-surface)] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
              Completed
            </dt>
          </div>
          <dd className="mt-3">
            <span className="text-3xl font-bold text-slate-900">
              {batch.completedJobs}
            </span>
          </dd>
        </div>
        {batch.failedJobs > 0 && (
          <div className="rounded-[var(--radius-card)] border border-white/30 bg-[var(--color-surface-muted)] p-5 shadow-[var(--shadow-surface)] backdrop-blur-md">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-red-500">
                Failed
              </dt>
            </div>
            <dd className="mt-3">
              <span className="text-3xl font-bold text-slate-900">
                {batch.failedJobs}
              </span>
            </dd>
          </div>
        )}
        <div className="rounded-[var(--radius-card)] border border-white/30 bg-[var(--color-surface-muted)] p-5 shadow-[var(--shadow-surface)] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-pink-500" />
            <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">
              Average score
            </dt>
          </div>
          <dd className="mt-3">
            <span className="text-3xl font-bold text-slate-900">
              {avgScore ?? "--"}
            </span>
            {avgScore !== null && (
              <span className="ml-0.5 text-sm text-slate-400">/100</span>
            )}
          </dd>
        </div>
        {bestResume && bestScore !== null && (
          <div className="rounded-[var(--radius-card)] border border-white/30 bg-[var(--color-surface-muted)] p-5 shadow-[var(--shadow-surface)] backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500">
                Best match
              </dt>
            </div>
            <dd className="mt-3">
              <span className="text-3xl font-bold text-slate-900">
                {bestScore}
              </span>
              <span className="ml-0.5 text-sm text-slate-400">/100</span>
            </dd>
            <p className="mt-1 truncate text-xs text-slate-500">
              {bestResume.companyName || bestResume.jobTitle}
            </p>
          </div>
        )}
      </dl>

      <section className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Individual results
          </h2>
          <p className="text-base text-slate-600 sm:text-lg">
            Click any card to view the full analysis with coaching, ATS
            readiness, and line-by-line improvements.
          </p>
        </div>

        {resumesWithFeedback.length === 0 ? (
          <div className="flex flex-col items-center gap-6 rounded-[var(--radius-card)] border border-white/30 bg-[var(--color-surface-muted)] px-6 py-16 text-center shadow-[var(--shadow-surface)] backdrop-blur-md">
            <h3 className="text-2xl font-semibold text-slate-900">
              No successful analyses
            </h3>
            <p className="max-w-xl text-slate-600">
              All jobs in this batch failed to analyze. Try again with different
              job descriptions.
            </p>
            <Link
              href="/app/batch-upload"
              className="primary-button px-5 py-3 text-sm"
            >
              Start a new batch
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {resumesWithFeedback.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={{
                  id: resume.id,
                  companyName: resume.companyName || undefined,
                  jobTitle: resume.jobTitle,
                  overallScore: resume.parsedFeedback.overallScore,
                  previewImage: resume.previewImage,
                  categoryScores: {
                    toneAndStyle: resume.parsedFeedback.toneAndStyle.score,
                    content: resume.parsedFeedback.content.score,
                    structure: resume.parsedFeedback.structure.score,
                    skills: resume.parsedFeedback.skills.score,
                  },
                }}
              />
            ))}
          </div>
        )}
      </section>

      <div className="flex justify-center border-t border-slate-200/60 pt-10">
        <Link
          href="/app/batch-upload"
          className="primary-button primary-button--ghost px-5 py-2.5 text-sm"
        >
          Start another batch analysis
        </Link>
      </div>
    </section>
  );
}
