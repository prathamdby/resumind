import TemplateRenderer from "./TemplateRenderer";
import type { CoverLetterContent, CoverLetterTemplate } from "@/types";

interface CoverLetterPreviewProps {
  content: CoverLetterContent;
  template: CoverLetterTemplate;
}

export default function CoverLetterPreview({
  content,
  template,
}: CoverLetterPreviewProps) {
  return (
    <div
      className="relative flex min-h-full items-start justify-center px-4 py-6 sm:px-6 sm:py-10 lg:py-12"
      style={{
        backgroundImage:
          "radial-gradient(circle at 30% 20%, rgba(111,122,255,0.08), transparent 50%), radial-gradient(circle at 70% 80%, rgba(250,113,133,0.07), transparent 50%)",
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="sticky top-6 w-full max-w-2xl">
        <div className="relative overflow-hidden rounded-card border border-white/70 bg-white shadow-[0_32px_80px_-20px_rgba(79,70,229,0.12),0_8px_24px_-8px_rgba(15,23,42,0.08)] transition-all duration-300">
          <TemplateRenderer content={content} template={template} />
        </div>
      </div>
    </div>
  );
}
