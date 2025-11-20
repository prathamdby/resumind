"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import FileUploader from "@/app/components/FileUploader";
import ImportJobModal from "@/app/components/ImportJobModal";
import ReasoningToggle, {
  type ReasoningLevel,
} from "@/app/components/ReasoningToggle";
import { cn } from "@/app/lib/utils";
import { toast } from "sonner";
import {
  Globe,
  Building2,
  Briefcase,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { analyzeResume, importJobFromUrl, importJobFromPdf } from "@/lib/api";

const checklist = [
  {
    title: "Tailor to the role",
    description:
      "Share the job title and paste the job description to unlock targeted advice.",
  },
  {
    title: "Upload a clean PDF",
    description:
      "Use a single-column layout with clear headings for the best ATS results.",
  },
  {
    title: "Iterate quickly",
    description:
      "Re-run analyses after updates to track progress and lift your score.",
  },
];

export default function UploadForm() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("Upload your resume to begin");
  const [file, setFile] = useState<File | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [reasoningLevel, setReasoningLevel] = useState<ReasoningLevel>("low");
  const [isImporting, setIsImporting] = useState(false);
  const [touched, setTouched] = useState({
    jobTitle: false,
    jobDescription: false,
    file: false,
  });
  const [fieldErrors, setFieldErrors] = useState({
    jobTitle: "",
    jobDescription: "",
    file: "",
  });

  const validateJobTitle = (value: string): string => {
    if (!value.trim()) return "Job title is required";
    return "";
  };

  const validateJobDescription = (value: string): string => {
    if (!value.trim()) return "Job description is required";
    if (value.trim().length < 50) return "At least 50 characters needed";
    return "";
  };

  const validateFile = (fileToValidate: File | null): string => {
    if (!fileToValidate) return "Resume PDF is required";
    if (fileToValidate.type !== "application/pdf")
      return "Only PDF files accepted";
    if (fileToValidate.size === 0) return "File appears to be empty";
    if (fileToValidate.size > 20 * 1024 * 1024)
      return "File must be under 20 MB";
    return "";
  };

  const handleFileSelect = (newFile: File | null) => {
    if (isProcessing) return;
    setFile(newFile);
    setTouched((prev) => ({ ...prev, file: true }));

    if (!newFile) {
      setFieldErrors((prev) => ({
        ...prev,
        file: validateFile(null),
      }));
      setStatusText("Upload your resume to begin");
      return;
    }

    const error = validateFile(newFile);
    setFieldErrors((prev) => ({ ...prev, file: error }));

    if (error) {
      setStatusText(error);
      return;
    }

    setStatusText("Resume uploaded. Ready when you are.");
  };

  const handleImportFromUrl = async (url: string) => {
    setIsImporting(true);

    try {
      const extracted = await importJobFromUrl(url);
      setCompanyName(extracted.companyName);
      setJobTitle(extracted.jobTitle);
      setJobDescription(extracted.jobDescription);

      toast.success("Job details imported", {
        description: "The form has been filled with the extracted information.",
      });

      setImportModalOpen(false);
    } catch (error) {
      console.error("Import error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message.includes("Too many requests") ||
            error.message.includes("rate limit")
            ? "Too many requests. Please wait a moment and try again."
            : error.message.includes("Unauthorized")
              ? "Please sign in to import job details."
              : error.message
          : "We couldn't import the job details. Please paste them manually.";

      toast.error("Import failed", {
        description: errorMessage,
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportFromPdf = async (file: File) => {
    setIsImporting(true);

    try {
      const extracted = await importJobFromPdf(file);
      setCompanyName(extracted.companyName);
      setJobTitle(extracted.jobTitle);
      setJobDescription(extracted.jobDescription);

      toast.success("Job details imported", {
        description: "The form has been filled with the extracted information.",
      });

      setImportModalOpen(false);
    } catch (error) {
      console.error("Import error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message.includes("Too many requests") ||
            error.message.includes("rate limit")
            ? "Too many requests. Please wait a moment and try again."
            : error.message.includes("Unauthorized")
              ? "Please sign in to import job details."
              : error.message
          : "We couldn't import the job details from the PDF. Please paste them manually.";

      toast.error("Import failed", {
        description: errorMessage,
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isProcessing || !file) return;

    // Mark all fields as touched
    setTouched({
      jobTitle: true,
      jobDescription: true,
      file: true,
    });

    // Validate all fields
    const jobTitleError = validateJobTitle(jobTitle);
    const jobDescriptionError = validateJobDescription(jobDescription);
    const fileError = validateFile(file);

    setFieldErrors({
      jobTitle: jobTitleError,
      jobDescription: jobDescriptionError,
      file: fileError,
    });

    // Check for any errors
    if (jobTitleError || jobDescriptionError || fileError) {
      if (jobTitleError) {
        toast.error("Job title required", {
          description: jobTitleError,
        });
        return;
      }

      if (jobDescriptionError) {
        toast.error("Job description issue", {
          description: jobDescriptionError,
        });
        return;
      }

      if (fileError) {
        toast.error("Resume file issue", {
          description: fileError,
        });
        return;
      }
    }

    setIsProcessing(true);
    setStatusText("Analyzing your resume...");

    try {
      const { resumeId, feedback } = await analyzeResume(
        file,
        jobTitle.trim(),
        jobDescription.trim(),
        reasoningLevel,
        companyName.trim() || undefined,
      );

      toast.success("Analysis complete!");
      router.push(`/resume/${resumeId}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Analysis failed";

      if (
        errorMessage.includes("Too many requests") ||
        errorMessage.includes("rate limit")
      ) {
        toast.error("Rate limit exceeded", {
          description: "Please wait a moment and try again.",
        });
      } else if (errorMessage.includes("timeout")) {
        const hint =
          reasoningLevel === "high"
            ? "Try Medium or Low for faster results."
            : reasoningLevel === "medium"
              ? "Try Low for faster results."
              : "The PDF may be too complex. Please try a simpler format.";
        toast.error("Request timed out", {
          description: hint,
        });
      } else if (errorMessage.includes("too detailed")) {
        toast.error("Resume too detailed", {
          description: "Please use a simpler resume format with less content.",
        });
      } else {
        toast.error("Analysis failed", { description: errorMessage });
      }

      setStatusText("Upload your resume to begin");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative">
      <form
        id="upload-form"
        onSubmit={handleSubmit}
        className="surface-card surface-card--tight grid gap-0 p-0 overflow-hidden lg:grid-cols-[1.4fr_1fr]"
        aria-describedby="upload-status"
      >
        {/* Left Column: Job Details */}
        <div className="flex flex-col gap-8 border-b border-slate-100 p-6 lg:border-b-0 lg:border-r lg:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Job Context
              </h2>
              <p className="text-sm text-slate-500">
                Tell us about the role so we can tailor the feedback.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setImportModalOpen(true)}
              disabled={isProcessing || isImporting}
              className="group inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-100 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-200 disabled:opacity-60"
            >
              <Sparkles className="size-4 transition-transform group-hover:scale-110" />
              Import details
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="input-wrapper">
              <label htmlFor="company-name" className="input-label">
                Company name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3.5 size-5 text-slate-400" />
                <input
                  type="text"
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Aurora Labs"
                  className="input-field pl-10"
                  disabled={isProcessing || isImporting}
                />
              </div>
            </div>
            <div className="input-wrapper">
              <label htmlFor="job-title" className="input-label required">
                Job title
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3.5 size-5 text-slate-400" />
                <input
                  type="text"
                  id="job-title"
                  value={jobTitle}
                  onChange={(e) => {
                    setJobTitle(e.target.value);
                    if (touched.jobTitle) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        jobTitle: validateJobTitle(e.target.value),
                      }));
                    }
                  }}
                  onBlur={(event) => {
                    setTouched((prev) => ({ ...prev, jobTitle: true }));
                    setFieldErrors((prev) => ({
                      ...prev,
                      jobTitle: validateJobTitle(event.target.value),
                    }));
                  }}
                  placeholder="e.g. Senior Product Designer"
                  className={cn(
                    "input-field pl-10",
                    touched.jobTitle &&
                      fieldErrors.jobTitle &&
                      "!border-red-300 !bg-red-50/30",
                    touched.jobTitle &&
                      !fieldErrors.jobTitle &&
                      "!border-green-300 !bg-green-50/20",
                  )}
                  required
                  disabled={isProcessing || isImporting}
                />
              </div>
              {touched.jobTitle && fieldErrors.jobTitle && (
                <p className="text-sm font-medium text-red-600">
                  {fieldErrors.jobTitle}
                </p>
              )}
            </div>
          </div>

          <div className="input-wrapper flex-1">
            <label htmlFor="job-description" className="input-label required">
              Job description
            </label>
            <div className="relative h-full">
              <FileText className="absolute left-3.5 top-3.5 size-5 text-slate-400" />
              <textarea
                rows={8}
                id="job-description"
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  if (touched.jobDescription) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      jobDescription: validateJobDescription(e.target.value),
                    }));
                  }
                }}
                onBlur={(event) => {
                  setTouched((prev) => ({ ...prev, jobDescription: true }));
                  setFieldErrors((prev) => ({
                    ...prev,
                    jobDescription: validateJobDescription(event.target.value),
                  }));
                }}
                placeholder="Paste the full job description here. The more details, the better the feedback."
                className={cn(
                  "textarea-field pl-10 h-full min-h-[200px]",
                  touched.jobDescription &&
                    fieldErrors.jobDescription &&
                    "!border-red-300 !bg-red-50/30",
                  touched.jobDescription &&
                    !fieldErrors.jobDescription &&
                    jobDescription.trim().length >= 50 &&
                    "!border-green-300 !bg-green-50/20",
                )}
                required
                disabled={isProcessing || isImporting}
              />
            </div>
            {touched.jobDescription && fieldErrors.jobDescription && (
              <p className="text-sm font-medium text-red-600">
                {fieldErrors.jobDescription}
              </p>
            )}
            {touched.jobDescription &&
              !fieldErrors.jobDescription &&
              jobDescription.trim().length >= 50 && (
                <p className="text-sm font-medium text-green-600">
                  ✓ Looks good! ({jobDescription.trim().length} characters)
                </p>
              )}
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-900">
                Analysis Depth
              </label>
              <p className="text-xs text-slate-500">
                Higher depth takes longer but provides richer feedback.
              </p>
            </div>
            <ReasoningToggle
              value={reasoningLevel}
              onChange={setReasoningLevel}
              disabled={isProcessing || isImporting}
            />
          </div>
        </div>

        {/* Right Column: Resume Upload */}
        <div className="flex flex-col gap-6 bg-slate-50/30 p-6 lg:p-8">
          {/* Mobile Tip */}
          <div className="block lg:hidden rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="size-4" />
              <span>PDF Only, Max 20MB</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Your Resume
            </h2>
            <p className="text-sm text-slate-500">
              Upload your latest PDF version.
            </p>
          </div>

          <div className="flex-1 flex flex-col">
            <FileUploader
              className="h-full"
              onFileSelect={handleFileSelect}
              onErrorChange={(message) => {
                setFieldErrors((prev) => ({ ...prev, file: message }));
              }}
              error={touched.file ? fieldErrors.file : ""}
              disabled={isProcessing || isImporting}
              inputId="resume-upload"
            />
          </div>

          <button
            className="primary-button w-full shadow-lg shadow-indigo-200/50"
            type="submit"
            disabled={isProcessing || !file}
          >
            {isProcessing ? "Analyzing..." : "Run Analysis"}
          </button>

          {/* Pro Tips (Inside Card) */}
          <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Pro Tips
            </h3>
            <ul className="space-y-3">
              {checklist.map((item) => (
                <li key={item.title} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-indigo-500" />
                  <div>
                    <span className="font-medium text-slate-700">
                      {item.title}
                    </span>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </form>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-3xl bg-white/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="relative flex flex-col items-center gap-8 p-8 text-center">
            <div className="relative size-24">
              <div className="absolute inset-0 animate-ping rounded-full bg-indigo-100 opacity-75" />
              <div className="relative flex size-24 items-center justify-center rounded-full bg-white shadow-xl">
                <Sparkles className="size-10 animate-pulse text-indigo-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-slate-900">
                Analyzing your profile...
              </h3>
              <p className="max-w-xs text-slate-600">
                Our AI is matching your resume against the job requirements.
                This usually takes about 15-20 seconds.
              </p>
            </div>
          </div>
        </div>
      )}

      <ImportJobModal
        isOpen={importModalOpen}
        onCancel={() => {
          if (isImporting) return;
          setImportModalOpen(false);
        }}
        onImportUrl={handleImportFromUrl}
        onImportPdf={handleImportFromPdf}
      />
    </div>
  );
}
