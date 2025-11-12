import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import ImportFromSiteModal from "~/components/ImportFromSiteModal";
import { useSession } from "~/lib/auth";
import { resumeApi } from "~/lib/services/resume-api";
import { cn } from "~/lib/utils";
import { toast } from "sonner";
import { Globe } from "lucide-react";

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

export const meta = () => [
  { title: "Resumind | Upload" },
  { name: "description", content: "Upload your resume for analysis" },
];

const Upload = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("Upload your resume to begin");
  const [file, setFile] = useState<File | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
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

  useEffect(() => {
    if (!session) {
      navigate("/auth?next=/upload");
    }
  }, [session, navigate]);

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

  const handleJobTitleChange = (value: string) => {
    setJobTitle(value);
    if (touched.jobTitle) {
      setFieldErrors((prev) => ({
        ...prev,
        jobTitle: validateJobTitle(value),
      }));
    }
  };

  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value);
    if (touched.jobDescription) {
      setFieldErrors((prev) => ({
        ...prev,
        jobDescription: validateJobDescription(value),
      }));
    }
  };

  const handleAnalyze = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isProcessing) return;

    setTouched({
      jobTitle: true,
      jobDescription: true,
      file: true,
    });

    const jobTitleError = validateJobTitle(jobTitle);
    const jobDescriptionError = validateJobDescription(jobDescription);
    const fileError = validateFile(file);

    setFieldErrors({
      jobTitle: jobTitleError,
      jobDescription: jobDescriptionError,
      file: fileError,
    });

    if (jobTitleError || jobDescriptionError || fileError) {
      return;
    }

    setIsProcessing(true);
    setStatusText("Uploading resume to server...");

    try {
      const result = await resumeApi.analyze({
        file: file!,
        job_title: jobTitle,
        job_description: jobDescription,
        company_name: companyName || undefined,
      });

      toast.success("Analysis complete", {
        description: "Your resume has been analyzed successfully.",
      });

      navigate(`/resume/${result.resume_id}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Analysis failed", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
      setStatusText("Upload your resume to begin");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportFromSite = async (url: string) => {
    toast.info("Job import feature", {
      description:
        "Job import is currently unavailable. Please paste the job description manually.",
    });
    setImportModalOpen(false);
  };

  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <section className="page-shell gap-16">
        <header className="mx-auto flex w-full max-w-2xl flex-col gap-6 text-center">
          <span className="section-eyebrow mx-auto">Smart analysis</span>
          <h1 className="headline text-4xl">
            Upload your resume and land the interview faster
          </h1>
          <p className="subheadline">
            Get detailed ATS feedback, line-by-line improvements, and a
            personalized cold outreach message—all in under 60 seconds.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section className="flex flex-col gap-8">
            <form
              id="upload-form"
              className="surface-card space-y-8"
              onSubmit={handleAnalyze}
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="company"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Company name{" "}
                    <span className="text-xs font-medium text-slate-500">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="e.g. Stripe"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={isProcessing}
                    className="form-input"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="title"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Job title{" "}
                    <span className="text-xs font-medium text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={jobTitle}
                    onChange={(e) => handleJobTitleChange(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, jobTitle: true }))
                    }
                    disabled={isProcessing}
                    className={cn(
                      "form-input",
                      touched.jobTitle &&
                        fieldErrors.jobTitle &&
                        "form-input--error",
                    )}
                    required
                  />
                  {touched.jobTitle && fieldErrors.jobTitle && (
                    <p className="text-sm text-red-600">
                      {fieldErrors.jobTitle}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-end justify-between">
                    <label
                      htmlFor="description"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Job description{" "}
                      <span className="text-xs font-medium text-red-500">
                        *
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setImportModalOpen(true)}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Import from URL
                    </button>
                  </div>
                  <textarea
                    id="description"
                    rows={8}
                    placeholder="Paste the full job posting here for the most tailored advice..."
                    value={jobDescription}
                    onChange={(e) => handleJobDescriptionChange(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, jobDescription: true }))
                    }
                    disabled={isProcessing}
                    className={cn(
                      "form-input resize-none",
                      touched.jobDescription &&
                        fieldErrors.jobDescription &&
                        "form-input--error",
                    )}
                    required
                  />
                  {touched.jobDescription && fieldErrors.jobDescription && (
                    <p className="text-sm text-red-600">
                      {fieldErrors.jobDescription}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <FileUploader
                  onFileSelect={handleFileSelect}
                  disabled={isProcessing}
                  error={touched.file ? fieldErrors.file : undefined}
                />
                <p
                  className={cn(
                    "text-center text-sm font-medium",
                    isProcessing ? "text-indigo-600" : "text-slate-500",
                  )}
                  aria-live="polite"
                >
                  {statusText}
                </p>
              </div>

              <button
                type="submit"
                className="primary-button w-full"
                disabled={isProcessing || !file}
              >
                {isProcessing ? "Analyzing..." : "Analyze resume"}
              </button>
            </form>
          </section>

          <aside className="flex flex-col gap-8">
            <div className="surface-card surface-card--tight space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">
                What to expect
              </p>
              <ul className="space-y-4">
                {checklist.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                      <svg
                        className="h-3 w-3 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-slate-700">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6">
              <p className="text-sm font-semibold text-slate-700">
                Privacy first
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Your resume is processed securely and stored privately. Delete
                any analysis instantly from your dashboard.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <ImportFromSiteModal
        isOpen={importModalOpen}
        onCancel={() => setImportModalOpen(false)}
        onImport={handleImportFromSite}
      />
    </main>
  );
};

export default Upload;
