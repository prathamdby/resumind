"use client";

import { useEffect, useState } from "react";

interface RegenerateColdDMModalProps {
  isOpen: boolean;
  onConfirm: (feedback: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const RegenerateColdDMModal = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading,
}: RegenerateColdDMModalProps) => {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setFeedback("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const trimmed = feedback.trim();
    if (!trimmed) {
      setError("Please provide feedback for regeneration");
      return;
    }
    if (trimmed.length < 10) {
      setError("Feedback must be at least 10 characters");
      return;
    }
    if (trimmed.length > 500) {
      setError("Feedback must be under 500 characters");
      return;
    }
    setError("");
    onConfirm(trimmed);
  };

  const handleCancel = () => {
    setFeedback("");
    setError("");
    onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleCancel}
    >
      <div
        className="surface-card surface-card--tight mx-4 w-full max-w-lg space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">
            Regenerate Cold DM
          </h2>
          <p className="text-sm text-slate-600">
            Tell the AI how you'd like to improve the cold outreach message. Be
            specific about changes you want (tone, structure, emphasis, etc.).
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="feedback"
            className="block text-sm font-medium text-slate-700"
          >
            Your feedback
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
              setError("");
            }}
            placeholder="e.g., Make it more concise and emphasize my backend experience..."
            className="input-field min-h-[120px] resize-y whitespace-pre-wrap"
            disabled={isLoading}
            maxLength={500}
          />
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <p className="text-xs text-slate-500">
            {feedback.length}/500 characters
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 rounded-full border border-indigo-200/70 bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-200/70 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Regenerating..." : "Regenerate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegenerateColdDMModal;
