import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { getTemplateById } from "@/constants/cover-letter-templates";
import CoverLetterCard from "@/app/components/cover-letter/CoverLetterCard";
import { Plus } from "lucide-react";

export default async function CoverLetterListPage() {
  const session = await getServerSession();

  const coverLetters = await prisma.coverLetter.findMany({
    where: { userId: session!.user.id },
    select: {
      id: true,
      templateId: true,
      jobTitle: true,
      companyName: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pt-12">
      <header className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
            Cover Letters
          </h1>
          <p className="text-lg text-slate-500">
            {coverLetters.length > 0
              ? `${coverLetters.length} cover letter${coverLetters.length !== 1 ? "s" : ""} created`
              : "Generate a tailored cover letter in seconds"}
          </p>
        </div>

        <Link href="/app/cover-letter/new" className="primary-button self-start">
          <Plus className="h-4 w-4" />
          Create new
        </Link>
      </header>

      {coverLetters.length === 0 ? (
        <div className="relative">
          <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-linear-to-r from-indigo-200/30 to-pink-200/20 blur-3xl" />
          <div className="surface-card relative flex flex-col items-center gap-6 px-6 py-16 text-center">
            <div className="rounded-2xl bg-linear-to-r from-indigo-100/80 to-pink-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-indigo-600">
              Getting started
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Pick a template, add your details, and get a polished cover letter
            </h3>
            <p className="max-w-xl text-slate-600">
              Choose from professional, creative, technical, and more templates.
              Each one is tuned to match the tone hiring managers expect for that
              role type.
            </p>
            <Link
              href="/app/cover-letter/new"
              className="primary-button px-5 py-3 text-sm"
            >
              Create your first cover letter
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {coverLetters.map((cl) => {
            const template = getTemplateById(cl.templateId);
            return (
              <CoverLetterCard
                key={cl.id}
                coverLetter={{
                  ...cl,
                  createdAt: cl.createdAt.toISOString(),
                  companyName: cl.companyName ?? undefined,
                }}
                template={template}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
