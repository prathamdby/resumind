import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import UploadForm from "@/app/components/UploadForm";
import { getServerSession } from "@/lib/auth-server";
import { Sparkles, ArrowLeft } from "lucide-react";

export default async function UploadPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/auth");
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden pt-24">
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 opacity-40 mix-blend-multiply blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(250, 113, 133, 0.4) 0%, rgba(111, 122, 255, 0.2) 50%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <Navbar />

      <section className="page-shell relative gap-12">
        <header className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-600 backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            <span>Analyze & Improve</span>
          </div>

          <h1 className="headline text-balance">
            Tailor your resume for the perfect role
          </h1>
          <p className="subheadline max-w-xl text-balance">
            Provide the job details and your resume. We will identify gaps,
            optimize keywords, and help you stand out.
          </p>
        </header>

        <UploadForm />
      </section>
    </main>
  );
}
