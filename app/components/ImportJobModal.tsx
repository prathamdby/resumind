"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useDropzone } from "react-dropzone";
import type { FileRejection } from "react-dropzone";
import { cn, formatSize } from "@/app/lib/utils";
import { toast } from "sonner";

interface ImportJobModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onImportUrl: (url: string) => Promise<void>;
  onImportPdf: (file: File) => Promise<void>;
}

const ImportJobModal = ({
  isOpen,
  onCancel,
  onImportUrl,
  onImportPdf,
}: ImportJobModalProps) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const maxFileSize = 10 * 1024 * 1024;

  const handleRejection = useCallback((rejectedFiles: FileRejection[]) => {
    const rejection = rejectedFiles[0];
    const rejectionError = rejection?.errors?.[0];

    let message = rejectionError?.message || "Please upload a valid PDF file.";

    if (rejectionError?.code === "file-too-large") {
      message = "Please upload a PDF smaller than 10 MB.";
      toast.error("File too large", {
        description: message,
      });
    } else if (rejectionError?.code === "file-invalid-type") {
      message = "Only PDF files are supported.";
      toast.error("Invalid file type", {
        description: message,
      });
    } else {
      toast.error("Upload error", {
        description: message,
      });
    }

    setFileError(message);
    setFile(null);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (isLoading) return;

      if (rejectedFiles.length > 0) {
        handleRejection(rejectedFiles);
        return;
      }

      const selectedFile = acceptedFiles[0] || null;
      setFile(selectedFile);
      setFileError("");
      if (selectedFile) {
        setUrl("");
        setError("");
      }
    },
    [isLoading, handleRejection],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
    disabled: isLoading,
  });

  const handleSubmitUrl = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onImportUrl(url.trim());
      setUrl("");
      setError("");
      setFile(null);
      setFileError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to import job posting",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPdf = async () => {
    if (!file) {
      setFileError("Please upload a PDF file");
      return;
    }

    setIsLoading(true);
    setFileError("");

    try {
      await onImportPdf(file);
      setUrl("");
      setError("");
      setFile(null);
      setFileError("");
    } catch (err) {
      setFileError(
        err instanceof Error ? err.message : "Failed to import job posting",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isLoading) return;
    setUrl("");
    setError("");
    setFile(null);
    setFileError("");
    onCancel();
  };

  const hasUrl = Boolean(url.trim());
  const hasFile = Boolean(file);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleCancel}
    >
      <div
        className="surface-card surface-card--tight mx-4 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">
              Import details
            </h2>
            <p className="text-sm text-slate-600">
              Enter a job posting URL or upload a PDF job description. We'll
              extract the company name, position, and description.
            </p>
          </div>

          <form
            id="job-url-form"
            onSubmit={handleSubmitUrl}
            className="space-y-4"
          >
            <div className="input-wrapper">
              <label htmlFor="job-url" className="input-label">
                Job posting URL
              </label>
              <input
                type="url"
                id="job-url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (e.target.value.trim()) {
                    setFile(null);
                    setFileError("");
                  }
                }}
                placeholder="https://example.com/careers/senior-developer"
                className="input-field"
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--color-surface-muted)] px-4 text-slate-500 tracking-wider">
                Or
              </span>
            </div>
          </div>

          <div className="input-wrapper">
            <label className="input-label">Job description PDF</label>
            <div
              {...getRootProps({
                className: cn(
                  "rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/20 p-6 transition-colors duration-200 ease-out cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/40",
                  isDragActive && "border-indigo-300 bg-indigo-50/60",
                  fileError && !file && "border-red-300 bg-red-50/30",
                  isLoading && "cursor-not-allowed opacity-60",
                ),
              })}
            >
              <input
                {...getInputProps({
                  "aria-label": "Upload job description PDF",
                  "aria-invalid": Boolean(fileError),
                })}
              />

              {!file && (
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="rounded-full bg-white p-3 shadow-inner">
                    <img
                      src="/icons/info.svg"
                      alt="Upload"
                      className="h-8 w-8"
                    />
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p className="text-base font-semibold text-slate-700">
                      {isDragActive
                        ? "Drop the PDF here"
                        : "Click to upload or drag and drop"}
                    </p>
                    <p>PDF only, up to {formatSize(maxFileSize)}</p>
                  </div>
                </div>
              )}

              {file && (
                <div
                  className="flex items-center justify-between"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/pdf.png"
                      alt="PDF"
                      className="h-10 w-10"
                    />
                    <div className="text-left">
                      <p
                        className="text-sm font-medium text-slate-700"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors duration-200 ease-out hover:bg-slate-50"
                    onClick={() => {
                      setFile(null);
                      setFileError("");
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            {fileError && (
              <p className="text-sm text-red-600" role="alert">
                {fileError}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {(hasUrl || hasFile) && (
              <button
                type={hasUrl ? "submit" : "button"}
                form={hasUrl ? "job-url-form" : undefined}
                onClick={hasFile ? handleSubmitPdf : undefined}
                disabled={isLoading}
                className="order-1 w-full primary-button sm:order-2 sm:flex-1"
              >
                {isLoading
                  ? "Importing..."
                  : hasUrl
                    ? "Import from URL"
                    : "Import from PDF"}
              </button>
            )}
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="order-2 w-full rounded-full border border-slate-200 bg-white/90 px-6 py-3 text-base font-medium text-slate-700 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:order-1 sm:flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportJobModal;
