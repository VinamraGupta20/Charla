
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { runDocWriter } from "@/lib/actions/tools.actions";
import ToolOutput from "@/components/ToolOutput";
import ToolPageWrapper from "@/components/ToolPageWrapper";

const docTypes = ["Code Documentation", "README", "API Documentation", "Process Documentation"];

const DocWriter = () => {
  const [content, setContent] = useState("");
  const [docType, setDocType] = useState(docTypes[0]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setOutput("");
    const toastId = toast.loading("Writing documentation...");
    const result = await runDocWriter({ code_or_process: content, doc_type: docType });
    if (result.success) {
      setOutput(result.output);
      toast.success("Documentation ready!", { id: toastId });
    } else {
      toast.error(result.error || "Something went wrong.", { id: toastId });
    }
    setLoading(false);
  };

  return (
    <ToolPageWrapper
      icon="📚"
      title="Documentation Writer"
      description="Paste code or describe a process and get clean, structured documentation."
      loading={loading}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Documentation Type</label>
          <select className="input" value={docType} onChange={(e) => setDocType(e.target.value)}>
            {docTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Code or Process</label>
          <textarea
            className="input min-h-[360px] max-sm:min-h-[220px] resize-none font-mono"
            style={{ fontSize: "13px" }}
            placeholder="Paste your code, or describe the process to document..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button className="btn-primary justify-center w-full py-3" onClick={handleSubmit}
          disabled={loading || !content.trim()} style={{ opacity: loading || !content.trim() ? 0.5 : 1 }}>
          {loading ? "Writing..." : "Generate Docs →"}
        </button>
      </div>

      {output ? (
        <ToolOutput output={output} toolName="doc-writer" />
      ) : (
        <div className="rounded-xl p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]"
          style={{ backgroundColor: "var(--surface-1)", border: "1px dashed var(--surface-3)" }}>
          <span className="text-4xl">📚</span>
          <p className="text-sm text-center" style={{ color: "var(--muted-foreground)" }}>
            Generated documentation will appear here
          </p>
        </div>
      )}
    </ToolPageWrapper>
  );
};

export default DocWriter;