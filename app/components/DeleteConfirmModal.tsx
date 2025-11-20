"use client";

import BaseModal from "./BaseModal";
import ModalActions from "./ModalActions";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
}

const DeleteConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
}: DeleteConfirmModalProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onCancel}>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">
          Delete "{title}"?
        </h2>
        <p className="text-sm text-slate-600">
          This will permanently remove the resume and its analysis. This action
          cannot be undone.
        </p>
      </div>

      <ModalActions
        onCancel={onCancel}
        onConfirm={onConfirm}
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </BaseModal>
  );
};

export default DeleteConfirmModal;
