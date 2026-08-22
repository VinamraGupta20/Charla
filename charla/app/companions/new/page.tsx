import { newCompanionPermissions } from "@/lib/actions/companion.actions";
import CompanionForm from "@/components/CompanionForm";
import Link from "next/link";

const NewCompanionPage = async () => {
  const canCreate = await newCompanionPermissions();

  if (!canCreate) {
    return (
      <main>
        <div
          className="rounded-xl p-10 flex flex-col items-center gap-3 text-center max-w-md mx-auto"
          style={{ backgroundColor: "var(--surface-1)", border: "1px dashed var(--border)" }}
        >
          <span className="text-4xl">🔒</span>
          <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-bricolage)" }}>
            Companion limit reached
          </h2>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            You've reached your free plan limit. Upgrade to Pro for unlimited companions.
          </p>
          <Link href="/subscription">
            <button className="btn-primary mt-2">View Plans</button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto w-full">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-bricolage)", letterSpacing: "-0.02em" }}>
          Build a Companion
        </h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Create a personalized AI tutor for any subject.
        </p>
      </div>
      <CompanionForm />
    </main>
  );
};

export default NewCompanionPage;