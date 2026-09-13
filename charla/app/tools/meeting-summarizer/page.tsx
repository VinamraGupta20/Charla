
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { runMeetingSummarizer } from "@/lib/actions/tools.actions";
import ToolOutput from "@/components/ToolOutput";
import ToolPageWrapper from "@/components/ToolPageWrapper";

const MeetingSummarizer = () => {
  const [transcript, setTranscript] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setOutput("");
    const toastId = toast.loading("Summarizing meeting...");
    const result = await runMeetingSummarizer({ transcript });
    if (result.success) {
      setOutput(result.output);
      toast.success("Summary ready!", { id: toastId });
    } else {
      toast.error(result.error || "Something went wrong.", { id: toastId });
    }
    setLoading(false);
  };

  return (
    <ToolPageWrapper
      icon="🗒️"
      title="Meeting Summarizer"
      description="Paste any meeting transcript and get a summary, decisions, and action items."
      loading={loading}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Meeting Transcript</label>
          <textarea
            className="input min-h-[420px] max-sm:min-h-[260px] resize-none"
            placeholder="Paste the meeting transcript or notes here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        </div>
        <button className="btn-primary justify-center w-full py-3" onClick={handleSubmit}
          disabled={loading || !transcript.trim()} style={{ opacity: loading || !transcript.trim() ? 0.5 : 1 }}>
          {loading ? "Summarizing..." : "Summarize Meeting →"}
        </button>
      </div>

      {output ? (
        <ToolOutput output={output} toolName="meeting-summarizer" />
      ) : (
        <div className="rounded-xl p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]"
          style={{ backgroundColor: "var(--surface-1)", border: "1px dashed var(--surface-3)" }}>
          <span className="text-4xl">🗒️</span>
          <p className="text-sm text-center" style={{ color: "var(--muted-foreground)" }}>
            Summary, decisions, and action items will appear here
          </p>
        </div>
      )}
    </ToolPageWrapper>
  );
};

export default MeetingSummarizer;