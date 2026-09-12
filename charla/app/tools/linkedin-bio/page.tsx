
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { runLinkedInBio } from "@/lib/actions/tools.actions";
import ToolOutput from "@/components/ToolOutput";
import ToolPageWrapper from "@/components/ToolPageWrapper";

const LinkedInBio = () => {
  const [form, setForm] = useState({
    current_role: "", target_role: "", experience: "", achievements: "",
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const isValid = form.current_role && form.target_role && form.experience;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setOutput("");
    const toastId = toast.loading("Writing your LinkedIn bio...");
    const result = await runLinkedInBio(form);
    if (result.success) {
      setOutput(result.output);
      toast.success("Bio ready!", { id: toastId });
    } else {
      toast.error(result.error || "Something went wrong.", { id: toastId });
    }
    setLoading(false);
  };

  return (
    <ToolPageWrapper
      icon="💼"
      title="LinkedIn Bio Writer"
      description="Rewrite your LinkedIn headline and About section to match where you're headed, not just where you've been."
      loading={loading}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Current Role</label>
            <input className="input" placeholder="e.g. Full Stack Developer"
              value={form.current_role} onChange={(e) => update("current_role", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Target Role</label>
            <input className="input" placeholder="e.g. Product Manager"
              value={form.target_role} onChange={(e) => update("target_role", e.target.value)} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Experience</label>
          <textarea className="input min-h-[120px] resize-none" placeholder="Summarize your work experience..."
            value={form.experience} onChange={(e) => update("experience", e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Key Achievements</label>
          <textarea className="input min-h-[120px] resize-none" placeholder="Notable wins, metrics, projects..."
            value={form.achievements} onChange={(e) => update("achievements", e.target.value)} />
        </div>
        <button className="btn-primary justify-center w-full py-3" onClick={handleSubmit}
          disabled={loading || !isValid} style={{ opacity: loading || !isValid ? 0.5 : 1 }}>
          {loading ? "Writing..." : "Write My Bio →"}
        </button>
      </div>

      {output ? (
        <ToolOutput output={output} toolName="linkedin-bio" />
      ) : (
        <div className="rounded-xl p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]"
          style={{ backgroundColor: "var(--surface-1)", border: "1px dashed var(--surface-3)" }}>
          <span className="text-4xl">💼</span>
          <p className="text-sm text-center" style={{ color: "var(--muted-foreground)" }}>
            Your LinkedIn headline and bio will appear here
          </p>
        </div>
      )}
    </ToolPageWrapper>
  );
};

export default LinkedInBio;