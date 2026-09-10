import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subjectColors } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: string) => {
  return subjectColors[subject] || "#a09fa8";
};

export const configureAssistant = (voice: string, style: string) => {
  const voiceId =
    voice === "male"
      ? style === "formal"
        ? "en-US-terrell"
        : "en-US-ryan"
      : style === "formal"
        ? "en-US-sarah"
        : "en-US-emma";

  const vapiAssistant = {
    name: "Companion",
    firstMessage:
      "Hello, let's start the session. Today we'll be talking about {{topic}}.",
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },
    voice: {
      provider: "vapi",
      voiceId: voiceId,
    },
    model: {
      provider: "google",
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `You are a highly knowledgeable tutor teaching a real-time voice session with a student. Your goal is to teach the student about the topic and subject.

          Tutor Guidelines:
          Stick to the given topic - {{ topic }} and subject - {{ subject }} and teach the student about it.
          Keep the conversation flowing smoothly while maintaining control.
          From time to time make sure that the student is following you and understands you.
          Break down the topic into smaller parts and teach the student one part at a time.
          Keep your style of conversation {{ style }}.
          Keep your responses short, like in a real voice conversation.
          Do not include any special characters in your responses - this is a voice conversation.
          `,
        },
      ],
    },
    clientMessages: [],
    serverMessages: [],
  };

  return vapiAssistant;
};