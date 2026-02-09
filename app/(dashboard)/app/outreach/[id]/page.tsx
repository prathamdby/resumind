import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import OutreachDetail from "@/app/components/outreach/OutreachDetail";

export default async function OutreachDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession();

  const outreach = await prisma.outreach.findFirst({
    where: { id, userId: session!.user.id },
    select: {
      id: true,
      channel: true,
      tone: true,
      jobTitle: true,
      companyName: true,
      recipientName: true,
      subject: true,
      content: true,
    },
  });

  if (!outreach) {
    redirect("/app/outreach");
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10 sm:px-10 lg:px-14 lg:pt-12">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
          {outreach.jobTitle}
        </h1>
        {outreach.companyName && (
          <p className="text-lg text-slate-500">{outreach.companyName}</p>
        )}
      </header>

      <OutreachDetail
        outreach={{
          ...outreach,
          companyName: outreach.companyName ?? undefined,
          recipientName: outreach.recipientName ?? undefined,
          subject: outreach.subject ?? undefined,
        }}
      />
    </section>
  );
}
