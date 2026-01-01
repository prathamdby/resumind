"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, AlertCircle, RefreshCw, Download, Wand2 } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfPreviewProps {
  pdfUrl: string | null;
  isCompiling: boolean;
  error: string | null;
  onRecompile: () => void;
  onAskAiToFix?: () => void;
}

export function PdfPreview({
  pdfUrl,
  isCompiling,
  error,
  onRecompile,
  onAskAiToFix,
}: PdfPreviewProps) {
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    [],
  );

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "resume.pdf";
    a.click();
  };

  return (
    <div className="flex h-full flex-col bg-slate-100/50">
      <div className="flex items-center justify-between border-b border-white/30 bg-white/80 backdrop-blur-md px-5 py-4">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-slate-900">Preview</h2>
          {isCompiling && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Loader2 className="h-3 w-3 animate-spin" />
              Compiling...
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRecompile}
            disabled={isCompiling}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
            title="Recompile"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            disabled={!pdfUrl}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100">
              <AlertCircle className="h-8 w-8 text-rose-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                Compilation Error
              </h3>
              <p className="mt-1 max-w-md text-sm text-slate-500">{error}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onRecompile}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
              {onAskAiToFix && (
                <button
                  onClick={onAskAiToFix}
                  className="primary-button px-4 py-2 text-sm"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Ask AI to Fix
                </button>
              )}
            </div>
          </div>
        ) : pdfUrl ? (
          <div className="flex justify-center">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center gap-2 text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading PDF...
                </div>
              }
              error={
                <div className="flex items-center gap-2 text-rose-600">
                  <AlertCircle className="h-5 w-5" />
                  Failed to load PDF
                </div>
              }
            >
              {numPages &&
                Array.from({ length: numPages }, (_, i) => (
                  <Page
                    key={`page_${i + 1}`}
                    pageNumber={i + 1}
                    width={600}
                    className="mb-4 rounded-lg shadow-lg overflow-hidden"
                  />
                ))}
            </Document>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <Loader2 className="h-12 w-12 animate-spin text-slate-300" />
            <p className="text-sm text-slate-500">
              {isCompiling
                ? "Compiling your resume..."
                : "Waiting for first compile..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
