"use client";

import { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import ModalActions from "./ModalActions";

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
    <BaseModal isOpen={isOpen} onClose={handleCancel} maxWidth="lg">
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

      <ModalActions
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        confirmLabel="Regenerate"
        confirmLoadingLabel="Regenerating..."
        isLoading={isLoading}
      />
    </BaseModal>
  );
};

export default RegenerateColdDMModal;
