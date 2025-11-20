"use client";

interface ModalActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmLoadingLabel?: string;
  isLoading?: boolean;
  confirmVariant?: "primary" | "danger";
}

const ModalActions = ({
  onCancel,
  onConfirm,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  confirmLoadingLabel,
  isLoading = false,
  confirmVariant = "primary",
}: ModalActionsProps) => {
  const confirmClasses =
    confirmVariant === "danger"
      ? "border-red-200/70 bg-red-600 hover:bg-red-700 focus-visible:ring-red-200/70"
      : "border-indigo-200/70 bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-200/70";

  return (
    <div className="flex gap-3">
      <button
        onClick={onCancel}
        disabled={isLoading}
        className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cancelLabel}
      </button>
      <button
        onClick={onConfirm}
        disabled={isLoading}
        className={`flex-1 rounded-full border px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${confirmClasses}`}
      >
        {isLoading ? confirmLoadingLabel || confirmLabel : confirmLabel}
      </button>
    </div>
  );
};

export default ModalActions;
