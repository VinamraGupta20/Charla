// ============================================================
// PASTE THIS FILE AT: constants/index.ts
// ============================================================

export const subjects = [
  "maths",
  "science",
  "language",
  "history",
  "coding",
  "economics",
];

export const subjectColors: Record<string, string> = {
  maths: "#e8a838",
  science: "#9b7cf4",
  language: "#4da6e8",
  history: "#e8834a",
  coding: "#e86c8a",
  economics: "#3ecf8e",
};

export const voices = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const styles = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
];

export const tools = [
  {
    id: "ats-scanner",
    label: "ATS Scanner",
    icon: "📊",
    category: "career",
    href: "/tools/ats-scanner",
    description: "Score your resume against any job description.",
  },
  {
    id: "resume-builder",
    label: "Resume Builder",
    icon: "📝",
    category: "career",
    href: "/tools/resume-builder",
    description: "Build a polished resume through a simple form.",
  },
  {
    id: "cover-letter",
    label: "Cover Letter",
    icon: "✉️",
    category: "career",
    href: "/tools/cover-letter",
    description: "Generate a tailored cover letter for any job.",
  },
  {
    id: "jd-decoder",
    label: "JD Decoder",
    icon: "🔍",
    category: "career",
    href: "/tools/jd-decoder",
    description: "Decode what a job description really wants.",
  },
  {
    id: "linkedin-bio",
    label: "LinkedIn Bio Writer",
    icon: "💼",
    category: "career",
    href: "/tools/linkedin-bio",
    description: "Rewrite your LinkedIn headline and summary.",
  },
  {
    id: "salary-coach",
    label: "Salary Coach",
    icon: "💰",
    category: "career",
    href: "/tools/salary-coach",
    description: "Get negotiation scripts and counter-offer ranges.",
  },
  {
    id: "cold-outreach",
    label: "Cold Outreach",
    icon: "📬",
    category: "career",
    href: "/tools/cold-outreach",
    description: "Write personalized recruiter outreach messages.",
  },
  {
    id: "skill-gap",
    label: "Skill Gap Analyzer",
    icon: "🎯",
    category: "career",
    href: "/tools/skill-gap",
    description: "Compare your skills vs a target role.",
  },
];