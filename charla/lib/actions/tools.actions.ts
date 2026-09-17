
'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";

export const callAI = async (prompt: string): Promise<string> => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("No response from AI");

  return text.trim();
};

const saveToolUsage = async (toolName: string, input: object, output: string) => {
  const { userId } = await auth();
  if (!userId) return;

  const supabase = createSupabaseClient();
  await supabase.from("tool_usage").insert({
    user_id: userId,
    tool_name: toolName,
    input,
    output,
  });
};

type ToolResult = { success: true; output: string } | { success: false; error: string };

const runTool = async (toolName: string, input: object, prompt: string): Promise<ToolResult> => {
  try {
    const output = await callAI(prompt);
    await saveToolUsage(toolName, input, output);
    return { success: true, output };
  } catch (err: any) {
    return { success: false, error: err.message || "Something went wrong." };
  }
};

const FREE_MONTHLY_TOOL_LIMIT = 10;

export const checkToolLimit = async (): Promise<{ allowed: boolean; used: number; limit: number }> => {
  const { userId, has } = await auth();
  if (!userId) return { allowed: false, used: 0, limit: FREE_MONTHLY_TOOL_LIMIT };

  if (has({ plan: "pro" })) {
    return { allowed: true, used: 0, limit: Infinity };
  }

  const supabase = createSupabaseClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("tool_usage")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  if (error) throw new Error(error.message);

  const used = count ?? 0;

  return {
    allowed: used < FREE_MONTHLY_TOOL_LIMIT,
    used,
    limit: FREE_MONTHLY_TOOL_LIMIT,
  };
};

export const getUserToolUsage = async (limit = 50): Promise<ToolUsage[]> => {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("tool_usage")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data as ToolUsage[];
};


export const deleteToolUsage = async (id: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createSupabaseClient();

  const { error } = await supabase
    .from("tool_usage")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};

// ============================================================
// CAREER TOOLS
// ============================================================

export const runATSScanner = async (input: { resume: string; job_description: string }) => {
  const limitCheck = await checkToolLimit();
  if (!limitCheck.allowed) return { success: false, error: "Monthly tool limit reached. Upgrade to Pro for unlimited access." };

  const prompt = `You are an ATS (Applicant Tracking System) analysis expert. Compare this resume against the job description and provide:

1. **Match Score** (0-100%)
2. **Missing Keywords** — important keywords from the JD not found in the resume
3. **Strengths** — what already aligns well
4. **Suggestions** — 3-5 specific improvements to increase the match score

Resume:
${input.resume}

Job Description:
${input.job_description}`;

  return runTool("ats-scanner", input, prompt);
};

export const runResumeBuilder = async (input: {
  full_name: string; email: string; phone: string; location: string;
  summary: string; experience: string; education: string; skills: string;
}) => {
  const limitCheck = await checkToolLimit();
  if (!limitCheck.allowed) return { success: false, error: "Monthly tool limit reached. Upgrade to Pro for unlimited access." };

  const prompt = `You are a professional resume writer. Build a clean, ATS-optimized resume using the details below. Format it clearly with sections: Contact Info, Summary, Experience, Education, Skills. Use strong action verbs and quantify achievements where possible.

Name: ${input.full_name}
Email: ${input.email}
Phone: ${input.phone}
Location: ${input.location}
Summary: ${input.summary}
Experience: ${input.experience}
Education: ${input.education}
Skills: ${input.skills}`;

  return runTool("resume-builder", input, prompt);
};

export const runCoverLetter = async (input: {
  resume: string; job_description: string; company_name: string; tone: string;
}) => {
  const limitCheck = await checkToolLimit();
  if (!limitCheck.allowed) return { success: false, error: "Monthly tool limit reached. Upgrade to Pro for unlimited access." };

  const prompt = `Write a tailored, human-sounding cover letter for ${input.company_name} in a ${input.tone} tone. Base it on the candidate's resume and the job description below. Keep it to 3-4 short paragraphs, avoid generic filler phrases, and highlight the most relevant experience.

Resume / Background:
${input.resume}

Job Description:
${input.job_description}`;

  return runTool("cover-letter", input, prompt);
};

