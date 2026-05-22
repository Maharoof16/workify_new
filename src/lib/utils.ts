import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeAgo(date: string) {
  const now = Date.now();
  const diff = now - new Date(date).getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just Now";

  if (minutes < 60) {
    return `${minutes} Minute${minutes > 1 ? "s" : ""} Ago`;
  }

  if (hours < 24) {
    return `${hours} Hour${hours > 1 ? "s" : ""} Ago`;
  }

  return `${days} Day${days > 1 ? "s" : ""} Ago`;
}

export function formatDuration(duration?: number) {
  if (!duration) return "-";

  const totalMinutes = Math.floor(duration / 1000 / 60);

  const h = Math.floor(totalMinutes / 60);

  const m = totalMinutes % 60;

  return `${h}h ${m}m`;
}
