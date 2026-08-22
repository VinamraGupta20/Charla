"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCompanion } from "@/lib/actions/companion.actions";
import { subjects, voices, styles } from "@/constants";

const CompanionForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    subject: subjects[0],
    topic: "",
    voice: voices[0].value,
    style: styles[0].value,
    duration: 15,
  });

  const update = (key: string, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const isValid = form.name.trim() && form.topic.trim() && form.duration > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    try {
      const companion = await createCompanion(form);
      toast.success("Companion created!");
      router.push(`/companions/${companion.id}`);
    } catch (err) {
      toast.error("Failed to create companion. You may have reached your limit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
          Companion Name
        </label>
        <input
          className="input"
          placeholder="e.g. Neura, Prof. Byte, Ada..."
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            Subject
          </label>
          <select className="input" value={form.subject} onChange={(e) => update("subject", e.target.value)}>
            {subjects.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            Duration (minutes)
          </label>
          <input
            className="input"
            type="number"
            min={5}
            max={60}
            value={form.duration}
            onChange={(e) => update("duration", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
          Topic
        </label>
        <input
          className="input"
          placeholder="e.g. Derivatives, JavaScript Basics, French Revolution..."
          value={form.topic}
          onChange={(e) => update("topic", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            Voice
          </label>
          <select className="input" value={form.voice} onChange={(e) => update("voice", e.target.value)}>
            {voices.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            Teaching Style
          </label>
          <select className="input" value={form.style} onChange={(e) => update("style", e.target.value)}>
            {styles.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary justify-center w-full py-3 mt-2"
        disabled={loading || !isValid}
        style={{ opacity: loading || !isValid ? 0.5 : 1 }}
      >
        {loading ? "Creating..." : "Create Companion →"}
      </button>
    </form>
  );
};

export default CompanionForm;