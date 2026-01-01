"use client";

import dynamic from "next/dynamic";
import { SplitLayout } from "@/app/components/editor/SplitLayout";
import { ChatPanel } from "@/app/components/editor/ChatPanel";
import { useResumeEditor } from "@/lib/use-resume-editor";

const PdfPreview = dynamic(
  () =>
    import("@/app/components/editor/PdfPreview").then((mod) => mod.PdfPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-slate-500">
        Loading PDF viewer...
      </div>
    ),
  },
);

interface EditorClientProps {
  initialLatex?: string;
  resumeId?: string;
}

export function EditorClient({ initialLatex, resumeId }: EditorClientProps) {
  const {
    pdfUrl,
    isCompiling,
    compileError,
    messages,
    isStreaming,
    isDirty,
    sendMessage,
    recompile,
    askAiToFixError,
    save,
  } = useResumeEditor(initialLatex);

  return (
    <div className="relative">
      {isDirty && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => save(resumeId)}
            className="primary-button px-4 py-2 text-sm"
          >
            Save Changes
          </button>
        </div>
      )}
      <SplitLayout
        left={
          <ChatPanel
            messages={messages}
            isStreaming={isStreaming}
            onSendMessage={sendMessage}
          />
        }
        right={
          <PdfPreview
            pdfUrl={pdfUrl}
            isCompiling={isCompiling}
            error={compileError}
            onRecompile={recompile}
            onAskAiToFix={askAiToFixError}
          />
        }
        defaultLeftWidth={45}
      />
    </div>
  );
}
