import { redirect } from "next/navigation";
import AuthForm from "@/app/components/AuthForm";
import { getServerSession } from "@/lib/auth-server";

function AuthHeroPanel() {
  return (
    <div
      className="relative flex min-h-[30vh] flex-col justify-between overflow-hidden p-8 md:min-h-[40vh] lg:min-h-screen lg:p-12"
      style={{
        background:
          "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #3730a3 100%)",
      }}
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute"
        style={{
          width: "65%",
          height: "70%",
          top: "10%",
          left: "-10%",
          background:
            "radial-gradient(ellipse at 40% 50%, rgba(111, 122, 255, 0.55), rgba(76, 87, 233, 0.25) 60%, transparent 80%)",
          animation: "blobMorph1 18s ease-in-out infinite",
          willChange: "transform, border-radius",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: "55%",
          height: "60%",
          top: "5%",
          right: "-8%",
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(250, 113, 133, 0.45), rgba(244, 63, 94, 0.15) 60%, transparent 80%)",
          animation: "blobMorph2 22s ease-in-out infinite",
          willChange: "transform, border-radius",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: "50%",
          height: "55%",
          bottom: "-5%",
          right: "10%",
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(251, 191, 146, 0.4), rgba(251, 146, 60, 0.12) 60%, transparent 80%)",
          animation: "blobMorph3 25s ease-in-out infinite",
          willChange: "transform, border-radius",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.35,
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm">
          <img src="/favicon.ico" alt="" className="size-6 rounded-full" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-white/90">
          Resumind
        </span>
      </div>

      <div className="relative z-10 mt-6 flex flex-1 flex-col justify-center gap-6 lg:mt-8 lg:gap-8">
        <h2
          className="text-balance text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
          style={{ textShadow: "0 2px 30px rgba(0, 0, 0, 0.15)" }}
        >
          Land Your
          <br />
          Dream Job
        </h2>
        <p className="max-w-md text-base font-medium text-indigo-200/90 lg:text-lg">
          AI-powered resume analysis that turns anxiety into confidence. Get
          actionable feedback in seconds.
        </p>
      </div>

      <p className="relative z-10 hidden text-sm text-indigo-300/70 lg:block">
        Trusted by thousands of job seekers worldwide
      </p>
    </div>
  );
}

export default async function AuthPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/app");
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <AuthHeroPanel />
      <AuthForm />
    </main>
  );
}
