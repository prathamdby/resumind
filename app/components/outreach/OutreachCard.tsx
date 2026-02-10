"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { Trash2, MessageSquare, Mail, Users, Reply } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { toast } from "sonner";
import { deleteOutreach } from "@/lib/api";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";
import { OUTREACH_CHANNELS, OUTREACH_TONES } from "@/constants/outreach";
import type { OutreachChannel } from "@/types";

interface OutreachCardProps {
  outreach: {
    id: string;
    channel: string;
    tone: string;
    jobTitle: string;
    companyName?: string | null;
    content: string;
    createdAt: string;
  };
}

const CHANNEL_ICONS: Record<OutreachChannel, typeof MessageSquare> = {
  "linkedin-dm": MessageSquare,
  "cold-email": Mail,
  networking: Users,
  "follow-up": Reply,
};

const ACCENT_GRADIENTS: Record<string, string> = {
  sky: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
  slate: "linear-gradient(135deg, #94a3b8, #64748b)",
  emerald: "linear-gradient(135deg, #34d399, #10b981)",
  amber: "linear-gradient(135deg, #fbbf24, #f59e0b)",
};

function OutreachCardInner({ outreach }: OutreachCardProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const channelConfig = OUTREACH_CHANNELS.find(
    (c) => c.id === outreach.channel,
  );
  const toneConfig = OUTREACH_TONES.find((t) => t.id === outreach.tone);
  const Icon =
    CHANNEL_ICONS[outreach.channel as OutreachChannel] || MessageSquare;
  const accentGradient =
    ACCENT_GRADIENTS[channelConfig?.accentColor ?? "slate"] ??
    ACCENT_GRADIENTS.slate;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteOutreach(outreach.id);
      toast.success("Message deleted");
      setShowDeleteModal(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(outreach.createdAt).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" },
  );

  const preview =
    outreach.content.length > 120
      ? outreach.content.slice(0, 120) + "..."
      : outreach.content;

  return (
    <>
      <div className={cn("group resume-card relative")}>
        {/* Accent strip */}
        <div
          className="absolute inset-x-0 top-0 h-1.5 rounded-t-card"
          style={{ background: accentGradient }}
        />

        <Link
          href={`/app/outreach/${outreach.id}`}
          className="flex flex-1 flex-col gap-3 pt-2"
        >
          {/* Title block */}
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-slate-900">
              {outreach.jobTitle}
            </h2>
            {outreach.companyName && (
              <p className="truncate text-sm text-slate-500">
                {outreach.companyName}
              </p>
            )}
          </div>

          {/* Channel + tone badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm">
              <Icon className="h-3 w-3" />
              {channelConfig?.name ?? outreach.channel}
            </span>
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
              {toneConfig?.name ?? outreach.tone}
            </span>
          </div>

          {/* Preview */}
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
            {preview}
          </p>

          {/* Footer: date + view CTA */}
          <div className="mt-auto flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">
              {formattedDate}
            </p>
            <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
              View
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </Link>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowDeleteModal(true);
          }}
          disabled={isDeleting}
          className="absolute right-4 top-5 rounded-full p-2 text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
          aria-label="Delete outreach message"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        title={outreach.jobTitle}
      />
    </>
  );
}

const OutreachCard = memo(OutreachCardInner);
export default OutreachCard;
