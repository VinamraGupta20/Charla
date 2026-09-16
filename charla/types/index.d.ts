

interface CreateCompanion {
  name: string;
  subject: string;
  topic: string;
  voice: string;
  style: string;
  duration: number;
}

interface Companion extends CreateCompanion {
  id: string;
  author: string;
  created_at: string;
}

interface GetAllCompanions {
  limit?: number;
  page?: number;
  subject?: string;
  topic?: string;
}

interface SavedMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface CompanionComponentProps {
  companionId: string;
  subject: string;
  topic: string;
  name: string;
  userName: string;
  userImage: string;
  voice: string;
  style: string;
}

// ── Tools ──
interface ToolUsage {
  id: string;
  user_id: string;
  tool_name: string;
  input: Record<string, any>;
  output: string;
  created_at: string;
}

type ToolName =
  | "ats-scanner"
  | "resume-builder"
  | "cover-letter"
  | "jd-decoder"
  | "linkedin-bio"
  | "salary-coach"
  | "cold-outreach"
  | "skill-gap"
  | "paper-explainer"
  | "assignment-planner"
  | "plagiarism-rewriter"
  | "email-draft"
  | "code-reviewer"
  | "meeting-summarizer"
  | "doc-writer";

// ── Session Insights (NEW this week) ──
interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface SessionInsights {
  summary: string;
  struggled_with: string[];
  quiz: QuizQuestion[];
  next_topic: string;
}

interface SessionHistory {
  id: string;
  companion_id: string;
  user_id: string;
  transcript: SavedMessage[];
  insights: SessionInsights | null;
  created_at: string;
  companions?: Companion;
}