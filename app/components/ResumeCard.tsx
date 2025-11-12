"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import ScoreCircle from "./ScoreCircle";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useEffect, useMemo, useState, useRef } from "react";
import React from "react";
import type { Resume } from "@/types";

const ResumeCard = React.memo(
  ({ resume: { id, companyName, jobTitle, feedback } }: { resume: Resume }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [hasNoPreview, setHasNoPreview] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const hasFeedback = typeof feedback === "object" && feedback !== null;

    useEffect(() => {
      let cancelled = false;

      async function fetchPreview() {
        try {
          const response = await fetch(`/api/resumes/${id}/preview`);
          if (!response.ok) {
            if (!cancelled) {
              setHasNoPreview(true);
            }
            return;
          }

          const result = await response.json();
          if (result.success && result.previewImage && !cancelled) {
            setPreviewImage(result.previewImage);
          } else if (!cancelled) {
            setHasNoPreview(true);
          }
        } catch {
          if (!cancelled) {
            setHasNoPreview(true);
          }
        }
      }

      fetchPreview();

      return () => {
        cancelled = true;
      };
    }, [id]);

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
    }, [
      hasFeedback,
      feedback?.toneAndStyle?.score,
      feedback?.content?.score,
      feedback?.structure?.score,
      feedback?.skills?.score,
    ]);

    return (
      <div ref={cardRef} className="relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDeleteModal(true);
          }}
          disabled={isDeleting}
          className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-red-200/70 bg-white/95 text-red-600 shadow-sm backdrop-blur transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 hover:shadow-md focus-visible:ring-2 focus-visible:ring-red-200/70 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label={`Delete ${companyName || "resume"}`}
        >
          <X className="h-4 w-4" />
        </button>
        <Link
          href={`/resume/${id}`}
          className="group resume-card animate-in fade-in duration-700"
          aria-label={`View resume analysis for ${companyName || "this resume"}`}
        >
          <div className="resume-card-header">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {companyName ? "Application" : "Draft"}
              </p>
              <h3 className="text-2xl font-semibold text-slate-900">
                {companyName || "Untitled resume"}
              </h3>
              <p className="text-sm font-medium text-slate-500">
                {jobTitle || "Add a target job to personalize guidance"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {overallScore !== undefined ? (
                <ScoreCircle score={overallScore} />
              ) : (
                <div className="rounded-full border border-dashed border-slate-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
                  Processing
                </div>
              )}
            </div>
          </div>

          <div className="resume-card__preview relative h-[320px] overflow-hidden bg-slate-100">
            {previewImage && !imageLoadError ? (
              <Image
                src={previewImage}
                alt={`Resume preview for ${companyName || jobTitle || "resume"}`}
                fill
                className="object-contain"
                unoptimized
                onError={() => {
                  setImageLoadError(true);
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                {hasNoPreview ? "No preview available" : "Loading preview..."}
              </div>
            )}
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
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onConfirm={async () => {
            setIsDeleting(true);
            try {
              const response = await fetch(`/api/resumes/${id}`, {
                method: "DELETE",
              });
              const result = await response.json();

              if (!response.ok || !result.success) {
                throw new Error(result.error || "Failed to delete");
              }

              toast.success("Resume deleted");
              router.refresh();
            } catch (error) {
              toast.error("Failed to delete resume", {
                description:
                  error instanceof Error ? error.message : "Please try again",
              });
            } finally {
              setIsDeleting(false);
              setShowDeleteModal(false);
            }
          }}
          onCancel={() => setShowDeleteModal(false)}
          title={companyName || jobTitle || "Untitled resume"}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return (
      prevProps.resume.id === nextProps.resume.id &&
      prevProps.resume.companyName === nextProps.resume.companyName &&
      prevProps.resume.jobTitle === nextProps.resume.jobTitle &&
      prevProps.resume.feedback?.overallScore ===
        nextProps.resume.feedback?.overallScore
    );
  },
);

ResumeCard.displayName = "ResumeCard";

export default ResumeCard;
