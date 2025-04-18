import { type ClassValue, clsx } from "clsx";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";
import { committees } from "@/data/committees";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToDate = (
  date?: Timestamp | Date | { seconds: number; nanoseconds: number } | string,
) => {
  if (!date) return new Date();

  if (typeof date === "string") {
    return new Date(date);
  }

  if (date instanceof Timestamp) {
    return date.toDate();
  }
  if (date instanceof Date) {
    return date;
  }
  return new Date(date.seconds * 1000);
};

export const formatDate = (
  date: Timestamp | Date | { seconds: number; nanoseconds: number },
) => {
  const convertedToDate = convertToDate(date);

  return convertedToDate.toLocaleString("sv-SE", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getCommittee = (committeeId: keyof typeof committees) => {
  return committees[committeeId];
};
