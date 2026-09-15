
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getUserCompanions,
  getBookmarkedCompanions,
  getUserSessions,
} from "@/lib/actions/companion.actions";
import { getUserToolUsage } from "@/lib/actions/tools.actions";
import MyJourneyTabs from "@/components/MyJourneyTabs";
import Image from "next/image";

const MyJourneyPage = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const [toolHistory, sessionCompanions, companions, bookmarks] = await Promise.all([
    getUserToolUsage(50),
    getUserSessions(user.id, 20),
    getUserCompanions(user.id),
    getBookmarkedCompanions(user.id),
  ]);

  const stats = [
    { label: "Sessions", value: sessionCompanions.length },
    { label: "Companions Created", value: companions.length },
    { label: "Tools Used", value: toolHistory.length },
    { label: "Bookmarks", value: bookmarks.length },
  ];

  return (
    <main>
      <section className="flex items-center gap-3">
        <Image src={user.imageUrl} alt={user.firstName ?? "User"} width={48} height={48} className="rounded-full" />
        <div className="flex flex-col">
          <p className="text-lg font-bold" style={{ fontFamily: "var(--font-bricolage)", color: "var(--foreground)" }}>
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {user.emailAddresses[0]?.emailAddress}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-4 gap-3 max-sm:grid-cols-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-1 p-4 rounded-xl"
            style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)" }}
          >
            <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-bricolage)", color: "var(--accent)" }}>
              {s.value}
            </span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{s.label}</span>
          </div>
        ))}
      </section>

      <MyJourneyTabs
        toolHistory={toolHistory}
        sessionCompanions={sessionCompanions}
        companions={companions}
        bookmarks={bookmarks}
      />
    </main>
  );
};

export default MyJourneyPage;