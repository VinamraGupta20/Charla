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