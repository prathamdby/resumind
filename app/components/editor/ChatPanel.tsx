"use client";

import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Send, FileText, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/lib/use-resume-editor";

interface ChatPanelProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSendMessage: (content: string) => void;
}

const SUGGESTIONS = [
  "Create a software engineer resume",
  "Add my experience at Google",
  "Improve the summary section",
  "Make it more ATS-friendly",
];

export function ChatPanel({
  messages,
  isStreaming,
  onSendMessage,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;

    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-50/50">
      <div className="flex items-center gap-3 border-b border-white/30 bg-white/80 backdrop-blur-md px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-semibold text-slate-900">Resume Editor</h1>
          <p className="text-xs text-slate-500">AI-powered LaTeX editing</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-pink-100 mb-4">
              <Sparkles className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Start editing your resume
            </h2>
            <p className="text-sm text-slate-500 mb-6 max-w-sm">
              Ask me to create a new resume or help you improve your existing
              one.
            </p>
            <div className="grid gap-2 w-full max-w-sm">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSendMessage(suggestion)}
                  disabled={isStreaming}
                  className="surface-card surface-card--tight text-left text-sm text-slate-700 hover:-translate-y-0.5 transition-transform duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl p-4 ${
                  message.role === "user"
                    ? "ml-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    : "mr-8 surface-card"
                }`}
              >
                {message.content || (
                  <span className="animate-pulse text-slate-400">
                    Thinking...
                  </span>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="border-t border-white/30 bg-white/80 backdrop-blur-md p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            placeholder="Ask me to edit your resume..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            rows={1}
            className="flex-1 resize-none rounded-2xl border border-indigo-100/70 bg-white/95 px-4 py-3 text-base text-slate-900 shadow-[inset_0_2px_8px_rgba(79,70,229,0.07)] transition focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-200/70"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="primary-button px-4 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
