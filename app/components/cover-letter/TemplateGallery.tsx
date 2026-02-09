"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";
import {
  COVER_LETTER_TEMPLATES,
  TEMPLATE_CATEGORIES,
} from "@/constants/cover-letter-templates";
import TemplateCard from "./TemplateCard";

interface TemplateGalleryProps {
  selectedId: string | null;
  onSelect: (templateId: string) => void;
}

export default function TemplateGallery({
  selectedId,
  onSelect,
}: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? COVER_LETTER_TEMPLATES
      : COVER_LETTER_TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div className="flex flex-col gap-6">
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {TEMPLATE_CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              activeCategory === id
                ? "bg-slate-900 text-white shadow-sm"
                : "border border-white/60 bg-white/60 text-slate-600 shadow-sm backdrop-blur-sm hover:bg-white/90 hover:text-slate-900",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template, i) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedId === template.id}
            onSelect={() => onSelect(template.id)}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
