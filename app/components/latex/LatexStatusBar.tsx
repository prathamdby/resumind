"use client";

interface LatexStatusBarProps {
  charCount: number;
  lastSaved: Date | null;
  error: string | null;
}

function formatTimeSince(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

export default function LatexStatusBar({ charCount, lastSaved, error }: LatexStatusBarProps) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200/60 bg-white/40 px-5 py-2 text-xs backdrop-blur-sm">
      <div className="flex items-center gap-4 text-slate-400">
        {lastSaved && <span>Saved {formatTimeSince(lastSaved)}</span>}
        <span>{charCount.toLocaleString()} chars</span>
      </div>

      {error && (
        <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
