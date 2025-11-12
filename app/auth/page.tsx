"use client";

import Navbar from "@/app/components/Navbar";

export default function AuthPage() {
  return (
    <main className="relative overflow-hidden pt-12">
      <Navbar />
      <section className="page-shell">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-8 text-center">
          <span className="section-eyebrow mx-auto">Authentication</span>
          <h1 className="headline text-4xl">Authentication coming soon</h1>
          <p className="subheadline">
            User authentication will be implemented when the backend is ready.
            This will allow you to save resume versions, store analyses, and
            pick up where you left off.
          </p>

          <div className="surface-card surface-card--tight space-y-6">
            <p className="text-sm font-semibold text-indigo-600">
              Authentication is not yet available. Please check back soon.
            </p>
            <p className="text-xs text-slate-500">
              Once authentication is implemented, you'll be able to sign in and
              access your saved resume analyses.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
