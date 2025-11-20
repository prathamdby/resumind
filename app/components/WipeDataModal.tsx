"use client";

import BaseModal from "./BaseModal";
import ModalActions from "./ModalActions";

interface WipeDataModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  resumeCount: number;
  resumes: Array<{ id: string; jobTitle: string; companyName: string | null }>;
}

const WipeDataModal = ({
  isOpen,
  onConfirm,
  onCancel,
  resumeCount,
  resumes,
}: WipeDataModalProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onCancel} maxWidth="lg">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">
          Delete all your data?
        </h2>
        <p className="text-sm text-slate-600">
          This will permanently remove all resumes and analysis data from your
          account. Your account will remain active.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-red-100/70 bg-red-50/30 px-4 py-3">
          <p className="text-sm font-semibold text-red-900">
            {resumeCount} {resumeCount === 1 ? "resume" : "resumes"} will be
            deleted
          </p>
        </div>

        {resumes.length > 0 && (
          <div className="max-h-[200px] space-y-2 overflow-y-auto rounded-2xl border border-slate-200/60 bg-white/80 p-3">
            {resumes.slice(0, 10).map((resume) => (
              <div
                key={resume.id}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                <span>
                  <span className="font-medium text-slate-700">
                    {resume.jobTitle}
                  </span>
                  {resume.companyName && (
                    <span className="text-slate-500">
                      {" "}
                      at {resume.companyName}
                    </span>
                  )}
                </span>
              </div>
            ))}
            {resumes.length > 10 && (
              <p className="pt-1 text-xs text-slate-500">
                and {resumes.length - 10} more...
              </p>
            )}
          </div>
        )}

        <div className="space-y-1.5 text-xs text-slate-500">
          <p>• Rate limit data will be cleared</p>
          <p>• Your account and login sessions will remain active</p>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200/70 bg-amber-50/40 px-4 py-2.5">
        <p className="text-sm font-medium text-amber-900">
          ⚠️ This action cannot be undone
        </p>
      </div>

      <ModalActions
        onCancel={onCancel}
        onConfirm={onConfirm}
        confirmLabel="Delete All Data"
        confirmVariant="danger"
      />
    </BaseModal>
  );
};

export default WipeDataModal;
