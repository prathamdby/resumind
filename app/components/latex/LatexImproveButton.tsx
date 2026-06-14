"use client";

import { useState } from "react";
import { FileCode } from "lucide-react";
import dynamic from "next/dynamic";
import type { LineImprovement } from "@/types";

const LatexImproveModal = dynamic(() => import("./LatexImproveModal"), {
  ssr: false,
});

interface LatexImproveButtonProps {
  lineImprovements: LineImprovement[];
  resumeId: string;
  jobTitle: string;
  companyName?: string;
}

export default function LatexImproveButton({
  lineImprovements,
  resumeId,
  jobTitle,
  companyName,
}: LatexImproveButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="latex-toolbar-btn latex-toolbar-btn--secondary"
      >
        <FileCode className="h-3.5 w-3.5" />
        <span>LaTeX</span>
      </button>

      {isOpen && (
        <LatexImproveModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          lineImprovements={lineImprovements}
          resumeId={resumeId}
          jobTitle={jobTitle}
          companyName={companyName}
        />
      )}
    </>
  );
}
