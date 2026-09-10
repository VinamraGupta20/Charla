import { getCompanion } from "@/lib/actions/companion.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CompanionComponent from "../../../components/CompanionComponent";
import { getSubjectColor } from "@/lib/utils";
import Image from "next/image";

interface CompanionSessionPageProps {
  params: Promise<{ id: string }>;
}

const CompanionSessionPage = async ({ params }: CompanionSessionPageProps) => {
  const { id } = await params;
  const companion = await getCompanion(id);
  const user = await currentUser();

  if (!user) redirect("/sign-in");
  if (!companion) redirect("/companions");

  const { name, subject, topic, duration } = companion;
  const color = getSubjectColor(subject);

  return (
    <main>
      <section
        className="flex items-center justify-between gap-4 flex-wrap p-4 rounded-xl"
        style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--surface-2)", borderLeft: `3px solid ${color}` }}
          >
            <Image src={`/icons/${subject}.svg`} alt={subject} width={24} height={24} />
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-lg" style={{ fontFamily: "var(--font-bricolage)", color: "var(--foreground)" }}>
              {name}
            </p>
            <p className="text-xs capitalize" style={{ color: "var(--muted-foreground)" }}>
              {subject} · {topic}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
          <Image src="/icons/clock.svg" alt="duration" width={14} height={14} />
          <span className="text-sm">{duration} mins</span>
        </div>
      </section>

      <CompanionComponent
        {...companion}
        companionId={id}
        userName={user.firstName!}
        userImage={user.imageUrl!}
      />
    </main>
  );
};

export default CompanionSessionPage;