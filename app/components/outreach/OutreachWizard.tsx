"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import { generateOutreach, importJobFromUrl, importJobFromPdf } from "@/lib/api";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Globe,
  MessageSquare,
  Mail,
  Users,
  Reply,
} from "lucide-react";
import ImportJobModal from "@/app/components/ImportJobModal";
import { OUTREACH_CHANNELS, OUTREACH_TONES } from "@/constants/outreach";
import type { OutreachChannel, OutreachTone } from "@/types";

interface OutreachWizardProps {
  resumes: Array<{ id: string; jobTitle: string; companyName?: string }>;
}

const CHANNEL_ICONS: Record<OutreachChannel, typeof MessageSquare> = {
  "linkedin-dm": MessageSquare,
  "cold-email": Mail,
  networking: Users,
  "follow-up": Reply,
};

const ACCENT_CLASSES: Record<string, string> = {
  sky: "bg-sky-100 text-sky-600",
  slate: "bg-slate-100 text-slate-600",
  emerald: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-600",
};

export default function OutreachWizard({ resumes }: OutreachWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const [selectedChannel, setSelectedChannel] =
    useState<OutreachChannel | null>(null);
  const [selectedTone, setSelectedTone] = useState<OutreachTone | null>(null);

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");

  const canAdvance = selectedChannel !== null && selectedTone !== null;
  const canSubmit = jobTitle.trim().length > 0;

  const handleChannelKeyDown = (
    e: KeyboardEvent,
    index: number,
  ) => {
    const channels = OUTREACH_CHANNELS;
    let nextIndex = index;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (index + 1) % channels.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (index - 1 + channels.length) % channels.length;
    } else {
      return;
    }

    setSelectedChannel(channels[nextIndex].id);
    const el = document.getElementById(`channel-${channels[nextIndex].id}`);
    el?.focus();
  };

  const handleToneKeyDown = (
    e: KeyboardEvent,
    index: number,
  ) => {
    const tones = OUTREACH_TONES;
    let nextIndex = index;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (index + 1) % tones.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (index - 1 + tones.length) % tones.length;
    } else {
      return;
    }

    setSelectedTone(tones[nextIndex].id);
    const el = document.getElementById(`tone-${tones[nextIndex].id}`);
    el?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedChannel || !selectedTone || !canSubmit) return;

    setIsGenerating(true);
    try {
      const result = await generateOutreach({
        channel: selectedChannel,
        tone: selectedTone,
        jobTitle: jobTitle.trim(),
        companyName: companyName.trim() || undefined,
        recipientName: recipientName.trim() || undefined,
        jobDescription: jobDescription.trim() || undefined,
        resumeId: selectedResumeId || undefined,
        additionalContext: additionalContext.trim() || undefined,
      });

      router.push(`/app/outreach/${result.id}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes("Too many requests") || msg.includes("rate limit")) {
        toast.error("Rate limit reached", {
          description: "Wait a moment and try again.",
        });
      } else if (msg.includes("timeout") || msg.includes("AI timeout")) {
        toast.error("Generation timed out", {
          description: "Please try again.",
        });
      } else if (msg.includes("Unauthorized")) {
        toast.error("Session expired", {
          description: "Please sign in again.",
        });
      } else {
        toast.error("Generation failed", {
          description: msg || "Please try again",
        });
      }
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
        description:
          "The form has been filled with the extracted information.",
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

      toast.error("Import failed", { description: errorMessage });
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
        description:
          "The form has been filled with the extracted information.",
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

      toast.error("Import failed", { description: errorMessage });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="relative">
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
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

          <div className="surface-card relative flex max-w-sm flex-col items-center gap-5 text-center">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500" />
              <Sparkles className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-indigo-500" />
            </div>
            <p className="text-lg font-semibold text-slate-900">
              Crafting your message...
            </p>
            <p className="text-sm text-slate-500">
              This usually takes 5-10 seconds
            </p>
          </div>
        </div>
      )}

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
          {step === 1 ? "Pick channel and tone" : "Add context"}
        </span>
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <label className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
              Message channel
            </label>
            <div
              role="radiogroup"
              aria-label="Message channel"
              className="grid gap-4 sm:grid-cols-2"
            >
              {OUTREACH_CHANNELS.map((channel, index) => {
                const Icon = CHANNEL_ICONS[channel.id];
                const isSelected = selectedChannel === channel.id;
                return (
                  <div
                    key={channel.id}
                    id={`channel-${channel.id}`}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={isSelected || (!selectedChannel && index === 0) ? 0 : -1}
                    onClick={() => setSelectedChannel(channel.id)}
                    onKeyDown={(e) => handleChannelKeyDown(e, index)}
                    className="channel-card"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          ACCENT_CLASSES[channel.accentColor],
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900">
                          {channel.name}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-500">
                          {channel.description}
                        </p>
                        <span className="mt-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                          {channel.wordRange}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
              Writing tone
            </label>
            <div
              role="radiogroup"
              aria-label="Message tone"
              className="flex flex-wrap gap-3"
            >
              {OUTREACH_TONES.map((tone, index) => {
                const isSelected = selectedTone === tone.id;
                return (
                  <div
                    key={tone.id}
                    id={`tone-${tone.id}`}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={isSelected || (!selectedTone && index === 0) ? 0 : -1}
                    onClick={() => setSelectedTone(tone.id)}
                    onKeyDown={(e) => handleToneKeyDown(e, index)}
                    className="tone-pill"
                    title={tone.description}
                  >
                    {tone.name}
                  </div>
                );
              })}
            </div>
            {selectedTone && (
              <p className="text-sm text-slate-500">
                {OUTREACH_TONES.find((t) => t.id === selectedTone)?.description}
              </p>
            )}
          </div>

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

      {step === 2 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-2 self-start text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to channels
          </button>

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
                placeholder="e.g., Sarah Chen (optional)"
                disabled={isGenerating || isImporting}
              />
            </div>

            <div className="form-div">
              <label className="input-label">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="textarea-field"
                placeholder="Paste the job description here for a more tailored message..."
                rows={5}
                disabled={isGenerating || isImporting}
              />
            </div>
          </fieldset>

          <fieldset className="surface-card flex flex-col gap-6">
            <legend className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
              Context
            </legend>

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

            <div className="form-div">
              <label className="input-label">Additional context</label>
              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                className="textarea-field"
                placeholder="Anything the AI should know: a mutual connection, recent project, specific ask..."
                rows={3}
                maxLength={1000}
                disabled={isGenerating || isImporting}
              />
              <p className="text-xs text-slate-400">
                {additionalContext.length}/1000
              </p>
            </div>
          </fieldset>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!canSubmit || isGenerating || isImporting}
              className="primary-button gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Generate Message
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
