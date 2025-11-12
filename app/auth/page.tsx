import { redirect } from "next/navigation";
import AuthForm from "@/app/components/AuthForm";
import { getServerSession } from "@/lib/auth-server";

export default async function AuthPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50">
      <div className="hero-decor" aria-hidden="true" />
      <AuthForm />
    </main>
  );
}
