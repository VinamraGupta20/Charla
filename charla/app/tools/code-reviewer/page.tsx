
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { runCodeReviewer } from "@/lib/actions/tools.actions";
import ToolOutput from "@/components/ToolOutput";
import ToolPageWrapper from "@/components/ToolPageWrapper";

const languages = ["JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "SQL"];

const CodeReviewer = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setOutput("");
    const toastId = toast.loading("Reviewing your code...");
    const result = await runCodeReviewer({ code, language });
    if (result.success) {
      setOutput(result.output);
      toast.success("Review complete!", { id: toastId });
    } else {
      toast.error(result.error || "Something went wrong.", { id: toastId });
    }
    setLoading(false);
  };

  return (
    <ToolPageWrapper
      icon="💻"
      title="Code Reviewer"
      description="Paste your code and get instant feedback — bugs, quality issues, and a suggested refactor."
      loading={loading}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Language</label>
          <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
            {languages.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Your Code</label>
          <textarea
            className="input min-h-[360px] max-sm:min-h-[220px] resize-none font-mono"
            style={{ fontSize: "13px" }}
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button className="btn-primary justify-center w-full py-3" onClick={handleSubmit}
          disabled={loading || !code.trim()} style={{ opacity: loading || !code.trim() ? 0.5 : 1 }}>
          {loading ? "Reviewing..." : "Review Code →"}
        </button>
      </div>

      {output ? (
        <ToolOutput output={output} toolName="code-reviewer" />
      ) : (
        <div className="rounded-xl p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]"
          style={{ backgroundColor: "var(--surface-1)", border: "1px dashed var(--surface-3)" }}>
          <span className="text-4xl">💻</span>
          <p className="text-sm text-center" style={{ color: "var(--muted-foreground)" }}>
            Code review feedback will appear here
          </p>
        </div>
      )}
    </ToolPageWrapper>
  );
};

export default CodeReviewer;