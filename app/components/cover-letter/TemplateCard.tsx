"use client";

import { cn } from "@/app/lib/utils";
import { Check } from "lucide-react";
import type { CoverLetterTemplate } from "@/types";

interface TemplateCardProps {
  template: CoverLetterTemplate;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

export default function TemplateCard({
  template,
  isSelected,
  onSelect,
  index,
}: TemplateCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden rounded-card border p-5 text-left backdrop-blur-md transition-all duration-300 ease-out",
        isSelected
          ? "border-indigo-300 bg-white/95 shadow-[0_18px_45px_-20px_rgba(96,107,235,0.35)]"
          : "border-white/40 bg-surface-muted shadow-(--shadow-surface) hover:-translate-y-1 hover:shadow-[0_30px_70px_-35px_rgba(15,23,42,0.35)]",
      )}
      style={{
        animationDelay: `${index * 60}ms`,
        animation: "authFadeUp 500ms ease-out both",
      }}
    >
      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white shadow-md">
          <Check className="h-3.5 w-3.5" />
        </div>
      )}

      {/* Mini preview strip */}
      <div
        className="h-2 w-full rounded-full"
        style={{ background: template.accentGradient }}
      />

      {/* Template info */}
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-slate-900">
          {template.name}
        </h3>
        <p className="text-xs text-slate-500">{template.description}</p>
      </div>

      {/* Category badge */}
      <span
        className="mt-auto inline-flex self-start rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-sm"
        style={{
          backgroundColor: `${template.accentColor}14`,
          color: template.accentColor,
          borderColor: `${template.accentColor}22`,
        }}
      >
        {template.category}
      </span>
    </button>
  );
}
