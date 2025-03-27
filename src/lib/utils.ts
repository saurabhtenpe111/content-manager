
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// This is a utility function for merging class names with tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
