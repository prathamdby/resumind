import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import CoverLetterWizard from "@/app/components/cover-letter/CoverLetterWizard";
import { redirect } from "next/navigation";

export default async function NewCoverLetterPage() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    select: { id: true, jobTitle: true, companyName: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const user = {
    name: session.user.name ?? "",
    email: session.user.email,
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pt-12">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
          New Cover Letter
        </h1>
        <p className="text-lg text-slate-500">
          Pick a template, fill in the details, and let AI craft your letter
        </p>
      </header>

      <CoverLetterWizard
        resumes={resumes.map((r) => ({
          id: r.id,
          jobTitle: r.jobTitle,
          companyName: r.companyName ?? undefined,
        }))}
        user={user}
      />
    </section>
  );
}
