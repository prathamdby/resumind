"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { toast } from "sonner";
import { deleteCoverLetter } from "@/lib/api";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";
import type { CoverLetterTemplate } from "@/types";

interface CoverLetterCardProps {
  coverLetter: {
    id: string;
    templateId: string;
    jobTitle: string;
    companyName?: string | null;
    createdAt: string;
  };
  template?: CoverLetterTemplate;
}

function CoverLetterCardInner({ coverLetter, template }: CoverLetterCardProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCoverLetter(coverLetter.id);
      toast.success("Cover letter deleted");
      setShowDeleteModal(false);
      router.refresh();
    } catch {
      toast.error("Failed to delete cover letter");
    } finally {
      setIsDeleting(false);
    }
  };

  const accentGradient = template?.accentGradient ?? "linear-gradient(135deg, #6f7aff, #4c57e9)";
  const formattedDate = new Date(coverLetter.createdAt).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" },
  );

  return (
    <>
      <div className={cn("group resume-card relative")}>
        {/* Accent strip */}
        <div
          className="absolute inset-x-0 top-0 h-2 rounded-t-card"
          style={{ background: accentGradient }}
        />

        <Link
          href={`/cover-letter/${coverLetter.id}`}
          className="flex flex-1 flex-col gap-4 pt-2"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-semibold text-slate-900">
                {coverLetter.jobTitle}
              </h2>
              {coverLetter.companyName && (
                <p className="truncate text-sm text-slate-500">
                  {coverLetter.companyName}
                </p>
              )}
            </div>
            <span className="shrink-0 rounded-full border border-white/60 bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-500 shadow-sm backdrop-blur-sm">
              {template?.name ?? "Template"}
            </span>
          </div>
          <p className="text-xs font-medium text-slate-400">{formattedDate}</p>
        </Link>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowDeleteModal(true);
          }}
          className="absolute right-4 top-6 rounded-full p-2 text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
          aria-label="Delete cover letter"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        title={coverLetter.jobTitle}
      />
    </>
  );
}

const CoverLetterCard = memo(CoverLetterCardInner);
export default CoverLetterCard;
