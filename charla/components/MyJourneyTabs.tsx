
"use client";

import { useState } from "react";
import Link from "next/link";
import { tools } from "@/constants";
import { getSubjectColor } from "@/lib/utils";

type Tab = "tools" | "sessions" | "companions" | "bookmarks";

interface MyJourneyTabsProps {
  toolHistory: ToolUsage[];
  sessionCompanions: Companion[];
  companions: Companion[];
  bookmarks: Companion[];
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const getToolMeta = (toolName: string) =>
  tools.find((t) => t.id === toolName) ?? { label: toolName, icon: "🔧", href: "/tools" };

const MyJourneyTabs = ({ toolHistory, sessionCompanions, companions, bookmarks }: MyJourneyTabsProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("tools");

  const tabs: { id: Tab; label: string }[] = [
    { id: "tools", label: `Tool History (${toolHistory.length})` },
    { id: "sessions", label: `Sessions (${sessionCompanions.length})` },
    { id: "companions", label: `My Companions (${companions.length})` },
    { id: "bookmarks", label: `Bookmarks (${bookmarks.length})` },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-0 border-b" style={{ borderColor: "var(--border)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer"
            style={{
              color: activeTab === tab.id ? "var(--foreground)" : "var(--muted-foreground)",
              borderBottom: activeTab === tab.id ? "2px solid var(--accent)" : "2px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "tools" && (
        <div className="flex flex-col gap-2">
          {toolHistory.length === 0 ? (
            <EmptyState icon="🔧" text="No tools used yet." linkHref="/tools" linkText="Browse tools →" />
          ) : (
            toolHistory.map((usage) => {
              const meta = getToolMeta(usage.tool_name);
              return (
                <div
                  key={usage.id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg"
                  style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{meta.icon}</span>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{meta.label}</p>
                      <p className="text-xs line-clamp-1 max-w-[300px]" style={{ color: "var(--muted-foreground)" }}>
                        {usage.output.slice(0, 70)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{formatDate(usage.created_at)}</span>
                    <Link href={meta.href} className="text-xs px-2.5 py-1 rounded-lg"
                      style={{ backgroundColor: "var(--accent-muted)", color: "var(--accent)" }}>
                      Use again
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === "sessions" && (
        <div className="flex flex-col gap-2">
          {sessionCompanions.length === 0 ? (
            <EmptyState icon="🎓" text="No sessions yet." linkHref="/companions" linkText="Start a session →" />
          ) : (
            sessionCompanions.map((c, i) => (
              <CompanionRow key={`${c.id}-${i}`} companion={c} />
            ))
          )}
        </div>
      )}

      {activeTab === "companions" && (
        <div className="flex flex-col gap-2">
          {companions.length === 0 ? (
            <EmptyState icon="🤖" text="You haven't created any companions yet." linkHref="/companions/new" linkText="Create one →" />
          ) : (
            companions.map((c) => <CompanionRow key={c.id} companion={c} />)
          )}
        </div>
      )}

      {activeTab === "bookmarks" && (
        <div className="flex flex-col gap-2">
          {bookmarks.length === 0 ? (
            <EmptyState icon="🔖" text="No bookmarks yet." linkHref="/companions" linkText="Browse companions →" />
          ) : (
            bookmarks.map((c) => <CompanionRow key={c.id} companion={c} />)
          )}
        </div>
      )}
    </div>
  );
};

const CompanionRow = ({ companion }: { companion: Companion }) => {
  const color = getSubjectColor(companion.subject);
  return (
    <Link
      href={`/companions/${companion.id}`}
      className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-150"
      style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)", borderLeft: `3px solid ${color}` }}
    >
      <div className="flex flex-col">
        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{companion.name}</p>
        <p className="text-xs capitalize" style={{ color: "var(--muted-foreground)" }}>
          {companion.subject} · {companion.topic}
        </p>
      </div>
      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{companion.duration} mins</span>
    </Link>
  );
};

const EmptyState = ({ icon, text, linkHref, linkText }: { icon: string; text: string; linkHref: string; linkText: string }) => (
  <div
    className="rounded-xl p-8 flex flex-col items-center gap-2 text-center"
    style={{ backgroundColor: "var(--surface-1)", border: "1px dashed var(--border)" }}
  >
    <span className="text-3xl">{icon}</span>
    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
      {text}{" "}
      <Link href={linkHref} style={{ color: "var(--accent)" }}>{linkText}</Link>
    </p>
  </div>
);

export default MyJourneyTabs;