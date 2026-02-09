import UploadForm from "@/app/components/UploadForm";

export default function UploadPage() {
  return (
    <section className="page-shell gap-16">
      <header className="flex max-w-3xl flex-col gap-6">
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
  );
}
