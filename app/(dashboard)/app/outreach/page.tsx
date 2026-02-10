import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import OutreachCard from "@/app/components/outreach/OutreachCard";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

export default async function OutreachListPage() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const outreaches = await prisma.outreach.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      channel: true,
      tone: true,
      jobTitle: true,
      companyName: true,
      content: true,
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
            Outreach
          </h1>
          <p className="text-lg text-slate-500">
            {outreaches.length > 0
              ? `${outreaches.length} message${outreaches.length !== 1 ? "s" : ""} composed`
              : "Craft personalized outreach messages that get replies"}
          </p>
        </div>

        <Link
          href="/app/outreach/new"
          className="primary-button self-start"
        >
          <Plus className="h-4 w-4" />
          Compose new
        </Link>
      </header>

      {outreaches.length === 0 ? (
        <div className="relative">
          <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-linear-to-r from-indigo-200/30 to-pink-200/20 blur-3xl" />
          <div className="surface-card relative flex flex-col items-center gap-6 px-6 py-16 text-center">
            <div className="rounded-2xl bg-linear-to-r from-indigo-100/80 to-pink-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-indigo-600">
              Getting started
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Pick a channel, set the tone, and compose in seconds
            </h3>
            <p className="max-w-xl text-slate-600">
              LinkedIn DMs, cold emails, networking requests, and follow-ups.
              Each message is grounded in your resume and tailored to the role.
            </p>
            <Link
              href="/app/outreach/new"
              className="primary-button px-5 py-3 text-sm"
            >
              Compose your first message
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {outreaches.map((o) => (
            <OutreachCard
              key={o.id}
              outreach={{
                ...o,
                createdAt: o.createdAt.toISOString(),
                companyName: o.companyName ?? undefined,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
