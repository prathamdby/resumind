import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Summary from "@/app/components/Summary";
import Details from "@/app/components/Details";
import ATS from "@/app/components/ATS";
import AnalysisSection from "@/app/components/AnalysisSection";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "@/app/components/Accordion";
import { CheckCheck, Lightbulb } from "lucide-react";

// Mock feedback for placeholder
const mockFeedback: Feedback = {
  overallScore: 0,
  ATS: {
    score: 0,
    tips: [],
  },
  toneAndStyle: {
    score: 0,
    tips: [],
  },
  content: {
    score: 0,
    tips: [],
  },
  structure: {
    score: 0,
    tips: [],
  },
  skills: {
    score: 0,
    tips: [],
  },
};

export default async function ResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="relative overflow-hidden pt-12">
      <Navbar />

      <section className="page-shell gap-12">
        <header className="flex flex-col gap-6">
          <Link href="/" className="back-button w-fit">
            <img src="/icons/back.svg" alt="Back" className="h-3 w-3" />
            <span>Back to dashboard</span>
          </Link>
          <div className="flex flex-col gap-2">
            <span className="section-eyebrow w-fit">Resume analysis</span>
            <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
              Resume analysis coming soon
            </h1>
            <p className="text-base text-slate-600">
              Backend integration in progress. Analysis will be available once
              the backend is deployed.
            </p>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <aside className="preview-rail">
            <div className="surface-card surface-card--tight preview-rail__card">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">
                  Preview
                </p>
              </div>
              <div className="preview-rail__frame gradient-border overflow-hidden">
                <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                  Preview will be available after backend integration
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Resume preview will be generated from the uploaded PDF once the
                backend is ready.
              </p>
            </div>
          </aside>

          <section className="feedback-section lg:pl-0">
            <div className="space-y-6">
              <div className="surface-card surface-card--tight">
                <Summary feedback={mockFeedback} />
              </div>

              <Accordion
                className="space-y-5"
                defaultOpen={["ats", "detailed-coaching"]}
                allowMultiple
                persistKey={`resume-placeholder`}
                showControls
              >
                <AnalysisSection
                  id="ats"
                  icon={{ Icon: CheckCheck }}
                  title="ATS Readiness"
                  eyebrow="Parser score"
                  description="Stay above 80 to stay visible in recruiter dashboards."
                  badge={{
                    label: "Score",
                    value: mockFeedback.ATS.score || 0,
                  }}
                >
                  <ATS
                    score={mockFeedback.ATS.score || 0}
                    suggestions={mockFeedback.ATS.tips || []}
                  />
                </AnalysisSection>

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
                  <Details feedback={mockFeedback} />
                </AnalysisSection>
              </Accordion>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
