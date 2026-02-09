"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/app/lib/utils";
import { toast } from "sonner";
import { regenerateSection } from "@/lib/api";
import { RefreshCw, Plus, Minus, Loader2 } from "lucide-react";
import type { CoverLetterContent, CoverLetterTemplate } from "@/types";

interface CoverLetterControlsProps {
  coverletterId: string;
  content: CoverLetterContent;
  template: CoverLetterTemplate;
  allTemplates: CoverLetterTemplate[];
  onChange: (updates: Partial<CoverLetterContent>) => void;
  onContentReplace: (content: CoverLetterContent) => void;
  onTemplateSwitch: (templateId: string) => void;
}

function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  minRows = 2,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="textarea-field min-h-0! resize-none"
      placeholder={placeholder}
      rows={minRows}
    />
  );
}

function SectionEditor({
  label,
  value,
  onChange,
  coverletterId,
  section,
  onContentReplace,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  coverletterId: string;
  section: "opening" | "closing";
  onContentReplace: (content: CoverLetterContent) => void;
  placeholder?: string;
}) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const result = await regenerateSection(
        coverletterId,
        section,
        feedback.trim() || undefined,
      );
      onContentReplace(result.content);
      setShowFeedback(false);
      setFeedback("");
      toast.success(`${label} regenerated`);
    } catch {
      toast.error(`Failed to regenerate ${label.toLowerCase()}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
          {label}
        </span>
        <button
          onClick={() => setShowFeedback(!showFeedback)}
          disabled={isRegenerating}
          className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100/60 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-indigo-600 backdrop-blur-sm transition-all hover:bg-indigo-50 hover:shadow-sm disabled:opacity-50"
        >
          {isRegenerating ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3" />
          )}
          Regenerate
        </button>
      </div>

      <AutoResizeTextarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {showFeedback && (
        <div className="surface-card surface-card--tight flex flex-col gap-2">
          <input
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Optional: e.g. make it shorter, more technical..."
            className="input-field rounded-xl! py-2! text-sm!"
          />
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="self-end rounded-full bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-600 disabled:opacity-60"
          >
            {isRegenerating ? "Rewriting..." : "Rewrite"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function CoverLetterControls({
  coverletterId,
  content,
  template,
  allTemplates,
  onChange,
  onContentReplace,
  onTemplateSwitch,
}: CoverLetterControlsProps) {
  const [isRegeneratingBody, setIsRegeneratingBody] = useState(false);

  const handleHeaderChange = useCallback(
    (field: keyof CoverLetterContent["header"], value: string) => {
      onChange({
        header: { ...content.header, [field]: value },
      });
    },
    [content.header, onChange],
  );

  const handleBodyParagraphChange = useCallback(
    (index: number, value: string) => {
      const updated = [...content.bodyParagraphs];
      updated[index] = value;
      onChange({ bodyParagraphs: updated });
    },
    [content.bodyParagraphs, onChange],
  );

  const addBodyParagraph = useCallback(() => {
    if (content.bodyParagraphs.length >= 4) return;
    onChange({
      bodyParagraphs: [...content.bodyParagraphs, ""],
    });
  }, [content.bodyParagraphs, onChange]);

  const removeBodyParagraph = useCallback(
    (index: number) => {
      if (content.bodyParagraphs.length <= 1) return;
      onChange({
        bodyParagraphs: content.bodyParagraphs.filter((_, i) => i !== index),
      });
    },
    [content.bodyParagraphs, onChange],
  );

  const handleRegenerateBody = async () => {
    setIsRegeneratingBody(true);
    try {
      const result = await regenerateSection(coverletterId, "body");
      onContentReplace(result.content);
      toast.success("Body paragraphs regenerated");
    } catch {
      toast.error("Failed to regenerate body paragraphs");
    } finally {
      setIsRegeneratingBody(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-6">
      {/* Template switcher */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
          Template
        </span>
        <div className="grid grid-cols-3 gap-2">
          {allTemplates.map((t) => {
            const isActive = template.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onTemplateSwitch(t.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-center transition-all duration-200",
                  isActive
                    ? "border-transparent bg-white"
                    : "border-white/50 bg-white/60 hover:bg-white/90",
                )}
                style={
                  isActive
                    ? {
                        boxShadow: `0 0 0 2px ${t.accentColor}, 0 4px 12px -4px ${t.accentColor}44`,
                      }
                    : undefined
                }
              >
                <div
                  className="h-1.5 w-full rounded-full"
                  style={{ background: t.accentGradient }}
                />
                <span
                  className={cn(
                    "text-[11px] leading-tight font-medium",
                    isActive ? "text-slate-900" : "text-slate-500",
                  )}
                >
                  {t.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Header fields */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
          Header
        </span>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="form-div">
            <label className="input-label">Name</label>
            <input
              type="text"
              value={content.header.fullName}
              onChange={(e) => handleHeaderChange("fullName", e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-div">
            <label className="input-label">Title</label>
            <input
              type="text"
              value={content.header.title}
              onChange={(e) => handleHeaderChange("title", e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-div">
            <label className="input-label">Email</label>
            <input
              type="email"
              value={content.header.email}
              onChange={(e) => handleHeaderChange("email", e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-div">
            <label className="input-label">Phone</label>
            <input
              type="tel"
              value={content.header.phone}
              onChange={(e) => handleHeaderChange("phone", e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-div sm:col-span-2">
            <label className="input-label">Location</label>
            <input
              type="text"
              value={content.header.location}
              onChange={(e) => handleHeaderChange("location", e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Recipient */}
      <div className="form-div">
        <label className="input-label">Recipient</label>
        <input
          type="text"
          value={content.recipientName}
          onChange={(e) => onChange({ recipientName: e.target.value })}
          className="input-field"
          placeholder="Hiring Manager"
        />
      </div>

      {/* Opening */}
      <SectionEditor
        label="Opening"
        value={content.opening}
        onChange={(v) => onChange({ opening: v })}
        coverletterId={coverletterId}
        section="opening"
        onContentReplace={onContentReplace}
        placeholder="Your opening paragraph..."
      />

      {/* Body Paragraphs */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
            Body Paragraphs
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                removeBodyParagraph(content.bodyParagraphs.length - 1)
              }
              disabled={content.bodyParagraphs.length <= 1}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/80 text-slate-400 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30"
              title="Remove last paragraph"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={addBodyParagraph}
              disabled={content.bodyParagraphs.length >= 4}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/80 text-slate-400 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30"
              title="Add paragraph"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {content.bodyParagraphs.map((paragraph, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-slate-400">
              Paragraph {i + 1}
            </span>
            <AutoResizeTextarea
              value={paragraph}
              onChange={(v) => handleBodyParagraphChange(i, v)}
              placeholder={`Body paragraph ${i + 1}...`}
              minRows={3}
            />
          </div>
        ))}

        {/* Regenerate all body */}
        <button
          onClick={handleRegenerateBody}
          disabled={isRegeneratingBody}
          className="inline-flex items-center gap-2 self-start rounded-full border border-indigo-100/60 bg-white/80 px-3.5 py-2 text-xs font-semibold text-indigo-600 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
        >
          {isRegeneratingBody ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Regenerate all body paragraphs
        </button>
      </div>

      {/* Closing */}
      <SectionEditor
        label="Closing"
        value={content.closing}
        onChange={(v) => onChange({ closing: v })}
        coverletterId={coverletterId}
        section="closing"
        onContentReplace={onContentReplace}
        placeholder="Your closing paragraph..."
      />
    </div>
  );
}
