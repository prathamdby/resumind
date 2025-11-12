import { redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import UploadForm from "@/app/components/UploadForm";
import { getServerSession } from "@/lib/auth-server";

export default async function UploadPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/auth");
  }

  return (
    <main className="relative overflow-hidden pt-12">
      <div className="hero-decor" aria-hidden="true" />
      <Navbar />

      <section className="page-shell gap-16">
        <header className="flex flex-col gap-6 max-w-3xl">
          <span className="section-eyebrow">Upload & analyze</span>
          <h1 className="headline">
            Get personalized feedback for your dream job
          </h1>
          <p className="subheadline">
            Provide the role you are targeting and we will return ATS-aligned
            coaching, actionable next steps, and a visual preview in seconds.
          </p>
        </header>

        <UploadForm />
      </section>
    </main>
  );
}
