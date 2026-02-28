import BatchUploadForm from "@/app/components/BatchUploadForm";

export default function BatchUploadPage() {
  return (
    <section className="page-shell gap-16">
      <header className="flex max-w-3xl flex-col gap-6">
        <span className="section-eyebrow">Batch analyze</span>
        <h1 className="headline">
          One resume, multiple jobs — analyzed in parallel
        </h1>
        <p className="subheadline">
          Upload your resume once and compare it against up to 10 different job
          descriptions simultaneously. See which roles match best.
        </p>
      </header>

      <BatchUploadForm />
    </section>
  );
}
