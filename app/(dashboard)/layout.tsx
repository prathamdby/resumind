import { redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import AppSidebar from "@/app/components/AppSidebar";
import { getServerSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) {
    redirect("/auth");
  }

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar user={user} />

      <div className="flex min-h-screen flex-1 flex-col overflow-clip">
        <div className="pt-12 lg:hidden">
          <Navbar />
        </div>
        {children}
      </div>
    </div>
  );
}
