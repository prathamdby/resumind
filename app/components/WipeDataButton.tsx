"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import WipeDataModal from "./WipeDataModal";

interface WipeDataButtonProps {
  resumes: Array<{ id: string; jobTitle: string; companyName: string | null }>;
}

export default function WipeDataButton({ resumes }: WipeDataButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const router = useRouter();

  const handleWipe = async () => {
    setIsWiping(true);
    try {
      const response = await fetch("/api/user/wipe", { method: "DELETE" });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete data");
      }

      toast.success("All data deleted");
      setShowModal(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete data", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsWiping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isWiping}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200/70 bg-white/95 px-6 py-3 text-sm font-semibold text-red-600 shadow-sm backdrop-blur transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 hover:shadow-md focus-visible:ring-2 focus-visible:ring-red-200/70 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Trash2 className="h-4 w-4" />
        <span>{isWiping ? "Wiping..." : "Wipe My Data"}</span>
      </button>
      <WipeDataModal
        isOpen={showModal}
        onConfirm={handleWipe}
        onCancel={() => setShowModal(false)}
        resumeCount={resumes.length}
        resumes={resumes}
      />
    </>
  );
}
