import { useState } from "react";
import { useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/wipe";
import Navbar from "~/components/Navbar";
import { resumeApi } from "~/lib/services/resume-api";
import { redirect } from "react-router";

export const meta = () => [
  { title: "Resumind | Wipe data" },
  { name: "description", content: "Delete all stored resumes and analyses" },
];

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const confirm = formData.get("confirm");

  if (confirm !== "DELETE_ALL") {
    return { error: "Confirmation text does not match" };
  }

  try {
    const cookie = request.headers.get("cookie");
    const init = cookie ? { headers: { Cookie: cookie } } : {};
    const resumes = await resumeApi.list(init);
    await Promise.all(
      resumes.map((resume) => resumeApi.delete(resume.id, init)),
    );
    return redirect("/?wiped=true");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to wipe data",
    };
  }
}

const Wipe = ({ actionData }: Route.ComponentProps) => {
  const navigation = useNavigation();
  const isProcessing = navigation.state === "submitting";
  const [confirmText, setConfirmText] = useState("");

  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <section className="page-shell">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
          <header className="flex flex-col gap-3 text-center">
            <span className="section-eyebrow mx-auto">Danger zone</span>
            <h1 className="headline text-4xl">Wipe workspace data</h1>
            <p className="subheadline">
              This will delete all stored resumes and their analyses from our
              servers.
            </p>
          </header>

          <form
            method="post"
            className="surface-card surface-card--tight space-y-6"
          >
            <p className="text-sm text-slate-600">
              Type <span className="font-semibold">DELETE_ALL</span> to confirm.
              This action cannot be undone.
            </p>
            <input
              type="text"
              name="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE_ALL"
              className="form-input"
              required
              disabled={isProcessing}
            />
            {actionData?.error && (
              <p className="text-sm font-medium text-red-600">
                {actionData.error}
              </p>
            )}
            <button
              type="submit"
              disabled={isProcessing}
              className="primary-button w-full bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing ? "Wiping..." : "Delete everything"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Wipe;
