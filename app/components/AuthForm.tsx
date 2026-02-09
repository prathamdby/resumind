"use client";

import { signInWithGoogle } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

function GoogleIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-indigo-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to sign in with Google. Please try again.";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-12 sm:px-12 lg:px-16"
      style={{
        backgroundImage:
          "radial-gradient(circle at 30% 20%, rgba(124, 139, 255, 0.08), transparent 50%), radial-gradient(circle at 80% 80%, rgba(250, 113, 133, 0.06), transparent 50%)",
      }}
    >
      <div
        className="w-full max-w-md"
        style={{
          animation: "authFadeUp 600ms ease-out both",
          animationDelay: "150ms",
        }}
      >
        <div className="flex flex-col items-center gap-8 rounded-[var(--radius-card)] border border-white/40 bg-white/80 p-8 shadow-[var(--shadow-surface)] backdrop-blur-md sm:p-10">
          <div className="flex h-18 w-18 items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_12px_35px_-10px_rgba(96,107,235,0.5)]">
            <img
              src="/favicon.ico"
              alt="Resumind"
              className="size-11 rounded-full"
            />
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome to Resumind
            </h1>
            <p className="text-base text-slate-500">
              Sign in to unlock AI-powered resume insights
            </p>
          </div>

          <div className="flex w-full flex-col gap-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="relative flex w-full items-center justify-center gap-3 rounded-full border border-indigo-100/60 bg-white px-8 py-4 text-base font-semibold text-slate-800 shadow-[0_4px_20px_-6px_rgba(96,107,235,0.2)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_14px_35px_-10px_rgba(96,107,235,0.35)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          <div className="flex w-full items-center gap-4">
            <div className="h-px flex-1 bg-slate-200/70" />
            <span className="text-xs text-slate-400">secure sign-in</span>
            <div className="h-px flex-1 bg-slate-200/70" />
          </div>

          <p className="text-center text-xs leading-relaxed text-slate-400">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
