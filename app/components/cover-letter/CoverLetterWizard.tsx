"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import { generateCoverLetter, importJobFromUrl, importJobFromPdf } from "@/lib/api";
import { ArrowLeft, ArrowRight, Sparkles, Globe } from "lucide-react";
import TemplateGallery from "./TemplateGallery";
import ImportJobModal from "@/app/components/ImportJobModal";

interface CoverLetterWizardProps {
  resumes: Array<{ id: string; jobTitle: string; companyName?: string }>;
  user: { name: string; email: string };
}

export default function CoverLetterWizard({
  resumes,
  user,
}: CoverLetterWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Step 1
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Step 2
  const [fullName, setFullName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [recipientName, setRecipientName] = useState("Hiring Manager");

  const canAdvance = selectedTemplate !== null;
  const canSubmit =
    fullName.trim() &&
    email.trim() &&
    phone.trim() &&
    location.trim() &&
    jobTitle.trim();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !canSubmit) return;

    setIsGenerating(true);
    try {
      const result = await generateCoverLetter({
        templateId: selectedTemplate,
        jobTitle: jobTitle.trim(),
        companyName: companyName.trim() || undefined,
        jobDescription: jobDescription.trim() || undefined,
        resumeId: selectedResumeId || undefined,
        header: {
          fullName: fullName.trim(),
          title: jobTitle.trim(),
          email: email.trim(),
          phone: phone.trim(),
          location: location.trim(),
        },
      });

      router.push(`/cover-letter/${result.id}`);
    } catch (error) {
      toast.error("Generation failed", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
      setIsGenerating(false);
    }
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

  return (
    <div className="relative">
      {/* Generation overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
          {/* Decorative blobs */}
          <div
            className="pointer-events-none absolute left-[15%] top-[20%] h-64 w-64 rounded-full bg-indigo-200/20 blur-3xl"
            style={{ animation: "blobMorph1 12s ease-in-out infinite" }}
          />
          <div
            className="pointer-events-none absolute bottom-[20%] right-[15%] h-56 w-56 rounded-full bg-pink-200/15 blur-3xl"
            style={{ animation: "blobMorph2 14s ease-in-out infinite" }}
          />
          <div
            className="pointer-events-none absolute left-[40%] top-[55%] h-48 w-48 rounded-full bg-indigo-100/15 blur-3xl"
            style={{ animation: "blobMorph3 16s ease-in-out infinite" }}
          />

          {/* Frosted glass card */}
          <div className="surface-card relative flex max-w-sm flex-col items-center gap-5 text-center">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500" />
              <Sparkles className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-indigo-500" />
            </div>
            <p className="text-lg font-semibold text-slate-900">
              Crafting your cover letter...
            </p>
            <p className="text-sm text-slate-500">
              This usually takes 5-10 seconds
            </p>
          </div>
        </div>
      )}

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-3">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold shadow-sm transition-colors",
            step >= 1
              ? "primary-gradient text-white shadow-[0_4px_12px_-2px_rgba(96,107,235,0.4)]"
              : "bg-slate-100 text-slate-400",
          )}
        >
          1
        </div>
        <div
          className={cn(
            "h-0.5 w-8 rounded-full transition-colors",
            step >= 2
              ? "bg-linear-to-r from-indigo-400 to-indigo-200"
              : "bg-slate-200",
          )}
        />
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold shadow-sm transition-colors",
            step >= 2
              ? "primary-gradient text-white shadow-[0_4px_12px_-2px_rgba(96,107,235,0.4)]"
              : "bg-slate-100 text-slate-400",
          )}
        >
          2
        </div>
        <span className="ml-3 text-sm font-medium text-slate-500">
          {step === 1 ? "Choose a template" : "Add your details"}
        </span>
      </div>

      {/* Step 1: Template Selection */}
      {step === 1 && (
        <div className="flex flex-col gap-8">
          <TemplateGallery
            selectedId={selectedTemplate}
            onSelect={setSelectedTemplate}
          />

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!canAdvance}
              className="primary-button gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Context Form */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-2 self-start text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to templates
          </button>

          {/* Personal details */}
          <fieldset className="surface-card flex flex-col gap-6">
            <legend className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
              Your details
            </legend>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="form-div">
                <label className="input-label required">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field"
                  placeholder="Emily Johnson"
                  disabled={isGenerating || isImporting}
                />
              </div>
              <div className="form-div">
                <label className="input-label required">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="emily@example.com"
                  disabled={isGenerating || isImporting}
                />
              </div>
              <div className="form-div">
                <label className="input-label required">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  placeholder="+1 (234) 555-1234"
                  disabled={isGenerating || isImporting}
                />
              </div>
              <div className="form-div">
                <label className="input-label required">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field"
                  placeholder="New York, NY"
                  disabled={isGenerating || isImporting}
                />
              </div>
            </div>
          </fieldset>

          {/* Job details */}
          <fieldset className="surface-card flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <legend className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
                Job details
              </legend>
              <button
                type="button"
                onClick={() => setImportModalOpen(true)}
                disabled={isGenerating || isImporting}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-50 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Globe className="h-4 w-4" />
                Import details
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="form-div">
                <label className="input-label required">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="input-field"
                  placeholder="Software Engineer"
                  disabled={isGenerating || isImporting}
                />
              </div>
              <div className="form-div">
                <label className="input-label">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="input-field"
                  placeholder="Acme Corp"
                  disabled={isGenerating || isImporting}
                />
              </div>
            </div>

            <div className="form-div">
              <label className="input-label">Recipient Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="input-field"
                placeholder="Hiring Manager"
                disabled={isGenerating || isImporting}
              />
            </div>

            <div className="form-div">
              <label className="input-label">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="textarea-field"
                placeholder="Paste the job description here for a more tailored letter..."
                rows={5}
                disabled={isGenerating || isImporting}
              />
            </div>

            {resumes.length > 0 && (
              <div className="form-div">
                <label className="input-label">
                  Pull context from a resume
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="input-field"
                  disabled={isGenerating || isImporting}
                >
                  <option value="">None -- write from scratch</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.jobTitle}
                      {r.companyName ? ` at ${r.companyName}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </fieldset>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!canSubmit || isGenerating || isImporting}
              className="primary-button gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Generate Cover Letter
            </button>
          </div>
        </form>
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
