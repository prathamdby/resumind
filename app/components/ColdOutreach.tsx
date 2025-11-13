"use client";

import { useEffect, useState } from "react";
import { Copy, Check, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import RegenerateColdDMModal from "@/app/components/RegenerateColdDMModal";

interface ColdOutreachProps {
  message: string;
  resumeId: string;
}

const ColdOutreach = ({ message, resumeId }: ColdOutreachProps) => {
  const [currentMessage, setCurrentMessage] = useState(message);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    setCurrentMessage(message);
    setCopied(false);
  }, [message]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentMessage);
      setCopied(true);
      toast.success("Copied to clipboard", {
        description: "The message is ready to paste into LinkedIn.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy", {
        description: "Please try selecting and copying the text manually.",
      });
    }
  };

  const handleRegenerate = async (userFeedback: string) => {
    setIsRegenerating(true);
    const toastId = toast.loading("Regenerating cold DM...");

    try {
      const response = await fetch("/api/regenerate-cold-dm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeId, userFeedback }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success || !data.coldOutreachMessage) {
        const errorMessage =
          data?.error || "Failed to regenerate cold DM. Please try again.";
        throw new Error(errorMessage);
      }

      setCurrentMessage(data.coldOutreachMessage);
      setCopied(false);
      setIsModalOpen(false);

      toast.success("Cold DM updated", {
        description: "Review and personalize before sending.",
        id: toastId,
      });
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Please try again.";
      toast.error("Regeneration failed", {
        description,
        id: toastId,
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="group relative">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50/50 to-white p-6">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
              {currentMessage}
            </div>
          </div>
          <div className="absolute right-2 top-2 flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold text-indigo-600 shadow-sm transition-all duration-150 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:focus-visible:opacity-100"
              type="button"
              aria-label="Copy cold outreach message"
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
              aria-label="Regenerate cold outreach message"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-indigo-100 bg-white/95 text-indigo-600 shadow-sm transition-all duration-150 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:focus-visible:opacity-100"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/60 bg-white/80 px-5 py-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Tip</p>
          <p className="mt-1">
            Before sending, add a line referencing a recent company
            announcement, project, or something specific from the hiring
            manager&apos;s profile to stand out even more.
          </p>
        </div>
      </div>

      <RegenerateColdDMModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleRegenerate}
        isLoading={isRegenerating}
      />
    </>
  );
};

export default ColdOutreach;
