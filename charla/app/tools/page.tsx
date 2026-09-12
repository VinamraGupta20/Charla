    
"use client";

import { useState } from "react";
import Link from "next/link";
import { tools } from "@/constants";

const categories = ["all", "career"]; // more categories added in Week 6

const ToolsDashboard = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = tools.filter((t) => {
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    const matchesSearch = t.label.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main>
      <section className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-bricolage)", letterSpacing: "-0.02em" }}>
          Tools
        </h1>
        <input
          className="input"
          style={{ width: "240px" }}
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <section className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-150 cursor-pointer"
            style={{
              backgroundColor: activeCategory === cat ? "var(--accent-muted)" : "var(--surface-2)",
              color: activeCategory === cat ? "var(--accent)" : "var(--muted-foreground)",
              border: `1px solid ${activeCategory === cat ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </section>

      <section
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
      >
        {filtered.map((tool) => (
          <Link key={tool.id} href={tool.href} className="tool-card">
            <div className="flex items-center gap-2">
              <span className="text-lg">{tool.icon}</span>
              <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{tool.label}</span>
            </div>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{tool.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default ToolsDashboard;