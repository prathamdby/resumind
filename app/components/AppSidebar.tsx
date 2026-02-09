"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import { LogOut, FileText, Upload, Mail } from "lucide-react";

interface AppSidebarProps {
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const navItems = [
  { href: "/app", label: "My Resumes", icon: FileText },
  { href: "/app/cover-letter", label: "Cover Letters", icon: Mail },
  { href: "/app/upload", label: "Analyze Resume", icon: Upload },
];

export default function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/auth");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const initials = user.name ? getInitials(user.name) : "U";
  const firstName = user.name?.split(" ")[0] || "User";

  return (
    <aside
      className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col justify-between border-r border-white/30 bg-white/70 px-5 py-6 backdrop-blur-xl lg:flex"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(111,122,255,0.06), transparent 60%)",
      }}
    >
      <div className="flex flex-col gap-8">
        {/* Brand */}
        <Link href="/app" className="flex items-center gap-3" aria-label="Home">
          <img
            src="/favicon.ico"
            alt="Resumind"
            className="h-9 w-9 rounded-full"
          />
          <span className="text-xs font-semibold uppercase tracking-[0.38em] text-slate-500">
            Resumind
          </span>
        </Link>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 p-[3px]">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-700">
                {initials}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900">
              {firstName}
            </p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5" aria-label="Main navigation">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/app" ? pathname === "/app" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-out",
                  isActive
                    ? "text-white shadow-[0_8px_25px_-8px_rgba(96,107,235,0.45)] primary-gradient"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-900",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <button
        onClick={handleSignOut}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200/60 bg-white/60 px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-white/90 hover:text-slate-700"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  );
}
