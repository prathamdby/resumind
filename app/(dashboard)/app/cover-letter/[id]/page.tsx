import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { getTemplateById } from "@/constants/cover-letter-templates";
import { COVER_LETTER_TEMPLATES } from "@/constants/cover-letter-templates";
import CoverLetterEditor from "@/app/components/cover-letter/CoverLetterEditor";
import { CoverLetterContentSchema } from "@/lib/schemas";

export default async function CoverLetterEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const coverLetter = await prisma.coverLetter.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!coverLetter) {
    redirect("/app/cover-letter");
  }

  const contentResult = CoverLetterContentSchema.safeParse(coverLetter.content);
  if (!contentResult.success) {
    redirect("/app/cover-letter");
  }
  const template =
    getTemplateById(coverLetter.templateId) ?? COVER_LETTER_TEMPLATES[0];

  return (
    <CoverLetterEditor
      id={coverLetter.id}
      initialContent={contentResult.data}
      initialTemplate={template}
      updatedAt={coverLetter.updatedAt.toISOString()}
      jobTitle={coverLetter.jobTitle}
    />
  );
}
