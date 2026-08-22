import Link from "next/link";
import { getAllCompanions } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import CompanionCard from "@/components/CompanionCard";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";

interface SearchParams {
  searchParams: Promise<{ subject?: string; topic?: string }>;
}

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
  const { subject, topic } = await searchParams;
  const companions = await getAllCompanions({ subject, topic, limit: 20 });

  return (
    <main>
      <section className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-bricolage)", letterSpacing: "-0.02em" }}>
          Companion Library
        </h1>
        <Link href="/companions/new">
          <button className="btn-primary">+ New Companion</button>
        </Link>
      </section>

      <section className="flex gap-3 flex-wrap">
        <SearchInput />
        <SubjectFilter />
      </section>

      <section
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {companions.length === 0 ? (
          <div
            className="col-span-full rounded-xl p-10 flex flex-col items-center gap-3 text-center"
            style={{ backgroundColor: "var(--surface-1)", border: "1px dashed var(--border)" }}
          >
            <span className="text-4xl">🤖</span>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              No companions found. Try a different search or create one.
            </p>
          </div>
        ) : (
          companions.map((companion) => (
            <CompanionCard
              key={companion.id}
              {...companion}
              color={getSubjectColor(companion.subject)}
            />
          ))
        )}
      </section>
    </main>
  );
};

export default CompanionsLibrary;