export const runJDDecoder = async (input: { job_description: string }) => {
  const limitCheck = await checkToolLimit();
  if (!limitCheck.allowed) return { success: false, error: "Monthly tool limit reached. Upgrade to Pro for unlimited access." };

  const prompt = `Analyze this job description and decode what the employer actually wants. Provide:

1. **Must-Have Requirements**
2. **Nice-to-Haves**
3. **Hidden Requirements / Red Flags** — things implied but not stated directly
4. **Company Culture Signals** — what the wording suggests about the work environment

Job Description:
${input.job_description}`;

  return runTool("jd-decoder", input, prompt);
};

export const runLinkedInBio = async (input: {
  current_role: string; target_role: string; experience: string; achievements: string;
}) => {
  const limitCheck = await checkToolLimit();
  if (!limitCheck.allowed) return { success: false, error: "Monthly tool limit reached. Upgrade to Pro for unlimited access." };

  const prompt = `Write a compelling LinkedIn headline and About section for someone transitioning from "${input.current_role}" to "${input.target_role}". Make the headline punchy (under 220 characters) and the About section 3 short paragraphs, written in first person, highlighting the experience and achievements below.

Experience: ${input.experience}
Achievements: ${input.achievements}`;

  return runTool("linkedin-bio", input, prompt);
};

export const runSalaryCoach = async (input: {
  role: string; current_offer: string; target_salary: string;
  experience_years: string; location: string;
}) => {
  const limitCheck = await checkToolLimit();
  if (!limitCheck.allowed) return { success: false, error: "Monthly tool limit reached. Upgrade to Pro for unlimited access." };

  const prompt = `You are a salary negotiation coach. The candidate has been offered ${input.current_offer} for a ${input.role} role in ${input.location} with ${input.experience_years} of experience, and wants to negotiate toward ${input.target_salary}. Provide:

1. **Negotiation Strategy** — overall approach
2. **Exact Script** — word-for-word phrases to use in the negotiation call/email
3. **Counter-Offer Range** — a realistic range to counter with
4. **Fallback Position** — what to accept if they push back`;

  return runTool("salary-coach", input, prompt);
};

export const runColdOutreach = async (input: {
  your_name: string; your_role: string; target_name: string;
  target_company: string; purpose: string; context: string;
}) => {
  const limitCheck = await checkToolLimit();
  if (!limitCheck.allowed) return { success: false, error: "Monthly tool limit reached. Upgrade to Pro for unlimited access." };

  const prompt = `Write a short, personalized cold outreach message from ${input.your_name} (${input.your_role}) to ${input.target_name} at ${input.target_company}. Purpose: ${input.purpose}. Context/hook: ${input.context}. Write both an email version and a shorter LinkedIn DM version. Keep it concise, warm, and not salesy.`;

  return runTool("cold-outreach", input, prompt);
};

export const runSkillGapAnalyzer = async (input: {
  current_skills: string; target_role: string; experience_years: string; timeline: string;
}) => {
  const limitCheck = await checkToolLimit();
  if (!limitCheck.allowed) return { success: false, error: "Monthly tool limit reached. Upgrade to Pro for unlimited access." };

  const prompt = `Compare the candidate's current skills against what's typically required for a "${input.target_role}" role. They have ${input.experience_years || "unspecified"} experience and a ${input.timeline || "flexible"} timeline. Provide:

1. **Skills You Already Have** that transfer well
2. **Critical Gaps** — skills missing that are essential for the target role
3. **Learning Roadmap** — a step-by-step plan broken into phases matching their timeline
4. **Recommended Resources** — types of resources to use (courses, projects, certifications)

Current Skills & Experience:
${input.current_skills}`;

  return runTool("skill-gap", input, prompt);
};

// ============================================================
// ACADEMIC TOOLS
// ============================================================

export const runPaperExplainer = async (input: {
  paper_text: string;
  detail_level: "simple" | "intermediate" | "detailed";
}) => {
  const limitCheck = await checkToolLimit();
  if (!limitCheck.allowed) return { success: false, error: "Monthly tool limit reached. Upgrade to Pro for unlimited access." };

  const levelInstruction = {
    simple: "Explain it in plain English, as if to someone with no background in the field.",
    intermediate: "Explain it at a level suitable for an undergraduate student in the relevant field.",
    detailed: "Explain it with full technical depth, suitable for a graduate student or researcher.",
  }[input.detail_level];

  const prompt = `You are explaining a research paper. ${levelInstruction}

Provide:
1. **Core Finding** — the main result/contribution in 2-3 sentences
2. **Methodology** — how they got there
3. **Why It Matters** — the real-world or academic significance
4. **Key Terms Explained** — any jargon defined simply

Paper text:
${input.paper_text}`;

  return runTool("paper-explainer", input, prompt);
};

