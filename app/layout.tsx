import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resumind",
  description: "Get personalized feedback to land your dream job",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 6000,
            classNames: {
              toast:
                "rounded-2xl border border-white/70 bg-white/90 backdrop-blur-xl shadow-lg font-sans",
              title: "text-sm font-semibold text-slate-900",
              description: "text-sm text-slate-600",
              error: "border-red-100 bg-badge-red/95",
              success: "border-green-100 bg-badge-green/95",
              warning: "border-yellow-100 bg-badge-yellow/95",
              closeButton: "bg-white border-slate-200 hover:bg-slate-50",
            },
          }}
        />
      </body>
    </html>
  );
}
