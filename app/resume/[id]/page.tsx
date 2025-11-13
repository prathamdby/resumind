import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Summary from "@/app/components/Summary";
import Details from "@/app/components/Details";
import ATS from "@/app/components/ATS";
import AnalysisSection from "@/app/components/AnalysisSection";
import PreviewImage from "@/app/components/PreviewImage";
import LineByLineImprovements from "@/app/components/LineByLineImprovements";
import ColdOutreach from "@/app/components/ColdOutreach";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "@/app/components/Accordion";
import { CheckCheck, Lightbulb, Pencil, MessageSquare } from "lucide-react";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import type { Feedback } from "@/types";

export default async function ResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();
  if (!session) {
    redirect("/auth");
  }

  const { id } = await params;

  const resume = await prisma.resume.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      jobTitle: true,
      companyName: true,
      jobDescription: true,
      feedback: true,
      createdAt: true,
    },
  });

  if (!resume || resume.userId !== session.user.id) {
    redirect("/");
  }

  const feedback = resume.feedback as unknown as Feedback;

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
              {resume.jobTitle}
              {resume.companyName && ` at ${resume.companyName}`}
            </h1>
            <p className="text-base text-slate-600">
              Analyzed on{" "}
              {new Date(resume.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
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
                <PreviewImage resumeId={resume.id} />
              </div>
              <p className="text-xs text-slate-500">
                Preview generated from uploaded PDF
              </p>
            </div>
          </aside>

          <section className="feedback-section lg:pl-0">
            <div className="space-y-6">
              <div className="surface-card surface-card--tight">
                <Summary feedback={feedback} />
              </div>

              <Accordion
                className="space-y-5"
                defaultOpen={["cold-outreach", "line-improvements"]}
                allowMultiple
                persistKey={`resume-${resume.id}`}
                showControls
              >
                {feedback.coldOutreachMessage && (
                  <AnalysisSection
                    id="cold-outreach"
                    icon={{ Icon: MessageSquare }}
                    title="Cold Outreach Message"
                    eyebrow="LinkedIn DM template"
                    description="A personalized message based on your resume. Customize before sending."
                  >
                    <ColdOutreach
                      message={feedback.coldOutreachMessage}
                      resumeId={resume.id}
                    />
                  </AnalysisSection>
                )}

                <AnalysisSection
                  id="line-improvements"
                  icon={{ Icon: Pencil }}
                  title="Line-by-Line Improvements"
                  eyebrow="Specific rewrites"
                  description="Ready-to-use replacements for your resume. Copy and apply these suggestions to boost your score."
                  badge={{
                    label: "Tips",
                    value: feedback.lineImprovements?.length || 0,
                  }}
                >
                  <LineByLineImprovements
                    improvements={feedback.lineImprovements || []}
                  />
                </AnalysisSection>

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
          </section>
        </div>
      </section>
    </main>
  );
}
