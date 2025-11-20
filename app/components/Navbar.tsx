"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  Menu,
  X,
  LayoutDashboard,
  Upload,
  LogOut,
  User as UserIcon,
  ChevronDown,
  History,
} from "lucide-react";
import { cn } from "@/app/lib/utils";

const navLinks = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    match: (path: string) => path === "/",
  },
  {
    href: "/upload",
    label: "Analyze",
    icon: Upload,
    match: (path: string) => path === "/upload",
  },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const session = useSession();

  // Body scroll lock for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const userInitials = session.data?.user?.name
    ? session.data.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <>
      {/* Phantom Spacer to prevent layout jump if we switch between fixed/sticky strategies, 
          but since we rely on padding, this is just a z-index anchor */}
      <nav className="fixed left-0 right-0 top-6 z-50 mx-auto w-full max-w-4xl px-4 sm:px-0">
        <div className="relative flex items-center justify-between rounded-full border border-white/40 bg-white/80 px-6 py-3 shadow-sm backdrop-blur-xl transition-all hover:border-white/60 hover:shadow-md sm:pl-8 sm:pr-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-slate-900 transition-opacity hover:opacity-80"
          >
            <img src="/favicon.ico" alt="Resumind Logo" className="size-8 rounded-full" />
            <span className="hidden text-lg tracking-tight sm:block">
              Resumind
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => {
              const isActive = link.match(pathname);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-600 hover:text-slate-900",
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-indigo-50" />
                  )}
                  <Icon
                    className={cn(
                      "size-4 transition-transform group-hover:scale-110",
                      isActive ? "text-indigo-600" : "text-slate-400",
                    )}
                  />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {session.isPending ? (
              <div className="size-9 animate-pulse rounded-full bg-slate-200" />
            ) : session.data ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="group hidden items-center gap-2 rounded-full border border-slate-200 bg-white pl-1 pr-3 py-1 transition-all hover:border-indigo-200 hover:ring-2 hover:ring-indigo-100 sm:flex"
                >
                  <div className="flex size-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                    {userInitials}
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-4 text-slate-400 transition-transform duration-200",
                      isProfileOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-transparent"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-3 w-56 origin-top-right rounded-2xl border border-white/40 bg-white/90 p-2 shadow-xl backdrop-blur-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                      <div className="mb-2 px-3 py-2">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {session.data.user.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {session.data.user.email}
                        </p>
                      </div>
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        onClick={async () => {
                          await signOut();
                          setIsProfileOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50"
                      >
                        <LogOut className="size-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="hidden rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-transform hover:scale-105 hover:bg-slate-800 sm:block"
              >
                Sign in
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 sm:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl transition-all duration-300 sm:hidden",
          isMobileMenuOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0",
        )}
      >
        <div className="flex flex-col p-6">
          <div className="flex items-center justify-end">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="mt-12 flex flex-col gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 text-lg font-medium text-slate-900 transition-transform active:scale-95"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm">
                    <Icon className="size-5 text-indigo-600" />
                  </div>
                  {link.label}
                </Link>
              );
            })}

            {session.data && (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-lg font-medium text-rose-700 transition-transform active:scale-95"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm">
                  <LogOut className="size-5 text-rose-600" />
                </div>
                Sign out
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
