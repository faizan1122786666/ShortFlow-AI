import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    publishing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    published: "bg-green-500/20 text-green-400 border-green-500/30",
    failed: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return colors[status] ?? colors.draft;
}

export function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    youtube: "YouTube Shorts",
    tiktok: "TikTok",
  };
  return labels[platform] ?? platform;
}
