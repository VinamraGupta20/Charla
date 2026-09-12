
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
          maxOutputTokens: 2000,
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

// ============================================================
// Save every tool run to the database
// ============================================================
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

// ============================================================
// 1. ATS Scanner
// ============================================================
export const runATSScanner = async (input: { resume: string; job_description: string }) => {
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

// ============================================================
// 2. Resume Builder
// ============================================================
export const runResumeBuilder = async (input: {
  full_name: string; email: string; phone: string; location: string;
  summary: string; experience: string; education: string; skills: string;
}) => {
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

// ============================================================
// 3. Cover Letter Generator
// ============================================================
export const runCoverLetter = async (input: {
  resume: string; job_description: string; company_name: string; tone: string;
}) => {
  const prompt = `Write a tailored, human-sounding cover letter for ${input.company_name} in a ${input.tone} tone. Base it on the candidate's resume and the job description below. Keep it to 3-4 short paragraphs, avoid generic filler phrases, and highlight the most relevant experience.

Resume / Background:
${input.resume}

Job Description:
${input.job_description}`;

  return runTool("cover-letter", input, prompt);
};

// ============================================================
// 4. JD Decoder
// ============================================================
export const runJDDecoder = async (input: { job_description: string }) => {
  const prompt = `Analyze this job description and decode what the employer actually wants. Provide:

1. **Must-Have Requirements**
2. **Nice-to-Haves**
3. **Hidden Requirements / Red Flags** — things implied but not stated directly
4. **Company Culture Signals** — what the wording suggests about the work environment

Job Description:
${input.job_description}`;

  return runTool("jd-decoder", input, prompt);
};

// ============================================================
// 5. LinkedIn Bio Writer
// ============================================================
export const runLinkedInBio = async (input: {
  current_role: string; target_role: string; experience: string; achievements: string;
}) => {
  const prompt = `Write a compelling LinkedIn headline and About section for someone transitioning from "${input.current_role}" to "${input.target_role}". Make the headline punchy (under 220 characters) and the About section 3 short paragraphs, written in first person, highlighting the experience and achievements below.

Experience: ${input.experience}
Achievements: ${input.achievements}`;

  return runTool("linkedin-bio", input, prompt);
};

// ============================================================
// 6. Salary Coach
// ============================================================
export const runSalaryCoach = async (input: {
  role: string; current_offer: string; target_salary: string;
  experience_years: string; location: string;
}) => {
  const prompt = `You are a salary negotiation coach. The candidate has been offered ${input.current_offer} for a ${input.role} role in ${input.location} with ${input.experience_years} of experience, and wants to negotiate toward ${input.target_salary}. Provide:

1. **Negotiation Strategy** — overall approach
2. **Exact Script** — word-for-word phrases to use in the negotiation call/email
3. **Counter-Offer Range** — a realistic range to counter with
4. **Fallback Position** — what to accept if they push back`;

  return runTool("salary-coach", input, prompt);
};

// ============================================================
// 7. Cold Outreach Writer
// ============================================================
export const runColdOutreach = async (input: {
  your_name: string; your_role: string; target_name: string;
  target_company: string; purpose: string; context: string;
}) => {
  const prompt = `Write a short, personalized cold outreach message from ${input.your_name} (${input.your_role}) to ${input.target_name} at ${input.target_company}. Purpose: ${input.purpose}. Context/hook: ${input.context}. Write both an email version and a shorter LinkedIn DM version. Keep it concise, warm, and not salesy.`;

  return runTool("cold-outreach", input, prompt);
};

// ============================================================
// 8. Skill Gap Analyzer
// ============================================================
export const runSkillGapAnalyzer = async (input: {
  current_skills: string; target_role: string; experience_years: string; timeline: string;
}) => {
  const prompt = `Compare the candidate's current skills against what's typically required for a "${input.target_role}" role. They have ${input.experience_years || "unspecified"} experience and a ${input.timeline || "flexible"} timeline. Provide:

1. **Skills You Already Have** that transfer well
2. **Critical Gaps** — skills missing that are essential for the target role
3. **Learning Roadmap** — a step-by-step plan broken into phases matching their timeline
4. **Recommended Resources** — types of resources to use (courses, projects, certifications)

Current Skills & Experience:
${input.current_skills}`;

  return runTool("skill-gap", input, prompt);
};