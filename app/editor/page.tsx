import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { EditorClient } from "./EditorClient";

interface EditorPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function EditorPage({ searchParams }: EditorPageProps) {
  const session = await getServerSession();
  if (!session) {
    redirect("/auth");
  }

  const params = await searchParams;
  let initialLatex: string | undefined;
  let resumeId: string | undefined;

  if (params.id) {
    const resume = await prisma.resume.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      select: {
        id: true,
        latexContent: true,
      },
    });

    if (resume?.latexContent) {
      initialLatex = resume.latexContent;
      resumeId = resume.id;
    }
  }

  return (
    <main className="h-screen overflow-hidden">
      <EditorClient initialLatex={initialLatex} resumeId={resumeId} />
    </main>
  );
}
