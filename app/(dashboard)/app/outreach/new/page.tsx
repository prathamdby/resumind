import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import OutreachWizard from "@/app/components/outreach/OutreachWizard";
import { redirect } from "next/navigation";

export default async function NewOutreachPage() {
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

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pt-12">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
          Compose Outreach
        </h1>
        <p className="text-lg text-slate-500">
          Pick a channel, set the tone, and let AI craft your message
        </p>
      </header>

      <OutreachWizard
        resumes={resumes.map((r) => ({
          id: r.id,
          jobTitle: r.jobTitle,
          companyName: r.companyName ?? undefined,
        }))}
      />
    </section>
  );
}
