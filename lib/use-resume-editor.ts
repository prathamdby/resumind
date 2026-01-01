"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DEFAULT_LATEX_RESUME } from "@/constants/editor";
import { compileLatex, extractLatexFromResponse } from "@/lib/latex-compiler";

const STORAGE_KEY = "resume-editor-latex";
const SAVE_DEBOUNCE_MS = 2000;
const COMPILE_DEBOUNCE_MS = 1000;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface UseResumeEditorReturn {
  latex: string;
  setLatex: (latex: string) => void;
  pdfUrl: string | null;
  isCompiling: boolean;
  compileError: string | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  isDirty: boolean;
  sendMessage: (content: string) => Promise<void>;
  recompile: () => Promise<void>;
  askAiToFixError: () => Promise<void>;
  save: (resumeId?: string) => Promise<boolean>;
}

export function useResumeEditor(initialLatex?: string): UseResumeEditorReturn {
  const [latex, setLatexState] = useState(initialLatex || DEFAULT_LATEX_RESUME);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [savedLatex, setSavedLatex] = useState(
    initialLatex || DEFAULT_LATEX_RESUME,
  );

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const pdfUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!initialLatex) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLatexState(stored);
      }
    }
    setIsInitialized(true);
  }, [initialLatex]);

  const setLatex = useCallback(
    (newLatex: string) => {
      setLatexState(newLatex);
      setIsDirty(newLatex !== savedLatex);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, newLatex);
      }, SAVE_DEBOUNCE_MS);
    },
    [savedLatex],
  );

  useEffect(() => {
    if (pdfUrl) {
      pdfUrlsRef.current.push(pdfUrl);
    }
  }, [pdfUrl]);

  useEffect(() => {
    return () => {
      pdfUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      pdfUrlsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const compile = async () => {
      setIsCompiling(true);
      setCompileError(null);

      const result = await compileLatex(latex);

      if (result.success && result.pdfUrl) {
        setPdfUrl(result.pdfUrl);
      } else {
        setCompileError(result.error || "Compilation failed");
      }

      setIsCompiling(false);
    };

    const timeout = setTimeout(compile, COMPILE_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [latex, isInitialized]);

  const recompile = useCallback(async () => {
    setIsCompiling(true);
    setCompileError(null);

    const result = await compileLatex(latex);

    if (result.success && result.pdfUrl) {
      setPdfUrl(result.pdfUrl);
    } else {
      setCompileError(result.error || "Compilation failed");
    }

    setIsCompiling(false);
  }, [latex]);

  const addMessage = useCallback((message: Omit<ChatMessage, "id">) => {
    const id = crypto.randomUUID();
    setMessages((prev) => [...prev, { ...message, id }]);
    return id;
  }, []);

  const updateMessage = useCallback((id: string, content: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, content } : msg)),
    );
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      addMessage({ role: "user", content });
      const assistantId = addMessage({ role: "assistant", content: "" });

      setIsStreaming(true);

      try {
        const response = await fetch("/api/editor/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content },
            ],
            currentLatex: latex,
          }),
        });

        if (!response.ok) throw new Error("Failed to get response");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;

            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);

              if (parsed.tool_call?.latex) {
                setLatex(parsed.tool_call.latex);
              }

              if (parsed.content) {
                fullResponse += parsed.content;
                updateMessage(assistantId, fullResponse);
              }

              if (parsed.error) {
                updateMessage(assistantId, parsed.error);
              }
            } catch {}
          }
        }

        if (fullResponse) {
          const extractedLatex = extractLatexFromResponse(fullResponse);
          if (extractedLatex) {
            setLatex(extractedLatex);
          }
        }
      } catch (error) {
        updateMessage(
          assistantId,
          "Sorry, there was an error. Please try again.",
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, latex, addMessage, updateMessage, setLatex],
  );

  const askAiToFixError = useCallback(async () => {
    if (!compileError) return;

    const errorMessage = `The LaTeX document failed to compile with this error: "${compileError}". Please fix the LaTeX code and provide the corrected document.`;
    await sendMessage(errorMessage);
  }, [compileError, sendMessage]);

  const save = useCallback(
    async (resumeId?: string): Promise<boolean> => {
      if (!resumeId) {
        setSavedLatex(latex);
        setIsDirty(false);
        return true;
      }

      try {
        const response = await fetch(`/api/resumes/${resumeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latexContent: latex }),
        });

        if (response.ok) {
          setSavedLatex(latex);
          setIsDirty(false);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [latex],
  );

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  return {
    latex,
    setLatex,
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
  };
}
