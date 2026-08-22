import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subjectColors } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: string) => {
  return subjectColors[subject] || "#a09fa8";
};