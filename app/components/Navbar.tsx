"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";
import UserMenu from "@/app/components/UserMenu";

const Navbar = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="px-4 pt-4">
      <nav className="navbar" aria-label="Primary navigation">
        <Link href="/" className="navbar__brand" aria-label="Resumind home">
          <img
            src="/favicon.ico"
            alt="Resumind logo"
            className="h-10 w-10 rounded-full"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-xs font-semibold uppercase tracking-[0.38em] text-slate-500">
              Resumind
            </span>
            <span className="hidden text-sm font-medium text-slate-900 sm:block">
              AI resume insights
            </span>
          </span>
        </Link>

        <div className="navbar__links" role="navigation">
          <Link
            href="/"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium",
              isHome
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900",
            )}
          >
            My Resumes
          </Link>
          <Link href="/upload" className="primary-button px-5 py-2.5 text-sm">
            Analyze Resume
          </Link>
          <UserMenu />
        </div>

        <div className="navbar__mobile gap-3">
          <Link
            href="/upload"
            className="primary-button px-5 py-2 text-sm"
            aria-label="Upload a resume"
          >
            Analyze
          </Link>
          <UserMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
