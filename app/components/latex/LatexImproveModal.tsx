"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import type { LineImprovement } from "@/types";
import LatexToolbar from "./LatexToolbar";
import LatexStatusBar from "./LatexStatusBar";
import LatexEditor from "./LatexEditor";
import LatexPreview from "./LatexPreview";

interface LatexImproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  lineImprovements: LineImprovement[];
  resumeId: string;
  jobTitle: string;
  companyName?: string;
}

function getStorageKey(resumeId: string) {
  return `resumind-latex:${resumeId}`;
}

export default function LatexImproveModal({
  isOpen,
  onClose,
  lineImprovements,
  resumeId,
  jobTitle,
  companyName,
}: LatexImproveModalProps) {
  const [latexCode, setLatexCode] = useState("");
  const [originalCode, setOriginalCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [debouncedCode, setDebouncedCode] = useState("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!isOpen) return;
    const saved = localStorage.getItem(getStorageKey(resumeId));
    if (saved) {
      setLatexCode(saved);
      setOriginalCode(saved);
      setDebouncedCode(saved);
    }
  }, [isOpen, resumeId]);

  useEffect(() => {
    if (!isOpen || !latexCode) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem(getStorageKey(resumeId), latexCode);
      setLastSaved(new Date());
    }, 3000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [latexCode, resumeId, isOpen]);

  useEffect(() => {
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    previewTimerRef.current = setTimeout(() => {
      setDebouncedCode(latexCode);
    }, 400);

    return () => {
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    };
  }, [latexCode]);

  const handleApplySuggestions = useCallback(async () => {
    if (!latexCode.trim() || isApplying) return;

    setIsApplying(true);
    setApplyError(null);
    setOriginalCode(latexCode);

    const response = await fetch("/api/latex/improve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latexCode,
        lineImprovements,
        jobTitle,
        companyName,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const message = data?.error || "Failed to apply suggestions";
      setApplyError(message);
      toast.error(message);
      setIsApplying(false);
      return;
    }

    const result = await response.json();
    setLatexCode(result.improvedLatex);
    setDebouncedCode(result.improvedLatex);
    toast.success(`Applied ${result.changesApplied} improvements across ${result.sectionsModified.length} sections`);
    setIsApplying(false);
  }, [latexCode, isApplying, lineImprovements, jobTitle, companyName]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(latexCode);
    toast.success("Copied to clipboard");
  }, [latexCode]);

  const handleReset = useCallback(() => {
    if (originalCode) {
      setLatexCode(originalCode);
      setDebouncedCode(originalCode);
      toast("Reverted to previous version");
    }
  }, [originalCode]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleApplySuggestions();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        localStorage.setItem(getStorageKey(resumeId), latexCode);
        setLastSaved(new Date());
        toast.success("Saved");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleApplySuggestions, resumeId, latexCode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const hasChanges = latexCode !== originalCode && originalCode !== "";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
      style={{ animation: "fadeIn 200ms ease-out" }}
      onClick={onClose}
    >
      <div
        className="latex-modal-container mx-4 flex h-[92vh] w-full max-w-[1440px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-white/40 bg-white/95 shadow-[var(--shadow-soft)] backdrop-blur-xl"
        style={{ animation: "landingScaleIn 200ms ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <LatexToolbar
          onApplySuggestions={handleApplySuggestions}
          onCopyCode={handleCopy}
          onReset={handleReset}
          onClose={onClose}
          isApplying={isApplying}
          hasCode={latexCode.trim().length > 0}
          hasChanges={hasChanges}
          suggestionsCount={lineImprovements.length}
        />

        <div className="flex flex-1 overflow-hidden max-md:flex-col">
          <div className="flex-1 overflow-auto border-r border-slate-200/50 bg-slate-50/80 max-md:max-h-[50%] max-md:border-b max-md:border-r-0">
            <LatexEditor
              value={latexCode}
              onChange={setLatexCode}
              readOnly={isApplying}
            />
          </div>

          <div className="flex-1 overflow-auto bg-white">
            <LatexPreview latexCode={debouncedCode} />
          </div>
        </div>

        <LatexStatusBar
          charCount={latexCode.length}
          lastSaved={lastSaved}
          error={applyError}
        />
      </div>
    </div>,
    document.body,
  );
}
