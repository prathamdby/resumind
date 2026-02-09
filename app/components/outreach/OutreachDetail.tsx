"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  RefreshCcw,
  ArrowLeft,
  Plus,
  MessageSquare,
  Mail,
  Users,
  Reply,
  Lightbulb,
} from "lucide-react";
import { toast } from "sonner";
import { regenerateOutreach } from "@/lib/api";
import BaseModal from "@/app/components/BaseModal";
import ModalActions from "@/app/components/ModalActions";
import { OUTREACH_CHANNELS, OUTREACH_TONES, CHANNEL_TIPS } from "@/constants/outreach";
import type { OutreachChannel } from "@/types";

interface OutreachDetailProps {
  outreach: {
    id: string;
    channel: string;
    tone: string;
    jobTitle: string;
    companyName?: string | null;
    recipientName?: string | null;
    subject?: string | null;
    content: string;
  };
}

const CHANNEL_ICONS: Record<OutreachChannel, typeof MessageSquare> = {
  "linkedin-dm": MessageSquare,
  "cold-email": Mail,
  networking: Users,
  "follow-up": Reply,
};

export default function OutreachDetail({ outreach }: OutreachDetailProps) {
  const [currentContent, setCurrentContent] = useState(outreach.content);
  const [currentSubject, setCurrentSubject] = useState(outreach.subject ?? "");
  const [copied, setCopied] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState("");

  const channelConfig = OUTREACH_CHANNELS.find(
    (c) => c.id === outreach.channel,
  );
  const toneConfig = OUTREACH_TONES.find((t) => t.id === outreach.tone);
  const Icon =
    CHANNEL_ICONS[outreach.channel as OutreachChannel] || MessageSquare;
  const tips = CHANNEL_TIPS[outreach.channel as OutreachChannel] ?? [];
  const isEmail = outreach.channel === "cold-email";

  const handleCopy = async (text: string, isSubject = false) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isSubject) {
        setCopiedSubject(true);
        setTimeout(() => setCopiedSubject(false), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy", {
        description: "Please try selecting and copying the text manually.",
      });
    }
  };

  const handleRegenerate = async () => {
    const trimmed = feedback.trim();
    if (!trimmed) {
      setFeedbackError("Please provide feedback for regeneration");
      return;
    }
    if (trimmed.length < 10) {
      setFeedbackError("Feedback must be at least 10 characters");
      return;
    }
    if (trimmed.length > 500) {
      setFeedbackError("Feedback must be under 500 characters");
      return;
    }

    setIsRegenerating(true);
    const toastId = toast.loading("Regenerating message...");

    try {
      const result = await regenerateOutreach(outreach.id, trimmed);
      setCurrentContent(result.content);
      if (result.subject) setCurrentSubject(result.subject);
      setCopied(false);
      setIsModalOpen(false);
      setFeedback("");
      setFeedbackError("");

      toast.success("Message updated", {
        description: "Review and personalize before sending.",
        id: toastId,
      });
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Please try again.";
      toast.error("Regeneration failed", { description, id: toastId });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleModalClose = () => {
    if (isRegenerating) return;
    setIsModalOpen(false);
    setFeedback("");
    setFeedbackError("");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* Left -- Message */}
        <div className="flex flex-col gap-6">
          {/* Channel + tone badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-sm">
              <Icon className="h-4 w-4" />
              {channelConfig?.name ?? outreach.channel}
            </span>
            <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600">
              {toneConfig?.name ?? outreach.tone}
            </span>
          </div>

          {/* Subject line (cold-email only) */}
          {isEmail && currentSubject && (
            <div className="group relative rounded-2xl border border-white/40 bg-gradient-to-r from-slate-50 to-white p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Subject
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {currentSubject}
              </p>
              <button
                onClick={() => handleCopy(currentSubject, true)}
                className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold text-indigo-600 shadow-sm transition-all duration-150 hover:bg-indigo-50 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                type="button"
                aria-label="Copy subject"
              >
                {copiedSubject ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedSubject ? "Copied" : "Copy"}
              </button>
            </div>
          )}

          {/* Message body */}
          <div className="group relative">
            <div className="surface-card">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                {currentContent}
              </div>
            </div>

            {/* Action buttons */}
            <div className="absolute right-3 top-3 flex gap-2">
              <button
                onClick={() => handleCopy(currentContent)}
                className="flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold text-indigo-600 shadow-sm transition-all duration-150 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:focus-visible:opacity-100"
                type="button"
                aria-label="Copy message"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                type="button"
                disabled={isRegenerating}
                aria-label="Regenerate message"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-indigo-100 bg-white/95 text-indigo-600 shadow-sm transition-all duration-150 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:focus-visible:opacity-100"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right -- Context sidebar */}
        <div className="flex flex-col gap-6">
          {/* Job details */}
          <div className="surface-card flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Job details
            </p>
            <div className="space-y-2">
              <p className="font-semibold text-slate-900">
                {outreach.jobTitle}
              </p>
              {outreach.companyName && (
                <p className="text-sm text-slate-500">{outreach.companyName}</p>
              )}
              {outreach.recipientName && (
                <p className="text-sm text-slate-500">
                  To: {outreach.recipientName}
                </p>
              )}
            </div>
          </div>

          {/* Tips */}
          {tips.length > 0 && (
            <div className="surface-card flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {channelConfig?.name} tips
                </p>
              </div>
              <ul className="space-y-2">
                {tips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              href="/app/outreach/new"
              className="primary-button justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Compose another
            </Link>
            <Link
              href="/app/outreach"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to outreach
            </Link>
          </div>
        </div>
      </div>

      {/* Regeneration modal */}
      <BaseModal isOpen={isModalOpen} onClose={handleModalClose} maxWidth="lg">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">
            Regenerate message
          </h2>
          <p className="text-sm text-slate-600">
            Tell the AI how you&apos;d like to improve the message. Be specific
            about changes you want (tone, structure, emphasis, etc.).
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="regen-feedback"
            className="block text-sm font-medium text-slate-700"
          >
            Your feedback
          </label>
          <textarea
            id="regen-feedback"
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
              setFeedbackError("");
            }}
            placeholder="e.g., Make it more concise and emphasize my backend experience..."
            className="input-field min-h-[120px] resize-y whitespace-pre-wrap"
            disabled={isRegenerating}
            maxLength={500}
          />
          {feedbackError && (
            <p className="text-xs text-rose-600">{feedbackError}</p>
          )}
          <p className="text-xs text-slate-500">{feedback.length}/500 characters</p>
        </div>

        <ModalActions
          onCancel={handleModalClose}
          onConfirm={handleRegenerate}
          confirmLabel="Regenerate"
          confirmLoadingLabel="Regenerating..."
          isLoading={isRegenerating}
        />
      </BaseModal>
    </>
  );
}
