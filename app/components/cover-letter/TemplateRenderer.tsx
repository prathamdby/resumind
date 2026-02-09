import { cn } from "@/app/lib/utils";
import type { CoverLetterContent, CoverLetterTemplate } from "@/types";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";

interface TemplateRendererProps {
  content: CoverLetterContent;
  template: CoverLetterTemplate;
  scale?: "full" | "thumbnail";
}

function ContactItem({
  icon: Icon,
  value,
  isFirst,
  isStacked,
}: {
  icon: typeof Mail;
  value: string;
  isFirst: boolean;
  isStacked: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.8em] opacity-70">
      {!isFirst && !isStacked && (
        <span className="mr-0.5 text-slate-300" aria-hidden="true">
          ·
        </span>
      )}
      <Icon className="h-[0.9em] w-[0.9em] shrink-0" />
      <span className="truncate">{value}</span>
    </span>
  );
}

export default function TemplateRenderer({
  content,
  template,
  scale = "full",
}: TemplateRendererProps) {
  const {
    header,
    date,
    recipientName,
    opening,
    bodyParagraphs,
    closing,
    signature,
  } = content;
  const isThumbnail = scale === "thumbnail";
  const isStacked = template.headerLayout === "stacked";

  const accentBarNode = (
    <div
      className={cn(
        template.accentBarVariant === "top-bar" && "h-2 w-full rounded-t-md",
        template.accentBarVariant === "underline" && "mx-auto mt-2 h-1 w-20",
        template.accentBarVariant === "left-bar" && "hidden",
      )}
      style={{ background: template.accentGradient }}
    />
  );

  const leftBar = template.accentBarVariant === "left-bar" && (
    <div
      className="absolute left-0 top-0 h-full w-1.5 rounded-l-md"
      style={{ background: template.accentGradient }}
    />
  );

  const contactItems = [
    { icon: Mail, value: header.email },
    { icon: Phone, value: header.phone },
    { icon: MapPin, value: header.location },
    ...(header.linkedin ? [{ icon: Linkedin, value: header.linkedin }] : []),
  ];

  return (
    <div
      className={cn(
        "relative flex flex-col bg-white text-slate-800",
        isThumbnail
          ? "gap-2 p-3 text-[6px] leading-tight"
          : "gap-5 p-10 text-[14px] leading-[1.7] sm:p-12",
      )}
      style={{ "--cl-accent": template.accentColor } as React.CSSProperties}
    >
      {leftBar}

      {/* Top accent bar */}
      {template.accentBarVariant === "top-bar" && accentBarNode}

      {/* Header */}
      <header
        className={cn("flex flex-col", isThumbnail ? "gap-0.5" : "gap-1.5")}
      >
        <h1
          className={cn(
            "tracking-tight text-slate-900",
            template.fontWeight === "bold" ? "font-bold" : "font-semibold",
            isThumbnail ? "text-[9px]" : "text-2xl sm:text-3xl",
          )}
          style={{ color: "var(--cl-accent)" }}
        >
          {header.fullName}
        </h1>

        <p
          className={cn(
            "font-medium text-slate-600",
            isThumbnail ? "text-[6.5px]" : "text-sm",
          )}
        >
          {header.title}
        </p>

        <div
          className={cn(
            "flex flex-wrap text-slate-500",
            isStacked ? "flex-col gap-0.5" : "items-center gap-3",
            isThumbnail ? "gap-1 text-[5px]" : "gap-3 text-xs",
          )}
        >
          {contactItems.map((item, i) => (
            <ContactItem
              key={i}
              icon={item.icon}
              value={item.value}
              isFirst={i === 0}
              isStacked={isStacked}
            />
          ))}
        </div>

        {/* Underline accent bar */}
        {template.accentBarVariant === "underline" && accentBarNode}
      </header>

      {/* Separator */}
      <hr
        className={cn("border-slate-200/60", isThumbnail ? "my-0" : "my-1")}
      />

      {/* Date + Salutation */}
      <div className={cn("flex flex-col", isThumbnail ? "gap-1" : "gap-3")}>
        <p className="text-slate-500">{date}</p>
        <p className="font-medium">Dear {recipientName},</p>
      </div>

      {/* Body */}
      <div className={cn("flex flex-col", isThumbnail ? "gap-1" : "gap-4")}>
        <p>{opening}</p>
        {bodyParagraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* Closing */}
      <div className={cn("flex flex-col", isThumbnail ? "gap-0.5" : "gap-2")}>
        <p>{closing}</p>
        <p className="mt-1 font-medium">Sincerely,</p>
        <p className="font-semibold" style={{ color: "var(--cl-accent)" }}>
          {signature}
        </p>
      </div>
    </div>
  );
}
