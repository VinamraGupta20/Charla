
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { checkToolLimit } from "@/lib/actions/tools.actions";
import Link from "next/link";

const ToolsLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { allowed, used, limit } = await checkToolLimit();
  const isUnlimited = limit === Infinity;

  if (!allowed) {
    return (
      <main>
        <div
          className="rounded-xl p-10 flex flex-col items-center gap-3 text-center max-w-md mx-auto"
          style={{ backgroundColor: "var(--surface-1)", border: "1px dashed var(--border)" }}
        >
          <span className="text-4xl">🔒</span>
          <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-bricolage)" }}>
            Monthly limit reached
          </h2>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            You've used all {limit} free tool runs this month. Upgrade to Pro for unlimited access.
          </p>
          <Link href="/subscription">
            <button className="btn-primary mt-2">View Plans</button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      {!isUnlimited && (
        <div
          className="flex items-center justify-between px-4 py-2 text-xs"
          style={{ backgroundColor: "var(--surface-2)", borderBottom: "1px solid var(--border)", color: "var(--muted-foreground)" }}
        >
          <span>
            {used} / {limit} free tool uses this month
          </span>
          <Link href="/subscription" style={{ color: "var(--accent)" }}>
            Upgrade to Pro →
          </Link>
        </div>
      )}
      {children}
    </>
  );
};

export default ToolsLayout;