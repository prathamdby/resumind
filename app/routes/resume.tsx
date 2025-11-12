import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { Route } from "./+types/resume";
import { useSession } from "~/lib/auth";
import { resumeApi } from "~/lib/services/resume-api";
import { redirect } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import ColdOutreach from "~/components/ColdOutreach";
import Navbar from "~/components/Navbar";
import {
  CheckCheck,
  Lightbulb,
  NotebookPen,
  MessageSquare,
} from "lucide-react";
import AnalysisSection from "~/components/AnalysisSection";
import LineByLineImprovements from "~/components/LineByLineImprovements";
import { Accordion } from "~/components/Accordion";

export const meta = () => [
  { title: "Resumind | Review" },
  { name: "description", content: "Detailed review of your resume" },
];

export async function loader({ params, request }: Route.LoaderArgs) {
  const { id } = params;

  if (!id) {
    throw new Response("Resume ID required", { status: 400 });
  }

  try {
    const cookie = request.headers.get("cookie");
    const resume = await resumeApi.get(
      id,
      cookie ? { headers: { Cookie: cookie } } : {},
    );
    return { resume };
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      throw new Response("Resume not found", { status: 404 });
    }
    if (error instanceof Error && error.message.includes("401")) {
      const url = new URL(request.url);
      throw redirect(`/auth?next=${url.pathname}`);
    }
    throw error;
  }
}

const Resume = ({ loaderData }: Route.ComponentProps) => {
  const { id } = useParams();
  const { data: session } = useSession();
  const { resume } = loaderData;
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [session, id, navigate]);

  const feedback = resume.feedback as Feedback | null;
  const meta = {
    companyName: resume.company_name ?? resume.companyName,
    jobTitle: resume.job_title ?? resume.jobTitle,
  };
  const textPreview = resume.text_content ?? "";

  return (
    <main className="relative overflow-hidden">
      <Navbar />

      <section className="page-shell gap-12">
        <header className="flex flex-col gap-6">
          <Link to="/" className="back-button w-fit">
            <img src="/icons/back.svg" alt="Back" className="h-3 w-3" />
            <span>Back to dashboard</span>
          </Link>
          <div className="flex flex-col gap-2">
            <span className="section-eyebrow w-fit">Resume analysis</span>
            <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
              {meta?.jobTitle || "Latest submission"}
            </h1>
            <p className="text-base text-slate-600">
              {meta?.companyName
                ? `Tailored for ${meta.companyName}.`
                : "Add a company on your next upload to tailor advice."}
            </p>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <aside className="preview-rail">
            <div className="surface-card surface-card--tight preview-rail__card">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">
                  Resume text
                </p>
              </div>
              <div className="preview-rail__frame gradient-border overflow-hidden">
                <div className="p-6 max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed">
                    {textPreview}
                  </pre>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Extracted text from your uploaded PDF. Use this to verify the
                content was parsed correctly.
              </p>
            </div>
          </aside>

          <section className="feedback-section lg:pl-0">
            {feedback ? (
              <div className="space-y-6">
                <div className="surface-card surface-card--tight">
                  <Summary feedback={feedback} />
                </div>

                <Accordion
                  className="space-y-5"
                  defaultOpen={["cold-outreach", "line-improvements"]}
                  allowMultiple
                  persistKey={`resume-${id}`}
                  showControls
                >
                  {feedback.coldOutreachMessage && (
                    <AnalysisSection
                      id="cold-outreach"
                      icon={{ Icon: MessageSquare }}
                      title="Cold Outreach Message"
                      eyebrow="Personalized follow-up"
                      description="Use this tailored note to connect with the hiring team."
                    >
                      <ColdOutreach message={feedback.coldOutreachMessage} />
                    </AnalysisSection>
                  )}

                  <AnalysisSection
                    id="ats"
                    icon={{ Icon: CheckCheck }}
                    title="ATS Readiness"
                    eyebrow="Parser score"
                    description="Stay above 80 to stay visible in recruiter dashboards."
                    badge={{
                      label: "Score",
                      value: feedback.ATS.score || 0,
                    }}
                  >
                    <ATS
                      score={feedback.ATS.score || 0}
                      suggestions={feedback.ATS.tips || []}
                    />
                  </AnalysisSection>

                  {feedback.lineImprovements &&
                    feedback.lineImprovements.length > 0 && (
                      <AnalysisSection
                        id="line-improvements"
                        icon={{ Icon: NotebookPen }}
                        title="Line-by-Line Improvements"
                        eyebrow="Rewrite suggestions"
                        description="Drop in these replacements to boost clarity, impact, and keyword density."
                        badge={{
                          label: "Found",
                          value: feedback.lineImprovements.length,
                        }}
                      >
                        <LineByLineImprovements
                          improvements={feedback.lineImprovements}
                        />
                      </AnalysisSection>
                    )}

                  <AnalysisSection
                    id="detailed-coaching"
                    icon={{ Icon: Lightbulb }}
                    title="Detailed Coaching"
                    eyebrow="Category breakdown"
                    description="Expand each section to review what is working well and the edits that will unlock the next score jump."
                    badge={{
                      label: "Sets",
                      value: 4,
                    }}
                  >
                    <Details feedback={feedback} />
                  </AnalysisSection>
                </Accordion>
              </div>
            ) : (
              <div className="surface-card surface-card--tight flex min-h-[420px] flex-col gap-6 text-center">
                <div className="flex flex-1 items-center justify-center overflow-hidden rounded-3xl bg-indigo-50/70 p-6">
                  <img
                    src="/images/resume-scan-2.gif"
                    alt="Loading"
                    className="h-full w-full max-h-[420px] object-contain"
                  />
                </div>
                <p className="mt-auto text-sm text-slate-600">
                  We are finishing up the analysis. This usually takes less than
                  a minute.
                </p>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default Resume;
