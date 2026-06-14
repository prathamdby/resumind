"use client";

import { Wand2, Copy, RotateCcw, X, Check } from "lucide-react";
import { useState } from "react";

interface LatexToolbarProps {
  onApplySuggestions: () => void;
  onCopyCode: () => void;
  onReset: () => void;
  onClose: () => void;
  isApplying: boolean;
  hasCode: boolean;
  hasChanges: boolean;
  suggestionsCount: number;
}

export default function LatexToolbar({
  onApplySuggestions,
  onCopyCode,
  onReset,
  onClose,
  isApplying,
  hasCode,
  hasChanges,
  suggestionsCount,
}: LatexToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyCode();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between border-b border-slate-200/60 bg-white/60 px-5 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onApplySuggestions}
          disabled={isApplying || !hasCode}
          className="latex-toolbar-btn latex-toolbar-btn--primary"
        >
          <Wand2 className="h-3.5 w-3.5" />
          <span>
            {isApplying ? "Applying\u2026" : `Apply ${suggestionsCount} suggestions`}
          </span>
        </button>

        <button
          onClick={handleCopy}
          disabled={!hasCode}
          className="latex-toolbar-btn latex-toolbar-btn--secondary"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>

        <button
          onClick={onReset}
          disabled={!hasChanges}
          className="latex-toolbar-btn latex-toolbar-btn--secondary"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <button
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
