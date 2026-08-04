import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import CTA from "@/components/CTA";

const Page = async () => {
  const user = await currentUser();

  // ── Logged-in dashboard ──
  if (user) {
    const now = new Date();
    const hour = now.getHours();
    const greeting =
      hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const dateStr = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    return (
      <main>
        {/* Greeting */}
        <section className="flex flex-col gap-2 pt-2">
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {dateStr}
          </p>
          <h1 className="text-3xl max-sm:text-2xl font-bold" style={{ fontFamily: "var(--font-bricolage)", letterSpacing: "-0.02em" }}>
            {greeting},{" "}
            <span style={{ color: "var(--accent)" }}>{user.firstName}</span>
          </h1>
          <p className="text-sm max-w-xl" style={{ color: "var(--muted-foreground)" }}>
            Pick up where you left off — learn from companions or use your AI tools.
          </p>
          <div className="flex gap-3 mt-1 flex-wrap">
            <Link href="/companions">
              <button className="btn-primary">Explore Companions</button>
            </Link>
            <Link href="/tools">
              <button className="btn-secondary">Browse Tools</button>
            </Link>
          </div>
        </section>

        <div className="divider" />

        {/* Coming soon placeholder */}
        <section className="flex flex-col gap-4">
          <h2 className="section-title">Getting Started</h2>
          <div
            className="rounded-xl p-8 flex flex-col items-center gap-3 text-center"
            style={{ backgroundColor: "var(--surface-1)", border: "1px dashed var(--border)" }}
          >
            <span className="text-4xl">🚀</span>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Your companions and tools will appear here once they are set up.
            </p>
          </div>
        </section>

        <div className="divider" />

        <CTA />
      </main>
    );
  }

  // ── Visitor landing page ──
  return (
    <main className="!pt-0 !gap-0 !px-0">

      {/* Hero */}
      <section className="flex items-center min-h-[calc(100vh-60px)] px-10 max-sm:px-4 max-md:flex-col max-md:py-16 max-md:gap-10">
        {/* Left */}
        <div className="flex flex-col gap-6 w-3/5 max-md:w-full pr-8 max-md:pr-0">
          
          <h1
            className="text-5xl max-lg:text-4xl max-sm:text-3xl font-bold leading-[1.1]"
            style={{ letterSpacing: "-0.03em", fontFamily: "var(--font-bricolage)" }}
          >
            Your AI companion
            <br />
            from campus
            <br />
            <span style={{ color: "var(--accent)" }}>to career</span>
          </h1>
          <p className="text-base max-w-lg" style={{ color: "var(--muted-foreground)", lineHeight: "1.6" }}>
            Learn from voice-powered AI companions, prep for interviews, scan your resume, review code — everything you need, in one place.
          </p>
          <div className="flex gap-3 flex-wrap">
            <SignInButton>
              
            </SignInButton>
            <Link href="#features">
              <button className="btn-ghost px-6" style={{ height: "44px", fontSize: "15px" }}>
                See how it works
              </button>
            </Link>
          </div>
        </div>

        {/* Right — abstract CSS illustration */}
        <div className="w-2/5 max-md:w-full flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-[380px]">
            <div
              className="absolute top-[10%] left-[15%] w-[55%] h-[45%] rounded-xl"
              style={{ backgroundColor: "var(--surface-2)", transform: "rotate(-6deg)" }}
            />
            <div
              className="absolute top-[25%] right-[10%] w-[45%] h-[50%] rounded-xl"
              style={{ backgroundColor: "var(--surface-3)", transform: "rotate(4deg)" }}
            />
            <div
              className="absolute bottom-[15%] left-[20%] w-[40%] h-[35%] rounded-full"
              style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)" }}
            />
            <div className="absolute top-[18%] right-[22%] w-4 h-4 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            <div className="absolute bottom-[30%] left-[12%] w-3 h-3 rounded-full" style={{ backgroundColor: "var(--accent)", opacity: 0.6 }} />
            <div className="absolute top-[55%] right-[15%] w-2 h-2 rounded-full" style={{ backgroundColor: "var(--accent)", opacity: 0.4 }} />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section
        className="flex justify-center gap-0 py-6 flex-wrap px-4"
        style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface-1)" }}
      >
        {[
          { value: "15", label: "AI Tools" },
          { value: "6", label: "Subjects" },
          { value: "Voice", label: "AI" },
          { value: "Free", label: "Forever" },
        ].map(({ value, label }, i) => (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1 px-8 max-sm:px-5">
              <span className="text-2xl max-sm:text-xl font-bold" style={{ color: "var(--accent)", fontFamily: "var(--font-bricolage)" }}>
                {value}
              </span>
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</span>
            </div>
            {i < 3 && <div className="w-px h-8" style={{ backgroundColor: "var(--border)" }} />}
          </div>
        ))}
      </section>

      {/* Features */}
      <section id="features" className="flex flex-col items-center gap-10 py-20 max-sm:py-14 px-6 max-sm:px-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl max-sm:text-2xl font-bold" style={{ letterSpacing: "-0.02em", fontFamily: "var(--font-bricolage)" }}>
            Everything you need to get ahead
          </h2>
          <p style={{ color: "var(--muted-foreground)" }}>
            From acing interviews to understanding research papers
          </p>
        </div>

        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 w-full max-w-4xl">
          <div
            className="p-6 flex flex-col gap-4"
            style={{
              backgroundColor: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              borderLeft: "3px solid var(--accent)",
            }}
          >
            <span className="text-3xl">🤖</span>
            <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-bricolage)" }}>AI Companions</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              Create personalized AI tutors for any subject. Have real voice conversations that adapt to your learning style.
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {["Maths", "Science", "Coding", "History", "Language", "Economics"].map((s) => (
                <span key={s} className="text-xs px-2 py-1 rounded-md" style={{ backgroundColor: "var(--surface-2)", color: "var(--muted-foreground)" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div
            className="p-6 flex flex-col gap-4"
            style={{
              backgroundColor: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
            }}
          >
            <span className="text-3xl">🛠️</span>
            <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-bricolage)" }}>15 AI Tools</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              Practical tools for your career and academics — ATS scanner, resume builder, code reviewer, and more.
            </p>
            <div className="flex flex-wrap gap-2">
              {["ATS Scanner", "Resume Builder", "Cover Letter", "Code Reviewer", "Paper Explainer", "Skill Gap"].map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-md" style={{ backgroundColor: "var(--surface-2)", color: "var(--muted-foreground)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="flex flex-col items-center gap-5 py-20 max-sm:py-14 px-4 text-center"
        style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--surface-1)" }}
      >
        <h2 className="text-3xl max-sm:text-2xl font-bold" style={{ letterSpacing: "-0.02em", fontFamily: "var(--font-bricolage)" }}>
          Ready to get started?
        </h2>
        <p style={{ color: "var(--muted-foreground)" }}>Free to use. No credit card required.</p>
        <SignInButton>
          <button className="btn-primary px-8" style={{ height: "44px", fontSize: "15px" }}>
            Start for Free →
          </button>
        </SignInButton>
      </section>
    </main>
  );
};

export default Page;