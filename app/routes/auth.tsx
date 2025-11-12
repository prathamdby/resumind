import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import { useSession, signIn, signOut } from "~/lib/auth";

export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "Log into your account" },
];

const Auth = () => {
  const { data: session, isPending } = useSession();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get("next");
  const navigate = useNavigate();

  useEffect(() => {
    if (session && next) {
      navigate(next);
    }
  }, [session, next, navigate]);

  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <section className="page-shell">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-8 text-center">
          <span className="section-eyebrow mx-auto">Welcome back</span>
          <h1 className="headline text-4xl">
            Sign in to continue your career journey
          </h1>
          <p className="subheadline">
            Connect your account to save resume versions, store analyses, and
            pick up where you left off.
          </p>

          <div className="surface-card surface-card--tight space-y-6">
            <p
              className="text-sm font-semibold text-indigo-600"
              aria-live="polite"
            >
              {isPending
                ? "Checking your session..."
                : session
                  ? "You are signed in."
                  : "You are signed out."}
            </p>
            <div className="flex flex-col gap-4">
              {isPending ? (
                <button className="primary-button" disabled>
                  Preparing sign-in
                </button>
              ) : session ? (
                <button
                  className="primary-button primary-button--ghost"
                  onClick={() => signOut()}
                >
                  Sign out
                </button>
              ) : (
                <button className="primary-button" onClick={signIn}>
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Auth;
