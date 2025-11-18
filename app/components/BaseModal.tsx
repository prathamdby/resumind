"use client";

import { type ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg";
  contentClassName?: string;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

const BaseModal = ({
  isOpen,
  onClose,
  children,
  maxWidth = "md",
  contentClassName,
}: BaseModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={cn(
          "surface-card surface-card--tight mx-4 w-full space-y-6",
          maxWidthClasses[maxWidth],
          contentClassName,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
