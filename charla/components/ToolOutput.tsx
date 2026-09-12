
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ToolOutputProps {
  output: string;
  toolName: string;
}

const renderOutput = (text: string) => {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("### ") || line.startsWith("## ")) {
      return (
        <p key={i} className="font-semibold text-sm mt-4 mb-1" style={{ color: "var(--foreground)" }}>
          {line.replace(/^#{2,3}\s/, "")}
        </p>
      );
    }
    if (/^\d+\.\s\*\*(.+)\*\*/.test(line)) {
      return (
        <p key={i} className="font-semibold text-sm mt-3" style={{ color: "var(--foreground)" }}>
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }
    if (line.startsWith("- ") || line.startsWith("• ")) {
      return (
        <p key={i} className="text-sm ml-4" style={{ color: "var(--muted-foreground)" }}>
          • {line.replace(/^[-•]\s/, "").replace(/\*\*(.+?)\*\*/g, "$1")}
        </p>
      );
    }
    if (line.includes("**")) {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return (
        <p key={i} className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} style={{ color: "var(--foreground)" }}>{part}</strong> : part
          )}
        </p>
      );
    }
    if (line.trim() === "") return <div key={i} className="h-2" />;
    return (
      <p key={i} className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        {line}
      </p>
    );
  });
};

const ToolOutput = ({ output, toolName }: ToolOutputProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-1 max-h-[600px] overflow-y-auto"
      style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
          Result
        </p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-colors duration-150 cursor-pointer"
          style={{ backgroundColor: "var(--surface-2)", color: "var(--muted-foreground)" }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {renderOutput(output)}
    </div>
  );
};

export default ToolOutput;