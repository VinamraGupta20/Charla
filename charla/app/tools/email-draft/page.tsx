
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { runEmailDraft } from "@/lib/actions/tools.actions";
import ToolOutput from "@/components/ToolOutput";
import ToolPageWrapper from "@/components/ToolPageWrapper";

const EmailDraft = () => {
  const [form, setForm] = useState({
    recipient: "", purpose: "", key_points: "", tone: "professional",
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const isValid = form.recipient && form.purpose && form.key_points;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setOutput("");
    const toastId = toast.loading("Drafting your email...");
    const result = await runEmailDraft(form);
    if (result.success) {
      setOutput(result.output);
      toast.success("Email ready!", { id: toastId });
    } else {
      toast.error(result.error || "Something went wrong.", { id: toastId });
    }
    setLoading(false);
  };

  return (
    <ToolPageWrapper
      icon="📧"
      title="Email Drafting"
      description="Turn a few bullet points into a clear, professional email."
      loading={loading}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Recipient</label>
            <input className="input" placeholder="e.g. my manager, a client, HR team..."
              value={form.recipient} onChange={(e) => update("recipient", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Tone</label>
            <select className="input" value={form.tone} onChange={(e) => update("tone", e.target.value)}>
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="direct">Direct</option>
              <option value="apologetic">Apologetic</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Purpose</label>
          <input className="input" placeholder="e.g. request a deadline extension"
            value={form.purpose} onChange={(e) => update("purpose", e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Key Points</label>
          <textarea className="input min-h-[220px] resize-none"
            placeholder="List the points you want covered, one per line..."
            value={form.key_points} onChange={(e) => update("key_points", e.target.value)} />
        </div>
        <button className="btn-primary justify-center w-full py-3" onClick={handleSubmit}
          disabled={loading || !isValid} style={{ opacity: loading || !isValid ? 0.5 : 1 }}>
          {loading ? "Drafting..." : "Draft Email →"}
        </button>
      </div>

      {output ? (
        <ToolOutput output={output} toolName="email-draft" />
      ) : (
        <div className="rounded-xl p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]"
          style={{ backgroundColor: "var(--surface-1)", border: "1px dashed var(--surface-3)" }}>
          <span className="text-4xl">📧</span>
          <p className="text-sm text-center" style={{ color: "var(--muted-foreground)" }}>
            Your drafted email will appear here
          </p>
        </div>
      )}
    </ToolPageWrapper>
  );
};

export default EmailDraft;