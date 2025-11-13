"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function Tooltip({
  content,
  children,
  className,
  disabled,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const scheduleOpen = useCallback(() => {
    if (disabled) return;
    clearTimer();
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(true);
    }, 120);
  }, [disabled]);

  const close = useCallback(() => {
    clearTimer();
    setIsOpen(false);
  }, []);

  return (
    <span className={cn("relative inline-flex flex-1", className)}>
      <span
        onMouseEnter={scheduleOpen}
        onMouseLeave={close}
        onFocus={scheduleOpen}
        onBlur={close}
        onTouchStart={scheduleOpen}
        onTouchEnd={close}
        className="inline-flex flex-1"
      >
        {children}
      </span>
      {isOpen && !disabled && (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[200px] -translate-x-1/2 rounded-lg border border-indigo-100/80 bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.25)] backdrop-blur-sm"
        >
          {content}
        </span>
      )}
    </span>
  );
}
