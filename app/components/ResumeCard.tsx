import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { useMemo } from "react";
import React from "react";

const ResumeCard = React.memo(
  ({
    resume,
    onDelete,
  }: {
    resume: Resume;
    onDelete?: (id: string) => void;
  }) => {
    const {
      id,
      company_name,
      companyName,
      job_title,
      jobTitle,
      feedback,
      text_content,
      status,
    } = resume;

    const displayCompany = company_name ?? companyName ?? "Untitled resume";
    const displayJob =
      job_title ?? jobTitle ?? "Add a target job to personalize guidance";

    const hasFeedback = typeof feedback === "object" && feedback !== null;
    const overallScore = hasFeedback ? feedback.overallScore : undefined;

    const highlightCategories = useMemo(() => {
      if (!hasFeedback) return [] as { label: string; score: number }[];

      const pairs: { label: string; score: number }[] = [
        { label: "Tone & Style", score: feedback.toneAndStyle.score },
        { label: "Content", score: feedback.content.score },
        { label: "Structure", score: feedback.structure.score },
        { label: "Skills", score: feedback.skills.score },
      ];

      return pairs.sort((a, b) => b.score - a.score).slice(0, 2);
    }, [hasFeedback, feedback]);

    const textPreview = (text_content ?? "").trim();
    const textSnippet = textPreview
      ? `${textPreview.slice(0, 200)}${textPreview.length > 200 ? "…" : ""}`
      : "Resume text will appear here once analysis completes.";

    const statusLabel =
      status === "completed" ? "Analysis ready" : "Processing";

    return (
      <div className="relative">
        {onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(id);
            }}
            className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-red-200/70 bg-white/95 text-red-600 shadow-sm backdrop-blur transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 hover:shadow-md focus-visible:ring-2 focus-visible:ring-red-200/70 focus-visible:ring-offset-2"
            aria-label={`Delete ${displayCompany}`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        <Link
          to={`/resume/${id}`}
          className="group resume-card animate-in fade-in duration-700"
          aria-label={`View resume analysis for ${displayCompany}`}
        >
          <div className="resume-card-header">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {company_name || companyName ? "Application" : "Draft"}
              </p>
              <h3 className="text-2xl font-semibold text-slate-900">
                {displayCompany}
              </h3>
              <p className="text-sm font-medium text-slate-500">{displayJob}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {overallScore !== undefined ? (
                <ScoreCircle score={overallScore} />
              ) : (
                <div className="rounded-full border border-dashed border-slate-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
                  {statusLabel}
                </div>
              )}
            </div>
          </div>

          <div className="gradient-border resume-card__preview flex h-[320px] flex-col justify-between bg-white/70 p-5 text-left">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
                Resume text preview
              </p>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap line-clamp-10">
                {textSnippet}
              </p>
            </div>
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
              Extracted content
            </span>
          </div>

          {hasFeedback && (
            <div className="flex flex-col gap-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-700">Top strengths</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {highlightCategories.map((category) => (
                  <li
                    key={`${id}-${category.label}`}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-indigo-50/40 px-3 py-2 text-slate-600"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {category.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {category.score}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <span className="mt-auto flex items-center justify-between text-sm font-semibold text-indigo-600">
            View detailed analysis
            <svg
              className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.resume.id === nextProps.resume.id &&
      (prevProps.resume.company_name ?? prevProps.resume.companyName) ===
        (nextProps.resume.company_name ?? nextProps.resume.companyName) &&
      (prevProps.resume.job_title ?? prevProps.resume.jobTitle) ===
        (nextProps.resume.job_title ?? nextProps.resume.jobTitle) &&
      prevProps.resume.text_content === nextProps.resume.text_content &&
      prevProps.resume.status === nextProps.resume.status &&
      prevProps.resume.feedback?.overallScore ===
        nextProps.resume.feedback?.overallScore &&
      prevProps.onDelete === nextProps.onDelete
    );
  },
);

ResumeCard.displayName = "ResumeCard";

export default ResumeCard;