export const runAssignmentPlanner = async (input: {
  assignment_brief: string; subject: string; deadline: string; word_count: string;
}) => {
  const limitCheck = await checkToolLimit();
  if (!limitCheck.allowed) return { success: false, error: "Monthly tool limit reached. Upgrade to Pro for unlimited access." };

  const prompt = `Create a structured, day-by-day plan for completing this assignment. Subject: ${input.subject}. Deadline: ${input.deadline}. Target length: ${input.word_count || "not specified"}.

Provide:
1. **Task Breakdown** — day-by-day tasks from today until the deadline
2. **Research Starting Points** — what to look up first
3. **Milestones** — checkpoints to track progress
4. **Tips** — specific to this subject/assignment type

Assignment Brief:
${input.assignment_brief}`;

  return runTool("assignment-planner", input, prompt);
};

export const runPlagiarismRewriter = async (input: {
  text: string; style: "academic" | "professional" | "casual"; subject: string;
}) => {
  const limitCheck = await checkToolLimit();
  if (!limitCheck.allowed) return { success: false, error: "Monthly tool limit reached. Upgrade to Pro for unlimited access." };

  const prompt = `Rewrite the following text in a ${input.style} style${input.subject ? ` for a ${input.subject} context` : ""}. Preserve the original meaning and all key information exactly, but rephrase the sentence structure and word choice significantly so it reads as original writing. Do not add new information or remove any facts.

This is for legitimate writing improvement, not for misrepresenting someone else's work as one's own — treat it accordingly.

Text to rewrite:
${input.text}`;

  return runTool("plagiarism-rewriter", input, prompt);
};

// ============================================================
// PRODUCTIVITY TOOLS
// ============================================================

export const runEmailDraft = async (input: {
  recipient: string; purpose: string; key_points: string; tone: string;
}) => {
  const limitCheck = await checkToolLimit();
  if (!limitCheck.allowed) return { success: false, error: "Monthly tool limit reached. Upgrade to Pro for unlimited access." };

  const prompt = `Write a professional email to ${input.recipient}. Purpose: ${input.purpose}. Tone: ${input.tone}.

Key points to include:
${input.key_points}

Write a clear subject line and a concise, well-structured email body.`;

  return runTool("email-draft", input, prompt);
};

export const runCodeReviewer = async (input: { code: string; language: string }) => {
  const limitCheck = await checkToolLimit();
  if (!limitCheck.allowed) return { success: false, error: "Monthly tool limit reached. Upgrade to Pro for unlimited access." };

  const prompt = `Review this ${input.language} code. Provide:

1. **Bugs / Issues** — any bugs, edge cases missed, or logic errors
2. **Code Quality** — readability, naming, structure feedback
3. **Suggested Refactor** — improved version of the most important part, in a code block
4. **Best Practices** — relevant ${input.language} conventions not being followed

Code:
\`\`\`${input.language}
${input.code}
\`\`\``;

  return runTool("code-reviewer", input, prompt);
};

export const runMeetingSummarizer = async (input: { transcript: string }) => {
  const limitCheck = await checkToolLimit();
  if (!limitCheck.allowed) return { success: false, error: "Monthly tool limit reached. Upgrade to Pro for unlimited access." };

  const prompt = `Summarize this meeting transcript. Provide:

1. **Summary** — 3-4 sentence overview of what was discussed
2. **Key Decisions** — decisions that were made
3. **Action Items** — who needs to do what, with any mentioned deadlines
4. **Open Questions** — anything left unresolved

Transcript:
${input.transcript}`;

  return runTool("meeting-summarizer", input, prompt);
};

export const runDocWriter = async (input: { code_or_process: string; doc_type: string }) => {
  const limitCheck = await checkToolLimit();
  if (!limitCheck.allowed) return { success: false, error: "Monthly tool limit reached. Upgrade to Pro for unlimited access." };

  const prompt = `Write clear ${input.doc_type} documentation for the following code or process. Use proper formatting with headings, and include usage examples where relevant.

Content to document:
${input.code_or_process}`;

  return runTool("doc-writer", input, prompt);
};