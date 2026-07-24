"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import FileUploader from "@/app/components/FileUploader";

const ImportJobModal = dynamic(
  () => import("@/app/components/ImportJobModal"),
  { ssr: false },
);

import { cn } from "@/app/lib/utils";
import { toast } from "sonner";
import {
  Globe,
  Plus,
  X,
  Check,
  AlertCircle,
  Loader2,
  ArrowRight,
  Layers,
} from "lucide-react";
import { batchAnalyze, importJobFromUrl, importJobFromPdf } from "@/lib/api";
import type { BatchJobEntry, BatchStreamEvent } from "@/types";

interface JobEntryState extends BatchJobEntry {
  id: string;
}

interface JobResult {
  status: "pending" | "analyzing" | "success" | "error";
  resumeId?: string;
  overallScore?: number;
  error?: string;
}

function createEmptyJob(): JobEntryState {
  return {
    id: crypto.randomUUID(),
    jobTitle: "",
    jobDescription: "",
    companyName: "",
  };
}

export default function BatchUploadForm() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [jobs, setJobs] = useState<JobEntryState[]>([
    createEmptyJob(),
    createEmptyJob(),
  ]);

  const [phase, setPhase] = useState<"form" | "processing" | "done">("form");
  const [results, setResults] = useState<Map<number, JobResult>>(new Map());
  const [batchId, setBatchId] = useState<string | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importTargetIndex, setImportTargetIndex] = useState<number>(0);
  const [isImporting, setIsImporting] = useState(false);

  const isProcessing = phase !== "form";

  const addJob = useCallback(() => {
    if (jobs.length >= 10) {
      toast.error("Maximum 10 jobs per batch");
      return;
    }
    setJobs((prev) => [...prev, createEmptyJob()]);
  }, [jobs.length]);

  const removeJob = useCallback(
    (index: number) => {
      if (jobs.length <= 2) {
        toast.error("At least 2 jobs required");
        return;
      }
      setJobs((prev) => prev.filter((_, i) => i !== index));
    },
    [jobs.length],
  );

  const updateJob = useCallback(
    (index: number, field: keyof BatchJobEntry, value: string) => {
      setJobs((prev) =>
        prev.map((job, i) => (i === index ? { ...job, [field]: value } : job)),
      );
    },
    [],
  );

  const handleImportFromUrl = async (url: string) => {
    setIsImporting(true);
    try {
      const extracted = await importJobFromUrl(url);
      updateJob(importTargetIndex, "companyName", extracted.companyName);
      updateJob(importTargetIndex, "jobTitle", extracted.jobTitle);
      updateJob(importTargetIndex, "jobDescription", extracted.jobDescription);
      toast.success("Job details imported");
      setImportModalOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Import failed";
      toast.error("Import failed", { description: errorMessage });
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportFromPdf = async (importedFile: File) => {
    setIsImporting(true);
    try {
      const extracted = await importJobFromPdf(importedFile);
      updateJob(importTargetIndex, "companyName", extracted.companyName);
      updateJob(importTargetIndex, "jobTitle", extracted.jobTitle);
      updateJob(importTargetIndex, "jobDescription", extracted.jobDescription);
      toast.success("Job details imported");
      setImportModalOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Import failed";
      toast.error("Import failed", { description: errorMessage });
    } finally {
      setIsImporting(false);
    }
  };

  const validateJobs = (): string | null => {
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      if (!job.jobTitle.trim()) return `Job ${i + 1}: Title is required`;
      if (!job.jobDescription.trim())
        return `Job ${i + 1}: Description is required`;
      if (job.jobDescription.trim().length < 50)
        return `Job ${i + 1}: Description needs at least 50 characters`;
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Resume required", {
        description: "Upload your resume PDF to continue.",
      });
      return;
    }

    const validationError = validateJobs();
    if (validationError) {
      toast.error("Fix job entries", { description: validationError });
      return;
    }

    setPhase("processing");
    const initialResults = new Map<number, JobResult>();
    jobs.forEach((_, i) => {
      initialResults.set(i, { status: "analyzing" });
    });
    setResults(initialResults);

    try {
      await batchAnalyze(
        file,
        jobs.map(({ jobTitle, jobDescription, companyName }) => ({
          jobTitle: jobTitle.trim(),
          jobDescription: jobDescription.trim(),
          companyName: companyName?.trim() || undefined,
        })),
        (event: BatchStreamEvent) => {
          if (event.type === "init" && event.batchId) {
            setBatchId(event.batchId);
          }

          if (event.type === "progress" && event.jobIndex !== undefined) {
            setResults((prev) => {
              const next = new Map(prev);
              next.set(event.jobIndex!, {
                status: event.status === "success" ? "success" : "error",
                resumeId: event.resumeId,
                overallScore: event.overallScore,
                error: event.error,
              });
              return next;
            });
          }

          if (event.type === "complete") {
            setPhase("done");
          }
        },
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Batch analysis failed";

      if (
        errorMessage.includes("Too many requests") ||
        errorMessage.includes("rate limit")
      ) {
        toast.error("Rate limit exceeded", {
          description: "Please wait before starting another batch.",
        });
      } else {
        toast.error("Batch analysis failed", { description: errorMessage });
      }

      setPhase("form");
      setResults(new Map());
    }
  };

  const completedCount = [...results.values()].filter(
    (r) => r.status === "success",
  ).length;
  const failedCount = [...results.values()].filter(
    (r) => r.status === "error",
  ).length;
  const totalCount = jobs.length;

  if (phase === "processing" || phase === "done") {
    return (
      <div className="flex flex-col gap-8">
        <div className="surface-card surface-card--tight">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-2xl",
                  phase === "done"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-indigo-50 text-indigo-600",
                )}
              >
                {phase === "done" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {phase === "done"
                    ? "Batch analysis complete"
                    : "Analyzing your resume..."}
                </h2>
                <p className="text-sm text-slate-500">
                  {completedCount + failedCount} of {totalCount} jobs processed
                </p>
              </div>
            </div>
            {phase === "done" && batchId && (
              <button
                onClick={() => router.push(`/app/batch/${batchId}`)}
                className="primary-button px-5 py-2.5 text-sm"
              >
                View all results
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500 ease-out",
                phase === "done"
                  ? failedCount > 0
                    ? "bg-gradient-to-r from-indigo-500 to-amber-400"
                    : "bg-gradient-to-r from-indigo-500 to-emerald-500"
                  : "bg-gradient-to-r from-indigo-500 to-indigo-400",
              )}
              style={{
                width: `${((completedCount + failedCount) / totalCount) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job, index) => {
            const result = results.get(index);
            const status = result?.status || "pending";

            return (
              <div
                key={job.id}
                className={cn(
                  "surface-card surface-card--tight transition-all duration-300",
                  status === "success" &&
                    "border-emerald-200/60 bg-emerald-50/30",
                  status === "error" && "border-red-200/60 bg-red-50/30",
                  status === "analyzing" && "animate-pulse",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                      Job {index + 1}
                    </p>
                    <h3 className="mt-1 truncate text-base font-semibold text-slate-900">
                      {job.jobTitle || "Untitled"}
                    </h3>
                    {job.companyName && (
                      <p className="truncate text-sm text-slate-500">
                        {job.companyName}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0">
                    {status === "analyzing" && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                        <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                      </div>
                    )}
                    {status === "success" && result?.overallScore !== undefined && (
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold",
                          result.overallScore >= 80
                            ? "bg-emerald-100 text-emerald-700"
                            : result.overallScore >= 60
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700",
                        )}
                      >
                        {result.overallScore}
                      </div>
                    )}
                    {status === "error" && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                  </div>
                </div>

                {status === "success" && result?.resumeId && (
                  <button
                    onClick={() =>
                      router.push(`/app/resume/${result.resumeId}`)
                    }
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
                  >
                    View analysis
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}

                {status === "error" && result?.error && (
                  <p className="mt-2 text-xs text-red-600">{result.error}</p>
                )}
              </div>
            );
          })}
        </div>

        {phase === "done" && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setPhase("form");
                setResults(new Map());
                setBatchId(null);
              }}
              className="primary-button primary-button--ghost px-5 py-2.5 text-sm"
            >
              Start another batch
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="surface-card surface-card--tight">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-600">
              1
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Upload your resume
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            One resume, analyzed against every job below.
          </p>
          <div className="mt-4">
            <FileUploader
              onFileSelect={setFile}
              onErrorChange={setFileError}
              error={fileError}
              disabled={isProcessing}
              inputId="batch-resume-upload"
            />
          </div>
        </div>

        <div className="surface-card surface-card--tight">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-600">
                2
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Add target jobs
              </h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {jobs.length}/10
              </span>
            </div>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Add 2-10 job descriptions to compare your resume against.
          </p>

          <div className="mt-5 flex flex-col gap-4">
            {jobs.map((job, index) => (
              <div
                key={job.id}
                className="relative rounded-2xl border border-slate-100 bg-white/90 p-5 transition-all duration-200 hover:border-slate-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="input-wrapper">
                        <label className="input-label required">
                          Job title
                        </label>
                        <input
                          type="text"
                          value={job.jobTitle}
                          onChange={(e) =>
                            updateJob(index, "jobTitle", e.target.value)
                          }
                          placeholder="e.g. Senior Product Designer"
                          className="input-field"
                          disabled={isProcessing}
                        />
                      </div>
                      <div className="input-wrapper">
                        <label className="input-label">Company</label>
                        <input
                          type="text"
                          value={job.companyName || ""}
                          onChange={(e) =>
                            updateJob(index, "companyName", e.target.value)
                          }
                          placeholder="e.g. Aurora Labs"
                          className="input-field"
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                    <div className="input-wrapper">
                      <label className="input-label required">
                        Job description
                      </label>
                      <textarea
                        rows={3}
                        value={job.jobDescription}
                        onChange={(e) =>
                          updateJob(index, "jobDescription", e.target.value)
                        }
                        placeholder="Paste the key responsibilities and requirements"
                        className="textarea-field !min-h-[80px]"
                        disabled={isProcessing}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImportTargetIndex(index);
                        setImportModalOpen(true);
                      }}
                      disabled={isProcessing || isImporting}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-500 transition-colors hover:text-indigo-700 disabled:opacity-60"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Import from URL or PDF
                    </button>
                  </div>
                  {jobs.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeJob(index)}
                      disabled={isProcessing}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-60"
                      aria-label={`Remove job ${index + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {jobs.length < 10 && (
              <button
                type="button"
                onClick={addJob}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 px-6 py-4 text-sm font-medium text-slate-500 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/30 hover:text-indigo-600 disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                Add another job
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={handleSubmit}
            disabled={isProcessing || !file || jobs.length < 2}
            className="primary-button"
          >
            <Layers className="h-4 w-4" />
            Analyze against {jobs.length} jobs
          </button>
          <span className="text-xs text-slate-500">
            {file
              ? `${jobs.length} job${jobs.length !== 1 ? "s" : ""} queued`
              : "Upload a resume to start"}
          </span>
        </div>
      </div>

      <ImportJobModal
        isOpen={importModalOpen}
        onCancel={() => {
          if (isImporting) return;
          setImportModalOpen(false);
        }}
        onImportUrl={handleImportFromUrl}
        onImportPdf={handleImportFromPdf}
      />
    </>
  );
}
