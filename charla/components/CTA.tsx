import Link from "next/link";

const CTA = () => {
  return (
    <section
      className="flex flex-col items-center gap-4 py-10 px-6 text-center rounded-xl"
      style={{
        backgroundColor: "var(--surface-1)",
        border: "1px solid var(--border)",
      }}
    >
      <h2
        className="text-2xl font-bold"
        style={{
          fontFamily: "var(--font-bricolage)",
          letterSpacing: "-0.02em",
          color: "var(--foreground)",
        }}
      >
        Start learning with AI today
      </h2>
      <p className="text-sm max-w-sm" style={{ color: "var(--muted-foreground)" }}>
        Create your first AI companion or try one of our 15 career and academic tools — completely free.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/companions/new">
          <button className="btn-primary">Create a Companion</button>
        </Link>
        <Link href="/tools">
          <button className="btn-secondary">Browse Tools</button>
        </Link>
      </div>
    </section>
  );
};

export default CTA;