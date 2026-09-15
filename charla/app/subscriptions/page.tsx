

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const freeFeatures = ["3 AI companions", "10 tool uses / month", "6 subjects", "All 15 tools (limited)"];
const proFeatures = ["Unlimited AI companions", "Unlimited tool uses", "6 subjects", "All 15 tools (unlimited)", "Priority support"];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes — since Pro billing isn't live yet in your region, there's nothing to cancel. This is a preview of what Pro will include." },
  { q: "What happens when I hit my monthly limit?", a: "Your free tool uses reset on the 1st of every month. Until then, you can still create and use your existing companions." },
  { q: "Is my data safe?", a: "Yes — every user's data is protected with Row Level Security, meaning no other user can ever access your companions, sessions, or tool history." },
];

const SubscriptionPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main>
      <section className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-bricolage)", letterSpacing: "-0.02em" }}>
          Simple pricing
        </h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Free to start. Upgrade when you need more.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-w-2xl mx-auto w-full">
        {/* Free plan */}
        <div
          className="flex flex-col gap-4 p-6 rounded-xl"
          style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-bricolage)" }}>Free</h3>
            <span
              className="text-xs px-2 py-1 rounded-md font-medium"
              style={{ backgroundColor: "var(--surface-2)", color: "var(--muted-foreground)" }}
            >
              Current Plan
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>₹0</p>
          <ul className="flex flex-col gap-2">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                <span style={{ color: "var(--accent)" }}>✓</span> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro plan */}
        <div
          className="flex flex-col gap-4 p-6 rounded-xl"
          style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--accent)" }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-bricolage)" }}>Pro</h3>
            <span
              className="text-xs px-2 py-1 rounded-md font-medium"
              style={{ backgroundColor: "var(--accent-muted)", color: "var(--accent)" }}
            >
              Coming Soon
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>₹400 <span className="text-sm font-normal" style={{ color: "var(--muted-foreground)" }}>/ month</span></p>
          <ul className="flex flex-col gap-2">
            {proFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                <span style={{ color: "var(--accent)" }}>✓</span> {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto w-full flex flex-col gap-2">
        <h2 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-bricolage)" }}>
          Frequently asked questions
        </h2>
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="flex items-center justify-between w-full px-4 py-3 text-left cursor-pointer"
              style={{ backgroundColor: "var(--surface-1)" }}
            >
              <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{faq.q}</span>
              <ChevronDown
                size={16}
                style={{ color: "var(--muted-foreground)", transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}
              />
            </button>
            {openFaq === i && (
              <div className="px-4 pb-3" style={{ backgroundColor: "var(--surface-1)" }}>
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
};

export default SubscriptionPage;