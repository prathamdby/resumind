"use client";

import { useCallback, type KeyboardEvent } from "react";
import Tooltip from "@/app/components/Tooltip";
import { cn } from "@/app/lib/utils";

export type ReasoningLevel = "low" | "medium" | "high";

interface ReasoningToggleProps {
  value: ReasoningLevel;
  onChange: (value: ReasoningLevel) => void;
  disabled?: boolean;
  className?: string;
}

const OPTIONS: Array<{
  value: ReasoningLevel;
  label: string;
  description: string;
}> = [
  {
    value: "low",
    label: "Low",
    description: "Quick analysis – perfect for rapid iterations",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Balanced depth and speed for most resumes",
  },
  {
    value: "high",
    label: "High",
    description: "Thorough analysis – takes longer to complete",
  },
];

export default function ReasoningToggle({
  value,
  onChange,
  disabled,
  className,
}: ReasoningToggleProps) {
  const handleSelect = useCallback(
    (level: ReasoningLevel) => {
      if (disabled || level === value) return;
      onChange(level);
    },
    [disabled, onChange, value],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (disabled) return;

      const { key } = event;
      const values = OPTIONS.map((option) => option.value);

      if (key === "ArrowRight" || key === "ArrowDown") {
        event.preventDefault();
        const next = (index + 1) % values.length;
        onChange(values[next]);
      } else if (key === "ArrowLeft" || key === "ArrowUp") {
        event.preventDefault();
        const prev = (index - 1 + values.length) % values.length;
        onChange(values[prev]);
      }
    },
    [disabled, onChange],
  );

  return (
    <div
      role="radiogroup"
      aria-label="Analysis depth"
      aria-disabled={disabled || undefined}
      className={cn(
        "inline-flex w-full items-center gap-1 rounded-full border border-indigo-100/70 bg-white/95 p-1.5 shadow-[0_2px_8px_rgba(99,102,241,0.08)] backdrop-blur-sm transition-all",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {OPTIONS.map((option, index) => {
        const isActive = option.value === value;

        return (
          <Tooltip
            key={option.value}
            content={option.description}
            disabled={disabled}
          >
            <button
              type="button"
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/50 focus-visible:ring-offset-2",
                isActive
                  ? "text-white shadow-[0_8px_24px_-8px_rgba(79,70,229,0.4)]"
                  : "text-slate-600 hover:bg-indigo-50/50 hover:text-slate-800",
                disabled && "pointer-events-none",
              )}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    }
                  : undefined
              }
            >
              {option.label}
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
