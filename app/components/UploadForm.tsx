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
import { Globe } from "lucide-react";
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
    <>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <form
          id="upload-form"
          onSubmit={handleSubmit}
          className="form-panel surface-card surface-card--tight"
          aria-describedby="upload-status"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Job details
            </h2>
            <button
              type="button"
              onClick={() => setImportModalOpen(true)}
              disabled={isProcessing || isImporting}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-50 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Globe className="h-4 w-4" />
              Import details
            </button>
          </div>

          <div className="form-panel__grid">
            <div className="input-wrapper">
              <label htmlFor="company-name" className="input-label">
                Company name
              </label>
              <input
                type="text"
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Aurora Labs"
                className="input-field"
                disabled={isProcessing || isImporting}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="job-title" className="input-label required">
                Job title
              </label>
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
                  "input-field",
                  touched.jobTitle &&
                    fieldErrors.jobTitle &&
                    "!border-red-300 !bg-red-50/30",
                  touched.jobTitle &&
                    !fieldErrors.jobTitle &&
                    "!border-green-300 !bg-green-50/20",
                )}
                aria-invalid={touched.jobTitle && Boolean(fieldErrors.jobTitle)}
                aria-describedby={
                  touched.jobTitle && fieldErrors.jobTitle
                    ? "job-title-error"
                    : undefined
                }
                required
                disabled={isProcessing || isImporting}
              />
              {touched.jobTitle && fieldErrors.jobTitle && (
                <p
                  id="job-title-error"
                  className="text-sm font-medium text-red-600"
                  role="alert"
                >
                  {fieldErrors.jobTitle}
                </p>
              )}
            </div>
          </div>

          <div className="input-wrapper">
            <label htmlFor="job-description" className="input-label required">
              Job description
            </label>
            <textarea
              rows={6}
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
              placeholder="Paste the most important responsibilities and requirements"
              className={cn(
                "textarea-field",
                touched.jobDescription &&
                  fieldErrors.jobDescription &&
                  "!border-red-300 !bg-red-50/30",
                touched.jobDescription &&
                  !fieldErrors.jobDescription &&
                  jobDescription.trim().length >= 50 &&
                  "!border-green-300 !bg-green-50/20",
              )}
              aria-invalid={
                touched.jobDescription && Boolean(fieldErrors.jobDescription)
              }
              aria-describedby={
                touched.jobDescription && fieldErrors.jobDescription
                  ? "job-description-error"
                  : undefined
              }
              required
              disabled={isProcessing || isImporting}
            />
            {touched.jobDescription && fieldErrors.jobDescription && (
              <p
                id="job-description-error"
                className="text-sm font-medium text-red-600"
                role="alert"
              >
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

          <div className="input-wrapper">
            <label className="input-label">Analysis depth</label>
            <ReasoningToggle
              value={reasoningLevel}
              onChange={setReasoningLevel}
              disabled={isProcessing || isImporting}
            />
            <p className="text-xs text-slate-500">
              Choose how thorough the AI review should be. Higher levels take
              longer and use more compute.
            </p>
          </div>

          <div className="input-wrapper">
            <label className="input-label required" htmlFor="resume-upload">
              Resume PDF
            </label>
            <FileUploader
              onFileSelect={handleFileSelect}
              onErrorChange={(message) => {
                setFieldErrors((prev) => ({ ...prev, file: message }));
              }}
              error={touched.file ? fieldErrors.file : ""}
              disabled={isProcessing || isImporting}
              inputId="resume-upload"
            />
            <p className="text-xs text-slate-500">
              Your file is stored securely so you can revisit the analysis
              later.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              className="primary-button"
              type="submit"
              disabled={isProcessing || !file}
            >
              {isProcessing ? "Analyzing..." : "Analyze resume"}
            </button>
            <span className="text-xs text-slate-500">
              {file ? "Ready to analyze" : "Select a PDF to enable analysis"}
            </span>
          </div>
        </form>

        <aside
          className="surface-card surface-card--tight flex h-full min-h-[420px] flex-col gap-6"
          aria-live="polite"
        >
          <div className="flex flex-1 flex-col">
            {isProcessing ? (
              <div className="flex flex-1 flex-col gap-4 text-center">
                <div className="flex flex-1 items-center justify-center overflow-hidden rounded-3xl bg-indigo-50/70 p-6">
                  <img
                    src="/images/resume-scan.gif"
                    alt="Analyzing resume"
                    className="h-full w-full max-h-[420px] object-contain"
                  />
                </div>
                <p className="text-sm text-slate-600">
                  Keep this tab open. We will redirect you once the analysis is
                  complete.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-slate-600">
                <h2 className="text-base font-semibold text-slate-900">
                  Before you upload
                </h2>
                <ul className="space-y-3">
                  {checklist.map((item) => (
                    <li
                      key={item.title}
                      className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3"
                    >
                      <p className="font-semibold text-slate-800">
                        {item.title}
                      </p>
                      <p>{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <p
            id="upload-status"
            className="mt-auto text-sm font-semibold text-indigo-600 text-center"
          >
            {statusText}
          </p>
        </aside>
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
