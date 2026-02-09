import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { getTemplateById } from "@/constants/cover-letter-templates";
import { COVER_LETTER_TEMPLATES } from "@/constants/cover-letter-templates";
import CoverLetterEditor from "@/app/components/cover-letter/CoverLetterEditor";
import type { CoverLetterContent } from "@/types";

export default async function CoverLetterEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession();

  const coverLetter = await prisma.coverLetter.findFirst({
    where: { id, userId: session!.user.id },
  });

  if (!coverLetter) {
    redirect("/app/cover-letter");
  }

  const content = coverLetter.content as unknown as CoverLetterContent;
  const template =
    getTemplateById(coverLetter.templateId) ?? COVER_LETTER_TEMPLATES[0];

  return (
    <CoverLetterEditor
      id={coverLetter.id}
      initialContent={content}
      initialTemplate={template}
      updatedAt={coverLetter.updatedAt.toISOString()}
      jobTitle={coverLetter.jobTitle}
    />
  );
}
