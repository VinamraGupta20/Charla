
"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface ToolPageWrapperProps {
  icon: string;
  title: string;
  description: string;
  loading: boolean;
  children: React.ReactNode; // expects exactly 2 children: [inputPanel, outputPanel]
}

const ToolPageWrapper = ({ icon, title, description, loading, children }: ToolPageWrapperProps) => {
  return (
    <main>
      {/* Breadcrumb */}
      <Link href="/tools" className="flex items-center gap-1 text-sm w-fit" style={{ color: "var(--muted-foreground)" }}>
        <ChevronLeft size={14} />
        Tools
      </Link>

      {/* Header */}
      <section className="flex flex-col gap-1.5">
        <h1
          className="text-2xl font-bold flex items-center gap-2"
          style={{ fontFamily: "var(--font-bricolage)", letterSpacing: "-0.02em", color: "var(--foreground)" }}
        >
          <span>{icon}</span>
          {title}
        </h1>
        <p className="text-sm max-w-xl" style={{ color: "var(--muted-foreground)" }}>
          {description}
        </p>
      </section>

      {/* Two column layout */}
      <section className="grid grid-cols-2 gap-6 max-lg:grid-cols-1 relative">
        {children}

        {loading && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(14,14,16,0.4)", backdropFilter: "blur(2px)" }}
          >
            <div
              className="w-6 h-6 rounded-full animate-spin"
              style={{ border: "2px solid var(--border)", borderTopColor: "var(--accent)" }}
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default ToolPageWrapper;