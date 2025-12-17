"use client";

import FocusTrap from "focus-trap-react";

interface ConfirmationModalProps {
  open: boolean;
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  open,
  title = "Confirm Action",
  description,
  confirmText = "Yes",
  cancelText = "Cancel",
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!open) return null;

  return (
    <FocusTrap
      active={open}
      focusTrapOptions={{ escapeDeactivates: false, clickOutsideDeactivates: false }}
    >
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Modal */}
        <div className="relative w-full max-w-xl rounded-xl bg-white dark:bg-secondary-800 shadow-lg p-6 m-2">
          <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200">
            {title}
          </h3>

          <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
            {description}
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border"
              disabled={isLoading}
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
            >
              {isLoading ? "Processing..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
}
