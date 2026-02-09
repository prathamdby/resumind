"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { toast } from "sonner";
import { updateCoverLetter, deleteCoverLetter } from "@/lib/api";
import { getTemplateById } from "@/constants/cover-letter-templates";
import { COVER_LETTER_TEMPLATES } from "@/constants/cover-letter-templates";
import {
  ArrowLeft,
  Clipboard,
  Check,
  Trash2,
  Download,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import CoverLetterControls from "./CoverLetterControls";
import CoverLetterPreview from "./CoverLetterPreview";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";
import { coverLetterToPlainText, exportCoverLetterPDF } from "@/app/lib/utils";
import type { CoverLetterContent, CoverLetterTemplate } from "@/types";

interface CoverLetterEditorProps {
  id: string;
  initialContent: CoverLetterContent;
  initialTemplate: CoverLetterTemplate;
  updatedAt: string;
  jobTitle: string;
}

type SaveStatus = "saved" | "saving" | "unsaved" | "conflict";

const STATUS_LABEL: Record<SaveStatus, string> = {
  saved: "Saved",
  saving: "Saving\u2026",
  unsaved: "Unsaved",
  conflict: "Conflict",
};

export default function CoverLetterEditor({
  id,
  initialContent,
  initialTemplate,
  updatedAt: initialUpdatedAt,
  jobTitle,
}: CoverLetterEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState<CoverLetterContent>(initialContent);
  const [template, setTemplate] =
    useState<CoverLetterTemplate>(initialTemplate);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isExporting, setIsExporting] = useState(false);

  const updatedAtRef = useRef(initialUpdatedAt);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveStatusRef = useRef<SaveStatus>("saved");
  const contentRef = useRef(content);
  contentRef.current = content;

  const save = useCallback(async () => {
    if (
      saveStatusRef.current === "conflict" ||
      saveStatusRef.current === "saving"
    )
      return;
    saveStatusRef.current = "saving";
    setSaveStatus("saving");
    try {
      const result = await updateCoverLetter(
        id,
        contentRef.current,
        updatedAtRef.current,
      );
      updatedAtRef.current = result.updatedAt;
      saveStatusRef.current = "saved";
      setSaveStatus("saved");
    } catch (error) {
      if (error instanceof Error && error.message === "CONFLICT") {
        saveStatusRef.current = "conflict";
        setSaveStatus("conflict");
        toast.error("Content was modified elsewhere. Refresh to see latest.");
      } else {
        saveStatusRef.current = "unsaved";
        setSaveStatus("unsaved");
      }
    }
  }, [id]);

  const debouncedSave = useCallback(() => {
    saveStatusRef.current = "unsaved";
    setSaveStatus("unsaved");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(save, 1500);
  }, [save]);

  const handleContentChange = useCallback(
    (updates: Partial<CoverLetterContent>) => {
      setContent((prev) => ({
        ...prev,
        ...updates,
        header: { ...prev.header, ...(updates.header || {}) },
      }));
      debouncedSave();
    },
    [debouncedSave],
  );

  const handleContentReplace = useCallback(
    (newContent: CoverLetterContent) => {
      setContent(newContent);
      debouncedSave();
    },
    [debouncedSave],
  );

  const handleTemplateSwitch = useCallback((templateId: string) => {
    const t = getTemplateById(templateId);
    if (t) setTemplate(t);
  }, []);

  const handleCopy = async () => {
    const text = coverLetterToPlainText(content);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await exportCoverLetterPDF(content, template, `${jobTitle} - Cover Letter.pdf`);
    } catch (error) {
      toast.error("PDF export failed", {
        description:
          error instanceof Error ? error.message : "Unknown export error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted");
      router.push("/app/cover-letter");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-white/60 bg-white/85 px-3 py-2.5 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex items-center gap-2 sm:gap-4">
            <Link href="/app/cover-letter" className="back-button shrink-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Cover Letters</span>
            </Link>
            <h1 className="hidden min-w-0 truncate text-sm font-semibold text-slate-700 sm:block sm:text-base">
              {jobTitle}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Save indicator pill */}
            <span className="hidden items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm sm:inline-flex">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  saveStatus === "saved" && "bg-emerald-400",
                  saveStatus === "saving" && "animate-pulse bg-amber-400",
                  saveStatus === "unsaved" && "bg-amber-400",
                  saveStatus === "conflict" && "bg-red-400",
                )}
              />
              <span
                className={cn(
                  saveStatus === "saved" && "text-emerald-600",
                  saveStatus === "saving" && "text-slate-500",
                  saveStatus === "unsaved" && "text-amber-600",
                  saveStatus === "conflict" && "text-red-600",
                )}
              >
                {STATUS_LABEL[saveStatus]}
              </span>
            </span>

            <button
              onClick={handleCopy}
              className="back-button gap-2 px-2.5 sm:px-3"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Clipboard className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Copy</span>
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="back-button gap-2 px-2.5 sm:px-3"
              title="Download PDF"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="back-button border-red-200/70 px-2.5 text-red-400 hover:bg-red-50 hover:text-red-600 sm:px-3"
              title="Delete cover letter"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <h1 className="mt-2 min-w-0 truncate text-sm font-semibold text-slate-700 sm:hidden">
          {jobTitle}
        </h1>
      </div>

      {/* Mobile tab switcher */}
      <div className="sticky top-[84px] z-30 flex border-b border-white/50 bg-white/80 backdrop-blur-md sm:top-[57px] lg:hidden">
        <button
          onClick={() => setActiveTab("edit")}
          className={cn(
            "flex-1 py-3 text-center text-sm font-medium transition-colors",
            activeTab === "edit"
              ? "border-b-[3px] border-indigo-500 text-indigo-600 shadow-[0_2px_8px_-2px_rgba(79,70,229,0.3)]"
              : "text-slate-500",
          )}
        >
          Edit
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={cn(
            "flex-1 py-3 text-center text-sm font-medium transition-colors",
            activeTab === "preview"
              ? "border-b-[3px] border-indigo-500 text-indigo-600 shadow-[0_2px_8px_-2px_rgba(79,70,229,0.3)]"
              : "text-slate-500",
          )}
        >
          Preview
        </button>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-1 lg:grid lg:grid-cols-[380px_1fr]">
        {/* Left panel: Controls */}
        <div
          className={cn(
            "cl-controls flex-1",
            activeTab !== "edit" && "hidden lg:block",
          )}
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(111,122,255,0.04), transparent 60%)",
          }}
        >
          <CoverLetterControls
            coverletterId={id}
            content={content}
            template={template}
            allTemplates={COVER_LETTER_TEMPLATES}
            onChange={handleContentChange}
            onContentReplace={handleContentReplace}
            onTemplateSwitch={handleTemplateSwitch}
          />
        </div>

        {/* Right panel: Preview */}
        <div
          className={cn(
            "flex-1",
            activeTab !== "preview" && "hidden lg:block",
          )}
        >
          <CoverLetterPreview content={content} template={template} />
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        title={jobTitle}
      />
    </div>
  );
}
